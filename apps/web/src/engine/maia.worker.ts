/**
 * Runs the Maia-3 network with ONNX Runtime's WebAssembly backend, off the main thread.
 * Single-threaded: multi-threaded WASM needs cross-origin isolation (COOP/COEP headers),
 * which the app avoids (architecture §6), and one prediction per move doesn't need it.
 */

import * as ort from "onnxruntime-web/wasm";
import wasmUrl from "onnxruntime-web/ort-wasm-simd-threaded.wasm?url";
import type { MaiaRequest, MaiaResponse } from "./maia.ts";

ort.env.wasm.numThreads = 1;
// Through Vite, so the 15 MB runtime is a hashed asset (cached for good) in dev and build alike.
ort.env.wasm.wasmPaths = { wasm: wasmUrl };

let session: Promise<ort.InferenceSession> | null = null;

const reply = (message: MaiaResponse, transfer: Transferable[] = []): void =>
  (self as unknown as Worker).postMessage(message, transfer);

async function load(url: string): Promise<ort.InferenceSession> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Maia's model wasn't found (${response.status})`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  return ort.InferenceSession.create(bytes, { executionProviders: ["wasm"] });
}

self.onmessage = async (e: MessageEvent<MaiaRequest>) => {
  const msg = e.data;
  try {
    if (msg.type === "load") {
      session = load(msg.url);
      await session;
      reply({ type: "loaded" });
      return;
    }
    if (!session) throw new Error("Maia's network isn't loaded");
    const out = await (
      await session
    ).run({
      tokens: new ort.Tensor("float32", msg.tokens, [1, 64, msg.tokens.length / 64]),
      self_elo: new ort.Tensor("float32", Float32Array.from([msg.selfElo]), [1]),
      oppo_elo: new ort.Tensor("float32", Float32Array.from([msg.oppoElo]), [1]),
    });
    const logits = out["move_logits"]?.data;
    if (!(logits instanceof Float32Array)) throw new Error("Maia returned no move logits");
    reply({ type: "result", id: msg.id, logits }, [logits.buffer]);
  } catch (err) {
    reply({ type: "error", id: msg.type === "run" ? msg.id : null, message: String(err) });
  }
};
