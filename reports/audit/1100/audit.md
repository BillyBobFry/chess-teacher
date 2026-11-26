# Teacher audit on real Lichess games

| Band (Lichess) | Mistakes+blunders (≥20% drop) | …with a lesson | Lessons | Lessons on moves losing <10% | Strategic lessons | Rejected by classical check |
|---|---|---|---|---|---|---|
| 1100 | 74 | 64 | 128 | 34 | 28 | 38 |

## Game 1 (1100), White: Vienna Game

https://lichess.org/game/xE010qx0 · 1042 vs 1019 · 1-0

### 1w-10: 6. Nxc6 — blunder (90% → 56%)

- Engine best: **Ndb5**; line: 6. Ndb5 d6 7. Nd5 Qxe4+ 8. Be2 Kd8 9. O-O Bd7 10. Ndxc7 Rc8
- Others: Be2 (73%), Be3 (71%)
- After Nxc6: 6...dxc6 7. Bf4 Nf6 8. f3 Be6 9. Qd2 Qb4 10. O-O-O Qa5 11. Qe1
- **Lesson:** material / hanging / missed_chance, gap 381cp, pending

```
On move 6 you played Nxc6. Ndb5 was better.

  What you played:  6. Nxc6 dxc6 7. Bf4 Be6 8. a3 Nf6 9. Qd4 Qd8
  What was better:  6. Ndb5 d6 7. Nd5 Qxe4+ 8. Be3 Kd8 9. Ndxc7 Rb8

Your move wasn't a disaster, but Ndb5 would have improved material.
After the better line: material balance +1. After yours: material balance +0.
Your move left this undefended: the piece you moved, now on c6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1w-14: 8. Qf3 — ok (57% → 50%)

- Engine best: **Qd2**; line: 8. Qd2 Nf6 9. O-O-O Nd7 10. Be2 g6 11. e5 Bg7 12. Bg5 Qc5
- Others: f4 (57%), Be2 (55%)
- After Qf3: 8...Nf6 9. h3 O-O-O 10. a3 h5 11. Bxa7 g5 12. Be3 Ng4 13. Bd2
- **Lesson:** open_files / open_files / consequence, gap 71cp, triggered after 2 plies; check: Rooks is a main reason (+0.60)
- Trigger: Your opponent's rook has taken an open file (your rooks on open files: none; theirs: d8).

```
On move 8 you played Qf3. Qd2 was better.

  What you played:  8. Qf3 O-O-O 9. a3 g6 10. Bxa7 Nf6 11. h3 Bg7
  What was better:  8. Qd2 Nf6 9. O-O-O Ng4 10. Bf4 f6 11. a3 Rd8

The difference is rooks on open files. Before your move: your rooks on open files: none; theirs: none.
After your line: your rooks on open files: none; theirs: d8. After the better line: your rooks on open files: d1; theirs: d8.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### 1w-20: 11. Rab1 — inaccuracy (68% → 58%)

- Engine best: **Bxa7**; line: 11. Bxa7 Nf6 12. a3 Bd6 13. Qe2 Be5 14. f4 Bd4+ 15. Bxd4 Qxd4+
- Others: a3 (67%), Qg3 (64%)
- After Rab1: 11...Nf6 12. h3 Qe7 13. a3 Bc5 14. b4 Bb6 15. a4 Nd7 16. a5
- **Lesson:** mobility / activity / consequence, gap 143cp, pending; check: Mobility is a main reason (+0.64)

```
On move 11 you played Rab1. a3 was better.

  What you played:  11. Rab1 Nf6 12. Bf4 Bc5 13. h3
  What was better:  11. a3 Bxc3 12. bxc3 Kb8 13. a4

The difference is piece activity. Before your move: 37 piece moves available vs opponent's 25.
After your line: 32 piece moves available vs opponent's 34. After the better line: 33 piece moves available vs opponent's 20.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 1w-22: 12. a3 — ok (57% → 48%)

- Engine best: **h3**; line: 12. h3 Kb8 13. a3 Be7 14. b4 Rhg8 15. b5 b6 16. Rfd1 g5
- Others: Bxa7 (54%), Bg5 (53%)
- After a3: 12...Bg4 13. Qg3 Nh5 14. Qh4 Be7 15. Bg5 f6 16. h3 fxg5 17. Qxg4
- **Lesson:** material / safety / consequence, gap 202cp, pending

```
On move 12 you played a3. h3 was better.

  What you played:  12. a3 Bg4 13. Qf4 Nh5 14. Qe5 f6 15. Qd4 Qxd4
  What was better:  12. h3 Qe7 13. a3 Bd6 14. Qe2 Nd7 15. f4 f6

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1w-28: 15. g4 — ok (93% → 84%)

- Engine best: **Qxf6**; line: 15. Qxf6 h6 16. c4 c5 17. Rfd1 g5 18. Be2 Qc6 19. Rxd8+ Rxd8
- Others: Bg5 (92%), Rfd1 (91%)
- After g4: 15...Bxg4 16. hxg4 Nxg4 17. Bg5 f6 18. Be2 fxg5 19. Qxg4 Qxg4+ 20. Bxg4+
- *No lesson.*

### 1w-44: 23. e6 — ok (91% → 90%)

- Engine best: **Bf4**; line: 23. Bf4 c5 24. Kh2 Bc6 25. Bg3 a6 26. Be2 Rhg8 27. a4 Bxa4
- Others: e6 (89%), Kh2 (88%)
- After e6: 23...fxe6 24. f6 g3 25. Rf3 e5 26. Rxg3 h2+ 27. Kh1 Be6 28. c4
- **Lesson:** passed_pawns / passed_pawns / missed_chance, gap 276cp, pending; check: Passed is a main reason (+0.65)

```
On move 23 you played e6. Bf4 was better.

  What you played:  23. e6 fxe6 24. f6 g3 25. Rf3 h2+ 26. Kg2 e5
  What was better:  23. Bf4 f6 24. exf6 Rh5 25. Kh2 Rxf5 26. Bg3 Rxf2+

Your move wasn't a disaster, but Bf4 would have improved passed pawns.
After the better line: your passed pawns: f6; theirs: h3, g4. After yours: your passed pawns: f6; theirs: h2, g3, e5.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

### 1w-46: 24. fxe6 — blunder (91% → 58%)

- Engine best: **f6**; line: 24. f6 g3 25. Rf3 h2+ 26. Kg2 e5 27. f7 e4 28. fxe8=Q+ Rxe8
- Others: Ba6 (82%), fxe6 (62%)
- After fxe6: 24...Bxe6 25. Bf4 Bd5 26. Bg3 Re7 27. Kh2 Bf3 28. Rff1 Rhe8 29. Rbe1
- **Lesson:** material / hanging / consequence, gap 220cp, pending

```
On move 24 you played fxe6. f6 was better.

  What you played:  24. fxe6 Bxe6 25. Bf4 Bd5 26. Bg3 Bf3 27. Kh2 a5
  What was better:  24. f6 g3 25. Rf3 h2+ 26. Kg2 e5 27. Bf5 Ref8

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +1.
Your move left this undefended: the piece you moved, now on e6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1w-48: 25. Rf3 — blunder (95% → 13%)

- Engine best: **exd7+**; line: 25. exd7+ Kxd7 26. Bf5+ Ke7 27. Rf3 h2+ 28. Kg2 h1=Q+ 29. Rxh1 Rxh1
- Others: Rf6 (47%), Rf5 (22%)
- After Rf3: 25...Bxe6 26. c4 h2+ 27. Kh1 g2+ 28. Kxg2 h1=R 29. Rxh1 Reg8+ 30. Kf2
- **Lesson:** material / hanging / consequence, gap 975cp, pending

```
On move 25 you played Rf3. exd7+ was better.

  What you played:  25. Rf3 Bxe6 26. c4 h2+ 27. Kg2 Bh3+ 28. Kh1 g2+
  What was better:  25. exd7+ Kxd7 26. Bf5+ Re6 27. Bxe6+ Kxe6 28. Rf3 h2+

The difference is material. Before your move: material balance +3.
After your line: material balance +1. After the better line: material balance +5.
Your move left this undefended: pawn on e6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1w-50: 26. Kh1 — blunder (45% → 11%)

- Engine best: **Kg2**; line: 26. Kg2 Bxe6 27. Bd4 Rh6 28. Bg7 Rh4 29. c4 Bxc4 30. Bxc4 Rxc4
- Others: Kh1 (12%), Kf1 (2%)
- After Kh1: 26...Bxe6 27. c4 g2+ 28. Kxg2 h1=B+ 29. Rxh1 Reg8+ 30. Kf2 Rxh1 31. Rf6
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.05

### 1w-52: 27. Bf1 — blunder (94% → 47%)

- Engine best: **exd7+**; line: 27. exd7+ Kxd7 28. Bf1 Kc8 29. Bg2 Rh7 30. Bf4 Rhg7 31. Be5 Re7
- Others: Rxg3 (53%), Kg2 (50%)
- After Bf1: 27...Bxe6 28. Bg2 Bd5 29. Rff1 Rg4 30. Bd4 Re8 31. Bxd5 cxd5 32. Rfe1
- **Lesson:** material / hanging / consequence, gap 824cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before. And more is about to fall.

```
On move 27 you played Bf1. exd7+ was better.

  What you played:  27. Bf1 Bxe6 28. Bg2 Bd5 29. Rff1 b6 30. Rbe1 Kb7
  What was better:  27. exd7+ Kxd7 28. Bf5+ Kd8 29. Rd1+ Ke8 30. Kg2 h1=N

The difference is material. Before your move: material balance +4.
After your line: material balance +0. After the better line: material balance +4.
Your move left this undefended: pawn on e6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1w-54: 28. Bd4 — mistake (47% → 18%)

- Engine best: **Bg2**; line: 28. Bg2 Bd5 29. Rff1 Rg4 30. Bd4 Re8 31. Bxd5 cxd5 32. Rfe1 Rge4
- Others: c4 (38%), Rf6 (34%)
- After Bd4: 28...Bd5 29. Bg2 Bxf3 30. Bxf3 Rh7 31. Re1 Rf7 32. Bg2 a5 33. c4
- **Lesson:** material / safety / consequence, gap 248cp, pending

```
On move 28 you played Bd4. Bg2 was better.

  What you played:  28. Bd4 Bd5 29. Bg2 Bxf3 30. Bxf3 Rh4 31. Kg2 a5
  What was better:  28. Bg2 Bd5 29. Rff1 b6 30. Rbe1 Rh4 31. Bd4 Kb7

The difference is material. Before your move: material balance +1.
After your line: material balance -2. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1w-56: 29. Re1 — blunder (50% → 15%)

- Engine best: **Bg2**; line: 29. Bg2 Bd5 30. Rf5 Bxg2+ 31. Kxg2 Rd7 32. Rbf1 Rdd8 33. Re1 b6
- Others: Re3 (44%), c4 (42%)
- After Re1: 29...Bd5 30. Bg2 Bxf3 31. Bxf3 Rf7 32. Be4 Rff8 33. Rb1 Re8 34. Bd3
- **Lesson:** material / safety / consequence, gap 289cp, pending

```
On move 29 you played Re1. Bg2 was better.

  What you played:  29. Re1 Bd5 30. Bg2 Bxf3 31. Bxf3 Kb8 32. Kg2 Rf7
  What was better:  29. Bg2 Bd5 30. Re3 Rf7 31. Re5 Bxg2+ 32. Kxg2 b6

The difference is material. Before your move: material balance +1.
After your line: material balance -2. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1w-64: 33. Kg2 — blunder (92% → 6%)

- Engine best: **Bg4+**; line: 33. Bg4+ Kb8 34. Bxh3 a5 35. Bg2 Rf2 36. Bd4 Rf8 37. Be3 b6
- Others: Bg2 (41%), Be4 (39%)
- After Kg2: 33...Rxf3 34. Kxh3 Re3 35. Rxe3 h1=Q+ 36. Kxg3 Qc1 37. Re4 b6 38. a4
- **Lesson:** material / safety / consequence, gap 939cp, pending

```
On move 33 you played Kg2. Bg4+ was better.

  What you played:  33. Kg2 h1=Q+ 34. Rxh1 Rxh1 35. Bg4+ Kb8 36. Kxh1 Rf2
  What was better:  33. Bg4+ Kb8 34. Bxh3 Re8 35. Bf1 a5 36. c4 a4

The difference is material. Before your move: material balance -2.
After your line: material balance -1. After the better line: material balance +4.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1w-66: 34. Bxg3 — blunder (93% → 5%)

- Engine best: **Bg4+**; line: 34. Bg4+ Kb8 35. Bxh3 Rh7 36. Bxg3 b5 37. Bxh2 Kb7 38. Bg3 c5
- Others: Bxh8 (59%), Rh1 (50%)
- After Bxg3: 34...h1=Q+ 35. Rxh1 Rxh1 36. Be5 R8h7 37. Bg4+ Kb8 38. Bf5 R7h5 39. Bg6
- **Lesson:** material / safety / consequence, gap 1181cp, triggered after 2 plies
- Trigger: You've lost : you're 7 pawns worse off than before.

```
On move 34 you played Bxg3. Bg4+ was better.

  What you played:  34. Bxg3 h1=B+ 35. Rxh1 Rxh1 36. Be5 R8h7 37. Be4
  What was better:  34. Bg4+ Kb8 35. Bxh3 Rh5 36. Bf4 Rxh3 37. Kxh3

The difference is material. Before your move: material balance +1.
After your line: material balance -5. After the better line: material balance +5.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1w-92: 47. Bf4 — ok (50% → 48%)

- Engine best: **Be4**; line: 47. Be4 Re2 48. Kf5 Kc8 49. Bd4 Kd7 50. Ke5 Kc8 51. Kf4 Kd7
- Others: Ke6 (50%), Ke7 (49%)
- After Bf4: 47...Re2 48. Bd7 b4 49. cxb4 Rxc2 50. Be5 axb4 51. axb4 Kb7 52. Ba4
- **Lesson:** passed_pawns / passed_pawns / consequence, gap 39cp, pending; check: Passed is a main reason (+1.10)

```
On move 47 you played Bf4. Be4 was better.

  What you played:  47. Bf4 Re2 48. Bd7 Rxc2 49. Be5 b4 50. cxb4 axb4
  What was better:  47. Be4 Rf2+ 48. Kg5 Kc8 49. Bd4 Rd2 50. Kf4 Rd1

The difference is passed pawns. Before your move: your passed pawns: none; theirs: none.
After your line: your passed pawns: none; theirs: c4, c7. After the better line: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

### 1w-100: 51. Kd6 — inaccuracy (64% → 51%)

- Engine best: **Kd7**; line: 51. Kd7 Kb7 52. Be4 b4 53. Bxc6+ Ka6 54. a4 Rh3 55. Bb5+ Kb7
- Others: Kd6 (54%), Bd4 (49%)
- After Kd6: 51...Rf3 52. Be4 Rf6+ 53. Ke7 Rh6 54. Kd7 Rh4 55. Bg2 Rh6 56. Be3
- **Lesson:** material / forcing_moves / missed_chance, gap 71cp, pending

```
On move 51 you played Kd6. Kd7 was better.

  What you played:  51. Kd6 Rf3 52. Be4 Rf6+
  What was better:  51. Kd7 Kb7 52. Be4 b4

Your move wasn't a disaster, but Kd7 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 1w-112: 57. Bb3 — blunder (98% → 54%)

- Engine best: **Bxa3**; line: 57. Bxa3 Kc8 58. b6 Kb7 59. Bc5 c3 60. Kd5 Kb8 61. Kc6 Kc8
- Others: Bb3 (50%), Kd5 (50%)
- After Bb3: 57...Rxb3 58. cxb3 cxb3 59. Bd4 b2 60. Bxb2 Kb6 61. Bc3 Kxb5 62. Kd5
- **Lesson:** material / free_material / missed_chance, gap 693cp, pending

```
On move 57 you played Bb3. Bxa3 was better.

  What you played:  57. Bb3 Rxb3 58. cxb3 cxb3 59. Bd4 b2 60. Bxb2 Kb6
  What was better:  57. Bxa3 Kb6 58. c3 Kb7 59. Kc5 Kc7 60. Bc2 Kd7

Your move wasn't a disaster, but Bxa3 would have improved material.
After the better line: material balance +8. After yours: material balance +4.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

## Game 1 (1100), Black: Vienna Game

https://lichess.org/game/xE010qx0 · 1042 vs 1019 · 1-0

### 1b-3: 2... Qh4 — mistake (50% → 27%)

- Engine best: **Nf6**; line: 2...Nf6 3. Nf3 Nc6 4. Bc4 Nxe4 5. Nxe4 d5 6. Bd3 dxe4 7. Bxe4
- Others: Nc6 (50%), Bc5 (48%)
- After Qh4: 3. Nf3 Qe7 4. Nd5 Qd8 5. d4 c6 6. Nc3 exd4 7. Qxd4 d6
- **Lesson:** material / safety / consequence, gap 274cp, pending

```
On move 2 you played Qh4. Nf6 was better.

  What you played:  2...Qh4 3. Nf3 Qf6 4. Nd5 Qd8 5. Nxe5 d6 6. Nf3
  What was better:  2...Nf6 3. Nf3 Nc6 4. Nd5 Bd6 5. d4 exd4 6. Nxd4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1b-9: 5... Nc6 — inaccuracy (27% → 10%)

- Engine best: **Nf6**; line: 5...Nf6 6. Nf5 Qd8 7. e5 d6 8. exf6 Bxf5 9. Qf3 Qc8 10. Bc4
- Others: d6 (26%), a6 (25%)
- After Nc6: 6. Ndb5 d6 7. Nd5 Qxe4+ 8. Be2 Kd8 9. O-O Bd7 10. Ndxc7 Rc8
- *Rejected lesson:* king_safety / king_safety; King safety gains only -0.07

### 1b-17: 9... Qd7 — inaccuracy (53% → 39%)

- Engine best: **Nf6**; line: 9...Nf6 10. Qg3 h5 11. Bg5 Qc5 12. Bh4 Re8 13. f4 Ng4 14. O-O-O
- Others: h5 (50%), Qb4 (49%)
- After Qd7: 10. Qg3 Kb8 11. O-O-O Qe8 12. Be2 Rxd1+ 13. Rxd1 Nf6 14. f4 Bc8
- **Lesson:** material / forcing_moves / missed_chance, gap 153cp, pending

```
On move 9 you played Qd7. Nf6 was better.

  What you played:  9...Qd7 10. Qg3 Nf6 11. O-O-O Bb4 12. Na4 Qe7 13. c3
  What was better:  9...Nf6 10. h3 Qb4 11. Rb1 Bxa2 12. Ra1 Qxb2 13. O-O

Your move wasn't a disaster, but Nf6 would have improved material.
After the better line: material balance +2. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 1b-19: 10... Bb4 — inaccuracy (44% → 32%)

- Engine best: **Kb8**; line: 10...Kb8 11. Qg3 Nh6 12. Rad1 f6 13. Bxh6 gxh6 14. Bc4 Bd6 15. Bxe6
- Others: Nf6 (43%), Nh6 (39%)
- After Bb4: 11. Bxa7 Nf6 12. a3 Bd6 13. Qe2 Be5 14. f4 Bd4+ 15. Bxd4 Qxd4+
- **Lesson:** material / hanging / consequence, gap 97cp, pending

```
On move 10 you played Bb4. Kb8 was better.

  What you played:  10...Bb4 11. Bxa7 Nf6 12. e5 Ng4 13. Qg3 h5
  What was better:  10...Kb8 11. Qg3 Nh6 12. h3 f5 13. e5 Rg8

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: pawn on a7.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1b-23: 12... Bxc3 — inaccuracy (52% → 40%)

