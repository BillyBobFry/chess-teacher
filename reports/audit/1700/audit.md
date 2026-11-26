# Teacher audit on real Lichess games

| Band (Lichess) | Mistakes+blunders (≥20% drop) | …with a lesson | Lessons | Lessons on moves losing <10% | Strategic lessons | Rejected by classical check |
|---|---|---|---|---|---|---|
| 1700 | 17 | 16 | 54 | 22 | 23 | 20 |

## Game 1 (1700), White: Scandinavian Defense

https://lichess.org/game/qxBsAxOH · 1776 vs 1708 · 1-0

### 1w-2: 2. Nc3 — inaccuracy (56% → 46%)

- Engine best: **exd5**; line: 2. exd5 Nf6 3. d4 Nxd5 4. c4 Nf6 5. Nf3 c5 6. Nc3 cxd4
- Others: d3 (50%), e5 (49%)
- After Nc3: 2...d4 3. Nb1 Nf6 4. e5 Nd5 5. c4 Nb4 6. d3 N4c6 7. f4
- **Lesson:** centre / centre / consequence, gap 110cp, pending; check: Space is a main reason (+1.19)

```
On move 2 you played Nc3. exd5 was better.

  What you played:  2. Nc3 d4 3. Nce2 e5 4. Ng3 Nf6 5. Bc4 Bg4
  What was better:  2. exd5 Qxd5 3. Nc3 Qa5 4. d4 c6 5. Bc4 Nf6

The difference is control of the centre. Before your move: centre control 3 vs 4.
After your line: centre control 5 vs 9. After the better line: centre control 7 vs 5.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 1w-24: 13. Be3 — ok (68% → 66%)

- Engine best: **Kh1**; line: 13. Kh1 Bd6 14. Qb3 b6 15. Qa4 Ne7 16. d4 Ng6 17. Bd2 b5
- Others: b4 (68%), a4 (67%)
- After Be3: 13...Bxe3 14. fxe3 Qe6 15. d4 Ne7 16. Qb3 Qxb3 17. axb3 a5 18. Kf2
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.08

### 1w-26: 14. Qe2 — ok (69% → 67%)

- Engine best: **Bxb6**; line: 14. Bxb6 axb6 15. f4 exf4 16. Nh5 Qe7 17. Nxf4 b5 18. a3 Ne5
- Others: Qe2 (66%), Qc2 (65%)
- After Qe2: 14...Ne7 15. Rad1 Rad8 16. h3 Bxe3 17. Qxe3 Qb6 18. Qxb6 axb6 19. f4
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only -0.06

### 1w-28: 15. Rad1 — ok (71% → 67%)

- Engine best: **Bxb6**; line: 15. Bxb6 axb6 16. f4 Qd6 17. Rad1 exf4 18. Nf5 Qe6 19. Rxf4 Ne7
- Others: Rad1 (66%), a3 (66%)
- After Rad1: 15...Ne7 16. Rd2 Qe6 17. a3 Rd7 18. Rfd1 c5 19. h3 Rfd8 20. Qg4
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only -0.14

### 1w-30: 16. Nf5 — ok (76% → 71%)

- Engine best: **Bxb6**; line: 16. Bxb6 axb6 17. f4 exf4 18. d4 Rdd8 19. Nh5 Qh6 20. Nxf4 Ne7
- Others: f4 (74%), Nf5 (70%)
- After Nf5: 16...Rd7 17. Qg4 Bxe3 18. fxe3 Rfd8 19. d4 h6 20. Qf3 Qg5 21. h4
- *Rejected lesson:* their_pawns / target_weaknesses; Threats (+0.52) dwarfs Pawns (+0.16)

### 1w-34: 18. Ng3 — mistake (88% → 67%)

- Engine best: **Bh6**; line: 18. Bh6 Ra8 19. Kh1 Qd8 20. f4 Qd7 21. Ng3 Be3 22. f5 Bxh6
- Others: Qg3 (79%), Bxb6 (78%)
- After Ng3: 18...Bxe3 19. fxe3 Qg7 20. d4 Nb8 21. Nh1 h5 22. Qe2 Qh6 23. c4
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only -0.01

### 1w-52: 27. h4 — ok (91% → 82%)

- Engine best: **e5**; line: 27. e5 f5 28. Ne2 Re8 29. Ng1 Qh6 30. Nf3 Ne4 31. Nd2 Nf6
- Others: d5 (90%), c4 (90%)
- After h4: 27...Qh6 28. h5 Bxg3 29. Qxg3 Nxe4 30. Qb8+ Kf7 31. Rd3 Re7 32. Kg1
- *No lesson.*

## Game 1 (1700), Black: Scandinavian Defense

https://lichess.org/game/qxBsAxOH · 1776 vs 1708 · 1-0

### 1b-13: 7... Nh5 — inaccuracy (53% → 36%)

- Engine best: **h5**; line: 7...h5 8. h3 Bxf3 9. Bxf3 g6 10. Ne2 a5 11. c3 Nd7 12. O-O
- Others: g6 (53%), Bb4+ (53%)
- After Nh5: 8. Nxd4 Nxg3 9. hxg3 Qxd4 10. Bxg4 Rd8 11. Be2 Bc5 12. O-O Qd6
- **Lesson:** material / safety / consequence, gap 202cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 7 you played Nh5. Bb4+ was better.

  What you played:  7...Nh5 8. Nxd4 Nxd4 9. Bxg4 Nf4 10. O-O g6 11. c3
  What was better:  7...Bb4+ 8. Nd2 Be6 9. a3 Be7 10. Nf5 Bf8 11. O-O

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1b-25: 13... Bb6 — ok (34% → 31%)

- Engine best: **Bxe3**; line: 13...Bxe3 14. fxe3 Qe6 15. d4 Ne7 16. Qb3 Qxb3 17. axb3 a5 18. Kf2
- Others: b6 (34%), Bb6 (29%)
- After Bb6: 14. Bxb6 axb6 15. f4 exf4 16. Nh5 Qe7 17. Nxf4 b5 18. a3 Ne5
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only 0.01

### 1b-29: 15... Rd6 — inaccuracy (33% → 24%)

- Engine best: **Ne7**; line: 15...Ne7 16. Rd2 Qe6 17. a3 Rd7 18. Rfd1 c5 19. h3 Rfd8 20. Qg4
- Others: Rfe8 (31%), Bxe3 (31%)
- After Rd6: 16. Bxb6 axb6 17. f4 exf4 18. d4 Rdd8 19. Nh5 Qh6 20. Nxf4 Ne7
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns gains only -0.03

### 1b-31: 16... Re6 — ok (29% → 28%)

- Engine best: **Rd7**; line: 16...Rd7 17. Qg4 Bxe3 18. fxe3 Rfd8 19. d4 h6 20. Qf3 Qg5 21. h4
- Others: Re6 (28%), Rdd8 (27%)
- After Re6: 17. f4 Ne7 18. Bxb6 axb6 19. fxe5 Qxe5 20. Ng3 Rf6 21. Rfe1 Qb5
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.07

### 1b-33: 17... g6 — inaccuracy (30% → 12%)

- Engine best: **Qg6**; line: 17...Qg6 18. Qh4 Bxe3 19. fxe3 Qf6 20. Qxf6 Rxf6 21. d4 Kh8 22. Nh4
- Others: Bxe3 (29%), Rfe8 (28%)
- After g6: 18. Bh6 Ra8 19. Kh1 Qd8 20. f4 Qd7 21. Ng3 Be3 22. f5 Bxh6
- *No lesson.*

### 1b-35: 18... Rd8 — mistake (33% → 9%)

- Engine best: **Bxe3**; line: 18...Bxe3 19. fxe3 Qg7 20. d4 Nb8 21. Nh1 h5 22. Qe2 Qh6 23. c4
- Others: Qg7 (28%), Kh8 (26%)
- After Rd8: 19. Bg5 Qg7 20. Bxd8 Nxd8 21. Ne2 h5 22. Qg3 c6 23. Kh1 g5
- **Lesson:** material / safety / consequence, gap 388cp, pending

```
On move 18 you played Rd8. Bxe3 was better.

  What you played:  18...Rd8 19. Bg5 Qg7 20. Bxd8 Nxd8 21. Kh1 h5
  What was better:  18...Bxe3 19. fxe3 Qg7 20. d4 Nb8 21. h3 h5

The difference is material. Before your move: material balance -1.
After your line: material balance -3. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 1b-55: 28... Rxe4 — ok (16% → 8%)

