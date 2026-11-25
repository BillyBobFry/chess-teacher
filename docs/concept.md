# Chess Teacher — Concept

A web app that teaches chess **strategy** (not just blunder avoidance) to players who
know the rules but not how to play well. You play a game against an opponent that is
pitched at your level; when you make a mistake, the app quietly waits until that
mistake actually costs you something, then stops the game and helps you work out what
went wrong, what would have been better, and why.

Status: concept / pre-prototype. This document records the design decisions so far and
the risks that the first prototype is meant to test.

---

## 1. The problem

Players who know the rules but not the strategy plateau because:

- **They can't tell which move was the mistake.** When something goes wrong (a pawn
  falls, a piece gets trapped) the cause was often several moves earlier. Working that
  out — _credit assignment_ — is the hard part, and beginners rarely manage it alone.
- **Existing feedback is about _what_, not _why_.** Game-review tools label moves
  ("inaccuracy", "blunder") and show the engine's preferred move, but rarely explain the
  strategic idea in a way a beginner can reuse in a different position.
- **Strategic mistakes are invisible at the time.** A blunder is obvious one move later.
  A strategic error (a weakened pawn, a misplaced knight, an uncastled king) only hurts
  several moves later, by which point the link to the original move has been lost.

## 2. Target user

Someone who knows how the pieces move and has played some games, roughly 600–1400
rating, and wants to understand _why_ good moves are good. They cannot judge the
correctness of chess explanations themselves, so **the app must never be confidently
wrong.**

## 3. The core loop

1. **Play** a game against the teaching opponent (§4), which is pitched at your level.
2. **You make a mistake.** The engine notices immediately, predicts what it will cost
   you, and records a _pending lesson_. You are not told yet.
3. **The consequence lands.** The opponent exploits the mistake; you lose the pawn, the
   piece gets trapped, the file is taken.
4. **The game pauses: "find the cause".**

   > _"You just lost your d-pawn. The cause was one of your last 5 moves. Can you find it?"_

   Hints are available (highlight the move, then the piece).

5. **Compare the two futures.** Two boards side by side — _what you played_ and _what was
   better_ — each playable forward a few moves, with the key squares and pieces
   highlighted and a small evaluation graph for each line.
6. **Name the principle.** A short explanation tied to one named principle from a fixed
   curriculum (§6), e.g. _"Knights are strongest on squares where pawns can't kick them
   away."_
7. **Rewind and retry** from the mistake, with the lesson fresh — or carry on.

If you spot the weakness yourself and fix it before the punishment lands, the app
celebrates that instead: _"Nice — you saw your d-pawn was weak and defended it in time."_