- Engine best: **Bg4**; line: 12...Bg4 13. Qg3 Nh5 14. Qh4 Be7 15. Bg5 f6 16. h3 fxg5 17. Qxg4
- Others: Bd6 (44%), Be7 (43%)
- After Bxc3: 13. bxc3 Qd6 14. h3 Qe5 15. Bxa7 b6 16. Qe3 g5 17. Rxb6 cxb6
- **Lesson:** material / hanging / missed_chance, gap 269cp, pending

```
On move 12 you played Bxc3. Bg4 was better.

  What you played:  12...Bxc3 13. bxc3 Qd6 14. h3 Nd7 15. Bxa7 Ne5 16. Qe3
  What was better:  12...Bg4 13. Qf4 Nh5 14. Qe5 f6 15. Qd4 Qxd4 16. Bxd4

Your move wasn't a disaster, but Bg4 would have improved material.
After the better line: material balance +1. After yours: material balance +0.
Your move left this undefended: pawn on a7, the piece you moved, now on c3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1b-25: 13... Rhe8 — ok (41% → 31%)

- Engine best: **Qd6**; line: 13...Qd6 14. h3 Qe5 15. a4 Qa5 16. Qe2 Nd7 17. f4 f5 18. Bd4
- Others: Kb8 (40%), b6 (34%)
- After Rhe8: 14. h3 Qe7 15. Bxa7 Nd7 16. a4 Ba2 17. Ra1 Qe6 18. Qe3 Bc4
- **Lesson:** material / hanging / consequence, gap 121cp, pending

```
On move 13 you played Rhe8. Qd6 was better.

  What you played:  13...Rhe8 14. Bxa7 Qe7 15. a4 Nd7
  What was better:  13...Qd6 14. Bf4 Qc5 15. Qg3 Nh5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: pawn on a7.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1b-27: 14... g6 — mistake (31% → 7%)

- Engine best: **Qd6**; line: 14...Qd6 15. Rfd1 Qe5 16. Bxa7 Nd7 17. Bd4 Qg5 18. Be3 Qa5 19. c4
- Others: Qe7 (31%), c5 (23%)
- After g6: 15. Qxf6 h6 16. c4 c5 17. Rfd1 g5 18. Be2 Qc6 19. Rxd8+ Rxd8
- **Lesson:** material / hanging / consequence, gap 492cp, pending

```
On move 14 you played g6. Qd6 was better.

  What you played:  14...g6 15. Qxf6 Bxh3 16. Qf3 Be6 17. Qf4 h5 18. e5
  What was better:  14...Qd6 15. Rfd1 Qe5 16. Bxa7 c5 17. Ba6 Rxd1+ 18. Qxd1

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +2.
Your move left this undefended: pawn on a7, knight on f6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1b-29: 15... h5 — ok (16% → 8%)

- Engine best: **Bxg4**; line: 15...Bxg4 16. hxg4 Nxg4 17. Bg5 f6 18. Be2 fxg5 19. Qxg4 Qxg4+ 20. Bxg4+
- Others: Nxg4 (13%), g5 (12%)
- After h5: 16. Qxf6 Qd6 17. Be2 Qf8 18. Rbd1 Rxd1 19. Rxd1 hxg4 20. hxg4 Rd8
- *Rejected lesson:* mobility / activity; Mobility isn't a main reason (top: King safety 1.04, Bishops 0.30)

### 1b-35: 18... Bxd7 — ok (12% → 9%)

- Engine best: **Rxd7**; line: 18...Rxd7 19. Kh2 Bg4 20. f3 Be6 21. c4 b6 22. c5 b5 23. a4
- Others: Bxd7 (9%), Kxd7 (9%)
- After Bxd7: 19. Bg5 h2+ 20. Kg2 Rh8 21. Rh1 Rdg8 22. Bf6 Rh5 23. e5 Bf5
- **Lesson:** material / free_material / missed_chance, gap 77cp, pending

```
On move 18 you played Bxd7. Rxd7 was better.

  What you played:  18...Bxd7 19. Bg5 h2+ 20. Kh1 Bh3 21. Rfe1 Rd7 22. Re3
  What was better:  18...Rxd7 19. Kh2 f5 20. Rg1 fxe4 21. Bxe4 Bf5 22. Bf3

Your move wasn't a disaster, but Rxd7 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 1b-37: 19... Rh8 — ok (13% → 12%)

- Engine best: **Re6**; line: 19...Re6 20. Kh2 Rde8 21. e5 g5 22. Rbe1 c5 23. Bf5 gxf4 24. Bxe6
- Others: Rh8 (13%), b6 (13%)
- After Rh8: 20. Bd4 Rh4 21. Bf6 Rg4+ 22. Kh1 Re8 23. Rf2 Rg3 24. Re1 Re6
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.08

### 1b-41: 21... g5 — ok (15% → 10%)

- Engine best: **a5**; line: 21...a5 22. Kh2 b6 23. Bc4 Rh7 24. Rd2 Bf5 25. Bf2 Kb7 26. Rg1
- Others: b6 (15%), Bf5 (14%)
- After g5: 22. fxg5 Rxe5 23. Bf4 Re7 24. Kh2 b6 25. Bg3 Kb7 26. Rbf1 Be8
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only -0.03

### 1b-43: 22... g4 — ok (10% → 9%)

- Engine best: **h2+**; line: 22...h2+ 23. Rxh2 Rxh2 24. Kxh2 Rxe5 25. Bd4 Ra5 26. Rg1 Rxf5 27. Bxf5
- Others: c5 (10%), Rxe5 (10%)
- After g4: 23. Bf4 c5 24. Kh2 Bc6 25. Bg3 a6 26. Be2 Rhg8 27. a4 Bxa4
- **Lesson:** material / forcing_moves / missed_chance, gap 107cp, pending

```
On move 22 you played g4. c5 was better.

  What you played:  22...g4 23. Bf4 Rh5 24. Bg3 c5 25. Kh2 b6 26. Ba6+
  What was better:  22...c5 23. e6 fxe6 24. f6 g4 25. Bf4 Ref8 26. Be5

Your move wasn't a disaster, but c5 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 1b-47: 24... g3 — blunder (42% → 5%)

- Engine best: **Bxe6**; line: 24...Bxe6 25. Bf4 Bd5 26. Bg3 Re7 27. Kh2 Bf3 28. Rff1 Rhe8 29. Rbe1
- Others: Rxe6 (37%), h2+ (18%)
- After g3: 25. exd7+ Kxd7 26. Bf5+ Ke7 27. Rf3 h2+ 28. Kg2 h1=Q+ 29. Rxh1 Rxh1
- **Lesson:** material / hanging / consequence, gap 593cp, pending

```
On move 24 you played g3. Bxe6 was better.

  What you played:  24...g3 25. exd7+ Kxd7 26. Bf5+ Kd8 27. Bg5+ Re7 28. Rd2+
  What was better:  24...Bxe6 25. Bf4 Bd5 26. Bg3 a5 27. Kh2 Bf3 28. Rff1

The difference is material. Before your move: material balance -1.
After your line: material balance -3. After the better line: material balance +0.
Your move left this undefended: bishop on d7, pawn on a7.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1b-49: 25... h2+ — blunder (87% → 55%)

- Engine best: **Bxe6**; line: 25...Bxe6 26. c4 h2+ 27. Kh1 g2+ 28. Kxg2 h1=R 29. Rxh1 Reg8+ 30. Kf2
- Others: h2+ (57%), Rxe6 (37%)
- After h2+: 26. Kg2 Bxe6 27. Bd4 Rh6 28. Bg7 Rh4 29. c4 Bxc4 30. Bxc4 Rxc4
- *No lesson.*

### 1b-51: 26... Reg8 — blunder (89% → 6%)

- Engine best: **Bxe6**; line: 26...Bxe6 27. c4 g2+ 28. Kxg2 h1=B+ 29. Rxh1 Reg8+ 30. Kf2 Rxh1 31. Rf6
- Others: g2+ (76%), Rxe6 (34%)
- After Reg8: 27. exd7+ Kxd7 28. Bf1 Kc8 29. Bg2 Rh7 30. Bf4 Rhg7 31. Be5 Re7
- **Lesson:** material / hanging / consequence, gap 1235cp, pending

```
On move 26 you played Reg8. Bxe6 was better.

  What you played:  26...Reg8 27. exd7+ Kxd7 28. Bf1 Rh5 29. Rd1+ Kc8 30. Bg2
  What was better:  26...Bxe6 27. c4 g2+ 28. Kxg2 h1=R 29. Rxh1 Reg8+ 30. Rg3

The difference is material. Before your move: material balance -1.
After your line: material balance -3. After the better line: material balance +2.
Your move left this undefended: bishop on d7, pawn on a7.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1b-55: 28... Rh7 — blunder (82% → 50%)

- Engine best: **Bd5**; line: 28...Bd5 29. Bg2 Bxf3 30. Bxf3 Rh7 31. Re1 Rf7 32. Bg2 a5 33. c4
- Others: Rh5 (53%), Rh7 (52%)
- After Rh7: 29. Bg2 Bd5 30. Rf5 Bxg2+ 31. Kxg2 Rd7 32. Rbf1 Rdd8 33. Re1 b6
- **Lesson:** material / forcing_moves / missed_chance, gap 348cp, pending

```
On move 28 you played Rh7. Bd5 was better.

  What you played:  28...Rh7 29. Bg2 Bd5 30. Rf5 Bxg2+ 31. Kxg2 Rd7 32. Re5
  What was better:  28...Bd5 29. Bg2 Bxf3 30. Bxf3 Rh7 31. Re1 Rf7 32. Kg2

Your move wasn't a disaster, but Bd5 would have improved material.
After the better line: material balance +2. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 1b-61: 31... Rh3 — ok (92% → 83%)

- Engine best: **Rf7**; line: 31...Rf7 32. Bg2 Rff8 33. Rd1 Rd8 34. Rc1 Rde8 35. Bf1 Kb8 36. Kg2
- Others: Rd7 (89%), a5 (87%)
- After Rh3: 32. Kg2 Rh4 33. Rh1 Kb8 34. Be2 Re4 35. Bd3 Reg4 36. Be2 R4g5
- *No lesson.*

### 1b-63: 32... Rf8 — blunder (91% → 8%)

- Engine best: **Rh7**; line: 32...Rh7 33. Bd4 Rd7 34. Bg2 Rdd8 35. a4 a5 36. Bf3 Rde8 37. Ra1
- Others: Rh4 (88%), a5 (87%)
- After Rf8: 33. Bg4+ Kb8 34. Bxh3 a5 35. Bg2 Rf2 36. Bd4 Rf8 37. Be3 b6
- **Lesson:** material / safety / consequence, gap 1011cp, pending

```
On move 32 you played Rf8. a5 was better.

  What you played:  32...Rf8 33. Bg4+ Kb8 34. Bxh3 Re8 35. Bxg3 Rxe1+
  What was better:  32...a5 33. Rf1 Rh7 34. Kg2 Re7 35. Bf4 Kb8

The difference is material. Before your move: material balance +2.
After your line: material balance -4. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1b-65: 33... Rfh8 — blunder (94% → 7%)

- Engine best: **Rxf3**; line: 33...Rxf3 34. Kxh3 Re3 35. Rxe3 h1=Q+ 36. Kxg3 Qc1 37. Re4 b6 38. a4
- Others: h1=R (88%), h1=Q+ (88%)
- After Rfh8: 34. Bg4+ Kb8 35. Bxh3 Rh7 36. Bxg3 b5 37. Bxh2 Kb7 38. Bg3 c5
- **Lesson:** material / safety / consequence, gap 952cp, pending

```
On move 33 you played Rfh8. h1=Q+ was better.

  What you played:  33...Rfh8 34. Bg4+ Kb8 35. Bxh3 h1=B+ 36. Rxh1 Re8 37. Re1
  What was better:  33...h1=Q+ 34. Rxh1 Rxh1 35. Bg4+ Kb8 36. Kxh1 Rf2 37. Bxg3

The difference is material. Before your move: material balance +2.
After your line: material balance -4. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1b-73: 37... R1h2+ — blunder (96% → 55%)

- Engine best: **R8h4**; line: 37...R8h4 38. Kg3 Rh6 39. c4 Re1 40. Bb2 Re4 41. Bf5 Rxc4 42. Bd3
- Others: R8h6 (96%), R8h7 (95%)
- After R1h2+: 38. Bxh2 Re8 39. Kf3 Re1 40. c4 Ra1 41. Ke3 Rxa3+ 42. Kd2 Ra1
- **Lesson:** material / hanging / consequence, gap 670cp, triggered after 2 plies
- Trigger: You've lost a rook: you're 5 pawns worse off than before.

```
On move 37 you played R1h2+. R8h6 was better.

  What you played:  37...R1h2+ 38. Bxh2 Re8 39. Kf2 Re4 40. Be2 Ra4 41. Ke1
  What was better:  37...R8h6 38. Bf4 R6h4 39. Be5 Ra1 40. Kg3 Rxg4+ 41. Kxg4

The difference is material. Before your move: material balance +5.
After your line: material balance +1. After the better line: material balance +4.
Your move left this undefended: rook on h8, the piece you moved, now on h2.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 1b-99: 50... c6 — inaccuracy (51% → 36%)

- Engine best: **Rg3**; line: 50...Rg3 51. Be4 Rg5 52. Bd4 Rg4 53. Ke5 b4 54. axb4 axb4 55. Bd5
- Others: Rf3 (51%), b4 (50%)
- After c6: 51. Kd7 Kb7 52. Be4 b4 53. Bxc6+ Ka6 54. a4 Rh3 55. Bb5+ Kb7
- *Rejected lesson:* open_files / open_files; Rooks gains only -0.03

### 1b-101: 51... Kb7 — inaccuracy (49% → 36%)

- Engine best: **Rf3**; line: 51...Rf3 52. Be4 Rf6+ 53. Ke7 Rh6 54. Kd7 Rh4 55. Bg2 Rh6 56. Be3
- Others: Kb7 (40%), b4 (28%)
- After Kb7: 52. Be4 Rh3 53. Bxc6+ Ka6 54. Bd5 Rh6+ 55. Kc7 Rh7+ 56. Kc6 Rh6+
- **Lesson:** material / safety / consequence, gap 120cp, pending

```
On move 51 you played Kb7. Rf3 was better.

  What you played:  51...Kb7 52. Be4 Rh3 53. Bxc6+ Ka6 54. Bd7 Rh6+ 55. Kc7
  What was better:  51...Rf3 52. Be4 Rf6+ 53. Ke7 Rh6 54. Kd7 Kb7 55. c3

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1b-103: 52... b4 — ok (31% → 22%)

- Engine best: **Rg3**; line: 52...Rg3 53. Bxc6+ Ka6 54. Bd5 Rh3 55. Bd4 Rh7 56. Kc6 Rh5 57. c3
- Others: Rh3 (31%), b4 (26%)
- After b4: 53. axb4 axb4 54. Bxb4 Rg3 55. Bxc6+ Kb6 56. Bc5+ Ka5 57. Bf2 Rg5
- *No lesson.*

### 1b-105: 53... a4 — mistake (23% → 2%)

- Engine best: **axb4**; line: 53...axb4 54. Bxb4 Rh3 55. Bxc6+ Kb6 56. Bd7 Rg3 57. Kd5 Rg7 58. Ba4
- Others: Ka6 (21%), Kb8 (9%)
- After a4: 54. b5 Rg3 55. bxc6+ Ka6 56. Bd5 Rg6+ 57. Be6 Kb5 58. c7 Rxe6+
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only 0.00

### 1b-113: 57... c3 — blunder (46% → 2%)

- Engine best: **Rxb3**; line: 57...Rxb3 58. cxb3 cxb3 59. Bd4 b2 60. Bxb2 Kb6 61. Bc3 Kxb5 62. Kd5
- Others: cxb3 (2%), Ra8 (2%)
- After c3: 58. Bd5+ Kb8 59. Bxa3 Kc8 60. Kc6 Kb8 61. Bd6+ Kc8 62. b6 Kd8
- **Lesson:** material / safety / consequence, gap 1194cp, pending

```
On move 57 you played c3. Rxb3 was better.

  What you played:  57...c3 58. Bd5+ Kc8 59. Bxa3 Kd8 60. Kc6 Kc8 61. b6
  What was better:  57...Rxb3 58. cxb3 cxb3 59. Bd4 b2 60. Bxb2 Kb6 61. Bc3

The difference is material. Before your move: material balance -2.
After your line: material balance -7. After the better line: material balance -3.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 2 (1100), White: Italian Game

https://lichess.org/game/7ITFp1hL · 1004 vs 1010 · 1-0

### 2w-6: 4. d3 — ok (59% → 55%)

- Engine best: **O-O**; line: 4. O-O d5 5. exd5 Nxd5 6. d4 Nb6 7. Bb5 Bg4 8. h3 Bxf3
- Others: Nc3 (59%), d4 (56%)
- After d3: 4...d5 5. exd5 Nxd5 6. O-O Bg4 7. Re1 Qd6 8. h3 Bh5 9. Bb5
- **Lesson:** mobility / activity / consequence, gap 44cp, pending; check: Mobility is a main reason (+0.49)

```
On move 4 you played d3. Nc3 was better.

  What you played:  4. d3 d5 5. exd5 Nxd5 6. O-O Bg4 7. h3 Bh5
  What was better:  4. Nc3 Ng6 5. h4 Be7 6. h5 Nh4 7. h6 g6

The difference is piece activity. Before your move: 19 piece moves available vs opponent's 10.
After your line: 23 piece moves available vs opponent's 31. After the better line: 27 piece moves available vs opponent's 17.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 2w-8: 5. Nc3 — inaccuracy (61% → 52%)

- Engine best: **Ng5**; line: 5. Ng5 d5 6. exd5 Na5 7. Nc3 h6 8. Nf3 Ng6 9. a3 Nxc4
- Others: a4 (57%), a3 (55%)
- After Nc3: 5...Na5 6. Bd5 Nxd5 7. Nxd5 Nc6 8. O-O a5 9. d4 Be7 10. h3
- **Lesson:** material / safety / consequence, gap 126cp, pending

