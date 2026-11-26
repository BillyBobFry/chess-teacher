# Maia-3 in the browser

[Maia-3](https://github.com/CSSLab/maia3) (AGPL-3.0) predicts the move a human of a given
rating would play. The web app's opponent plays its normal moves with the 5M-parameter model
(architecture D16), run by ONNX Runtime Web in a Web Worker
(`apps/web/src/engine/maia.worker.ts`).

Maia ships PyTorch weights only, so they are converted here, once, to ONNX with 8-bit weights
(6.8 MB instead of 21 MB, as fast, and nearly always the same move). The result isn't in git:
it's published as a GitHub release, and `apps/web/scripts/fetch-maia.mjs` downloads it before
`dev` and `build` and checks its SHA-256.

## Change the model

Needs Python 3.10 or later.

```bash
git clone https://github.com/CSSLab/maia3.git /tmp/maia3
python3 -m venv /tmp/maia-venv
/tmp/maia-venv/bin/pip install torch numpy chess onnx onnxruntime onnxscript
curl -L -o /tmp/maia3-5m.pt https://huggingface.co/UofTCSSLab/Maia3-5M/resolve/main/maia3-5m.pt
/tmp/maia-venv/bin/python tools/maia/export_onnx.py /tmp/maia3 /tmp/maia3-5m.pt /tmp/maia3-5m-int8.onnx
```

The export compares the ONNX models with PyTorch on positions from random games, and fails
if the full model differs or the 8-bit one strays too far. A bigger model needs its
architecture preset in `export_onnx.py` (it reads `maia3-5m`'s).

Then publish it as a new release (a new tag, so older commits still build), and point
`fetch-maia.mjs` at it with the new file's SHA-256:

```bash
gh release create maia3-5m-int8-v2 /tmp/maia3-5m-int8.onnx --prerelease --latest=false \
  --title "Maia-3 model for the browser opponent (5M, 8-bit)" --notes "..."
shasum -a 256 /tmp/maia3-5m-int8.onnx
```

The current release, `maia3-5m-int8-v1`, was converted from CSSLab/maia3 at commit `1e13597`.

## Encoding fixtures

`packages/engine/test/fixtures/maia-encoding.json` records how Maia's own code encodes
positions and moves; `packages/engine/test/maia.test.ts` checks the TypeScript encoder
against it. Re-record only if Maia's encoding changes:

```bash
/tmp/maia-venv/bin/python tools/maia/record_encoding.py /tmp/maia3 packages/engine/test/fixtures/maia-encoding.json
```
