# Simulation report

12 games per configuration. Student: Stockfish skill 0 (0.01s/move). Opponent normal mode: Stockfish skill 3. Analysis depth 10. Max 50 moves per game. Took 100s.

| Metric | teaching opponent | no level-up (control) |
|---|---|---|
| Lessons per game | 3.3 | 6.3 |
| Consequence lessons | 26 | 51 |
| …of which landed in the real game | 0.77 | 0.51 |
| Median moves from mistake to consequence | 2.0 | 1.0 |
| Longest delay (moves) | 8.0 | 9.0 |
| Missed-chance lessons | 14 | 25 |
| Share of opponent moves levelled up | 0.14 | 0.0 |

## teaching opponent

- Consequence lesson outcomes: {'triggered': 20, 'expired': 3, 'superseded': 3}
- Missed-chance outcomes: {'fixed': 2, 'triggered': 11, 'superseded': 1}
- Features: {'material': 21, 'king_safety': 5, 'their_pawns': 4, 'mobility': 3, 'passed_pawns': 2, 'own_pawns': 2, 'mate': 1, 'open_files': 1, 'centre': 1}
- Principles: Check checks, captures and threats (19), Keep your king safe (5), Create and attack weaknesses (4), Don't leave pieces undefended (3), Keep your pieces active (3), Passed pawns must be pushed (or stopped) (2), Avoid weakening your pawns (2), Rooks belong on open files (1), Control the centre (1)
- Game results: {'*': 2, '1-0': 7, '0-1': 3}

## no level-up (control)

- Consequence lesson outcomes: {'superseded': 10, 'triggered': 26, 'fixed': 11, 'expired': 4}
- Missed-chance outcomes: {'triggered': 20, 'fixed': 3, 'superseded': 2}
- Features: {'material': 51, 'mobility': 6, 'own_pawns': 5, 'open_files': 4, 'passed_pawns': 4, 'their_pawns': 3, 'development': 1, 'king_safety': 1, 'centre': 1}
- Principles: Check checks, captures and threats (41), Don't leave pieces undefended (10), Keep your pieces active (6), Avoid weakening your pawns (5), Rooks belong on open files (4), Passed pawns must be pushed (or stopped) (4), Create and attack weaknesses (3), Develop your knights and bishops first (1), Keep your king safe (1), Control the centre (1)
- Game results: {'*': 3, '1-0': 6, '0-1': 3}

## Sample lessons (teaching opponent)

These are the template explanations; judge whether they're correct and useful.

### Game 1, 18... f6 (black) — material, consequence

**What happened:** Since that move you've lost a bishop and taken a pawn: overall you're 2 pawns down. And more is about to fall.  
**Delay:** 2.0 moves; **eval gap:** 471cp

```
On move 18 you played f6. Bxb4 was better.

  What you played:  18...f6 19. Bg3 Qg5 20. bxc5 b6 21. O-O Qxc5 22. Bd6
  What was better:  18...Bxb4 19. O-O Qh5 20. Bd4 e5 21. Nd5 exd4 22. Nxb4

The difference is material. Before your move: material balance +1.
After your line: material balance -2. After the better line: material balance +1.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### Game 1, 43... Qc1 (black) — mate, consequence

**What happened:** You've been checkmated.  
**Delay:** 1.0 moves; **eval gap:** 9572cp

```
On move 43 you played Qc1. Rd8 was better.

  What you played:  43...Qc1 44. Re8#
  What was better:  43...Rd8 44. Qe6+

After your move, your opponent had a forced checkmate.

Principle: Check checks, captures and threats. Before every move, ask: what can my opponent capture, which checks do they have, and what does their last move threaten?
```

### Game 2, 7. Ne4 (white) — mobility, consequence

**What happened:** Your pieces have run short of squares (23 piece moves available vs opponent's 29).  
**Delay:** 2.0 moves; **eval gap:** 72cp

```
On move 7 you played Ne4. Nf3 was better.

  What you played:  7. Ne4 Bc6 8. Qe2 e6 9. Nf3 Nxe4 10. dxe4
  What was better:  7. Nf3 e6 8. d4 a6 9. Bd3 c5 10. Be3

The difference is piece activity. Before your move: 23 piece moves available vs opponent's 17.
After your line: 23 piece moves available vs opponent's 28. After the better line: 37 piece moves available vs opponent's 21.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

### Game 3, 13... Ke7 (black) — king_safety, missed_chance

**What happened:** The chance has gone.  
**Delay:** 4.0 moves; **eval gap:** 121cp

```
On move 13 you played Ke7. N8d7 was better.

  What you played:  13...Ke7 14. Nd2 N8d7 15. O-O Rb8 16. Bxa6 Rxb2 17. Nb5
  What was better:  13...N8d7 14. Nd2 Nh5 15. Bc6 Rb8 16. O-O O-O 17. Nc4

Your move wasn't a disaster, but N8d7 would have improved king safety.
After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it. After yours: 2 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

### Game 7, 23... Qb4 (black) — open_files, missed_chance

**What happened:** The chance has gone.  
**Delay:** 1.0 moves; **eval gap:** 158cp

```
On move 23 you played Qb4. Rad8 was better.

  What you played:  23...Qb4 24. Qxb4 Nxb4
  What was better:  23...Rad8 24. d5 Bxf3

Your move wasn't a disaster, but Rad8 would have improved rooks on open files.
After the better line: your rooks on open files: d8; theirs: f1. After yours: your rooks on open files: none; theirs: f1.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

### Game 7, 26... Rc8 (black) — centre, missed_chance

**What happened:** The chance has gone.  
**Delay:** 1.0 moves; **eval gap:** 140cp

```
On move 26 you played Rc8. f5 was better.

  What you played:  26...Rc8 27. d5 g5 28. a3 Nc2 29. Kf2
  What was better:  26...f5 27. exf5 Nc6 28. Be4 Rfe8 29. Rde1

Your move wasn't a disaster, but f5 would have improved control of the centre.
After the better line: centre control 6 vs 8. After yours: centre control 1 vs 9.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

### Game 7, 29... Rfd8 (black) — their_pawns, missed_chance

**What happened:** The chance has gone.  
**Delay:** 1.0 moves; **eval gap:** 212cp

```
On move 29 you played Rfd8. fxe4 was better.

  What you played:  29...Rfd8 30. e5 g6 31. e6 Nc6 32. Rb3 Na5 33. Rg3
  What was better:  29...fxe4 30. Re3 Rcd8 31. d7 Nc6 32. Rxe4 Rf6 33. Re8+

Your move wasn't a disaster, but fxe4 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on g2, d7. After yours: opponent's pawns: isolated pawn(s) on g2.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

### Game 8, 19. Nf1 (white) — own_pawns, consequence

**What happened:** Your pawn structure has been damaged (isolated pawn(s) on e3; backward pawn(s) on b3).  
**Delay:** 3.0 moves; **eval gap:** 218cp

```
On move 19 you played Nf1. O-O was better.

  What you played:  19. Nf1 Qxg2 20. Rh2 Qg1 21. h4 h6 22. Bb5 exd4
  What was better:  19. O-O Rf6 20. Bg4 Rg6 21. f4 exf4 22. exf4 Qe7

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on h4; backward pawn(s) on f2. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```
