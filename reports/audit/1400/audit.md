# Teacher audit on real Lichess games

| Band (Lichess) | Mistakes+blunders (≥20% drop) | …with a lesson | Lessons | Lessons on moves losing <10% | Strategic lessons | Rejected by classical check |
|---|---|---|---|---|---|---|
| 1400 | 54 | 47 | 107 | 36 | 33 | 51 |

## Game 1 (1400), White: Pirc Defense

https://lichess.org/game/4koJ2dU6 · 1328 vs 1307 · 0-1

### 1w-14: 8. Bg5 — inaccuracy (70% → 59%)

- Engine best: **g4**; line: 8. g4 h6 9. h4 Qd8 10. g5 hxg5 11. hxg5 Rxh1+ 12. Qxh1 Nfd7
- Others: a3 (69%), Bd2 (67%)
- After Bg5: 8...b5 9. Bb3 Be7 10. Bd2 Na6 11. Nd1 Qc7 12. a4 Nc5 13. axb5
- *No lesson.*

### 1w-18: 10. Nd5 — ok (65% → 61%)

- Engine best: **g4**; line: 10. g4 Nfd7 11. h4 Qd8 12. a4 Na6 13. g5 Nb6 14. Ba2 Nb4
- Others: a3 (64%), h4 (62%)
- After Nd5: 10...Qd8 11. Ne3 b5 12. Bb3 Na6 13. a4 Nc5 14. axb5 cxb5 15. O-O
- **Lesson:** mobility / activity / missed_chance, gap 53cp, pending; check: Mobility is a main reason (+0.47)

```
On move 10 you played Nd5. g4 was better.

  What you played:  10. Nd5 Qd8 11. Ne3 b5 12. Bb3 Nbd7 13. a4 Nc5
  What was better:  10. g4 Qd8 11. a4 Ne8 12. h4 Nc7 13. g5 Nd7

Your move wasn't a disaster, but g4 would have improved piece activity.
After the better line: 37 piece moves available vs opponent's 17. After yours: 31 piece moves available vs opponent's 24.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 1w-24: 13. Qg3 — ok (56% → 51%)

- Engine best: **b4**; line: 13. b4 Kh8 14. g3 Bg5 15. Bc3 g6 16. Rae1 Bh6 17. Bb3 Bg7
- Others: a3 (55%), a4 (54%)
- After Qg3: 13...b5 14. Bb3 Nc5 15. a3 Nxb3 16. cxb3 a5 17. b4 axb4 18. axb4
- **Lesson:** own_pawns / pawn_weaknesses / consequence, gap 55cp, pending; check: Pawns is a main reason (+0.38)

```
On move 13 you played Qg3. b4 was better.

  What you played:  13. Qg3 b5 14. Bb3 Nc5 15. a3 Nxb3 16. cxb3 a6
  What was better:  13. b4 Re8 14. c3 Nf8 15. g3 Ne6 16. h4 b5

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: doubled pawns on the b-file; backward pawn(s) on d3. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

### 1w-54: 28. Bc5 — mistake (73% → 50%)

- Engine best: **Ra8+**; line: 28. Ra8+ Rf8 29. Ra7 Rf7 30. c3 Qh5 31. Ra6 Rf8 32. h4 Qxh4+
- Others: c3 (71%), Ra6 (65%)
- After Bc5: 28...Bxc5 29. Rxf7 Kxf7 30. bxc5 Qxc2 31. Qxe5 Qxf2 32. Qc7+ Kf6 33. e5+
- **Lesson:** material / safety / consequence, gap 174cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before.

```
On move 28 you played Bc5. Rc7 was better.

  What you played:  28. Bc5 Bxc5 29. Rxf7 Kxf7 30. bxc5 Qxc2 31. Qxe5 Qxf2
  What was better:  28. Rc7 Bxb4 29. Rxc6 Qd7 30. Rb6 Ba5 31. Ra6 Bd2

The difference is material. Before your move: material balance +1.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1w-76: 39. c7 — blunder (50% → 2%)

- Engine best: **e5+**; line: 39. e5+ Kg5 40. c7 Qxc7 41. Qxb2 Qc4 42. Qb8 Qc5 43. Qd8+ Kf5
- Others: g4 (2%), Qb8 (2%)
- After c7: 39...Qxc7+ 40. Kg1 Qc1+ 41. Kf2 b1=Q 42. Qxb1 Qxb1 43. Ke3 Ke5 44. h4
- **Lesson:** material / hanging / consequence, gap 963cp, pending

```
On move 39 you played c7. e5+ was better.

  What you played:  39. c7 Qxc7+ 40. Kg1 Qc1+ 41. Kf2 b1=Q
  What was better:  39. e5+ Kf5 40. c7 Qf4+ 41. Kh1 Qc1+

The difference is material. Before your move: material balance +0.
After your line: material balance -9. After the better line: material balance +0.
Your move left this undefended: the piece you moved, now on c7.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 1 (1400), Black: Pirc Defense

https://lichess.org/game/4koJ2dU6 · 1328 vs 1307 · 0-1

### 1b-7: 4... Qa5 — ok (50% → 46%)

- Engine best: **b5**; line: 4...b5 5. Bb3 b4 6. e5 dxe5 7. Nxe5 e6 8. Na4 c5 9. O-O
- Others: d5 (48%), Bg4 (48%)
- After Qa5: 5. O-O d5 6. Bd3 Bg4 7. b4 Qb6 8. Rb1 Nbd7 9. exd5 cxd5
- **Lesson:** centre / centre / missed_chance, gap 38cp, pending; check: Mobility is a main reason (+1.90)

```
On move 4 you played Qa5. b5 was better.

  What you played:  4...Qa5 5. Bb3 Bg4 6. h3 Qh5 7. d4 Bxf3 8. gxf3
  What was better:  4...b5 5. Bb3 b4 6. e5 dxe5 7. Nxe5 e6 8. Na4

Your move wasn't a disaster, but b5 would have improved control of the centre.
After the better line: centre control 6 vs 2. After yours: centre control 6 vs 11.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 1b-13: 7... e5 — inaccuracy (43% → 30%)

- Engine best: **Nbd7**; line: 7...Nbd7 8. Bd2 g6 9. Nd5 Qd8 10. Nxf6+ Nxf6 11. g4 e6 12. h4
- Others: e6 (43%), g6 (43%)
- After e5: 8. g4 h6 9. h4 Qd8 10. g5 hxg5 11. hxg5 Rxh1+ 12. Qxh1 Nfd7
- *Rejected lesson:* mobility / activity; Mobility is a main reason (+0.38)

### 1b-15: 8... Be7 — ok (41% → 36%)

- Engine best: **b5**; line: 8...b5 9. Bb3 Be7 10. Bd2 Na6 11. Nd1 Qc7 12. a4 Nc5 13. axb5
- Others: Be7 (37%), Nbd7 (36%)
- After Be7: 9. Bd2 O-O 10. g4 Nfd7 11. h4 Qc7 12. a3 b5 13. Ba2 Nc5
- **Lesson:** mobility / activity / consequence, gap 39cp, pending; check: Mobility is a main reason (+0.62)

```
On move 8 you played Be7. b5 was better.

  What you played:  8...Be7 9. Bd2 Qd8 10. a3 O-O 11. g4 Ne8 12. h4
  What was better:  8...b5 9. Bb3 Be7 10. O-O Nbd7 11. Ne2 O-O 12. a4

The difference is piece activity. Before your move: 22 piece moves available vs opponent's 34.
After your line: 12 piece moves available vs opponent's 37. After the better line: 26 piece moves available vs opponent's 34.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 1b-37: 19... fxe6 — ok (49% → 46%)

- Engine best: **Qxe6**; line: 19...Qxe6 20. Qg4 Qxg4 21. hxg4 h6 22. g3 Rfb8 23. c3 Kf8 24. Kg2
- Others: fxe6 (45%), Qb7 (7%)
- After fxe6: 20. Qg4 Ra4 21. c4 Rfa8 22. Rxa4 bxa4 23. Ra1 d5 24. exd5 cxd5
- **Lesson:** passed_pawns / passed_pawns / consequence, gap 45cp, pending; check: Passed is a main reason (+0.64)

```
On move 19 you played fxe6. Qxe6 was better.

  What you played:  19...fxe6 20. Ra5 c5 21. Rfa1 Rxa5 22. bxa5 Ra8 23. Qg4
  What was better:  19...Qxe6 20. Qg4 Qxg4 21. hxg4 h6 22. Ra5 Bg5 23. Bc3

The difference is passed pawns. Before your move: your passed pawns: none; theirs: none.
After your line: your passed pawns: none; theirs: a5. After the better line: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

### 1b-39: 20... Rxa1 — ok (48% → 43%)

- Engine best: **Ra4**; line: 20...Ra4 21. c4 Rfa8 22. Rxa4 bxa4 23. Ra1 a3 24. Ra2 d5 25. c5
- Others: c5 (48%), Rfb8 (47%)
- After Rxa1: 21. Rxa1 d5 22. Qg4 Kh8 23. exd5 cxd5 24. Be3 d4 25. Bd2 Qc6
- **Lesson:** mobility / activity / missed_chance, gap 44cp, pending; check: Mobility is a main reason (+0.48)

```
On move 20 you played Rxa1. c5 was better.

  What you played:  20...Rxa1 21. Rxa1 c5 22. bxc5 dxc5 23. Ra6 Rc8 24. Be3
  What was better:  20...c5 21. bxc5 dxc5 22. Reb1 b4 23. Qg4 Be7 24. Bc1

Your move wasn't a disaster, but c5 would have improved piece activity.
After the better line: 39 piece moves available vs opponent's 29. After yours: 23 piece moves available vs opponent's 27.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 1b-43: 22... dxe4 — ok (45% → 37%)

- Engine best: **d4**; line: 22...d4 23. Bd2 Kh8 24. Qg4 Be7 25. Ra6 h6 26. Qg6 Bd6 27. g4
- Others: Rc8 (40%), Rf7 (38%)
- After dxe4: 23. dxe4 Rd8 24. Qg4 Qe8 25. Ra6 h5 26. Qe2 Be7 27. c3 Kh7
- **Lesson:** material / hanging / missed_chance, gap 77cp, pending

```
On move 22 you played dxe4. d4 was better.

  What you played:  22...dxe4 23. dxe4 Rd8 24. Qg4 Qe8 25. Ra7 h5 26. Qe2
  What was better:  22...d4 23. Bg5 Bxg5 24. Qxg5 Qc7 25. Qg4 Qf7 26. Ra6

Your move wasn't a disaster, but d4 would have improved material.
After the better line: material balance +1. After yours: material balance +0.
Your move left this undefended: the piece you moved, now on e4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1b-45: 23... Be7 — inaccuracy (37% → 27%)

- Engine best: **Rd8**; line: 23...Rd8 24. Qg4 Qe8 25. Ra6 h5 26. Qe2 Rc8 27. Qd2 Be7 28. Kh2
- Others: Rc8 (36%), Qf7 (36%)
- After Be7: 24. c3 Bf6 25. Qg4 Kh8 26. Rd1 Qc8 27. Rd6 Kg8 28. Qxe6+ Qxe6
- *Rejected lesson:* centre / centre; Mobility is a main reason (+0.47)

## Game 2 (1400), White: Caro-Kann Defense: Advance Variation, Short Variation

https://lichess.org/game/bVIS24gh · 1456 vs 1432 · 0-1

### 2w-14: 8. c3 — ok (56% → 50%)

- Engine best: **c4**; line: 8. c4 dxc4 9. Qxc4 cxd4 10. Qxd4 Qb6 11. Qe4 Ne7 12. Nc3 Qc6
- Others: Bg5 (52%), dxc5 (51%)
- After c3: 8...Ne7 9. dxc5 Nxc5 10. Qe2 a6 11. Rd1 Qc7 12. c4 dxc4 13. Qxc4
- *Rejected lesson:* mobility / activity; Mobility is a main reason (+0.14)

### 2w-20: 11. bxc4 — ok (58% → 50%)

- Engine best: **a4**; line: 11. a4 a6 12. Na3 Nb6 13. Rb1 Qd7 14. h4 Nf5 15. g4 Ne7
- Others: h4 (56%), Na3 (54%)
- After bxc4: 11...bxc4 12. Qc2 Rb8 13. Nbd2 Nc6 14. h4 h6 15. Re1 Qa5 16. Nf1
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only 0.00

### 2w-26: 14. Nd6+ — mistake (51% → 26%)

- Engine best: **g4**; line: 14. g4 axb5 15. gxf5 Be7 16. Rb1 Qa5 17. Bg5 Qxc3 18. Rxb5 Qa3
- Others: Na3 (48%), Bg5 (41%)
- After Nd6+: 14...Nxd6 15. exd6 Bxd6 16. Bg5 Qa5 17. Qe3 O-O 18. Bh4 Rab8 19. g4
- **Lesson:** material / safety / consequence, gap 290cp, triggered after 2 plies
- Trigger: You've lost a knight: you're 3 pawns worse off than before.

```
On move 14 you played Nd6+. g4 was better.

  What you played:  14. Nd6+ Nxd6 15. exd6 Bxd6 16. Bg5 Qa5 17. Rab1 O-O
  What was better:  14. g4 axb5 15. gxf5 Be7 16. Kh1 Nf8 17. Rg1 Qa5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2w-34: 18. Nc6 — ok (37% → 30%)

- Engine best: **f3**; line: 18. f3 Re8 19. Qe3 Qc7 20. g4 Reb8 21. Bxd6 Qxd6 22. g5 Nd7
- Others: Rae1 (36%), Rab1 (36%)
- After Nc6: 18...Qc7 19. Ne5 Rfb8 20. Qe1 Ra7 21. f3 Rab7 22. Qd2 Nb5 23. Bc5
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.08

### 2w-46: 24. Ne3 — inaccuracy (50% → 36%)

- Engine best: **h4**; line: 24. h4 Nf7 25. Qxe6 Nxh4 26. f4 Re8 27. Qxd5 Qc8 28. Qh5 Nf5
- Others: Bc1 (38%), Ne3 (36%)
- After Ne3: 24...Re8 25. Nxf5 exf5 26. Qb1 g6 27. Qc2 Ne6 28. Bc1 Kf7 29. Rb1
- *No lesson.*

### 2w-60: 31. Bd6 — blunder (93% → 2%)

- Engine best: **Rf2**; line: 31. Rf2 Qd3 32. Re1 h6 33. Bb4 Rb5 34. Qf7 Qf5 35. Re8+ Rxe8
- Others: Kh1 (93%), Bb4 (92%)
- After Bd6: 31...Rb2+ 32. Rf2 Rxf2+ 33. Kh1 Qg2#
- **Lesson:** mate / safety / consequence, gap 10591cp, pending

```
On move 31 you played Bd6. Rg1 was better.

  What you played:  31. Bd6 Rb2+ 32. Rf2 Rxf2+ 33. Kh1 Qg2#
  What was better:  31. Rg1 Qc2+ 32. Kh1 Qxc3 33. Bd6 Rb5

After your move, your opponent had a forced checkmate.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 2 (1400), Black: Caro-Kann Defense: Advance Variation, Short Variation

https://lichess.org/game/bVIS24gh · 1456 vs 1432 · 0-1

### 2b-23: 12... Nf5 — ok (51% → 48%)

- Engine best: **Qa5**; line: 12...Qa5 13. Nb1 Rb8 14. a4 Nf5 15. Qc2 Rb3 16. Bb2 Rb7 17. Nbd2
- Others: Rb8 (50%), Nc6 (50%)
- After Nf5: 13. Nc2 Qa5 14. Qe1 Rb8 15. Ne3 Nxe3 16. fxe3 Be7 17. e4 dxe4
- **Lesson:** development / develop / missed_chance, gap 42cp, pending; check: Mobility is a main reason (+0.51)

```
On move 12 you played Nf5. Nc6 was better.

  What you played:  12...Nf5 13. Nc2 Qa5 14. Bd2 Rb8 15. Rfb1 Rxb1+ 16. Rxb1
  What was better:  12...Nc6 13. h4 Qa5 14. Nb1 Qa4 15. Ng5 Be7 16. f4

Your move wasn't a disaster, but Nc6 would have improved development.
After the better line: all minor pieces developed. After yours: undeveloped: bishop on f8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

### 2b-27: 14... Bxd6 — inaccuracy (74% → 58%)

- Engine best: **Nxd6**; line: 14...Nxd6 15. exd6 Bxd6 16. Bg5 Qa5 17. Qe3 O-O 18. Bh4 Rab8 19. g4
- Others: Bxd6 (59%), Ke7 (5%)
- After Bxd6: 15. exd6 Nxd6 16. Bf4 Ne4 17. Qe3 Qe7 18. Qc1 O-O 19. h3 h6
- *Rejected lesson:* mobility / activity; Mobility is a main reason (+0.19)

### 2b-41: 21... Nf5 — ok (72% → 66%)

- Engine best: **h5**; line: 21...h5 22. Bxd6 Qxd6 23. f3 Nxc3 24. Nxf6+ Rxf6 25. Qxc3 Rb8 26. Rab1
- Others: Rfe8 (68%), Nf5 (65%)
- After Nf5: 22. Qc1 Rfe8 23. Ne3 Nxe3 24. Qxe3 Ng5 25. f3 h5 26. Qf2 Rab8
- *Rejected lesson:* outposts / outposts; Knights/Bishops gains only -0.19

### 2b-43: 22... Rfb8 — inaccuracy (68% → 52%)

- Engine best: **Rfe8**; line: 22...Rfe8 23. Ne3 Qa5 24. Bb4 Qa4 25. Nxc4 a5 26. Nxa5 Rxa5 27. f3
- Others: Rfd8 (59%), h5 (57%)
- After Rfb8: 23. f3 Ned6 24. Qxe6+ Qf7 25. Qxf7+ Nxf7 26. Kf2 h5 27. Ne3 Nxe3
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: Mobility 0.75, Threats 0.24)

