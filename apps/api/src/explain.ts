/**
 * LLM explanations. The model sees only the lesson's measured facts (from the core's
 * `facts()`, worded in en-GB from the message catalogue), never the board, and its output is
 * rejected if it mentions any square that isn't in those facts. It writes in the player's
 * locale. The template explanation is always the fallback.
 */

import Anthropic from "@anthropic-ai/sdk";
import { CONSEQUENCE, type LessonFacts } from "@chess-teacher/core";
import {
  baseLocale,
  detailText,
  factorText,
  principleText,
  principleTitle,
  undefendedText,
  type Locale,
} from "@chess-teacher/lesson-text";

/** 4: facts worded from the catalogue, and the explanation written in the player's locale. */
export const PROMPT_VERSION = 4;

export const SYSTEM_PROMPT = `You are a friendly chess coach. Your student knows how the pieces move but \
not the strategy. You will receive facts about one of their moves. A chess engine and \
measuring code produced every fact, and they are correct.

Two kinds of fact need care:
- "move_played" is the only move from the real game. Everything in \
"predicted_continuation_after_your_move" and "predicted_continuation_after_better_move" is \
the engine's prediction of how play could go. Those moves have NOT happened. Describe them \
conditionally ("if Black then plays…", "after the better move, you could…"), never as \
events in the game.
- Factor values ("before_your_move", "end_of_your_line", "end_of_better_line") describe the \
position before the move and at the end of each prediction.

Fill in three short parts. The student sees them as a headline and two short paragraphs, \
above two boards that already show both predicted lines move by move, and above a card \
with the principle. So:
- "headline": what went wrong, or what was missed, in at most 10 words. No move sequences.
- "what_it_allowed": what their move allowed (or, for a missed chance, what it missed), in \
1–2 sentences and at most 40 words.
- "why_better": why the better move was better, naming it and the measured factor, in 1–2 \
sentences and at most 40 words.
Mention at most one short sequence of up to three moves in total; don't recite the lines, \
the boards show them. Don't restate the principle. Avoid engine numbers unless material \
is the point.

Use only the facts given. Do not analyse the position yourself, and do not mention any \
move or square that does not appear in the facts. If the facts don't say why something \
happened, don't guess. Plain text in each part: no markdown.`;

/** The language the explanation is written in, by name ("British English"), for the prompt. */
export const languageName = (locale: Locale): string =>
  new Intl.DisplayNames(["en"], { type: "language" }).of(locale) ?? locale;

export const systemPrompt = (locale: Locale): string =>
  `${SYSTEM_PROMPT}\n\nWrite every part in ${languageName(locale)} (${locale}), with its spelling and ` +
  `conventions. Keep moves and squares in standard algebraic notation, as in the facts.`;

/** The explanation's structure, enforced by the API's structured outputs. */
export interface ExplanationParts {
  headline: string;
  what_it_allowed: string;
  why_better: string;
}

const PARTS_SCHEMA = {
  type: "object",
  properties: {
    headline: { type: "string" },
    what_it_allowed: { type: "string" },
    why_better: { type: "string" },
  },
  required: ["headline", "what_it_allowed", "why_better"],
  additionalProperties: false,
};

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
  /** The parts as JSON (what's stored). */
  text?: string;
  parts?: ExplanationParts;
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

/** Parse stored or returned parts; null if it isn't the expected JSON. */
export function parseParts(raw: string | null | undefined): ExplanationParts | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as Partial<ExplanationParts>;
    const ok = [p.headline, p.what_it_allowed, p.why_better].every((x) => typeof x === "string" && x.trim());
    return ok ? (p as ExplanationParts) : null;
  } catch {
    return null;
  }
}

/**
 * The facts as the model sees them, worded in en-GB whatever language it writes in. The
 * predicted lines are labelled as predictions, so the model doesn't describe them as moves
 * that happened (they haven't: explanations are written when a lesson is created, before the
 * game moves on).
 */
export function promptFacts(f: LessonFacts) {
  const locale = baseLocale;
  return {
    move_played: f.you_played,
    move_number: f.move_number,
    player_colour: f.player_colour,
    better_was: f.better_was,
    evaluation_cost_in_pawns: f.evaluation_cost_in_pawns,
    lesson_type:
      f.lesson_type === CONSEQUENCE
        ? "something went wrong because of this move"
        : "a better opportunity was missed",
    key_factor: factorText(f.key_factor, locale),
    before_your_move: detailText(f.before_your_move, locale),
    end_of_your_line: detailText(f.end_of_your_line, locale),
    end_of_better_line: detailText(f.end_of_better_line, locale),
    pieces_left_undefended_by_your_move: f.pieces_left_undefended_by_your_move.map((u) =>
      undefendedText(u, locale),
    ),
    principle: {
      title: principleTitle(f.principle, locale),
      explanation: principleText(f.principle, locale),
    },
    predicted_continuation_after_your_move: f.your_line,
    predicted_continuation_after_better_move: f.better_line,
  };
}

export async function explainLesson(
  client: LlmClient,
  model: string,
  facts: LessonFacts,
  locale: Locale,
): Promise<ExplanationResult> {
  const factJson = JSON.stringify(promptFacts(facts), null, 2);
  const body = {
    model,
    max_tokens: 2000,
    output_config: { effort: "low", format: { type: "json_schema", schema: PARTS_SCHEMA } },
    system: systemPrompt(locale),
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
  if (response.stop_reason === "max_tokens") return { status: "error", error: "cut off", ...usage };
  const raw = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("")
    .trim();
  const parts = parseParts(raw);
  if (!parts) return { status: "error", error: "malformed response", ...usage };
  const text = JSON.stringify(parts);

  // Guardrail: every square mentioned must appear in the facts.
  const allowed = new Set(factJson.match(SQUARE) ?? []);
  const said = [parts.headline, parts.what_it_allowed, parts.why_better].join(" ");
  const invented = [...new Set(said.match(SQUARE) ?? [])].filter((s) => !allowed.has(s));
  if (invented.length)
    return { status: "rejected", text, error: `invented squares: ${invented.join(", ")}`, ...usage };
  return { status: "ready", text, parts, ...usage };
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
                text: JSON.stringify({
                  headline: `(Sample) ${f.move_played} missed something`,
                  what_it_allowed: `This sample explanation was written without an AI model. The difference is ${f.key_factor}.`,
                  why_better: `${f.better_was} was better for ${f.key_factor}.`,
                } satisfies ExplanationParts),
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