```
On move 5 you played Nc3. Ng5 was better.

  What you played:  5. Nc3 Na5 6. Bd5 c6 7. Bxf7+ Kxf7 8. b4 Ke8
  What was better:  5. Ng5 d5 6. exd5 Na5 7. Qh5 Ng6 8. Nc3 Nxc4

The difference is material. Before your move: material balance +0.
After your line: material balance +0. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2w-10: 6. exf5 — blunder (89% → 57%)

- Engine best: **Ng5**; line: 6. Ng5 d5 7. exd5 Na5 8. d6 Nxc4 9. dxe7 Bxe7 10. dxc4 Qxd1+
- Others: a4 (71%), a3 (65%)
- After exf5: 6...Bxf5 7. d4 d5 8. Bb3 e4 9. Nh4 Qd7 10. Nxf5 Qxf5 11. O-O
- **Lesson:** material / hanging / missed_chance, gap 345cp, pending

```
On move 6 you played exf5. Ng5 was better.

  What you played:  6. exf5 Bxf5 7. d4 d5 8. Bb5 a6 9. Bxc6+ Nxc6
  What was better:  6. Ng5 d5 7. Nxd5 Nxd5 8. Bxd5 f4 9. Nf7 Qh4

Your move wasn't a disaster, but Ng5 would have improved material.
After the better line: material balance +6. After yours: material balance +1.
Your move left this undefended: the piece you moved, now on f5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 2w-20: 11. Ng7+ — inaccuracy (92% → 73%)

- Engine best: **Qe2**; line: 11. Qe2 Nb6 12. Bb5 h5 13. Ne3 Bg7 14. Na4 Bxd4 15. c3 Be5
- Others: Qg4 (85%), Bg5 (82%)
- After Ng7+: 11...Bxg7 12. Qxd5 Qxd5 13. Bxd5 N8e7 14. Bxe4 O-O-O 15. Bd2 Bxd4 16. O-O
- *No lesson.*

### 2w-26: 14. O-O — inaccuracy (73% → 60%)

- Engine best: **Bxb7**; line: 14. Bxb7 Rb8 15. Bxe4 Nd6 16. Bd3 Nc6 17. O-O Nb4 18. Re1+ Kf7
- Others: O-O (60%), Bxe4 (59%)
- After O-O: 14...Nd6 15. Nxe4 Nxe4 16. Bxb7 Rb8 17. Bxe4 Ne2+ 18. Kh1 Nxc1 19. Raxc1
- *No lesson.*

### 2w-38: 20. Bxf5 — mistake (82% → 60%)

- Engine best: **Bc1**; line: 20. Bc1 Rf8 21. Ne2 Nxe2+ 22. Rxe2 g5 23. Re4 Rd5 24. g3 b5
- Others: Bf4 (81%), Na4 (79%)
- After Bxf5: 20...gxf5 21. Rc1 h5 22. Rfe1 Rg8 23. Kf1 Be5 24. Bxd4 Bxd4 25. Rcd1
- *No lesson.*

### 2w-40: 21. Bc5 — inaccuracy (63% → 52%)

- Engine best: **Bxa7**; line: 21. Bxa7 Bxc3 22. bxc3 b5 23. Bc5 Rd5 24. Bb4 c5 25. Ba3 Kd7
- Others: Bf4 (54%), Bc1 (54%)
- After Bc5: 21...b6 22. Be3 g5 23. Bc1 Nd4 24. f4 gxf4 25. Bxf4 Nxc2 26. Re6
- *No lesson.*

### 2w-42: 22. Bb4 — inaccuracy (52% → 40%)

- Engine best: **Be3**; line: 22. Be3 g5 23. Bc1 Nd4 24. f4 Nxc2 25. Re6 gxf4 26. Bxf4 Nd4
- Others: Ba3 (44%), Bb4 (39%)
- After Bb4: 22...Nd4 23. Rc1 c5 24. Ba3 Re8 25. b3 Nf3+ 26. gxf3 Bxc3 27. Rfd1
- **Lesson:** mobility / activity / consequence, gap 119cp, pending; check: Mobility is a main reason (+0.29)

```
On move 22 you played Bb4. Be3 was better.

  What you played:  22. Bb4 c5 23. Ba3 Nd4 24. Rc1 Re8 25. b4 cxb4
  What was better:  22. Be3 Rhd8 23. h4 c5 24. g3 Nxe3 25. Rxe3 Rd2

The difference is piece activity. Before your move: 26 piece moves available vs opponent's 27.
After your line: 15 piece moves available vs opponent's 30. After the better line: 21 piece moves available vs opponent's 24.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 2w-48: 25. c4 — inaccuracy (67% → 50%)

- Engine best: **Re6**; line: 25. Re6 g5 26. Rf6 Ng7 27. Re1 Nh5 28. Rf8 Rhh7 29. Bc1 Rde7
- Others: Bc1 (66%), f3 (65%)
- After c4: 25...Rd2 26. f4 h5 27. Rf2 Rhd8 28. Bb2 Rd1 29. Rxd1 Rxd1+ 30. Rf1
- **Lesson:** material / safety / consequence, gap 194cp, pending

```
On move 25 you played c4. Re6 was better.

  What you played:  25. c4 Rd2 26. f4 Rxc2 27. g4 Nh4 28. Rf2 Rxc4
  What was better:  25. Re6 Rg8 26. Bc1 h5 27. h3 Re7 28. Rfe1 Rxe6

The difference is material. Before your move: material balance +1.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2w-50: 26. Be7 — inaccuracy (50% → 36%)

- Engine best: **Bb2**; line: 26. Bb2 Rhd8 27. g4 Nh4 28. Re7+ Ka6 29. Bf6 g5 30. Re6 R8d7
- Others: f4 (50%), Rb1 (48%)
- After Be7: 26...Rh7 27. Bf6 Rxc2 28. Re6 Rxc4 29. f4 Rf7 30. Be5 Ne3 31. Rf3
- **Lesson:** material / safety / consequence, gap 128cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 26 you played Be7. Bb2 was better.

  What you played:  26. Be7 h5 27. c5 b5 28. Bf6 Rf8 29. Re6 Rxc2
  What was better:  26. Bb2 Rf8 27. Rc1 Nd4 28. Rfd1 Ne2+ 29. Kf1 Ng3+

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +3.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2w-52: 27. Bf6 — ok (39% → 35%)

- Engine best: **g4**; line: 27. g4 Nd4 28. f4 Re8 29. Rf2 Rc3 30. Kf1 Nc2 31. Re6 Ne3+
- Others: Bf6 (36%), h3 (33%)
- After Bf6: 27...Rh7 28. Re6 Rxc4 29. f4 Rf7 30. Be5 Ne3 31. Rf3 Nd5 32. h3
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 113cp, pending; check: Pawns is a main reason (+0.16)

```
On move 27 you played Bf6. g4 was better.

  What you played:  27. Bf6 Rf8 28. Re6 Rxc4 29. h3 h5 30. Be5 Rg8
  What was better:  27. g4 Nd4 28. f4 Re8 29. Re4 c5 30. f5 gxf5

Your move wasn't a disaster, but g4 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on f5, h6; backward pawn(s) on b6. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 2w-58: 30. Re7+ — blunder (93% → 60%)

- Engine best: **g4**; line: 30. g4 Nd6 31. f4 Nxc4 32. Re2 Nd6 33. Be5 Nc4 34. Bg7 Nd6
- Others: c5 (93%), Re4 (93%)
- After Re7+: 30...Nxe7 31. Bxe7 Rxc4 32. f4 Kc8 33. g4 b5 34. Bd6 b4 35. Kf2
- **Lesson:** material / hanging / consequence, gap 604cp, pending

```
On move 30 you played Re7+. c5 was better.

  What you played:  30. Re7+ Nxe7 31. Bxe7 Rxc4 32. f4 c5 33. g4 a4
  What was better:  30. c5 b5 31. Ra1 Nd4 32. Bxd4 Rxd4 33. Rxa5 Rc4

The difference is material. Before your move: material balance +4.
After your line: material balance +1. After the better line: material balance +5.
Your move left this undefended: pawn on c4, the piece you moved, now on e7.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 2 (1100), Black: Italian Game

https://lichess.org/game/7ITFp1hL · 1004 vs 1010 · 1-0

### 2b-5: 3... Nge7 — ok (48% → 41%)

- Engine best: **Nf6**; line: 3...Nf6 4. d3 Bc5 5. c3 d6 6. O-O O-O 7. h3 Bb6 8. Nbd2
- Others: Bc5 (48%), d6 (46%)
- After Nge7: 4. O-O d5 5. exd5 Nxd5 6. d4 Nb6 7. Bb5 Bg4 8. h3 Bxf3
- *Rejected lesson:* centre / centre; Space/Mobility gains only -0.13

### 2b-7: 4... d6 — ok (45% → 39%)

- Engine best: **d5**; line: 4...d5 5. exd5 Nxd5 6. O-O Bg4 7. Re1 Qd6 8. h3 Bh5 9. Bb5
- Others: h6 (44%), a6 (43%)
- After d6: 5. Ng5 d5 6. exd5 Na5 7. Nc3 h6 8. Nf3 Ng6 9. a3 Nxc4
- **Lesson:** material / safety / consequence, gap 118cp, pending

```
On move 4 you played d6. d5 was better.

  What you played:  4...d6 5. Ng5 d5 6. exd5 Na5 7. Qh5 Ng6 8. Nc3
  What was better:  4...d5 5. exd5 Nxd5 6. O-O Be7 7. Re1 Qd6 8. Bxd5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2b-9: 5... f5 — blunder (48% → 11%)

- Engine best: **Na5**; line: 5...Na5 6. Bd5 Nxd5 7. Nxd5 Nc6 8. O-O a5 9. d4 Be7 10. h3
- Others: Be6 (47%), h6 (43%)
- After f5: 6. Ng5 d5 7. exd5 Na5 8. d6 Nxc4 9. dxe7 Bxe7 10. dxc4 Qxd1+
- **Lesson:** material / safety / consequence, gap 371cp, pending

```
On move 5 you played f5. Na5 was better.

  What you played:  5...f5 6. Ng5 d5 7. Nxd5 Nxd5 8. Bxd5 f4 9. Nf7
  What was better:  5...Na5 6. Bd5 Nxd5 7. Nxd5 Nc6 8. O-O Ne7 9. c4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2b-13: 7... e4 — inaccuracy (44% → 34%)

- Engine best: **d5**; line: 7...d5 8. Bb3 e4 9. Nh4 Qd7 10. Nxf5 Qxf5 11. O-O O-O-O 12. f3
- Others: exd4 (42%), Nxd4 (42%)
- After e4: 8. Nh4 Qd7 9. Nxf5 Qxf5 10. Be2 h5 11. d5 Nb4 12. Bc4 Qg4
- **Lesson:** material / forcing_moves / missed_chance, gap 99cp, pending

```
On move 7 you played e4. exd4 was better.

  What you played:  7...e4 8. Nh4 Qd7 9. Nxf5 Qxf5 10. d5 Ne5 11. Qe2
  What was better:  7...exd4 8. Nxd4 Nxd4 9. Qxd4 Nc6 10. Qd5 Qd7 11. O-O

Your move wasn't a disaster, but exd4 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 2b-15: 8... Nc8 — mistake (32% → 4%)

- Engine best: **Qd7**; line: 8...Qd7 9. Nxf5 Qxf5 10. Be2 h5 11. d5 Ne5 12. Qd4 a6 13. Bd2
- Others: Na5 (31%), g6 (22%)
- After Nc8: 9. Nxf5 g6 10. Qg4 Qf6 11. Ne3 Nxd4 12. Bd2 Nb6 13. Qxe4+ Qe5
- **Lesson:** material / hanging / consequence, gap 667cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before.

```
On move 8 you played Nc8. Qd7 was better.

  What you played:  8...Nc8 9. Nxf5 Nb6 10. Bb3 d5 11. Ne3 Qh4 12. Bxd5
  What was better:  8...Qd7 9. Nxf5 Qxf5 10. d5 Ne5 11. Qe2 O-O-O 12. Bb3

The difference is material. Before your move: material balance +0.
After your line: material balance -4. After the better line: material balance +0.
Your move left this undefended: bishop on f5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 2b-27: 14... c6 — inaccuracy (40% → 29%)

- Engine best: **Nd6**; line: 14...Nd6 15. Nxe4 Nxe4 16. Bxb7 Rb8 17. Bxe4 Ne2+ 18. Kh1 Nxc1 19. Raxc1
- Others: Nxc2 (39%), c6 (31%)
- After c6: 15. Bxe4 Nd6 16. Bd3 O-O-O 17. Bg5 Rde8 18. Bf4 Nf7 19. Rfe1 Ne5
- *No lesson.*

### 2b-33: 17... Rd7 — ok (29% → 25%)

- Engine best: **Rde8**; line: 17...Rde8 18. Rfe1 Ne6 19. Be3 Kc7 20. Rab1 Rhf8 21. g3 Nd4 22. Kg2
- Others: Rd7 (27%), Rdg8 (22%)
- After Rd7: 18. Rae1 b5 19. Ne4 Nb7 20. b3 a5 21. h4 Kc7 22. Bf4+ Kb6
- **Lesson:** mobility / activity / missed_chance, gap 37cp, pending; check: Mobility is a main reason (+0.48)

```
On move 17 you played Rd7. Rde8 was better.

  What you played:  17...Rd7 18. Rae1 Nf7 19. Bf4 Rhd8 20. a4 Rf8 21. h3
  What was better:  17...Rde8 18. Bf4 Nf7 19. Rae1 Ne5 20. Bxe5 Bxe5 21. Ne4

Your move wasn't a disaster, but Rde8 would have improved piece activity.
After the better line: 22 piece moves available vs opponent's 17. After yours: 26 piece moves available vs opponent's 36.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 2b-35: 18... h6 — ok (25% → 18%)

- Engine best: **Nf7**; line: 18...Nf7 19. Bf4 Rhd8 20. a4 a5 21. h3 Rf8 22. Ne4 Ne6 23. Bh2
- Others: b5 (25%), Rf8 (23%)
- After h6: 19. Bc1 g5 20. Ne4 Nxe4 21. Rxe4 Bf6 22. g3 Kc7 23. Kg2 a5
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.06

### 2b-39: 20... Nxf5 — ok (40% → 37%)

- Engine best: **gxf5**; line: 20...gxf5 21. Rc1 h5 22. Rfe1 Rg8 23. Kf1 Be5 24. Bxd4 Bxd4 25. Rcd1
- Others: Nxf5 (35%), Nf3+ (7%)
- After Nxf5: 21. Bxa7 Bxc3 22. bxc3 b5 23. Bc5 Rd5 24. Bb4 c5 25. Ba3 Kd7
- **Lesson:** material / hanging / consequence, gap 84cp, pending

```
On move 20 you played Nxf5. gxf5 was better.

  What you played:  20...Nxf5 21. Bxa7 Rd2 22. Rc1 Bxc3 23. bxc3 Rd5 24. c4
  What was better:  20...gxf5 21. Rc1 b5 22. Rfd1 Rhd8 23. Kf1 Ne6 24. Rxd7

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.
Your move left this undefended: pawn on a7.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 2b-43: 22... a5 — inaccuracy (60% → 48%)

- Engine best: **Nd4**; line: 22...Nd4 23. Rc1 c5 24. Ba3 Re8 25. b3 Nf3+ 26. gxf3 Bxc3 27. Rfd1
- Others: c5 (60%), Rhd8 (49%)
- After a5: 23. Ba3 Nd4 24. Na4 Kc7 25. c3 Nc2 26. Bc5 bxc5 27. Re2 Nd4
- **Lesson:** material / safety / consequence, gap 108cp, pending

```
On move 22 you played a5. c5 was better.

  What you played:  22...a5 23. Ba3 Kc7 24. Na4 b5 25. Nc5 b4 26. Nxd7
  What was better:  22...c5 23. Ba3 Nd4 24. Rc1 Re8 25. g3 g5 26. Kg2

The difference is material. Before your move: material balance -1.
After your line: material balance -3. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2b-45: 23... Bxc3 — ok (49% → 40%)

- Engine best: **Kc7**; line: 23...Kc7 24. Na4 b5 25. Nc5 b4 26. Nxd7 Kxd7 27. Rd1+ Kc7 28. Rfe1
- Others: Nd4 (49%), b5 (47%)
- After Bxc3: 24. bxc3 Ng7 25. Bc1 h5 26. h4 b5 27. f3 Re8 28. Kf2 Rd5
- **Lesson:** material / hanging / missed_chance, gap 140cp, pending

```
On move 23 you played Bxc3. Kc7 was better.

  What you played:  23...Bxc3 24. bxc3 Nd6 25. Bc1 Nb5 26. f3 Kb7 27. Re6
  What was better:  23...Kc7 24. Na4 Nd4 25. c3 Nc2 26. Bc5 bxc5 27. Re2

Your move wasn't a disaster, but Kc7 would have improved material.
After the better line: material balance +2. After yours: material balance -1.
Your move left this undefended: the piece you moved, now on c3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 2b-53: 27... Re8 — blunder (65% → 6%)

- Engine best: **Rh7**; line: 27...Rh7 28. Re6 Rxc4 29. f4 Rf7 30. Be5 Ne3 31. Rf3 Nd5 32. h3
- Others: Rf8 (65%), Rg8 (58%)
- After Re8: 28. Rxe8 Rxc4 29. Re6 g5 30. Rfe1 Rg4 31. Kf1 Nh4 32. g3 Nf5
- **Lesson:** material / hanging / consequence, gap 986cp, triggered after 2 plies
- Trigger: You've lost a rook: you're 5 pawns worse off than before.

```
On move 27 you played Re8. Rf8 was better.

  What you played:  27...Re8 28. Rxe8 Rxc4 29. Rd8 Re4 30. h3
  What was better:  27...Rf8 28. Re6 Rxc4 29. h3 h5 30. Be5

The difference is material. Before your move: material balance +0.
After your line: material balance -4. After the better line: material balance +1.
Your move left this undefended: the piece you moved, now on e8.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 2b-59: 30... Ka6 — blunder (40% → 7%)

- Engine best: **Nxe7**; line: 30...Nxe7 31. Bxe7 Rxc4 32. f4 Kc8 33. g4 b5 34. Bd6 b4 35. Kf2
- Others: Ka6 (7%), Ka8 (4%)
- After Ka6: 31. Re4 h5 32. Rc1 Nd6 33. Rf4 c5 34. g4 Nf7 35. Kg2 g5
- **Lesson:** material / safety / consequence, gap 561cp, triggered after 2 plies
- Trigger: You're about to lose material.

```
On move 30 you played Ka6. Nxe7 was better.

  What you played:  30...Ka6 31. Re4 Nd6 32. Rh4 Rxc4 33. Rxh6 Ne4 34. Rxg6
  What was better:  30...Nxe7 31. Bxe7 Rxc4 32. f4 Kc7 33. g4 a4 34. Kg2

The difference is material. Before your move: material balance -1.
After your line: material balance -5. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 3 (1100), White: Philidor Defense

https://lichess.org/game/oLJq2KWl · 1075 vs 1054 · 1-0

### 3w-18: 10. Nd5 — ok (54% → 52%)