- Engine best: **Bxg3**; line: 28...Bxg3 29. Qxg3 Nxe4 30. Qb8+ Kf7 31. Rd3 gxh5 32. Qxb7+ Re7 33. Qb3+
- Others: Nxe4 (16%), Re7 (13%)
- After Rxe4: 29. Nxe4 Qxh5+ 30. Kg1 Qh2+ 31. Kf2 Qf4+ 32. Ke2 Qxe4+ 33. Qxe4 Nxe4
- **Lesson:** material / hanging / consequence, gap 245cp, triggered after 2 plies
- Trigger: Since that move you've lost a rook and taken a pawn: overall you're 4 pawns down.

```
On move 28 you played Rxe4. Bxg3 was better.

  What you played:  28...Rxe4 29. Nxe4 Qxh5+ 30. Kg1 Qh2+ 31. Kf2 Qf4+ 32. Ke2
  What was better:  28...Bxg3 29. Qxg3 Nxe4 30. Qb8+ Kf7 31. Rd3 Nd2 32. Ra1

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -1.
Your move left this undefended: pawn on f6, the piece you moved, now on e4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 2 (1700), White: Sicilian Defense: Pin Variation, Koch Variation

https://lichess.org/game/KZJOF5tw · 1750 vs 1738 · 1-0

### 2w-6: 4. Nc3 — ok (63% → 55%)

- Engine best: **e5**; line: 4. e5 Nd5 5. c4 Ne7 6. dxc5 Ng6 7. b4 Nc6 8. h4 h5
- Others: Nc3 (56%), Bd3 (53%)
- After Nc3: 4...cxd4 5. Nxd4 Nc6 6. Nxc6 bxc6 7. e5 Nd5 8. Ne4 Bb7 9. c4
- **Lesson:** centre / centre / consequence, gap 105cp, pending; check: Mobility is a main reason (+0.53)

```
On move 4 you played Nc3. e5 was better.

  What you played:  4. Nc3 cxd4 5. Nxd4 Nc6 6. Bf4 a6 7. e5 Qc7
  What was better:  4. e5 Nd5 5. c4 Nc7 6. Bg5 Be7 7. Bxe7 Qxe7

The difference is control of the centre. Before your move: centre control 9 vs 4.
After your line: centre control 7 vs 6. After the better line: centre control 9 vs 3.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 2w-14: 8. Ba3 — ok (74% → 68%)

- Engine best: **Qg4**; line: 8. Qg4 Kf8 9. Bd3 Nc6 10. Nxc6 dxc6 11. O-O Qc7 12. c4 Ne7
- Others: Bd3 (70%), Nb5 (69%)
- After Ba3: 8...Nxc3 9. Qd2 Ne4 10. Qb4 a5 11. Qb2 d6 12. exd6 Qg5 13. Rd1
- **Lesson:** material / hanging / consequence, gap 71cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 8 you played Ba3. Qg4 was better.

  What you played:  8. Ba3 Nxc3 9. Qd2 Ne4 10. Qb4 a5 11. Qb2 b6
  What was better:  8. Qg4 Kf8 9. Qg3 h5 10. h4 Qa5 11. Bb2 Nc6

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: pawn on c3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 2w-18: 10. Bc4 — mistake (95% → 67%)

- Engine best: **Nb5**; line: 10. Nb5 Qh4 11. Nd6+ Kd8 12. Nxf7+ Ke8 13. Nd6+ Kd8 14. c4 Qf4
- Others: O-O-O (80%), Be2 (79%)
- After Bc4: 10...Qc7 11. Bxd5 Qxe5+ 12. Qe3 Qxe3+ 13. fxe3 exd5 14. Nf5 Kd8 15. O-O
- **Lesson:** material / safety / consequence, gap 441cp, pending

```
On move 10 you played Bc4. Nb5 was better.

  What you played:  10. Bc4 Qc7 11. Bxd5 Qxe5+ 12. Qe3 Qxe3+ 13. fxe3 exd5
  What was better:  10. Nb5 Ne7 11. Nd6+ Kf8 12. O-O-O Kg8 13. Qf4 Qf8

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 2 (1700), Black: Sicilian Defense: Pin Variation, Koch Variation

https://lichess.org/game/KZJOF5tw · 1750 vs 1738 · 1-0

### 2b-5: 3... Nf6 — ok (46% → 37%)

- Engine best: **cxd4**; line: 3...cxd4 4. Nxd4 a6 5. c4 Nf6 6. Nc3 Bb4 7. f3 O-O 8. Qb3
- Others: a6 (43%), d5 (40%)
- After Nf6: 4. e5 Nd5 5. c4 Ne7 6. dxc5 Ng6 7. b4 Nc6 8. h4 h5
- **Lesson:** centre / centre / missed_chance, gap 107cp, pending; check: Space is a main reason (+0.48)

```
On move 3 you played Nf6. cxd4 was better.

  What you played:  3...Nf6 4. e5 Nd5 5. c4 Ne7 6. d5 d6 7. Nc3
  What was better:  3...cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. a3 d6 7. Be3

Your move wasn't a disaster, but cxd4 would have improved control of the centre.
After the better line: centre control 6 vs 8. After yours: centre control 4 vs 11.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 2b-11: 6... Bxc3+ — inaccuracy (42% → 27%)

- Engine best: **Nd5**; line: 6...Nd5 7. Qg4 Kf8 8. Bd2 h5 9. Qe4 d6 10. Rd1 dxe5 11. Nf3
- Others: Bxc3+ (27%), Ne4 (26%)
- After Bxc3+: 7. bxc3 Nd5 8. Qg4 Kf8 9. Bd3 Nc6 10. Nxc6 dxc6 11. O-O c5
- **Lesson:** material / hanging / missed_chance, gap 146cp, pending

```
On move 6 you played Bxc3+. Nd5 was better.

  What you played:  6...Bxc3+ 7. bxc3 Nd5 8. Qg4 Kf8 9. Qg3 Nc6 10. Nb5
  What was better:  6...Nd5 7. Qg4 Kf8 8. Bd3 h5 9. Qe4 Bxc3+ 10. bxc3

Your move wasn't a disaster, but Nd5 would have improved material.
After the better line: material balance +1. After yours: material balance +0.
Your move left this undefended: knight on f6, the piece you moved, now on c3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 2b-17: 9... Nd5 — mistake (30% → 5%)

- Engine best: **Ne4**; line: 9...Ne4 10. Qb4 d6 11. Nb3 f5 12. f3 Nc6 13. Bb5 a5 14. Bxc6+
- Others: Qc7 (8%), Qa5 (7%)
- After Nd5: 10. Nb5 Qh4 11. Nd6+ Kd8 12. Nxf7+ Ke8 13. Nd6+ Kd8 14. c4 Qf4
- **Lesson:** material / safety / consequence, gap 481cp, pending

```
On move 9 you played Nd5. Ne4 was better.

  What you played:  9...Nd5 10. Nb5 Nc6 11. Nd6+ Kf8 12. Nxb7+ Ke8 13. Nd6+
  What was better:  9...Ne4 10. Qb4 a5 11. Qb3 Qc7 12. O-O-O Qc3 13. Nb5

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 2b-19: 10... Nb6 — mistake (33% → 11%)

- Engine best: **Qc7**; line: 10...Qc7 11. Bxd5 Qxe5+ 12. Qe3 Qxe3+ 13. fxe3 exd5 14. Nf5 Kd8 15. O-O
- Others: Ne7 (24%), Nc7 (23%)
- After Nb6: 11. Bb3 d6 12. Bxd6 Bd7 13. O-O Nc8 14. Ba3 Nc6 15. Rad1 N8e7
- **Lesson:** material / forcing_moves / missed_chance, gap 223cp, pending

```
On move 10 you played Nb6. Qc7 was better.

  What you played:  10...Nb6 11. Bd3 a6 12. Rb1 Nc6 13. Nxc6 bxc6 14. O-O
  What was better:  10...Qc7 11. Bxd5 Qxe5+ 12. Qe3 Qxe3+ 13. fxe3 exd5 14. Nf5

Your move wasn't a disaster, but Qc7 would have improved material.
After the better line: material balance +2. After yours: material balance +1.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

## Game 3 (1700), White: Ruy Lopez: Steinitz Defense

https://lichess.org/game/toyH7NOY · 1625 vs 1729 · 1-0

### 3w-6: 4. Bxc6+ — ok (58% → 54%)

- Engine best: **Nc3**; line: 4. Nc3 Bd7 5. d4 exd4 6. Nxd4 Nf6 7. O-O Be7 8. Nxc6 Bxc6
- Others: d4 (58%), O-O (56%)
- After Bxc6+: 4...bxc6 5. d4 exd4 6. Qxd4 Nf6 7. Nc3 Be7 8. Bg5 h6 9. Bh4
- *Rejected lesson:* king_safety / king_safety; King safety gains only -0.72

### 3w-14: 8. Nxe5 — blunder (57% → 2%)

- Engine best: **Be3**; line: 8. Be3 Nf6 9. Nbd2 Nd7 10. h3 Bh5 11. Nc4 f6 12. Nfd2 Bc5
- Others: h3 (56%), Nc3 (56%)
- After Nxe5: 8...Rd1#
- **Lesson:** mate / safety / consequence, gap 10067cp, pending

```
On move 8 you played Nxe5. Be3 was better.

  What you played:  8. Nxe5 Rd1#
  What was better:  8. Be3 Nf6

