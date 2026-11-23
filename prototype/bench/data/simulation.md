# Simulation report

8 games per configuration. Student: Stockfish skill 0 (0.01s/move). Opponent normal mode: Stockfish skill 3. Analysis depth 10. Max 50 moves per game. Took 32s.

| Metric | teaching opponent |
|---|---|
| Lessons per game | 4.0 |
| Consequence lessons | 20 |
| …of which landed in the real game | 0.8 |
| Median moves from mistake to consequence | 1.5 |
| Longest delay (moves) | 5.0 |
| Missed-chance lessons | 12 |
| Share of opponent moves levelled up | 0.17 |

## teaching opponent

- Consequence lesson outcomes: {'triggered': 16, 'fixed': 1, 'expired': 2, 'superseded': 1}
- Missed-chance outcomes: {'triggered': 10, 'fixed': 2}
- Features: {'material': 21, 'own_pawns': 4, 'open_files': 3, 'centre': 2, 'mobility': 1, 'their_pawns': 1}
- Principles: Check checks, captures and threats (13), Don't leave pieces undefended (8), Avoid weakening your pawns (4), Rooks belong on open files (3), Control the centre (2), Keep your pieces active (1), Create and attack weaknesses (1)
- Game results: {'0-1': 3, '1-0': 4, '*': 1}

## Sample lessons (teaching opponent)

These are the template explanations; judge whether they're correct and useful.

### Game 0, 11. Nxc4 (white) — material, missed_chance

**What happened:** The chance has gone.  
**Delay:** 1.0 moves; **eval gap:** 98cp

```
On move 11 you played Nxc4. exd4 was better.

  What you played:  11. Nxc4 dxe3 12. Bxe3 Be7 13. a3 Nd5 14. b4 Nxe3
  What was better:  11. exd4 Bd6 12. Nxc4 O-O 13. Be3 Bf4 14. Nfe5 Nd5

Your move wasn't a disaster, but exd4 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### Game 0, 12. Ncd2 (white) — mobility, missed_chance

**What happened:** The chance has gone.  
**Delay:** 1.0 moves; **eval gap:** 86cp

```
On move 12 you played Ncd2. Na3 was better.

  What you played:  12. Ncd2 dxe3 13. fxe3 Rb8 14. Nb3 Bd6 15. Bd2
  What was better:  12. Na3 dxe3 13. Bxe3 a6 14. Rc1 Rd8 15. Bd3

Your move wasn't a disaster, but Na3 would have improved piece activity.
After the better line: 42 piece moves available vs opponent's 35. After yours: 26 piece moves available vs opponent's 35.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### Game 1, 13... Bf6 (black) — own_pawns, missed_chance

**What happened:** The chance has gone.  
**Delay:** 1.0 moves; **eval gap:** 94cp

```
On move 13 you played Bf6. h5 was better.

  What you played:  13...Bf6 14. h5 O-O 15. e5 Bg7 16. h6
  What was better:  13...h5 14. dxe5 hxg4 15. Qxg4 Nb4 16. Rd1

Your move wasn't a disaster, but h5 would have improved your pawn structure.
After the better line: no pawn weaknesses. After yours: backward pawn(s) on c6.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

### Game 4, 19. f4 (white) — centre, consequence

**What happened:** Your opponent has taken over the centre (centre control 3 vs 7).  
**Delay:** 3.0 moves; **eval gap:** 278cp

```
On move 19 you played f4. Bd4 was better.

  What you played:  19. f4 bxc5 20. fxe5 Qxe5 21. Kf1
  What was better:  19. Bd4 Qxa3 20. Bxe5 Qxc5 21. f4

The difference is control of the centre. Before your move: centre control 5 vs 5.
After your line: centre control 3 vs 7. After the better line: centre control 5 vs 5.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### Game 5, 13... a6 (black) — their_pawns, missed_chance

**What happened:** The chance has gone.  
**Delay:** 1.0 moves; **eval gap:** 85cp

```
On move 13 you played a6. Qxb2 was better.

  What you played:  13...a6 14. Nf4 axb5 15. Nxe6 Qxh8 16. Nxc7+ Kd7 17. Nxa8
  What was better:  13...Qxb2 14. Rb1 Qg7 15. Nxg6 Qxg6 16. Nxc7+ Kf7 17. Nxa8

Your move wasn't a disaster, but Qxb2 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on a2, c2. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### Game 6, 13. Qc2 (white) — open_files, missed_chance

**What happened:** The chance has gone.  
**Delay:** 1.0 moves; **eval gap:** 83cp

```
On move 13 you played Qc2. Rc1 was better.

  What you played:  13. Qc2 dxc4 14. Qxc4 Be7 15. Rac1 Rc8 16. Qd4
  What was better:  13. Rc1 Be7 14. cxd5 Bxd5 15. e4 Bb7 16. e5

Your move wasn't a disaster, but Rc1 would have improved rooks on open files.
After the better line: your rooks on open files: c1; theirs: none. After yours: your rooks on open files: c1; theirs: c8.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### Game 0, 13. Nxd4 (white) — material, missed_chance

**What happened:** The chance has gone.  
**Delay:** 1.0 moves; **eval gap:** 70cp

```
On move 13 you played Nxd4. Nb3 was better.

  What you played:  13. Nxd4 Nxd4 14. exd4 Bxd4 15. Ne4 Qe5 16. Nxf6+
  What was better:  13. Nb3 Bb6 14. Nbxd4 Nxd4 15. Nxd4 Qe5 16. b3

Your move wasn't a disaster, but Nb3 would have improved material.
After the better line: material balance +0. After yours: material balance -1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### Game 0, 17. Bf4 (white) — material, consequence

**What happened:** You've lost a bishop: you're 3 pawns worse off than before.  
**Delay:** 1.0 moves; **eval gap:** 492cp

```
On move 17 you played Bf4. Bxf3 was better.

  What you played:  17. Bf4 Qxf4 18. Bxf3 O-O 19. Bxa8 Rxa8 20. Rad1 Rd8
  What was better:  17. Bxf3 Rb8 18. Rd1 Bc5 19. Be3 Bxe3 20. Qxe3 O-O

The difference is material. Before your move: material balance -1.
After your line: material balance -2. After the better line: material balance -1.
Your move left this undefended: bishop on e2, the piece you moved, now on f4.

Principle: Don't leave pieces undefended. Before you move, check that every piece is protected, and that the move doesn't remove a defender from something else.
```