### 2b-49: 25... Qf7 — blunder (64% → 16%)

- Engine best: **Re8**; line: 25...Re8 26. Rae1 Nf7 27. Re2 e5 28. Rfe1 h6 29. h4 Qc6 30. Bc5
- Others: Rb6 (62%), Qc6 (61%)
- After Qf7: 26. h4 Nxf3+ 27. Qxf3 h5 28. Rae1 Rb5 29. Qe2 Re8 30. Bd6 Rd8
- **Lesson:** material / safety / consequence, gap 660cp, pending

```
On move 25 you played Qf7. Rb6 was better.

  What you played:  25...Qf7 26. h4 Nh3+ 27. gxh3 Rb5 28. Kh2 Rab8 29. f4
  What was better:  25...Rb6 26. Rae1 h5 27. Re2 Rab8 28. Rfe1 Nf7 29. Bc5

The difference is material. Before your move: material balance +1.
After your line: material balance -2. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2b-51: 26... Nh3+ — ok (16% → 13%)

- Engine best: **h6**; line: 26...h6 27. hxg5 hxg5 28. Rae1 Rb6 29. f4 g4 30. Kh2 f5 31. Bc5
- Others: Nxf3+ (16%), Nh3+ (14%)
- After Nh3+: 27. Kh2 Rb6 28. Kxh3 Re8 29. Rae1 h6 30. Kh2 a5 31. Rf2 Kh7
- **Lesson:** material / safety / consequence, gap 78cp, triggered after 2 plies
- Trigger: You've lost a knight: you're 3 pawns worse off than before.

```
On move 26 you played Nh3+. h6 was better.

  What you played:  26...Nh3+ 27. Kh2 a5 28. Kxh3 Re8 29. Bc1
  What was better:  26...h6 27. hxg5 hxg5 28. Rfe1 Rb6 29. Bc5

The difference is material. Before your move: material balance +1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2b-55: 28... Rb7 — ok (16% → 8%)

- Engine best: **Qf5**; line: 28...Qf5 29. Rf2 Rb6 30. Rg2 Kh8 31. Re1 Rab8 32. h5 h6 33. Bb4
- Others: Rb6 (15%), Kf7 (14%)
- After Rb7: 29. Qxe6+ Kh8 30. Rf2 Qd3 31. Bb4 Rg8 32. Re1 Rbb8 33. Qg4 Ra8
- **Lesson:** material / hanging / consequence, gap 102cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 28 you played Rb7. a5 was better.

  What you played:  28...Rb7 29. Qxe6+ Kh8 30. Rae1 Rbb8 31. Rg1 Re8 32. Rxg6
  What was better:  28...a5 29. Rg1 Qf5 30. Rg2 Kh8 31. Re1 Rb6 32. Reg1

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -2.
Your move left this undefended: pawn on e6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 3 (1400), White: Blackmar-Diemer Gambit: Zeller Defense

https://lichess.org/game/1UKjx5Mj · 1348 vs 1364 · 1-0

### 3w-2: 2. d4 — inaccuracy (57% → 44%)

- Engine best: **exd5**; line: 2. exd5 Nf6 3. d4 Nxd5 4. Nf3 e6 5. c4 Nf6 6. Nc3 c5
- Others: e5 (50%), d3 (50%)
- After d4: 2...dxe4 3. Nc3 Nf6 4. Bg5 c6 5. Bxf6 exf6 6. Nxe4 f5 7. Nc5
- **Lesson:** material / hanging / consequence, gap 114cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 2 you played d4. exd5 was better.

  What you played:  2. d4 dxe4 3. Nc3 Nf6 4. Nge2 Nc6 5. h3 h6
  What was better:  2. exd5 Qxd5 3. Nc3 Qd8 4. Nf3 Nf6 5. d4 Bf5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: pawn on e4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 3w-6: 4. f3 — ok (49% → 46%)

- Engine best: **g4**; line: 4. g4 Bg6 5. Nge2 e5 6. Be3 Bb4 7. a3 Ba5 8. Qd2 Nf6
- Others: f3 (45%), Nge2 (43%)
- After f3: 4...Nf6 5. g4 Bg6 6. g5 Nd5 7. Nxe4 Nc6 8. Bb5 e5 9. Bxc6+
- *Rejected lesson:* development / develop; Mobility/Knights/Bishops gains only 0.01

### 3w-10: 6. Bc4 — ok (46% → 44%)

- Engine best: **Bd3**; line: 6. Bd3 Ne7 7. O-O Nbc6 8. Kh1 Qd7 9. Ne4 Ng6 10. c3 Be7
- Others: a3 (44%), Bb5+ (43%)
- After Bc4: 6...c6 7. Bd3 Bxd3 8. Qxd3 Nf6 9. Bd2 Nbd7 10. O-O-O Be7 11. Kb1
- **Lesson:** mobility / activity / missed_chance, gap 51cp, pending; check: Mobility is a main reason (+0.34)

```
On move 6 you played Bc4. Bd3 was better.

  What you played:  6. Bc4 c6 7. Qe2 Nd7 8. Bd2 Bd6 9. O-O-O Ngf6
  What was better:  6. Bd3 Bxd3 7. Qxd3 c6 8. Bd2 Nf6 9. O-O-O Be7

Your move wasn't a disaster, but Bd3 would have improved piece activity.
After the better line: 32 piece moves available vs opponent's 23. After yours: 35 piece moves available vs opponent's 37.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 3w-16: 9. Rb1 — inaccuracy (66% → 53%)

- Engine best: **Ba3**; line: 9. Ba3 Nge7 10. Nh4 g6 11. Re1 Nd5 12. Nxf5 gxf5 13. Qf3 Nce7
- Others: Ng5 (59%), Qe2 (59%)
- After Rb1: 9...Nge7 10. Ba3 O-O 11. Nh4 Na5 12. Nxf5 Nxf5 13. Bd3 Nd6 14. Qe2
- **Lesson:** material / forcing_moves / missed_chance, gap 90cp, pending

```
On move 9 you played Rb1. Ng5 was better.

  What you played:  9. Rb1 Na5 10. Bd3 Ne7 11. Ba3 O-O 12. Bxf5 exf5
  What was better:  9. Ng5 Nh6 10. Nxe6 fxe6 11. Bxh6 Qe7 12. Qh5+ Bg6

Your move wasn't a disaster, but Ng5 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 3w-18: 10. Rxb7 — inaccuracy (82% → 68%)

- Engine best: **Qe1**; line: 10. Qe1 Nf6 11. Ba3 Ne7 12. Ne5 Bh5 13. g4 Bg6 14. h4 O-O
- Others: Ba3 (73%), h3 (72%)
- After Rxb7: 10...Nge7 11. Ba3 O-O 12. Rb1 a6 13. Bd3 f5 14. h3 Bh5 15. Qe1
- *No lesson.*

### 3w-36: 19. Bxd7+ — inaccuracy (98% → 86%)

- Engine best: **exd7+**; line: 19. exd7+ Kd8 20. Rxf7 Qxd4+ 21. cxd4 Bxc2 22. Be7#
- Others: Rxf7 (98%), exf7+ (82%)
- After Bxd7+: 19...Kd8 20. Rxd1 fxe6 21. Bxe6 c5 22. Nb3+ Kc7 23. Bd5 Qg6 24. Bxc5
- *No lesson.*

### 3w-38: 20. e7+ — blunder (91% → 14%)

- Engine best: **Rxf7**; line: 20. Rxf7 c5 21. Bc6 Bh5 22. Rb7 Be8 23. Rxb6 axb6 24. Bf3 cxd4
- Others: Rxd1 (86%), Rf5 (73%)
- After e7+: 20...Kxd7 21. Rxd1 Re8 22. Kh1 Kc8 23. h3 h5 24. Nf5 Qf6 25. Rd5
- **Lesson:** material / free_material / missed_chance, gap 654cp, pending

```
On move 20 you played e7+. Rxd1 was better.

  What you played:  20. e7+ Kxd7 21. Rxd1 Re8 22. Kh1 Kc8 23. h3 Qf6
  What was better:  20. Rxd1 fxe6 21. Bxe6 Re8 22. Kh1 Rxe6 23. Nxe6+ Ke8

Your move wasn't a disaster, but Rxd1 would have improved material.
After the better line: material balance +4. After yours: material balance -2.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

## Game 3 (1400), Black: Blackmar-Diemer Gambit: Zeller Defense

https://lichess.org/game/1UKjx5Mj · 1348 vs 1364 · 1-0

### 3b-7: 4... exf3 — ok (54% → 51%)

- Engine best: **Nf6**; line: 4...Nf6 5. g4 Bg6 6. g5 Nd5 7. Nxe4 Nc6 8. Bb5 e5 9. Bxc6+
- Others: exf3 (51%), e5 (49%)
- After exf3: 5. Qxf3 Qc8 6. Nge2 Nf6 7. Bf4 g6 8. h3 c6 9. O-O-O Bg7
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: Mobility 0.56, Knights 0.27)

### 3b-13: 7... Bxc3 — inaccuracy (55% → 41%)

- Engine best: **Nf6**; line: 7...Nf6 8. d5 Qe7 9. Nd4 Bg4 10. Be2 Bxe2 11. Qxe2 exd5 12. Be3
- Others: Ne7 (52%), c6 (50%)
- After Bxc3: 8. bxc3 Ne7 9. Ba3 Nd7 10. Nh4 Bg6 11. Qe2 Nf6 12. Rae1 Ned5
- **Lesson:** king_safety / king_safety / consequence, gap 155cp, pending; check: King safety is a main reason (+2.78)

```
On move 7 you played Bxc3. Nf6 was better.

  What you played:  7...Bxc3 8. bxc3 Ne7 9. Nh4 Nd7 10. Ba3 Bg6 11. Nxg6
  What was better:  7...Nf6 8. a3 Bxc3 9. bxc3 Nbd7 10. Rb1 O-O 11. Bg5

The difference is king safety. Before your move: 2 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.
After your line: 2 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it. After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

### 3b-15: 8... Nc6 — ok (40% → 34%)

- Engine best: **Nd7**; line: 8...Nd7 9. Ng5 Nh6 10. Nxe6 fxe6 11. Bxh6 Qe7 12. Bc1 O-O-O 13. Qe2
- Others: Ne7 (39%), Nc6 (34%)
- After Nc6: 9. Ba3 Nge7 10. Nh4 g6 11. Re1 Nd5 12. Nxf5 gxf5 13. Qf3 Nce7
- *Rejected lesson:* king_safety / king_safety; King safety gains only 0.06

### 3b-17: 9... Bg4 — mistake (47% → 18%)

- Engine best: **Nge7**; line: 9...Nge7 10. Ba3 O-O 11. Nh4 Na5 12. Nxf5 Nxf5 13. Bd3 Nd6 14. Qe2
- Others: Na5 (44%), Nf6 (37%)
- After Bg4: 10. Qe1 Nf6 11. Ba3 Ne7 12. Ne5 Bh5 13. g4 Bg6 14. h4 O-O
- **Lesson:** centre / centre / missed_chance, gap 199cp, pending; check: Mobility is a main reason (+0.65)

```
On move 9 you played Bg4. Nge7 was better.

  What you played:  9...Bg4 10. Qe1 Qd6 11. Ng5 Nf6 12. Bf4 Qd7 13. Be5
  What was better:  9...Nge7 10. Nh4 O-O 11. Ba3 Re8 12. Qh5 Qd7 13. Rf2

Your move wasn't a disaster, but Nge7 would have improved control of the centre.
After the better line: centre control 7 vs 5. After yours: centre control 7 vs 10.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 3b-19: 10... Rb8 — inaccuracy (32% → 18%)

- Engine best: **Nge7**; line: 10...Nge7 11. Ba3 O-O 12. Rb1 a6 13. Bd3 f5 14. h3 Bh5 15. Qe1
- Others: Rb8 (21%), a6 (19%)
- After Rb8: 11. Rxb8 Qxb8 12. h3 Bh5 13. Qe1 Nge7 14. Ba3 Bg6 15. Ne5 Nxe5
- **Lesson:** development / develop / missed_chance, gap 139cp, pending; check: Mobility is a main reason (+0.15)

```
On move 10 you played Rb8. Nge7 was better.

  What you played:  10...Rb8 11. Rxb8 Qxb8 12. h3
  What was better:  10...Nge7 11. Rb5 h6 12. h3

Your move wasn't a disaster, but Nge7 would have improved development.
After the better line: all minor pieces developed. After yours: undeveloped: knight on g8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

### 3b-21: 11... Rxb7 — inaccuracy (20% → 5%)

- Engine best: **Ne7**; line: 11...Ne7 12. Rxb8 Qxb8 13. Qe2 O-O 14. Ba3 Rc8 15. h3 Bh5 16. Bc5
- Others: Kf8 (5%), Rxb7 (5%)
- After Rxb7: 12. Bxc6+ Kf8 13. Ne5 f5 14. Qxg4 Nf6 15. Qe2 Rb6 16. Qc4 Rxc6
- **Lesson:** material / hanging / consequence, gap 543cp, pending

```
On move 11 you played Rxb7. Ne7 was better.

  What you played:  11...Rxb7 12. Bxc6+ Kf8 13. Ba3+ Ne7 14. Bxb7 Kg8 15. Qd3
  What was better:  11...Ne7 12. Rxb8 Qxb8 13. Qe2 O-O 14. Ba3 Rd8 15. Qc4

The difference is material. Before your move: material balance +2.
After your line: material balance -3. After the better line: material balance +0.
Your move left this undefended: knight on c6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 3b-43: 22... c5 — blunder (90% → 14%)

- Engine best: **f6**; line: 22...f6 23. Kg1 Kf7 24. Re1 Re8 25. h4 h5 26. Kf2 Qa5 27. Bb4
- Others: Kd7 (87%), Qf6+ (84%)
- After c5: 23. Nf5 Qc7 24. Rd8+ Qxd8 25. exd8=R+ Kxd8 26. Bxc5 Kd7 27. Bxa7 Ra8
- **Lesson:** material / safety / consequence, gap 735cp, pending

```
On move 22 you played c5. f6 was better.

  What you played:  22...c5 23. Nf5 g6 24. Rd8+ Qxd8 25. exd8=Q+ Kxd8 26. Ne3
  What was better:  22...f6 23. Nf5 Qb5+ 24. Kg1 Kf7 25. Rd8 Re8 26. Rxe8

The difference is material. Before your move: material balance +2.
After your line: material balance -1. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 3b-45: 23... Qb5+ — ok (13% → 9%)

- Engine best: **f6**; line: 23...f6 24. Rd8+ Qxd8 25. exd8=R+ Kxd8 26. Bxc5 g6 27. Ne3 a5 28. Bd4
- Others: Qb8 (11%), Rg8 (11%)
- After Qb5+: 24. c4 Qb8 25. Bxc5 Rg8 26. Rd8+ Qxd8 27. exd8=R+ Kxd8 28. Bxa7 Kd7
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: Threats 0.41, Mobility 0.40)

### 3b-47: 24... Qb8 — ok (13% → 9%)

- Engine best: **Qb6**; line: 24...Qb6 25. Rd8+ Qxd8 26. exd8=Q+ Kxd8 27. Bxc5 g6 28. Ne3 a6 29. Bd4
- Others: Qa5 (13%), Qb8 (11%)
- After Qb8: 25. Bxc5 Rg8 26. Rd8+ Qxd8 27. exd8=Q+ Kxd8 28. Bxa7 Kd7 29. Bc5 Ke6
- *Rejected lesson:* king_activity / king_activity; can't be verified

## Game 4 (1400), White: Indian Defense: Accelerated London System

https://lichess.org/game/oSs2TJj8 · 1457 vs 1427 · 1-0

### 4w-22: 12. Nxd4 — ok (60% → 53%)

- Engine best: **cxd4**; line: 12. cxd4 Bb4 13. Nc3 b6 14. h6 Bb7 15. Be2 Na6 16. Rc1 Qd8
- Others: h6 (59%), Be2 (58%)
- After Nxd4: 12...a6 13. h6 g6 14. Be2 Nc6 15. a4 Re8 16. Na3 Bf8 17. Nf3
- **Lesson:** centre / centre / missed_chance, gap 71cp, pending; check: Space is a main reason (+0.30)

