import type { ExplanationResponse } from "@chess-teacher/contract";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ExplanationFailed,
  queryClient,
  revealExplanationQuery,
  reviewExplanationQuery,
} from "../src/api/queries.ts";

const READY: ExplanationResponse = {
  status: "ready",
  parts: { headline: "h", what_it_allowed: "w", why_better: "b" },
  coachedGamesRemaining: 29,
};
const FAILED: ExplanationResponse = { status: "error", coachedGamesRemaining: 30, canRetry: true };

/** A fake API: each answer is used once, in order, for that method; the last one repeats. */
function serve(answers: { GET?: (ExplanationResponse | number)[]; POST?: (ExplanationResponse | number)[] }) {
  const calls = { GET: 0, POST: 0 };
  vi.stubGlobal("fetch", async (url: string, init: RequestInit = {}) => {
    const method = init.method === "POST" ? "POST" : "GET";
    if (!url.endsWith("/explanation")) return Response.json({}, { status: 200 });
    const list = answers[method] ?? [];
    const answer = list[Math.min(calls[method], list.length - 1)];
    calls[method] += 1;
    if (answer === undefined) throw new Error(`unexpected ${method}`);
    return typeof answer === "number"
      ? Response.json({ error: "not_found" }, { status: answer })
      : Response.json(answer);
  });
  return calls;
}

/** Runs a query to the end, skipping the waits between retries. */
async function run<T>(promise: Promise<T>) {
  const settled = promise.then(
    (data) => ({ data }),
    (error: unknown) => ({ error }),
  );
  await vi.runAllTimersAsync();
  return settled;
}

const reveal = () => run(queryClient.fetchQuery(revealExplanationQuery("g", 1, async () => {})));
const review = () => run(queryClient.fetchQuery(reviewExplanationQuery("g", 1)));

beforeEach(() => {
  vi.useFakeTimers();
  queryClient.clear();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("the coach's explanation at the reveal", () => {
  it("is asked for twice more when the coach fails, then reported as failed", async () => {
    const calls = serve({ POST: [FAILED] });
    const result = await reveal();
    expect(result).toEqual({ error: expect.any(ExplanationFailed) });
    expect(calls.POST).toBe(3);
  });

  it("arrives when a retry works", async () => {
    const calls = serve({ POST: [FAILED, READY] });
    expect(await reveal()).toEqual({ data: READY });
    expect(calls.POST).toBe(2);
  });

  it("isn't asked for again once the server won't write it again", async () => {
    const givenUp = { ...FAILED, canRetry: false };
    const calls = serve({ POST: [givenUp] });
    expect(await reveal()).toEqual({ data: givenUp });
    expect(calls.POST).toBe(1);
  });

  it("isn't asked for again when the allowance is used up", async () => {
    const calls = serve({ POST: [{ status: "quota", coachedGamesRemaining: 0 }] });
    expect(await reveal()).toEqual({ data: { status: "quota", coachedGamesRemaining: 0 } });
    expect(calls.POST).toBe(1);
  });

  it("isn't asked for again after a request the server refuses", async () => {
    const calls = serve({ POST: [404] });
    expect(await reveal()).toEqual({ error: expect.objectContaining({ status: 404 }) });
    expect(calls.POST).toBe(1);
  });

  it("waits while another request writes it", async () => {
    const calls = serve({
      POST: [{ status: "pending", coachedGamesRemaining: 30 }],
      GET: [{ status: "pending", coachedGamesRemaining: 30 }, READY],
    });
    expect(await reveal()).toEqual({ data: READY });
    expect(calls).toEqual({ POST: 1, GET: 2 });
  });
});

describe("the coach's explanation in the review", () => {
  it("isn't written for a lesson that was never revealed", async () => {
    const calls = serve({ GET: [{ status: "pending", coachedGamesRemaining: 30 }] });
    expect(await review()).toEqual({ data: null });
    expect(calls.POST).toBe(0);
  });

  it("is written again when it failed at the reveal", async () => {
    const calls = serve({ GET: [FAILED], POST: [READY] });
    expect(await review()).toEqual({ data: READY });
    expect(calls).toEqual({ GET: 1, POST: 1 });
  });
});