- Engine best: **Nh4**; line: 10. Nh4 Nd4 11. f4 Be7 12. Nf3 Nd7 13. Bxd4 cxd4 14. Nd5 a4
- Others: Ne1 (54%), Nd2 (53%)
- After Nd5: 10...Be7 11. b4 axb4 12. axb4 Rxa1 13. Qxa1 Nxd5 14. cxd5 Nxb4 15. d4
- **Lesson:** centre / centre / consequence, gap 43cp, pending; check: Space is a main reason (+0.37)

```
On move 10 you played Nd5. Ne1 was better.

  What you played:  10. Nd5 Be7 11. h3 O-O 12. Nxe7+ Qxe7 13. Nh2 a4
  What was better:  10. Ne1 Be7 11. f4 Nd4 12. Nf3 O-O 13. Bd2 Nxf3+

The difference is control of the centre. Before your move: centre control 10 vs 9.
After your line: centre control 6 vs 10. After the better line: centre control 8 vs 9.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 3w-22: 12. Bh4 — inaccuracy (68% → 56%)

- Engine best: **Bd2**; line: 12. Bd2 g6 13. b4 Nh6 14. Qc1 Nf7 15. Bd1 a4 16. b5 Nb8
- Others: Bc1 (61%), Be3 (61%)
- After Bh4: 12...Be7 13. b4 axb4 14. Nd2 Nh6 15. axb4 Rxa1 16. Qxa1 Nxb4 17. Nxb4
- *Rejected lesson:* material / safety; not a strategic feature

### 3w-24: 13. Nxe7 — ok (56% → 51%)

- Engine best: **Qd2**; line: 13. Qd2 Nh6 14. b4 O-O 15. bxc5 dxc5 16. Rab1 Rb8 17. Rb2 Bd6
- Others: b4 (56%), Ne1 (55%)
- After Nxe7: 13...Qxe7 14. Ne1 Nh6 15. Nc2 O-O 16. Rb1 g5 17. Bg3 Be6 18. h3
- *Rejected lesson:* mobility / activity; Mobility isn't a main reason (top: King safety 0.69, Bishops 0.37)

### 3w-26: 14. Ng5 — blunder (51% → 15%)

- Engine best: **Ne1**; line: 14. Ne1 Nh6 15. Bg3 Ng6 16. Nc2 O-O 17. Ne3 Ra7 18. b4 axb4
- Others: Nd2 (51%), Bg3 (51%)
- After Ng5: 14...fxg5 15. Bxg5 Nf6 16. f4 exf4 17. d4 O-O 18. Bf3 Ra7 19. e5
- **Lesson:** material / hanging / consequence, gap 488cp, triggered after 2 plies
- Trigger: You've lost a knight: you're 3 pawns worse off than before.

```
On move 14 you played Ng5. Ne1 was better.

  What you played:  14. Ng5 fxg5 15. Bxg5 Nf6 16. Bxf6 gxf6 17. f4 O-O
  What was better:  14. Ne1 Nh6 15. Bg3 Ng6 16. Nc2 O-O 17. Ne3 Bb7

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.
Your move left this undefended: the piece you moved, now on g5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 3w-30: 16. Be3 — blunder (56% → 14%)

- Engine best: **Bxe7**; line: 16. Bxe7 Qxe7 17. Bxg4 Bxg4 18. Qxg4 O-O 19. g3 Kh7 20. Kg2 Rf6
- Others: Bh4 (16%), Bd2 (15%)
- After Be3: 16...Nf6 17. Bh5+ g6 18. Be2 g5 19. h4 Ng6 20. hxg5 hxg5 21. Bxg5
- **Lesson:** material / safety / consequence, gap 501cp, pending

```
On move 16 you played Be3. Bxe7 was better.

  What you played:  16. Be3 Nf6 17. f4 exf4 18. Bxf4 O-O 19. d4 Nxe4
  What was better:  16. Bxe7 Qxe7 17. Bxg4 Bxg4 18. Qxg4 O-O 19. g3 Rf7

The difference is material. Before your move: material balance +0.
After your line: material balance -3. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 3w-32: 17. Qa4+ — blunder (65% → 11%)

- Engine best: **Bxg4**; line: 17. Bxg4 O-O 18. g3 Kh7 19. f4 exf4 20. gxf4 Qh4 21. Bxc8 Raxc8
- Others: h3 (15%), d4 (14%)
- After Qa4+: 17...Bd7 18. Qd1 Qh4 19. h3 Nf6 20. b4 O-O 21. Rb1 Nf4 22. Bxf4
- **Lesson:** material / free_material / missed_chance, gap 756cp, pending

```
On move 17 you played Qa4+. Bxg4 was better.

  What you played:  17. Qa4+ Bd7 18. Qd1 h5 19. b4 O-O 20. bxc5 dxc5
  What was better:  17. Bxg4 O-O 18. g3 Ra7 19. Bh5 Kh7 20. f4 exf4

Your move wasn't a disaster, but Bxg4 would have improved material.
After the better line: material balance +1. After yours: material balance -2.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 3w-38: 20. f3 — blunder (50% → 2%)

- Engine best: **Bxg4**; line: 20. Bxg4 Bxg4 21. hxg4 Qxg4 22. f3 Qg3 23. Qxb6 Nh4 24. Rf2 Nxf3+
- Others: hxg4 (50%), Qxb6 (12%)
- After f3: 20...Nxe3 21. Rf2 Qg3 22. d4 exd4 23. Qd3 Nf4 24. Raf1 Nxh3+ 25. Kh1
- **Lesson:** material / hanging / consequence, gap 984cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before. And more is about to fall.

```
On move 20 you played f3. Bxg4 was better.

  What you played:  20. f3 Nxe3 21. Rf2 Nf4 22. d4 exd4 23. Rc1 Qg3
  What was better:  20. Bxg4 Bxg4 21. hxg4 Qxg4 22. f3 Qd7 23. Qc3 a4

The difference is material. Before your move: material balance +0.
After your line: material balance -6. After the better line: material balance +0.
Your move left this undefended: bishop on e3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 3w-66: 34. d5 — inaccuracy (15% → 4%)

- Engine best: **Qe5**; line: 34. Qe5 Rg5 35. Qd6 Bxg4 36. Qf4+ Kg7 37. Qxg4 Rxg4 38. Rxg4+ Qxg4+
- Others: Rf3+ (13%), Qd6 (11%)
- After d5: 34...Bxg4 35. Qf2+ Ke8 36. Kg1 Rf7 37. Qg2 Rg5 38. Bxg4 Rf4 39. Qh3
- **Lesson:** material / safety / consequence, gap 213cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 34 you played d5. Qe5 was better.

  What you played:  34. d5 Bxg4 35. Qe3 Bh3+ 36. Kf2 Rg5 37. Bd3 Rxg3
  What was better:  34. Qe5 Bc8 35. Rf3+ Kg6 36. Qh5+ Qxh5 37. gxh5+ Kg7

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 3 (1100), Black: Philidor Defense

https://lichess.org/game/oLJq2KWl · 1075 vs 1054 · 1-0

### 3b-19: 10... Ng4 — ok (48% → 40%)

- Engine best: **Be7**; line: 10...Be7 11. b4 axb4 12. axb4 Rxa1 13. Qxa1 Nxd5 14. cxd5 Nxb4 15. d4
- Others: Nxd5 (45%), Be6 (45%)
- After Ng4: 11. Bd2 Nf6 12. b4 Nb8 13. Qa4+ Bd7 14. Qb3 Be7 15. bxa5 bxa5
- *Rejected lesson:* outposts / outposts; Knights/Bishops isn't a main reason (top: King safety 0.41, Space 0.19)

### 3b-21: 11... f6 — ok (40% → 32%)

- Engine best: **Be7**; line: 11...Be7 12. Nxe7 Nxe7 13. Nh4 h6 14. Bxe7 Qxe7 15. Bxg4 Qxh4 16. Bxc8
- Others: f6 (31%), Nf6 (28%)
- After f6: 12. Bd2 g6 13. b4 Nh6 14. Qc1 Nf7 15. Bd1 a4 16. b5 Nb8
- *Rejected lesson:* outposts / outposts; Bishops is a main reason (+0.79)

### 3b-29: 15... h6 — blunder (84% → 44%)

- Engine best: **Nf6**; line: 15...Nf6 16. Bh5+ Ng6 17. f4 exf4 18. Bxg6+ hxg6 19. Rxf4 O-O 20. Qf3
- Others: Qd7 (83%), h5 (73%)
- After h6: 16. Bxe7 Qxe7 17. Bxg4 Bxg4 18. Qxg4 O-O 19. g3 Kh7 20. Kg2 Rf6
- **Lesson:** material / safety / consequence, gap 502cp, pending

```
On move 15 you played h6. Nf6 was better.

  What you played:  15...h6 16. Bxe7 Qxe7 17. Bxg4 Bxg4 18. Qxg4 O-O 19. g3
  What was better:  15...Nf6 16. f4 O-O 17. f5 Bd7 18. g4 Nc6 19. Rf2

The difference is material. Before your move: material balance +2.
After your line: material balance -1. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 3b-31: 16... Ng6 — blunder (86% → 35%)

- Engine best: **Nf6**; line: 16...Nf6 17. Bh5+ g6 18. Be2 g5 19. h4 Ng6 20. hxg5 hxg5 21. Bxg5
- Others: Qd7 (85%), h5 (81%)
- After Ng6: 17. Bxg4 O-O 18. g3 Kh7 19. f4 exf4 20. gxf4 Qh4 21. Bxc8 Raxc8
- **Lesson:** material / safety / consequence, gap 567cp, pending

```
On move 16 you played Ng6. Nf6 was better.

  What you played:  16...Ng6 17. Bxg4 O-O 18. g3 Ra7 19. Bh5 Kh7 20. f4
  What was better:  16...Nf6 17. f4 exf4 18. Bxf4 O-O 19. d4 Ng6 20. e5

The difference is material. Before your move: material balance +2.
After your line: material balance -1. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 3b-37: 19... Rf8 — blunder (87% → 50%)

- Engine best: **Nxe3**; line: 19...Nxe3 20. fxe3 Rb8 21. Kh2 Rf8 22. Rxf8+ Kxf8 23. Rf1+ Kg8 24. a4
- Others: Nf6 (87%), h5 (86%)
- After Rf8: 20. Bxg4 Bxg4 21. hxg4 Qxg4 22. f3 Qg3 23. Qxb6 Nh4 24. Rf2 Nxf3+
- **Lesson:** material / hanging / consequence, gap 481cp, pending

```
On move 19 you played Rf8. Nf6 was better.

  What you played:  19...Rf8 20. hxg4 Bxg4 21. Bxg4 Qxg4 22. f3 Qd7 23. Qc3
  What was better:  19...Nf6 20. Qxb6 Ke7 21. f4 Rhb8 22. Qc7 Ne8 23. f5

The difference is material. Before your move: material balance +2.
After your line: material balance +0. After the better line: material balance +8.
Your move left this undefended: pawn on b6, knight on g4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 3b-63: 32... g4 — inaccuracy (93% → 83%)

- Engine best: **Qf4**; line: 32...Qf4 33. d5 Bd7 34. d6 Re6 35. Qd5 Qxd6 36. b4 Ke7 37. b5
- Others: Bc8 (89%), Rc8 (87%)
- After g4: 33. fxg4 Rg6 34. b4 Kg8 35. bxa5 Reg7 36. d5 Bxg4 37. Bxg4 Rxg4
- *No lesson.*

### 3b-79: 40... Kd8 — blunder (95% → 2%)

- Engine best: **Kf7**; line: 40...Kf7 41. Ke3 h4 42. Kd4 Rxd6+ 43. Qxd6 Qd1+ 44. Kc5 Qxd6+ 45. Kxd6
- Others: Kf8 (94%), Qe6 (2%)
- After Kd8: 41. Qh8+ Qg8 42. Qxg8#
- **Lesson:** mate / safety / consequence, gap 10384cp, pending

```
On move 40 you played Kd8. Kf7 was better.

  What you played:  40...Kd8 41. Qh8+ Qg8 42. Qxg8#
  What was better:  40...Kf7 41. c5 h4 42. Qd5+

After your move, your opponent had a forced checkmate.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 4 (1100), White: Bishop's Opening: Khan Gambit

https://lichess.org/game/VVTaNXWp · 1160 vs 1128 · 1-0

## Game 4 (1100), Black: Bishop's Opening: Khan Gambit

https://lichess.org/game/VVTaNXWp · 1160 vs 1128 · 1-0

### 4b-3: 2... d5 — ok (52% → 44%)

- Engine best: **Nf6**; line: 2...Nf6 3. Nc3 Bc5 4. Nge2 O-O 5. O-O d6 6. d3 a5 7. a4
- Others: Nc6 (50%), Bc5 (50%)
- After d5: 3. exd5 c6 4. dxc6 Nxc6 5. Nc3 Bd6 6. d3 Nf6 7. Nge2 O-O
- **Lesson:** material / safety / consequence, gap 82cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 2 you played d5. Nf6 was better.

  What you played:  2...d5 3. exd5 Nf6 4. Nc3 Bd6 5. d3 O-O 6. Nge2
  What was better:  2...Nf6 3. Nc3 Nc6 4. Nf3 Nxe4 5. Nxe4 d5 6. Bd3

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 4b-7: 4... bxc6 — mistake (44% → 24%)

- Engine best: **Nxc6**; line: 4...Nxc6 5. d3 Nf6 6. Nf3 Bg4 7. h3 Bh5 8. Be3 e4 9. dxe4
- Others: Qc7 (41%), Qf6 (36%)
- After bxc6: 5. Nf3 e4 6. Ne5 Qg5 7. Bxf7+ Ke7 8. d4 Qxg2 9. Rf1 Nd7
- *Rejected lesson:* material / safety; not a strategic feature

### 4b-11: 6... Nc5 — inaccuracy (21% → 8%)

- Engine best: **Qc7**; line: 6...Qc7 7. d4 Bd6 8. Ne4 Ngf6 9. dxe5 Bxe5 10. Nxf6+ Bxf6 11. Qe2+
- Others: Bd6 (21%), Bb4 (20%)
- After Nc5: 7. Nxe5 Be6 8. Nxc6 Qh4 9. d3 Bxc4 10. dxc4 Ne6 11. Qf3 Rc8
- **Lesson:** centre / centre / consequence, gap 303cp, pending; check: Mobility is a main reason (+0.67)

```
On move 6 you played Nc5. Bd6 was better.

  What you played:  6...Nc5 7. Nxe5 Be6 8. Qe2 Bxc4 9. Qxc4 Qc7 10. d4
  What was better:  6...Bd6 7. d4 Ngf6 8. dxe5 Nxe5 9. Nxe5 Bxe5 10. Qxd8+

The difference is control of the centre. Before your move: centre control 5 vs 5.
After your line: centre control 3 vs 8. After the better line: centre control 5 vs 5.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 4b-13: 7... Bg4 — ok (15% → 5%)

- Engine best: **Bd6**; line: 7...Bd6 8. d4 exd4 9. Qxd4 Nf6 10. Be3 Ne6 11. Bxe6 Bxe6 12. O-O-O
- Others: Qc7 (13%), Ne6 (13%)
- After Bg4: 8. Bxf7+ Kxf7 9. Nxe5+ Ke8 10. Qxg4 Qf6 11. d4 Qe6 12. Qf3 Nd7
- **Lesson:** material / safety / consequence, gap 267cp, pending

```
On move 7 you played Bg4. Bd6 was better.

  What you played:  7...Bg4 8. Bxf7+ Ke7 9. Bc4 Ke8 10. O-O
  What was better:  7...Bd6 8. d4 exd4 9. Qxd4 Nf6 10. Be3

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 5 (1100), White: Queen's Pawn Game

https://lichess.org/game/WsH5CS9d · 1020 vs 1001 · 0-1

### 5w-20: 11. Nb3 — ok (45% → 40%)

- Engine best: **c4**; line: 11. c4 e5 12. Be2 e4 13. b5 Qg5 14. g3 Nd7 15. a4 Rfe8
- Others: Bb2 (44%), g4 (43%)
- After Nb3: 11...Nd7 12. Ra2 Re8 13. Be2 e5 14. dxe5 Nxe5 15. O-O Nc4 16. Nd2
- *Rejected lesson:* development / develop; Mobility/Knights/Bishops gains only -0.12

### 5w-28: 15. Bb2 — ok (66% → 59%)

- Engine best: **O-O**; line: 15. O-O Bxc3 16. Ra2 Nc6 17. b5 Na5 18. Bd2 Nxb3 19. Qxb3 Bf6
- Others: Nd4 (63%), Qd3 (63%)
- After Bb2: 15...f4 16. Qf3 fxe3 17. O-O-O exf2 18. Qxf2 Nc6 19. Kb1 h6 20. c4
- **Lesson:** own_pawns / pawn_weaknesses / consequence, gap 74cp, pending; check: Pawns is a main reason (+0.22)

```
On move 15 you played Bb2. O-O was better.

  What you played:  15. Bb2 f4 16. O-O fxe3 17. fxe3 Qg5 18. Qf3 Nd7
  What was better:  15. O-O Bxc3 16. Rb1 Nc6 17. Bb2 Bxb2 18. Rxb2 Qf6

The difference is your pawn structure. Before your move: doubled pawns on the c-file; backward pawn(s) on c3.
After your line: isolated pawn(s) on e3; doubled pawns on the c-file; backward pawn(s) on c3. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

### 5w-32: 17. Qf3 — mistake (82% → 62%)

- Engine best: **Qxd5**; line: 17. Qxd5 f4 18. Nd4 Rad8 19. Qf3 fxe3 20. fxe3 f6 21. Rad1 h6
- Others: Qd3 (69%), f4 (68%)
- After Qf3: 17...Qc4 18. Nd4 g6 19. Rfd1 Bf6 20. Qe2 Ne5 21. Kf1 b6 22. Nb5
- **Lesson:** material / free_material / missed_chance, gap 147cp, pending

```
On move 17 you played Qf3. Qxd5 was better.

  What you played:  17. Qf3 Qc4 18. Nd4 g6 19. a4 a6 20. Qe2 Bf6
  What was better:  17. Qxd5 f4 18. Nd4 Rad8 19. Qf3 fxe3 20. fxe3 Qg3

Your move wasn't a disaster, but Qxd5 would have improved material.
After the better line: material balance +3. After yours: material balance +1.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 5w-34: 18. exf4 — ok (76% → 75%)

- Engine best: **b5**; line: 18. b5 Ne7 19. exf4 Qxf4 20. Qxf4 Bxf4 21. a4 h5 22. Rfd1 f6
- Others: Rad1 (74%), exf4 (73%)
- After exf4: 18...Bxf4 19. Qxd5 Rad8 20. Rae1 Ne5 21. Qxb7 Re7 22. Qe4 Rde8 23. Nd4
- **Lesson:** king_safety / king_safety / consequence, gap 89cp, pending; check: King safety is a main reason (+1.28)

```
On move 18 you played exf4. b5 was better.

  What you played:  18. exf4 Bxf4 19. Rae1 Ne5 20. Qxd5 Ng4 21. Rxe8+ Rxe8
  What was better:  18. b5 Nd8 19. exf4 Qxf4 20. Qxf4 Bxf4 21. g3 Be5

