/**
 * LLM explanations. For a feature lesson the model sees only the measured facts (from the
 * core's `facts()`, worded in en-GB from the message catalogue), never the board; for a
 * diagnosed lesson it also sees the position, and picks the concept. Its output is rejected
 * if it mentions a square that isn't in the facts (or, for a diagnosed lesson, on which no
 * piece stands). It writes in the player's
 * locale. The template explanation is always the fallback.
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  CONCEPT_IDS,
  CONSEQUENCE,
  Position,
  squareName,
  type DiagnosisFacts,
  type LessonFacts,
  type Trigger,
} from "@chess-teacher/core";
import {
  baseLocale,
  claimText,
  conceptText,
  conceptTitle,
  detailText,
  factorText,
  principleText,
  principleTitle,
  triggerText,
  undefendedText,
  type Locale,
} from "@chess-teacher/lesson-text";

/**
 * 4: facts worded from the catalogue, and the explanation written in the player's locale.
 * 5: written at the reveal, with the moves really played and what they led to.
 * 6: diagnosed lessons: verified claims and the position, and the coach picks the concept.
 */
export const PROMPT_VERSION = 6;

export const SYSTEM_PROMPT = `You are a friendly chess coach. Your student knows how the pieces move but \
not the strategy. You will receive facts about one of their moves. A chess engine and \
measuring code produced every fact, and they are correct.

Two kinds of fact need care:
- "moves_played_in_the_game" are the real moves, starting with "move_played", up to the \
moment the student is being shown this lesson, and "what_happened_in_the_game" is what they \
led to. Describe these as events in the game, and prefer them to the predictions when they \
differ. "predicted_continuation_after_your_move" and \
"predicted_continuation_after_better_move" are the engine's predictions, made when the move \
was played. Any of their moves that isn't in the real game has NOT happened: describe those \
conditionally ("if Black had played…", "after the better move, you could…").
- Factor values ("before_your_move", "end_of_your_line", "end_of_better_line") describe the \
position before the move and at the end of each prediction.

Fill in three short parts. The student sees them as a headline and two short paragraphs, \
above two boards that already show both predicted lines move by move, and above a card \
with the principle. So:
- "headline": what went wrong, or what was missed, in at most 10 words. No move sequences.
- "what_it_allowed": what their move allowed in the game (or, for a missed chance, what it missed), in \
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
  /** For a diagnosed lesson, the concept the coach chose (a core `ConceptId`). */
  concept?: string;
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
    if (p.concept !== undefined && typeof p.concept !== "string") return null;
    return ok ? (p as ExplanationParts) : null;
  } catch {
    return null;
  }
}

/** What really happened after the lesson's move, as far as the game has gone. */
export interface GameSoFar {
  /** The real moves in SAN, from the lesson's move (included) to the reveal. */
  movesPlayed: string;
  /** What those moves led to; null if the lesson hasn't been triggered. */
  trigger: Trigger | null;
}

/**
 * The facts as the model sees them, worded in en-GB whatever language it writes in. The real
 * moves and the engine's predicted lines are labelled apart, so the model doesn't describe a
 * prediction as something that happened.
 */
export function promptFacts(f: LessonFacts, game: GameSoFar) {
  const locale = baseLocale;
  return {
    move_played: f.you_played,
    moves_played_in_the_game: game.movesPlayed,
    what_happened_in_the_game: game.trigger ? triggerText(game.trigger, locale) : null,
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
  game: GameSoFar,
  locale: Locale,
): Promise<ExplanationResult> {
  const factJson = JSON.stringify(promptFacts(facts, game), null, 2);
  return callModel(
    client,
    model,
    systemPrompt(locale),
    `Facts about the mistake:\n${factJson}`,
    PARTS_SCHEMA,
    factJson,
  );
}

export const DIAGNOSIS_PROMPT = `You are a friendly chess coach. Your student knows how the pieces move but \
not the strategy (rated about 600 to 1400). You will receive one of their moves, the position \
before it, and facts that a chess engine and checking code verified about it. Every fact is \
correct.

- "moves_played_in_the_game" are the real moves, starting with "move_played", up to the \
moment the student is shown this lesson, and "what_happened_in_the_game" is what they led to. \
Describe these as events. The "predicted_..." lines are the engine's predictions: any of their \
moves that isn't in the real game has NOT happened, so describe it conditionally.
- "verified_facts" were each checked by the engine or by code.

First choose the one idea a strong coach would teach from this mistake: the idea that, had \
the student understood it, would have stopped the mistake. Pick its id from "concepts". \
Prefer the idea that explains why the move went wrong over a restatement of the outcome. \
You may read the position to understand the facts and to choose.