```
On move 12 you played Nxd4. cxd4 was better.

  What you played:  12. Nxd4 a6 13. h6 g6 14. Be2 Nc6 15. Na3 Nxd4
  What was better:  12. cxd4 Bb4 13. Nc3 Bxc3 14. bxc3 b6 15. h6 Bb7

Your move wasn't a disaster, but cxd4 would have improved control of the centre.
After the better line: centre control 8 vs 5. After yours: centre control 3 vs 4.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 4w-24: 13. h6 — ok (63% → 54%)

- Engine best: **Nb5**; line: 13. Nb5 Qb8 14. Nxd6 Qxd6 15. h6 Qd5 16. Rh2 g6 17. Na3 b6
- Others: h6 (52%), O-O (52%)
- After h6: 13...Nxd4 14. cxd4 Rf7 15. hxg7 b6 16. Nc3 Bb7 17. Rh5 Bf3 18. Rh2
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: Threats 0.55, Knights 0.16)

### 4w-26: 14. Qe3 — inaccuracy (65% → 50%)

- Engine best: **Nb5**; line: 14. Nb5 Qb8 15. Nxd6 Qxd6 16. Na3 Rf7 17. Nb5 Qc5 18. b4 Qe7
- Others: Na3 (53%), Be2 (53%)
- After Qe3: 14...Nxd4 15. Qxd4 Rf7 16. Nd2 b5 17. Be2 Bc5 18. Qd3 a5 19. Rc1
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only -0.03

## Game 4 (1400), Black: Indian Defense: Accelerated London System

https://lichess.org/game/oSs2TJj8 · 1457 vs 1427 · 1-0

### 4b-23: 12... Nc6 — ok (47% → 37%)

- Engine best: **a6**; line: 12...a6 13. h6 g6 14. Be2 Nc6 15. a4 Re8 16. Na3 Bf8 17. Nf3
- Others: Be7 (46%), b6 (44%)
- After Nc6: 13. Nb5 Qb8 14. Nxd6 Qxd6 15. h6 Qd5 16. Rh2 g6 17. Na3 b6
- *No lesson.*

### 4b-25: 13... g6 — inaccuracy (46% → 35%)

- Engine best: **Nxd4**; line: 13...Nxd4 14. cxd4 Rf7 15. hxg7 b6 16. Nc3 Bb7 17. Rh5 Bf3 18. Rh2
- Others: a6 (45%), Be7 (45%)
- After g6: 14. Nb5 Qb8 15. Nxd6 Qxd6 16. Na3 Rf7 17. Nb5 Qc5 18. b4 Qe7
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only 0.09

### 4b-29: 15... Bc5 — blunder (50% → 2%)

- Engine best: **Rf7**; line: 15...Rf7 16. Nd2 b5 17. Be2 Rb8 18. Nf3 Bb7 19. O-O Bxf3 20. Bxf3
- Others: e5 (40%), Kf7 (7%)
- After Bc5: 16. Qg7#
- **Lesson:** mate / safety / consequence, gap 10019cp, triggered after 2 plies
- Trigger: You've been checkmated.

```
On move 15 you played Bc5. Rf7 was better.

  What you played:  15...Bc5 16. Qg7#
  What was better:  15...Rf7 16. Nd2

After your move, your opponent had a forced checkmate.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 5 (1400), White: Bishop's Opening

https://lichess.org/game/zUzJ4s9F · 1315 vs 1346 · 1-0

### 5w-8: 5. Qf3 — blunder (85% → 54%)

- Engine best: **Bxf7+**; line: 5. Bxf7+ Kxf7 6. Qd5+ Ke7 7. Qxe4 Nc6 8. Nc3 d6 9. exd6+ Kf7
- Others: Qd5 (74%), Qe2 (71%)
- After Qf3: 5...d5 6. exd6 Nxd6 7. Bb3 Nc6 8. Nc3 Be7 9. Nge2 Ne5 10. Qg3
- **Lesson:** material / forcing_moves / missed_chance, gap 335cp, pending

```
On move 5 you played Qf3. Bxf7+ was better.

  What you played:  5. Qf3 d5 6. exd6 Nxd6 7. Bb3 Qe7+ 8. Ne2 Nc6
  What was better:  5. Bxf7+ Kxf7 6. Qd5+ Ke8 7. Qxe4 Kf7 8. Nc3 d6

Your move wasn't a disaster, but Bxf7+ would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 5w-10: 6. Qd5 — inaccuracy (66% → 53%)

- Engine best: **Bxg5**; line: 6. Bxg5 Qxg5 7. Nc3 Qxe5+ 8. Nge2 Qf6 9. Qe3+ Qe7 10. Qf4 Kd8
- Others: Qe2 (59%), Qe3 (56%)
- After Qd5: 6...c6 7. Qd4 d6 8. exd6 Bxd6 9. Nc3 O-O 10. Be3 Bc7 11. O-O-O
- **Lesson:** development / develop / missed_chance, gap 112cp, pending; check: Mobility is a main reason (+1.03)

```
On move 6 you played Qd5. Bxg5 was better.

  What you played:  6. Qd5 c6 7. Bxg5 cxd5 8. Bxd8 dxc4 9. Bc7 b6
  What was better:  6. Bxg5 Qxg5 7. Nc3 Qxe5+ 8. Nge2 Bd6 9. O-O-O O-O

Your move wasn't a disaster, but Bxg5 would have improved development.
After the better line: all minor pieces developed. After yours: undeveloped: knight on b1, knight on g1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

### 5w-12: 7. Bxg5 — ok (59% → 55%)

- Engine best: **Be3**; line: 7. Be3 c6 8. Qd4 b5 9. Be2 Ne6 10. Qd2 d5 11. exd6 Qxd6
- Others: Ne2 (57%), f4 (56%)
- After Bxg5: 7...hxg5 8. Nc3 c6 9. Qe4 Rh4 10. Qe2 d5 11. exd6 Qxe2+ 12. Bxe2
- *Rejected lesson:* open_files / open_files; Rooks is a main reason (+0.31)

### 5w-14: 8. Nf3 — inaccuracy (53% → 34%)

- Engine best: **Nc3**; line: 8. Nc3 c6 9. Qe4 Rh4 10. Qe2 d5 11. exd6 Qxe2+ 12. Bxe2 Rh6
- Others: Nd2 (51%), Kf1 (37%)
- After Nf3: 8...Nc6 9. g4 f5 10. Nc3 fxg4 11. Nd2 Qxe5+ 12. Nde4 Be7 13. O-O-O
- **Lesson:** material / forcing_moves / missed_chance, gap 169cp, pending

```
On move 8 you played Nf3. Nd2 was better.

  What you played:  8. Nf3 g4 9. Nfd2 Rh5
  What was better:  8. Nd2 c6 9. Qe4 d5

Your move wasn't a disaster, but Nd2 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 5w-16: 9. Qd3 — mistake (36% → 17%)

- Engine best: **Qd6**; line: 9. Qd6 Qxd6 10. exd6 f6 11. Nc3 Bxd6 12. h4 g4 13. Nd4 Be5
- Others: Qd4 (28%), Qd2 (22%)
- After Qd3: 9...d5 10. Nbd2 g4 11. Nd4 Qxe5+ 12. Qe2 Nd7 13. Bd3 g6 14. O-O-O
- **Lesson:** material / safety / consequence, gap 243cp, pending

```
On move 9 you played Qd3. Qd6 was better.

  What you played:  9. Qd3 d5 10. Nbd2 g4 11. Nd4 dxc4 12. Nxc4 Qg5
  What was better:  9. Qd6 Qxd6 10. exd6 Bxd6 11. Nxg5 Be7 12. Nf3 d5

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 5w-24: 13. Nd4 — blunder (66% → 15%)

- Engine best: **Qxg4**; line: 13. Qxg4 d5 14. exd6 Bxg4 15. dxe7+ Bxe7 16. Nbd2 Bc5 17. Rfe1 Bxf3
- Others: exf6 (52%), Nd4 (18%)
- After Nd4: 13...Qxe5 14. Rd1 Qxh2+ 15. Kf1 Kc7 16. c3 Na6 17. Nd2 Nc5 18. Qxg4
- **Lesson:** material / hanging / consequence, gap 510cp, pending

```
On move 13 you played Nd4. Qxg4 was better.

  What you played:  13. Nd4 Qxe5 14. Rd1 Qxh2+ 15. Kf1 Kc7 16. Bf7 Qh1+
  What was better:  13. Qxg4 fxe5 14. Qg3 d6 15. Nbd2 a5 16. a4 bxa4

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.
Your move left this undefended: pawn on e5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 5w-34: 18. c3 — inaccuracy (28% → 13%)

- Engine best: **Nxd5**; line: 18. Nxd5 Na6 19. Ne3 Nc5 20. Rfe1 Kc7 21. a4 b4 22. Rad1 Bg7
- Others: a4 (16%), Rfd1 (15%)
- After c3: 18...Be6 19. g3 Nd7 20. Rfc1 Rc8 21. Bc2 Rh5 22. Bd1 b4 23. h4
- **Lesson:** material / forcing_moves / missed_chance, gap 293cp, pending

```
On move 18 you played c3. Nxd5 was better.

  What you played:  18. c3 Be6 19. a4 b4 20. Bc2 Rh5 21. Nb3
  What was better:  18. Nxd5 Nd7 19. Ne3 Nc5 20. a4 f4 21. Nd1

Your move wasn't a disaster, but Nxd5 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 5w-42: 22. Na5 — inaccuracy (46% → 30%)

- Engine best: **a4**; line: 22. a4 b4 23. cxb4 d4 24. Rfd1 Kc7 25. Nc4 Be6
- Others: Rfe1 (37%), Nc2 (36%)
- After Na5: 22...Kc7 23. Rfd1 Be6 24. b4 a6 25. Nb3 Bf8 26. g3 Rd8 27. Nc2
- *Rejected lesson:* passed_pawns / passed_pawns; Passed gains only 0.06

### 5w-44: 23. Nxc6+ — blunder (59% → 20%)

- Engine best: **g3**; line: 23. g3 Bxe3 24. fxe3 Kc7 25. Rf7+ Bd7 26. Raf1 Rh6 27. b4 Re8
- Others: Rfe1 (39%), Rfd1 (38%)
- After Nxc6+: 23...Kc7 24. Ne7 Bxh2+ 25. Kh1 d4 26. cxd4 exd4 27. N3f5 Bxf5 28. Nxf5
- *Rejected lesson:* open_files / open_files; Rooks isn't a main reason (top: Passed 0.59, Mobility 0.43)

### 5w-50: 26. Ne7+ — blunder (84% → 50%)

- Engine best: **g3**; line: 26. g3 Bxe3 27. Nxe3 Kc7 28. Rfe1 Rh3 29. Rad1 Rah8 30. Rxd7+ Kxd7
- Others: Nxf4 (82%), Rfd1 (77%)
- After Ne7+: 26...Kd8 27. N7d5 Bxh2+ 28. Kh1 Bg3+ 29. Kg1
- **Lesson:** material / safety / consequence, gap 410cp, pending

```
On move 26 you played Ne7+. Nxf4 was better.

  What you played:  26. Ne7+ Kd8 27. N7d5 Bxh2+ 28. Kh1 Bf4+ 29. Kg1 Bh2+
  What was better:  26. Nxf4 exf4 27. Nd5 f3 28. Rfe1 Kb7 29. Re7 Rad8

The difference is material. Before your move: material balance +2.
After your line: material balance +1. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 5w-52: 27. Ng6 — blunder (74% → 12%)

- Engine best: **g3**; line: 27. g3 Rh7 28. gxf4 Rxe7 29. Nd5 Re6 30. fxe5 Rxe5 31. Nf6 Be6
- Others: Rfd1 (72%), Rfe1 (55%)
- After Ng6: 27...Bxh2+ 28. Kh1 Rh6 29. Rfd1 Be6 30. g3 Bxg3+ 31. Kg2 Bf4 32. Ne7
- **Lesson:** material / safety / consequence, gap 406cp, pending

```
On move 27 you played Ng6. Rfd1 was better.

  What you played:  27. Ng6 Bxh2+ 28. Kh1 Rh6 29. Rad1 Be6 30. g3
  What was better:  27. Rfd1 Rad8 28. Nf1 a5 29. Ng6 Rhe8 30. Rd5

The difference is material. Before your move: material balance +2.
After your line: material balance +0. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 5w-56: 29. Nd5 — mistake (76% → 50%)

- Engine best: **Rfd1**; line: 29. Rfd1 Be6 30. Nf1 Rah8 31. Rd4 f3 32. g3 Rh3 33. b3 R8h6
- Others: Rad1 (57%), Nd5 (50%)
- After Nd5: 29...Bc6 30. Nxf4 Rf8 31. Nd3 Rfh8 32. h3 gxh3 33. f3 hxg2 34. Kxg2
- *No lesson.*

### 5w-62: 32. Nxf4 — blunder (87% → 51%)

- Engine best: **gxh3**; line: 32. gxh3 Rxh3 33. Nxf4 Rh2 34. Rad1 Kc8 35. Rd5 Rxb2 36. Rc5+ Kb7
- Others: Nxf4 (54%), Rfe1 (7%)
- After Nxf4: 32...Bc8 33. Nh3 Bxh3 34. gxh3 Rxh3 35. Kg2 Rh2+ 36. Kxg3 Rxb2 37. f4
- **Lesson:** material / safety / consequence, gap 266cp, pending

```
On move 32 you played Nxf4. gxh3 was better.

  What you played:  32. Nxf4 Bd7 33. Nh3 Bxh3 34. gxh3 Rxh3 35. Kg2 Rh2+
  What was better:  32. gxh3 Rxh3 33. Nxf4 Rh2 34. Rfe1 R8h4 35. Nd3 R4h3

The difference is material. Before your move: material balance +4.
After your line: material balance +1. After the better line: material balance +4.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 5w-64: 33. Rae1 — blunder (91% → 8%)

- Engine best: **Kxg2**; line: 33. Kxg2 Rh2+ 34. Kxg3 Rxb2 35. Ne6 Kb6 36. Ng5 Ka5 37. Rab1 Rc2
- Others: Nd3 (10%), a3 (9%)
- After Rae1: 33...Bxf1 34. Rxf1 Rh1+ 35. Kg2 Rxf1 36. Kxf1 Rh2 37. Kg1 Rf2 38. Nd3
- **Lesson:** material / hanging / consequence, gap 1011cp, pending

```
On move 33 you played Rae1. Kxg2 was better.

  What you played:  33. Rae1 Bxf1 34. Re7+ Kb8 35. Kxf1 Rh2 36. Kg1 Rd2
  What was better:  33. Kxg2 Rh2+ 34. Kxg3 Rxb2 35. Ne6 Rg8+ 36. Kf4 Rh2

The difference is material. Before your move: material balance +4.
After your line: material balance -1. After the better line: material balance +4.
Your move left this undefended: rook on f1.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 5 (1400), Black: Bishop's Opening

https://lichess.org/game/zUzJ4s9F · 1315 vs 1346 · 1-0

### 5b-5: 3... Nf6 — mistake (43% → 19%)

- Engine best: **exd4**; line: 3...exd4 4. Nf3 Nf6 5. O-O Nc6 6. e5 d5 7. Bb5 Nd7 8. Bxc6
- Others: Nc6 (42%), d6 (41%)
- After Nf6: 4. dxe5 Nh7 5. Qh5 g6 6. Qf3 Qe7 7. Nc3 Nc6 8. Nd5 Qd8
- **Lesson:** material / hanging / consequence, gap 253cp, pending

```
On move 3 you played Nf6. exd4 was better.

  What you played:  3...Nf6 4. dxe5 Nxe4 5. Bxf7+ Kxf7 6. Qd5+ Ke8 7. Qxe4
  What was better:  3...exd4 4. Nf3 Nf6 5. O-O Nc6 6. e5 d5 7. Bb5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.
Your move left this undefended: pawn on e5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 5b-7: 4... Nxe4 — ok (18% → 15%)

- Engine best: **Nxe4**; line: 4...Nxe4 5. Bxf7+ Kxf7 6. Qd5+ Ke7 7. Qxe4 Nc6 8. Nc3 d6 9. exd6+
- Others: Nh7 (18%), Ng8 (12%)
- After Nxe4: 5. Bxf7+ Kxf7 6. Qd5+ Ke7 7. Qxe4 Nc6 8. Nc3 d6 9. exd6+ Kf7
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns isn't a main reason (top: Threats 0.56, Bishops 0.34)

### 5b-9: 5... Ng5 — inaccuracy (46% → 34%)

- Engine best: **d5**; line: 5...d5 6. exd6 Nxd6 7. Bb3 Nc6 8. Nc3 Be7 9. Nge2 Ne5 10. Qg3
- Others: Ng5 (35%), Bb4+ (16%)
- After Ng5: 6. Bxg5 Qxg5 7. Nc3 Qxe5+ 8. Nge2 Qf6 9. Qe3+ Qe7 10. Qf4 Kd8
- *Rejected lesson:* development / develop; Threats (+0.94) dwarfs Mobility/Knights/Bishops (+0.17)

### 5b-11: 6... Qe7 — ok (47% → 41%)

- Engine best: **c6**; line: 6...c6 7. Qd4 d6 8. exd6 Bxd6 9. Nc3 O-O 10. Be3 Bc7 11. O-O-O
- Others: Ne6 (44%), Nc6 (43%)
- After Qe7: 7. Be3 c6 8. Qd4 b5 9. Be2 Ne6 10. Qd2 d5 11. exd6 Qxd6
- *Rejected lesson:* king_safety / king_safety; King safety gains only -1.32

### 5b-17: 9... b5 — mistake (83% → 63%)

- Engine best: **d5**; line: 9...d5 10. Nbd2 g4 11. Nd4 Qxe5+ 12. Qe2 Nd7 13. Bd3 g6 14. O-O-O
- Others: g4 (83%), b5 (63%)
- After b5: 10. Bb3 g4 11. Nd4 Qxe5+ 12. Kd1 Qf6 13. Re1+ Kd8 14. Bxf7 Kc7
- **Lesson:** material / forcing_moves / missed_chance, gap 298cp, pending

```
On move 9 you played b5. g4 was better.

  What you played:  9...b5 10. Bb3 g4 11. Nd4 Qxe5+ 12. Kd1 Qf6 13. Nc3
  What was better:  9...g4 10. Nd4 d5 11. Nd2 dxc4 12. Nxc4 Qg5 13. e6

Your move wasn't a disaster, but g4 would have improved material.
After the better line: material balance +3. After yours: material balance +2.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 5b-19: 10... f6 — blunder (63% → 31%)

- Engine best: **g4**; line: 10...g4 11. Nd4 Qxe5+ 12. Kd1 Qf6 13. Re1+ Kd8 14. Bxf7 Kc7 15. Bb3
- Others: a5 (58%), Na6 (53%)
- After f6: 11. Nc3 Na6 12. O-O-O Nc5 13. Qd2 b4 14. Na4 Kd8 15. exf6 Qxf6
- **Lesson:** material / forcing_moves / missed_chance, gap 242cp, pending

