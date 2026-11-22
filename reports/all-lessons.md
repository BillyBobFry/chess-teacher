# All lessons

Every lesson from `reports/simulation.json`, grouped by run and then by the factor that was used to explain it.

For each lesson, judge: **is the explanation the real reason the better move was better?**
Tick one box per lesson. Material lessons should almost always be right; the strategic
ones are what we most need graded.

Contents:

- **teaching opponent**: 40 lessons — material (21), king_safety (5), their_pawns (4), mobility (3), passed_pawns (2), own_pawns (2), mate (1), open_files (1), centre (1)
- **no level-up (control)**: 76 lessons — material (51), mobility (6), own_pawns (5), open_files (4), passed_pawns (4), their_pawns (3), development (1), king_safety (1), centre (1)

---

## teaching opponent (40 lessons)

### material (21)

#### Game 2, 18... f6 (black) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a bishop and taken a pawn: overall you're 2 pawns down. And more is about to fall.
- **Eval gap:** 4.7 pawns · **Principle:** Check checks, captures and threats

```
On move 18 you played f6. Bxb4 was better.

  What you played:  18...f6 19. Bg3 Qg5 20. bxc5 b6 21. O-O Qxc5 22. Bd6
  What was better:  18...Bxb4 19. O-O Qh5 20. Bd4 e5 21. Nd5 exd4 22. Nxb4

The difference is material. Before your move: material balance +1.
After your line: material balance -2. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 3, 2. d3 (white) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 0.8 pawns · **Principle:** Check checks, captures and threats

```
On move 2 you played d3. exd5 was better.

  What you played:  2. d3 Nc6 3. exd5 Qxd5 4. Nf3 e5 5. Nc3 Qd7
  What was better:  2. exd5 c6 3. dxc6 Nxc6 4. Bc4 e5 5. d3 Bc5

Your move wasn't a disaster, but exd5 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 3, 4. a3 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 1.4 pawns · **Principle:** Don't leave pieces undefended

```
On move 4 you played a3. c4 was better.

  What you played:  4. a3 Nxd5 5. c4 Ndf6 6. Nc3 Nh6 7. Bxh6
  What was better:  4. c4 e6 5. a3 exd5 6. axb4 Bxb4+ 7. Nd2

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +2.
Your move left this undefended: pawn on d5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 11... b5 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 1.6 pawns · **Principle:** Check checks, captures and threats

```
On move 11 you played b5. cxd5 was better.

  What you played:  11...b5 12. axb5 cxb5 13. Bxb5+ N8d7 14. Nd2 O-O 15. Bc6
  What was better:  11...cxd5 12. Bxd5 Be6 13. a5 Bxd5 14. Bb6 Qd7 15. Nxd5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 15... Ke8 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.0 pawns · **Principle:** Check checks, captures and threats

```
On move 15 you played Ke8. Rxb2 was better.

  What you played:  15...Ke8 16. Bxa6 Bxa6 17. Rxa6 Rxb2 18. Ra8+ Rb8 19. Nb5
  What was better:  15...Rxb2 16. Ra4 N8d7 17. O-O Ke8 18. Rc4 Nc5 19. Bxc5

Your move wasn't a disaster, but Rxb2 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 16... Rxb2 (black) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 0.8 pawns · **Principle:** Check checks, captures and threats

```
On move 16 you played Rxb2. Bxa6 was better.

  What you played:  16...Rxb2 17. Nb5 Qb8 18. Ba7 Rxb5 19. Bxb8 Rxb8 20. O-O
  What was better:  16...Bxa6 17. Rxa6 Rxb2 18. Qd3 N8d7 19. Rc6 Qb7 20. O-O

The difference is material. Before your move: material balance -1.
After your line: material balance -3. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 17... Qd8 (black) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** You've lost a rook: you're 5 pawns worse off than before.
- **Eval gap:** 0.8 pawns · **Principle:** Check checks, captures and threats

```
On move 17 you played Qd8. Qd7 was better.

  What you played:  17...Qd8 18. Qc3 Rxb5 19. Bxb5+ Bd7 20. Qb4 Bxb5 21. Qxb5+
  What was better:  17...Qd7 18. Qc3 Bxa6 19. Nc7+ Ke7 20. Qxb2 Qxc7 21. Rxa6

The difference is material. Before your move: material balance -1.
After your line: material balance -3. After the better line: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 14. Ra3 (white) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 0.8 pawns · **Principle:** Check checks, captures and threats

```
On move 14 you played Ra3. a5 was better.

  What you played:  14. Ra3 Bd7 15. Bxf5 exf5 16. Qd1 O-O 17. Nbxd4 Bxd4
  What was better:  14. a5 Ba7 15. c3 Bd7 16. Bxf5 exf5 17. cxd4 Nd8

Your move wasn't a disaster, but a5 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 19. Rg1 (white) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 1.1 pawns · **Principle:** Check checks, captures and threats

```
On move 19 you played Rg1. Bd2 was better.

  What you played:  19. Rg1 d3 20. cxd3 Bxg1 21. Kxg1 d4 22. Bd2 f6
  What was better:  19. Bd2 f6 20. Raa1 Bc8 21. Rae1 Qf7 22. Qh4 fxe5

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 20. a5 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a rook: you're 5 pawns worse off than before.
- **Eval gap:** 1.2 pawns · **Principle:** Don't leave pieces undefended

```
On move 20 you played a5. cxd3 was better.

  What you played:  20. a5 Bxg1 21. Kxg1 dxc2 22. Nbd4 Nb4 23. Nb3 f6
  What was better:  20. cxd3 Bxg1 21. Kxg1 d4 22. Bd2 f6 23. exf6 Rxf6

The difference is material. Before your move: material balance -1.
After your line: material balance -4. After the better line: material balance -1.
Your move left this undefended: pawn on c2, rook on g1.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 21. cxd3 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You're about to lose material.
- **Eval gap:** 2.2 pawns · **Principle:** Check checks, captures and threats

```
On move 21 you played cxd3. Kxg1 was better.

  What you played:  21. cxd3 Ba7 22. Ra1 f6
  What was better:  21. Kxg1 dxc2 22. Nbd4 Nxd4

The difference is material. Before your move: material balance -4.
After your line: material balance -5. After the better line: material balance -4.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 3. d4 (white) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 0.8 pawns · **Principle:** Check checks, captures and threats

```
On move 3 you played d4. Nf3 was better.

  What you played:  3. d4 cxd4 4. Nf3 Bb4+ 5. c3 dxc3 6. bxc3 Be7
  What was better:  3. Nf3 Nc6 4. Bb5 Nf6 5. d3 d5 6. O-O Be7

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 7... e5 (black) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 1.4 pawns · **Principle:** Check checks, captures and threats

```
On move 7 you played e5. h5 was better.

  What you played:  7...e5 8. Nb5 O-O 9. N1c3 Nc6 10. O-O Be6 11. Qxd6
  What was better:  7...h5 8. Bb2 h4 9. Nc3 h3 10. Bf3 Nbd7 11. O-O

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 9... d5 (black) — consequence

- **Outcome:** revealed during the game, 7 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a rook, a knight, a pawn and taken a bishop: overall you're 6 pawns down.
- **Eval gap:** 1.3 pawns · **Principle:** Check checks, captures and threats

```
On move 9 you played d5. Be7 was better.

  What you played:  9...d5 10. N1c3 Nbd7 11. Nxd5 Nxd5 12. Bxd8
  What was better:  9...Be7 10. N1c3 O-O 11. Qd2 Nc6 12. Rd1

The difference is material. Before your move: material balance +0.
After your line: material balance -7. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 21... Bxh5 (black) — missed chance

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 0.9 pawns · **Principle:** Check checks, captures and threats