Then fill in three short parts, shown as a headline and two short paragraphs above two boards \
that already show both lines move by move, and a card with the idea you chose:
- "headline": what went wrong, or what was missed, in at most 10 words. No move sequences.
- "what_it_allowed": what the move allowed in the game (or, for a missed chance, what it \
missed), in 1–2 sentences and at most 40 words.
- "why_better": why the better move was better, naming it, in 1–2 sentences and at most 40 words.
Connect the facts and say why they matter, but state only what they support: do not mention \
any move or square that isn't in the facts, and don't claim anything they don't show. Mention \
at most one short sequence of up to three moves; don't recite the lines. Don't restate the \
idea's title. Plain text in each part: no markdown.`;

const diagnosisSystemPrompt = (locale: Locale): string =>
  `${DIAGNOSIS_PROMPT}\n\nWrite every part in ${languageName(locale)} (${locale}), with its spelling and ` +
  `conventions. Keep moves and squares in standard algebraic notation, as in the facts.`;

const DIAGNOSIS_SCHEMA = {
  type: "object",
  properties: {
    concept: { type: "string", enum: [...CONCEPT_IDS] },
    headline: { type: "string" },
    what_it_allowed: { type: "string" },
    why_better: { type: "string" },
  },
  required: ["concept", "headline", "what_it_allowed", "why_better"],
  additionalProperties: false,
};

const MISTAKE_DESCRIPTION: Record<DiagnosisFacts["mistake"], string> = {
  mated: "the move allowed a forced checkmate",
  loses_material: "the move lost material",
  misses_mate: "the move missed a forced checkmate",
  misses_material: "the move missed winning material",
  positional: "the move made the position worse without losing material at once",
};

/** A diagnosed lesson's facts as the model sees them, worded in en-GB. */
export function diagnosisPromptFacts(f: DiagnosisFacts, game: GameSoFar) {
  const locale = baseLocale;
  return {
    move_played: f.you_played,
    moves_played_in_the_game: game.movesPlayed,
    what_happened_in_the_game: game.trigger ? triggerText(game.trigger, locale) : null,
    move_number: f.move_number,
    player_colour: f.player_colour,
    position_before_the_move: f.position,
    better_move: f.better_was,
    mistake_type: MISTAKE_DESCRIPTION[f.mistake],
    winning_chances: `${f.winning_chances_before}% with the better move, ${f.winning_chances_after}% after the move played`,
    verified_facts: f.claims.map((c) => claimText(c, locale)),
    predicted_continuation_after_your_move: f.your_line,
    predicted_continuation_after_better_move: f.better_line,
    concepts: CONCEPT_IDS.map((id) => ({
      id,
      name: conceptTitle(id, locale),
      meaning: conceptText(id, locale),
    })),
  };
}

/** The squares with a piece on them in a position. */
function occupied(fen: string): string[] {
  const pos = new Position(fen);
  const out: string[] = [];
  for (let s = 0; s < 64; s++) if (pos.pieceAt(s)) out.push(squareName(s));
  return out;
}

export async function explainDiagnosis(
  client: LlmClient,
  model: string,
  facts: DiagnosisFacts,
  game: GameSoFar,
  locale: Locale,
): Promise<ExplanationResult> {
  const prompt = diagnosisPromptFacts(facts, game);
  const factJson = JSON.stringify(prompt, null, 2);
  return callModel(
    client,
    model,
    diagnosisSystemPrompt(locale),
    `Facts about the mistake:\n${factJson}`,
    DIAGNOSIS_SCHEMA,
    // The coach reads the position, so a square with a piece on it may be named too. The
    // concept list names a few squares as examples; only the facts about this move count.
    `${JSON.stringify({ ...prompt, concepts: undefined })} ${occupied(facts.position).join(" ")}`,
  );
}

/** Ask the model, and check its answer: the parts are present and every square is in `allowedFrom`. */
async function callModel(
  client: LlmClient,
  model: string,
  system: string,
  content: string,
  schema: object,
  allowedFrom: string,
): Promise<ExplanationResult> {
  const body = {
    model,
    max_tokens: 2000,
    output_config: { effort: "low", format: { type: "json_schema", schema } },
    system,
    messages: [{ role: "user", content }],
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
  const allowed = new Set(allowedFrom.match(SQUARE) ?? []);
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
          const f = JSON.parse(json) as Partial<ReturnType<typeof promptFacts>> &
            Partial<ReturnType<typeof diagnosisPromptFacts>>;
          const better = f.better_was ?? f.better_move ?? "";
          const factor = f.key_factor ?? f.mistake_type ?? "";
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  headline: `(Sample) ${f.move_played ?? ""} missed something`,
                  what_it_allowed: `This sample explanation was written without an AI model. The difference is ${factor}.`,
                  why_better: `${better} was better.`,
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