```
On move 10 you played f6. g4 was better.

  What you played:  10...f6 11. Nc3 g4 12. Qg6+ Kd8 13. Qxg4 fxe5 14. O-O-O
  What was better:  10...g4 11. Nd4 Qxe5+ 12. Kd1 Qf6 13. Nc3 Be7 14. Re1

Your move wasn't a disaster, but g4 would have improved material.
After the better line: material balance +2. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 5b-33: 17... f5 — inaccuracy (87% → 72%)

- Engine best: **a5**; line: 17...a5 18. a4 b4 19. c3 Na6 20. Rfd1 Ke7 21. Bc2 Nc5 22. cxb4
- Others: Be6 (86%), Na6 (85%)
- After f5: 18. Nxd5 Na6 19. Ne3 Nc5 20. Rfe1 Kc7 21. a4 b4 22. Rad1 Bg7
- **Lesson:** material / safety / consequence, gap 339cp, pending

```
On move 17 you played f5. Be6 was better.

  What you played:  17...f5 18. Nxd5 Na6 19. Ne3 Nc5 20. a4 f4 21. Nd1
  What was better:  17...Be6 18. c3 f5 19. a4 b4 20. Rae1 Nd7 21. Bc2

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 5b-35: 18... Nd7 — inaccuracy (87% → 76%)

- Engine best: **Be6**; line: 18...Be6 19. g3 Nd7 20. Rfc1 Rc8 21. Bc2 Rh5 22. Bd1 b4 23. h4
- Others: a5 (86%), Bd7 (84%)
- After Nd7: 19. a4 b4 20. c4 d4 21. Nxf5 Nc5 22. Ng3 Kc7 23. Rfe1 Nd3
- *No lesson.*

### 5b-39: 20... Nxb3 — ok (77% → 72%)

- Engine best: **a5**; line: 20...a5 21. Bd1 Rg8 22. a4 b4 23. Nb3 Bd7 24. Bc2 Rg5 25. Rfe1
- Others: Kc7 (75%), Bh6 (74%)
- After Nxb3: 21. axb3 a5 22. f3 Bc5 23. Rae1 a4 24. fxg4 Bxg4 25. b4 Bb6
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only -0.06

### 5b-41: 21... Bh6 — mistake (75% → 54%)

- Engine best: **Be6**; line: 21...Be6 22. Rfe1 a5 23. Nf1 Bd6 24. a4 b4 25. c4 dxc4 26. Nbd2
- Others: a5 (73%), Kc7 (71%)
- After Bh6: 22. a4 b4 23. cxb4 d4 24. Rfd1 Kc7 25. Nc4 Be6
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: Bishops 0.13, King safety 0.13)

### 5b-43: 22... Bf4 — mistake (70% → 41%)

- Engine best: **Kc7**; line: 22...Kc7 23. Rfd1 Be6 24. b4 a6 25. Nb3 Bf8 26. g3 Rd8 27. Nc2
- Others: Bd7 (54%), Re8 (49%)
- After Bf4: 23. g3 Bxe3 24. fxe3 Kc7 25. Rf7+ Bd7 26. Raf1 Rh6 27. b4 Re8
- *No lesson.*

### 5b-47: 24... Bd7 — blunder (89% → 17%)

- Engine best: **Bxh2+**; line: 24...Bxh2+ 25. Kh1 d4 26. N3d5+ Kd6 27. Nxc8+ Kxd5 28. Ne7+ Ke6 29. Nc6
- Others: Kd8 (50%), Kd7 (50%)
- After Bd7: 25. N3xd5+ Kb7 26. Nxf4 exf4 27. Rfd1 Rhd8 28. Rd5 Be8 29. a3 a5
- **Lesson:** material / hanging / consequence, gap 613cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before. And more is about to fall.

```
On move 24 you played Bd7. Bxh2+ was better.

  What you played:  24...Bd7 25. N3xd5+ Kb7 26. Nxf4 exf4 27. Rfd1 Be6 28. Ng6
  What was better:  24...Bxh2+ 25. Kh1 d4 26. N3d5+ Kd6 27. Nxc8+ Kxd5 28. Ne7+

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.
Your move left this undefended: pawn on d5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 5b-49: 25... Kc8 — ok (21% → 16%)

- Engine best: **Kb7**; line: 25...Kb7 26. g3 Bg5 27. Rfe1 Rad8 28. c4 Be6 29. b3 Bxe3 30. Nxe3
- Others: Kc6 (20%), Kc8 (19%)
- After Kc8: 26. g3 Bxe3 27. Nxe3 Kc7 28. Rfe1 Rh3 29. Rad1 Rah8 30. Rxd7+ Kxd7
- *Rejected lesson:* mobility / activity; Mobility is a main reason (+0.60)

### 5b-51: 26... Kb7 — mistake (50% → 26%)

- Engine best: **Kd8**; line: 26...Kd8 27. N7d5 Bxh2+ 28. Kh1 Bg3+ 29. Kg1
- Others: Kb7 (29%), Kc7 (17%)
- After Kb7: 27. g3 Rh7 28. gxf4 Rxe7 29. Nd5 Re6 30. fxe5 Rxe5 31. Nf6 Be6
- **Lesson:** material / forcing_moves / missed_chance, gap 228cp, pending

```
On move 26 you played Kb7. Kd8 was better.

  What you played:  26...Kb7 27. g3 Rh7 28. gxf4 Rxe7 29. fxe5 Rxe5
  What was better:  26...Kd8 27. N7d5 Bxh2+ 28. Kh1 Bf4+ 29. Kg1 Bh2+

Your move wasn't a disaster, but Kd8 would have improved material.
After the better line: material balance -1. After yours: material balance -2.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 5b-53: 27... Rh6 — blunder (88% → 25%)

- Engine best: **Bxh2+**; line: 27...Bxh2+ 28. Kh1 Rh6 29. Rfd1 Be6 30. g3 Bxg3+ 31. Kg2 Bf4 32. Ne7
- Others: Rh7 (29%), Rh6 (26%)
- After Rh6: 28. Nxf4 exf4 29. Rfd1 Kc6 30. Nd5 f3 31. g3 Be6 32. Nf4 a5
- **Lesson:** material / free_material / missed_chance, gap 417cp, pending

```
On move 27 you played Rh6. Bxh2+ was better.

  What you played:  27...Rh6 28. Nxf4 exf4 29. Rfd1 Be6 30. Nf1 Bc4 31. Rd7+
  What was better:  27...Bxh2+ 28. Kh1 Rh6 29. Rad1 Be6 30. g3 Bxg3+ 31. Kg2

Your move wasn't a disaster, but Bxh2+ would have improved material.
After the better line: material balance +1. After yours: material balance -2.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 5b-59: 30... g3 — mistake (50% → 25%)

- Engine best: **Bc6**; line: 30...Bc6 31. Nxf4 gxf3 32. gxf3 Rxh2 33. Rae1 Rxb2 34. Re2 Rxe2 35. Nxe2
- Others: gxf3 (50%), Rxh2 (50%)
- After g3: 31. h3 Rf8 32. Rad1 Bc6 33. Rd4 Bxd5 34. Rxd5 Ra6 35. Ra1 b4
- **Lesson:** open_files / open_files / consequence, gap 214cp, pending; check: Rooks is a main reason (+0.90)

```
On move 30 you played g3. Bc6 was better.

  What you played:  30...g3 31. h3 Rf8 32. Rad1 Be6 33. b3 Bxd5 34. Rxd5
  What was better:  30...Bc6 31. Nxf4 gxf3 32. gxf3 Rxh2 33. Ng2 R8h3 34. Nf4

The difference is rooks on open files. Before your move: your rooks on open files: h6, h8; theirs: none.
After your line: your rooks on open files: h6; theirs: d5. After the better line: your rooks on open files: h2, h3; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### 5b-61: 31... Bxh3 — inaccuracy (23% → 13%)

- Engine best: **Rf8**; line: 31...Rf8 32. Rad1 Be6 33. Rd4 Bxd5 34. Rxd5 Ra6 35. Ra1 b4 36. Rb5+
- Others: Rh4 (15%), b4 (15%)
- After Bxh3: 32. gxh3 Rxh3 33. Nxf4 Rh2 34. Rad1 Kc8 35. Rd5 Rxb2 36. Rc5+ Kb7
- **Lesson:** material / hanging / consequence, gap 151cp, pending

```
On move 31 you played Bxh3. Rf8 was better.

  What you played:  31...Bxh3 32. gxh3 Rxh3 33. Nxf4 Rh2 34. Rae1
  What was better:  31...Rf8 32. Rad1 Be6 33. Rfe1 Rf5 34. Nb4

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -2.
Your move left this undefended: pawn on f4, the piece you moved, now on h3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 5b-63: 32... Bxg2 — blunder (49% → 9%)

- Engine best: **Bc8**; line: 32...Bc8 33. Nh3 Bxh3 34. gxh3 Rxh3 35. Kg2 Rh2+ 36. Kxg3 Rxb2 37. f4
- Others: Be6 (49%), Bf5 (49%)
- After Bxg2: 33. Kxg2 Rh2+ 34. Kxg3 Rxb2 35. Ne6 Kb6 36. Ng5 Ka5 37. Rab1 Rc2
- **Lesson:** material / hanging / consequence, gap 476cp, pending

```
On move 32 you played Bxg2. Bf5 was better.

  What you played:  32...Bxg2 33. Kxg2 Rh2+ 34. Kxg3 Rxb2 35. Ne6 Rg8+ 36. Kf4
  What was better:  32...Bf5 33. Nh3 Bxh3 34. gxh3 Rxh3 35. Kg2 Rh2+ 36. Kxg3

The difference is material. Before your move: material balance -2.
After your line: material balance -4. After the better line: material balance -1.
Your move left this undefended: the piece you moved, now on g2.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 5b-65: 33... Rh1+ — blunder (92% → 7%)

- Engine best: **Bxf1**; line: 33...Bxf1 34. Rxf1 Rh1+ 35. Kg2 Rxf1 36. Kxf1 Rh2 37. Kg1 Rf2 38. Nd3
- Others: Rh2 (92%), Bh1 (47%)
- After Rh1+: 34. Kxg2 R1h2+ 35. Kxg3 Rxb2 36. Re2 Rxe2 37. Nxe2 Kc6 38. Rd1 Kc5
- **Lesson:** material / hanging / consequence, gap 1100cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before. And more is about to fall.

```
On move 33 you played Rh1+. Bxf1 was better.

  What you played:  33...Rh1+ 34. Kxg2 R1h7 35. Rh1 Rh2+ 36. Rxh2 gxh2 37. Rh1
  What was better:  33...Bxf1 34. Re7+ Ka8 35. Kxf1 Rh2 36. Ne2 Rf2+ 37. Kg1

The difference is material. Before your move: material balance +1.
After your line: material balance -4. After the better line: material balance +2.
Your move left this undefended: bishop on g2.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 6 (1400), White: Sicilian Defense: Closed

https://lichess.org/game/IgWTozC3 · 1423 vs 1480 · 1-0

### 6w-6: 4. e5 — inaccuracy (52% → 38%)

- Engine best: **Nf3**; line: 4. Nf3 d5 5. exd5 exd5 6. Bb3 a6 7. d3 Nbc6 8. O-O h6
- Others: d4 (52%), Nge2 (52%)
- After e5: 4...Ng6 5. Nf3 Nc6 6. d4 cxd4 7. Nxd4 Ngxe5 8. Bb3 d5 9. Be3
- *No lesson.*

### 6w-12: 7. O-O — ok (55% → 52%)

- Engine best: **d4**; line: 7. d4 cxd4 8. Qxd4 Qxd4 9. Nxd4 a6 10. Be2 b5 11. Bf3 Ra7
- Others: O-O (53%), h4 (53%)
- After O-O: 7...Nc6 8. h4 Be7 9. h5 Nge5 10. Nxe5 Nxe5 11. d3 Nxc4 12. dxc4
- **Lesson:** centre / centre / missed_chance, gap 44cp, pending; check: Mobility is a main reason (+0.68)

```
On move 7 you played O-O. d4 was better.

  What you played:  7. O-O Nc6 8. h4 Be7 9. h5 Nge5 10. Nxe5 Nxe5
  What was better:  7. d4 cxd4 8. Qxd4 Qxd4 9. Nxd4 a6 10. h4 h5

Your move wasn't a disaster, but d4 would have improved control of the centre.
After the better line: centre control 4 vs 2. After yours: centre control 3 vs 6.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 6w-20: 11. Ne4 — inaccuracy (49% → 32%)

- Engine best: **Be3**; line: 11. Be3 Qb4 12. Bb3 Rd8 13. Qe2 b6 14. a3 Qa5 15. Nb5 a6
- Others: Be2 (45%), Bb3 (44%)
- After Ne4: 11...Qf4 12. Bd3 Nxd4 13. Nxd4 f5 14. g3 Qe5 15. Nf3 Qxb2 16. Rb1
- *No lesson.*

### 6w-42: 22. Nc5 — ok (54% → 48%)

- Engine best: **Rad1**; line: 22. Rad1 Rb8 23. Nc5 Bg4 24. Bf3 Bxf3 25. Qxf3 Rbc8 26. Nd7 Rfe8
- Others: Rfd1 (53%), Bf3 (53%)
- After Nc5: 22...f5 23. Bc2 Qg5 24. g3 Nh3+ 25. Kh1 f4 26. gxf4 Nxf4 27. Rg1
- **Lesson:** material / forcing_moves / missed_chance, gap 122cp, pending

```
On move 22 you played Nc5. Rad1 was better.

  What you played:  22. Nc5 f5 23. Bc2 Qg5 24. Bb3+ Kh8 25. Bd5 e4
  What was better:  22. Rad1 Bg4 23. Rd2 Rae8 24. Bxb7 e4 25. Kh1 f5

Your move wasn't a disaster, but Rad1 would have improved material.
After the better line: material balance +2. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 6w-70: 36. d6 — blunder (98% → 2%)

- Engine best: **Rd4**; line: 36. Rd4 Rb7 37. Qxb7 Qxd4 38. Qb3 Kg7 39. Qxf3 Qxb2 40. d6 Qb5
- Others: Rd3 (97%), Qf6 (97%)
- After d6: 36...Qh3 37. Qe3+ Rxe3 38. g4 Qg2#
- **Lesson:** mate / safety / consequence, gap 10756cp, pending

```
On move 36 you played d6. Rd4 was better.

  What you played:  36. d6 Qh3 37. Qe3+ Rxe3 38. Rfe1 Qg2#
  What was better:  36. Rd4 f4 37. Rxf4 Qxf4 38. gxf4 Re4

After your move, your opponent had a forced checkmate.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 6 (1400), Black: Sicilian Defense: Closed

https://lichess.org/game/IgWTozC3 · 1423 vs 1480 · 1-0

### 6b-7: 4... d5 — ok (62% → 52%)

- Engine best: **Ng6**; line: 4...Ng6 5. Nf3 Nc6 6. d4 cxd4 7. Nxd4 Ngxe5 8. Bb3 d5 9. Be3
- Others: Nbc6 (58%), a6 (57%)
- After d5: 5. exd6 Nf5 6. Nf3 Nc6 7. Bb5 Bd7 8. O-O Nxd6 9. Ba4 Nd4
- **Lesson:** material / forcing_moves / missed_chance, gap 91cp, pending

```
On move 4 you played d5. Ng6 was better.

  What you played:  4...d5 5. exd6 Nf5 6. Nf3 Nc6 7. Ne4 Nxd6 8. Nxd6+
  What was better:  4...Ng6 5. Nf3 Nc6 6. Be2 Ncxe5 7. Nxe5 Nxe5 8. d4

Your move wasn't a disaster, but Ng6 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 6b-9: 5... Qxd6 — ok (52% → 48%)

- Engine best: **Nf5**; line: 5...Nf5 6. Nf3 Nc6 7. Bb5 Bd7 8. O-O Nxd6 9. Ba4 Nf5 10. d3
- Others: Nec6 (50%), Qxd6 (49%)
- After Qxd6: 6. d4 cxd4 7. Nb5 Qc6 8. Bf4 Nd5 9. Qxd4 a6 10. Bxd5 Qxb5
- **Lesson:** development / develop / missed_chance, gap 53cp, pending; check: Mobility is a main reason (+0.83)

```
On move 5 you played Qxd6. Nf5 was better.

  What you played:  5...Qxd6 6. d4 cxd4 7. Nb5 Qc5 8. Qxd4 Qxd4 9. Nxd4
  What was better:  5...Nf5 6. Nf3 Nc6 7. Ne4 Nxd6 8. Nxd6+ Bxd6 9. c3

Your move wasn't a disaster, but Nf5 would have improved development.
After the better line: undeveloped: bishop on c8. After yours: undeveloped: knight on b8, bishop on c8, bishop on f8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

### 6b-21: 11... Qb4 — inaccuracy (68% → 54%)

- Engine best: **Qf4**; line: 11...Qf4 12. Bd3 Nxd4 13. Nxd4 f5 14. g3 Qe5 15. Nf3 Qxb2 16. Rb1
- Others: Qb8 (56%), Qc7 (55%)
- After Qb4: 12. Bb3 Nh4 13. c3 Nxf3+ 14. Qxf3 Nxd4 15. Qd1 Qb6 16. Qxd4 Qxd4
- *No lesson.*

### 6b-25: 13... Bc5 — ok (57% → 48%)

- Engine best: **a5**; line: 13...a5 14. c3 Qb6 15. Re1 e5 16. Nf3 Bg4 17. h3 Rad8 18. Qe2
- Others: Qb6 (56%), e5 (55%)
- After Bc5: 14. c3 Qb6 15. Nxc5 Qxc5 16. Re1 a5 17. Bc2 e5 18. Nf3 f6
- **Lesson:** mobility / activity / missed_chance, gap 91cp, pending; check: Mobility is a main reason (+0.71)