At any point in play the player can **undo** their latest move (and the opponent's reply)
and redo it. A lesson made by a move they undo is dropped, so a mistake undone before it
bites is never taught; a lesson already revealed stays. This trades some teaching for
letting the player explore, and was chosen deliberately.

Because the rule is simply _"reveal when the consequence lands"_, tactics and strategy
are handled the same way: a hanging piece is revealed one move later; a weak pawn might
be revealed eight moves later.

## 4. The teaching opponent

The opponent has two modes:

| Mode            | When                | How it plays                                                                                                                             |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Normal**      | No pending lesson   | At the user's level, with human-like moves (target: [Maia](https://maiachess.com), a network trained on human games at specific ratings) |
| **Levelled up** | A lesson is pending | Strong engine, **focused on exploiting that lesson**                                                                                     |

Rules for levelling up:

- **Exploit clearly, not ruthlessly.** From the engine's top few moves, choose the one
  that most directly pursues the lesson (attacks the weak pawn, occupies the open file),
  even if a different move is fractionally stronger. The user must be able to see cause
  and effect.
- **Only level up for the lesson.** Don't play perfect chess everywhere else, or the user
  is crushed for unrelated reasons and the lesson is lost.
- **Lessons expire.** If the exploit doesn't land within ~6–8 moves, drop back to normal
  and move the lesson to the post-game review.
- **One lesson at a time.** If several become pending, pursue the biggest; the rest go to
  the review.

Unexploited lessons appear in the **post-game review** as _"you got away with it"_,
shown with the simulated lines instead of the real game.

### Difficulty ladder

| Level  | Behaviour                                                                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Easy   | A subtle warning when a lesson becomes pending (_"Your opponent has spotted something…"_). The user tries to find and fix the weakness before it's punished. |
| Normal | No warning. Lessons are revealed when they land.                                                                                                             |
| Test   | Teaching opponent off. A fair game, to check whether the lessons stuck.                                                                                      |

## 5. How the analysis works

**Principle: the engine and deterministic code do all the analysis. The LLM only
translates facts into plain English.** LLMs are unreliable at reading chess positions
and will invent plausible-sounding but wrong explanations; a beginner can't catch them.

### 5.1 Detecting a mistake

Before each user move, ask the engine for its top N moves with evaluations (MultiPV).
A move becomes a lesson candidate only if **both**:

1. it is clearly worse than the best options (evaluation gap above a threshold, roughly
   0.5 pawns, scaled to the user's level), **and**
2. the feature comparison (§5.3) finds a concrete difference that explains the gap.

Otherwise the move is treated as fine. Engines often prefer one move over another for
reasons no human could articulate; nitpicking every move teaches nothing.

Strategic lessons have a lower bar (0.35 pawns against 0.7 for material) from move 3 on,
because a strategic mistake costs little per move and rarely reaches the full threshold.
Below the full threshold a strategic lesson is only taught when the classical evaluation
check (§12) agrees that its factor explains the gap. Evidence: `reports/near-miss-findings.md`.

### 5.2 Simulating the two futures

For both the user's move and the best move, play the line forward **3–6 moves each**
(the engine's principal variation, or later, Maia for the opponent's side to show what
happens against a realistic player).

- Measure features **after every move** along both lines and find the point where they
  diverge — that divergence is the lesson.
- Only compare **quiet** positions (no pending captures or checks). If a line stops in
  the middle of an exchange, extend it until it settles, otherwise a temporary material
  swing drowns out every strategic signal.

### 5.3 Strategic features (computed in code, not by the LLM)

| Feature        | Measured as                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| Material       | Standard piece values                                                       |
| Development    | Minor pieces on starting squares; castled or not                            |
| Centre control | Attackers / occupiers of d4, d5, e4, e5                                     |
| Piece activity | Legal moves per piece; pieces with almost none ("bad" pieces)               |
| Pawn structure | Isolated, doubled, backward and passed pawns                                |
| Outposts       | Knights on squares enemy pawns can never attack                             |
| Open files     | Rooks on open / half-open files                                             |
| King safety    | Pawn shield; enemy pieces bearing on the king zone                          |
| Hanging pieces | Pieces attacked more times than defended, or attacked by lower-value pieces |

(Shortcut for prototyping: Stockfish 11 and earlier expose a term-by-term `eval`
breakdown — mobility, king safety, passed pawns, space, etc. Modern NNUE Stockfish no
longer does.)

### 5.4 Pending lessons and triggers

When a mistake is detected, a pending lesson records:

- the move and position where it happened;
- the predicted consequence, as a concrete, checkable condition derived from the
  feature diff (e.g. _"white loses the d4 pawn"_, _"white's king has no pawn shield and a
  black piece reaches the king zone"_, _"black's rook occupies the open e-file"_);
- an expiry (move number).

After every move in the real game, each pending lesson's condition is checked. When it
becomes true, the lesson **triggers** and the game pauses for the reveal.

### 5.5 The LLM's job

Input: structured facts only — the two moves, the two lines in notation, the feature
diffs at the divergence point, the triggered consequence, and the named principle.
Output: a short, plain-English explanation at the user's level, plus the "find the
cause" prompt and hints.

Guardrails: any move or square the LLM mentions must appear in the facts it was given;
otherwise fall back to a templated explanation.

## 6. The curriculum

A fixed set of a few dozen named principles, so explanations use consistent language and
progress can be tracked. Starting list:

- **Safety:** don't leave pieces undefended; check what your opponent's last move
  threatens; check checks, captures and threats before moving.
- **Chances:** take free material; look for your own forcing moves. When the user's move
  loses nothing of their own but the better move wins material, that is a missed chance,
  not a blunder, and is taught under one of these.
- **Opening:** develop knights and bishops before attacking; control the centre; castle
  early; don't move the same piece twice without reason; don't bring the queen out early.
- **Pieces:** knights on outposts; rooks on open files; bishops on long, open diagonals;
  improve your worst piece; avoid trapping your own pieces.
- **Pawns:** avoid isolated, doubled and backward pawns; passed pawns must be pushed;
  don't weaken the pawns in front of your castled king.
- **Endgame:** activate your king; rooks belong behind passed pawns.

Every lesson maps to exactly one principle.

## 7. Measuring progress

Because the opponent gets stronger whenever you make a mistake, win/loss record is not a
fair measure of strength. Progress is tracked per principle instead:

- how often you make mistakes of that type (per game);
- how often you **fix** a weakness before it's punished;
- how often you **find the cause** yourself in the reveal;
- results in **Test** mode games.

This gives a "you keep neglecting development" view and drives which principles to
emphasise next.

## 8. How this differs from existing tools

Chess.com Game Review and Lichess analysis label moves and show engine lines after the
game, with largely templated explanations. This app differs by:

1. **An opponent that deliberately demonstrates your mistakes**, at an otherwise fair
   level.
2. **Delayed reveal**: feedback arrives when the mistake costs you, and you find the
   cause yourself.
3. **Strategic explanations grounded in measured features**, tied to a named principle.
4. **Rewind and retry** from the mistake.
5. **Open source and free at its core** (§9): competing AI-teacher apps are closed,
   subscription services.

## 9. Business model

Competing apps sell AI chess teachers by subscription. This one differentiates by being
**open source** and **free at its core**, with paid usage only for the part that costs
money to run: the AI coach.

|                                                                                                    | Self-hosted                       | Hosted (web and mobile app)                                         |
| -------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| Price                                                                                              | Free                              | Free, plus optional pay-as-you-go bundles                           |
| Playing, teaching opponent, find-the-cause, both futures, rewind, review, facts-based explanations | ✓                                 | ✓, unlimited                                                        |
| AI coach (explanations, "ask the coach")                                                           | ✓ with your own Anthropic API key | **N free coached games every month**, then bundles of coached games |

- **Licence:** AGPL-3.0, so anyone running a modified version as a service must publish
  their changes (a competitor can't run a closed fork). Compatible with Stockfish's GPL.
  Contributors sign a CLA, keeping the option of other licensing later.
- **Why it's sustainable:** the engine and teaching logic run on the player's device, so a
  free game costs almost nothing to serve. The only real running cost is the LLM, and
  that's what's metered.
- **The unit is a coached game,** not tokens or credits: easy to understand. A coached
  game is counted when its first AI explanation appears, so a clean game costs nothing.
  AI explanations per game are capped (around 8) to bound the cost of a messy game.
- **Free coached games every month** (a small number) let every user experience the coach:
  product-led growth. Purchased games don't expire. Free games are used first.
- **"Ask the coach":** in a coached game the player can ask follow-up questions ("why can't
  I just take that pawn?"), answered from engine analysis. This is what an LLM uniquely
  adds, and the main reason to pay, beyond nicer wording of the free explanation.
- **The mobile app offers exactly what the hosted web app does,** with the same account
  and the same balance of coached games.
- **Payments:** Stripe on the web; app-store in-app purchases on mobile (required for
  digital goods). Balances live on the server so purchases work across devices. Smallest
  bundle around $5+ so card fees don't eat it.
- **Pricing** comes from the LLM cost benchmark: price per coached game ≥ AI cost per game ÷
  (1 − payment and store fees) × margin. The model choice changes the AI cost per game by
  10–40×, so the benchmark has to run first. N (free per month) and $X (bundle price) are
  set from it.

## 10. Risks and open questions

| Risk                                | Why it matters                                                                                 | How to test                                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Explanation quality**             | Wrong explanations are worse than none for this user                                           | Run on real beginner games; have a strong (1800+) player grade a sample                                       |
| **Consequence prediction**          | Can we turn a feature diff into a checkable condition that reliably triggers in the real game? | Prototype 1 (below)                                                                                           |
| **Teaching opponent feel**          | Does the levelled-up opponent feel fair, and is the exploit legible?                           | Playtest                                                                                                      |
| **Strategic signal at low ratings** | Below ~1200, games are decided mostly by tactics; strategic lessons may rarely trigger         | Count lesson types across real games                                                                          |
| **Small eval gaps**                 | Engine preferences of <0.5 are often inexplicable                                              | Threshold tuning; only teach when a feature explains the gap                                                  |
| **Cost / latency**                  | Engine analysis every move plus LLM calls                                                      | LLM only at reveals; engine runs in the browser (Stockfish WASM) or on a server                               |
| **Will people pay?**                | The free tier is the whole core product; the paid part must be worth it                        | Usage of free coached games vs bundle conversion; "ask the coach" is the strongest paid draw                  |
| **App-store rules**                 | In-app purchase requirements and fees, GPL + App Store                                         | Follow the Lichess precedent (GPL app with Stockfish on both stores); consumable in-app purchases for bundles |

## 11. Plan

1. **Prototype 1 (command line):** play against a teaching opponent in the terminal.
   Detect mistakes, record pending lessons with checkable conditions, level the opponent
   up to exploit them, and reveal when they trigger. Templated explanations; LLM optional.
   _Tests: consequence prediction and triggering._
2. **Explanation evaluation:** run the analysis over a set of real beginner games;
   generate LLM explanations from the facts; have a strong player grade them.
3. **Web MVP:** board UI, the find-the-cause reveal, side-by-side futures, rewind.
4. **Maia** for the normal-mode opponent and the realistic simulated lines.
5. **Progress tracking** per principle and the difficulty ladder.

The engineering milestones (see `architecture.md`): 1 TypeScript core ✓ · 2 playable web
app ✓ · 3 accounts, server, AI explanations ✓ · **4 lesson quality** · 5 open-source ready
(licence, CLA, self-hosting) · 6 coached-game credits and payments, "ask the coach" ·
7 mobile app.

---

## 12. Prototype 1 findings (Nov 2026)

A command-line prototype in Python (since replaced by the TypeScript core) implements the core loop: mistake
detection, feature comparison across the two futures, pending lessons with checkable
triggers, the teaching opponent, find-the-cause, explanations and rewind. It was tested
by simulating games between a weak engine "student" (Stockfish skill 0) and the teaching
opponent (Stockfish skill 3, levelling up to full strength), with a control run where the
opponent never levels up. Numbers below are from 12 games per configuration; two earlier
10-game runs gave the same picture.

|                                                      | Teaching opponent | Control (no level-up) |
| ---------------------------------------------------- | ----------------- | --------------------- |
| Consequence lessons that actually landed in the game | **77%**           | 51%                   |
| Median delay from mistake to consequence             | 2 moves           | 1 move                |
| Longest delay                                        | 8 moves           | 9 moves               |
| Opponent moves spent levelled up                     | 14%               | 0%                    |

What we learned:

1. **The teaching opponent works.** Levelling up raises the share of predicted
   consequences that really happen from about half to about four in five, while staying
   at normal strength most of the time. Without it, half the lessons would never be
   demonstrated.
2. **Predicting a consequence and recognising it later is feasible.** Measured
   conditions ("material balance drops to −1 after exchanges settle", "the opponent gets a
   knight outpost") trigger reliably and quickly. Strategic consequences take longer to
   land than tactical ones, as expected.
3. **Credit assignment is a real problem.** In the first runs, one loss was blamed on a
   move from seven moves earlier when a later mistake had caused it. Fix: when a newer
   mistake affects the same factor, the older lesson is set aside for the review
   ("superseded"). Weaker players make a lot of overlapping mistakes, so this matters.
4. **Most lessons are tactical at this level.** Around 55–75% of lessons are about
   material, which confirms the warning that games below ~1200 are mostly decided by
   tactics. Strategic lessons still appear in most games.
5. **Strategic explanations are the weak point.** Judged by eye, material lessons are
   reliably right. Strategic lessons are right roughly half the time. Good examples:
   _"Nc6 let their knight settle on an outpost on d5"_, _"Bd6 gave their rook the open
   d-file"_, _"Bf6 blocked your knight's natural square; develop first"_. Bad examples
   were rationalisations: the factor that differed wasn't why the engine preferred the
   other move. Fixes so far: requiring a difference to persist for two plies, treating
   the king as safe once queens are off, and adding endgame king activity.

Next steps suggested by these results:

- **Validate the factor.** Before teaching a strategic lesson, check that the factor
  explains the evaluation gap. For example, test whether the engine's evaluation changes
  when that factor changes, or use the Stockfish 11 term-by-term breakdown. Only teach
  when it does.
- **Grade explanations with a strong player** (step 2 of the plan), on real human games
  rather than engine-vs-engine games.
- **Run the LLM explanation path** against the live API and compare it with the templates.
- **Try Maia** as the normal opponent and as the student in simulations, so the
  mistakes are human-like.