```
On move 21 you played Bxh5. Nxd4 was better.

  What you played:  21...Bxh5 22. Qf2 Bxf3 23. gxf3 Qg5+ 24. Kh1 Qh5+ 25. Kg1
  What was better:  21...Nxd4 22. Qe3 Nxf3+ 23. gxf3 Bxh5 24. f4 Rd8 25. e5

Your move wasn't a disaster, but Nxd4 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 22... O-O (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.2 pawns · **Principle:** Check checks, captures and threats

```
On move 22 you played O-O. Bxf3 was better.

  What you played:  22...O-O 23. d5 Bxf3 24. gxf3 Ne5
  What was better:  22...Bxf3 23. Qf2 Rd8 24. d5 Ne5

Your move wasn't a disaster, but Bxf3 would have improved material.
After the better line: material balance +3. After yours: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 31... Nd3 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a knight: you're 3 pawns worse off than before.
- **Eval gap:** 1.1 pawns · **Principle:** Don't leave pieces undefended

```
On move 31 you played Nd3. Rc5 was better.

  What you played:  31...Nd3 32. Bxd3 Kh7 33. e5 Rc6 34. b4 Kh8 35. Rxg6
  What was better:  31...Rc5 32. Rxg6+ Kf7 33. Rxh6 Nc6 34. Rh7+ Ke6 35. e5

The difference is material. Before your move: material balance -1.
After your line: material balance -5. After the better line: material balance -2.
Your move left this undefended: pawn on g6, the piece you moved, now on d3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 9, 20. f4 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 2.6 pawns · **Principle:** Check checks, captures and threats

```
On move 20 you played f4. cxd4 was better.

  What you played:  20. f4 exf3 21. Bxf3 dxe3 22. h4 Qe5 23. h5
  What was better:  20. cxd4 Qxg2 21. Rh2 Qg1 22. Bb5 Rad8 23. Qe2

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 10, 16... Qe6 (black) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 2.2 pawns · **Principle:** Check checks, captures and threats

```
On move 16 you played Qe6. Ndf6 was better.

  What you played:  16...Qe6 17. Rg2 Bd8
  What was better:  16...Ndf6 17. Bxf6 Nxf6

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 10, 18... Kf8 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a knight: you're 3 pawns worse off than before.
- **Eval gap:** 3.0 pawns · **Principle:** Check checks, captures and threats

```
On move 18 you played Kf8. Rf8 was better.

  What you played:  18...Kf8 19. Bxe4 fxe4 20. Ng5 Qd6 21. Ndxe4
  What was better:  18...Rf8 19. Be2 Ndf6 20. Nxe4 fxe4 21. Ng5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 11, 14. Bf4 (white) — consequence

- **Outcome:** never punished (would be in the review)
- **What happened in the game:** —
- **Eval gap:** 4.0 pawns · **Principle:** Check checks, captures and threats

```
On move 14 you played Bf4. Bh3 was better.

  What you played:  14. Bf4 Bxg3 15. Bxg3 Ne3+ 16. Kg1 Nxc2+ 17. Bf2
  What was better:  14. Bh3 exd5 15. Bxg4 Bxg4 16. Ng5 f5 17. Rxd5

The difference is material. Before your move: material balance +0.
After your line: material balance -8. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### king_safety (5)

#### Game 4, 13... Ke7 (black) — missed chance

- **Outcome:** revealed during the game, 4 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.2 pawns · **Principle:** Keep your king safe

```
On move 13 you played Ke7. N8d7 was better.

  What you played:  13...Ke7 14. Nd2 N8d7 15. O-O Rb8 16. Bxa6 Rxb2 17. Nb5
  What was better:  13...N8d7 14. Nd2 Nh5 15. Bc6 Rb8 16. O-O O-O 17. Nc4

Your move wasn't a disaster, but N8d7 would have improved king safety.
After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it. After yours: 2 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 8... Bf8 (black) — missed chance

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.2 pawns · **Principle:** Keep your king safe

```
On move 8 you played Bf8. O-O was better.

  What you played:  8...Bf8 9. Bg5 Be7 10. Bxf6 Bxf6 11. Nxd6+ Kf8 12. Nc3
  What was better:  8...O-O 9. N1c3 Ne8 10. Ba3 e4 11. Rc1 a6 12. Nxd6

Your move wasn't a disaster, but O-O would have improved king safety.
After the better line: 3 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it. After yours: 2 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 14... c5 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 0.9 pawns · **Principle:** Keep your king safe

```
On move 14 you played c5. Bg4 was better.

  What you played:  14...c5 15. exd6 Bxd6 16. dxc5
  What was better:  14...Bg4 15. Re1 O-O 16. exd6

Your move wasn't a disaster, but Bg4 would have improved king safety.
After the better line: 3 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it. After yours: 1 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 11, 12. Kf1 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** Your king has come under fire (2 pawn(s) shielding the king, 3 enemy attack(s) on the squares around it).
- **Eval gap:** 1.7 pawns · **Principle:** Keep your king safe

```
On move 12 you played Kf1. e3 was better.

  What you played:  12. Kf1 Bxf2 13. Nc3 Ng4 14. Nxa4 Qa7
  What was better:  12. e3 Nc6 13. Bd2 Rd8 14. Bc3 Ne4

The difference is king safety. Before your move: 3 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it.
After your line: 2 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it. After the better line: 3 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 11, 13. cxd5 (white) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** Your king has come under fire (1 pawn(s) shielding the king, 5 enemy attack(s) on the squares around it).
- **Eval gap:** 0.8 pawns · **Principle:** Keep your king safe

```
On move 13 you played cxd5. Nc3 was better.

  What you played:  13. cxd5 Ng4 14. Bh3 Bxg3 15. Kg2 Qf2+ 16. Kh1 exd5
  What was better:  13. Nc3 Ng4 14. Bh3 Bxg3 15. e4 Qf2+ 16. Qxf2 Nxf2

The difference is king safety. Before your move: 2 pawn(s) shielding the king, 3 enemy attack(s) on the squares around it.
After your line: 1 pawn(s) shielding the king, 5 enemy attack(s) on the squares around it. After the better line: the enemy queen is gone, so your king is fairly safe.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### their_pawns (4)

#### Game 2, 19... Bxf2+ (black) — missed chance

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 1.1 pawns · **Principle:** Create and attack weaknesses

```
On move 19 you played Bxf2+. Qg5 was better.

  What you played:  19...Bxf2+ 20. Bxf2 Qf4 21. O-O Qc7 22. Qb2
  What was better:  19...Qg5 20. bxc5 b6 21. c6 f5 22. O-O

Your move wasn't a disaster, but Qg5 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on a4, c6. After yours: opponent's pawns: isolated pawn(s) on e4.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 4. Bb5 (white) — missed chance

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 0.8 pawns · **Principle:** Create and attack weaknesses

```
On move 4 you played Bb5. Nf3 was better.

  What you played:  4. Bb5 Nf6 5. Nf3 Nxe4 6. Qxd4 Nf6 7. O-O a6
  What was better:  4. Nf3 Nf6 5. e5 Nd5 6. Bc4 Nc6 7. O-O d6

Your move wasn't a disaster, but Nf3 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: doubled pawns on the d-file. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 29... Rfd8 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 2.1 pawns · **Principle:** Create and attack weaknesses

```
On move 29 you played Rfd8. fxe4 was better.

  What you played:  29...Rfd8 30. e5 g6 31. e6 Nc6 32. Rb3 Na5 33. Rg3
  What was better:  29...fxe4 30. Re3 Rcd8 31. d7 Nc6 32. Rxe4 Rf6 33. Re8+

Your move wasn't a disaster, but fxe4 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on g2, d7. After yours: opponent's pawns: isolated pawn(s) on g2.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 10, 15... f5 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.7 pawns · **Principle:** Create and attack weaknesses

```
On move 15 you played f5. O-O was better.

  What you played:  15...f5 16. Bb5 Ke7 17. Nh4 Qg1+ 18. Nf1
  What was better:  15...O-O 16. Bxe4 dxe4 17. Nh4 Qg1+ 18. Nf1