```
On move 13 you played Bc5. Qb6 was better.

  What you played:  13...Bc5 14. c3 Qa5 15. Nxc5 Qxc5 16. Re1 a5 17. Bc2
  What was better:  13...Qb6 14. c3 a5 15. Re1 e5 16. Nf3 Bg4 17. h3

Your move wasn't a disaster, but Qb6 would have improved piece activity.
After the better line: 43 piece moves available vs opponent's 34. After yours: 28 piece moves available vs opponent's 30.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 6b-39: 20... Nf4 — ok (50% → 46%)

- Engine best: **f5**; line: 20...f5 21. Rad1 b6 22. f3 Bb7 23. Rf2 Rae8 24. Rfd2 Kh8 25. Nc1
- Others: Be6 (47%), Nf4 (47%)
- After Nf4: 21. Be4 Qh6 22. Rad1 Bg4 23. Rd2 Rab8 24. Re1 b6 25. g3 Nh3+
- **Lesson:** centre / centre / consequence, gap 45cp, pending; check: Mobility is a main reason (+1.10)

```
On move 20 you played Nf4. f5 was better.

  What you played:  20...Nf4 21. f3 Re8 22. Rad1 Qf6 23. g3 Nh3+ 24. Kg2
  What was better:  20...f5 21. f3 b6 22. Nc1 Bb7 23. Nd3 Rae8 24. Nb4

The difference is control of the centre. Before your move: centre control 6 vs 6.
After your line: centre control 5 vs 9. After the better line: centre control 8 vs 7.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 6b-43: 22... Qg5 — ok (52% → 45%)

- Engine best: **f5**; line: 22...f5 23. Bc2 Qg5 24. g3 Nh3+ 25. Kh1 f4 26. gxf4 Nxf4 27. Rg1
- Others: Bg4 (46%), Rb8 (46%)
- After Qg5: 23. Rfe1 h6 24. g3 Nh3+ 25. Kf1 Qh5 26. Bg2 Re8 27. Rad1 Bg4
- *Rejected lesson:* material / safety; not a strategic feature

### 6b-45: 23... Bh3 — blunder (48% → 7%)

- Engine best: **g6**; line: 23...g6 24. Bf3 Bf5 25. Nxf4 exf4 26. Qe5 Rae8 27. Qb5 b6 28. Rfe1
- Others: Be6 (48%), Rd8 (48%)
- After Bh3: 24. Nxf4 Qxf4 25. gxh3 Rfd8 26. c4 Rac8 27. Rfd1 Qxe3 28. fxe3 Rxd1+
- **Lesson:** material / safety / consequence, gap 619cp, triggered after 2 plies
- Trigger: You've lost a knight: you're 3 pawns worse off than before.

```
On move 23 you played Bh3. Bf5 was better.

  What you played:  23...Bh3 24. Nxf4 Bc8 25. Nd5 h6 26. Qxg5 hxg5 27. Ne7+
  What was better:  23...Bf5 24. h4 Qf6 25. Nxf4 Bxe4 26. Qxe4 exf4 27. Rfe1

The difference is material. Before your move: material balance +0.
After your line: material balance -3. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 6b-73: 37... Kg7 — blunder (98% → 2%)

- Engine best: **Rxe3**; line: 37...Rxe3 38. fxe3 Qg2#
- Others: f4 (2%), Kg7 (2%)
- After Kg7: 38. Qxe7+ Kg8 39. Qe8+ Kg7 40. Qe5+ Kf8 41. Qh8+ Kf7 42. Qxh7+ Qxh7
- **Lesson:** material / hanging / consequence, gap 10931cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before. And more is about to fall.

```
On move 37 you played Kg7. Rxe3 was better.

  What you played:  37...Kg7 38. Qxf3 Rd7
  What was better:  37...Rxe3 38. fxe3 Qg2#

The difference is material. Before your move: material balance -3.
After your line: material balance -8. After the better line: material balance -3.
Your move left this undefended: rook on e7, pawn on f3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 7 (1400), White: Philidor Defense

https://lichess.org/game/XO3Kn6N1 · 1404 vs 1425 · 0-1

### 7w-8: 5. d3 — ok (56% → 54%)

- Engine best: **d4**; line: 5. d4 Be7 6. O-O Ngf6 7. a4 O-O 8. Re1 Re8 9. h3 exd4
- Others: a4 (56%), O-O (56%)
- After d3: 5...b5 6. Bb3 h6 7. Ne2 Be7 8. Ng3 Ngf6 9. a4 b4 10. O-O
- **Lesson:** mobility / activity / missed_chance, gap 41cp, pending; check: Mobility is a main reason (+0.62)

```
On move 5 you played d3. d4 was better.

  What you played:  5. d3 b5 6. Bb3 a5 7. a3 a4 8. Ba2 Be7
  What was better:  5. d4 Be7 6. a4 Ngf6 7. O-O O-O 8. h3 a5

Your move wasn't a disaster, but d4 would have improved piece activity.
After the better line: 33 piece moves available vs opponent's 15. After yours: 27 piece moves available vs opponent's 20.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 7w-16: 9. Nxd4 — ok (73% → 64%)

- Engine best: **Qxd4**; line: 9. Qxd4 h6 10. Bh4 b5 11. Bb3 c5 12. Qe3 c4 13. e5 Qb6
- Others: Nxd4 (65%), Bxf6 (52%)
- After Nxd4: 9...b5 10. Bd3 Ne7 11. Bxf6 gxf6 12. O-O Qb6 13. Nf3 Bh6 14. Ne2
- *No lesson.*

### 7w-18: 10. Qf3 — ok (81% → 73%)

- Engine best: **Qe2**; line: 10. Qe2 b5 11. Bb3 Be7 12. O-O-O Kf8 13. Rhe1 h6 14. Bf4 a6
- Others: a4 (78%), a3 (78%)
- After Qf3: 10...b5 11. Be2 Be7 12. a3 Kf8 13. Bf4 Ne8 14. O-O-O h5 15. g4
- **Lesson:** material / forcing_moves / missed_chance, gap 102cp, pending

```
On move 10 you played Qf3. a4 was better.

  What you played:  10. Qf3 b5 11. Be2 b4 12. Nd1 c5 13. Nb3 h6
  What was better:  10. a4 Qc7 11. O-O Ne7 12. Qf3 Ng6 13. Bxf6 gxf6

Your move wasn't a disaster, but a4 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 7w-36: 19. b3 — blunder (97% → 10%)

- Engine best: **Nxc6**; line: 19. Nxc6 Bxc6 20. Qxc6+ Kf8 21. Ra5 Ne8 22. Rd7 Rxb2 23. Bxe7+ Nxe7
- Others: Rxe7+ (97%), Bf4 (95%)
- After b3: 19...Qxe5 20. Bf4 Qc5 21. Nxa4 Qd5 22. c4 Qxf3 23. Nxf3 Rb7 24. Kb2
- **Lesson:** material / hanging / consequence, gap 1192cp, triggered after 2 plies
- Trigger: You've lost a rook: you're 5 pawns worse off than before. And more is about to fall.

```
On move 19 you played b3. Nxc6 was better.

  What you played:  19. b3 Qxe5 20. Bf4 Qc5 21. Nxa4 Qd5 22. c4 Qxf3
  What was better:  19. Nxc6 Bxc6 20. Qxc6+ Kf8 21. Ra5 Ne8 22. Bxe7+ Nxe7

The difference is material. Before your move: material balance +1.
After your line: material balance -4. After the better line: material balance +1.
Your move left this undefended: rook on e5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 7 (1400), Black: Philidor Defense

https://lichess.org/game/XO3Kn6N1 · 1404 vs 1425 · 0-1

### 7b-9: 5... Ndf6 — ok (46% → 40%)

- Engine best: **b5**; line: 5...b5 6. Bb3 h6 7. Ne2 Be7 8. Ng3 Ngf6 9. a4 b4 10. O-O
- Others: Be7 (46%), h6 (45%)
- After Ndf6: 6. d4 Qc7 7. Bb3 h6 8. Be3 Ne7 9. Qd3 Ng6 10. Qc4 a6
- **Lesson:** centre / centre / consequence, gap 118cp, pending; check: Mobility is a main reason (+1.17)

```
On move 5 you played Ndf6. b5 was better.

  What you played:  5...Ndf6 6. d4 Nd7 7. O-O exd4 8. Qxd4 Ngf6 9. e5
  What was better:  5...b5 6. Bb3 a5 7. a3 Be7 8. Ne2 Ngf6 9. Ng3

The difference is control of the centre. Before your move: centre control 6 vs 9.
After your line: centre control 5 vs 11. After the better line: centre control 8 vs 8.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 7b-15: 8... exd4 — ok (33% → 27%)

- Engine best: **Qc7**; line: 8...Qc7 9. Qe2 h6 10. Be3 b5 11. Bb3 Ne7 12. O-O-O Ng6 13. g4
- Others: b5 (33%), h6 (30%)
- After exd4: 9. Qxd4 h6 10. Bh4 b5 11. Bb3 c5 12. Qe3 c4 13. e5 Qb6
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: Mobility 0.42, King safety 0.28)

### 7b-17: 9... Qc8 — inaccuracy (36% → 19%)

- Engine best: **b5**; line: 9...b5 10. Bd3 Ne7 11. Bxf6 gxf6 12. O-O Qb6 13. Nf3 Bh6 14. Ne2
- Others: Ne7 (34%), Qa5 (32%)
- After Qc8: 10. Qe2 b5 11. Bb3 Be7 12. O-O-O Kf8 13. Rhe1 h6 14. Bf4 a6
- **Lesson:** material / safety / consequence, gap 149cp, pending

```
On move 9 you played Qc8. b5 was better.

  What you played:  9...Qc8 10. a4 Qc7 11. O-O Ne7 12. Qf3 Ng6 13. Bxf6
  What was better:  9...b5 10. Bd3 Ne7 11. Bxf6 gxf6 12. Nce2 Qb6 13. a4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 7b-19: 10... Be7 — ok (27% → 18%)

- Engine best: **b5**; line: 10...b5 11. Be2 Be7 12. a3 Kf8 13. Bf4 Ne8 14. O-O-O h5 15. g4
- Others: h6 (25%), a6 (20%)
- After Be7: 11. a3 b5 12. Ba2 a5 13. O-O h6 14. Bf4 g5 15. Bh2 h5
- **Lesson:** mobility / activity / missed_chance, gap 184cp, pending; check: Mobility is a main reason (+0.43)

```
On move 10 you played Be7. h6 was better.

  What you played:  10...Be7 11. a4 Nh6 12. O-O-O O-O 13. g4
  What was better:  10...h6 11. Bh4 b5 12. Bd3 b4 13. Nce2

Your move wasn't a disaster, but h6 would have improved piece activity.
After the better line: 18 piece moves available vs opponent's 29. After yours: 19 piece moves available vs opponent's 44.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 7b-25: 13... a4 — inaccuracy (31% → 18%)

- Engine best: **b4**; line: 13...b4 14. Na4 Rb8 15. axb4 axb4 16. Qe2 c5 17. Nf5 Bb5 18. Bc4
- Others: Ra6 (28%), Rb8 (28%)
- After a4: 14. Ba2 Kf8 15. Rhe1 b4 16. axb4 h6 17. Bf4 a3 18. b3 g5
- **Lesson:** material / safety / consequence, gap 86cp, pending

```
On move 13 you played a4. b4 was better.

  What you played:  13...a4 14. Ba2 b4 15. axb4 a3 16. bxa3 Rxa3 17. Rd3
  What was better:  13...b4 14. Na4 Rb8 15. axb4 axb4 16. Qe2 c5 17. Nf5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 7b-27: 14... Rb8 — ok (15% → 11%)

- Engine best: **Kf8**; line: 14...Kf8 15. Rhe1 h6 16. Bf4 g5 17. Bh2 b4 18. axb4 a3 19. b3
- Others: h6 (15%), b4 (15%)
- After Rb8: 15. Rhe1 b4 16. axb4 Rxb4 17. e5 dxe5 18. Rxe5 c5 19. Nf5 Bxf5
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only -0.09

### 7b-31: 16... Rxb4 — ok (7% → 6%)

- Engine best: **a3**; line: 16...a3 17. bxa3 Qa6 18. Nb1 c5 19. Nf5 Bxf5 20. exf5 Rc8 21. Bf4
- Others: Qb7 (7%), c5 (6%)
- After Rxb4: 17. e5 dxe5 18. Rxe5 Rxb2 19. Rxe7+ Nxe7 20. Kxb2 O-O 21. Bxf6 gxf6
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns isn't a main reason (top: King safety 1.61, Bishops 0.26)

## Game 8 (1400), White: Grob Opening

https://lichess.org/game/W83V6xae · 1467 vs 1433 · 0-1

### 8w-0: 1. g4 — inaccuracy (54% → 40%)

- Engine best: **d4**; line: 1. d4 Nf6 2. c4 e6 3. g3 d5 4. Nf3 Be7 5. Bg2 O-O
- Others: Nf3 (54%), e4 (53%)
- After g4: 1...d5 2. g5 e5 3. d4 exd4 4. Nf3 Bb4+ 5. Bd2 Bd6 6. Nxd4
- *Rejected lesson:* development / develop; Mobility/Knights/Bishops isn't a main reason (top: King safety 0.59, Space 0.43)

### 8w-2: 2. h4 — ok (44% → 36%)

- Engine best: **Bg2**; line: 2. Bg2 h5 3. gxh5 d5 4. d4 exd4 5. c3 dxc3 6. Nxc3 c6
- Others: d4 (43%), c4 (41%)
- After h4: 2...Nc6 3. Bg2 d5 4. g5 Be6 5. d3 h6 6. Nc3 hxg5 7. hxg5
- **Lesson:** material / safety / consequence, gap 81cp, pending

```
On move 2 you played h4. c4 was better.

  What you played:  2. h4 Nc6 3. d3 d5 4. g5 h6 5. e4 dxe4
  What was better:  2. c4 Ne7 3. Bg2 d5 4. d4 dxc4 5. dxe5 Qxd1+

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 8w-8: 5. f3 — inaccuracy (36% → 19%)

- Engine best: **d3**; line: 5. d3 h6 6. Bg2 Qd7 7. Nd2 Nge7 8. Nf1 O-O-O 9. Bd2 Kb8
- Others: d4 (36%), Bg2 (36%)
- After f3: 5...h6 6. d3 hxg5 7. e4 Be6 8. Bxg5 Be7 9. Bh3 Bxg5 10. hxg5
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only 0.01

### 8w-14: 8. e3 — ok (37% → 34%)

- Engine best: **a5**; line: 8. a5 Bxg1 9. Rxg1 a6 10. d3 h6 11. Nd2 hxg5 12. hxg5 Qd6
- Others: e3 (33%), d3 (30%)
- After e3: 8...a6 9. d4 h6 10. gxh6 Rxh6 11. h5 Bg6 12. Na3 Qd6 13. a5
- **Lesson:** own_pawns / pawn_weaknesses / consequence, gap 63cp, pending; check: Pawns is a main reason (+0.62)

```
On move 8 you played e3. a5 was better.

  What you played:  8. e3 a6 9. d4 h6 10. gxh6 Rxh6 11. h5 Qd6
  What was better:  8. a5 Bxg1 9. Rxg1 e4 10. fxe4 dxe4 11. b5 Ne5

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on h5; backward pawn(s) on c3. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

### 8w-24: 13. c4 — inaccuracy (89% → 73%)

- Engine best: **f4**; line: 13. f4 a6 14. f5 Nxf5 15. exf5 Bxf5 16. Bg2 axb5 17. Ne2 Nc6
- Others: cxd4 (86%), h5 (83%)
- After c4: 13...a6 14. Nd2 Nd7 15. Bh3 f5 16. gxf6 Rxf6 17. Bxe6+ Rxe6 18. Nh3
- **Lesson:** material / forcing_moves / missed_chance, gap 195cp, pending

```
On move 13 you played c4. f4 was better.

  What you played:  13. c4 a6 14. h5 axb5 15. cxb5 Nd7 16. h6 gxh6
  What was better:  13. f4 a6 14. f5 Nxf5 15. exf5 Bxf5 16. Ne2 Qd5

Your move wasn't a disaster, but f4 would have improved material.
After the better line: material balance +3. After yours: material balance +2.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 8w-26: 14. Ba3 — inaccuracy (77% → 67%)

- Engine best: **Bh3**; line: 14. Bh3 Bxc4 15. Na3 Be6 16. Bxe6 fxe6 17. Nh3 Qe8 18. Nf2 Qh5
- Others: Nd2 (75%), h5 (74%)
- After Ba3: 14...a6 15. Kf2 axb5 16. cxb5 c6 17. bxc6 bxc6 18. a6 c5 19. Nd2
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 76cp, pending; check: Pawns is a main reason (+0.25)

