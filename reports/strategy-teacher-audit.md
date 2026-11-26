# Strategy teacher: audit on real games, and a benchmark without a strong player

Status: draft, Nov 2026. Uncommitted research on top of `main` (6e7a3f5).

## 1. How the audit was run

- **Games:** the first 40 MB of the Lichess October 2026 dump (CC0), filtered to rated
  rapid and classical games (10+ minutes), normal finish, 25+ moves, both players in one
  band. Bands are Lichess ratings, which run roughly 300 to 400 above chess.com and FIDE
  at this level, so they cover the target player (600 to 1400 elsewhere):

  | Band (Lichess) | Ratings     | Games in pool |
  | -------------- | ----------- | ------------- |
  | 1100           | 1000 – 1200 | 1,609         |
  | 1400           | 1300 – 1500 | 2,552         |
  | 1700           | 1600 – 1800 | 2,471         |

  The pool is ordered by a hash of each game's URL. The audit used the first 10 games per
  band; the benchmark draws from the rest, so nothing looked at here can end up in it.
  (`reports/audit/pool.jsonl`.)

- **Teacher:** the real core, unchanged, from each player's side in turn: `startUserTurn`
  and `userMove` at the app's defaults (depth 12, classical check on). The other side's
  moves are the real ones, so the teaching opponent doesn't play; consequences are checked
  against the real game as the session does. Lessons the classical check rejected are
  rebuilt to see what they would have said.
- **Reference:** Stockfish 19 at depth 18, MultiPV 3, on every position. A move's cost is
  the drop in Lichess's winning chances (0 to 100%): 10+ is an inaccuracy, 20+ a mistake,
  30+ a blunder, as on Lichess.