The difference is king safety. Before your move: 3 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it.
After your line: 3 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it. After the better line: the enemy queen is gone, so your king is fairly safe.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

### 5w-36: 19. Bc1 — inaccuracy (76% → 66%)

- Engine best: **Qxd5**; line: 19. Qxd5 Rad8 20. Rae1 Ne5 21. Qxb7 Re7 22. Qe4 Rde8 23. Nd4 Nf3+
- Others: Rae1 (76%), Nd4 (72%)
- After Bc1: 19...Be5 20. Rb1 a6 21. Qxd5 Bxc3 22. Be3 Rad8 23. Qf3 Qe7 24. Na5
- **Lesson:** material / safety / consequence, gap 117cp, pending

```
On move 19 you played Bc1. Qxd5 was better.

  What you played:  19. Bc1 Be5 20. Bb2 Rad8 21. Rfe1 a5 22. Qg4 Qxg4
  What was better:  19. Qxd5 Rad8 20. Qf5 Ne5 21. Nd4 g6 22. Qc2 b6

The difference is material. Before your move: material balance +2.
After your line: material balance +0. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 5w-38: 20. Bxf4 — blunder (94% → 4%)

- Engine best: **Qxf4**; line: 20. Qxf4 Qh5 21. Qg5 Qxg5 22. Bxg5 h6 23. Bf4 Nc4 24. Nd4 g5
- Others: Qxd5 (81%), Qd1 (69%)
- After Bxf4: 20...Nxf3+ 21. gxf3 Re6 22. Rfe1 Rg6+ 23. Kf1 Qxf4 24. Re3 Qc4+ 25. Re2
- **Lesson:** material / hanging / consequence, gap 1558cp, triggered after 2 plies
- Trigger: Since that move you've lost a queen and taken a bishop: overall you're 6 pawns down. And more is about to fall.

```
On move 20 you played Bxf4. Qxf4 was better.

  What you played:  20. Bxf4 Nxf3+ 21. gxf3 Qxf4 22. Rfe1 Rxe1+ 23. Rxe1 Qh4
  What was better:  20. Qxf4 Qxf4 21. Bxf4 Nc4 22. Bh2 Re2 23. Nd4 Rd2

The difference is material. Before your move: material balance +4.
After your line: material balance -5. After the better line: material balance +4.
Your move left this undefended: queen on f3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 5 (1100), Black: Queen's Pawn Game

https://lichess.org/game/WsH5CS9d · 1020 vs 1001 · 0-1

### 5b-23: 12... c5 — mistake (58% → 38%)

- Engine best: **Qg5**; line: 12...Qg5 13. Bxf5 Qxg2 14. Bxh7+ Kxh7 15. Ke2 Kg8 16. Qg1 Qe4 17. Bd2
- Others: Qe7 (57%), Nd7 (57%)
- After c5: 13. Bxf5 c4 14. Bb1 cxb3 15. Qxb3 Nd7 16. O-O Rc8 17. e4 dxe4
- **Lesson:** material / safety / consequence, gap 236cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before.

```
On move 12 you played c5. Bxd3 was better.

  What you played:  12...c5 13. Bxf5 c4 14. Bb1 cxb3 15. Qxb3 Qh4 16. O-O
  What was better:  12...Bxd3 13. Qxd3 e5 14. dxe5 Bxe5 15. O-O Nd7 16. Qc2

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 5b-25: 13... exf5 — ok (37% → 35%)

- Engine best: **c4**; line: 13...c4 14. Bb1 cxb3 15. Qxb3 Nd7 16. e4 Qc7 17. e5 Be7 18. Bd3
- Others: exf5 (34%), cxd4 (13%)
- After exf5: 14. dxc5 Be5 15. O-O Bxc3 16. Rb1 Nc6 17. Bb2 Bxb2 18. Rxb2 Qc7
- **Lesson:** own_pawns / pawn_weaknesses / consequence, gap 64cp, triggered after 2 plies; check: Pawns is a main reason (+0.50)
- Trigger: Your pawn structure has been damaged (isolated pawn(s) on d5; doubled pawns on the f-file).

```
On move 13 you played exf5. c4 was better.

  What you played:  13...exf5 14. dxc5 Bc7 15. O-O Nc6 16. Ra2 Qf6 17. Qxd5
  What was better:  13...c4 14. Bb1 cxb3 15. Qxb3 Qc7 16. Bd3 Rc8 17. Bd2

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: doubled pawns on the f-file. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

### 5b-29: 15... Qh4 — mistake (41% → 19%)

- Engine best: **f4**; line: 15...f4 16. Qf3 fxe3 17. O-O-O exf2 18. Qxf2 Nc6 19. Kb1 h6 20. c4
- Others: Nc6 (32%), g6 (31%)
- After Qh4: 16. Qxd5 Nc6 17. O-O Rad8 18. Qf3 Qc4 19. Nd4 g6 20. Rad1 h5
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 245cp, pending; check: Pawns is a main reason (+0.31)

```
On move 15 you played Qh4. f4 was better.

  What you played:  15...Qh4 16. Qxd5 Nc6 17. O-O Rad8 18. Qf3 Qc4 19. Nd4
  What was better:  15...f4 16. O-O fxe3 17. fxe3 Qg5 18. Qf3 Nd7 19. Qxf7+

Your move wasn't a disaster, but f4 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on e3; doubled pawns on the c-file; backward pawn(s) on c3. After yours: opponent's pawns: doubled pawns on the c-file.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 5b-33: 17... f4 — inaccuracy (38% → 24%)

- Engine best: **Qc4**; line: 17...Qc4 18. Nd4 g6 19. Rfd1 Bf6 20. Qe2 Ne5 21. Kf1 b6 22. Nb5
- Others: Ne7 (35%), Qe4 (30%)
- After f4: 18. b5 Ne7 19. exf4 Qxf4 20. Qxf4 Bxf4 21. a4 h5 22. Rfd1 f6
- **Lesson:** material / forcing_moves / missed_chance, gap 166cp, pending

```
On move 17 you played f4. Qc4 was better.

  What you played:  17...f4 18. b5 Ne7 19. exf4 Qxf4 20. Qxf4 Bxf4 21. a4
  What was better:  17...Qc4 18. Nd4 g6 19. Rfd1 Bg7 20. Qe2 Ne5 21. Bc1

Your move wasn't a disaster, but Qc4 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 5b-37: 19... Ne5 — mistake (34% → 6%)

- Engine best: **Be5**; line: 19...Be5 20. Rb1 a6 21. Qxd5 Bxc3 22. Be3 Rad8 23. Qf3 Qe7 24. Na5
- Others: Bc7 (32%), Bxc1 (27%)
- After Ne5: 20. Qxf4 Qh5 21. Qg5 Qxg5 22. Bxg5 h6 23. Bf4 Nc4 24. Nd4 g5
- **Lesson:** material / safety / consequence, gap 574cp, pending

```
On move 19 you played Ne5. Be5 was better.

  What you played:  19...Ne5 20. Qxf4 Qh5 21. Nd4 Nc4 22. a4 Re4
  What was better:  19...Be5 20. Bb2 a5 21. Rfe1 Qc4 22. Nd2 Qa6

The difference is material. Before your move: material balance -1.
After your line: material balance -4. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 6 (1100), White: Englund Gambit Declined

https://lichess.org/game/xcluVedh · 1180 vs 1174 · 1-0

### 6w-2: 2. d5 — inaccuracy (64% → 48%)

- Engine best: **dxe5**; line: 2. dxe5 d5 3. Nf3 Ne7 4. Bf4 Nbc6 5. e3 h6 6. h4 Bg4
- Others: Nc3 (52%), e3 (52%)
- After d5: 2...Bb4+ 3. Nd2 Nf6 4. a3 Bc5 5. e3 a5 6. c4 d6 7. Ne2
- *No lesson.*

### 6w-12: 7. Be3 — inaccuracy (71% → 61%)

- Engine best: **Na3**; line: 7. Na3 Bd7 8. Rc1 Qb6 9. Nc4 Qd8 10. Ba5 b6 11. Bb4 Qf6
- Others: Bd3 (65%), b4 (65%)
- After Be3: 7...Qa5+ 8. Nc3 Nf6 9. Bd3 Be7 10. a3 O-O 11. h3 Nbd7 12. b4
- **Lesson:** open_files / open_files / missed_chance, gap 90cp, pending; check: Rooks is a main reason (+0.21)

```
On move 7 you played Be3. Na3 was better.

  What you played:  7. Be3 Qa5+ 8. Nd2 Nf6 9. f3 Be7 10. Ne2 Qd8
  What was better:  7. Na3 Bd7 8. Rc1 Qb6 9. Nc4 Qd8 10. Ba5 b6

Your move wasn't a disaster, but Na3 would have improved rooks on open files.
After the better line: your rooks on open files: c1; theirs: none. After yours: your rooks on open files: none; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### 6w-16: 9. Nf3 — ok (73% → 67%)

- Engine best: **Rc1**; line: 9. Rc1 Qa5 10. Nf3 Nd7 11. Nd2 Qd8 12. a4 Be7 13. Nc4 Ngf6
- Others: Nf3 (68%), Be2 (67%)
- After Nf3: 9...Nd7 10. a4 Be7 11. Nd2 h6 12. h4 Bd8 13. Nc4 b6 14. Be2
- **Lesson:** open_files / open_files / missed_chance, gap 46cp, pending; check: Rooks is a main reason (+0.21)

```
On move 9 you played Nf3. Rc1 was better.

  What you played:  9. Nf3 Nf6 10. Be2 Ng4 11. Bd2 Nd7
  What was better:  9. Rc1 Qd8 10. Qa4+ Bd7 11. Qb4 b5

Your move wasn't a disaster, but Rc1 would have improved rooks on open files.
After the better line: your rooks on open files: c1; theirs: none. After yours: your rooks on open files: none; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### 6w-18: 10. Bd3 — inaccuracy (77% → 66%)

- Engine best: **Rc1**; line: 10. Rc1 Qa5 11. Nd2 Nbd7 12. Nc4 Qd8 13. Qa4 Ng4 14. Bb6 Qg5
- Others: h3 (66%), Be2 (66%)
- After Bd3: 10...Be7 11. O-O Bg4 12. a4 O-O 13. a5 Nbd7 14. Na4 Qd8 15. h3
- *No lesson.*

### 6w-20: 11. h3 — inaccuracy (78% → 64%)

- Engine best: **Rc1**; line: 11. Rc1 Qd8 12. Qb3 b5 13. Nd2 Bc8 14. h3 Nbd7 15. a4 bxa4
- Others: Qa4+ (67%), a4 (65%)
- After h3: 11...Bxf3 12. Qxf3 Nbd7 13. Be2 Be7 14. g4 g6 15. Bh6 Bf8 16. Bd2
- **Lesson:** material / forcing_moves / missed_chance, gap 132cp, pending

```
On move 11 you played h3. Rc1 was better.

  What you played:  11. h3 Bxf3 12. Qxf3 Nbd7 13. O-O Be7 14. Rfc1 O-O
  What was better:  11. Rc1 Bxf3 12. gxf3 Qd8 13. Qb3 Nbd7 14. Qxb7 Be7

Your move wasn't a disaster, but Rc1 would have improved material.
After the better line: material balance +2. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 6w-28: 15. g4 — mistake (73% → 50%)

- Engine best: **Na4**; line: 15. Na4 Qa5 16. Nxc5 dxc5 17. Qg3 O-O 18. Qxe5 Rfe8 19. Qf4 Rad8
- Others: Nb5 (69%), Bf1 (66%)
- After g4: 15...Nxd3 16. Nb5 Qd8 17. Nc7+ Kf8 18. Nxa8 Nxc1 19. Rxc1 Qxa8 20. Qf5
- **Lesson:** material / hanging / consequence, gap 255cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before.

```
On move 15 you played g4. Na4 was better.

  What you played:  15. g4 Nxd3 16. Nb5 Qd8 17. Nc7+ Kf8 18. Nxa8 Qxa8
  What was better:  15. Na4 Qd8 16. Nxc5 dxc5 17. Bxc5 Bxc5 18. Rxc5 O-O

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.
Your move left this undefended: bishop on d3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 6w-30: 16. Bb6 — blunder (50% → 7%)

- Engine best: **Nb5**; line: 16. Nb5 Qd8 17. Nc7+ Kf8 18. Nxa8 Nxc1 19. Rxc1 Qxa8 20. Qf5 Qe8
- Others: Rc2 (13%), g5 (12%)
- After Bb6: 16...Qxb6 17. Qxd3 Nd7 18. Nd1 Nc5 19. Qc4 a5 20. Ne3 g6 21. b4
- **Lesson:** material / hanging / consequence, gap 807cp, pending

```
On move 16 you played Bb6. Nb5 was better.

  What you played:  16. Bb6 Qxb6 17. Na4 Qb5 18. Rc3 Qxa4 19. Ra3 Qd4
  What was better:  16. Nb5 Qd8 17. Nc7+ Kf8 18. Nxa8 Qxa8 19. g5 Nxc1

The difference is material. Before your move: material balance -3.
After your line: material balance -7. After the better line: material balance -3.
Your move left this undefended: pawn on b2, rook on c1, the piece you moved, now on b6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 6 (1100), Black: Englund Gambit Declined

https://lichess.org/game/xcluVedh · 1180 vs 1174 · 1-0

### 6b-1: 1... e5 — inaccuracy (48% → 36%)

- Engine best: **d5**; line: 1...d5 2. c4 e6 3. Nc3 Bb4 4. Qb3 c5 5. dxc5 Nc6 6. cxd5
- Others: Nf6 (47%), c6 (47%)
- After e5: 2. dxe5 d5 3. Nf3 Ne7 4. Bf4 Nbc6 5. e3 h6 6. h4 Bg4
- **Lesson:** material / hanging / consequence, gap 101cp, pending

```
On move 1 you played e5. d5 was better.

  What you played:  1...e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bg5 Qe6 5. Bf4
  What was better:  1...d5 2. Nf3 e6 3. c4 Nf6 4. Nc3 c5 5. e3

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: the piece you moved, now on e5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 6b-5: 3... c6 — ok (48% → 43%)

- Engine best: **Nf6**; line: 3...Nf6 4. Nc3 c6 5. h3 Be7 6. g4 O-O 7. Nge2 b5 8. a3
- Others: Be7 (48%), Nd7 (47%)
- After c6: 4. c4 Na6 5. Nc3 Be7 6. Be3 Nf6 7. h3 Nc5 8. Qc2 cxd5
- *Rejected lesson:* development / develop; Mobility/Knights/Bishops gains only -0.30

### 6b-11: 6... Qc5 — inaccuracy (39% → 29%)

- Engine best: **Qd8**; line: 6...Qd8 7. Nc3 Be7 8. h3 Nh6 9. g4 O-O 10. Be3 Kh8 11. Qd2
- Others: Qb6 (38%), Qc7 (38%)
- After Qc5: 7. Na3 Bd7 8. Rc1 Qb6 9. Nc4 Qd8 10. Ba5 b6 11. Bb4 Qf6
- *Rejected lesson:* mobility / activity; Mobility isn't a main reason (top: Rooks 0.47, Threats 0.38)

### 6b-15: 8... a6 — ok (37% → 27%)

- Engine best: **Be7**; line: 8...Be7 9. Nf3 Nf6 10. h3 O-O 11. Be2 Na6 12. O-O Bd7 13. a4
- Others: Nf6 (36%), Na6 (36%)
- After a6: 9. Rc1 Qa5 10. Nf3 Nd7 11. Nd2 Qd8 12. a4 Be7 13. Nc4 Ngf6
- *Rejected lesson:* open_files / open_files; King safety (+4.02) dwarfs Rooks (+0.21)

### 6b-17: 9... Nf6 — inaccuracy (33% → 23%)

- Engine best: **Nd7**; line: 9...Nd7 10. a4 Be7 11. Nd2 h6 12. h4 Bd8 13. Nc4 b6 14. Be2
- Others: Be7 (31%), Qd8 (29%)
- After Nf6: 10. Rc1 Qa5 11. Nd2 Nbd7 12. Nc4 Qd8 13. Qa4 Ng4 14. Bb6 Qg5
- *Rejected lesson:* development / develop; Mobility/Knights/Bishops gains only -0.34

### 6b-19: 10... Bg4 — inaccuracy (34% → 22%)

- Engine best: **Be7**; line: 10...Be7 11. O-O Bg4 12. a4 O-O 13. a5 Nbd7 14. Na4 Qd8 15. h3
- Others: Ng4 (33%), Nbd7 (33%)
- After Bg4: 11. Rc1 Qd8 12. Qb3 b5 13. Nd2 Bc8 14. h3 Nbd7 15. a4 bxa4
- **Lesson:** material / safety / consequence, gap 89cp, pending

```
On move 10 you played Bg4. Ng4 was better.

  What you played:  10...Bg4 11. Rc1 Bxf3 12. gxf3 Qd8 13. Qb3 Nbd7 14. Qxb7
  What was better:  10...Ng4 11. Bd2 Be7 12. a4 Nd7 13. b4 Ngf6 14. a5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 6b-27: 14... Nc5 — inaccuracy (38% → 27%)

- Engine best: **O-O**; line: 14...O-O 15. Nb1 Qd8 16. Nd2 Ne8 17. Qg4 Nc5 18. Bf1 a5 19. Bb5
- Others: Qd8 (36%), Rc8 (32%)
- After Nc5: 15. Na4 Qa5 16. Nxc5 dxc5 17. Qg3 O-O 18. Qxe5 Rfe8 19. Qf4 Rad8
- **Lesson:** material / safety / consequence, gap 108cp, pending

```
On move 14 you played Nc5. O-O was better.

  What you played:  14...Nc5 15. Na4 Qd8 16. Nxc5 dxc5 17. Bxc5 Bxc5 18. Rxc5
  What was better:  14...O-O 15. Nb1 Qd8 16. Nd2 Ne8 17. b4 Bg5 18. Nc4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 6b-105: 53... g3 — blunder (98% → 10%)

- Engine best: **Be3**; line: 53...Be3 54. Rc4+ Bd4 55. Rc2 g3 56. Ke1 Bc3+ 57. Rxc3 Rxc3 58. Kd2
- Others: Rh3 (98%), Re3+ (98%)
- After g3: 54. Rc4+ Kd5 55. Kxf3 Bg5 56. Kxg3 e4 57. Kf2 Bh4+ 58. Ke2 Bd8
- **Lesson:** material / safety / consequence, gap 1332cp, pending

```
On move 53 you played g3. Re3+ was better.

  What you played:  53...g3 54. Rc4+ Kd5 55. Kxf3 Bd2 56. Rg4 Bf4 57. Rg7
  What was better:  53...Re3+ 54. Kd2 g3 55. Rc3 Rf3+ 56. Ke1 Rxc3 57. Ke2

The difference is material. Before your move: material balance +3.
After your line: material balance -2. After the better line: material balance +8.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 7 (1100), White: Queen's Pawn Game