```
On move 14 you played Ba3. Nd2 was better.

  What you played:  14. Ba3 a6 15. b6 cxb6 16. axb6 Nxb6 17. Nd2 Re8
  What was better:  14. Nd2 a6 15. Bh3 b6 16. Bxe6 fxe6 17. Nh3 axb5

Your move wasn't a disaster, but Nd2 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: doubled pawns on the b-file, e-file; backward pawn(s) on e5. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 8w-30: 16. Bxe7 — mistake (67% → 38%)

- Engine best: **Nd2**; line: 16. Nd2 Re8 17. Nh3 Ng6 18. h5 Ngf8 19. Rg1 h6 20. Bb4 Rxa1
- Others: Rh2 (64%), Nh3 (62%)
- After Bxe7: 16...Qxe7 17. Nd2 Qb4 18. Rb1 Qc3 19. Rb3 Qa5 20. f4 exf4 21. Bd3
- *Rejected lesson:* open_files / open_files; Rooks isn't a main reason (top: King safety 1.05, Threats 0.29)

### 8w-32: 17. Rxa8 — inaccuracy (39% → 23%)

- Engine best: **Nd2**; line: 17. Nd2 Qb4 18. Rb1 Qc3 19. Rb3 Qa5 20. Ne2 Nc5 21. Nc1 Nxb3
- Others: Ra4 (36%), Rxa8 (23%)
- After Rxa8: 17...Qb4+ 18. Kf2 Rxa8 19. Kg3 Ra2 20. Bd3 Nc5 21. Rh2 Ra1 22. Bc2
- *Rejected lesson:* king_safety / king_safety; King safety gains only -2.57

### 8w-34: 18. Bd3 — mistake (37% → 14%)

- Engine best: **Qd2**; line: 18. Qd2 f5 19. gxf6 Qxf6 20. Kf2 Nc5 21. Kg2 Qg6+ 22. Kh2 Qf7
- Others: Qb3 (36%), c5 (23%)
- After Bd3: 18...Qb4+ 19. Kf2 Nc5 20. Ne2 Nxd3+ 21. Qxd3 Bxc4 22. Qd2 Qxb5 23. Nbc3
- **Lesson:** material / safety / consequence, gap 225cp, pending

```
On move 18 you played Bd3. Qd2 was better.

  What you played:  18. Bd3 Qb4+ 19. Nd2 Nc5 20. Bb1 Ra1 21. Kf2 Bxc4
  What was better:  18. Qd2 Nc5 19. Rh2 Nb3 20. Qb2 Qb4+ 21. Kf2 Ra4

The difference is material. Before your move: material balance +2.
After your line: material balance +1. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 8w-36: 19. Qb3 — inaccuracy (22% → 3%)

- Engine best: **Kf2**; line: 19. Kf2 Qb4 20. Kg3 Nc5 21. Nh3 Bxh3 22. Kxh3 Ne6 23. Kg3 Nf4
- Others: Ne2 (22%), Kf1 (21%)
- After Qb3: 19...Nc5 20. Qc2 Nxd3+ 21. Qxd3 Qb4+ 22. Kf2 Rxb1 23. Kg2 Bxc4 24. Qxb1
- **Lesson:** material / safety / consequence, gap 423cp, pending

```
On move 19 you played Qb3. Ne2 was better.

  What you played:  19. Qb3 Nc5 20. Qd1 Nxd3+ 21. Qxd3 Qb4+ 22. Kf2 Rxb1
  What was better:  19. Ne2 Qb4+ 20. Kf2 Nc5 21. Nc1 Bxc4 22. Bxc4 Rxb1

The difference is material. Before your move: material balance +2.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 8 (1400), Black: Grob Opening

https://lichess.org/game/W83V6xae · 1467 vs 1433 · 0-1

### 8b-9: 5... Bc5 — ok (81% → 72%)

- Engine best: **h6**; line: 5...h6 6. d3 hxg5 7. e4 Be6 8. Bxg5 Be7 9. Bh3 Bxg5 10. hxg5
- Others: Qd7 (73%), Bc5 (71%)
- After Bc5: 6. d3 h6 7. e4 Be6 8. Nh3 Qd7 9. exd5 Qxd5 10. Nd2 O-O-O
- *No lesson.*

### 8b-13: 7... Nge7 — inaccuracy (74% → 63%)

- Engine best: **a5**; line: 7...a5 8. b5 Nce7 9. d3 h6 10. e4 Be6 11. Nh3 Qd7 12. c4
- Others: a6 (71%), Qd6 (65%)
- After Nge7: 8. a5 Bxg1 9. Rxg1 a6 10. d3 h6 11. Nd2 hxg5 12. hxg5 Qd6
- **Lesson:** material / forcing_moves / missed_chance, gap 150cp, pending

```
On move 7 you played Nge7. a5 was better.

  What you played:  7...Nge7 8. a5 Bxg1 9. Rxg1 e4 10. b5 Ne5 11. h5
  What was better:  7...a5 8. b5 Nce7 9. e4 dxe4 10. fxe4 Bxe4 11. Nf3

Your move wasn't a disaster, but a5 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 8b-15: 8... O-O — blunder (66% → 32%)

- Engine best: **a6**; line: 8...a6 9. d4 h6 10. gxh6 Rxh6 11. h5 Bg6 12. Na3 Qd6 13. a5
- Others: a5 (63%), Bxb1 (47%)
- After O-O: 9. a5 Bd4 10. exd4 a6 11. d3 exd4 12. cxd4 Nxd4 13. Kf2 Nec6
- **Lesson:** material / safety / consequence, gap 471cp, pending

```
On move 8 you played O-O. a6 was better.

  What you played:  8...O-O 9. a5 a6 10. axb6 cxb6 11. d4 f6 12. b5
  What was better:  8...a6 9. d4 h6 10. gxh6 Rxh6 11. h5 Qd6 12. Ne2

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 8b-17: 9... Bxe3 — ok (31% → 22%)

- Engine best: **Bd4**; line: 9...Bd4 10. Ba3 a6 11. cxd4 exd4 12. Ne2 f6 13. Qb3 fxg5 14. hxg5
- Others: a6 (30%), Qd6 (28%)
- After Bxe3: 10. dxe3 a6 11. Rh2 d4 12. e4 Be6 13. h5 b5 14. axb6 cxb6
- **Lesson:** mobility / activity / consequence, gap 113cp, triggered after 2 plies; check: Mobility is a main reason (+0.45)
- Trigger: Your pieces have run short of squares (24 piece moves available vs opponent's 27).

```
On move 9 you played Bxe3. Qd7 was better.

  What you played:  9...Bxe3 10. dxe3 a6 11. Nd2 Be6 12. Nb3 b6 13. Ne2
  What was better:  9...Qd7 10. axb6 axb6 11. Rxa8 Rxa8 12. Na3 e4 13. Bb5

The difference is piece activity. Before your move: 28 piece moves available vs opponent's 21.
After your line: 22 piece moves available vs opponent's 24. After the better line: 28 piece moves available vs opponent's 19.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 8b-19: 10... d4 — inaccuracy (24% → 11%)

- Engine best: **a6**; line: 10...a6 11. Nd2 Be6 12. Ne2 f6 13. Ng3 fxg5 14. hxg5 Ng6 15. Rh5
- Others: Be6 (23%), b6 (22%)
- After d4: 11. b5 Nxa5 12. Rxa5 Bxb1 13. cxd4 c6 14. Ra1 Bf5 15. dxe5 Qxd1+
- **Lesson:** material / forcing_moves / missed_chance, gap 194cp, pending

```
On move 10 you played d4. Be6 was better.

  What you played:  10...d4 11. b5 dxc3 12. Nxc3 Qxd1+ 13. Nxd1 Nb4 14. Kf2
  What was better:  10...Be6 11. e4 a6 12. h5 d4 13. h6 gxh6 14. Qc2

Your move wasn't a disaster, but Be6 would have improved material.
After the better line: material balance -1. After yours: material balance -2.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 8b-27: 14... b6 — ok (33% → 26%)

- Engine best: **a6**; line: 14...a6 15. Kf2 axb5 16. cxb5 c6 17. bxc6 bxc6 18. a6 c5 19. Nd2
- Others: Re8 (32%), c5 (28%)
- After b6: 15. Nd2 Re8 16. a6 c6 17. bxc6 Nxc6 18. Nh3 f6 19. Nb3 Rc8
- **Lesson:** material / safety / consequence, gap 123cp, pending

```
On move 14 you played b6. a6 was better.

  What you played:  14...b6 15. Nd2 a6 16. axb6 cxb6 17. Bh3 axb5 18. cxb5
  What was better:  14...a6 15. b6 cxb6 16. axb6 Nxb6 17. Nd2 Rc8 18. Nh3

The difference is material. Before your move: material balance -2.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 8b-33: 17... Rxa8 — inaccuracy (77% → 63%)

- Engine best: **Qb4+**; line: 17...Qb4+ 18. Kf2 Rxa8 19. Kg3 Ra2 20. Bd3 Nc5 21. Rh2 Ra1 22. Bc2
- Others: Rxa8 (64%), Nc5 (7%)
- After Rxa8: 18. Qd2 f5 19. gxf6 Qxf6 20. Kf2 Nc5 21. Kg2 Qg6+ 22. Kh2 Qf7
- *No lesson.*

### 8b-35: 18... Ra1 — ok (86% → 78%)

- Engine best: **Qb4+**; line: 18...Qb4+ 19. Kf2 Nc5 20. Ne2 Nxd3+ 21. Qxd3 Bxc4 22. Qd2 Qxb5 23. Nbc3
- Others: Nc5 (78%), Ra1 (76%)
- After Ra1: 19. Kf2 Qb4 20. Kg3 Nc5 21. Nh3 Bxh3 22. Kxh3 Ne6 23. Kg3 Nf4
- **Lesson:** material / forcing_moves / missed_chance, gap 110cp, pending

```
On move 18 you played Ra1. Qb4+ was better.

  What you played:  18...Ra1 19. Kf2 Nc5 20. Ne2 Ra2 21. Kg3 h6 22. Nc1
  What was better:  18...Qb4+ 19. Nd2 Ra3 20. Bb1 Bxc4 21. Kf2 Bxb5 22. Nh3

Your move wasn't a disaster, but Qb4+ would have improved material.
After the better line: material balance +0. After yours: material balance -2.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

## Game 9 (1400), White: Caro-Kann Defense: Hillbilly Attack

https://lichess.org/game/RN8WlFjo · 1404 vs 1375 · 1-0

### 9w-2: 2. Bc4 — ok (52% → 47%)

- Engine best: **d4**; line: 2. d4 d5 3. e5 Bf5 4. Nd2 e6 5. Nb3 Nd7 6. Nf3 Be4
- Others: c3 (52%), Nf3 (52%)
- After Bc4: 2...d5 3. exd5 cxd5 4. Bb5+ Bd7 5. a4 Nc6 6. d4 a6 7. Be2
- **Lesson:** centre / centre / consequence, gap 78cp, pending; check: Mobility is a main reason (+1.40)

```
On move 2 you played Bc4. d4 was better.

  What you played:  2. Bc4 d5 3. exd5 cxd5 4. Bb3 Nf6 5. Nf3 Bf5
  What was better:  2. d4 d5 3. e5 Bf5 4. Nc3 e6 5. g4 Bg6

The difference is control of the centre. Before your move: centre control 3 vs 1.
After your line: centre control 3 vs 7. After the better line: centre control 8 vs 7.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 9w-8: 5. Bxc6+ — ok (48% → 44%)

- Engine best: **d4**; line: 5. d4 Bf5 6. c4 e6 7. c5 Be7 8. Nc3 Bf6 9. g4 Be4
- Others: Nf3 (47%), Ne2 (46%)
- After Bxc6+: 5...bxc6 6. Nf3 Bg4 7. c3 Qb6 8. h3 Bh5 9. c4 Qa6 10. b3
- **Lesson:** king_safety / king_safety / consequence, gap 40cp, pending; check: King safety is a main reason (+0.33)

```
On move 5 you played Bxc6+. Nf3 was better.

  What you played:  5. Bxc6+ bxc6 6. Nf3 f6 7. d4 Ba6 8. b3 Qa5+
  What was better:  5. Nf3 Bf5 6. O-O Rc8 7. c4 dxc4 8. Bxc4 e6

The difference is king safety. Before your move: 2 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.
After your line: 1 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it. After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

### 9w-12: 7. O-O — ok (45% → 44%)

- Engine best: **c3**; line: 7. c3 Qc7 8. d4 e6 9. c4 Nf6 10. O-O Be7 11. Be3 Rb8
- Others: O-O (44%), d4 (44%)
- After O-O: 7...e6 8. d4 Bd6 9. Nbd2 Ne7 10. Re1 O-O 11. h3 Bh5 12. Nb3
- *Rejected lesson:* mobility / activity; Mobility is a main reason (+0.31)

### 9w-16: 9. g4 — inaccuracy (43% → 29%)

- Engine best: **Re1**; line: 9. Re1 Bd6 10. d4 h6 11. Nbd2 a5 12. c4 Ne7 13. Nf1 Bb4
- Others: d4 (43%), Qe2 (42%)
- After g4: 9...Bg6 10. d4 Bd6 11. Nc3 h5 12. Qe2 hxg4 13. hxg4 f6 14. Re1
- *Rejected lesson:* king_safety / king_safety; King safety is a main reason (+4.25)

### 9w-18: 10. Nh2 — inaccuracy (29% → 14%)

- Engine best: **Qe2**; line: 10. Qe2 Bd6 11. Nc3 h5 12. d4 hxg4 13. hxg4 f6 14. Re1 Ne7
- Others: Nc3 (29%), d4 (29%)
- After Nh2: 10...h5 11. d4 hxg4 12. hxg4 Bd6 13. Nf3 Nf6 14. Bg5 Qc7 15. Kg2
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.09

### 9w-22: 12. f4 — ok (18% → 15%)

- Engine best: **Kg2**; line: 12. Kg2 Ne7 13. Nf3 h5 14. Re1 f6 15. Qe2 hxg4 16. hxg4 Kf7
- Others: Nf3 (18%), f4 (13%)
- After f4: 12...h5 13. g5 Ne7 14. Nc3 Bf5 15. Rf2 Bxh3 16. Ne2 Bg4 17. c3
- **Lesson:** material / safety / consequence, gap 126cp, pending

```
On move 12 you played f4. Nf3 was better.

  What you played:  12. f4 h5 13. g5 Ne7 14. Nc3 Bf5 15. Rf2 Bxh3
  What was better:  12. Nf3 h5 13. Kg2 Ne7 14. Nc3 hxg4 15. hxg4 f6

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9w-24: 13. g5 — ok (21% → 12%)

- Engine best: **Nc3**; line: 13. Nc3 Ne4 14. Nf3 Bxf4 15. Bxf4 Qxf4 16. Qe1 Qd6 17. Nh4 Rb8
- Others: Nf3 (19%), Qe1 (17%)
- After g5: 13...Nh5 14. Nc3 Nxf4 15. Qf3 Nh5 16. Ng4 O-O 17. Ne2 c5 18. c3
- *Rejected lesson:* development / develop; Mobility/Knights/Bishops isn't a main reason (top: King safety 1.72, Threats 0.22)

### 9w-26: 14. Nc3 — ok (14% → 9%)

- Engine best: **Ng4**; line: 14. Ng4 h6 15. gxh6 O-O-O 16. Nc3 gxh6 17. Qe2 Rdg8 18. Qa6+ Kb8
- Others: Nc3 (11%), c4 (10%)
- After Nc3: 14...h6 15. Nxe4 Bxe4 16. Qh5 g6 17. Qh4 O-O-O 18. gxh6 g5 19. Qh5
- **Lesson:** material / safety / consequence, gap 180cp, pending

```
On move 14 you played Nc3. Ng4 was better.

  What you played:  14. Nc3 h6 15. Nf3 Bxf4 16. Nxe4 Bxe4 17. g6 Bxg6
  What was better:  14. Ng4 Ng3 15. Rf2 Nf5 16. Nc3 h6 17. gxh6 Nxh6

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9w-34: 18. Qxe4 — blunder (90% → 50%)

- Engine best: **Qxh5**; line: 18. Qxh5 h6 19. g6 f5 20. c4 O-O 21. c5 Be7 22. Be3 Rfb8
- Others: Qxe4 (50%), Qg4 (43%)
- After Qxe4: 18...Ng3 19. Qd3 Nf5 20. Ng4 O-O 21. c4 Rad8 22. Qe4 Ng3 23. Qg2
- **Lesson:** material / safety / consequence, gap 574cp, pending

```
On move 18 you played Qxe4. Qxh5 was better.

  What you played:  18. Qxe4 Ng3 19. Qd3 Nf5 20. Ng4 c5 21. Ne3 Nxd4
  What was better:  18. Qxh5 h6 19. g6 f5 20. Be3 c5 21. c3 cxd4

The difference is material. Before your move: material balance +3.
After your line: material balance +0. After the better line: material balance +3.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9w-36: 19. b3 — inaccuracy (60% → 50%)

- Engine best: **Qf3**; line: 19. Qf3 g6 20. Ng4 O-O 21. c4 f6 22. c5 Be7 23. Qe3 Qd7
- Others: Nf1 (52%), c3 (51%)
- After b3: 19...Ng3 20. Qd3 Nf5 21. Ng4 O-O 22. Ne3 Rfe8 23. Nxf5 exf5 24. Qxf5
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only 0.04

### 9w-38: 20. c3 — ok (74% → 68%)

- Engine best: **Qf3**; line: 20. Qf3 g6 21. c4 O-O 22. Ng4 Rb7 23. c5 Be7 24. Nh6+ Kh8
- Others: Bd2 (71%), c3 (68%)
- After c3: 20...Rb8 21. Qf3 g6 22. Ng4 O-O 23. c4 Rfd8 24. Bb2 Rd7 25. Raf1
- **Lesson:** own_pawns / pawn_weaknesses / consequence, gap 82cp, pending; check: Pawns is a main reason (+0.31)