Your move wasn't a disaster, but O-O would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on h3; backward pawn(s) on f2. After yours: opponent's pawns: isolated pawn(s) on h3.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### mobility (3)

#### Game 3, 26. Qxb5 (white) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** Your pieces have run short of squares (42 piece moves available vs opponent's 43).
- **Eval gap:** 4.3 pawns · **Principle:** Keep your pieces active

```
On move 26 you played Qxb5. f3 was better.

  What you played:  26. Qxb5 exf2+ 27. Kxf2 Qe3+ 28. Kf1 Nh5 29. g4 Ng3+
  What was better:  26. f3 Nh5 27. Rxd6 cxd6 28. Qxb5 Qh4+ 29. Kd1 Qf2

The difference is piece activity. Before your move: 34 piece moves available vs opponent's 25.
After your line: 42 piece moves available vs opponent's 41. After the better line: 36 piece moves available vs opponent's 24.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 3, 7. Ne4 (white) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** Your pieces have run short of squares (23 piece moves available vs opponent's 29).
- **Eval gap:** 0.7 pawns · **Principle:** Keep your pieces active

```
On move 7 you played Ne4. Nf3 was better.

  What you played:  7. Ne4 Bc6 8. Qe2 e6 9. Nf3 Nxe4 10. dxe4
  What was better:  7. Nf3 e6 8. d4 a6 9. Bd3 c5 10. Be3

The difference is piece activity. Before your move: 23 piece moves available vs opponent's 17.
After your line: 23 piece moves available vs opponent's 28. After the better line: 37 piece moves available vs opponent's 21.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 12... Kd7 (black) — consequence