https://lichess.org/game/6IC7zrkA · 1159 vs 1094 · 1-0

### 7w-14: 8. f4 — inaccuracy (61% → 49%)

- Engine best: **Qh5+**; line: 8. Qh5+ g6 9. Nxg6 Ngf6 10. Qh4 Rg8 11. Ne5 Nxe5 12. dxe5 Ng4
- Others: c4 (52%), Nxd7 (51%)
- After f4: 8...Qb6 9. Qc1 c5 10. c3 Nxe5 11. fxe5 Ne7 12. Be2 Bd7 13. Nd2
- **Lesson:** material / forcing_moves / missed_chance, gap 114cp, pending

```
On move 8 you played f4. Qh5+ was better.

  What you played:  8. f4 Nxe5 9. dxe5 Qb6 10. Qc1 c5 11. c4 Bd7
  What was better:  8. Qh5+ g6 9. Nxg6 Ngf6 10. Qh4 Rg8 11. Ne5 Nxe5

Your move wasn't a disaster, but Qh5+ would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 7w-18: 10. h3 — mistake (50% → 29%)

- Engine best: **Qh5+**; line: 10. Qh5+ Nf7 11. Nd2 O-O 12. g4 Nh6 13. gxf5 exf5 14. Rg1 Ng4
- Others: Be2 (50%), Qd2 (48%)
- After h3: 10...Qh4+ 11. Ke2 f4 12. Qe1 Qh5+ 13. Kd2 O-O 14. Nc3 c5 15. dxc5
- **Lesson:** material / forcing_moves / missed_chance, gap 193cp, pending

```
On move 10 you played h3. Be2 was better.

  What you played:  10. h3 Qh4+ 11. Ke2 f4 12. Qe1 Qh5+ 13. Kd2 O-O
  What was better:  10. Be2 O-O 11. O-O Bd7 12. Qd2 c5 13. dxc5 Qc7

Your move wasn't a disaster, but Be2 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 7w-20: 11. Be2 — mistake (45% → 15%)

- Engine best: **Qd2**; line: 11. Qd2 c5 12. dxc5 b6 13. cxb6 Qh4+ 14. Qf2 Qb4+ 15. c3 Qxb6
- Others: g3 (43%), Qf3 (42%)
- After Be2: 11...Qh4+ 12. Kd2 f4 13. Kc1 Nf5 14. Nd2 fxe3 15. Nf3 Qf2 16. Qf1
- *Rejected lesson:* material / safety; not a strategic feature

### 7w-24: 13. Rxf8+ — ok (26% → 21%)

- Engine best: **Na3**; line: 13. Na3 Rxf1+ 14. Bxf1 Qh4 15. c3 Qf2+ 16. Kh2 Qxb2 17. Qc1 Qf2
- Others: c3 (25%), Rxf8+ (25%)
- After Rxf8+: 13...Qxf8 14. Bf3 Qb4 15. b3 c5 16. c3 Qb6 17. c4 cxd4 18. Na3
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns is a main reason (+0.18)

### 7w-38: 20. Bf3 — inaccuracy (27% → 12%)

- Engine best: **Ne2**; line: 20. Ne2 Ne4 21. Qa3 b4 22. Qa5 Bd7 23. a3 h5 24. Bxh5 Be8
- Others: a4 (21%), a3 (21%)
- After Bf3: 20...b4 21. Ne2 Nf5 22. Bg4 a5 23. Bxf5 exf5 24. Ng1 f4 25. Qf1
- **Lesson:** king_safety / king_safety / missed_chance, gap 202cp, pending; check: King safety is a main reason (+1.13)

```
On move 20 you played Bf3. Ne2 was better.

  What you played:  20. Bf3 b4 21. Ne2 Nf5 22. Bg4 a5 23. c4 Ba6
  What was better:  20. Ne2 Nf1+ 21. Rxf1 Qxf1 22. Qxe3 Qf7 23. Nf4 a5

Your move wasn't a disaster, but Ne2 would have improved king safety.
After the better line: 1 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it. After yours: 1 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

### 7w-42: 22. Kh1 — mistake (32% → 7%)

- Engine best: **Rxf1**; line: 22. Rxf1 Qxf1 23. Qxe3 Bd7 24. Ng3 Qc4 25. Qd2 Be8 26. Be2 Qxa2
- Others: Kh1 (8%)
- After Kh1: 22...Nd2 23. Ng1 a5 24. Qe2 Ba6 25. Qe1 Rf8 26. c3 bxc3 27. bxc3
- *Rejected lesson:* mobility / activity; Mobility gains only 0.01

### 7w-48: 25. b3 — inaccuracy (63% → 50%)

- Engine best: **Qb3**; line: 25. Qb3 Qh4 26. Qa4 Qe7 27. Qxc6 Qd7 28. Qxd7 Bxd7 29. Kg1 a5
- Others: a3 (63%), Qe2 (55%)
- After b3: 25...Bd7 26. a3 a5 27. axb4 axb4 28. Qd3 Rf8 29. Be2 Qg5 30. Qa6
- **Lesson:** material / forcing_moves / missed_chance, gap 171cp, pending

```
On move 25 you played b3. Qb3 was better.

  What you played:  25. b3 Bd7 26. a3 Be8 27. Qe2 a5 28. Bg4 Bf7
  What was better:  25. Qb3 a5 26. Bxd5 Qxb3 27. Bxb3 Kf7 28. Kg1 Bd7

Your move wasn't a disaster, but Qb3 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 7w-54: 28. Qe1 — mistake (65% → 42%)

- Engine best: **c6**; line: 28. c6 Rf8 29. c7 Bc8 30. c4 bxc3 31. Qxc3 g5 32. Rf1 h5
- Others: Qd4 (63%), Rd1 (63%)
- After Qe1: 28...Qxe1+ 29. Rxe1 Rc8 30. Kg1 Kf7 31. Kf2 Rxc5 32. Bd1 d4 33. Re4
- **Lesson:** material / safety / consequence, gap 256cp, pending

```
On move 28 you played Qe1. Rd1 was better.

  What you played:  28. Qe1 Qxe1+ 29. Rxe1 Rc8 30. Kg1 Rxc5 31. Bd1 Kf8
  What was better:  28. Rd1 Rf8 29. c6 g6 30. Qb6 Rxf3 31. Qxa6 Qf4

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +5.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 7 (1100), Black: Queen's Pawn Game

https://lichess.org/game/6IC7zrkA · 1159 vs 1094 · 1-0

### 7b-13: 7... Nd7 — ok (46% → 39%)

- Engine best: **Nf6**; line: 7...Nf6 8. c4 Nbd7 9. Be2 O-O 10. O-O Qe7 11. Nd2 c5 12. Qb3
- Others: Qf6 (46%), Qh4 (45%)
- After Nd7: 8. Qh5+ g6 9. Nxg6 Ngf6 10. Qh4 Rg8 11. Ne5 Nxe5 12. dxe5 Ng4
- **Lesson:** material / safety / consequence, gap 98cp, pending

```
On move 7 you played Nd7. Nf6 was better.

  What you played:  7...Nd7 8. Qh5+ g6 9. Nxg6 Ngf6 10. Qh4 Rg8 11. Ne5
  What was better:  7...Nf6 8. Be2 Nbd7 9. O-O Qb6 10. Nd3 c5 11. a4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 7b-17: 9... Nh6 — ok (54% → 50%)

- Engine best: **Qh4+**; line: 9...Qh4+ 10. Kd2 f4 11. Qf3 fxe3+ 12. Qxe3 c5 13. dxc5 Nh6 14. g3
- Others: c5 (52%), Qb6 (51%)
- After Nh6: 10. Qh5+ Nf7 11. Nd2 O-O 12. g4 Nh6 13. gxf5 exf5 14. Rg1 Ng4
- **Lesson:** open_files / open_files / consequence, gap 46cp, pending; check: Rooks is a main reason (+0.38)

```
On move 9 you played Nh6. Qh4+ was better.

  What you played:  9...Nh6 10. Be2 O-O 11. O-O Bd7 12. a4 Nf7 13. c4
  What was better:  9...Qh4+ 10. Kd2 f4 11. Qf3 fxe3+ 12. Qxe3 c5 13. dxc5

The difference is rooks on open files. Before your move: your rooks on open files: none; theirs: none.
After your line: your rooks on open files: none; theirs: f1. After the better line: your rooks on open files: none; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### 7b-19: 10... O-O — inaccuracy (71% → 55%)

- Engine best: **Qh4+**; line: 10...Qh4+ 11. Ke2 f4 12. Qe1 Qh5+ 13. Kd2 O-O 14. Nc3 c5 15. dxc5
- Others: O-O (57%), c5 (54%)
- After O-O: 11. Qd2 c5 12. dxc5 b6 13. cxb6 Qh4+ 14. Qf2 Qb4+ 15. c3 Qxb6
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 126cp, pending; check: Pawns is a main reason (+0.22)

```
On move 10 you played O-O. Qh4+ was better.

  What you played:  10...O-O 11. g3 c5 12. Qd2 cxd4 13. exd4 f4 14. g4
  What was better:  10...Qh4+ 11. Ke2 f4 12. Qe1 Qh5+ 13. Kd2 O-O 14. Nc3

Your move wasn't a disaster, but Qh4+ would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: doubled pawns on the e-file; backward pawn(s) on g2, e3. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 7b-21: 11... f4 — inaccuracy (85% → 71%)

- Engine best: **Qh4+**; line: 11...Qh4+ 12. Kd2 f4 13. Kc1 Nf5 14. Nd2 fxe3 15. Nf3 Qf2 16. Qf1
- Others: f4 (73%), Qg5 (66%)
- After f4: 12. O-O fxe3 13. c3 Rxf1+ 14. Qxf1 c5 15. Na3 cxd4 16. cxd4 Bd7
- **Lesson:** open_files / open_files / missed_chance, gap 133cp, pending; check: Rooks is a main reason (+0.78)

```
On move 11 you played f4. Qh4+ was better.

  What you played:  11...f4 12. O-O fxe3 13. c3 Rxf1+ 14. Bxf1 Qg5 15. Na3
  What was better:  11...Qh4+ 12. Kd2 f4 13. Kc1 Nf5 14. Nd2 fxe3 15. Nf3

Your move wasn't a disaster, but Qh4+ would have improved rooks on open files.
After the better line: your rooks on open files: f8; theirs: none. After yours: your rooks on open files: none; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### 7b-35: 18... Ng3 — inaccuracy (93% → 81%)

- Engine best: **Qf4+**; line: 18...Qf4+ 19. Kg1 Qf2+ 20. Kh2 e2 21. Qxe2 Qf4+ 22. g3 Qxg3+ 23. Kh1
- Others: e2 (93%), Qg3+ (93%)
- After Ng3: 19. Nc3 Bd7 20. Ne2 Nf5 21. Rg1 Rf8 22. Qd1 Nh4 23. Ng3 c5
- *No lesson.*

### 7b-37: 19... b5 — ok (82% → 73%)

- Engine best: **Qf4**; line: 19...Qf4 20. Kg1 Qf2+ 21. Kh2 Bd7 22. Ne2 Nf5 23. Rg1 Rf8 24. Qd1
- Others: Bd7 (82%), b6 (72%)
- After b5: 20. Ne2 Ne4 21. Qa3 b4 22. Qa5 Bd7 23. a3 h5 24. Bxh5 Be8
- **Lesson:** mobility / activity / missed_chance, gap 112cp, pending; check: Mobility is a main reason (+0.48)

```
On move 19 you played b5. Bd7 was better.

  What you played:  19...b5 20. Ne2 Nf1+ 21. Rxf1 Qxf1 22. Qxe3 Qf7 23. Nf4
  What was better:  19...Bd7 20. Ne2 Nf1+ 21. Rxf1 Qxf1 22. Qxe3 Rf8 23. Qa3

Your move wasn't a disaster, but Bd7 would have improved piece activity.
After the better line: 28 piece moves available vs opponent's 24. After yours: 15 piece moves available vs opponent's 25.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 7b-41: 21... Nf1+ — mistake (90% → 68%)

- Engine best: **Nf5**; line: 21...Nf5 22. Bg4 a5 23. Bxf5 exf5 24. Ng1 f4 25. Kh1 g6 26. Qe2
- Others: Nf1+ (70%), Nxe2 (54%)
- After Nf1+: 22. Rxf1 Qxf1 23. Qxe3 Bd7 24. Ng3 Qc4 25. Qd2 Be8 26. Be2 Qxa2
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only -0.05

### 7b-43: 22... Ng3+ — blunder (93% → 40%)

- Engine best: **Nd2**; line: 22...Nd2 23. Ng1 a5 24. Qe2 Ba6 25. Qe1 Rf8 26. c3 bxc3 27. bxc3
- Others: a5 (89%), Bd7 (87%)
- After Ng3+: 23. Nxg3 Qxg3 24. Qxe3 Qg6 25. c3 a5 26. cxb4 axb4 27. Qb3 Rb8
- **Lesson:** material / safety / consequence, gap 646cp, triggered after 2 plies
- Trigger: You've lost a knight: you're 3 pawns worse off than before.

```
On move 22 you played Ng3+. Nd2 was better.

  What you played:  22...Ng3+ 23. Nxg3 Qxg3 24. Qxe3 Bd7 25. a3 Qg6 26. Qd2
  What was better:  22...Nd2 23. Bg4 a5 24. Ng1 Ne4 25. Qd1 Ba6 26. Qe1

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 7b-51: 26... c5 — inaccuracy (50% → 36%)

- Engine best: **Bd7**; line: 26...Bd7 27. Rf1 h6 28. Qd3 Rf8 29. c3 bxc3 30. Qxc3 Be8 31. Qxa5
- Others: h6 (50%), Ba6 (47%)
- After c5: 27. dxc5 Ba6 28. c6 Rf8 29. c7 Bc8 30. Rf1 h5 31. c3 bxc3
- **Lesson:** material / hanging / consequence, gap 139cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 26 you played c5. Bd7 was better.

  What you played:  26...c5 27. dxc5 Ba6 28. c6 Rf8 29. c7
  What was better:  26...Bd7 27. Rf1 h6 28. Qd3 Rf8 29. c3

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: the piece you moved, now on c5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 7b-55: 28... d4 — blunder (58% → 2%)

- Engine best: **Qxe1+**; line: 28...Qxe1+ 29. Rxe1 Rc8 30. Kg1 Kf7 31. Kf2 Rxc5 32. Bd1 d4 33. Re4
- Others: Qf4 (34%), Qg5 (28%)
- After d4: 29. Qxg3 d3 30. cxd3 Rf8 31. Qg5 Rf5 32. Qe7 Bc8 33. c6 Rf8
- **Lesson:** material / hanging / consequence, gap 1009cp, triggered after 2 plies
- Trigger: You've lost a queen: you're 9 pawns worse off than before.

```
On move 28 you played d4. Qxe1+ was better.

  What you played:  28...d4 29. Qxg3 Bb7 30. Bxb7 Rxb7 31. c6 Rf7 32. Qh4
  What was better:  28...Qxe1+ 29. Rxe1 Rc8 30. Kg1 Rxc5 31. Bd1 Kf7 32. Kf2

The difference is material. Before your move: material balance -1.
After your line: material balance -10. After the better line: material balance +0.
Your move left this undefended: queen on g3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 8 (1100), White: Ruy Lopez

https://lichess.org/game/fb1tkC6m · 1127 vs 1137 · 1/2-1/2

### 8w-6: 4. Nc3 — ok (57% → 51%)

- Engine best: **O-O**; line: 4. O-O d6 5. d4 exd4 6. Nxd4 Bd7 7. Nc3 Nf6 8. Nxc6 bxc6
- Others: c3 (53%), Ba4 (52%)
- After Nc3: 4...a6 5. Ba4 Nf6 6. d4 exd4 7. Nxd4 Nxd4 8. Qxd4 c5 9. Qe5+
- **Lesson:** mobility / activity / missed_chance, gap 50cp, pending; check: Mobility is a main reason (+0.49)

```
On move 4 you played Nc3. O-O was better.

  What you played:  4. Nc3 a6 5. Be2 d6 6. d4 Nf6 7. O-O exd4
  What was better:  4. O-O Nge7 5. d4 exd4 6. Nxd4 g6 7. Nc3 Bg7

Your move wasn't a disaster, but O-O would have improved piece activity.
After the better line: 30 piece moves available vs opponent's 16. After yours: 25 piece moves available vs opponent's 25.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 8w-8: 5. O-O — ok (53% → 53%)

- Engine best: **d4**; line: 5. d4 exd4 6. Nxd4 Bb4 7. O-O a6 8. Nxc6 dxc6 9. Bd3 Be6
- Others: O-O (51%), d3 (51%)
- After O-O: 5...Bd6 6. d4 Nxd4 7. Nxd4 exd4 8. Qxd4 Qe7 9. Nd5 Nxd5 10. exd5
- **Lesson:** material / free_material / missed_chance, gap 82cp, pending

```
On move 5 you played O-O. Bxc6 was better.

  What you played:  5. O-O Bd6 6. d4 Nxd4 7. Nxd4 exd4 8. Qxd4 Qe7
  What was better:  5. Bxc6 bxc6 6. Nxe5 Bb4 7. O-O O-O 8. d3 Re8

Your move wasn't a disaster, but Bxc6 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 8w-14: 8. Re1 — ok (53% → 50%)

- Engine best: **Nf5**; line: 8. Nf5 Be5 9. Nd5 d6 10. Bxc6 Bxf5 11. Bxb7 Rb8 12. Bc6 Bd7
- Others: Re1 (50%), Nf3 (50%)
- After Re1: 8...Re8 9. Nf3 Bc5 10. h3 d6 11. Be3 Bb4 12. e5 dxe5 13. Qxd8
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.09

### 8w-22: 12. Bxd5 — ok (58% → 52%)

- Engine best: **Nxd5**; line: 12. Nxd5 Qd6 13. f4 Qc5+ 14. Be3 Qxc4 15. Ne7+ Kh8 16. fxe5 Ng4
- Others: Rxe5 (56%), Bxd5 (51%)
- After Bxd5: 12...Bxc3 13. Bxa8 Bxe1 14. Qxe1 Qd6 15. Qd2 Qe5 16. Qc3 Qxc3 17. bxc3
- *Rejected lesson:* open_files / open_files; Rooks isn't a main reason (top: Threats 0.70, Bishops 0.39)

### 8w-24: 13. bxc3 — blunder (52% → 8%)

- Engine best: **Bxa8**; line: 13. Bxa8 Bxe1 14. Qxe1 Qd4 15. Qd2 Qe5 16. Qe3 Qd6 17. Qd3 Qe5
- Others: Bxf7+ (12%), bxc3 (8%)
- After bxc3: 13...Qxd5 14. Qxd5 Nxd5 15. Re5 Rd8 16. Bd2 c5 17. Be1 f6 18. Re4
- **Lesson:** material / safety / consequence, gap 647cp, triggered after 2 plies
- Trigger: You're about to lose material.