```
On move 20 you played c3. Qf3 was better.

  What you played:  20. c3 Rb8 21. Qf3 g6 22. Ng4 f6 23. gxf6 O-O
  What was better:  20. Qf3 g6 21. c4 Rb8 22. Ng4 O-O 23. Bd2 a5

The difference is your pawn structure. Before your move: backward pawn(s) on f4.
After your line: isolated pawn(s) on h3, f4, f6; doubled pawns on the f-file. After the better line: backward pawn(s) on f4.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

### 9w-40: 21. c4 — mistake (69% → 48%)

- Engine best: **Qf3**; line: 21. Qf3 g6 22. Ng4 Rd5 23. Be3 h6 24. c4 Rf5 25. Nxh6 Rxh6
- Others: Ng4 (54%), h4 (52%)
- After c4: 21...Rf5 22. Ng4 O-O 23. Ne5 f6 24. gxf6 Nxf6 25. Qe3 Nh5 26. Nd3
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only -0.08

### 9w-46: 24. c5 — inaccuracy (72% → 53%)

- Engine best: **Qxc6**; line: 24. Qxc6 Qb4 25. Rf3 Rd8 26. Ng4 Qa5 27. R1f2 Qe1+ 28. Kg2 Qb1
- Others: Kg2 (63%), Bd2 (61%)
- After c5: 24...Ng3 25. Qxc6 Nxf1 26. Kxf1 Bb8 27. Qe4 Qb5+ 28. Kg2 Rd5 29. Ng4
- **Lesson:** material / safety / consequence, gap 138cp, pending

```
On move 24 you played c5. Qxc6 was better.

  What you played:  24. c5 Ng3 25. Qxc6 Bb8 26. Qf3 Nxf1 27. Nxf1 Qb4
  What was better:  24. Qxc6 Bb8 25. h4 Qc3 26. Qf3 f6 27. Qe4 fxg5

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9w-48: 25. Ng4 — inaccuracy (71% → 56%)

- Engine best: **Qxc6**; line: 25. Qxc6 Bb8 26. Kg2 Kh8 27. Ng4 h6 28. h4 Qb4 29. Qe4 Rd8
- Others: Kg2 (56%), Ng4 (56%)
- After Ng4: 25...Qa6 26. Rf3 Rd8 27. R1f2 Rfd5 28. Qc2 g6 29. Qc4 Qb7 30. b4
- **Lesson:** material / safety / consequence, gap 154cp, pending

```
On move 25 you played Ng4. Qxc6 was better.

  What you played:  25. Ng4 Ng3 26. Qxc6 Nxf1 27. Kxf1 Bb8 28. Qf3 Qb5+
  What was better:  25. Qxc6 Bb8 26. Kg2 Rd5 27. Ng4 Qd8 28. Rd1 a5

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9w-50: 26. Ne5 — mistake (57% → 35%)

- Engine best: **Qf3**; line: 26. Qf3 Qa6 27. Nh6+ gxh6 28. Qxh5 Qd3 29. Qe2 Qxe2 30. Rxe2 hxg5
- Others: Kg2 (56%), Kh2 (54%)
- After Ne5: 26...Bxe5 27. fxe5 Ng3 28. Qc2 Nxf1 29. Kxf1 Qb5+ 30. Qe2 a6 31. Ke1
- **Lesson:** material / safety / consequence, gap 210cp, pending

```
On move 26 you played Ne5. Qf3 was better.

  What you played:  26. Ne5 Bxe5 27. fxe5 Ng3 28. Qc2 Nxf1 29. Kxf1 Rd7
  What was better:  26. Qf3 Qb5 27. Bc1 Rxd4 28. Nh6+ gxh6 29. Qxh5 Rd5

The difference is material. Before your move: material balance +1.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9w-62: 32. Rd2 — mistake (76% → 50%)

- Engine best: **Ra4**; line: 32. Ra4 Qb2 33. Rxa7 Qc2 34. Rd2 Qb1+ 35. Kg2 Qe1 36. Qf3 Rf8
- Others: Qe2 (53%), Qg2 (53%)
- After Rd2: 32...Rb4 33. Qf3 Rxc4 34. bxc4 Rd8 35. Rf2 Rf8 36. d5 Ng7 37. d6
- **Lesson:** material / forcing_moves / missed_chance, gap 169cp, pending

```
On move 32 you played Rd2. Ra4 was better.

  What you played:  32. Rd2 Rb4 33. Qf3 Rxc4 34. bxc4 Rd7 35. Rf2 Qa6
  What was better:  32. Ra4 Qb2 33. Rxa7 Qc2 34. Rd2 Qc3 35. Qe2 Rbd8

Your move wasn't a disaster, but Ra4 would have improved material.
After the better line: material balance +2. After yours: material balance +1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 9w-64: 33. Kf2 — blunder (97% → 66%)

- Engine best: **Rxc1**; line: 33. Rxc1 Rb4 34. Rc4 a5 35. Qf3 Ng7 36. Rf2 Nf5 37. Rxb4 axb4
- Others: Qd1 (73%), Kf2 (64%)
- After Kf2: 33...Qb1 34. Rdc2 Ng7 35. Qg1 Qxg1+ 36. Kxg1 Rbd8 37. Kf2 Nf5 38. Rd2
- **Lesson:** material / free_material / missed_chance, gap 597cp, pending

```
On move 33 you played Kf2. Rxc1 was better.

  What you played:  33. Kf2 Qb1 34. Rdc2 Ng7 35. Qg1 Qxg1+ 36. Kxg1 Nf5
  What was better:  33. Rxc1 Ng7 34. Qd1 Nf5 35. Rd3 a5 36. Qd2 Rb5

Your move wasn't a disaster, but Rxc1 would have improved material.
After the better line: material balance +10. After yours: material balance +1.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 9w-66: 34. Qg2 — ok (77% → 67%)

- Engine best: **Rd1**; line: 34. Rd1 Qh2+ 35. Qg2 Qxg2+ 36. Kxg2 Ng7 37. Ra4 Nf5 38. Kf3 Rb5
- Others: Ra4 (74%), Qg2 (66%)
- After Qg2: 34...Qb1 35. Rdc2 Ng7 36. Qf1 Qxf1+ 37. Kxf1 Nf5 38. Kf2 Rbd8 39. Rd2
- *Rejected lesson:* king_activity / king_activity; can't be verified

### 9w-68: 35. Ke2 — inaccuracy (68% → 53%)

- Engine best: **Rdc2**; line: 35. Rdc2 Rbd8 36. Qg1 Qxg1+ 37. Kxg1 Ng3 38. Kf2 Nf5 39. Rd2 Ra8
- Others: Qf1 (62%), Rcc2 (61%)
- After Ke2: 35...Rbd8 36. Ra4 Ng7 37. Qg1 Qe4 38. Qg4 Qb1 39. Rxa7 Nf5 40. Qf4
- **Lesson:** king_safety / king_safety / missed_chance, gap 120cp, pending; check: King safety is a main reason (+3.36)

```
On move 35 you played Ke2. Rdc2 was better.

  What you played:  35. Ke2 Rbd8 36. Qg1 Qf5 37. Qg4 Qb1 38. Rcc2 Qh1
  What was better:  35. Rdc2 Rbd8 36. Qg1 Qxg1+ 37. Kxg1 Ng3 38. Rd2 Nf5

Your move wasn't a disaster, but Rdc2 would have improved king safety.
After the better line: the enemy queen is gone, so your king is fairly safe. After yours: 1 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

### 9w-70: 36. Qf2 — mistake (76% → 56%)

- Engine best: **Rd1**; line: 36. Rd1 Qf4 37. Rg1 a5 38. Bxf4 Nxf4+ 39. Ke3 Nxg2+ 40. Rxg2 h6
- Others: Rc1 (72%), Kd1 (66%)
- After Qf2: 36...Qxh3 37. Qf3 Qh4 38. Kd3 Rbd8 39. Rf2 R8d7 40. Qe4 Qh3 41. Kc3
- **Lesson:** material / hanging / consequence, gap 181cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 36 you played Qf2. Rd1 was better.

  What you played:  36. Qf2 Qxh3 37. Qf3 Qh4 38. Kd3 Ng7 39. Rc1 Nf5
  What was better:  36. Rd1 Qf4 37. Bxf4 Nxf4+ 38. Kf3 Nxg2 39. Kxg2 Rbd8

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +1.
Your move left this undefended: pawn on h3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 9w-76: 39. Rf1 — inaccuracy (60% → 50%)

- Engine best: **Qxf5**; line: 39. Qxf5 gxf5 40. Ra4 f4 41. Bf2 Rbd8 42. Kc2 Ng3 43. Ra6 Ne4
- Others: Kc3 (57%), Kc1 (54%)
- After Rf1: 39...Ng3 40. Qxf5 gxf5 41. Rg1 Ne4+ 42. Kc2 a5 43. Rh1 Kg7 44. Rh6
- *Rejected lesson:* mobility / activity; Mobility is a main reason (+0.51)

### 9w-82: 42. b4 — blunder (87% → 30%)

- Engine best: **Rb4**; line: 42. Rb4 Rd8 43. a4 Ng3 44. Rb7 Nf5 45. Rf3 Kf8 46. Rh3 Kg7
- Others: a4 (87%), Rb2 (81%)
- After b4: 42...Ra3+ 43. Kd2 Ng3 44. Rf4 Nf5 45. Bf2 Rxa2+ 46. Rc2 Ra4 47. Rb2
- **Lesson:** material / safety / consequence, gap 593cp, pending

```
On move 42 you played b4. a4 was better.

  What you played:  42. b4 Ra3+ 43. Kd2 Ng3 44. Rf4 Nf5 45. Bf2 Rxa2+
  What was better:  42. a4 Ng3 43. Rf3 Nf5 44. Rb4 Rd7 45. Rb8+ Kg7

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 9 (1400), Black: Caro-Kann Defense: Hillbilly Attack

https://lichess.org/game/RN8WlFjo · 1404 vs 1375 · 1-0

### 9b-27: 14... Ng3 — ok (91% → 82%)

- Engine best: **h6**; line: 14...h6 15. Nxe4 Bxe4 16. Qh5 g6 17. Qh4 O-O-O 18. gxh6 g5 19. Qh5
- Others: Nxg5 (90%), Nxc3 (88%)
- After Ng3: 15. Rf2 h6 16. gxh6 Rxh6 17. f5 Bh5 18. Qd3 Rf6 19. fxe6 Rxf2
- *No lesson.*

### 9b-29: 15... Nh5 — inaccuracy (86% → 76%)

- Engine best: **h6**; line: 15...h6 16. gxh6 Rxh6 17. f5 Bh5 18. Ng4 Rh8 19. fxe6 f5 20. Qd3
- Others: Rb8 (81%), Nf5 (81%)
- After Nh5: 16. Qf3 O-O 17. Be3 f6 18. gxf6 gxf6 19. Ng4 Kh8 20. Raf1 Ng7
- *No lesson.*

### 9b-31: 16... Be4 — blunder (79% → 11%)

- Engine best: **O-O**; line: 16...O-O 17. Ng4 f6 18. gxf6 gxf6 19. Bd2 Kh8 20. Re1 Rae8 21. b3
- Others: f6 (78%), Rb8 (76%)
- After Be4: 17. Nxe4 dxe4 18. Qxh5 h6 19. g6 f5 20. c4 c5 21. d5 O-O
- **Lesson:** material / safety / consequence, gap 848cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before.

```
On move 16 you played Be4. O-O was better.

  What you played:  16...Be4 17. Nxe4 dxe4 18. Qxh5 h6 19. Kg2 O-O-O
  What was better:  16...O-O 17. Ng4 Rab8 18. Ne5 f6 19. Nxg6 hxg6

The difference is material. Before your move: material balance +0.
After your line: material balance -3. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9b-35: 18... Rb8 — inaccuracy (50% → 40%)

- Engine best: **Ng3**; line: 18...Ng3 19. Qd3 Nf5 20. Ng4 O-O 21. c4 Rad8 22. Qe4 Ng3 23. Qg2
- Others: h6 (48%), O-O (42%)
- After Rb8: 19. Qf3 g6 20. Ng4 O-O 21. c4 f6 22. c5 Be7 23. Qe3 Qd7
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: King safety 0.77, Threats 0.35)

### 9b-37: 19... Rb4 — mistake (50% → 26%)

- Engine best: **Ng3**; line: 19...Ng3 20. Qd3 Nf5 21. Ng4 O-O 22. Ne3 Rfe8 23. Nxf5 exf5 24. Qxf5
- Others: h6 (47%), O-O (42%)
- After Rb4: 20. Qf3 g6 21. c4 O-O 22. Ng4 Rb7 23. c5 Be7 24. Nh6+ Kh8
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: King safety 1.27, Mobility 0.44)

### 9b-45: 23... Qa5 — mistake (50% → 28%)

- Engine best: **Ng3**; line: 23...Ng3 24. Qf3 Nxf1 25. Nxf1 Bb4 26. Re2 Bd6
- Others: c5 (50%), h6 (46%)
- After Qa5: 24. Qxc6 Qb4 25. Rf3 Rd8 26. Ng4 Qa5 27. R1f2 Qe1+ 28. Kg2 Qb1
- **Lesson:** material / hanging / consequence, gap 197cp, pending

```
On move 23 you played Qa5. Ng3 was better.

  What you played:  23...Qa5 24. Qxc6 Bb8 25. h4 h6 26. Ng4 hxg5 27. hxg5
  What was better:  23...Ng3 24. Qf3 Nxf1 25. Nxf1 Bb4 26. Re2 Ra5 27. c5

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance +1.
Your move left this undefended: pawn on c6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 9b-47: 24... Bc7 — inaccuracy (47% → 29%)

- Engine best: **Ng3**; line: 24...Ng3 25. Qxc6 Nxf1 26. Kxf1 Bb8 27. Qe4 Qb5+ 28. Kg2 Rd5 29. Ng4
- Others: Bb8 (44%), Bc7 (28%)
- After Bc7: 25. Qxc6 Bb8 26. Kg2 Kh8 27. Ng4 h6 28. h4 Qb4 29. Qe4 Rd8
- *No lesson.*

### 9b-53: 27... Qc3 — inaccuracy (66% → 47%)

- Engine best: **Ng3**; line: 27...Ng3 28. Qc2 Nxf1 29. Kxf1 Rb8 30. Kg2 Qb5 31. h4 a5 32. h5
- Others: g6 (52%), Qc7 (50%)
- After Qc3: 28. Rc2 Qa5 29. Qg2 g6 30. Rc4 Ng7 31. Ra4 Qd8 32. Rf4 Nf5
- **Lesson:** material / forcing_moves / missed_chance, gap 157cp, pending

```
On move 27 you played Qc3. Ng3 was better.

  What you played:  27...Qc3 28. Rc1 Qa5 29. Qf3 g6 30. Rc4 Ng7
  What was better:  27...Ng3 28. Qd3 Nxf1 29. Kxf1 Rb8 30. h4 Qb5

Your move wasn't a disaster, but Ng3 would have improved material.
After the better line: material balance +1. After yours: material balance -1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 9b-61: 31... Qa3 — mistake (45% → 24%)

- Engine best: **Qa5**; line: 31...Qa5 32. Ra4 Qc7 33. Rc1 Ng7 34. Kf2 Nf5 35. h4 Rb5 36. Bd2
- Others: Qb7 (45%), Qb5 (44%)
- After Qa3: 32. Ra4 Qb2 33. Rxa7 Qc2 34. Rd2 Qb1+ 35. Kg2 Qe1 36. Qf3 Rf8
- **Lesson:** material / safety / consequence, gap 177cp, pending

```
On move 31 you played Qa3. Qb5 was better.

  What you played:  31...Qa3 32. Ra4 Qb2 33. Rxa7 Qc2 34. Rd2 Qb1+ 35. Kg2
  What was better:  31...Qb5 32. Ra4 Qb7 33. h4 Ng7 34. Bf2 Nf5 35. h5

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9b-63: 32... Qc1+ — blunder (50% → 3%)

- Engine best: **Rb4**; line: 32...Rb4 33. Qf3 Rxc4 34. bxc4 Rd8 35. Rf2 Rf8 36. d5 Ng7 37. d6
- Others: Qa5 (46%), Qa6 (45%)
- After Qc1+: 33. Rxc1 Rb4 34. Rc4 a5 35. Qf3 Ng7 36. Rf2 Nf5 37. Rxb4 axb4
- **Lesson:** material / hanging / consequence, gap 725cp, pending

```
On move 32 you played Qc1+. Qa5 was better.

  What you played:  32...Qc1+ 33. Rxc1 a5 34. Qd1 Ng7 35. Rd3 Rb5
  What was better:  32...Qa5 33. h4 Ng7 34. Ra4 Qc7 35. Rd3 Rbd8

The difference is material. Before your move: material balance -1.
After your line: material balance -10. After the better line: material balance -1.
Your move left this undefended: the piece you moved, now on c1.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 9b-65: 33... Qh1 — inaccuracy (34% → 23%)

- Engine best: **Qb1**; line: 33...Qb1 34. Rdc2 Ng7 35. Qg1 Qxg1+ 36. Kxg1 Rbd8 37. Kf2 Nf5 38. Rd2
- Others: Qh1 (24%), Qa1 (21%)
- After Qh1: 34. Rd1 Qh2+ 35. Qg2 Qxg2+ 36. Kxg2 Ng7 37. Ra4 Nf5 38. Kf3 Rb5
- *No lesson.*

### 9b-69: 35... Qf5 — mistake (47% → 24%)

- Engine best: **Rbd8**; line: 35...Rbd8 36. Ra4 Ng7 37. Qg1 Qe4 38. Qg4 Qb1 39. Rxa7 Nf5 40. Qf4
- Others: a5 (46%), Kf8 (43%)
- After Qf5: 36. Rd1 Qf4 37. Rg1 a5 38. Bxf4 Nxf4+ 39. Ke3 Nxg2+ 40. Rxg2 h6
- **Lesson:** material / forcing_moves / missed_chance, gap 247cp, pending

```
On move 35 you played Qf5. a5 was better.

  What you played:  35...Qf5 36. Rd1 Nf4+ 37. Bxf4 Qxf4 38. Rf1 Qh4 39. Qg4
  What was better:  35...a5 36. Qg1 Qf5 37. Qg4 Qb1 38. Rcc2 a4 39. Qg1

