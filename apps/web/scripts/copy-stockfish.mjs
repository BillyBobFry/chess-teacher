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

// Stockfish 11: its classical evaluation gives the term-by-term second opinion on strategic
// lessons (packages/core/src/validate.ts). Loaded only when first needed.
const sf11 = dirname(require.resolve("stockfish11/package.json"));
const out11 = join(import.meta.dirname, "..", "public", "stockfish11");
mkdirSync(out11, { recursive: true });
for (const f of ["stockfish.js", "stockfish.wasm"]) copyFileSync(join(sf11, "src", f), join(out11, f));
copyFileSync(join(sf11, "Copying.txt"), join(out11, "COPYING.txt"));
console.log(`Stockfish 19 and 11 copied to public/`);
