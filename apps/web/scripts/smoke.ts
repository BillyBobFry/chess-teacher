/**
 * Browser smoke test: builds nothing, serves dist/ with `vite preview`, and drives the app
 * in headless Chromium.
 *   1. Start a game, play 1. e4 by clicking squares, wait for the opponent's reply.
 *   2. Load a recorded game at the moment a lesson triggers: find-the-cause (wrong guess →
 *      hint, then the right answer), the explanation, stepping through the futures, rewind.
 *   3. Load a finished game: the review.
 * Screenshots go to the directory given as the first argument.
 *
 * Usage: pnpm build && npx tsx scripts/smoke.ts <screenshot-dir> [--scale 2]
 */

import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import {
  finish,
  newSession,
  opponentMove,
  startUserTurn,
  userMove,
  DEFAULT_CONFIG,
  type Engines,
  type SessionState,
} from "@chess-teacher/core";
import { RecordedEngine, type RecordedCall } from "@chess-teacher/engine";
// Playwright is pre-installed globally in CI/dev containers rather than a project dependency.
import type { BrowserType, Page, devices as Devices } from "playwright";

const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright") as { chromium: BrowserType; devices: typeof Devices };

const outDir = process.argv[2] ?? "screenshots";
const scale = process.argv.includes("--scale")
  ? Number(process.argv[process.argv.indexOf("--scale") + 1])
  : 1;
mkdirSync(outDir, { recursive: true });

// ---- recorded game states, from the parity fixtures

interface Fixture {
  userColour: "w" | "b";
  depth: number;
  config: Record<string, unknown>;
  steps: { type: string; move?: string }[];
  engineCalls: { analyst: RecordedCall[]; weak: RecordedCall[] };
}

async function recordedStates(file: string) {
  const fx = JSON.parse(
    readFileSync(join(import.meta.dirname, "../../../tools/sim/fixtures", file), "utf8"),
  ) as Fixture;
  const engines: Engines = {
    analyst: new RecordedEngine(fx.engineCalls.analyst),
    weak: new RecordedEngine(fx.engineCalls.weak),
  };
  let state: SessionState = newSession({
    userColour: fx.userColour,
    config: { ...DEFAULT_CONFIG, ...fx.config, analysisDepth: fx.depth },
  });
  let atTrigger: { state: SessionState; lessonId: number } | null = null;
  for (const step of fx.steps) {
    if (step.type === "startUserTurn") state = (await startUserTurn(state, engines)).state;
    else if (step.type === "userMove") state = (await userMove(state, step.move!, engines)).state;
    else {
      const r = await opponentMove(state, engines);
      state = r.state;
      const t = r.events.find(
        (e) => e.kind === "triggered" && !state.lessons.find((l) => l.id === e.lessonId)!.deferred,
      );
      if (t && !atTrigger) atTrigger = { state, lessonId: t.lessonId };
    }
  }
  return { atTrigger: atTrigger!, finished: finish(state) };
}

const saved = (state: SessionState, extra: object) => ({
  version: 1,
  state,
  opponentSkill: 3,
  reveal: null,
  finished: false,
  ...extra,
});

// ---- server