Your move wasn't a disaster, but a5 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 9b-73: 37... Qg4+ — ok (53% → 50%)

- Engine best: **Ng3+**; line: 37...Ng3+ 38. Kd3 Nf5 39. Re1 a5 40. Qf1 Qxf1+ 41. Rxf1 Rbd8 42. Re1
- Others: Ng7 (50%), Qg4+ (50%)
- After Qg4+: 38. Qf3 Ng3+ 39. Kf2 Ne4+ 40. Ke2 Ng3+
- *Rejected lesson:* outposts / outposts; Knights/Bishops gains only 0.08

### 9b-75: 38... Qf5 — inaccuracy (52% → 40%)

- Engine best: **Ng3**; line: 38...Ng3 39. Kc1 a5 40. Ra4 Rb5 41. Rd2 Nf5 42. Re2 Nxe3 43. Qxe3
- Others: Ng7 (50%), Ra8 (50%)
- After Qf5: 39. Qxf5 gxf5 40. Ra4 f4 41. Bf2 Rbd8 42. Kc2 Ng3 43. Ra6 Ne4
- **Lesson:** material / safety / consequence, gap 134cp, pending

```
On move 38 you played Qf5. Ng3 was better.

  What you played:  38...Qf5 39. Qxf5 gxf5 40. Ra4 Ng3 41. Rxa7 f4 42. Bg1
  What was better:  38...Ng3 39. Kc2 Nf5 40. Rd3 h5 41. gxh6 g5 42. Qg1

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9b-77: 39... Qxf2+ — inaccuracy (50% → 40%)

- Engine best: **Ng3**; line: 39...Ng3 40. Qxf5 gxf5 41. Rg1 Ne4+ 42. Kc2 a5 43. Rh1 Kg7 44. Rh6
- Others: a5 (46%), Rbd8 (44%)
- After Qxf2+: 40. Bxf2 Rb5 41. Kc2 Ng7 42. Ra4 a5 43. b4 Rxb4 44. Rxb4 axb4
- *Rejected lesson:* passed_pawns / passed_pawns; Passed gains only 0.05

### 9b-79: 40... Rb5 — ok (45% → 37%)

- Engine best: **a5**; line: 40...a5 41. Kd3 Rd7 42. Rb2 Ra7 43. a4 Rba8 44. b4 axb4 45. Rbxb4
- Others: Ra8 (45%), Ng3 (44%)
- After Rb5: 41. Kc3 Rd7 42. Rb4 Rdb7 43. Ra4 a5 44. Bd2 Ra7 45. Kc4 Ng7
- *Rejected lesson:* outposts / outposts; Mobility (+0.47) dwarfs Knights/Bishops (+0.12)

### 9b-81: 41... Ra5 — mistake (36% → 13%)

- Engine best: **Rd7**; line: 41...Rd7 42. Rb4 Rdb7 43. Ra4 a5 44. Bd2 Ng3 45. Kd3 Ra7 46. b4
- Others: Rd8 (35%), a5 (32%)
- After Ra5: 42. Rb4 Rd8 43. a4 Ng3 44. Rb7 Nf5 45. Rf3 Kf8 46. Rh3 Kg7
- **Lesson:** mobility / activity / missed_chance, gap 197cp, pending; check: Mobility is a main reason (+0.97)

```
On move 41 you played Ra5. a5 was better.

  What you played:  41...Ra5 42. Rb4 Ng3 43. Rb8+ Kg7 44. Rb7 Nf5 45. a4
  What was better:  41...a5 42. Ra4 Ng3 43. Rf3 Nf5 44. Bd2 Rd7 45. Rd3

Your move wasn't a disaster, but a5 would have improved piece activity.
After the better line: 22 piece moves available vs opponent's 12. After yours: 17 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 9b-83: 42... Ra4 — blunder (70% → 16%)

- Engine best: **Ra3+**; line: 42...Ra3+ 43. Kd2 Ng3 44. Rf4 Nf5 45. Bf2 Rxa2+ 46. Rc2 Ra4 47. Rb2
- Others: Rb5 (29%), Ra6 (22%)
- After Ra4: 43. Bc1 Ra6 44. Kb3 Ng3 45. a4 Kg7 46. Bb2 Rd8 47. Rc1 Nf5
- **Lesson:** material / forcing_moves / missed_chance, gap 584cp, pending

```
On move 42 you played Ra4. Ra3+ was better.

  What you played:  42...Ra4 43. Kb3 Ra6 44. a4 Ng3 45. b5 cxb5 46. axb5
  What was better:  42...Ra3+ 43. Kd2 Ng3 44. Rf4 Nf5 45. Bf2 Rd8 46. Kc2

Your move wasn't a disaster, but Ra3+ would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 9b-87: 44... Ng7 — ok (12% → 10%)

- Engine best: **Ng7**; line: 44...Ng7 45. Bc1 Nf5 46. Bb2 Rd8 47. Rd2 Ne3 48. Rc1 Nd5 49. Rh2
- Others: Rd8 (12%), Ng3 (12%)
- After Ng7: 45. b5 cxb5 46. axb5 Ra5 47. Kb4 Ra1 48. Rc1 Rxc1 49. Bxc1 Nf5
- *Rejected lesson:* outposts / outposts; Knights/Bishops gains only -0.13

### 9b-91: 46... cxb5 — ok (9% → 9%)

- Engine best: **Nxe3**; line: 46...Nxe3 47. bxa6 Rd7 48. Ka3 Nd5 49. Rb2 h5 50. gxh6 Rc7 51. Rb7
- Others: Kg7 (9%), Rd8 (8%)
- After cxb5: 47. axb5 Rb6 48. cxb6 Rxb5+ 49. Ka4 Rxb6 50. Bd2 Rb8 51. Bb4 Rd8
- **Lesson:** material / hanging / consequence, gap 306cp, pending

```
On move 46 you played cxb5. Nxe3 was better.

  What you played:  46...cxb5 47. axb5 Nxe3 48. bxa6 Nf5 49. Rb2 Nxd4+ 50. Kc4
  What was better:  46...Nxe3 47. bxa6 Rxd4 48. Rb2 Kg7 49. Ka3 Nc4+ 50. Rxc4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.
Your move left this undefended: the piece you moved, now on b5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 10 (1400), White: Horwitz Defense

https://lichess.org/game/PjGmN14y · 1437 vs 1431 · 1-0

### 10w-4: 3. c3 — ok (56% → 52%)

- Engine best: **e4**; line: 3. e4 cxd4 4. Nxd4 a6 5. c4 Nf6 6. Nc3 Bb4 7. Qd3 d5
- Others: Nc3 (55%), g3 (54%)
- After c3: 3...d5 4. Bf4 Bd6 5. e3 Bxf4 6. exf4 Qb6 7. Qb3 Nf6 8. dxc5
- *Rejected lesson:* mobility / activity; Mobility is a main reason (+0.40)

### 10w-12: 7. Nh4 — ok (52% → 46%)

- Engine best: **c4**; line: 7. c4 dxc4 8. dxc5 O-O 9. Na3 c3 10. Nb5 Bxc5 11. Nxc3 h6
- Others: dxc5 (51%), a3 (51%)
- After Nh4: 7...h6 8. Nf3 O-O 9. Ne5 Qb6 10. b3 Rd8 11. Nxc6 Qxc6 12. Ba3
- *Rejected lesson:* centre / centre; Space is a main reason (+0.67)

### 10w-14: 8. Qc2 — mistake (46% → 26%)

- Engine best: **Nf3**; line: 8. Nf3 h6 9. Re1 Qc7 10. Nbd2 Rd8 11. e3 Rb8 12. a4 b6
- Others: a4 (45%), Re1 (45%)
- After Qc2: 8...cxd4 9. Nf3 e5 10. cxd4 e4 11. Ne1 Nxd4 12. Qd1 Nc6 13. Nc3
- **Lesson:** material / safety / consequence, gap 209cp, pending

```
On move 8 you played Qc2. Nf3 was better.

  What you played:  8. Qc2 cxd4 9. Rd1 Qb6 10. h3 h6 11. Nf3 e5
  What was better:  8. Nf3 h6 9. a4 b6 10. Ne5 Na5 11. Re1 Bb7

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 10w-24: 13. Qd3 — ok (46% → 43%)

- Engine best: **Nc3**; line: 13. Nc3 f5 14. a4 g5 15. e3 Be8 16. Bd2 h5 17. Be1 Nd6
- Others: a4 (46%), Be3 (45%)
- After Qd3: 13...Qa5 14. a4 Bb4 15. b3 b5 16. Ba3 Bxa3 17. Rxa3 Qb4 18. Bxe4
- **Lesson:** own_pawns / pawn_weaknesses / consequence, gap 43cp, pending; check: Pawns is a main reason (+0.42)

```
On move 13 you played Qd3. Nc3 was better.

  What you played:  13. Qd3 Qa5 14. Nc3 Nxc3 15. Qxc3 Qxc3 16. bxc3 Bb5
  What was better:  13. Nc3 f5 14. Qb3 Nd6 15. a4 a5 16. e3 h5

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on a2; backward pawn(s) on c3. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

### 10w-26: 14. Bxe4 — inaccuracy (46% → 31%)

- Engine best: **a4**; line: 14. a4 f5 15. Nd2 Qb6 16. Nf3 Be8 17. Bd2 Nxd2 18. Nxd2 a5
- Others: Nc3 (44%), Be3 (44%)
- After Bxe4: 14...dxe4 15. Qd1 h5 16. Nc3 Qa5 17. Be3 Qf5 18. Kg2 Rfd8 19. Rc1
- **Lesson:** mobility / activity / consequence, gap 195cp, pending; check: Mobility is a main reason (+0.86)

```
On move 14 you played Bxe4. Nc3 was better.

  What you played:  14. Bxe4 dxe4 15. Qd1 Qb6 16. Nc3 Rfd8 17. e3 Qa5
  What was better:  14. Nc3 Nxc3 15. bxc3 Bb5 16. Qf3 Rc4 17. Bd2 Ra4

The difference is piece activity. Before your move: 26 piece moves available vs opponent's 29.
After your line: 19 piece moves available vs opponent's 36. After the better line: 26 piece moves available vs opponent's 29.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 10w-28: 15. Qb3 — inaccuracy (31% → 21%)

- Engine best: **Qd1**; line: 15. Qd1 Qb6 16. Na3 Bxa3 17. bxa3 Rfd8 18. Qc2 Qxd4 19. Be3 Qd6
- Others: Qc3 (24%), Qd2 (24%)
- After Qb3: 15...Qxd4 16. Nc3 Qf6 17. Be3 h5 18. Qb6 Qf5 19. b4 Bd8 20. Qc5
- *No lesson.*

### 10w-32: 17. e3 — ok (29% → 23%)

- Engine best: **Nc3**; line: 17. Nc3 Bc6 18. Qd1 Rfd8 19. e3 e5 20. d5 f5 21. a4 Be8
- Others: Qd1 (29%), e3 (25%)
- After e3: 17...Bc4 18. Re1 Bd3 19. Nc3 Rc4 20. Qd1 Rfc8 21. a3 a5 22. f4
- **Lesson:** mobility / activity / missed_chance, gap 63cp, pending; check: Mobility is a main reason (+0.49)

```
On move 17 you played e3. Nc3 was better.

  What you played:  17. e3 Bc4 18. Re1 Bd3 19. Nc3 a5 20. Qd1 Rfd8
  What was better:  17. Nc3 Bc6 18. Qd1 Rfd8 19. Qc2 Qxd4 20. Be3 Qe5

Your move wasn't a disaster, but Nc3 would have improved piece activity.
After the better line: 31 piece moves available vs opponent's 40. After yours: 19 piece moves available vs opponent's 39.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 10w-44: 23. Qg4 — inaccuracy (46% → 27%)

- Engine best: **Qc2**; line: 23. Qc2 e5 24. b3 exd4 25. exd4 Rcxd4 26. Be3 Qc5 27. Rfe1 g6
- Others: Qe2 (44%), Qh5 (39%)
- After Qg4: 23...e5 24. dxe5 Qb3 25. Ne2 Bd7 26. Qh5 g6 27. Qh6 Qb5 28. Rd1
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only -0.14

## Game 10 (1400), Black: Horwitz Defense

https://lichess.org/game/PjGmN14y · 1437 vs 1431 · 1-0

### 10b-15: 8... Ne4 — mistake (74% → 53%)

- Engine best: **cxd4**; line: 8...cxd4 9. Nf3 e5 10. cxd4 e4 11. Ne1 Nxd4 12. Qd1 Nc6 13. Nc3
- Others: Bd7 (57%), h6 (56%)
- After Ne4: 9. Nf3 cxd4 10. Nxd4 e5 11. Nxc6 bxc6 12. Bxe4 dxe4 13. Qxe4 Qd6
- **Lesson:** material / free_material / missed_chance, gap 175cp, pending

```
On move 8 you played Ne4. cxd4 was better.

  What you played:  8...Ne4 9. Nf3 f5 10. Ne5 Nxe5 11. dxe5 b5 12. f3
  What was better:  8...cxd4 9. Rd1 Qb6 10. Qb3 Qxb3 11. axb3 dxc3 12. bxc3

Your move wasn't a disaster, but cxd4 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 10b-29: 15... Bd5 — inaccuracy (79% → 63%)

- Engine best: **Qxd4**; line: 15...Qxd4 16. Nc3 Qf6 17. Be3 h5 18. Qb6 Qf5 19. b4 Bd8 20. Qc5
- Others: Bf6 (68%), g5 (67%)
- After Bd5: 16. Qd1 Qb6 17. Nc3 Bc6 18. Rb1 Qa5 19. Qc2 Qh5 20. Be3 b5
- **Lesson:** material / free_material / missed_chance, gap 223cp, pending

```
On move 15 you played Bd5. Qxd4 was better.

  What you played:  15...Bd5 16. Qd1 Bc6 17. Nc3 Qa5 18. Be3 Qf5 19. Kg2
  What was better:  15...Qxd4 16. Nc3 Qc5 17. Bf4 h5 18. Na4 Qf5 19. Nb6

Your move wasn't a disaster, but Qxd4 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 10b-35: 18... Rfc8 — ok (70% → 62%)

- Engine best: **Rc6**; line: 18...Rc6 19. Nc3 Bc4 20. Re1 Bd3 21. a3 Rc4 22. f3 Qc6 23. fxe4
- Others: Rc7 (67%), Rcc8 (64%)
- After Rfc8: 19. Nc3 R4c6 20. Nxd5 exd5 21. Bd2 g6 22. a4 Qd8 23. Qb3 Qd7
- *No lesson.*

### 10b-37: 19... Rd8 — ok (63% → 56%)

- Engine best: **R4c6**; line: 19...R4c6 20. Nxd5 exd5 21. Bd2 g6 22. Bc3 Rf6 23. f4 exf3 24. Rxf3
- Others: R4c7 (61%), g6 (61%)
- After Rd8: 20. Bd2 Rcc8 21. Nxd5 exd5 22. Rc1 Rxc1 23. Qxc1 h5 24. Qc3 h4
- **Lesson:** open_files / open_files / consequence, gap 56cp, pending; check: Rooks is a main reason (+0.42)

```
On move 19 you played Rd8. R4c6 was better.

  What you played:  19...Rd8 20. Bd2 Rdc8 21. Rc1 h6 22. Nxd5 exd5 23. Rxc4
  What was better:  19...R4c6 20. Nxd5 exd5 21. Bd2 g6 22. Rb1 Rc4 23. Qg4

The difference is rooks on open files. Before your move: your rooks on open files: c4, c8; theirs: none.
After your line: your rooks on open files: c8; theirs: c4. After the better line: your rooks on open files: c4, c8; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### 10b-39: 20... Qb4 — ok (58% → 53%)

- Engine best: **Qc7**; line: 20...Qc7 21. Nc3 b5 22. Nxd5 exd5 23. Bd2 Rc8 24. Qg4 g6 25. Rfc1
- Others: Qb5 (57%), Qd6 (57%)
- After Qb4: 21. Bd2 Qxa4 22. b3 Qc6 23. bxc4 Bxc4 24. Qc2 Bxf1 25. Qxc6 bxc6
- *Rejected lesson:* mobility / activity; King safety (+0.73) dwarfs Mobility (+0.18)

### 10b-45: 23... f5 — inaccuracy (73% → 61%)

- Engine best: **e5**; line: 23...e5 24. dxe5 Qb3 25. Ne2 Bd7 26. Qh5 g6 27. Qh6 Qb5 28. Rd1
- Others: a5 (65%), f5 (62%)
- After f5: 24. Qe2 Qb3 25. Bd2 e5 26. dxe5 Rc5 27. Rab1 Rxe5 28. Rfc1 Qe6
- *No lesson.*

### 10b-47: 24... Qc7 — blunder (63% → 9%)

- Engine best: **Qb3**; line: 24...Qb3 25. Bd2 e5 26. dxe5 Rc5 27. Rab1 Rxe5 28. Rfc1 Qe6 29. Rc2
- Others: Bd5 (54%), Bb5 (50%)
- After Qc7: 25. Qxc4 Qd7 26. b4 h5 27. Bb2 h4 28. Rad1 Bf6 29. Qe2 Qf7
- **Lesson:** material / hanging / consequence, gap 827cp, triggered after 2 plies
- Trigger: You've lost a rook: you're 5 pawns worse off than before.

```
On move 24 you played Qc7. Qb3 was better.

  What you played:  24...Qc7 25. Qxc4 Qd7 26. Re1 Bd5 27. Qf1 Bb3 28. Bd2
  What was better:  24...Qb3 25. Bd2 e5 26. dxe5 Rc5 27. Rfd1 Qxb2 28. Be1

The difference is material. Before your move: material balance +0.
After your line: material balance -5. After the better line: material balance +1.
Your move left this undefended: rook on c4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

