import { readFileSync } from "node:fs";
import { FEATURES, Position, settledBalance } from "@chess-teacher/core";

const rows = JSON.parse(readFileSync(new URL("../fixtures/features.json", import.meta.url), "utf8")) as {
  fen: string;
}[];
const time = (label: string, fn: () => void) => {
  const t = performance.now();
  fn();
  console.log(`${label.padEnd(16)} ${((performance.now() - t) / rows.length).toFixed(2)} ms/position`);
};
time("settledBalance", () => rows.forEach((r) => settledBalance(r.fen, "w")));
for (const f of FEATURES.filter((f) => f.name !== "material")) {
  time(f.name, () => rows.forEach((r) => f.measure(new Position(r.fen), "w")));
}