```
On move 13 you played bxc3. Bxa8 was better.

  What you played:  13. bxc3 Qxd5 14. Qxd5 Nxd5 15. c4 Nf6 16. Bb2 Be6
  What was better:  13. Bxa8 Bxe1 14. Qxe1 Qd4 15. Bc6 Qd6 16. Bf3 Bg4

The difference is material. Before your move: material balance +1.
After your line: material balance -2. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 8w-26: 14. c4 — inaccuracy (22% → 9%)

- Engine best: **Ba3**; line: 14. Ba3 Be6 15. Bxf8 Qxf8 16. Qd4 Qa3 17. c4 Qa4 18. Qc5 Nf6
- Others: c4 (10%), Qf3 (9%)
- After c4: 14...Nb4 15. Rb1 a5 16. Qh5 Nxc2 17. Rd1 Qf6 18. Rb5 Qg6 19. Qxg6
- **Lesson:** material / forcing_moves / missed_chance, gap 192cp, pending

```
On move 14 you played c4. Ba3 was better.

  What you played:  14. c4 Nf6 15. Ba3 Re8 16. Qxd8 Rxd8
  What was better:  14. Ba3 Be6 15. Bxf8 Qxf8 16. Qf3 Qc5

Your move wasn't a disaster, but Ba3 would have improved material.
After the better line: material balance +0. After yours: material balance -2.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 8w-40: 21. Bxf8 — ok (11% → 9%)

- Engine best: **Rb5**; line: 21. Rb5 Qd8 22. Qxb1 Re8 23. Bc5 a6 24. Rb3 Qd2 25. Be3 Qe2
- Others: Bxf8 (9%), h3 (7%)
- After Bxf8: 21...Kxf8 22. Qb3 Qxb3 23. axb3 Ba2 24. Rb5 a5 25. h4 Ke7 26. b4
- **Lesson:** material / hanging / consequence, gap 319cp, pending

```
On move 21 you played Bxf8. Rb5 was better.

  What you played:  21. Bxf8 Kxf8 22. Rb5 Bxa2 23. h4 Qe8 24. Qc2 Bxc4
  What was better:  21. Rb5 Bxa2 22. Rxb8 Raxb8 23. h3 Rb1 24. Bc1 Bb3

The difference is material. Before your move: material balance -2.
After your line: material balance -4. After the better line: material balance -1.
Your move left this undefended: pawn on a2, the piece you moved, now on f8.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 8w-46: 24. Qb4+ — ok (56% → 49%)

- Engine best: **Rd5**; line: 24. Rd5 Qf6 25. g3 Re8 26. Qd3 Qc6 27. Qd4 Re1+ 28. Kg2 Kg8
- Others: Rb7 (51%), Rb4 (50%)
- After Qb4+: 24...Kg8 25. Rd5 Qe8 26. g3 Qe1+ 27. Kg2 Qe4+ 28. Kg1 Re8 29. Qc5
- *Rejected lesson:* material / safety; not a strategic feature

### 8w-56: 29. Rd6 — mistake (88% → 62%)

- Engine best: **Rc5**; line: 29. Rc5 Rc8 30. Kf1 Kf8 31. Ke2 Ke7 32. Ra5 Ra8 33. Ke3 Kd6
- Others: Ra5 (88%), Re5 (87%)
- After Rd6: 29...a5 30. bxa5 Ra8 31. Rxc6 Rxa5 32. Rc8+ Kh7 33. Kf1 Rxa3 34. Ke2
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only -0.27

### 8w-60: 31. bxc5 — mistake (90% → 61%)

- Engine best: **b5**; line: 31. b5 axb5 32. cxb5 Kf8 33. Kf1 Ke7 34. Ra6 c4 35. Ke2 Rd8
- Others: bxc5 (61%), Rxa6 (53%)
- After bxc5: 31...Rxc5 32. Rd4 Kf8 33. f3 h5 34. Kf2 f6 35. Ke3 Ke7 36. a4
- **Lesson:** material / hanging / missed_chance, gap 244cp, pending

```
On move 31 you played bxc5. b5 was better.

  What you played:  31. bxc5 Rxc5 32. Rd8+ Kh7 33. Rd4 f5 34. gxf5 Rxf5
  What was better:  31. b5 axb5 32. cxb5 Kf8 33. Kf1 Ke7 34. Rb6 g5

Your move wasn't a disaster, but b5 would have improved material.
After the better line: material balance +2. After yours: material balance +1.
Your move left this undefended: the piece you moved, now on c5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 8w-64: 33. a4 — mistake (50% → 28%)

- Engine best: **f3**; line: 33. f3 h5 34. gxh5 Rxh4 35. Ra8+ Kh7 36. Ra5 Kh6 37. Kf2 g5
- Others: Ra8+ (50%), Kh2 (50%)
- After a4: 33...Rxg4+ 34. Kf1 Rxh4 35. Ra8+ Kh7 36. Ra7 Rf4 37. a5 f6 38. Kg2
- **Lesson:** material / hanging / consequence, gap 253cp, pending

```
On move 33 you played a4. f3 was better.

  What you played:  33. a4 Rxg4+ 34. Kh2 Rxh4+ 35. Kg3 Rc4 36. a5 Ra4
  What was better:  33. f3 h5 34. gxh5 Rxh4 35. Rc6 Kh7 36. Kf2 Rxh5

The difference is material. Before your move: material balance +1.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: pawn on g4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 8w-80: 41. f3 — blunder (83% → 7%)

- Engine best: **Rg8+**; line: 41. Rg8+ Kf5 42. a8=Q Rxa8 43. Rxa8 Ke4 44. Kg4 f5+ 45. Kxg5 Kf3
- Others: f4 (42%), Rh8 (9%)
- After f3: 41...Kf5 42. Rd8 Rxa7 43. Rd2 Ra4 44. Kg2 f6 45. Rd5+ Kf4 46. Rd2
- **Lesson:** material / forcing_moves / missed_chance, gap 1021cp, pending

```
On move 41 you played f3. Rg8+ was better.

  What you played:  41. f3 Kf5 42. Kg2 Kf4 43. Kh2 Ra2+ 44. Kh3 Kf5
  What was better:  41. Rg8+ Kf6 42. a8=R Rxa8 43. Rxa8 Kf5 44. Ra7 Ke4

Your move wasn't a disaster, but Rg8+ would have improved material.
After the better line: material balance +4. After yours: material balance -1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 8w-82: 42. Kg2 — blunder (84% → 8%)

- Engine best: **Rg8+**; line: 42. Rg8+ Kf7 43. a8=R Rxa8 44. Rxa8 Kg7 45. Ra3 Kf6 46. Ra6+ Kf7
- Others: f4 (44%), Kh2 (9%)
- After Kg2: 42...Ra2+ 43. Kg1 Kg7 44. Kh1 h3 45. Kg1 f4 46. Rd8 Rxa7 47. Kh2
- **Lesson:** material / forcing_moves / missed_chance, gap 470cp, pending

```
On move 42 you played Kg2. Rg8+ was better.

  What you played:  42. Kg2 Ra2+ 43. Kg1 Kg7 44. Kh1 h3 45. Kg1 f4
  What was better:  42. Rg8+ Kh5 43. a8=R g4+ 44. Kh2 Rxa8 45. Rxa8 Kh6

Your move wasn't a disaster, but Rg8+ would have improved material.
After the better line: material balance +3. After yours: material balance -1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

## Game 8 (1100), Black: Ruy Lopez

https://lichess.org/game/fb1tkC6m · 1127 vs 1137 · 1/2-1/2

### 8b-21: 11... cxd5 — ok (51% → 42%)

- Engine best: **Ng4**; line: 11...Ng4 12. g3 Qf6 13. Ne4 Qg6 14. dxc6 Bf5 15. Bd3 Rae8 16. Qf3
- Others: Qd6 (50%), Bxc3 (50%)
- After cxd5: 12. Nxd5 Qd6 13. f4 Qc5+ 14. Be3 Qxc4 15. Ne7+ Kh8 16. fxe5 Ng4
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.09

### 8b-25: 13... Nxd5 — inaccuracy (92% → 78%)

- Engine best: **Qxd5**; line: 13...Qxd5 14. Qxd5 Nxd5 15. Re5 Rd8 16. Bd2 c5 17. Be1 f6 18. Re4
- Others: Nxd5 (78%), Bg4 (50%)
- After Nxd5: 14. Ba3 Be6 15. Bxf8 Qxf8 16. Qd4 Qa3 17. c4 Qa4 18. Qc5 Nf6
- *No lesson.*

### 8b-39: 20... Bxb1 — ok (92% → 89%)

- Engine best: **Qxb1**; line: 20...Qxb1 21. Qxb1 Bxb1 22. Bxf8 Kxf8 23. a3 Ke7 24. h4 a5 25. Re5+
- Others: Bxb1 (88%), Qc8 (15%)
- After Bxb1: 21. Rb5 Qd8 22. Qxb1 Re8 23. Bc5 a6 24. Rb3 Qd2 25. Be3 Qe2
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 433cp, pending; check: Pawns is a main reason (+0.10)

```
On move 20 you played Bxb1. Qxb1 was better.

  What you played:  20...Bxb1 21. Rb5 Bxa2 22. Rxb8 Rfxb8 23. h4 Rb1 24. Bc1
  What was better:  20...Qxb1 21. Bxf8 Kxf8 22. Qxb1 Bxb1 23. Rd1 Bh7 24. Rd7

Your move wasn't a disaster, but Qxb1 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on a2, c3, c4; doubled pawns on the c-file. After yours: opponent's pawns: isolated pawn(s) on c3, c4; doubled pawns on the c-file.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 8b-43: 22... Qd8 — blunder (93% → 49%)

- Engine best: **Bxa2**; line: 22...Bxa2 23. h3 Qe8 24. Qd4 Kg8 25. Ra5 Bb3 26. Rxa7 Qe1+ 27. Kh2
- Others: Bg6 (91%), Bh7 (90%)
- After Qd8: 23. Qxb1 g6 24. h3 c6 25. Rb7 a5 26. g3 Kg7 27. Qe4 Qf6
- **Lesson:** material / hanging / consequence, gap 623cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before.

```
On move 22 you played Qd8. Bg6 was better.

  What you played:  22...Qd8 23. Qxb1 Qd7 24. g3 Re8 25. Rb8 g6 26. Rxe8+
  What was better:  22...Bg6 23. Rxb8+ Rxb8 24. c5 Rb1 25. Qxb1 Bxb1 26. a3

The difference is material. Before your move: material balance +2.
After your line: material balance -1. After the better line: material balance +2.
Your move left this undefended: bishop on b1.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 8b-51: 26... Qxb4 — blunder (50% → 18%)

- Engine best: **Qe8**; line: 26...Qe8 27. Qc5 Qe2 28. a4 Re8 29. Kh2 Qc2 30. Rf5 Re4 31. Qd5
- Others: Re8 (50%), Rb8 (50%)
- After Qxb4: 27. cxb4 Kf8 28. Rc5 Rc8 29. Rc6 a5 30. b5 Ke7 31. g3 Kd7
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 379cp, pending; check: Pawns is a main reason (+0.27)

```
On move 26 you played Qxb4. Qe8 was better.

  What you played:  26...Qxb4 27. cxb4 Re8 28. Kf1 Re4 29. Rc5 Rxh4 30. Rxc7
  What was better:  26...Qe8 27. Qc5 Qe1+ 28. Kh2 Re8 29. h5 Qxc3 30. Qxc7

Your move wasn't a disaster, but Qe8 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on a2, c4. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 8b-55: 28... c6 — ok (14% → 12%)

- Engine best: **Re8**; line: 28...Re8 29. Kf1 Kf8 30. g3 Re7 31. Rd8+ Re8 32. Rxe8+ Kxe8 33. Ke2
- Others: Kf8 (14%), c6 (14%)
- After c6: 29. Rc5 Rc8 30. Kf1 Kf8 31. Ke2 Ke7 32. Ra5 Ra8 33. Ke3 Kd6
- **Lesson:** material / safety / consequence, gap 92cp, pending

```
On move 28 you played c6. Re8 was better.

  What you played:  28...c6 29. Ra5 Ra8 30. b5 cxb5 31. cxb5 Rb8
  What was better:  28...Re8 29. g3 Re1+ 30. Kg2 Rc1 31. Rc5 Rc3

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 8b-57: 29... Rc8 — mistake (38% → 14%)

- Engine best: **a5**; line: 29...a5 30. bxa5 Ra8 31. Rxc6 Rxa5 32. Rc8+ Kh7 33. Kf1 Rxa3 34. Ke2
- Others: Rc8 (16%), c5 (13%)
- After Rc8: 30. Kf1 Kf8 31. Ke2 Ke7 32. c5 Rc7 33. Ke3 a5 34. Kd3 axb4
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns isn't a main reason (top: Passed 0.42, Threats 0.32)

### 8b-59: 30... c5 — ok (19% → 10%)

- Engine best: **a5**; line: 30...a5 31. Kg2 axb4 32. axb4 Kf8 33. c5 Rb8 34. Rd4 Ke7 35. Kf3
- Others: g6 (19%), Kf8 (19%)
- After c5: 31. b5 axb5 32. cxb5 Kf8 33. Kf1 Ke7 34. Ra6 c4 35. Ke2 Rd8
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only 0.00

### 8b-77: 39... g5 — blunder (88% → 58%)

- Engine best: **Ra3**; line: 39...Ra3 40. f3 g6 41. Kh2 Kg7 42. Kg2 g5 43. Kh3 Ra4 44. f4
- Others: g6 (88%), g5 (61%)
- After g5: 40. Kh3 Kg7 41. f3 f5 42. Kg2 Ra3 43. Kh2 Ra2+ 44. Kh3 Ra1
- **Lesson:** material / forcing_moves / missed_chance, gap 90cp, pending

```
On move 39 you played g5. g6 was better.

  What you played:  39...g5 40. Kh3 Kg7 41. f3 f5 42. Kh2 Ra1 43. Kg2
  What was better:  39...g6 40. f3 Kg7 41. Kh2 Ra3 42. Kg2 g5 43. Kh2

Your move wasn't a disaster, but g6 would have improved material.
After the better line: material balance +2. After yours: material balance +1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 8b-79: 40... Kg6 — blunder (55% → 17%)

- Engine best: **Ra3+**; line: 40...Ra3+ 41. f3 Ra4 42. Kg2 Kg7 43. Kh3 f6 44. f4 Ra3+ 45. Kg4
- Others: Kg7 (54%), f5 (52%)
- After Kg6: 41. Rg8+ Kf5 42. a8=Q Rxa8 43. Rxa8 Ke4 44. Kg4 f5+ 45. Kxg5 Kf3
- **Lesson:** material / safety / consequence, gap 567cp, pending

```
On move 40 you played Kg6. Ra3+ was better.

  What you played:  40...Kg6 41. Rg8+ Kh7 42. a8=Q Rxa8 43. Rxa8 f5 44. Rf8
  What was better:  40...Ra3+ 41. f3 Ra4 42. Kh2 Kg7 43. Kh3 f5 44. Kh2

The difference is material. Before your move: material balance +1.
After your line: material balance -3. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 8b-81: 41... f5 — blunder (93% → 16%)

- Engine best: **Kf5**; line: 41...Kf5 42. Rd8 Rxa7 43. Rd2 Ra4 44. Kg2 f6 45. Rd5+ Kf4 46. Rd2
- Others: Kg7 (88%), Kf6 (56%)
- After f5: 42. Rg8+ Kf7 43. a8=R Rxa8 44. Rxa8 Kg7 45. Ra3 Kf6 46. Ra6+ Kf7
- **Lesson:** material / safety / consequence, gap 889cp, pending

```
On move 41 you played f5. Kf5 was better.

  What you played:  41...f5 42. Rg8+ Kh5 43. Rh8+ Kg6 44. a8=R Rxa8 45. Rxa8
  What was better:  41...Kf5 42. Kg2 Kf4 43. Kh3 f5 44. Kg2 Ra3 45. Rb8

The difference is material. Before your move: material balance +1.
After your line: material balance -3. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 8b-83: 42... g4 — blunder (92% → 16%)

- Engine best: **Ra2+**; line: 42...Ra2+ 43. Kg1 Kg7 44. Kh1 h3 45. Kg1 f4 46. Rd8 Rxa7 47. Kh2
- Others: Kg7 (55%), Kh7 (54%)
- After g4: 43. Rg8+ Kf6 44. a8=Q Rxa8 45. Rxa8 Kg5 46. Rf8 Kf4 47. fxg4 Kxg4
- **Lesson:** material / safety / consequence, gap 528cp, pending

```
On move 42 you played g4. Ra2+ was better.

  What you played:  42...g4 43. Rg8+ Kf6 44. a8=Q Rxa8 45. Rxa8 Kf7 46. Ra6
  What was better:  42...Ra2+ 43. Kf1 Kg7 44. Kg1 h3 45. Kh1 f4 46. Kg1

The difference is material. Before your move: material balance +1.
After your line: material balance -3. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 9 (1100), White: Elephant Gambit

https://lichess.org/game/ZxbhuLMB · 1010 vs 1079 · 0-1

### 9w-8: 5. Ng5 — blunder (94% → 51%)

- Engine best: **Bb5**; line: 5. Bb5 Bd7 6. Bxc6 Nxc6 7. d3 Bg4 8. h3 Bh5 9. g4 Bg6
- Others: Nxe5 (80%), d4 (71%)
- After Ng5: 5...a6 6. Nf3 e4 7. Qe2 Nf6 8. Nd4 Qb6 9. Nxe4 Be7 10. Nxf6+
- **Lesson:** material / free_material / missed_chance, gap 755cp, pending

```
On move 5 you played Ng5. Bb5 was better.

  What you played:  5. Ng5 a6 6. Nf3 Qd6 7. d4 exd4 8. Nxd4 Nf6
  What was better:  5. Bb5 Bg4 6. Qe2 Bd7 7. Bxc6 Nxc6 8. O-O O-O-O

Your move wasn't a disaster, but Bb5 would have improved material.
After the better line: material balance +7. After yours: material balance +0.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 9w-10: 6. Nce4 — inaccuracy (64% → 52%)

- Engine best: **d4**; line: 6. d4 h6 7. Nd5 Qd6 8. dxe5 Qxe5+ 9. Qe2 Qxe2+ 10. Bxe2 Bd6
- Others: Nce4 (51%), h4 (51%)
- After Nce4: 6...Qc6 7. Nc3 Nd7 8. d4 Bb4 9. Bd2 Ngf6 10. dxe5 O-O 11. f4
- **Lesson:** material / forcing_moves / missed_chance, gap 78cp, pending

