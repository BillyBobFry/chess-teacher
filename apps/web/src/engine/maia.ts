/**
 * The Maia-3 network that plays the opponent's normal moves (5M parameters, 8-bit weights,
 * 6.8 MB), run in its own Web Worker (maia.worker.ts). One network serves every rating: the
 * rating is an input, so changing it costs nothing.
 */

import type { MaiaNetwork } from "@chess-teacher/engine";
// Through Vite, so the model is a hashed asset, cached for good (scripts/fetch-maia.mjs fetches it).
import MODEL from "../../models/maia3-5m-int8.onnx?url";

export type MaiaRequest =
  | { type: "load"; url: string }
  | { type: "run"; id: number; tokens: Float32Array; selfElo: number; oppoElo: number };

export type MaiaResponse =
  | { type: "loaded" }
  | { type: "result"; id: number; logits: Float32Array }
  | { type: "error"; id: number | null; message: string };

/** The opponent's network couldn't be downloaded or started. */
export class OpponentLoadError extends Error {}

export async function startMaiaNetwork(): Promise<MaiaNetwork> {
  const worker = new Worker(new URL("./maia.worker.ts", import.meta.url), { type: "module" });
  const pending = new Map<number, { resolve: (l: Float32Array) => void; reject: (e: Error) => void }>();
  let nextId = 0;
  let onLoaded: ((err: Error | null) => void) | null = null;

  worker.onmessage = (e: MessageEvent<MaiaResponse>) => {
    const msg = e.data;
    if (msg.type === "loaded") {
      onLoaded?.(null);
    } else if (msg.type === "result") {
      pending.get(msg.id)?.resolve(msg.logits);
      pending.delete(msg.id);
    } else if (msg.id === null) {
      onLoaded?.(new OpponentLoadError(msg.message));
    } else {
      pending.get(msg.id)?.reject(new Error(msg.message));
      pending.delete(msg.id);
    }
  };

  try {
    await new Promise<void>((resolve, reject) => {
      onLoaded = (err) => (err ? reject(err) : resolve());
      worker.onerror = () => reject(new OpponentLoadError("Maia's worker failed to start"));
      worker.postMessage({ type: "load", url: MODEL } satisfies MaiaRequest);
    });
  } catch (err) {
    worker.terminate();
    throw err;
  }

  return {
    run: (tokens, selfElo, oppoElo) =>
      new Promise<Float32Array>((resolve, reject) => {
        const id = nextId++;
        pending.set(id, { resolve, reject });
        worker.postMessage({ type: "run", id, tokens, selfElo, oppoElo } satisfies MaiaRequest, [
          tokens.buffer,
        ]);
      }),
    close: () => worker.terminate(),
  };
}
