"""Convert a Maia-3 checkpoint to an 8-bit ONNX model for the browser, and check it against PyTorch.

8-bit weights make the model 6.8 MB instead of 21 MB (5.3 MB gzipped instead of 19), run as
fast in ONNX Runtime Web, and pick the same move as the full model in almost every position.

Usage (see README.md): python export_onnx.py <maia3 repo> <maia3-5m.pt> <out.onnx>
"""

import random
import sys
import tempfile
from argparse import Namespace
from collections import deque

maia_repo, checkpoint, out_path = sys.argv[1:4]
sys.path.insert(0, maia_repo)

import chess  # noqa: E402
import numpy as np  # noqa: E402
import onnxruntime as ort  # noqa: E402
import torch  # noqa: E402
import torch.nn as nn  # noqa: E402
from onnxruntime.quantization import QuantType, quantize_dynamic  # noqa: E402
from maia3.dataset import get_historical_tokens, get_legal_moves_mask, tokenize_board  # noqa: E402
from maia3.model_registry import resolve_model_spec  # noqa: E402
from maia3.uci import load_model  # noqa: E402
from maia3.utils import get_all_possible_moves  # noqa: E402

cfg = Namespace(**resolve_model_spec("maia3-5m").config)
cfg.device = "cpu"
cfg.checkpoint_path = checkpoint
cfg.trust_checkpoint = False


class PlainRMSNorm(nn.Module):
    """RMSNorm from basic operations: opset 17 has no RMSNormalization, and older ONNX
    Runtime Web builds don't run it."""

    def __init__(self, ref: nn.RMSNorm):
        super().__init__()
        self.weight = ref.weight
        self.eps = ref.eps if ref.eps is not None else torch.finfo(torch.float32).eps

    def forward(self, x):
        return x * torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + self.eps) * self.weight


def swap_rms_norms(module: nn.Module) -> None:
    for name, child in module.named_children():
        if isinstance(child, nn.RMSNorm):
            setattr(module, name, PlainRMSNorm(child))
        else:
            swap_rms_norms(child)


class MovesAndValue(nn.Module):
    """The network without its time head, taking only the 12 × history piece planes."""

    def __init__(self, model):
        super().__init__()
        self.model = model

    def forward(self, tokens, self_elo, oppo_elo):
        move, value, _ = self.model(tokens, self_elo, oppo_elo)
        return move, value


reference = load_model(cfg)
model = load_model(cfg)
swap_rms_norms(model)
export = MovesAndValue(model).eval()

full_path = f"{tempfile.mkdtemp()}/maia3-full.onnx"
elo = torch.full((1,), 1500.0)
batch = {0: "batch"}
torch.onnx.export(
    export,
    (torch.zeros(1, 64, 12 * cfg.history), elo, elo),
    full_path,
    input_names=["tokens", "self_elo", "oppo_elo"],
    output_names=["move_logits", "value_logits"],
    dynamic_axes={name: batch for name in ("tokens", "self_elo", "oppo_elo", "move_logits", "value_logits")},
    opset_version=17,
    dynamo=False,
)

quantize_dynamic(full_path, out_path, weight_type=QuantType.QInt8)


def probabilities(logits):
    p = np.exp(logits - logits.max())
    return p / p.sum()


# Compare both against the unmodified PyTorch model on positions from random games.
sessions = {"full": ort.InferenceSession(full_path), "8-bit": ort.InferenceSession(out_path)}
index = {m: i for i, m in enumerate(get_all_possible_moves())}
random.seed(1)
worst = 0.0
agree = {name: 0 for name in sessions}
distance = []
total = 0
for _ in range(100):
    board = chess.Board()
    history = deque([tokenize_board(board)], maxlen=cfg.history)
    for _ in range(random.randint(1, 60)):
        moves = list(board.legal_moves)
        if not moves:
            break
        board.push(random.choice(moves))
        history.append(tokenize_board(board))
    if board.is_game_over():
        continue
    tokens = get_historical_tokens(history, cfg, 0, 0, 0, 0)[:, : 12 * cfg.history].unsqueeze(0)
    legal = get_legal_moves_mask(board, index).numpy()
    for self_elo, oppo_elo in ((600, 600), (1500, 1700), (2200, 1100)):
        with torch.no_grad():
            expected = reference(tokens, torch.tensor([self_elo]), torch.tensor([oppo_elo]))[0][0].numpy()[legal]
        feeds = {
            "tokens": tokens.numpy(),
            "self_elo": np.array([self_elo], np.float32),
            "oppo_elo": np.array([oppo_elo], np.float32),
        }
        got = {name: s.run(["move_logits"], feeds)[0][0][legal] for name, s in sessions.items()}
        worst = max(worst, float(np.abs(expected - got["full"]).max()))
        for name, logits in got.items():
            agree[name] += int(np.argmax(expected) == np.argmax(logits))
        # Maia samples its move, so how far the 8-bit probabilities move matters, not just the top move.
        distance.append(0.5 * np.abs(probabilities(expected) - probabilities(got["8-bit"])).sum())
        total += 1

print(f"full ONNX: largest logit difference {worst:.1e}; same top move in {agree['full']}/{total} positions")
print(
    f"8-bit ({out_path}): same top move in {agree['8-bit']}/{total} positions; "
    f"move probabilities differ by {np.mean(distance):.1%} on average (at most {np.max(distance):.1%})"
)
if agree["full"] != total or worst > 1e-3:
    sys.exit("ONNX model disagrees with PyTorch")
if agree["8-bit"] < 0.95 * total or np.mean(distance) > 0.03:
    sys.exit("8-bit model strays too far from PyTorch")