async function startServer(): Promise<{ url: string; stop: () => void }> {
  const vite = join(import.meta.dirname, "..", "node_modules", "vite", "bin", "vite.js");
  const proc = spawn(process.execPath, [vite, "preview", "--port", "4173", "--strictPort"], {
    cwd: join(import.meta.dirname, ".."),
    stdio: ["ignore", "pipe", "pipe"],
  });
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("vite preview did not start")), 20_000);
    proc.stdout.on("data", (d: Buffer) => {
      if (d.toString().includes("4173")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
  return { url: "http://localhost:4173/app/", stop: () => proc.kill() };
}

// ---- run

const { atTrigger, finished } = await recordedStates("game-01.json");
const server = await startServer();
const browser = await chromium.launch();
const errors: string[] = [];
let failed = false;

/** Wait until the first move row has both White's and Black's moves. */
const opponentReplied = (page: Page) =>
  page.waitForFunction(
    () => (document.querySelectorAll(".moves li span")[2]?.textContent ?? "").length > 0,
    null,
    {
      timeout: 60_000,
    },
  );

async function step(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    failed = true;
    console.log(`✗ ${name}: ${e instanceof Error ? e.message.split("\n")[0] : e}`);
  }
}

try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 860 },
    deviceScaleFactor: scale,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const shot = (name: string, full = false) =>
    page.screenshot({ path: join(outDir, `${name}.png`), fullPage: full });

  await step("new game screen", async () => {
    await page.goto(server.url);
    await page.getByRole("heading", { name: "Learn from your own mistakes" }).waitFor();
    await shot("1-new-game");
  });

  await step("start a game and play 1. e4", async () => {
    await page.getByRole("button", { name: "Start game" }).click();
    await page.getByRole("status").filter({ hasText: "Your move" }).waitFor({ timeout: 60_000 });
    await page.locator("#main-square-e2").click();
    await page.locator("#main-square-e4").click();
    await opponentReplied(page);
    await page.getByRole("status").filter({ hasText: "Your move" }).waitFor({ timeout: 30_000 });
    await shot("2-game");
  });

  await step("resume after reload", async () => {
    await page.reload();
    await opponentReplied(page);
  });

  const lesson = atTrigger.state.lessons.find((l) => l.id === atTrigger.lessonId)!;
  await step("reveal: find the cause", async () => {
    await page.evaluate(
      (g) => localStorage.setItem("chess-teacher/game/v1", JSON.stringify(g)),
      saved(atTrigger.state, { reveal: { lessonId: lesson.id, step: "find", attempts: 0, wrong: [] } }),
    );
    await page.reload();
    await page.getByText("Can you find the move that caused it?").waitFor();
    await shot("3-reveal-find");
    const choices = page.locator(".choice");
    const labels = await choices.allTextContents();
    const wrong = labels.findIndex((l) => !l.endsWith(` ${lesson.userMove}`) && l !== labels.at(-1));
    await choices.nth(wrong === -1 ? 0 : wrong).click();
    await page.getByText(/^Hint:/).waitFor();
    await shot("4-reveal-hint");
  });

  await step("reveal: explanation and futures", async () => {
    await page.getByRole("button", { name: "Show me the answer" }).click();
    await page.getByText("What was better").first().waitFor();
    await page.getByRole("button", { name: "Forward" }).click();
    await page.getByRole("button", { name: "Forward" }).click();
    await shot("5-reveal-explain", true);
  });

  await step("rewind to before the mistake", async () => {
    await page.getByRole("button", { name: /^Rewind to before/ }).click();
    await page.getByRole("status").filter({ hasText: "Your move" }).waitFor({ timeout: 60_000 });
    const moves = await page.locator(".moves li").count();
    if (moves !== Math.ceil(lesson.ply / 2))
      throw new Error(`expected ${Math.ceil(lesson.ply / 2)} move rows, got ${moves}`);
    await shot("6-after-rewind");
  });

  await step("review", async () => {
    await page.evaluate(
      (g) => localStorage.setItem("chess-teacher/game/v1", JSON.stringify(g)),
      saved(finished, { finished: true }),
    );
    await page.reload();
    await page.getByRole("heading", { name: "Game review" }).waitFor();
    await page.locator(".review-item").first().click();
    await shot("7-review", true);
  });

  await step("licences", async () => {
    await page.getByRole("button", { name: "Licences" }).click();
    await page.getByRole("heading", { name: "Licences" }).waitFor();
  });

  const phone = await browser.newContext({ ...devices["iPhone 13"] });
  const mobile = await phone.newPage();
  mobile.on("pageerror", (e) => errors.push(e.message));
  await step("phone layout", async () => {
    await mobile.goto(server.url);
    await mobile.evaluate(
      (g) => localStorage.setItem("chess-teacher/game/v1", JSON.stringify(g)),
      saved(atTrigger.state, { reveal: { lessonId: lesson.id, step: "explain", attempts: 1, wrong: [] } }),
    );
    await mobile.reload();
    await mobile.getByText("What was better").first().waitFor();
    await mobile.screenshot({ path: join(outDir, "8-phone-reveal.png"), fullPage: true });
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) throw new Error("horizontal scroll on phone");
  });

  await step("no errors in the console", async () => {
    if (errors.length) throw new Error(errors.join(" | "));
  });
} finally {
  await browser.close();
  server.stop();
}
console.log(`Screenshots: ${outDir}`);
process.exit(failed ? 1 : 0);