After your move, your opponent had a forced checkmate.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 3w-30: 16. Bf4 — inaccuracy (85% → 74%)

- Engine best: **Be3**; line: 16. Be3 Kf7 17. Ne2 Bxd3 18. cxd3 Rb8 19. Nd4 Bc5 20. Rab1 a5
- Others: Ne2 (83%), a3 (83%)
- After Bf4: 16...Bxd3 17. Bxd6 Bxc2 18. Rd2 cxd6 19. Rxc2 Kd7 20. Rd1 Rb8 21. Kf2
- **Lesson:** material / safety / consequence, gap 187cp, pending

```
On move 16 you played Bf4. Be3 was better.

  What you played:  16. Bf4 Bxd3 17. Bxd6 Bxc2 18. Rdc1 cxd6 19. Rxc2
  What was better:  16. Be3 Kf7 17. Ne2 Bxd3 18. cxd3 Rb8 19. b3

The difference is material. Before your move: material balance +2.
After your line: material balance +1. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 3w-38: 20. Nbd5 — inaccuracy (86% → 72%)

- Engine best: **Na4**; line: 20. Na4 Rb5 21. Na2 Bxa2 22. Rxa2 f5 23. Rxd6 fxe4 24. fxe4 Re5
- Others: Nd3 (80%), Nbd5 (70%)
- After Nbd5: 20...Bxd5 21. Nxd5 Nxd5 22. Rxd5 Rxb2 23. Rc1 a4 24. Ra5 Rc8 25. Rxa4
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: Threats 0.36, Rooks 0.27)

### 3w-40: 21. Nxd5 — ok (78% → 74%)

- Engine best: **Na4**; line: 21. Na4 Rb7 22. exd5 Bb5 23. Nc3 f5 24. Rd2 Bd7 25. Rb1 Rc8
- Others: Nxd5 (72%), exd5 (64%)
- After Nxd5: 21...Bxd5 22. Rxd5 Rxb2 23. Rc1 a4 24. Ra5 Rc8 25. Rxa4 Rbxc2 26. Rxc2
- **Lesson:** material / safety / missed_chance, gap 76cp, pending

```
On move 21 you played Nxd5. Na4 was better.

  What you played:  21. Nxd5 Bxd5 22. Rxd5 Rxb2 23. Rc1 a4 24. Ra5 Rc8
  What was better:  21. Na4 Rbb8 22. exd5 Bb5 23. Nc3 Bd7 24. Ne4 Rfc8

Your move wasn't a disaster, but Na4 would have improved material.
After the better line: material balance +2. After yours: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 3 (1700), Black: Ruy Lopez: Steinitz Defense

https://lichess.org/game/toyH7NOY · 1625 vs 1729 · 1-0

### 3b-9: 5... Bg4 — ok (47% → 43%)

- Engine best: **Nf6**; line: 5...Nf6 6. Nc3 Nd7 7. Be3 a5 8. Qd2 f6 9. b3 Be7 10. d5
- Others: exd4 (46%), f6 (45%)
- After Bg4: 6. dxe5 dxe5 7. Qxd8+ Rxd8 8. Be3 a5 9. h3 Bxf3 10. gxf3 f5
- *Rejected lesson:* own_pawns / pawn_weaknesses; Pawns isn't a main reason (top: Threats 0.32, Bishops 0.23)

### 3b-15: 8... Be6 — blunder (98% → 17%)

- Engine best: **Rd1#**; line: 8...Rd1#
- Others: h5 (21%), Bd1 (20%)
- After Be6: 9. Nxc6 Rd6 10. Ne5 Ne7 11. Be3 Nc6 12. Nd3 Nd4 13. Bxd4 Rxd4
- **Lesson:** material / safety / consequence, gap 10405cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 8 you played Be6. Rd1# was better.

  What you played:  8...Be6
  What was better:  8...Rd1#

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 3b-23: 12... a6 — ok (12% → 12%)

- Engine best: **a5**; line: 12...a5 13. Be3 Bb4 14. Bd2 Kf7 15. a3 Bd6 16. O-O-O Bc4 17. Bf4
- Others: Ne7 (12%), f5 (12%)
- After a6: 13. Ne2 Bc8 14. Be3 Rc4 15. Nc3 Ne7 16. O-O-O h5 17. h4 Ng6
- **Lesson:** open_files / open_files / consequence, gap 87cp, pending; check: Rooks is a main reason (+0.25)

```
On move 12 you played a6. f5 was better.

  What you played:  12...a6 13. Be3 Nh6 14. O-O-O Nf7 15. f4 Bg4
  What was better:  12...f5 13. exf5 Bxf5 14. Be3 Ba3 15. Nb5 Bxd3

The difference is rooks on open files. Before your move: your rooks on open files: none; theirs: none.
After your line: your rooks on open files: none; theirs: d1. After the better line: your rooks on open files: none; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### 3b-31: 16... O-O — inaccuracy (26% → 12%)

- Engine best: **Bxd3**; line: 16...Bxd3 17. Bxd6 Bxc2 18. Rd2 cxd6 19. Rxc2 Kd7 20. Rd1 Rb8 21. Kf2
- Others: O-O (14%), Bxf4 (11%)
- After O-O: 17. Bxd6 cxd6 18. Nc1 f5 19. Rd2 Bf7 20. Nb3 fxe4 21. Nxe4 Nf5
- **Lesson:** material / free_material / missed_chance, gap 218cp, pending

```
On move 16 you played O-O. Bxd3 was better.

  What you played:  16...O-O 17. Bxd6 cxd6 18. Nc1 f5 19. Nb3 fxe4 20. fxe4
  What was better:  16...Bxd3 17. Bxd6 Bxc2 18. Rdc1 cxd6 19. Rxc2 Kd7 20. Rd2

Your move wasn't a disaster, but Bxd3 would have improved material.
After the better line: material balance -1. After yours: material balance -2.

Principle: Take free material. When your opponent leaves a piece or pawn you can win, take it. Before every move, look at everything you can capture.
```

### 3b-35: 18... Rb6 — ok (19% → 14%)

- Engine best: **Rc7**; line: 18...Rc7 19. Nd3 Rb8 20. Rd2 a5 21. Kf2 h5 22. Rc1 Ba6 23. Ne2
- Others: Rb6 (14%), Rc5 (10%)
- After Rb6: 19. a3 a5 20. Na4 Rbb8 21. Na2 Bxa2 22. Rxa2 Rfc8 23. b3 Rc6
- **Lesson:** own_pawns / pawn_weaknesses / missed_chance, gap 39cp, pending; check: Pawns is a main reason (+0.19)

```
On move 18 you played Rb6. Rc7 was better.

  What you played:  18...Rb6 19. a3 Rc8 20. Na4 Rbb8 21. Rd2 a5 22. Na2
  What was better:  18...Rc7 19. Nd3 Rb8 20. Rd2 d5 21. Re1 dxe4 22. Rxe4

Your move wasn't a disaster, but Rc7 would have improved your pawn structure.
After the better line: isolated pawn(s) on a6. After yours: isolated pawn(s) on a5, d6.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

### 3b-39: 20... Nxd5 — ok (28% → 22%)

- Engine best: **Bxd5**; line: 20...Bxd5 21. Nxd5 Nxd5 22. Rxd5 Rxb2 23. Rc1 a4 24. Ra5 Rc8 25. Rxa4
- Others: Nxd5 (22%), Rb7 (8%)
- After Nxd5: 21. Na4 Rb7 22. exd5 Bb5 23. Nc3 f5 24. Rd2 Bd7 25. Rb1 Rc8
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns isn't a main reason (top: Threats 0.83, Bishops 0.23)

### 3b-41: 21... Rxb2 — inaccuracy (26% → 11%)

