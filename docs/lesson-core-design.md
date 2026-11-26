# Lesson core redesign

Status: proposal, Nov 2026. Replaces how lessons are diagnosed, chosen, demonstrated and
explained. Not yet built. Evidence: `reports/strategy-teacher-audit.md` (30 real Lichess
games against a deep engine). Measured against the lesson benchmark (§9).

## 1. Why

The teacher finds the bad move (87 of 90 blunders) and a good alternative (276 of 289
lessons), but the _reason_ it gives is usually a symptom or noise:

- A lesson is the measured feature with the largest difference at the end of two 8-ply
  engine lines, so it can only say "this number went down", and the number is often not
  why the move was bad ("Qxf6 missed a chance to give your opponent pawn weaknesses" when
  the queen trade killed White's own attack).
- 58 of 84 strategic lessons were on moves costing under 10% winning chances: depth-12
  noise the deep engine doesn't see.
- Material lessons (69% of all) say "material balance +1 → −1" under one of four generic
  principles, never the fork or the back rank that won it.
- The LLM coach is told to use only these facts and not to analyse, so it can't add the
  idea either.

The detection and the teaching loop are sound. Diagnosis, the vocabulary it can express,
and how a lesson is taught are what change.

## 2. Goals

1. **Every lesson names the real reason**, in terms a learner can reuse: the fork, the
   threat they missed, the king stuck in the centre, the queen trade that ended their
   attack.
2. **Never confidently wrong** stays the rule. Every chess statement the player sees is
   backed by an engine experiment or a code check.
3. **The how, why and when.** A strategic lesson explains what to do instead and when it
   applies, tied to what happened in this game, not just a slogan.
4. **A vocabulary as wide as the evidence supports**, growing by adding data and tests,
   not rewriting detection.
5. **Practice, not just explanation**: the player's own mistakes come back as exercises.

## 3. What stays

- Mistake detection before and after each move, and the better move.
- The loop (concept §3): play, the mistake, the consequence lands, find the cause, two
  futures, the lesson, rewind and retry.
- Stockfish on the device (D2), the pure portable core (D3), serialisable state (D10).
- The teaching opponent that levels up to demonstrate a pending lesson.

## 4. The pipeline

```
detect ──▶ diagnose ──▶ choose ──▶ demonstrate ──▶ teach ──▶ practise
          (dossier of   (which     (opponent plays  (coach     (own positions
          verified      pending    the predicted    narrates   as exercises)
          claims)       lesson)    punishment)      claims)
```

### 4.1 Diagnose: a dossier of verified claims

For each detected mistake the core runs a fixed set of **probes** and records what they
find as **claims**: structured data, each checked by the engine or by code before it is
stored. A claim is never a sentence.

| Probe                 | What it finds                                                                                                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Punishment            | The opponent's best reply and the line until the position is quiet; what it wins once exchanges settle (material, mate, or nothing concrete)                                                                                 |
| Motifs                | Rules over the punishment line (or, for a missed chance, the winning line): hanging piece, fork, pin, skewer, discovered attack, removing the defender, overloaded piece, back rank, trapped piece, promotion, mate patterns |
| Missed threat         | The position before the move with the turn passed to the opponent: what they were threatening, and whether the move ignored it                                                                                               |
| Counterfactuals       | Edited positions, searched: "if your king were castled", "with queens kept on", "with that knight on d5", "without that pawn on f3"                                                                                          |
| Structure and squares | Code facts: pawn levers and breaks, holes, outposts, a bishop's pawns on its own colour, open and half-open lines towards each king, development, king exposure                                                              |
| Trajectory            | What each line does over time: the evaluation, which pieces improve or get stuck, which plan the better line carries out                                                                                                     |

Each claim carries its evidence (the moves, the squares, the evaluations before and
after the experiment), so it can be shown on the board and re-checked.

The dossier replaces the nine feature differences, the Stockfish 11 term check (D14) and
the single `feature` on a lesson.

### 4.2 Concepts: recipes over claims

A **concept** is something a coach would name: "check what their move threatens", "fork",
"king stuck in the centre", "don't trade queens while you're attacking", "bad bishop",
"prepare your pawn break", "control the centre". Each concept is a recipe: the claims it
needs, and how strong they must be. For example, _king stuck in the centre_: the king is
uncastled, the castled counterfactual gains a lot, and a line towards the king opens in
the punishment.

- A lesson has a **main concept** and optionally a secondary one, not exactly one
  principle.
- Concepts live in about eight **families** (safety, tactics, opening, king, pawns, pieces,
  trades, endgame). Progress (concept §7) is tracked by concept and rolled up by family.
- The vocabulary has no fixed size. Adding a concept means adding a recipe, its texts, and
  a test; which concepts to add first comes from the benchmark's open labels (§9), by how
  often real mistakes need them.
- A concept is taught when its recipe matches with verified claims. If no recipe matches,
  the lesson falls back to what the claims alone support (the punishment, the motif), and
  never to a concept chosen because a number differed.
- Recipes are ranked the way coaches explain a mistake, which the benchmark's annotators
  bear out: the tactic that punishes it, then the threat it didn't answer, then what the
  move itself did (moved a defender, opened a line, left a piece pinned). Coaches name
  _why_ a count of attackers failed, not the count, so "outnumbered" is only the concept
  when the move put the piece there. A missed win is the lesson only when the better move
  itself takes something or starts the tactic; a pawn won at the end of a long line is not
  what the player missed, so the lesson is about what the move did instead.

There is **no level gating**: a 1100 player is taught "control the centre" when the centre
cost them something in this game and the engine confirms it. What changes with level is
the explanation: a first encounter with a concept gets the full how, why and when, and
defines its terms; later ones are a reminder. Ideas that rarely decide games at a level
(prophylaxis at 1100) rarely have confirmed evidence there, so they rarely come up, without
a rule saying so.

### 4.3 Choose: which pending lesson to demonstrate

Lessons are still revealed when their consequence lands, so the game itself filters. When
several are pending, the teaching opponent pursues the one with the clearest verified
reason (the strongest recipe match), breaking ties towards a concept the player hasn't met
recently, then the larger cost. There is **no cap per game**: every lesson that lands is
shown, and the rest go to the review. While Will is the only tester, volume is the point:
more lessons means more to judge. A player setting ("pause for every lesson" / "only big
ones") comes later, from playtesting.

### 4.4 Demonstrate: the opponent plays the concept

The levelled-up opponent plays the punishment the dossier predicted (the fork, the knight
landing on d5, the queen trade), choosing among near-best moves the one that carries it
out, as today but steered by claims instead of a feature value. The trigger is that
recognisable **event**, not a feature crossing a threshold, which makes "find the cause"
easier to reason about: the player saw it happen.

### 4.5 Teach: the coach narrates verified claims

- **Templates (always available).** Each concept and claim kind has catalogue texts that
  render the dossier: concrete, checked, in every locale, free and offline. Self-hosted
  without an API key, and free users, get real lessons.
- **The LLM coach (coached games).** The rule changes from "only translate facts" to
  **"only state verified claims"**. The coach may choose, connect and explain: link the
  missed threat to the motif, describe the plan the better line carries out, adapt to the
  player's level and history. Every chess statement cites claims from the dossier, and the
  guardrail checks that each move and square it mentions belongs to a cited claim. An
  uncited statement fails the guardrail; the templates are used instead.
- **Interactive first.** Before the explanation, the player is asked the question the
  lesson answers ("what does Black threaten now?", "where should this knight go?"), on the
  board, then shown the answer. "Find the cause" already does this for _which_ move; this
  does it for _why_.

### 4.6 Practise: the player's own mistakes

Every taught position becomes an exercise in a personal deck: the position before the
mistake, solved by finding the better move or the opponent's threat. It comes back at
growing intervals. Test mode (concept §4) checks whether the concept carries over to real
games. Cheap, because the positions and verified answers already exist.

## 5. Data

A lesson keeps what it has now (move, position, better move, lines, scores, status,
trigger) and replaces `feature`, `principle`, the three `Detail`s and the feature values
with:

```ts
interface Lesson {
  // ...existing identity, position, moves, lines, scores, status
  claims: Claim[]; // the dossier
  concept: ConceptId | null; // main concept (null: the claims alone, e.g. a bare punishment)
  secondary: ConceptId | null;
  trigger: TriggerEvent; // the predicted event that reveals it
}

type Claim =
  | { kind: "punishment"; line: string[]; wins: MaterialChange | "mate" | null }
  | { kind: "motif"; motif: Motif; on: string[]; at: number /* ply in the line */ }
  | { kind: "threat"; move: string; wins: MaterialChange | "mate"; ignored: boolean }
  | { kind: "counterfactual"; edit: Edit; gainCp: number }
  | { kind: "structure"; fact: StructureFact; squares: string[] }
  | ...;
```

All plain data (D10), all rendered by the apps from the catalogue (the core still never
writes a sentence). Session state version bumps; saved games from before keep rendering
from their stored details.

## 6. Settled decisions this changes

| Decision                                                 | Today                          | Proposed                                                                                                                                   |
| -------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Concept §5: the LLM only translates facts                | Rewords facts; may not analyse | Only states verified claims; may choose, connect and explain                                                                               |
| Concept §6: a fixed curriculum, one principle per lesson | 14 principles                  | Open concepts in about eight families; main and secondary concept                                                                          |
| D14: strategic lessons need a second opinion             | Stockfish 11 classical terms   | Replaced by the probes; Stockfish 11 worker removed                                                                                        |
| D4: the server never runs Stockfish                      | Unchanged                      | Unchanged for now. Revisited only if the benchmark shows a fixed set of probes isn't enough and the coach needs to query the engine itself |

These go into `concept.md` and `architecture.md` in their own guidance PR once the
benchmark shows the design works.

## 7. Engine cost

Probes run only for detected mistakes (a median of 4 per player per game at 1100), not
every move. Each is a handful of short searches: the punishment line already exists, the
threat probe is one search, and counterfactuals are a few searches on edited positions.
Budget: under a second of engine time per mistake on a laptop, measured on the benchmark
and checked against the phone fallback (`benchmarks.md`). Probes can run while the
opponent thinks, and the lesson is only needed when it lands.

## 8. Risks

- **Counterfactuals on edited positions** can be illegal or unrealistic (a king "castled"
  through an attacked square, a missing pawn that changes everything), and searches are
  noisy. This is the most research-heavy part; the benchmark decides which experiments
  are reliable enough to teach from.
- **Recipe coverage.** A mistake whose reason no recipe captures gets only its
  punishment and motif. Better than a wrong reason, but less than a coach.
- **Cost of the coach.** Narrating a richer dossier with a stronger model costs more per
  coached game; pricing (concept §9) follows the LLM benchmark.
- **Scope.** The dossier and recipes are the core. Interactive questions, the practice
  deck and event triggers change what players see, and need UX work under
  `docs/design/ux-principles.md`.

## 9. How it's measured

The lesson benchmark (`tools/sim/bench`): real positions from Lichess games at three rating
bands, never the audit's games, with labels an engine or code can check (was it a mistake,
the acceptable moves, the punishment and what it wins, the tactical motif from an
independent tagger) and open concept labels from blind annotators, grouped into the
concept vocabulary. Items where the right answer is _no lesson_ are included. 192 dev items
for iterating, 129 test items scored only as totals, split by game. Today's core is scored
first as the baseline. Each stage below is measured before the next starts. Recipes are
iterated on cached dossiers (`src/bench/dossiers.ts`, `src/bench/concepts-eval.ts`), and
checked on the first-round dev items apart from the later ones, to catch tuning to one
batch.

## 10. Order

1. The benchmark and the baseline.
2. Claims and probes, with template narration, behind the current `Lesson` shape where
   possible. Measure.
3. Concept recipes, most frequent first. Measure.
4. LLM narration over the dossier (needs Will's go-ahead to spend tokens). Measure. A
   first probe with subagents picking the concept from the dossier text alone
   (`src/bench/llm-packets.ts`, `src/bench/llm-eval.ts`): 45% on dev with no tuning,
   where the recipes reach 26–29% on items they weren't tuned on. The annotators are
   also Claude, so some of that agreement may be shared habit rather than insight.
5. Choosing by clarity, the opponent playing the concept, event triggers.
6. Interactive questions and the practice deck (UX work first).
7. Guidance PR: `concept.md` §5–§7 and `architecture.md` D14 and §5.
