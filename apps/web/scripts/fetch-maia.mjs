// Downloads the Maia-3 model the opponent plays with into models/, where src/engine/maia.ts
// imports it. It's kept out of git and published as a GitHub release (made with
// tools/maia/export_onnx.py), so changing the model is a new release and a new URL and
// checksum here. Maia-3 is AGPL-3.0; the release notes link its source.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const URL =
  "https://github.com/BillyBobFry/chess-teacher/releases/download/maia3-5m-int8-v1/maia3-5m-int8.onnx";
const SHA256 = "787c7e4debcb6ddfa2b89a223416c73855762b8b3b51d7499de1cc01930d6cf9";

const dir = join(import.meta.dirname, "..", "models");
const file = join(dir, "maia3-5m-int8.onnx");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

if (existsSync(file) && sha256(readFileSync(file)) === SHA256) process.exit(0);

const response = await fetch(URL);
if (!response.ok) throw new Error(`Couldn't download the Maia model (${response.status}) from ${URL}`);
const bytes = new Uint8Array(await response.arrayBuffer());
const got = sha256(bytes);
if (got !== SHA256) throw new Error(`The Maia model from ${URL} has SHA-256 ${got}, not ${SHA256}`);
mkdirSync(dir, { recursive: true });
// Written whole, then renamed, so an interrupted download never leaves a broken model behind.
writeFileSync(`${file}.partial`, bytes);
renameSync(`${file}.partial`, file);
console.log(`Maia model downloaded to models/ (${(bytes.byteLength / 1e6).toFixed(1)} MB)`);