- Engine best: **Bxd5**; line: 21...Bxd5 22. Rxd5 Rxb2 23. Rc1 a4 24. Ra5 Rc8 25. Rxa4 Rbxc2 26. Rxc2
- Others: Rxb2 (11%), Ra6 (9%)
- After Rxb2: 22. Ne3 Bf7 23. Rxd6 Ra8 24. Rad1 Be8 25. Kf2 Rbb8 26. h4 Kf8
- **Lesson:** material / safety / consequence, gap 257cp, pending

```
On move 21 you played Rxb2. Bxd5 was better.

  What you played:  21...Rxb2 22. Ne3 Ba2 23. Rxd6 Bb1 24. Rc6 Rd8 25. h4
  What was better:  21...Bxd5 22. Rxd5 Rxb2 23. Rc1 a4 24. Ra5 Rc8 25. Rxa4

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 3b-43: 22... Be2 — ok (11% → 8%)

- Engine best: **Bf7**; line: 22...Bf7 23. Rxd6 Ra8 24. Rad1 Be8 25. h4 Kf8 26. R6d5 a4
- Others: Be6 (11%), Rc8 (11%)
- After Be2: 23. Rxd6 Rb7 24. Kf2 Bb5 25. Rb1 Rfb8 26. c4 Be8 27. Rxb7 Rxb7
- **Lesson:** material / safety / consequence, gap 154cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 22 you played Be2. Ba2 was better.

  What you played:  22...Be2 23. Rd2 Ba6 24. Rxd6 Bc8 25. Rad1
  What was better:  22...Ba2 23. Rxd6 Bb1 24. h4 Bxc2 25. Rd2

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 4 (1700), White: French Defense: Exchange Variation

https://lichess.org/game/3TXQApvr · 1602 vs 1626 · 1-0

### 4w-20: 11. Qd3 — blunder (52% → 8%)

- Engine best: **Nxd5**; line: 11. Nxd5 Qd6 12. Ne3 Nd7 13. O-O-O Ndf6 14. Qe1 Be6 15. Kb1 Nd5
- Others: Nxe4 (46%), O-O-O (34%)
- After Qd3: 11...Nxc3+ 12. Qe3 Ne4 13. O-O-O Nc6 14. g4 Qd6 15. Rg1 Bd7 16. Bd3
- **Lesson:** material / safety / consequence, gap 826cp, triggered after 2 plies
- Trigger: You've lost a knight: you're 3 pawns worse off than before. And more is about to fall.

```
On move 11 you played Qd3. Nxd5 was better.

  What you played:  11. Qd3 Nxc3+ 12. Ne5 Ne4 13. Qe3 f6 14. Ng6 Qb4+
  What was better:  11. Nxd5 Qd6 12. Ne3 Qb4+ 13. c3 Nxc3 14. Qd2 Nd5

The difference is material. Before your move: material balance +1.
After your line: material balance -3. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 4 (1700), Black: French Defense: Exchange Variation

https://lichess.org/game/3TXQApvr · 1602 vs 1626 · 1-0

### 4b-77: 39... Rxb2 — blunder (98% → 2%)

- Engine best: **Rc3+**; line: 39...Rc3+ 40. Ka2 Re8 41. g5 hxg5 42. h6 d4 43. hxg7 d3 44. Rb4
- Others: Re8 (98%), Rc8 (98%)
- After Rxb2: 40. Ra8+ Rb8 41. Rxb8#
- **Lesson:** mate / safety / consequence, gap 10987cp, pending

```
On move 39 you played Rxb2. Rc3+ was better.

  What you played:  39...Rxb2 40. Ra8+ Rb8 41. Rxb8#
  What was better:  39...Rc3+ 40. Ka2 Rf8 41. Rbb7

After your move, your opponent had a forced checkmate.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 5 (1700), White: Queen's Pawn Game: Accelerated London System

https://lichess.org/game/TSBT2z0Y · 1634 vs 1747 · 0-1

### 5w-28: 15. Qf3 — mistake (50% → 27%)

- Engine best: **Bxg5**; line: 15. Bxg5 Nxg5 16. Qg2 Qc7 17. h4 d4 18. hxg5 Bxg2 19. Bxh7+ Kh8
- Others: Bxe4 (46%), Be3 (45%)
- After Qf3: 15...Nc5 16. Bb1 d4 17. Ne4 f5 18. gxf5 Bxf4+ 19. Qxf4 Rxf5 20. Qg4
- **Lesson:** material / forcing_moves / missed_chance, gap 223cp, pending

```
On move 15 you played Qf3. Bxg5 was better.

  What you played:  15. Qf3 Nc5 16. Bb1 d4 17. Ne4 Nxe4 18. Bxe4 Bxe4
  What was better:  15. Bxg5 Nxg5 16. Qg2 Qc7 17. h4 d4 18. f3 Nxf3

Your move wasn't a disaster, but Bxg5 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 5w-30: 16. gxf5 — mistake (36% → 10%)

- Engine best: **Rhg1**; line: 16. Rhg1 fxg4 17. Rxg4 Bxf4 18. Rxf4 Qg5 19. Rxf8+ Rxf8 20. Qh3 Qxe5
- Others: Bxg5 (23%), Bxe4 (20%)
- After gxf5: 16...Rxf5 17. Bxg5 Qxg5 18. Qe2 Rxf2 19. Qe1 Raf8 20. h4 Qf4 21. Rh3
- **Lesson:** material / hanging / consequence, gap 384cp, pending

```
On move 16 you played gxf5. Rhg1 was better.

  What you played:  16. gxf5 Rxf5 17. Bxg5 Qxg5 18. Qe3 Nxf2 19. Qe2 Rf4
  What was better:  16. Rhg1 fxg4 17. Rxg4 Bxf4 18. Rxf4 Qg5 19. Rxf8+ Rxf8

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: the piece you moved, now on f5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 5 (1700), Black: Queen's Pawn Game: Accelerated London System

https://lichess.org/game/TSBT2z0Y · 1634 vs 1747 · 0-1

### 5b-13: 7... Bb7 — ok (46% → 43%)

- Engine best: **Ba6**; line: 7...Ba6 8. Bxa6 Nxa6 9. Qe2 Nb4 10. O-O Qe8 11. a3 Nc6 12. c4
- Others: Qe8 (44%), c5 (44%)
- After Bb7: 8. c3 Nbd7 9. Qf3 Nxe5 10. dxe5 Ne4 11. Qh3 h6 12. Rd1 Qe8
- *Rejected lesson:* mobility / activity; Mobility gains only -0.21

### 5b-29: 15... f5 — ok (73% → 64%)

- Engine best: **Nc5**; line: 15...Nc5 16. Bb1 d4 17. Ne4 f5 18. gxf5 Bxf4+ 19. Qxf4 Rxf5 20. Qg4
- Others: f5 (60%), Nxd2 (56%)
- After f5: 16. Rhg1 fxg4 17. Rxg4 Bxf4 18. Rxf4 Qg5 19. Rxf8+ Rxf8 20. Qh3 Qxe5
- **Lesson:** king_safety / king_safety / consequence, gap 100cp, pending; check: King safety is a main reason (+0.41)

```
On move 15 you played f5. Nc5 was better.

  What you played:  15...f5 16. Rhg1 fxg4 17. Rxg4 Bxf4 18. Rxf4 Qg5 19. Rxf8+
  What was better:  15...Nc5 16. Bb1 d4 17. Ne4 Nxe4 18. Bxe4 Bxe4 19. Qxe4

The difference is king safety. Before your move: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.
After your line: 2 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it. After the better line: 3 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

## Game 6 (1700), White: Scandinavian Defense: Valencian Variation

https://lichess.org/game/8rsSeK7T · 1606 vs 1622 · 0-1

### 6w-20: 11. Qf3 — inaccuracy (77% → 62%)

- Engine best: **Qh5**; line: 11. Qh5 g6 12. Qh6 Nc6 13. Rae1 Nxe5 14. dxe5 c6 15. Bd6 Ne7
- Others: Bd3 (67%), Qf3 (63%)
- After Qf3: 11...f6 12. Ng4 Nc6 13. Rfe1 Bd7 14. Bf1 f5 15. Ne3 Nb6 16. Rad1
- *No lesson.*

### 6w-22: 12. Qxf6 — mistake (75% → 55%)

- Engine best: **Qh3**; line: 12. Qh3 Nf4 13. Qg3 Nh5 14. Qg4 Nf4 15. Rae1 Nd7 16. g3 Ng6
- Others: Qg3 (67%), Qh5 (60%)
- After Qxf6: 12...Nxf6 13. Rae1 Nbd7 14. f4 a6 15. Be2 Nd5 16. Rf3 b5 17. c4
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 165cp, pending; check: Pawns is a main reason (+0.23)

