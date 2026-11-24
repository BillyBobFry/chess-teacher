# Near-miss experiment: findings (Nov 2026)

Question: if strategic lessons needed a smaller eval gap (35 cp instead of 70), with the
classical check still deciding which ones get taught, how many more would we get, and would
they be right?

Method: `tools/sim/src/near-miss.ts` plays games as the app does, and at every student move
also runs lesson detection at the lower bar. Lesson detection is unchanged, so parity with
the Python prototype is unaffected. Two runs of 20 games each: a very weak student (Stockfish
skill 0) and a stronger one (skill 6, closer to a 1000-1400 player). Stockfish 19 WASM in
Node, depth 10; Stockfish 11 for the classical check. Full lesson lists:
`near-miss-skill0.md` and `near-miss-skill6.md`.

## Numbers

|                                                   | Skill 0 student | Skill 6 student |
| ------------------------------------------------- | --------------- | --------------- |
| Lessons taught today, per game                    | 3.0             | 3.1             |
| …strategic, per game                              | 0.5 (15%)       | 0.8 (24%)       |
| Strategic lessons today's check rejects, per game | 1.2             | 1.1             |
| Extra strategic lessons at 35 cp, kept, per game  | 0.5             | 0.8             |
| Strategic share with the lower bar                | 26%             | 40%             |

A lower bar roughly **doubles** strategic lessons. About half the extra candidates are
rejected by the classical check (26 of 35 for skill 0, 18 of 34 for skill 6).

### "You blundered" vs "you missed it"

Material lessons the app teaches today, sorted by what actually happened:

|                                                                    | Skill 0 | Skill 6 |
| ------------------------------------------------------------------ | ------- | ------- |
| Blunder: lost your own material                                    | 30      | 26      |
| Missed free material: a capture was already there and you didn't take it | 11      | 13      |
| Missed tactic: the better line won material by force               | 11      | 8       |

**Over 40% of "tactical" lessons are missed opportunities, not blunders.** Most missed-free-
material lessons are recorded as *consequences*, so they appear under "Check checks,
captures and threats" with "You're about to lose material" text, although nothing was lost.

## Judging the 25 kept near misses

Judged by reading the two lines and the measured facts, not by a strong player, so treat it
as a first pass.

| Run     | Real reason | Partly (right idea, wrong label or minor reason) | Wrong |
| ------- | ----------- | ------------------------------------------------ | ----- |
| Skill 0 | 2           | 3                                                | 4     |
| Skill 6 | 9           | 6                                                | 1     |

Good examples (skill 6):

- **8...Bxg2** (open files): grabbing g2 hands White's rook the open g-file.
- **36...Ne6** (open files): lets White's rook take the a-file; Qf6 and Rc6 claim the c-file first.
- **29. Rb1** (activity): the passive rook lets Black's rook into the second rank; Rd1 stays active.
- **7. e5** (pawns): after Nd5 and Nxc3 White is left with doubled c-pawns and an isolated a-pawn.
- **5. c4** (king safety): weakens the pawns on the side White then castles on.
- **41...Rb6** (king safety): with an exposed king, trade queens (b4 and Qc3).
- **38. Kd4** (passed pawns): allows e5+ with tempo; Kc4 keeps the pawn blockaded.

Wrong ones, and what they have in common:

- **Opening nitpicks.** 1.c4 d6 and 1.e4 e5 2.Nf3 d6 are flagged as development or activity
  mistakes. Both are normal opening moves; a 0.4 gap in the first few moves isn't a lesson.
- **Queen trades read as lost activity.** 20...Ke8: the mobility count drops from 45 to 20
  mainly because queens come off, which the activity feature counts as lost moves.
- **Tactics with a strategic label.** 15. Kg1 ("centre") and 21. Rab1 ("centre") are really
  about pawns won or lost in the lines.

"Partly" was mostly the right idea under a neighbouring label: 12...Rc8 is taught as
activity but is really "White opens the a-file and a rook invades on a7".

## What this suggests

1. **A lower bar for strategic lessons is worth doing**, but not on its own. With a stronger
   student, about 9 in 16 kept lessons were right and only 1 was clearly wrong. With the weak
   student, accuracy was poor, because its games are mostly tactics.
2. **Guards to add with it:** no lower bar in the first ~5 moves (or skip book moves); leave
   queen moves out of the mobility count when queens come off in one line only; keep the
   current bar for features with no classical term (king activity was rejected every time anyway).
3. **The "missed it" split is clearly justified** by the material numbers above, and is
   independent of the bar.
4. **Before shipping:** a strong player should grade both reports, and the bar should be set
   per feature from that grading rather than one number.

Caveat: students are Stockfish at reduced skill, not humans. Their mistakes are spread
differently from a real 1000-1400 player's.
