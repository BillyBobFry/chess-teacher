/** Every strategic feature, measured on ~270 positions, must match the Python prototype exactly. */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { Position, hanging, measureAll, settledBalance, squareName, type Colour } from "@chess-teacher/core";
import { FIXTURES } from "./fixtures.ts";

interface Row {
  fen: string;
  w: { features: Record<string, [number, string]>; hanging: string[]; settled: number };
  b: { features: Record<string, [number, string]>; hanging: string[]; settled: number };
}

const rows = JSON.parse(readFileSync(join(FIXTURES, "features.json"), "utf8")) as Row[];

describe("feature parity with the Python prototype", () => {
  it(`covers ${rows.length} positions`, () => expect(rows.length).toBeGreaterThan(200));

  for (const colour of ["w", "b"] as Colour[]) {
    it(`matches every feature for ${colour === "w" ? "white" : "black"}`, () => {
      const mismatches: string[] = [];
      for (const row of rows) {
        const pos = new Position(row.fen);
        const expected = row[colour];
        const actual = measureAll(pos, colour);
        for (const [name, value] of Object.entries(expected.features)) {
          const got = actual[name as keyof typeof actual];
          if (JSON.stringify(got) !== JSON.stringify(value)) {
            mismatches.push(
              `${row.fen} ${name}: expected ${JSON.stringify(value)}, got ${JSON.stringify(got)}`,
            );
          }
        }
        const hang = hanging(pos, colour).map(squareName);
        if (JSON.stringify(hang) !== JSON.stringify(expected.hanging)) {
          mismatches.push(`${row.fen} hanging: expected ${expected.hanging}, got ${hang}`);
        }
        const settled = settledBalance(row.fen, colour);
        if (settled !== expected.settled) {
          mismatches.push(`${row.fen} settled: expected ${expected.settled}, got ${settled}`);
        }
      }
      expect(mismatches.slice(0, 10)).toEqual([]);
    });
  }
});