```
On move 12 you played Qxf6. Qg3 was better.

  What you played:  12. Qxf6 Nxf6 13. Rfe1 Nfd7 14. f4 Nxe5 15. fxe5 b6
  What was better:  12. Qg3 Qf4 13. Qh3 Qh6 14. Qxh6 gxh6 15. Rfe1 Nd7

Your move wasn't a disaster, but Qg3 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on h6, h7; doubled pawns on the h-file. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 6w-26: 14. Rf3 — ok (53% → 48%)

- Engine best: **Bd3**; line: 14. Bd3 Nxc3 15. Rf3 a5 16. Bb2 Nd5 17. c4 Ne7 18. Rg3 Nd7
- Others: Bb5 (52%), Rfe1 (52%)
- After Rf3: 14...Nd2 15. Re3 Nxc4 16. Nxc4 Nd7 17. Rae1 Nb6 18. Nd2 Nd5 19. Rf3
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 49cp, pending; check: Pawns is a main reason (+0.25)

```
On move 14 you played Rf3. Bd3 was better.

  What you played:  14. Rf3 Nd2 15. Re3 Nxc4 16. Nxc4 Nd7 17. Nd2 Nb6
  What was better:  14. Bd3 Nxc3 15. Rf3 f6 16. Rh3 f5 17. g4 Nd5

Your move wasn't a disaster, but Bd3 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: backward pawn(s) on e6. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 6w-28: 15. Bxe6 — blunder (48% → 5%)

- Engine best: **Rd3**; line: 15. Rd3 Nxc4 16. Nxc4 b6 17. Ne3 Nd7 18. c4 Bb7 19. Bb2 h5
- Others: Re3 (48%), Rg3 (47%)
- After Bxe6: 15...Nxf3+ 16. gxf3 Bxe6 17. Kf2 f6 18. Nd3 Nd7 19. h4 Nb6 20. Rg1
- **Lesson:** material / hanging / consequence, gap 682cp, triggered after 2 plies
- Trigger: Since that move you've lost a rook and taken a pawn: overall you're 4 pawns down.

```
On move 15 you played Bxe6. Re3 was better.

  What you played:  15. Bxe6 Nxf3+ 16. Nxf3 Bxe6 17. Re1 Nd7 18. Ng5 h6
  What was better:  15. Re3 Nxc4 16. Nxc4 Nd7 17. Nd2 b5 18. c4 a6

The difference is material. Before your move: material balance +0.
After your line: material balance -4. After the better line: material balance +0.
Your move left this undefended: rook on f3, the piece you moved, now on e6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 6 (1700), Black: Scandinavian Defense: Valencian Variation

https://lichess.org/game/8rsSeK7T · 1606 vs 1622 · 0-1

### 6b-19: 10... Nd5 — inaccuracy (40% → 23%)

- Engine best: **c5**; line: 10...c5 11. Qf3 Nbd7 12. Rfe1 Qc7 13. Rad1 a6 14. Bf1 b5 15. Qxa8
- Others: a6 (36%), Bd7 (36%)
- After Nd5: 11. Qh5 g6 12. Qh6 Nc6 13. Rae1 Nxe5 14. dxe5 c6 15. Bd6 Ne7
- **Lesson:** king_safety / king_safety / consequence, gap 124cp, pending; check: King safety is a main reason (+1.56)

```
On move 10 you played Nd5. c5 was better.

  What you played:  10...Nd5 11. Qh5 g6 12. Qf3 f6 13. Ng4 Kg7 14. Rfe1
  What was better:  10...c5 11. Re1 Qc7 12. Qf3 cxd4 13. cxd4 Nc6 14. Rad1

The difference is king safety. Before your move: 3 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it.
After your line: 2 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it. After the better line: 3 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

### 6b-21: 11... Qf6 — inaccuracy (38% → 25%)

- Engine best: **f6**; line: 11...f6 12. Ng4 Nc6 13. Rfe1 Bd7 14. Bf1 f5 15. Ne3 Nb6 16. Rad1
- Others: Qf6 (28%), f5 (23%)
- After Qf6: 12. Qh3 Nf4 13. Qg3 Nh5 14. Qg4 Nf4 15. Rae1 Nd7 16. g3 Ng6
- *Rejected lesson:* development / develop; Mobility is a main reason (+0.69)

## Game 7 (1700), White: Ruy Lopez: Schliemann Defense

https://lichess.org/game/VQeFGnsc · 1688 vs 1722 · 1-0

### 7w-8: 5. O-O — ok (69% → 62%)

- Engine best: **Bxc6**; line: 5. Bxc6 bxc6 6. Nxe5 Qf6 7. d4 Ne7 8. Nc3 h5 9. Qf3 d6
- Others: d4 (68%), Nc3 (65%)
- After O-O: 5...Nge7 6. d4 Ng6 7. dxe5 a6 8. Bc4 d6 9. Qd5 Ncxe5 10. Nxe5
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 46cp, pending; check: Pawns is a main reason (+0.51)

```
On move 5 you played O-O. d4 was better.

  What you played:  5. O-O Nge7 6. d4 Ng6 7. dxe5 Be7 8. Bc4 d6
  What was better:  5. d4 Qf6 6. Nc3 Bb4 7. Bxc6 bxc6 8. Nxe5 Ba6

Your move wasn't a disaster, but d4 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on a7; doubled pawns on the c-file. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 7w-10: 6. Bxc6 — inaccuracy (68% → 52%)

- Engine best: **Nc3**; line: 6. Nc3 Nge7 7. Re1 Kd8 8. Bxc6 bxc6 9. d4 Ng6 10. Ne2 Bd6
- Others: d4 (64%), Re1 (63%)
- After Bxc6: 6...dxc6 7. d4 exd4 8. e5 Qg6 9. Qxd4 Bg4 10. Qxf4 Nh6 11. Nc3
- *Rejected lesson:* development / develop; King safety (+2.42) dwarfs Mobility/Knights/Bishops (+0.26)

### 7w-12: 7. Nc3 — inaccuracy (58% → 41%)

- Engine best: **d4**; line: 7. d4 d6 8. b3 exd4 9. Re1 Bg4 10. Nbd2 Ne7 11. Bb2 Ng6
- Others: b3 (55%), Nbd2 (55%)
- After Nc3: 7...g5 8. d4 d6 9. Qd3 g4 10. Ne1 Ne7 11. dxe5 dxe5 12. b4
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 177cp, pending; check: Pawns is a main reason (+0.54)

```
On move 7 you played Nc3. d4 was better.

  What you played:  7. Nc3 g5 8. d4 d6 9. Ne1 h5 10. b4 Ne7
  What was better:  7. d4 d6 8. Qe1 g5 9. dxe5 dxe5 10. Qc3 Bg7

Your move wasn't a disaster, but d4 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on c6, a7, c7; doubled pawns on the c-file. After yours: opponent's pawns: isolated pawn(s) on a7; doubled pawns on the c-file.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 7w-14: 8. Bd2 — ok (59% → 51%)

- Engine best: **Ne2**; line: 8. Ne2 Bf8 9. d4 d6 10. Qd3 Ne7 11. b3 Ng6 12. Qc4 Bb7
- Others: d4 (55%), Na4 (52%)
- After Bd2: 8...Be7 9. d4 d6 10. b4 g5 11. b5 g4 12. bxc6 gxf3 13. Nd5
- *No lesson.*

### 7w-18: 10. b4 — ok (53% → 47%)

- Engine best: **Nd5**; line: 10. Nd5 cxd5 11. Bxa5 d6 12. c4 c6 13. Rc1 O-O 14. c5 dxc5
- Others: d4 (52%), Re1 (49%)
- After b4: 10...Bb6 11. Ne2 d6 12. a4 a5 13. bxa5 Ba7 14. d4 Ng6 15. Bc3
- **Lesson:** mobility / activity / consequence, gap 81cp, pending; check: Mobility is a main reason (+0.45)

