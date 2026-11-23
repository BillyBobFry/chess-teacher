/**
 * LLM explanations. The model sees only the lesson's measured facts (from the core's
 * `facts()`), never the board, and its output is rejected if it mentions any square that
 * isn't in those facts. The template explanation is always the fallback.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { LessonFacts } from "@chess-teacher/core";

export const PROMPT_VERSION = 2;

export const SYSTEM_PROMPT = `You are a friendly chess coach. Your student knows how the pieces move but \
not the strategy. You will receive facts about one of their moves. A chess engine and \
measuring code produced every fact, and they are correct.

Two kinds of fact need care:
- "move_played" is the only move from the real game. Everything in \
"predicted_continuation_after_your_move" and "predicted_continuation_after_better_move" is \
the engine's prediction of how play could go. Those moves have NOT happened. Describe them \
conditionally ("if your opponent then plays…", "after the better move, you could…"), never \
as events in the game, and don't refer to "moves later" as if time has passed.
- Factor values ("before_your_move", "end_of_your_line", "end_of_better_line") describe the \
position before the move and at the end of each prediction.

Write a short explanation (under 120 words) in plain English:
1. what their move allowed, or what it missed,
2. why the better move was better, using the measured factor,
3. the principle to remember, in one sentence.

Use only the facts given. Do not analyse the position yourself, and do not mention any \
move or square that does not appear in the facts. If the facts don't say why something \
happened, don't guess. Write plain prose: no headings, lists or markdown.`;

/** USD per million tokens (input, output). Thinking tokens are billed as output. */
const PRICES: Record<string, [number, number]> = {
  "claude-haiku-5-5": [0.1, 0.5],
  "claude-sonnet-5-5": [2, 10],
  "claude-opus-5-5": [4, 20],
};
/** Models that support server-side refusal fallbacks. */
const FALLBACK_MODELS = new Set(["claude-sonnet-5-5", "claude-opus-5-5"]);

const SQUARE = /\b[a-h][1-8]\b/g;

export interface ExplanationResult {
  status: "ready" | "rejected" | "error";
  text?: string;
  error?: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
}

/** The part of the Anthropic client we use, so tests can supply a fake. */
export interface LlmClient {
  beta: { messages: { create: (body: never) => Promise<unknown> } };
}

interface MessageLike {
  content: { type: string; text?: string }[];
  stop_reason: string | null;
  model: string;
  usage: { input_tokens: number; output_tokens: number };
}

export function createLlmClient(apiKey: string): LlmClient {
  return new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" }) as unknown as LlmClient;
}

/**
 * The facts as the model sees them: the predicted lines are labelled as predictions, so the
 * model doesn't describe them as moves that happened (they haven't: explanations are
 * written when a lesson is created, before the game moves on).
 */
export function promptFacts(f: LessonFacts) {
  const { your_line, better_line, you_played, ...rest } = f;
  delete (rest as Partial<LessonFacts>).lines_diverge_after_ply;
  delete (rest as Partial<LessonFacts>).what_happened_in_the_game;
  return {
    move_played: you_played,
    ...rest,
    predicted_continuation_after_your_move: your_line,
    predicted_continuation_after_better_move: better_line,
  };
}

export async function explainLesson(
  client: LlmClient,
  model: string,
  facts: LessonFacts,
): Promise<ExplanationResult> {
  const factJson = JSON.stringify(promptFacts(facts), null, 2);
  const body = {
    model,
    max_tokens: 2000,
    output_config: { effort: "low" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: `Facts about the mistake:\n${factJson}` }],
    ...(FALLBACK_MODELS.has(model)
      ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" }
      : {}),
  };
  let response: MessageLike;
  try {
    response = (await client.beta.messages.create(body as never)) as MessageLike;
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError)
      return { status: "error", model, error: "authentication" };
    if (err instanceof Anthropic.RateLimitError) return { status: "error", model, error: "rate limited" };
    if (err instanceof Anthropic.APIError)
      return { status: "error", model, error: `API error ${err.status}` };
    return { status: "error", model, error: err instanceof Error ? err.message : String(err) };
  }

  const [pin, pout] = PRICES[model] ?? [0, 0];
  const usage = {
    model: response.model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    costUsd: (response.usage.input_tokens * pin + response.usage.output_tokens * pout) / 1e6,
  };
  if (response.stop_reason === "refusal") return { status: "error", error: "model declined", ...usage };
  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("")
    .trim();
  if (!text) return { status: "error", error: "empty response", ...usage };

  // Guardrail: every square mentioned must appear in the facts.
  const allowed = new Set(factJson.match(SQUARE) ?? []);
  const invented = [...new Set(text.match(SQUARE) ?? [])].filter((s) => !allowed.has(s));
  if (invented.length)
    return { status: "rejected", text, error: `invented squares: ${invented.join(", ")}`, ...usage };
  return { status: "ready", text, ...usage };
}

/**
 * A stand-in for local development and browser tests (FAKE_LLM=1): answers instantly, for
 * free, using only words from the facts, so it always passes the guardrail.
 */
export function createFakeLlmClient(): LlmClient {
  return {
    beta: {
      messages: {
        create: (async (body: { messages: { content: string }[] }) => {
          const json = body.messages[0]!.content.replace(/^[^{]*/, "");
          const f = JSON.parse(json) as ReturnType<typeof promptFacts>;
          return {
            content: [
              {
                type: "text",
                text:
                  `(Sample explanation, written without an AI model.) You played ${f.move_played}, ` +
                  `but ${f.better_was} was better: the difference is ${f.key_factor}. ` +
                  `Remember: ${f.principle.title.toLowerCase()}.`,
              },
            ],
            stop_reason: "end_turn",
            model: "fake",
            usage: { input_tokens: 0, output_tokens: 0 },
          };
        }) as never,
      },
    },
  };
}