```
On move 6 you played Nce4. d4 was better.

  What you played:  6. Nce4 Qc6 7. Nc3 a6 8. Nf3 Qd6 9. d4 exd4
  What was better:  6. d4 h6 7. Nge4 Qg6 8. dxe5 Nc6 9. Ng3 Bg4

Your move wasn't a disaster, but d4 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 9w-12: 7. d3 — ok (55% → 48%)

- Engine best: **d4**; line: 7. d4 h6 8. Ng3 Qd7 9. Nf3 exd4 10. Nxd4 Bc5 11. Qe2+ Ne7
- Others: Bd3 (53%), d3 (50%)
- After d3: 7...Nc6 8. Ng3 Qd7 9. Be2 h6 10. Nf3 Nf6 11. O-O Bd6 12. b3
- **Lesson:** material / forcing_moves / missed_chance, gap 120cp, pending

```
On move 7 you played d3. Bc4 was better.

  What you played:  7. d3 h6 8. Ng3 Qg6 9. Nf3 Nc6 10. Be2 Be6
  What was better:  7. Bc4 f6 8. g4 Qxg4 9. Qxg4 Bxg4 10. Nf7 b5

Your move wasn't a disaster, but Bc4 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 9w-14: 8. h4 — ok (52% → 45%)

- Engine best: **d4**; line: 8. d4 exd4 9. Bd3 Qg4 10. Be2 Qd7 11. Bc4 Nh6 12. O-O O-O
- Others: Be2 (52%), c3 (51%)
- After h4: 8...Nc6 9. g3 Qd7 10. Be3 Nh6 11. Bh3 Qd8 12. Qh5 Bxh3 13. Nxh3
- *Rejected lesson:* development / develop; Mobility/Knights/Bishops gains only -0.21

### 9w-16: 9. Nh3 — ok (45% → 37%)

- Engine best: **Ng3**; line: 9. Ng3 Qd7 10. Nf3 Nc6 11. c3 Nf6 12. b4 Bd6 13. Be2 O-O
- Others: Nf3 (43%), Nh3 (38%)
- After Nh3: 9...Nc6 10. c3 Bd7 11. Qb3 O-O-O 12. Ng3 Qe6 13. Qxe6 Bxe6 14. Ng1
- **Lesson:** material / safety / consequence, gap 75cp, pending

```
On move 9 you played Nh3. Ng3 was better.

  What you played:  9. Nh3 Nc6 10. c3 Bxh4 11. Be2 Be7 12. b4 Qg6
  What was better:  9. Ng3 Qd7 10. Nf3 Nc6 11. c3 Nf6 12. Be2 O-O

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9w-20: 11. Ng1 — ok (39% → 38%)

- Engine best: **g3**; line: 11. g3 Bd7 12. Ng1 Qe6 13. Be3 O-O 14. Ne2 Be7 15. Nc3 Bc6
- Others: Ng1 (38%), c3 (38%)
- After Ng1: 11...Nc6 12. Ne2 O-O 13. Nc3 Be7 14. Nd5 Bc5 15. Ne3 Qg6 16. h5
- **Lesson:** development / develop / missed_chance, gap 35cp, pending; check: Mobility is a main reason (+0.51)

```
On move 11 you played Ng1. g3 was better.

  What you played:  11. Ng1 Nc6 12. Ne2 Be7 13. Ng3 Qg6 14. h5 Qd6
  What was better:  11. g3 Nc6 12. Be3 Be7 13. Bg2 O-O 14. O-O Rd8

Your move wasn't a disaster, but g3 would have improved development.
After the better line: all minor pieces developed. After yours: undeveloped: bishop on c1, bishop on f1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

### 9w-24: 13. d4 — blunder (40% → 5%)

- Engine best: **Nd2**; line: 13. Nd2 exd3 14. Bxd3 Qe5+ 15. Ne4 Bd7 16. O-O O-O-O 17. Nxf6 Qxf6
- Others: dxe4 (37%), Qe2 (37%)
- After d4: 13...exf3 14. gxf3 Nxd4 15. Bd3 Nxf3+ 16. Kf1 Qg4 17. Qe2+ Kf8 18. Qe4
- **Lesson:** material / hanging / consequence, gap 683cp, triggered after 2 plies
- Trigger: You've lost a knight: you're 3 pawns worse off than before.

```
On move 13 you played d4. Nd2 was better.

  What you played:  13. d4 exf3 14. Qxf3 Qxf3 15. gxf3 Nxd4 16. c3 Nxf3+
  What was better:  13. Nd2 exd3 14. Bxd3 Qe5+ 15. Ne4 Bf5 16. O-O O-O-O

The difference is material. Before your move: material balance +0.
After your line: material balance -4. After the better line: material balance +0.
Your move left this undefended: knight on f3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 9 (1100), Black: Elephant Gambit

https://lichess.org/game/ZxbhuLMB · 1010 vs 1079 · 0-1

### 9b-3: 2... d5 — ok (49% → 42%)

- Engine best: **Nc6**; line: 2...Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. Re1 Nd6 6. Nxe5 Be7 7. Bf1
- Others: Nf6 (49%), d6 (47%)
- After d5: 3. exd5 e4 4. Qe2 Nf6 5. d3 Qxd5 6. Nbd2 Nc6 7. dxe4 Qe6
- **Lesson:** material / safety / consequence, gap 84cp, pending

```
On move 2 you played d5. Nc6 was better.

  What you played:  2...d5 3. exd5 Bd6 4. Nc3 Nf6 5. d4 e4 6. Ne5
  What was better:  2...Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O d6 6. d4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9b-7: 4... Qc6 — blunder (41% → 6%)

- Engine best: **Qc5**; line: 4...Qc5 5. d4 exd4 6. Nxd4 Nf6 7. Qe2+ Be7 8. Be3 O-O 9. O-O-O
- Others: Qd6 (40%), Qe6 (39%)
- After Qc6: 5. Bb5 Bd7 6. Bxc6 Nxc6 7. d3 Bg4 8. h3 Bh5 9. g4 Bg6
- **Lesson:** material / safety / consequence, gap 679cp, pending

```
On move 4 you played Qc6. Qc5 was better.

  What you played:  4...Qc6 5. Bb5 Bg4 6. Bxc6+ Nxc6 7. h3 Bh5 8. g4
  What was better:  4...Qc5 5. d4 exd4 6. Nxd4 Nf6 7. Be3 Qe5 8. Qe2

The difference is material. Before your move: material balance +0.
After your line: material balance -6. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9b-9: 5... Qf6 — inaccuracy (49% → 36%)

- Engine best: **a6**; line: 5...a6 6. Nf3 e4 7. Qe2 Nf6 8. Nd4 Qb6 9. Nxe4 Be7 10. Nxf6+
- Others: Bd7 (49%), Nd7 (48%)
- After Qf6: 6. d4 h6 7. Nd5 Qd6 8. dxe5 Qxe5+ 9. Qe2 Qxe2+ 10. Bxe2 Bd6
- **Lesson:** development / develop / missed_chance, gap 122cp, pending; check: Mobility is a main reason (+0.39)

```
On move 5 you played Qf6. a6 was better.

  What you played:  5...Qf6 6. d4 h6 7. Nge4
  What was better:  5...a6 6. d4 Bb4 7. Qd3

Your move wasn't a disaster, but a6 would have improved development.
After the better line: undeveloped: knight on b8, knight on g8, bishop on c8. After yours: undeveloped: knight on b8, knight on g8, bishop on c8, bishop on f8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

### 9b-13: 7... Be7 — ok (52% → 48%)

- Engine best: **Nc6**; line: 7...Nc6 8. Ng3 Qd7 9. Be2 h6 10. Nf3 Nf6 11. O-O Bd6 12. b3
- Others: h6 (51%), Be7 (49%)
- After Be7: 8. d4 exd4 9. Bd3 Qg4 10. Be2 Qd7 11. Bc4 Nh6 12. O-O O-O
- *Rejected lesson:* mobility / activity; Mobility isn't a main reason (top: King safety 0.90, Rooks 0.58)

### 9b-23: 12... e4 — ok (64% → 60%)

- Engine best: **Be6**; line: 12...Be6 13. Be3 Bd5 14. Nd2 Qd7 15. c3 Be7 16. b4 f5 17. Be2
- Others: O-O (63%), Bd7 (62%)
- After e4: 13. Nd2 exd3 14. Bxd3 Qe5+ 15. Ne4 Bd7 16. O-O O-O-O 17. Nxf6 Qxf6
- *Rejected lesson:* king_safety / king_safety; King safety is a main reason (+0.22)

## Game 10 (1100), White: Sicilian Defense: Old Sicilian

https://lichess.org/game/bJIMjXRz · 1196 vs 1183 · 0-1

### 10w-12: 7. d3 — ok (56% → 50%)

- Engine best: **d4**; line: 7. d4 cxd4 8. Nxd4 Qd7 9. Nxc6 Qxc6 10. Re1 g6 11. e5 dxe5
- Others: e5 (55%), d3 (51%)
- After d3: 7...e5 8. Nd5 e6 9. Nxf6+ Qxf6 10. c3 h6 11. b4 Be7 12. Qb3
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 44cp, pending; check: Pawns is a main reason (+0.38)

```
On move 7 you played d3. e5 was better.

  What you played:  7. d3 e5 8. Ng5 h6 9. Ne6 Qd7 10. Nd5 Rc8
  What was better:  7. e5 dxe5 8. Re1 Qd6 9. Nb5 Qd7 10. a4 a6

Your move wasn't a disaster, but e5 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on e5, e6, e7; doubled pawns on the e-file. After yours: opponent's pawns: doubled pawns on the e-file.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 10w-24: 13. Bd2 — blunder (90% → 56%)

- Engine best: **Qf3+**; line: 13. Qf3+ Nf6 14. Qg3 Rhg8 15. f4 Rxg7 16. Nd5 Kg8 17. fxe5 Nxd5
- Others: Qd2 (74%), Qc1 (65%)
- After Bd2: 13...Kxg7 14. h3 Nf6 15. f4 Rhf8 16. fxe5 dxe5 17. Be3 b6 18. Rf2
- **Lesson:** material / hanging / consequence, gap 402cp, triggered after 2 plies
- Trigger: You've lost a knight: you're 3 pawns worse off than before.

```
On move 13 you played Bd2. Qf3+ was better.

  What you played:  13. Bd2 Kxg7 14. h3 Nf6 15. f4 Raf8 16. fxe5 dxe5
  What was better:  13. Qf3+ Nf6 14. Qe3 Nd4 15. Qg5 Rhg8 16. f4 exf4

The difference is material. Before your move: material balance +3.
After your line: material balance +0. After the better line: material balance +2.
Your move left this undefended: knight on g7.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 10w-34: 18. Rae1 — ok (67% → 59%)

- Engine best: **Bh6**; line: 18. Bh6 Rf7 19. Rf2 Ne5 20. Raf1 Kg8 21. b4 b6 22. Nd5 Nxd5
- Others: Rf2 (66%), Nd5 (62%)
- After Rae1: 18...Ng8 19. b4 b6 20. Nd5 e6 21. Ne3 e5 22. Bg3 Kg7 23. bxc5
- *Rejected lesson:* mobility / activity; Mobility gains only -0.32

### 10w-44: 23. Nd5 — blunder (95% → 50%)

- Engine best: **Bh6**; line: 23. Bh6 Nxe4 24. dxe4 Rxf2 25. Rxf2 Rf7 26. Nd5 a6 27. c3 Nc6
- Others: b4 (63%), Be3 (60%)
- After Nd5: 23...Nxd5 24. Rxf7 Rxf7 25. Rxf7 Qxf7 26. exd5 Kg7 27. Bh6+ Kg8 28. Qa5
- **Lesson:** material / safety / consequence, gap 570cp, pending

```
On move 23 you played Nd5. Bh6 was better.

  What you played:  23. Nd5 Nxd5 24. c3 Rxf2 25. Rxf2 Rxf2 26. Qxf2 Ne2+
  What was better:  23. Bh6 b6 24. Bxf8 Rxf8 25. Nd5 Kg7 26. b4 h6

The difference is material. Before your move: material balance +0.
After your line: material balance +0. After the better line: material balance +5.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 10w-54: 28. Qf8+ — blunder (98% → 3%)

- Engine best: **Qf6+**; line: 28. Qf6+ Kg8 29. Qe7 Qxg2+ 30. Kxg2 Nf4+ 31. Kh2 Ne6 32. Qxe6+ Kh8
- Others: Qf7 (98%), c4 (94%)
- After Qf8+: 28...Nxf8 29. Bxf8 Kg8 30. Kh2 Qd4 31. c3 Qf4+ 32. Kh1 Kxf8 33. d4
- **Lesson:** material / hanging / consequence, gap 1651cp, pending

```
On move 28 you played Qf8+. Qf6+ was better.

  What you played:  28. Qf8+ Nxf8 29. c4 Qd4+ 30. Kh2 Qh4 31. Be3 Kg8
  What was better:  28. Qf6+ Kg8 29. Qe7 Qd4+ 30. Kh2 Qf4+ 31. Bxf4 Nxf4

The difference is material. Before your move: material balance -1.
After your line: material balance -10. After the better line: material balance +6.
Your move left this undefended: the piece you moved, now on f8.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 10 (1100), Black: Sicilian Defense: Old Sicilian

https://lichess.org/game/bJIMjXRz · 1196 vs 1183 · 0-1

### 10b-5: 3... d6 — ok (52% → 48%)

- Engine best: **Nf6**; line: 3...Nf6 4. d3 e6 5. O-O d5 6. Bb5 Bd7 7. Re1 Be7 8. Nc3
- Others: e6 (52%), a6 (49%)
- After d6: 4. d4 cxd4 5. Nxd4 e5 6. Qh5 g6 7. Nxc6 bxc6 8. Qe2 Bg7
- *Rejected lesson:* mobility / activity; King safety (+1.72) dwarfs Mobility (+0.28)

### 10b-9: 5... Be6 — ok (51% → 44%)

- Engine best: **e6**; line: 5...e6 6. d4 cxd4 7. Nxd4 Be7 8. Be3 O-O 9. a4 a6 10. f4
- Others: Bg4 (51%), g6 (51%)
- After Be6: 6. Bxe6 fxe6 7. d4 cxd4 8. Nxd4 Qd7 9. Nxc6 Qxc6 10. Re1 g6
- **Lesson:** mobility / activity / consequence, gap 68cp, pending; check: Mobility is a main reason (+0.37)

```
On move 5 you played Be6. Bg4 was better.

  What you played:  5...Be6 6. Bxe6 fxe6 7. d4 cxd4 8. Nxd4 Qd7 9. Nxc6
  What was better:  5...Bg4 6. h3 Bxf3 7. Qxf3 Nd4 8. Qd1 e6 9. d3

The difference is piece activity. Before your move: 22 piece moves available vs opponent's 22.
After your line: 13 piece moves available vs opponent's 30. After the better line: 24 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 10b-15: 8... g6 — ok (50% → 45%)

- Engine best: **e6**; line: 8...e6 9. b4 b6 10. b5 Nd4 11. a4 Be7 12. Nd2 a6 13. Bb2
- Others: b6 (48%), Qd7 (48%)
- After g6: 9. b4 b6 10. Nd5 Qd7 11. c4 Nd8 12. b5 Nh5 13. Bg5 h6
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only 0.04

### 10b-17: 9... Bg7 — mistake (48% → 27%)

- Engine best: **Qd7**; line: 9...Qd7 10. Nd5 Rc8 11. c3 Bg7 12. f4 h6 13. Nxf6+ exf6 14. Nh3
- Others: h6 (47%), Rc8 (45%)
- After Bg7: 10. Ne6 Qc8 11. Nxg7+ Kf7 12. Bh6 Ng4 13. Qd2 Rg8 14. Nd5 Nxh6
- **Lesson:** material / safety / consequence, gap 311cp, pending

```
On move 9 you played Bg7. Qd7 was better.

  What you played:  9...Bg7 10. Ne6 Qc8 11. Nxg7+ Kf7 12. Bh6 Ng4 13. Qd2
  What was better:  9...Qd7 10. Nd5 Rc8 11. f4 exf4 12. Nxf4 Bh6 13. Nfe6

The difference is material. Before your move: material balance +0.
After your line: material balance -3. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 10b-19: 10... Qd7 — inaccuracy (28% → 13%)

- Engine best: **Qc8**; line: 10...Qc8 11. Nxg7+ Kf7 12. Bh6 Ng4 13. Qd2 Rg8 14. Nd5 Nxh6 15. Ne6
- Others: Qd7 (15%), Qb8 (12%)
- After Qd7: 11. Nxg7+ Kf7 12. Bh6 Ng4 13. Qf3+ Nf6 14. Qg3 Rag8 15. f4 Rxg7
- *No lesson.*

### 10b-33: 17... Kh8 — inaccuracy (44% → 33%)

- Engine best: **Ng8**; line: 17...Ng8 18. b4 b6 19. Nd5 h6 20. c3 e5 21. Bg3 Rxf1+ 22. Rxf1
- Others: Rf7 (36%), Kg8 (36%)
- After Kh8: 18. Bh6 Rf7 19. Rf2 Ne5 20. Raf1 Kg8 21. b4 b6 22. Nd5 Nxd5
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only 0.01

### 10b-35: 18... e5 — ok (41% → 34%)

- Engine best: **Ng8**; line: 18...Ng8 19. b4 b6 20. Nd5 e6 21. Ne3 e5 22. Bg3 Kg7 23. bxc5
- Others: Qe6 (37%), b6 (36%)
- After e5: 19. Bh6 Rf7 20. Qf2 Nd8 21. Qh4 Ng8 22. Bg5 Ne6 23. Rxf7 Qxf7
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: King safety 1.13, Mobility 0.51)

### 10b-39: 20... Nd4 — mistake (32% → 5%)

- Engine best: **Ng8**; line: 20...Ng8 21. Rxf7 Qxf7 22. Rf1 Qd7 23. Bg5 Kg7 24. Qf2 h6 25. Be3
- Others: Nd8 (19%), Nh5 (15%)
- After Nd4: 21. Ref1 Rg8 22. Rxf6 Rxf6 23. Rxf6 g5 24. Bxg5 Qg7 25. Bh4 Rf8
- **Lesson:** material / safety / consequence, gap 491cp, pending

```
On move 20 you played Nd4. Ng8 was better.

  What you played:  20...Nd4 21. Ref1 Qe6 22. Qg5 Raf8 23. Bxf8 Rxf8 24. Nd5
  What was better:  20...Ng8 21. Rxf7 Qxf7 22. Rf1 Qd7 23. Bg5 Kg7 24. Qf2

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 10b-53: 27... Ne6 — blunder (65% → 2%)

- Engine best: **Nf5**; line: 27...Nf5 28. Be3 Kg8 29. Kh2 h5 30. Bd2 e4 31. dxe4 Qxe4 32. Bf4
- Others: Nf3+ (10%), Ne2+ (8%)
- After Ne6: 28. Qf6+ Kg8 29. Qe7 Qxg2+ 30. Kxg2 Nf4+ 31. Kh2 Ne6 32. Qxe6+ Kh8
- **Lesson:** material / safety / consequence, gap 928cp, pending

```
On move 27 you played Ne6. Nf5 was better.

  What you played:  27...Ne6 28. Qf7 Qd4+ 29. Kh2 Qf2 30. Qxf2 Nf4 31. Bxf4
  What was better:  27...Nf5 28. Bg5 h6 29. Bd2 Kg7 30. b4 b6 31. bxc5

The difference is material. Before your move: material balance +1.
After your line: material balance -9. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