```
On move 10 you played b4. d4 was better.

  What you played:  10. b4 Bb6 11. Ne2 d6 12. a4 a5 13. d4 Bxd4
  What was better:  10. d4 exd4 11. Ne2 Bxd2 12. Qxd2 O-O 13. Nexd4 d6

The difference is piece activity. Before your move: 23 piece moves available vs opponent's 21.
After your line: 23 piece moves available vs opponent's 32. After the better line: 29 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

## Game 7 (1700), Black: Ruy Lopez: Schliemann Defense

https://lichess.org/game/VQeFGnsc · 1688 vs 1722 · 1-0

### 7b-5: 3... f5 — ok (49% → 45%)

- Engine best: **Nf6**; line: 3...Nf6 4. O-O Nxe4 5. Re1 Nd6 6. Nxe5 Be7 7. Bf1 Nxe5 8. Rxe5
- Others: a6 (48%), Nd4 (46%)
- After f5: 4. Nc3 fxe4 5. Nxe4 Nf6 6. Qe2 d5 7. Nxf6+ gxf6 8. O-O Qe7
- **Lesson:** mobility / activity / consequence, gap 40cp, pending; check: Mobility is a main reason (+0.57)

```
On move 3 you played f5. a6 was better.

  What you played:  3...f5 4. d4 fxe4 5. Nxe5 Nxe5 6. dxe5 c6 7. Nc3
  What was better:  3...a6 4. Ba4 Nf6 5. O-O Nxe4 6. d4 b5 7. Bb3

The difference is piece activity. Before your move: 18 piece moves available vs opponent's 17.
After your line: 16 piece moves available vs opponent's 30. After the better line: 27 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 7b-7: 4... f4 — inaccuracy (44% → 31%)

- Engine best: **fxe4**; line: 4...fxe4 5. dxe4 Nf6 6. O-O d6 7. Bc4 Bg4 8. h3 Bh5 9. Nc3
- Others: Nf6 (44%), d6 (44%)
- After f4: 5. Bxc6 bxc6 6. Nxe5 Qf6 7. d4 Ne7 8. Nc3 h5 9. Qf3 d6
- **Lesson:** material / safety / consequence, gap 132cp, pending

```
On move 4 you played f4. fxe4 was better.

  What you played:  4...f4 5. d4 Qf6 6. Bxc6 dxc6 7. Nxe5 Be6 8. Qh5+
  What was better:  4...fxe4 5. dxe4 Nf6 6. O-O d6 7. a4 Bg4 8. a5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 7b-13: 7... Bb4 — inaccuracy (59% → 41%)

- Engine best: **g5**; line: 7...g5 8. d4 d6 9. Qd3 g4 10. Ne1 Ne7 11. dxe5 dxe5 12. b4
- Others: d6 (58%), Ne7 (57%)
- After Bb4: 8. Ne2 Bf8 9. d4 d6 10. Qd3 Ne7 11. b3 Ng6 12. Qc4 Bb7
- **Lesson:** material / forcing_moves / missed_chance, gap 171cp, pending

```
On move 7 you played Bb4. g5 was better.

  What you played:  7...Bb4 8. Ne2 Bf8 9. b4 Ne7 10. d4 d6 11. Qd3
  What was better:  7...g5 8. d4 d6 9. b4 Ne7 10. b5 exd4 11. e5

Your move wasn't a disaster, but g5 would have improved material.
After the better line: material balance +2. After yours: material balance +0.

Principle: Look for forcing moves. Checks, captures and threats force your opponent to respond. Before a quiet move, look at yours: one of them may win material.
```

### 7b-23: 12... cxb6 — ok (51% → 51%)

- Engine best: **axb6**; line: 12...axb6 13. Bc3 d6 14. d4 exd4 15. Bxd4 Qg6 16. Qd3 Qh5 17. a4
- Others: cxb6 (51%), g5 (8%)
- After cxb6: 13. Bc3 Ng6 14. d4 d6 15. h3 Ba6 16. Re1 Rae8 17. dxe5 dxe5
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.08

### 7b-27: 14... Rd8 — inaccuracy (50% → 37%)

- Engine best: **Ng6**; line: 14...Ng6 15. h3 Ba6 16. Re1 Rae8 17. a4 Bc8 18. Ra3 Nh4 19. dxe5
- Others: exd4 (48%), Qg6 (47%)
- After Rd8: 15. dxe5 Qg6 16. exd6 Rxd6 17. Qe2 Bg4 18. Rfe1 Rad8 19. Qc4+ Be6
- **Lesson:** material / safety / consequence, gap 110cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 14 you played Rd8. Ng6 was better.

  What you played:  14...Rd8 15. dxe5 Qg6 16. exd6 Rxd6 17. Qe2 Bh3 18. Ne1
  What was better:  14...Ng6 15. h3 Ba6 16. Re1 Rad8 17. dxe5 dxe5 18. Qb1

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 7b-29: 15... dxe5 — blunder (35% → 3%)

- Engine best: **Qh6**; line: 15...Qh6 16. exd6 Rxd6 17. Qe2 Bg4 18. Rfd1 Rg6 19. Qd3 Bh3 20. Ne1
- Others: Qg6 (34%), Qe6 (22%)
- After dxe5: 16. Qxd8+ Qf8 17. Qxf8+ Kxf8 18. Nxe5 Ng6 19. f3 Nh4 20. Bb2 Ke8
- **Lesson:** material / hanging / consequence, gap 810cp, triggered after 2 plies
- Trigger: Since that move you've lost a rook and taken a pawn: overall you're 4 pawns down.

```
On move 15 you played dxe5. Qg6 was better.

  What you played:  15...dxe5 16. Qxd8+ Qf8 17. Qxf8+ Kxf8 18. Nxe5 Kg8 19. f3
  What was better:  15...Qg6 16. exd6 Rxd6 17. Qe2 Bg4 18. Rfe1 Qh5 19. Qc4+

The difference is material. Before your move: material balance -1.
After your line: material balance -6. After the better line: material balance -1.
Your move left this undefended: rook on d8.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 8 (1700), White: Italian Game

https://lichess.org/game/POiSfZ4d · 1691 vs 1674 · 1-0

### 8w-10: 6. c3 — ok (73% → 71%)

- Engine best: **d3**; line: 6. d3 Nf6 7. Nbd2 Nd7 8. Nc4 b5 9. Ne3 Bd6 10. a4 b4
- Others: c3 (71%), h3 (70%)
- After c3: 6...Nf6 7. Qe2 a5 8. d3 Be7 9. O-O Qd7 10. Nbd2 Rd8 11. Ne1
- **Lesson:** development / develop / missed_chance, gap 64cp, pending; check: Mobility is a main reason (+0.23)

```
On move 6 you played c3. d3 was better.

  What you played:  6. c3 Nf6 7. Qc2 Qd7 8. d3 O-O-O
  What was better:  6. d3 h6 7. c3 g5 8. Be3 Qf6

Your move wasn't a disaster, but d3 would have improved development.
After the better line: undeveloped: knight on b1. After yours: undeveloped: knight on b1, bishop on c1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

### 8w-14: 8. Bg5 — inaccuracy (79% → 67%)

- Engine best: **b4**; line: 8. b4 Bd6 9. O-O h6 10. a4 O-O 11. Na3 Ne7 12. Nc4 Ng6
- Others: Qe2 (72%), a4 (70%)
- After Bg5: 8...a5 9. Qe2 h6 10. Be3 Bxe3 11. fxe3 g5 12. Na3 g4 13. Nd2
- *Rejected lesson:* mobility / activity; Mobility is a main reason (+0.55)

### 8w-18: 10. Qb3 — inaccuracy (75% → 65%)

- Engine best: **b4**; line: 10. b4 Be7 11. Be3 Qd7 12. a4 Rfd8 13. Qb3 Ng4 14. Bc1 h6
- Others: a4 (70%), Re1 (69%)
- After Qb3: 10...h6 11. Qxe6+ Kh8 12. Nxe5 Nxe5 13. Qxe5 hxg5 14. Qxc5 Qxd3 15. e5
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 87cp, pending; check: Pawns is a main reason (+0.41)

```
On move 10 you played Qb3. Bh4 was better.

  What you played:  10. Qb3 Qxd3 11. Qxe6+ Kh8 12. Bxf6 Rxf6 13. Qd5 Qb5
  What was better:  10. Bh4 Qd7 11. b4 Be7 12. a4 Nh5 13. Bg3 Nxg3

Your move wasn't a disaster, but Bh4 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on e5, e6; doubled pawns on the e-file. After yours: opponent's pawns: isolated pawn(s) on e5.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

## Game 8 (1700), Black: Italian Game

https://lichess.org/game/POiSfZ4d · 1691 vs 1674 · 1-0

### 8b-5: 3... d5 — inaccuracy (48% → 38%)

