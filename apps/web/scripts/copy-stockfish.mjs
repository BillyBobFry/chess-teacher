// Copies the Stockfish WASM "lite, single-threaded" build into public/ so it's served
// next to the app. Stockfish is GPL-3.0: its licence ships alongside it, and the app's
// Licences screen links to the source.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const pkg = dirname(require.resolve("stockfish/package.json"));
const out = join(import.meta.dirname, "..", "public", "stockfish");
mkdirSync(out, { recursive: true });
for (const f of ["stockfish-19-lite-single.js", "stockfish-19-lite-single.wasm"]) {
  copyFileSync(join(pkg, "bin", f), join(out, f));
}
copyFileSync(join(pkg, "Copying.txt"), join(out, "COPYING.txt"));
console.log(`Stockfish copied to ${out}`);