- **Wording:** the report shows the template explanation (the prototype's English). The
  LLM coach (`apps/api/src/explain.ts`) is told to use only the facts, not to analyse the
  position, and to name the measured factor, so it can reword these facts but can't add
  an idea they don't contain. It was not run (no tokens spent).

Tool: `tools/sim/src/audit-real-games.ts`. Full output: `reports/audit/<band>/audit.md`.

## 2. Findings

30 games, 59 sides with at least one flagged move, 289 lessons (199 material, 84
strategic, 6 mate).

| Band | Blunders (30%+) | Mistakes (20–29%) | Inaccuracies (10–19%) | …with a lesson (B / M / I) | Lessons | Strategic | Strategic on moves losing <10% |
| ---- | --------------- | ----------------- | --------------------- | -------------------------- | ------- | --------- | ------------------------------ |
| 1100 | 51              | 23                | 46                    | 49 / 15 / 30               | 128     | 28        | 18                             |
| 1400 | 30              | 24                | 56                    | 29 / 18 / 24               | 107     | 33        | 24                             |
| 1700 | 9               | 8                 | 23                    | 9 / 7 / 16                 | 54      | 23        | 16                             |

### What works

- **Finding the bad move.** 87 of 90 blunders and 40 of 55 mistakes got a lesson.
- **Naming a better move.** The teacher's better move is the deep engine's top choice, or
  within 5% of it, in at least 276 of 289 lessons. Depth 12 is good enough for *which*
  move; the trouble is *why*.

### What doesn't

**1. Strategic lessons are mostly about moves that weren't mistakes.** 58 of 84 were on
moves that cost under 10% winning chances at depth 18, and 31 of those under 5%. The
35-centipawn strategic bar at depth 12 mostly measures depth-12 noise: the deep engine
doesn't see the gap. Examples: "12...a6: rooks belong on open files" (cost 0%), "19...fxe6:
passed pawns" (3%), "4...Qa5: control the centre" (4%). These are exactly the "engine
preferences no human could articulate" that the concept says not to teach.

**2. When a strategic lesson does land on a real mistake, the reason is usually not the
real one.** The feature that differs most at the end of two 8-ply lines is a symptom, not
the cause. Typical cases:

- 12. Qxf6 (75% → 55%) traded queens in the middle of White's own attack. Lesson: "Qg3
  would have improved your opponent's pawn weaknesses".
- 10...O-O and 11...f4 (15% and 13%) both missed ...Qh4+ against a king stuck in the
  centre. Lessons: "opponent's pawn weaknesses" and "rooks on open files".
- 6...Nc5 (13%) let Nxe5 win the e5 pawn. Lesson: "control of the centre".
- 5...Be6 let Bxe6 fxe6, doubling the e-pawns. Lesson: "piece activity" (the same
  structure, in another game, was correctly taught as a pawn weakness).

There are good ones (4...Be6 Bxe6 fxe6 as doubled pawns; 10...Nd5 allowing Qh5–Qh6 against
the king; 15...f5 opening the g-file), but they're the minority. Of the 13 "target
weaknesses" lessons, I couldn't find one where the opponent's pawn structure was the
point.

**3. Material lessons say *that*, never *what* or *how*.** 199 lessons, every one filed
under four principles ("check checks, captures and threats" 88, "don't leave pieces
undefended" 62, "look for forcing moves" 37, "take free material" 12), with the facts
"material balance +1 → −1". The punishment line, which holds the actual lesson, is only
shown, never described. 28. Bc5 is lost to Bxc5 Rxf7 Kxf7 bxc5 Qxc2, picking up c2 and
f2; 9...Nd5 to Nb5–Nd6+ with the a3 bishop covering f8. A coach names the fork, the
back rank, the overloaded defender. The LLM can't, because it's told to use only the
facts and not to analyse.

**4. Severity is sometimes wrong in the player's face.** 103 lessons say "your move
wasn't a disaster, but…"; 30 of them were on moves that cost 20%+, 16 on blunders. 20. e7+
(91% → 14%) and 26...Qxb4 (50% → 18%) are both "wasn't a disaster". The missed-chance
branch decides this from material along the engine's line, not from how much the move
cost.

**5. Missed mates aren't their own lesson.** 8...Be6 with Rd1# on the board is taught as
"material / check checks, captures and threats".

**6. Real positional mistakes go untaught.** 18 moves costing 20%+ got no lesson; 14 of
them because the classical check rejected the lesson (usually rightly: the feature was
wrong). 73 moves costing 10%+ got nothing. The check removes bad reasons but has nothing
to put in their place.

**7. Volume at 1100.** A median of 4 lessons per side per game, up to 16. With one reveal
at a time that's manageable, but it means choosing *which* lesson to teach matters more
than finding more.

### What this says about the design

Detection is fine. The weak link is diagnosis: a lesson is the feature with the largest
difference at the end of two engine lines, so it can only ever say "this number went
down", and the number is often not why the move was bad. Thresholds, the classical check
and the wording can't fix that; the facts have to contain the idea. In order of how much
they'd improve what players see:

1. **Describe the punishment.** From the opponent's reply and the line after it: what it
   attacks, which motif wins material (fork, pin, skewer, discovered attack, removing the
   defender, overloaded piece, back rank, trapped piece) and what falls. This covers about
   70% of lessons and is checkable by code.
2. **Fix severity and mates.** "Wasn't a disaster" only on small costs; missed mate as its
   own lesson. Small, mechanical changes.
3. **Raise the bar for strategic lessons:** confirm the gap at a deeper search before
   teaching, and drop the "opponent's pawn weaknesses" missed chance unless something
   checkable supports it.
4. **Find strategic reasons by experiment, not by correlation:** the threat after a null
   move, and piece and pawn counterfactuals (3.4), in place of the largest feature
   difference.

Caveats: one engine run per position, so depth-18 numbers have some noise of their own;
the rebuilt "rejected" lessons are re-analysed, so a few differ from what the check saw
(five came back as material lessons); and the judgements of *why* in this section are mine,
from the engine lines, not a strong player's.

## 3. A benchmark without a strong player

Without a strong player to grade lessons, every label has to be one that something other
than my judgement can check. So the benchmark separates what an engine can settle from
what it can't, and treats the second kind with suspicion.

### 3.1 Items

An item is a real position from the pool (never the audit's games), the move the player
made, the moves before it, and the rating band. Two kinds:

- **Teachable:** the move lost 15%+ winning chances at depth 24 and the position wasn't
  already decided (winning chances between 15% and 85% before the move).
- **Should stay quiet:** the move lost under 4%, but the teacher's features differ between
  the played and best lines, so a feature-driven teacher is tempted. "Never confidently
  wrong" makes staying silent here as important as speaking up elsewhere.

### 3.2 Labels, from most to least trustworthy

| Label                          | How it's made                                                                                                                                                                                   | Trust                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Teachable or not               | Depth 24, winning-chance drop                                                                                                                                                                   | Engine                           |
| Acceptable better moves        | Every move within 3% of the best, not just the top one                                                                                                                                          | Engine                           |
| The punishment                 | The opponent's best reply and the line until the position is quiet; what it wins once exchanges settle (material, mate, or nothing)                                                            | Engine                           |
| Tactical motif                 | Rules over the punishment line: hanging piece, fork, pin, skewer, discovered attack, removing the defender, overloaded piece, back rank, trapped piece, promotion. Each rule has its own tests. | Code, checkable                  |
| Strategic concept              | Only for items whose punishment wins nothing concrete. Three independent annotators label each from a fixed coach taxonomy (3.3) with the engine data in hand, blind to the teacher's code and each other; an item counts only when 2 of 3 agree, and a counterfactual probe backs it (3.4). | Weakest; scored separately       |

### 3.3 The concept taxonomy

From what coaching curricula teach at this level (the ideas, not any book's text):
"what does their last move want" (missed threat), hanging piece, unprotected piece
(loose, not yet attacked), the tactical motifs above, trading when ahead or behind,
developing before attacking, castling and opening lines towards an uncastled king, moving
the same piece twice, the early queen, pawn breaks, weakening the king's pawns, bad
bishop, knight outposts, rooks on open files and the seventh rank, passed pawns, improving
the worst piece, prophylaxis, king activity, opposition, and the "none fits" answer.

### 3.4 Counterfactual probes

A strategic claim is only labelled if the engine backs it with an experiment, not a
correlation:

- **Threat:** a null move after the player's move (let the opponent move twice) shows
  what the opponent was threatening.
- **Piece claims** ("your bishop is bad", "their knight on d5 is strong"): remove or move
  the piece in both lines and check that the gap between them shrinks.
- **Pawn claims:** the same with the pawn in question.

The same probes are candidates for the teacher itself, in place of or next to the
Stockfish 11 term check.

### 3.5 Scores

1. **Flagging:** lessons on teachable items, silence on quiet ones.
2. **Names the punishment:** the facts or explanation contain the opponent's key reply
   (or, for a missed chance, the winning idea).
3. **Motif** and **concept** match, each only on items that have that label.
4. **Nothing false:** every checkable claim in the output (squares, pieces, "undefended",
   "open file") is checked against the position by code. One false claim fails the item.
5. **Would a learner get it:** the one thing no engine can grade. A blind grader rates
   clarity and whether the lesson generalises; Will rates a sample of 20 as the target
   learner. This is a check on the others, not something to optimise.

### 3.6 Keeping it blind

- 60 dev items I iterate on; 40 test items whose labels are generated by a separate agent
  into a file the scoring script reads and I don't. The test score is printed only as
  aggregates, and run rarely (once per significant change), so it can't be tuned to.
- The pool's ordering already keeps the audit's games out.
- What I can't fix: the annotators and I are the same kind of model, so we share blind
  spots on strategic concepts. That's why concept labels need a counterfactual probe and
  a 2-of-3 agreement, and why they're scored apart from the engine-backed ones.