- Engine best: **Nf6**; line: 3...Nf6 4. d3 Bc5 5. O-O a6 6. Re1 d6 7. c3 Ba7 8. Bb3
- Others: Bc5 (47%), Be7 (46%)
- After d5: 4. Bxd5 Nge7 5. Bc4 Ng6 6. O-O Be7 7. Nc3 O-O 8. Nd5 Kh8
- **Lesson:** material / safety / consequence, gap 102cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 3 you played d5. Nf6 was better.

  What you played:  3...d5 4. Bxd5 Nge7 5. Bc4 Ng6 6. O-O Bc5 7. c3
  What was better:  3...Nf6 4. d3 Bc5 5. O-O O-O 6. c3 Bb6 7. a4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 8b-7: 4... Be6 — inaccuracy (38% → 27%)

- Engine best: **Nge7**; line: 4...Nge7 5. Bc4 Ng6 6. c3 Be7 7. O-O O-O 8. d4 exd4 9. Nxd4
- Others: Qf6 (35%), Qd6 (34%)
- After Be6: 5. Bxe6 fxe6 6. d3 Nf6 7. O-O h6 8. c3 Qd7 9. b4 O-O-O
- **Lesson:** own_pawns / pawn_weaknesses / consequence, gap 144cp, pending; check: Pawns is a main reason (+0.28)

```
On move 4 you played Be6. Nge7 was better.

  What you played:  4...Be6 5. Bxe6 fxe6 6. d3 h6 7. Nbd2
  What was better:  4...Nge7 5. Bc4 Ng6 6. c3 Bd6 7. O-O

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on e5, e6; doubled pawns on the e-file. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

### 8b-13: 7... Bc5 — ok (30% → 21%)

- Engine best: **Qd7**; line: 7...Qd7 8. O-O a5 9. Qc2 O-O-O 10. Ne1 Bc5 11. a3 Ba7 12. b4
- Others: a5 (29%), a6 (27%)
- After Bc5: 8. b4 Bd6 9. O-O h6 10. a4 O-O 11. Na3 Ne7 12. Nc4 Ng6
- *No lesson.*

### 8b-17: 9... a6 — ok (33% → 25%)

- Engine best: **a5**; line: 9...a5 10. Qe2 h6 11. Be3 Bxe3 12. Qxe3 Rf7 13. Na3 Nh5 14. Rad1
- Others: h6 (30%), Be7 (27%)
- After a6: 10. b4 Be7 11. Be3 Qd7 12. a4 Rfd8 13. Qb3 Ng4 14. Bc1 h6
- *No lesson.*

### 8b-19: 10... b5 — blunder (35% → 5%)

- Engine best: **h6**; line: 10...h6 11. Qxe6+ Kh8 12. Nxe5 Nxe5 13. Qxe5 hxg5 14. Qxc5 Qxd3 15. e5
- Others: Qxd3 (35%), Kh8 (32%)
- After b5: 11. Qxe6+ Kh8 12. Qxc6 Bd6 13. d4 h6 14. Bxf6 Rxf6 15. dxe5 Bxe5
- **Lesson:** material / hanging / consequence, gap 543cp, pending

```
On move 10 you played b5. Qxd3 was better.

  What you played:  10...b5 11. Qxe6+ Kh8 12. Qxc6 Bb6 13. Qe6 h6 14. Bxf6
  What was better:  10...Qxd3 11. Qxe6+ Kh8 12. Bxf6 gxf6 13. Nbd2 Rad8 14. Rad1

The difference is material. Before your move: material balance -1.
After your line: material balance -5. After the better line: material balance -1.
Your move left this undefended: pawn on e6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 9 (1700), White: Sicilian Defense: Bowdler Attack

https://lichess.org/game/paKS4uAo · 1653 vs 1614 · 0-1

### 9w-18: 10. Nf3 — ok (51% → 48%)

- Engine best: **Nxc6**; line: 10. Nxc6 bxc6 11. Qe2 Qc7 12. Na4 e5 13. Be3 Bg4 14. f3 Be6
- Others: Be3 (51%), Nce2 (50%)
- After Nf3: 10...b5 11. Ne2 d5 12. e5 Ng4 13. Bf4 f6 14. exf6 Bxf6 15. h3
- **Lesson:** development / develop / missed_chance, gap 38cp, pending; check: Mobility is a main reason (+1.22)

```
On move 10 you played Nf3. Be3 was better.

  What you played:  10. Nf3 b5 11. Re1 Bb7 12. Ne2 Nd7 13. Ng3 Nce5
  What was better:  10. Be3 Ne5 11. h3 Qc7 12. f4 Nc4 13. Bxc4 Qxc4

Your move wasn't a disaster, but Be3 would have improved development.
After the better line: all minor pieces developed. After yours: undeveloped: bishop on c1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

### 9w-20: 11. Nd2 — ok (51% → 49%)

- Engine best: **Re1**; line: 11. Re1 Be6 12. Nd5 Nxd5 13. exd5 Bxd5 14. Bxh7+ Kxh7 15. Qxd5 Qc8
- Others: Nd5 (51%), Be3 (51%)
- After Nd2: 11...Bg4 12. Qe1 b5 13. Nd5 Nxd5 14. exd5 Nd4 15. c3 Bf5 16. Bxf5
- **Lesson:** centre / centre / consequence, gap 56cp, pending; check: Mobility is a main reason (+0.39)

```
On move 11 you played Nd2. Re1 was better.

  What you played:  11. Nd2 Bg4 12. f3 Be6 13. Nb3 Rc8 14. Kh1 d5
  What was better:  11. Re1 Be6 12. h3 Rc8 13. Bf1 Na5 14. Bg5 h6

The difference is control of the centre. Before your move: centre control 8 vs 8.
After your line: centre control 8 vs 12. After the better line: centre control 10 vs 7.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 9w-30: 16. c4 — inaccuracy (55% → 45%)

- Engine best: **a5**; line: 16. a5 Bd7 17. Be2 Rb8 18. Re1 Ne8 19. Nc4 f4 20. Nb6 Bf5
- Others: Qb3 (53%), Be2 (50%)
- After c4: 16...a5 17. f4 Na6 18. Nb3 Bf6 19. fxe5 Bxe5 20. Bf4 Qb6+ 21. Kh1
- **Lesson:** their_pawns / target_weaknesses / missed_chance, gap 96cp, pending; check: Pawns is a main reason (+0.43)

```
On move 16 you played c4. a5 was better.

  What you played:  16. c4 a5 17. Nb3 Na6 18. Be3 Qc7 19. f4
  What was better:  16. a5 Kh8 17. c4 Ne8 18. b4 Bd7 19. f4

Your move wasn't a disaster, but a5 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: backward pawn(s) on d6, b7. After yours: opponent's pawns: backward pawn(s) on d6.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### 9w-34: 18. b3 — ok (54% → 48%)

- Engine best: **a5**; line: 18. a5 Bd7 19. b4 Bf6 20. Ra3 b5 21. axb6 Qxb6 22. Qb3 h6
- Others: Ra3 (54%), f4 (53%)
- After b3: 18...a5 19. f4 Bf6 20. Ra2 Bd4+ 21. Kh1 Bc5 22. g3 Nc7 23. Bb2
- **Lesson:** material / safety / consequence, gap 111cp, pending

```
On move 18 you played b3. a5 was better.

  What you played:  18. b3 a5 19. Ra2 Nc7 20. c5 dxc5 21. Bc4 Kh8
  What was better:  18. a5 Bf6 19. Ra3 Bd7 20. b4 b5 21. cxb5 axb5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### 9w-36: 19. Bb2 — blunder (48% → 7%)

- Engine best: **Ra2**; line: 19. Ra2 a5 20. f4 Bd4+ 21. Kh1 Qb6 22. b4 axb4 23. Nb3 Bc5
- Others: Rb1 (44%), Ra3 (44%)
- After Bb2: 19...Bxb2 20. Rb1 Bc3 21. b4 a5 22. bxa5 Bxd2 23. Qxd2 Rxa5 24. Rfe1
- **Lesson:** material / hanging / consequence, gap 704cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before.

```
On move 19 you played Bb2. Ra2 was better.

  What you played:  19. Bb2 Bxb2 20. Ra2 Bf6 21. c5 dxc5 22. d6 Bd4
  What was better:  19. Ra2 a5 20. Nb1 Nc7 21. Be3 Na6 22. f4 Nb4

The difference is material. Before your move: material balance +0.
After your line: material balance -4. After the better line: material balance +0.
Your move left this undefended: the piece you moved, now on b2.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

## Game 9 (1700), Black: Sicilian Defense: Bowdler Attack

https://lichess.org/game/paKS4uAo · 1653 vs 1614 · 0-1

### 9b-19: 10... e5 — ok (52% → 49%)

- Engine best: **b5**; line: 10...b5 11. Ne2 d5 12. e5 Ng4 13. Bf4 f6 14. exf6 Bxf6 15. h3
- Others: Qc7 (51%), Nd7 (51%)
- After e5: 11. Re1 Be6 12. Nd5 Nxd5 13. exd5 Bxd5 14. Bxh7+ Kxh7 15. Qxd5 Qc8
- **Lesson:** mobility / activity / missed_chance, gap 62cp, pending; check: Mobility is a main reason (+0.58)

```
On move 10 you played e5. b5 was better.

  What you played:  10...e5 11. Re1 Be6 12. Bf1 Rc8 13. Nd5 Na5 14. b3
  What was better:  10...b5 11. Re1 Qb6 12. Ne2 Ng4 13. Rf1 Bb7 14. Ng3