- **Outcome:** revealed during the game, 8 move(s) after the mistake
- **What happened in the game:** Your pieces have run short of squares (22 piece moves available vs opponent's 33).
- **Eval gap:** 0.9 pawns · **Principle:** Keep your pieces active

```
On move 12 you played Kd7. Kf8 was better.

  What you played:  12...Kd7 13. Nxd5 Qd6 14. O-O Bxd2 15. Qxd2 Nc6 16. Rad1
  What was better:  12...Kf8 13. O-O Kg7 14. Nxa8 Na6 15. a3 Bc3 16. Rc1

The difference is piece activity. Before your move: 32 piece moves available vs opponent's 22.
After your line: 21 piece moves available vs opponent's 30. After the better line: 31 piece moves available vs opponent's 17.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### passed_pawns (2)

#### Game 3, 25. Qxa6 (white) — consequence

- **Outcome:** never punished (would be in the review)
- **What happened in the game:** —
- **Eval gap:** 1.2 pawns · **Principle:** Passed pawns must be pushed (or stopped)

```
On move 25 you played Qxa6. Nd5 was better.

  What you played:  25. Qxa6 e3 26. f3 Qe5 27. Rxd6
  What was better:  25. Nd5 Nxd5 26. Rxd5 Kg7 27. O-O

The difference is passed pawns. Before your move: your passed pawns: none; theirs: none.
After your line: your passed pawns: none; theirs: e3. After the better line: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 30... g6 (black) — consequence

- **Outcome:** never punished (would be in the review)
- **What happened in the game:** —
- **Eval gap:** 0.9 pawns · **Principle:** Passed pawns must be pushed (or stopped)

```
On move 30 you played g6. Nc2 was better.

  What you played:  30...g6 31. Rf6 Nc6 32. Rxg6+ Kf7 33. Rxh6 Ne5
  What was better:  30...Nc2 31. Kf2 Nd4 32. Rxd4 Rc1 33. Rd2 g5

The difference is passed pawns. Before your move: your passed pawns: none; theirs: e4, d6.
After your line: your passed pawns: none; theirs: g2, e4, d6. After the better line: your passed pawns: none; theirs: e4, d6.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### own_pawns (2)

#### Game 9, 19. Nf1 (white) — consequence

- **Outcome:** revealed during the game, 3 move(s) after the mistake
- **What happened in the game:** Your pawn structure has been damaged (isolated pawn(s) on e3; backward pawn(s) on b3).
- **Eval gap:** 2.2 pawns · **Principle:** Avoid weakening your pawns

```
On move 19 you played Nf1. O-O was better.

  What you played:  19. Nf1 Qxg2 20. Rh2 Qg1 21. h4 h6 22. Bb5 exd4
  What was better:  19. O-O Rf6 20. Bg4 Rg6 21. f4 exf4 22. exf4 Qe7

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on h4; backward pawn(s) on f2. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 12, 16... Nb4 (black) — consequence

- **Outcome:** revealed during the game, 3 move(s) after the mistake
- **What happened in the game:** Your pawn structure has been damaged (isolated pawn(s) on e6).
- **Eval gap:** 0.9 pawns · **Principle:** Avoid weakening your pawns

```
On move 16 you played Nb4. Be7 was better.

  What you played:  16...Nb4 17. Bb1 Be7 18. f5 f6 19. d5 exd5
  What was better:  16...Be7 17. d5 exd5 18. cxd5 Qxd5 19. Be4 Qd7

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: backward pawn(s) on g7. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### mate (1)

#### Game 2, 43... Qc1 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've been checkmated.
- **Eval gap:** 95.7 pawns · **Principle:** Check checks, captures and threats

```
On move 43 you played Qc1. Rd8 was better.

  What you played:  43...Qc1 44. Re8#
  What was better:  43...Rd8 44. Qe6+

After your move, your opponent had a forced checkmate.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### open_files (1)

#### Game 8, 23... Qb4 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.6 pawns · **Principle:** Rooks belong on open files

```
On move 23 you played Qb4. Rad8 was better.

  What you played:  23...Qb4 24. Qxb4 Nxb4
  What was better:  23...Rad8 24. d5 Bxf3

Your move wasn't a disaster, but Rad8 would have improved rooks on open files.
After the better line: your rooks on open files: d8; theirs: f1. After yours: your rooks on open files: none; theirs: f1.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### centre (1)

#### Game 8, 26... Rc8 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.4 pawns · **Principle:** Control the centre

```
On move 26 you played Rc8. f5 was better.

  What you played:  26...Rc8 27. d5 g5 28. a3 Nc2 29. Kf2
  What was better:  26...f5 27. exf5 Nc6 28. Be4 Rfe8 29. Rde1

Your move wasn't a disaster, but f5 would have improved control of the centre.
After the better line: centre control 6 vs 8. After yours: centre control 1 vs 9.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


---

## no level-up (control) (76 lessons)

### material (51)

#### Game 1, 11. b3 (white) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 2.5 pawns · **Principle:** Check checks, captures and threats

```
On move 11 you played b3. exd5 was better.

  What you played:  11. b3 b4 12. Na4 dxe4 13. Ng5 Bxd4
  What was better:  11. exd5 bxc4 12. dxe6 Bxe6 13. Bg5 h6

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 1, 12. exd5 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a knight and taken a pawn: overall you're 2 pawns down.
- **Eval gap:** 2.0 pawns · **Principle:** Don't leave pieces undefended

```
On move 12 you played exd5. Na4 was better.

  What you played:  12. exd5 bxc3 13. dxe6 Bxe6 14. Bf1 Re8
  What was better:  12. Na4 dxe4 13. Ne5 Qc7 14. Bb2 f6

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance -1.
Your move left this undefended: knight on c3.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 1, 13. Ba3 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 1.5 pawns · **Principle:** Check checks, captures and threats

```
On move 13 you played Ba3. dxe6 was better.

  What you played:  13. Ba3 cxd5 14. Rc1 Nbc6 15. Bc5 Ba6 16. a3
  What was better:  13. dxe6 Bxe6 14. Bg5 h6 15. d5 hxg5 16. dxe6

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 1, 15. Ne5 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You're about to lose material.
- **Eval gap:** 0.8 pawns · **Principle:** Check checks, captures and threats

```
On move 15 you played Ne5. Bxe7 was better.

  What you played:  15. Ne5 Nb4 16. Rxc3 Nxa2 17. Rf3 Nb4 18. Qd2 Nf5
  What was better:  15. Bxe7 Qxe7 16. c5 Ra7 17. a3 Qb7 18. Rxc3 Nb8

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 1, 17. Qe2 (white) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 1.3 pawns · **Principle:** Check checks, captures and threats

```
On move 17 you played Qe2. cxd5 was better.

  What you played:  17. Qe2 Nf5 18. Qd1 Bxe5
  What was better:  17. cxd5 exd5 18. Rxc3 Bf5

The difference is material. Before your move: material balance -3.
After your line: material balance -4. After the better line: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 1, 19. Nd3 (white) — consequence

- **Outcome:** never punished (would be in the review)
- **What happened in the game:** —
- **Eval gap:** 2.0 pawns · **Principle:** Don't leave pieces undefended

```
On move 19 you played Nd3. Rxc3 was better.

  What you played:  19. Nd3 Bxd4 20. Nxb4 axb4 21. Bxb4 Qxb4 22. a3
  What was better:  19. Rxc3 Be6 20. Rc5 Nf5 21. Bxb4 axb4 22. Nc6

The difference is material. Before your move: material balance -3.
After your line: material balance -7. After the better line: material balance -3.
Your move left this undefended: pawn on d4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 2, 13... a5 (black) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 2.9 pawns · **Principle:** Check checks, captures and threats

```
On move 13 you played a5. O-O was better.

  What you played:  13...a5 14. Nf7 dxc4 15. Nxd8 cxd3 16. Qd1 Bxd8
  What was better:  13...O-O 14. Nd2 Na6 15. Nf7 Rxf7 16. exf7+ Kxf7

The difference is material. Before your move: material balance +1.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 2, 14... O-O (black) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 1.0 pawns · **Principle:** Check checks, captures and threats

```
On move 14 you played O-O. Qxd5 was better.

  What you played:  14...O-O 15. d6 Rf6 16. Bc4 Kg7 17. d7 Bxd7 18. exd7
  What was better:  14...Qxd5 15. Nc3 Qd4 16. g3 O-O 17. Rad1 Qg7 18. Bc4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 2, 19... Na6 (black) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 0.8 pawns · **Principle:** Check checks, captures and threats

```
On move 19 you played Na6. b5 was better.

  What you played:  19...Na6 20. f3 Rxe6 21. Qxe6+ Bxe6 22. Rxe6 Qxe6 23. Nxe6
  What was better:  19...b5 20. Nd2 Na6 21. f3 Ne5 22. Bxe5 dxe5 23. Qxe5

The difference is material. Before your move: material balance +1.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 2, 22... Qf6 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 0.9 pawns · **Principle:** Check checks, captures and threats

```
On move 22 you played Qf6. Qf8 was better.

  What you played:  22...Qf6 23. Re8+ Kg7 24. gxh5 gxh5 25. Bd2 Nc7 26. Rxc8
  What was better:  22...Qf8 23. Ne5 dxe5 24. Bc4+ Kg7 25. Bxe5+ Kh6 26. Bf4

Your move wasn't a disaster, but Qf8 would have improved material.
After the better line: material balance +6. After yours: material balance +4.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 2, 23... Qf8 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a queen: you're 9 pawns worse off than before.
- **Eval gap:** 4.3 pawns · **Principle:** Don't leave pieces undefended

```
On move 23 you played Qf8. Kg7 was better.

  What you played:  23...Qf8 24. Rxf8+ Kxf8 25. gxh5 gxh5 26. Nxd6 Nb4 27. Bb1
  What was better:  23...Kg7 24. gxh5 gxh5 25. Bd2 Nc7 26. Rxc8 Rxc8 27. Rxf5

The difference is material. Before your move: material balance +3.
After your line: material balance -2. After the better line: material balance +4.
Your move left this undefended: pawn on a5, the piece you moved, now on f8.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 2, 30... b6 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 1.2 pawns · **Principle:** Check checks, captures and threats

```
On move 30 you played b6. Bd7 was better.

  What you played:  30...b6 31. Nxc8 Rxc8 32. Bxf5 Rf8 33. Be6+
  What was better:  30...Bd7 31. Re1 Bd4 32. Re7 Nc5 33. Nxf5

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 2, 7... Bg7 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 0.7 pawns · **Principle:** Check checks, captures and threats

```
On move 7 you played Bg7. Nh6 was better.

  What you played:  7...Bg7 8. e6 Bxe6 9. Nxe6 fxe6 10. c3 e5 11. Bxg6+
  What was better:  7...Nh6 8. O-O Nf5 9. c3 Bg7 10. e6 Bxe6 11. Nxe6

Your move wasn't a disaster, but Nh6 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 2, 8... f5 (black) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 1.2 pawns · **Principle:** Check checks, captures and threats

```
On move 8 you played f5. Bxe6 was better.

  What you played:  8...f5 9. Nf7 Qa5+ 10. Bd2 Qb6 11. Nxh8 Bxh8 12. Bxf5
  What was better:  8...Bxe6 9. Nxe6 fxe6 10. Bxg6+ Kd7 11. Nc3 e5 12. Bxh5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 2, 9... Nh6 (black) — missed chance

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 0.9 pawns · **Principle:** Check checks, captures and threats

```
On move 9 you played Nh6. Qb6 was better.

  What you played:  9...Nh6 10. c3 O-O 11. Nd2 a5 12. O-O Na6 13. Ndf3
  What was better:  9...Qb6 10. O-O Nf6 11. Nc3 Qxd4 12. Qf3 Ne4 13. Bxe4

Your move wasn't a disaster, but Qb6 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 3, 19. Na4 (white) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** You've lost a knight: you're 3 pawns worse off than before.
- **Eval gap:** 4.0 pawns · **Principle:** Check checks, captures and threats

```
On move 19 you played Na4. Rad1 was better.

  What you played:  19. Na4 Bb3 20. Qc3 Bxa4 21. Rac1 f4 22. Bxc5 Bxc5
  What was better:  19. Rad1 Qe8 20. Nd5 f4 21. Bxc5 Bxc5 22. Qxc5 Rb5

The difference is material. Before your move: material balance +0.
After your line: material balance -3. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 3, 23. Re1 (white) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.4 pawns · **Principle:** Check checks, captures and threats

```
On move 23 you played Re1. Bxe7 was better.

  What you played:  23. Re1 Rc8 24. Bxe7 Qxe7 25. Qe3 Be8
  What was better:  23. Bxe7 Qxe7 24. Qc7 Qd8 25. Qxa7 Be6

Your move wasn't a disaster, but Bxe7 would have improved material.
After the better line: material balance -1. After yours: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 19... Qg5 (black) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 1.1 pawns · **Principle:** Check checks, captures and threats

```
On move 19 you played Qg5. Rxa6 was better.

  What you played:  19...Qg5 20. Be2 Qxg3+ 21. Kd1 Rd8 22. Kc1
  What was better:  19...Rxa6 20. Bc3 Qe7 21. Bd4 Ra8 22. Qf2

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 22... a3 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.0 pawns · **Principle:** Check checks, captures and threats

```
On move 22 you played a3. Qxc5 was better.

  What you played:  22...a3 23. b4 Rd8 24. Rhf1 b6 25. e6 Bxe6 26. Bf6
  What was better:  22...Qxc5 23. Rhd1 Be6 24. Rd6 Raa8 25. g4 Qxe3 26. Re1

Your move wasn't a disaster, but Qxc5 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 25... Ra4 (black) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 1.4 pawns · **Principle:** Don't leave pieces undefended

```
On move 25 you played Ra4. Be6 was better.

  What you played:  25...Ra4 26. Rxc6 Bb7 27. Rd6 Rxd6 28. cxd6 Qe6 29. g4
  What was better:  25...Be6 26. Bd4 Ra4 27. Rb1 Qb7 28. g4 Qd7 29. Kg3

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -2.
Your move left this undefended: pawn on c6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 26... Re8 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 0.9 pawns · **Principle:** Don't leave pieces undefended

```
On move 26 you played Re8. h5 was better.

  What you played:  26...Re8 27. Rxc6 Ra6 28. Rd6 Rxd6 29. exd6 Qe6
  What was better:  26...h5 27. g4 Rxd6 28. exd6 Qe6 29. gxh5 gxh5

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -2.
Your move left this undefended: pawn on c6.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 31... Rc4 (black) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 2.7 pawns · **Principle:** Check checks, captures and threats

```
On move 31 you played Rc4. Qd5 was better.

  What you played:  31...Rc4 32. d7 Rxc6 33. dxc8=Q+ Rxc8 34. Rc1
  What was better:  31...Qd5 32. Qf3 Qxc6 33. Rd1 f5 34. Kg1

The difference is material. Before your move: material balance -1.
After your line: material balance -3. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 4, 35... Qa8 (black) — consequence

- **Outcome:** revealed during the game, 3 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a rook and taken a pawn: overall you're 9 pawns down.
- **Eval gap:** 2.5 pawns · **Principle:** Check checks, captures and threats

```
On move 35 you played Qa8. Qd3 was better.

  What you played:  35...Qa8 36. Re1 Rxc3 37. Re8+ Kg7 38. Qd4+ Kh6 39. Rxa8
  What was better:  35...Qd3 36. Qd2 Qxd2+ 37. Bxd2 Rd4 38. Bf4 f6 39. Rc1

The difference is material. Before your move: material balance +0.
After your line: material balance -9. After the better line: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 21. Bf3 (white) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 1.5 pawns · **Principle:** Check checks, captures and threats

```
On move 21 you played Bf3. g4 was better.

  What you played:  21. Bf3 cxd4 22. exd4 Bxa3 23. Rce1 Bb2 24. Qe3 Bxc3
  What was better:  21. g4 Nxg4 22. e4 dxe4 23. Nxe4 Bxe4 24. Bxe4 Nf6

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 22. Rfe1 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 0.9 pawns · **Principle:** Check checks, captures and threats

```
On move 22 you played Rfe1. Nd1 was better.

  What you played:  22. Rfe1 cxd4 23. exd4 Bxa3 24. Ra1 Bb2
  What was better:  22. Nd1 c4 23. Bb4 Bxb4 24. axb4 Ne4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 27. Nxd5 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a knight and taken a pawn: overall you're 2 pawns down.
- **Eval gap:** 1.8 pawns · **Principle:** Don't leave pieces undefended

```
On move 27 you played Nxd5. Rcd1 was better.

  What you played:  27. Nxd5 Bxc1 28. Nxe7+ Qxe7 29. Bxc1 Rxd4 30. Be3 Rb4
  What was better:  27. Rcd1 f6 28. Nd3 Qd6 29. Bg2 b6 30. Bc1 Bb4

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.
Your move left this undefended: rook on c1, the piece you moved, now on d5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 37. Nxf7 (white) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a bishop, a knight and taken a pawn: overall you're 5 pawns down. And more is about to fall.
- **Eval gap:** 1.6 pawns · **Principle:** Check checks, captures and threats

```
On move 37 you played Nxf7. Qc1 was better.

  What you played:  37. Nxf7 Qg2+ 38. Ke1 Qh1+ 39. Kd2 Nc4+ 40. Kc3 Nxa3
  What was better:  37. Qc1 Qg2+ 38. Ke1 Qh1+ 39. Kd2 Ne4+ 40. Kd3 Qxc1

The difference is material. Before your move: material balance +0.
After your line: material balance -4. After the better line: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 17... Qb4 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.4 pawns · **Principle:** Check checks, captures and threats

```
On move 17 you played Qb4. Qxc3+ was better.

  What you played:  17...Qb4 18. Qxb4 Bxb4+ 19. Kf1 b6 20. a3 Bf8 21. Rc1
  What was better:  17...Qxc3+ 18. bxc3 Ne4 19. f3 Nxc3 20. a3 Nd5 21. Kf2

Your move wasn't a disaster, but Qxc3+ would have improved material.
After the better line: material balance -1. After yours: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 21... Bd7 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 0.7 pawns · **Principle:** Check checks, captures and threats

```
On move 21 you played Bd7. Nd5 was better.

  What you played:  21...Bd7 22. Qb3 Nd5 23. Nxd7 Qxd7 24. Rfd1 Bc5 25. Kh1
  What was better:  21...Nd5 22. Qb3 Bc5 23. Kh1 Nxe3 24. Rfc1 Bd4 25. Qd3

Your move wasn't a disaster, but Nd5 would have improved material.
After the better line: material balance -1. After yours: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 7, 10. c3 (white) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.0 pawns · **Principle:** Check checks, captures and threats

```
On move 10 you played c3. exd5 was better.

  What you played:  10. c3 h6 11. Be3 cxd4 12. cxd4 dxe4 13. Bxe4 Ndf6
  What was better:  10. exd5 Ndf6 11. c4 cxd4 12. Nxd4 e6 13. Nc3 h6

Your move wasn't a disaster, but exd5 would have improved material.
After the better line: material balance +1. After yours: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 7, 12. Bc2 (white) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** You're about to lose material.
- **Eval gap:** 1.4 pawns · **Principle:** Check checks, captures and threats

```
On move 12 you played Bc2. Bxe4 was better.

  What you played:  12. Bc2 h6 13. Bh4 Nc5 14. Nb3 Qxd1 15. Rxd1 Nxb3
  What was better:  12. Bxe4 h6 13. Bh4 Bf6 14. Bxf6 Ndxf6 15. Bf3 Nf4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 7, 26. Nxg4 (white) — missed chance

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.8 pawns · **Principle:** Check checks, captures and threats

```
On move 26 you played Nxg4. hxg4 was better.

  What you played:  26. Nxg4 e4 27. Bf1 Rad8 28. a4 f5 29. Ne3 Rd2
  What was better:  26. hxg4 Rfd8 27. Be4 Rac8 28. c4 Rd4 29. Bd5 f6

Your move wasn't a disaster, but hxg4 would have improved material.
After the better line: material balance +2. After yours: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 7, 36. a5 (white) — consequence

- **Outcome:** revealed during the game, 4 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before.
- **Eval gap:** 1.0 pawns · **Principle:** Check checks, captures and threats

```
On move 36 you played a5. f3 was better.

  What you played:  36. a5 Rdh8 37. Rd2 Rxh3 38. f3 Kf4
  What was better:  36. f3 Rdh8 37. fxe4 Kxe4 38. Rc1 R8h7

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 23... e4 (black) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 2.5 pawns · **Principle:** Check checks, captures and threats

```
On move 23 you played e4. Bf7 was better.

  What you played:  23...e4 24. Bxc6 g4 25. Ba5 Bxc6 26. Bxd8 Bd5
  What was better:  23...Bf7 24. Qd1 dxe3 25. fxe3 g4 26. Bxc6 gxh3

The difference is material. Before your move: material balance -3.
After your line: material balance -8. After the better line: material balance -5.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 25... Bh5 (black) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 2.0 pawns · **Principle:** Check checks, captures and threats

```
On move 25 you played Bh5. Bf7 was better.

  What you played:  25...Bh5 26. Bc6 Rd7 27. Bxd7 Qxd7 28. exd4
  What was better:  25...Bf7 26. Rxd6 Bxb3 27. Rxd8+ Ka7 28. Rd6

The difference is material. Before your move: material balance -6.
After your line: material balance -9. After the better line: material balance -5.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 27... Nd7 (black) — consequence

- **Outcome:** revealed during the game, 6 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a queen, a rook, a knight and taken a queen: overall you're 8 pawns down. And more is about to fall.
- **Eval gap:** 10.1 pawns · **Principle:** Check checks, captures and threats

```
On move 27 you played Nd7. Rxd6 was better.

  What you played:  27...Nd7 28. Bd5 Ne5 29. Rxd8+ Ka7
  What was better:  27...Rxd6 28. Qb4 Qc7 29. exd4 Rc6

The difference is material. Before your move: material balance -5.
After your line: material balance -15. After the better line: material balance -5.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 4... e6 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You're about to lose material.
- **Eval gap:** 1.0 pawns · **Principle:** Check checks, captures and threats

```
On move 4 you played e6. Nxd5 was better.

  What you played:  4...e6 5. dxe6 Bxe6 6. Bb5+ Nc6 7. O-O Be7 8. Bxc6+
  What was better:  4...Nxd5 5. Be2 e6 6. d4 cxd4 7. Nxd4 Be7 8. e4

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 6... g5 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a pawn: you're 1 pawn worse off than before. And more is about to fall.
- **Eval gap:** 1.9 pawns · **Principle:** Check checks, captures and threats

```
On move 6 you played g5. Nxd5 was better.

  What you played:  6...g5 7. dxe6 fxe6 8. Nxg5 Nc6 9. O-O Qe7 10. f4
  What was better:  6...Nxd5 7. O-O Nc6 8. Nc3 a6 9. Bc4 Nb6 10. Be2

The difference is material. Before your move: material balance +0.
After your line: material balance -2. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 9, 14. Nxd4 (white) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 1.1 pawns · **Principle:** Don't leave pieces undefended

```
On move 14 you played Nxd4. exd4 was better.

  What you played:  14. Nxd4 Bxg2 15. Rg1 Bd5 16. a4
  What was better:  14. exd4 Be7 15. O-O O-O 16. Ne5

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.
Your move left this undefended: pawn on g2.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 9, 23. Nf5 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a knight: you're 3 pawns worse off than before.
- **Eval gap:** 2.8 pawns · **Principle:** Don't leave pieces undefended

```
On move 23 you played Nf5. Bxb7 was better.

  What you played:  23. Nf5 exf5 24. Bxb7 Rxb7 25. Rd3 Na5 26. Rc3 O-O
  What was better:  23. Bxb7 Kxe7 24. Rd3 Na5 25. Bf3 Rhc8 26. Kg1 Nc4

The difference is material. Before your move: material balance +0.
After your line: material balance -3. After the better line: material balance +0.
Your move left this undefended: the piece you moved, now on f5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 9, 5. Be2 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You're about to lose material.
- **Eval gap:** 1.0 pawns · **Principle:** Check checks, captures and threats

```
On move 5 you played Be2. dxc5 was better.

  What you played:  5. Be2 e6 6. O-O Qc7 7. dxc5 Bxc5
  What was better:  5. dxc5 a5 6. c4 e6 7. cxd5 exd5

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 10, 16... Be7 (black) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 1.0 pawns · **Principle:** Check checks, captures and threats

```
On move 16 you played Be7. g6 was better.

  What you played:  16...Be7 17. b4 Nd4 18. a4 O-O 19. b5 Nxb5 20. axb5
  What was better:  16...g6 17. a4 Qa5 18. h5 g5 19. b4 Nxb4 20. Nc7+

The difference is material. Before your move: material balance +1.
After your line: material balance +0. After the better line: material balance +2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 10, 22... fxe4 (black) — consequence

- **Outcome:** revealed during the game, 5 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a rook, a knight and taken 3 pawns: overall you're 5 pawns down.
- **Eval gap:** 1.2 pawns · **Principle:** Don't leave pieces undefended

```
On move 22 you played fxe4. f4 was better.

  What you played:  22...fxe4 23. Nxb4 Rxf2+
  What was better:  22...f4 23. Nxb4 fxg3

The difference is material. Before your move: material balance -1.
After your line: material balance -7. After the better line: material balance -4.
Your move left this undefended: knight on b4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 11, 10. h4 (white) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 0.7 pawns · **Principle:** Check checks, captures and threats

```
On move 10 you played h4. Nxg5 was better.

  What you played:  10. h4 Bf6 11. g4 c6 12. Nc3 Nd7 13. g5 Be7
  What was better:  10. Nxg5 Qxg5 11. O-O Ne7 12. Re1 Nc6 13. Qxb5 O-O

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 11, 11. O-O (white) — consequence

- **Outcome:** revealed during the game, 7 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a queen and taken a rook, a pawn: overall you're 3 pawns down. And more is about to fall.
- **Eval gap:** 1.3 pawns · **Principle:** Check checks, captures and threats

```
On move 11 you played O-O. Nbd2 was better.

  What you played:  11. O-O Ne7 12. Re1 O-O 13. Nc3 c6
  What was better:  11. Nbd2 Qd7 12. O-O-O Nc6 13. g4 Be7

The difference is material. Before your move: material balance -2.
After your line: material balance -3. After the better line: material balance -2.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 11, 7. Bg5 (white) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You're about to lose material.
- **Eval gap:** 3.3 pawns · **Principle:** Check checks, captures and threats

```
On move 7 you played Bg5. Qxd3 was better.

  What you played:  7. Bg5 Be7 8. Qxd3 Bxg5 9. Qb3 Be7 10. Qxb7 Nd7
  What was better:  7. Qxd3 c6 8. Qe2+ Qe7 9. Be3 Qe6 10. Ng5 Qg6

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 11, 9. Qb3 (white) — missed chance

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 0.8 pawns · **Principle:** Check checks, captures and threats

```
On move 9 you played Qb3. O-O was better.

  What you played:  9. Qb3 b6 10. Nxg5 Qxg5 11. Nc3 c6 12. O-O Ne7
  What was better:  9. O-O Bf6 10. Qb5+ Nd7 11. Qxd5 c6 12. Qb3 Ne7

Your move wasn't a disaster, but O-O would have improved material.
After the better line: material balance -1. After yours: material balance -3.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 12, 13... Nfd5 (black) — consequence

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 1.3 pawns · **Principle:** Check checks, captures and threats

```
On move 13 you played Nfd5. Nxa2 was better.

  What you played:  13...Nfd5 14. e4 Nxa2 15. exd5 exd5 16. Bd3 Nc3 17. Rb3
  What was better:  13...Nxa2 14. Bxd6 Rd8 15. Be7 Rd7 16. Bxf6 gxf6 17. Bc4

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 12, 14... b5 (black) — consequence

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** You've lost a knight: you're 3 pawns worse off than before.
- **Eval gap:** 1.2 pawns · **Principle:** Don't leave pieces undefended

```
On move 14 you played b5. Re8 was better.

  What you played:  14...b5 15. exd5
  What was better:  14...Re8 15. Rb2

The difference is material. Before your move: material balance -1.
After your line: material balance -4. After the better line: material balance -1.
Your move left this undefended: pawn on d6, knight on d5, the piece you moved, now on b5.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 12, 16... b4 (black) — consequence

- **Outcome:** revealed during the game, 5 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a rook, a bishop, a pawn and taken a bishop: overall you're 6 pawns down.
- **Eval gap:** 1.3 pawns · **Principle:** Check checks, captures and threats

```
On move 16 you played b4. exd5 was better.

  What you played:  16...b4 17. Kd1 e5 18. Kxc2 Bf5+
  What was better:  16...exd5 17. Kd1 Bf5 18. Bxd6 Rfd8

The difference is material. Before your move: material balance -4.
After your line: material balance -7. After the better line: material balance -4.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 12, 7... O-O (black) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** Since that move you've lost a bishop and taken a pawn: overall you're 2 pawns down.
- **Eval gap:** 3.3 pawns · **Principle:** Check checks, captures and threats

```
On move 7 you played O-O. Qd8 was better.

  What you played:  7...O-O 8. b4 Bxb4 9. cxb4 Qxb4 10. Qc1 Nc6
  What was better:  7...Qd8 8. e4 O-O 9. e5 Nh5 10. Be3 Bxe3

The difference is material. Before your move: material balance +0.
After your line: material balance -1. After the better line: material balance +0.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### mobility (6)

#### Game 2, 31... Bxd6 (black) — consequence

- **Outcome:** never punished (would be in the review)
- **What happened in the game:** —
- **Eval gap:** 2.0 pawns · **Principle:** Keep your pieces active

```
On move 31 you played Bxd6. Bxf5 was better.

  What you played:  31...Bxd6 32. Bh7+ Kf8 33. Bxd6+ Ke8 34. Bg6+ Kd7 35. Be5
  What was better:  31...Bxf5 32. Nxf5 Bf8 33. Re1 Nc5 34. Ne7+ Kg7 35. Nxc6

The difference is piece activity. Before your move: 16 piece moves available vs opponent's 38.
After your line: 7 piece moves available vs opponent's 39. After the better line: 16 piece moves available vs opponent's 36.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 28. Rxc8 (white) — missed chance

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 0.8 pawns · **Principle:** Keep your pieces active

```
On move 28 you played Rxc8. Bxe4 was better.

  What you played:  28. Rxc8 Nxc8 29. h3 Qxd4+ 30. Be3
  What was better:  28. Bxe4 Qxd4+ 29. Be3 Qxe4 30. Qa2

Your move wasn't a disaster, but Bxe4 would have improved piece activity.
After the better line: 41 piece moves available vs opponent's 44. After yours: 32 piece moves available vs opponent's 43.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 11... Nb4 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.9 pawns · **Principle:** Keep your pieces active

```
On move 11 you played Nb4. e5 was better.

  What you played:  11...Nb4 12. Be2 O-O 13. O-O b6
  What was better:  11...e5 12. Bh2 Be6 13. Na4 Qb4+

Your move wasn't a disaster, but e5 would have improved piece activity.
After the better line: 41 piece moves available vs opponent's 34. After yours: 34 piece moves available vs opponent's 39.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 25... Rc6 (black) — missed chance

- **Outcome:** overtaken by a later mistake of the same kind
- **What happened in the game:** —
- **Eval gap:** 1.3 pawns · **Principle:** Keep your pieces active

```
On move 25 you played Rc6. Qc6 was better.

  What you played:  25...Rc6 26. e4 Rb6 27. Qd3
  What was better:  25...Qc6 26. Rab1 Qc2 27. Qxb7

Your move wasn't a disaster, but Qc6 would have improved piece activity.
After the better line: 44 piece moves available vs opponent's 31. After yours: 28 piece moves available vs opponent's 31.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 26... a6 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.4 pawns · **Principle:** Keep your pieces active

```
On move 26 you played a6. Rb6 was better.

  What you played:  26...a6 27. exd5 Rc5 28. dxe6 Qxe6 29. Qxe6 fxe6
  What was better:  26...Rb6 27. Qd3 Bf6 28. exd5 g4 29. dxe6 Qxd3

Your move wasn't a disaster, but Rb6 would have improved piece activity.
After the better line: 41 piece moves available vs opponent's 18. After yours: 16 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 9, 18. O-O (white) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.0 pawns · **Principle:** Keep your pieces active

```
On move 18 you played O-O. Rd1 was better.

  What you played:  18. O-O Kd7 19. Nd4 Bxf3 20. gxf3 Rhc8 21. Rfd1
  What was better:  18. Rd1 Bf8 19. b4 Na4 20. O-O Nb2 21. Rc1

Your move wasn't a disaster, but Rd1 would have improved piece activity.
After the better line: 25 piece moves available vs opponent's 15. After yours: 23 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### own_pawns (5)

#### Game 3, 18. Be3 (white) — consequence

- **Outcome:** revealed during the game, 9 move(s) after the mistake
- **What happened in the game:** Your pawn structure has been damaged (isolated pawn(s) on h2).
- **Eval gap:** 1.5 pawns · **Principle:** Avoid weakening your pawns

```
On move 18 you played Be3. Nxd5 was better.

  What you played:  18. Be3 Bb3 19. Qd2 f4 20. gxf4 Qc7 21. fxe5 Qxe5
  What was better:  18. Nxd5 Qxd5 19. Bc3 Qe6 20. Rfd1 e4 21. Qd2 Rfd8

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on h2. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 5, 20. Rac1 (white) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 0.8 pawns · **Principle:** Avoid weakening your pawns

```
On move 20 you played Rac1. a4 was better.

  What you played:  20. Rac1 cxd4 21. exd4 Bxa3 22. Ra1 Bb2 23. Rxa7
  What was better:  20. a4 h5 21. a5 c4 22. e4 Nxe4 23. Nxe4

The difference is your pawn structure. Before your move: backward pawn(s) on e3.
After your line: isolated pawn(s) on d4, b5. After the better line: isolated pawn(s) on d4.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 7, 29. Nh2 (white) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 0.8 pawns · **Principle:** Avoid weakening your pawns

```
On move 29 you played Nh2. Ne3 was better.

  What you played:  29. Nh2 Rh8 30. Kg2 a6 31. Bc4 b5 32. Bb3
  What was better:  29. Ne3 Rd2 30. Bc4 Rh8 31. Kg2 f4 32. Ng4

The difference is your pawn structure. Before your move: isolated pawn(s) on f2, h3.
After your line: isolated pawn(s) on f2, h3; backward pawn(s) on c3. After the better line: isolated pawn(s) on f2, h3.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 7, 7. Re1 (white) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 0.8 pawns · **Principle:** Avoid weakening your pawns

```
On move 7 you played Re1. Bg5 was better.

  What you played:  7. Re1 Nxf4 8. exf4 c5 9. Bf1 cxd4
  What was better:  7. Bg5 h6 8. Bh4 c5 9. c3 b6

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: doubled pawns on the f-file. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 9, 24. Rd3 (white) — consequence

- **Outcome:** revealed during the game, 2 move(s) after the mistake
- **What happened in the game:** Your pawn structure has been damaged (isolated pawn(s) on h3; doubled pawns on the f-file).
- **Eval gap:** 1.1 pawns · **Principle:** Avoid weakening your pawns

```
On move 24 you played Rd3. Bxb7 was better.

  What you played:  24. Rd3 Bxf3 25. gxf3 Nc5 26. Rc3 Ne6 27. Rfc1 Rxc3
  What was better:  24. Bxb7 Rxb7 25. Rd3 Na5 26. Rc3 Ke7 27. Rfc1 Rhb8

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on h3; doubled pawns on the f-file. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### open_files (4)

#### Game 2, 12... Ng4 (black) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 2.0 pawns · **Principle:** Rooks belong on open files

```
On move 12 you played Ng4. dxc4 was better.

  What you played:  12...Ng4 13. Nf7 Bxf2+ 14. Kh1
  What was better:  12...dxc4 13. Nf7 Nxf7 14. exf7+

The difference is rooks on open files. Before your move: your rooks on open files: none; theirs: none.
After your line: your rooks on open files: none; theirs: f1. After the better line: your rooks on open files: none; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 3, 24. Rd1 (white) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 2.1 pawns · **Principle:** Rooks belong on open files

```
On move 24 you played Rd1. Bxe7 was better.

  What you played:  24. Rd1 Bxc5 25. Qb2 f4 26. gxf4
  What was better:  24. Bxe7 Rxc1 25. Rexc1 Qxe7 26. Rc7

Your move wasn't a disaster, but Bxe7 would have improved rooks on open files.
After the better line: your rooks on open files: c7; theirs: none. After yours: your rooks on open files: d1; theirs: c8, f8.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 16... Rxc3 (black) — consequence

- **Outcome:** never punished (would be in the review)
- **What happened in the game:** —
- **Eval gap:** 1.0 pawns · **Principle:** Rooks belong on open files

```
On move 16 you played Rxc3. Rd8 was better.

  What you played:  16...Rxc3 17. Qxc3 Qxc3+ 18. bxc3 Ne4 19. f3 Nxc3 20. Rc1
  What was better:  16...Rd8 17. O-O Bd7 18. Nxd7 Nxd7 19. Rd1 Rac8 20. Qc2

The difference is rooks on open files. Before your move: your rooks on open files: d3; theirs: none.
After your line: your rooks on open files: none; theirs: c1. After the better line: your rooks on open files: c8, d8; theirs: d1.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 7, 37. Rc1 (white) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.6 pawns · **Principle:** Rooks belong on open files

```
On move 37 you played Rc1. f3 was better.

  What you played:  37. Rc1 Rdh8 38. b5 Rxh3 39. bxa6
  What was better:  37. f3 Kf6 38. Rd2 exf3+ 39. Bxf3

Your move wasn't a disaster, but f3 would have improved rooks on open files.
After the better line: your rooks on open files: d2; theirs: h4, d8. After yours: your rooks on open files: none; theirs: h3, h8.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### passed_pawns (4)

#### Game 4, 32... Qd5+ (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.6 pawns · **Principle:** Passed pawns must be pushed (or stopped)

```
On move 32 you played Qd5+. Bxd7 was better.

  What you played:  32...Qd5+ 33. e4 Qxe4+ 34. Kh2 Bxd7 35. cxd7 Qd5
  What was better:  32...Bxd7 33. cxd7 Qd5+ 34. Qf3 Qxd7 35. Rd1 Qc8

Your move wasn't a disaster, but Bxd7 would have improved passed pawns.
After the better line: your passed pawns: none; theirs: none. After yours: your passed pawns: none; theirs: d7.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 7, 17. Qxd4 (white) — consequence

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 1.1 pawns · **Principle:** Passed pawns must be pushed (or stopped)

```
On move 17 you played Qxd4. cxd4 was better.

  What you played:  17. Qxd4 Qxd4 18. cxd4 Nd3 19. Bxd3 exd3 20. Rad1 Rd8
  What was better:  17. cxd4 Nd3 18. Bxd3 exd3 19. Qxd3 Be6 20. Ne3 Qd6

The difference is passed pawns. Before your move: your passed pawns: none; theirs: none.
After your line: your passed pawns: none; theirs: d3. After the better line: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 7, 32. Kg2 (white) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.1 pawns · **Principle:** Passed pawns must be pushed (or stopped)

```
On move 32 you played Kg2. b5 was better.

  What you played:  32. Kg2 Rd2 33. Kg1 Rhd8 34. a5 Rd1 35. Rxd1 Rxd1
  What was better:  32. b5 Rd2 33. bxa6 bxa6 34. c4 Rhd8 35. c5 Rd1

Your move wasn't a disaster, but b5 would have improved passed pawns.
After the better line: your passed pawns: c5; theirs: none. After yours: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 10, 19... Bb5 (black) — missed chance

- **Outcome:** student fixed it in time
- **What happened in the game:** —
- **Eval gap:** 1.7 pawns · **Principle:** Passed pawns must be pushed (or stopped)

```
On move 19 you played Bb5. f5 was better.

  What you played:  19...Bb5 20. a4 f5 21. Bxf5 Rxf5 22. axb5
  What was better:  19...f5 20. Bxf5 Rxf5 21. exf5 Bf6 22. a4

Your move wasn't a disaster, but f5 would have improved passed pawns.
After the better line: your passed pawns: d6; theirs: none. After yours: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### their_pawns (3)

#### Game 5, 12. Qc2 (white) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 0.9 pawns · **Principle:** Create and attack weaknesses

```
On move 12 you played Qc2. g4 was better.

  What you played:  12. Qc2 Bf5 13. Qb3 O-O 14. Nxd5 Nfxd5 15. Bxd5 Nxd5
  What was better:  12. g4 g6 13. h3 h5 14. g5 Ne4 15. Nxe4 dxe4

Your move wasn't a disaster, but g4 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: backward pawn(s) on f7. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 6, 18... Qb5 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 0.7 pawns · **Principle:** Create and attack weaknesses

```
On move 18 you played Qb5. Qxc3+ was better.

  What you played:  18...Qb5 19. a4 Qa6 20. Qc4 Qa5+ 21. Kf2 Nd7 22. Nxd7
  What was better:  18...Qxc3+ 19. bxc3 Nd5 20. c4 Nxf4 21. exf4 f6 22. Ng4

Your move wasn't a disaster, but Qxc3+ would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on a2, c4; doubled pawns on the f-file. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


#### Game 8, 24... Bd6 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 2.6 pawns · **Principle:** Create and attack weaknesses

```
On move 24 you played Bd6. Bxc6 was better.

  What you played:  24...Bd6 25. Rxd6 Rxd6 26. Bxe8 Nxe8 27. exd4
  What was better:  24...Bxc6 25. Bxc6 g4 26. hxg4 Bh6 27. exd4

Your move wasn't a disaster, but Bxc6 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on d4; doubled pawns on the g-file. After yours: opponent's pawns: isolated pawn(s) on d4.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### development (1)

#### Game 8, 10... Qe7 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.0 pawns · **Principle:** Develop your knights and bishops first

```
On move 10 you played Qe7. a6 was better.

  What you played:  10...Qe7 11. Ne5 Qg7 12. O-O Nxe5 13. dxe5 Bxb5 14. axb5
  What was better:  10...a6 11. Bd3 Rg8 12. Ne5 Bd6 13. Bg6+ Ke7 14. Nf7

Your move wasn't a disaster, but a6 would have improved development.
After the better line: all minor pieces developed. After yours: undeveloped: bishop on f8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### king_safety (1)

#### Game 10, 13... Ba6 (black) — missed chance

- **Outcome:** revealed during the game, 1 move(s) after the mistake
- **What happened in the game:** The chance has gone.
- **Eval gap:** 1.3 pawns · **Principle:** Keep your king safe

```
On move 13 you played Ba6. Be7 was better.

  What you played:  13...Ba6 14. Bh3 Rb8 15. Rc1 Be7 16. Kg2
  What was better:  13...Be7 14. Bh3 Rb8 15. Kg2 O-O 16. Nf3

Your move wasn't a disaster, but Be7 would have improved king safety.
After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it. After yours: 2 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:


### centre (1)

#### Game 11, 16. Ne5 (white) — consequence

- **Outcome:** never punished (would be in the review)
- **What happened in the game:** —
- **Eval gap:** 1.0 pawns · **Principle:** Control the centre

```
On move 16 you played Ne5. h5 was better.

  What you played:  16. Ne5 Nc5 17. dxc5 Bxe5 18. Rae1 Bf6
  What was better:  16. h5 Qb8 17. Qb3 Kh8 18. Qxb8 Rfxb8

The difference is control of the centre. Before your move: centre control 5 vs 8.
After your line: centre control 2 vs 8. After the better line: centre control 5 vs 7.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Grade: ☐ right ☐ partly right ☐ wrong reason — notes:

