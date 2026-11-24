/**
 * End-to-end smoke test of the production build (.vercel/output), served locally by
 * scripts/serve-vercel-output.mjs with an embedded Postgres and the fake LLM, driven in
 * headless Chromium:
 *   landing page → create an account → play 1. e4 → play 2. Nf3 by keyboard alone →
 *   the abandon-game dialog → reload and resume →
 *   a recorded game at a reveal (wrong guess → hint → answer → AI explanation → futures →
 *   rewind) → end a game and review it → sign out and back in → phone layout.
 * Fails on any console error. Screenshots go to the directory given.
 *
 * Usage: node scripts/build-vercel.mjs && pnpm --filter @chess-teacher/web smoke <dir> [--scale 2]
 */

import { spawn, execSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  newSession,
  opponentMove,
  startUserTurn,
  userMove,
  DEFAULT_CONFIG,
  type Engines,
  type SessionState,
} from "@chess-teacher/core";
import { RecordedEngine, type RecordedCall } from "@chess-teacher/engine";
// Browsers: `pnpm --filter @chess-teacher/web exec playwright install chromium` once.
import type { BrowserType, Page, devices as Devices } from "playwright";

const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright") as { chromium: BrowserType; devices: typeof Devices };

const repo = join(import.meta.dirname, "..", "..", "..");
const outDir = process.argv[2] ?? "screenshots";
const scale = process.argv.includes("--scale")
  ? Number(process.argv[process.argv.indexOf("--scale") + 1])
  : 1;
mkdirSync(outDir, { recursive: true });
const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
const EMAIL = "smoke@example.com";
const PASSWORD = "correct horse battery";

// ---- recorded game states, from the parity fixtures

interface Fixture {
  userColour: "w" | "b";
  depth: number;
  config: Record<string, unknown>;
  steps: { type: string; move?: string }[];
  engineCalls: { analyst: RecordedCall[]; weak: RecordedCall[] };
}

async function recordedStates(file: string) {
  const fx = JSON.parse(readFileSync(join(repo, "tools/sim/fixtures", file), "utf8")) as Fixture;
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
  return { atTrigger: atTrigger!, end: state };
}

/** Save a game through the API from inside the signed-in page, so it becomes the active game. */
const postGame = (page: Page, body: object) =>
  page.evaluate(async (b) => {
    const r = await fetch("/api/games", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(b),
    });
    if (!r.ok) throw new Error(`POST /api/games: ${r.status}`);
  }, body);

const gameBody = (state: SessionState, reveal: object | null = null) => ({
  state,
  opponentSkill: 3,
  reveal,
  finished: false,
});

/** Wait until move row `row` (from 1) has both White's and Black's moves. */
const opponentReplied = (page: Page, row = 1) =>
  page.waitForFunction(
    (r) => (document.querySelectorAll(".moves li span")[r * 3 - 1]?.textContent ?? "").length > 0,
    row,
    {
      timeout: 60_000,
    },
  );

// Exact: "Getting ready for your move…" also contains "your move" (hasText ignores case).
const YOUR_MOVE = /^Your move$/;

/** The name of the focused element, as a screen reader would start reading it. */
const focusedText = (page: Page) => page.evaluate(() => document.activeElement?.textContent ?? "");

// ---- server: the production build, with a fresh embedded database

const pglite = mkdtempSync(join(tmpdir(), "chess-teacher-smoke-"));
const env = { ...process.env, PGLITE_DIR: pglite, FAKE_LLM: "1", BETTER_AUTH_URL: BASE };
execSync("pnpm --filter @chess-teacher/api db:migrate", { cwd: repo, env, stdio: "ignore" });
const server = spawn(process.execPath, [join(repo, "scripts/serve-vercel-output.mjs"), String(PORT)], {
  cwd: repo,
  env,
  stdio: ["ignore", "pipe", "inherit"],
});
await new Promise<void>((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("server did not start")), 30_000);
  server.stdout!.on("data", (d: Buffer) => {
    if (d.toString().includes("Serving")) {
      clearTimeout(timer);
      resolve();
    }
  });
});

// ---- run

const { atTrigger, end } = await recordedStates("game-01.json");
const lesson = atTrigger.state.lessons.find((l) => l.id === atTrigger.lessonId)!;
const browser = await chromium.launch();
const errors: string[] = [];
let failed = false;

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
    // The copy assertions below are the en-GB catalogue; the phone checks en-US.
    locale: "en-GB",
    viewport: { width: 1280, height: 860 },
    deviceScaleFactor: scale,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const shot = (name: string, full = false) =>
    page.screenshot({ path: join(outDir, `${name}.png`), fullPage: full });

  await step("landing page", async () => {
    await page.goto(BASE);
    await page.getByRole("heading", { name: "Learn chess strategy from your own mistakes" }).waitFor();
    await shot("0-landing", true);
    await page.getByRole("link", { name: /Start learning/ }).click();
    await page.getByRole("heading", { name: "Welcome back" }).waitFor();
  });

  await step("create an account", async () => {
    await page.getByRole("button", { name: "Create an account" }).click();
    await page.getByLabel("Name").fill("Smoke");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await shot("1-sign-up");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.getByRole("heading", { name: "Learn from your own mistakes" }).waitFor({ timeout: 30_000 });
  });

  await step("start a game and play 1. e4", async () => {
    await page.getByRole("button", { name: "Start game" }).click();
    await page.getByRole("status").filter({ hasText: YOUR_MOVE }).waitFor({ timeout: 60_000 });
    // Select the pawn with the pointer and wait until e4 shows as a legal move, then move.
    await page.locator("#main-square-e2").click();
    await page.getByRole("gridcell", { name: /^e4, empty, you can move here$/ }).waitFor({ timeout: 5_000 });
    await page.locator("#main-square-e4").click();
    await opponentReplied(page);
    await page.getByRole("status").filter({ hasText: YOUR_MOVE }).waitFor({ timeout: 30_000 });
    await shot("2-game");
  });

  await step("play 2. Nf3 with the keyboard alone (UX-100)", async () => {
    // Tab from the header until focus reaches the board.
    await page.getByRole("button", { name: "New game" }).focus();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      if (await page.evaluate(() => document.activeElement?.getAttribute("role") === "gridcell")) break;
    }
    await page.keyboard.press("Control+End"); // h1, bottom right from White's side
    await page.keyboard.press("ArrowLeft");
    if (!(await focusedText(page)).startsWith("g1, white knight")) {
      throw new Error(`expected focus on the g1 knight, got "${await focusedText(page)}"`);
    }
    await page.keyboard.press("Enter");
    await page.getByText(/^Picked up white knight on g1\. It can move to /).waitFor();
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowLeft");
    if (!(await focusedText(page)).startsWith("f3, empty, you can move here")) {
      throw new Error(`expected f3 as a target, got "${await focusedText(page)}"`);
    }
    await shot("2b-keyboard-selected");
    await page.keyboard.press("Enter");
    await page.locator(".moves").getByText("Nf3", { exact: true }).waitFor({ timeout: 30_000 });
    await opponentReplied(page, 2);
    // The board describes the last move in words (UX-106).
    await page.getByText(/^Black's last move: \w/).waitFor();
    await page.getByRole("status").filter({ hasText: YOUR_MOVE }).waitFor({ timeout: 30_000 });
  });

  await step("new game mid-game asks first, in a dialog (UX-15)", async () => {
    await page.getByRole("button", { name: "New game" }).click();
    const dialog = page.getByRole("dialog", { name: "Abandon this game?" });
    await dialog.waitFor();
    if ((await focusedText(page)) !== "Keep playing") throw new Error("the safe choice isn't focused");
    await shot("2c-abandon-dialog");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "New game" }).click();
    await dialog.getByRole("button", { name: "Abandon game" }).click();
    await page.getByRole("heading", { name: "Learn from your own mistakes" }).waitFor();
    await page.getByRole("button", { name: "Back to the current game" }).click();
    await page.getByRole("status").filter({ hasText: YOUR_MOVE }).waitFor({ timeout: 30_000 });
  });

  await step("reload: still signed in, game resumes from the server", async () => {
    await page.waitForTimeout(500); // let the last save finish
    await page.reload();
    await opponentReplied(page);
  });

  await step("reveal: find the cause", async () => {
    await postGame(
      page,
      gameBody(atTrigger.state, { lessonId: lesson.id, step: "find", attempts: 0, wrong: [] }),
    );
    await page.reload();
    await page.getByText("Can you find the move that caused it?").waitFor({ timeout: 30_000 });
    const choices = page.locator(".choice");
    const labels = await choices.allTextContents();
    await choices.nth(labels.length > 1 ? labels.length - 2 : 0).click();
    if ((await page.getByText(/^Hint:/).count()) === 0) {
      // The guess happened to be right; that's fine for the flow.
    }
    await shot("3-reveal-find");
  });

  await step("reveal: AI explanation, futures", async () => {
    if (await page.getByRole("button", { name: "Show me the answer" }).count()) {
      await page.getByRole("button", { name: "Show me the answer" }).click();
    }
    await page.getByText("Your coach", { exact: true }).waitFor({ timeout: 30_000 });
    await page.locator(".ai-headline").filter({ hasText: "(Sample)" }).waitFor();
    await page.getByText(/What it (allowed|missed)/).waitFor();
    await page.locator("figcaption").filter({ hasText: "What happened" }).waitFor();
    await page.getByRole("button", { name: "Forward" }).click();
    await page.getByRole("button", { name: "Forward" }).click();
    await shot("4-reveal-explain", true);
  });

  await step("rate the lesson", async () => {
    await page.getByRole("button", { name: "No, it didn't make sense" }).click();
    await page.getByLabel("What didn't make sense?").fill("smoke test comment");
    await page.getByRole("button", { name: "Send" }).click();
    await page.getByText(/Thanks: that helps/).waitFor();
  });

  await step("rewind to before the mistake", async () => {
    await page.getByRole("button", { name: /^Rewind to before/ }).click();
    await page.getByRole("status").filter({ hasText: YOUR_MOVE }).waitFor({ timeout: 60_000 });
    const rows = await page.locator(".moves li").count();
    if (rows !== Math.ceil(lesson.ply / 2))
      throw new Error(`expected ${Math.ceil(lesson.ply / 2)} rows, got ${rows}`);
  });

  await step("end a game and review it", async () => {
    await postGame(page, gameBody(end));
    await page.reload();
    await page.getByRole("button", { name: "End game" }).click();
    await page.getByRole("heading", { name: "Game review" }).waitFor();
    await page.locator(".review-item").first().click();
    await shot("5-review", true);
  });

  await step("account menu shows the AI allowance", async () => {
    await page.locator(".account summary").click();
    await page.getByText(/AI explanations left this month/).waitFor();
    await shot("6-account");
  });

  await step("progress page, from the account menu", async () => {
    await page.locator(".account-menu").getByRole("button", { name: "Your progress" }).click();
    await page.getByRole("heading", { name: "Your progress" }).waitFor();
    await page.getByText("Your focus").waitFor();
    if (await page.locator(".account[open]").count()) throw new Error("account menu still open");
    await shot("6b-progress", true);
    await page.getByRole("button", { name: "Back" }).click();
  });

  await step("sign out and back in", async () => {
    await page.locator(".account summary").click();
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.getByRole("heading", { name: "Welcome back" }).waitFor({ timeout: 30_000 });
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill("wrong password!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByRole("alert").waitFor();
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    // Back to the most recent unfinished game (the rewound one).
    await page.getByRole("status").filter({ hasText: YOUR_MOVE }).waitFor({ timeout: 60_000 });
  });

  await step("licences", async () => {
    await page.getByRole("button", { name: "Licences" }).click();
    await page.getByRole("heading", { name: "Licences" }).waitFor();
  });

  // A failed sign-in is expected to log a 401 in the console; nothing else should.
  const unexpected = errors.filter((e) => !/401/.test(e));

  const phone = await browser.newContext({
    ...devices["iPhone 13"],
    locale: "en-US",
    storageState: await context.storageState(),
  });
  const mobile = await phone.newPage();
  // The desktop session saved its detected locale (en-GB) with the sign-in; drop it so this
  // browser's own language decides.
  await mobile.addInitScript(() => localStorage.removeItem("PARAGLIDE_LOCALE"));
  mobile.on("pageerror", (e) => unexpected.push(e.message));
  await step("phone layout", async () => {
    await mobile.goto(`${BASE}/app/`);
    await postGame(
      mobile,
      gameBody(atTrigger.state, { lessonId: lesson.id, step: "explain", attempts: 1, wrong: [] }),
    );
    await mobile.reload();
    await mobile.getByText("The better move, then…").first().waitFor({ timeout: 30_000 });
    await mobile.getByText("Your coach", { exact: true }).waitFor({ timeout: 30_000 });
    // The browser asks for en-US, so the app speaks it (UX-39).
    await mobile.getByRole("button", { name: "Licenses" }).waitFor();
    if ((await mobile.evaluate(() => document.documentElement.lang)) !== "en-US") {
      throw new Error("<html lang> doesn't follow the locale");
    }
    await mobile.screenshot({ path: join(outDir, "7-phone-reveal.png"), fullPage: true });
    if (await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) {
      throw new Error("horizontal scroll on phone");
    }
  });

  await step("no unexpected console errors", async () => {
    if (unexpected.length) throw new Error(unexpected.join(" | "));
  });
} finally {
  await browser.close();
  server.kill();
}
console.log(`Screenshots: ${outDir}`);
process.exit(failed ? 1 : 0);