Your move wasn't a disaster, but b5 would have improved piece activity.
After the better line: 35 piece moves available vs opponent's 24. After yours: 27 piece moves available vs opponent's 32.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 9b-25: 13... f5 — ok (49% → 43%)

- Engine best: **Bf5**; line: 13...Bf5 14. Ne4 Bg6 15. c3 Nf5 16. a4 Nh6 17. a5 f5 18. Ng3
- Others: Bd7 (48%), b5 (48%)
- After f5: 14. c3 Nb5 15. Nc4 Na7 16. a4 b5 17. axb5 axb5 18. Na5 Bd7
- **Lesson:** mobility / activity / consequence, gap 57cp, pending; check: Mobility is a main reason (+0.26)

```
On move 13 you played f5. Bd7 was better.

  What you played:  13...f5 14. c3 Nb5 15. Nc4 Nc7 16. Nb6
  What was better:  13...Bd7 14. a4 b5 15. c3 Nf5 16. b3

The difference is piece activity. Before your move: 24 piece moves available vs opponent's 21.
After your line: 16 piece moves available vs opponent's 30. After the better line: 22 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### 9b-31: 16... e4 — ok (55% → 50%)

- Engine best: **a5**; line: 16...a5 17. f4 Na6 18. Nb3 Bf6 19. fxe5 Bxe5 20. Bf4 Qb6+ 21. Kh1
- Others: e4 (50%), b6 (48%)
- After e4: 17. Bc2 a5 18. Nb3 Bf6 19. f3 exf3 20. Rxf3 Be5 21. Bf4 Na6
- *Rejected lesson:* open_files / open_files; Rooks gains only 0.09

## Game 10 (1700), White: Sicilian Defense: Alapin Variation

https://lichess.org/game/MB3myc2k · 1709 vs 1770 · 0-1

### 10w-16: 9. Bd2 — inaccuracy (64% → 49%)

- Engine best: **b4**; line: 9. b4 a5 10. Bd2 g6 11. Bc4 Bg7 12. Ne2 Nc6 13. Bb3 O-O-O
- Others: Be3 (62%), c6 (51%)
- After Bd2: 9...Bxc5 10. b4 Bb6 11. a4 a5 12. Bb5 Bxb5 13. axb5 Ne6 14. bxa5
- **Lesson:** material / hanging / consequence, gap 161cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 9 you played Bd2. Be3 was better.

  What you played:  9. Bd2 Bxc5 10. b4 Bb6 11. a4 a5 12. Bb5 Ne6
  What was better:  9. Be3 Ne6 10. b4 a5 11. Bc4 axb4 12. cxb4 b6

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +1.
Your move left this undefended: pawn on c5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 10w-18: 10. f3 — ok (50% → 47%)

- Engine best: **b4**; line: 10. b4 Bb6 11. a4 a5 12. Bb5 Bxb5 13. axb5 Ne6 14. bxa5 Bxa5
- Others: Be3 (49%), Ne2 (49%)
- After f3: 10...Nc6 11. Ne2 O-O-O 12. b4 Bb6 13. O-O-O Ne5 14. Nd4 Ba4 15. Nb3
- *Rejected lesson:* their_pawns / target_weaknesses; Pawns gains only -0.14

### 10w-26: 14. Ne2 — ok (51% → 44%)

- Engine best: **Bc4**; line: 14. Bc4 b5 15. Bd3 a6 16. Be4 f5 17. Bb7 Rb8 18. Bd5 Bd6
- Others: Bd3 (51%), h4 (50%)
- After Ne2: 14...h5 15. h4 Bc6 16. Ng3 Bf2 17. Nxh5 Rd5 18. g4 Red8 19. Rh2
- *Rejected lesson:* centre / centre; Space/Mobility gains only -0.09

### 10w-30: 16. Nf4 — blunder (49% → 11%)

- Engine best: **a4**; line: 16. a4 h5 17. Kc2 h4 18. h3 a6 19. Nc1 Bf2 20. a5 Bg3
- Others: Kc2 (49%), Ng3 (48%)
- After Nf4: 16...Rxd2 17. Rxd2 Nxf4 18. Kb2 Bb6 19. a4 Re1 20. b4 Kf8 21. b5
- **Lesson:** material / safety / consequence, gap 530cp, triggered after 2 plies
- Trigger: You've lost a bishop: you're 3 pawns worse off than before.

```
On move 16 you played Nf4. Kc2 was better.

  What you played:  16. Nf4 Rxd2 17. Kxd2 Nxf4 18. Re1
  What was better:  16. Kc2 h5 17. Nc1 h4 18. h3

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

## Game 10 (1700), Black: Sicilian Defense: Alapin Variation

https://lichess.org/game/MB3myc2k · 1709 vs 1770 · 0-1

### 10b-11: 6... Bd7 — ok (48% → 39%)

- Engine best: **Nf6**; line: 6...Nf6 7. f3 Bf5 8. Ne2 exf3 9. Nxf3 e6 10. b4 Be7 11. Ned4
- Others: f5 (46%), Bf5 (42%)
- After Bd7: 7. Nxe4 Nf6 8. Nxf6+ gxf6 9. Be3 e5 10. Nf3 Ne6 11. b4 Rg8
- **Lesson:** material / hanging / consequence, gap 84cp, triggered after 2 plies
- Trigger: You've lost a pawn: you're 1 pawn worse off than before.

```
On move 6 you played Bd7. Nf6 was better.

  What you played:  6...Bd7 7. Nxe4 Nf6 8. Nxf6+ gxf6 9. Nf3 e5 10. Be3
  What was better:  6...Nf6 7. f3 exf3 8. Ngxf3 g6 9. Ne5 Bh6 10. Bb5+

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: pawn on e4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

### 10b-15: 8... exf6 — ok (38% → 36%)

- Engine best: **gxf6**; line: 8...gxf6 9. Nf3 e5 10. Be3 a5 11. Nd2 Bc6 12. Nc4 Ne6 13. b4
- Others: exf6 (37%)
- After exf6: 9. b4 a5 10. Bd2 g6 11. Bc4 Bg7 12. Ne2 Nc6 13. Bb3 O-O-O
- **Lesson:** centre / centre / missed_chance, gap 36cp, pending; check: Mobility is a main reason (+0.24)

```
On move 8 you played exf6. gxf6 was better.

  What you played:  8...exf6 9. b4 a5 10. Bd2 Be7 11. Nf3 O-O 12. Bc4
  What was better:  8...gxf6 9. Be3 e5 10. Nf3 Ne6 11. b4 a5 12. Nd2

Your move wasn't a disaster, but gxf6 would have improved control of the centre.
After the better line: centre control 5 vs 3. After yours: centre control 1 vs 4.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### 10b-19: 10... O-O — ok (53% → 51%)

- Engine best: **Nc6**; line: 10...Nc6 11. Ne2 O-O-O 12. b4 Bb6 13. O-O-O Ne5 14. Nd4 Ba4 15. Nb3
- Others: h5 (52%), O-O (51%)
- After O-O: 11. Ne2 Nc6 12. O-O-O Be6 13. Kb1 Rad8 14. Ng3 h5 15. Be2 h4
- **Lesson:** open_files / open_files / consequence, gap 41cp, triggered after 2 plies; check: Rooks is a main reason (+0.16)
- Trigger: Your opponent's rook has taken an open file (your rooks on open files: none; theirs: d1).

```
On move 10 you played O-O. Nc6 was better.

  What you played:  10...O-O 11. Ne2 Nc6 12. O-O-O Be6 13. b4 Bd6 14. Nf4
  What was better:  10...Nc6 11. Ne2 O-O-O 12. O-O-O Be6 13. Kc2 Bb6 14. b3

The difference is rooks on open files. Before your move: your rooks on open files: none; theirs: none.
After your line: your rooks on open files: none; theirs: d1. After the better line: your rooks on open files: d8; theirs: d1.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

