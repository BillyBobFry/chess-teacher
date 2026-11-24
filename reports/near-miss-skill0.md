# Near-miss strategic lessons: what a lower bar would add

20 simulated games (student: Stockfish skill 0, 10 ms/move; opponent skill 3, levelling up; analysis depth 10; at most 50 moves). 744 student moves. Took 74 s.

A near miss is a strategic lesson with an eval gap between 35 and 70 centipawns: today's detection would find it at a lower bar, but never teaches it.

## Summary

| | Total | Per game |
|---|---|---|
| Lessons taught today | 61 | 3.0 |
| …of which strategic | 9 | 0.5 |
| Strategic lessons today's check rejected | 24 | 1.2 |
| Near misses found at 35 cp | 35 | 1.8 |
| …kept by the classical check | **9** | **0.5** |
| …rejected by the classical check | 26 | 1.3 |
| …of kept, the app taught something else at the same move | 0 | |

## Lessons taught today, by kind

Material lessons sorted by what happened: the student lost their own material (blunder), left a capture that was already on the board (missed free material), or the better line won material by force (missed tactic).

| Category | Count |
|---|---|
| tactics: blunder (consequence) | 30 |
| tactics: missed tactic (missed_chance) | 11 |
| tactics: missed free material (consequence) | 11 |
| strategy (missed_chance) | 5 |
| strategy (consequence) | 4 |

## Near misses by feature

| Feature | Consequence | Missed chance | Kept | Rejected |
|---|---|---|---|---|
| mobility | 3 | 1 | 3 | 1 |
| development | 0 | 7 | 2 | 5 |
| centre | 1 | 2 | 2 | 1 |
| king_safety | 0 | 2 | 1 | 1 |
| their_pawns | 0 | 7 | 1 | 6 |
| own_pawns | 5 | 0 | 0 | 5 |
| outposts | 0 | 1 | 0 | 1 |
| king_activity | 1 | 1 | 0 | 2 |
| open_files | 2 | 2 | 0 | 4 |

## Kept near misses

### Game 2, 20... Ke8 (black): mobility, consequence, gap 46 cp

**FEN:** `1r5r/3kppbp/2bq2p1/3p4/N3n3/1P2B3/R1PN1PPP/3Q1RK1 b - - 2 20`  
**Played:** Ke8 Nxe4 dxe4 Qxd6 exd6 Nb6 d5 Rd1  
**Better:** Nc3 Nxc3 Bxc3 Ra7+ Rb7 Ra6 Rc7 Nb1  
**Measured:** before: 45 piece moves available vs opponent's 27 · after yours: 20 piece moves available vs opponent's 30 · after better: 33 piece moves available vs opponent's 32  
**Verdict:** Mobility is a main reason (+0.64)  
**Term gains for the better line:** Mobility +0.64, Bishops +0.37, Rooks +0.19, Knights +0.11, Space +0.06, Queens -0.21, Pawns -0.24, Threats -1.10, King safety -1.14  
**Taught instead at this move:** nothing

```
On move 20 you played Ke8. Nc3 was better.

  What you played:  20...Ke8 21. Nxe4 dxe4 22. Qxd6 exd6 23. Nb6 d5 24. Rd1
  What was better:  20...Nc3 21. Nxc3 Bxc3 22. Ra7+ Rb7 23. Ra6 Rc7 24. Nb1

The difference is piece activity. Before your move: 45 piece moves available vs opponent's 27.
After your line: 20 piece moves available vs opponent's 30. After the better line: 33 piece moves available vs opponent's 32.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 4, 31... Ne4 (black): mobility, consequence, gap 52 cp

**FEN:** `6k1/3n1p1p/1p4p1/1P1p4/2rN4/q1nNP2P/5PP1/2R2QK1 b - - 1 31`  
**Played:** Ne4 Ra1 Qc3 Qd1 Kg7  
**Better:** Ne2+ Nxe2 Qxd3 Rd1 Qe4  
**Measured:** before: 34 piece moves available vs opponent's 22 · after yours: 31 piece moves available vs opponent's 35 · after better: 30 piece moves available vs opponent's 14  
**Verdict:** Mobility is a main reason (+0.55)  
**Term gains for the better line:** Mobility +0.55, King safety +0.21, Rooks +0.09, Threats -0.47  
**Taught instead at this move:** nothing

```
On move 31 you played Ne4. Ne2+ was better.

  What you played:  31...Ne4 32. Ra1 Qc3 33. Qd1 Kg7
  What was better:  31...Ne2+ 32. Nxe2 Qxd3 33. Rd1 Qe4

The difference is piece activity. Before your move: 34 piece moves available vs opponent's 22.
After your line: 31 piece moves available vs opponent's 35. After the better line: 30 piece moves available vs opponent's 14.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 6, 3... Bf5 (black): development, missed_chance, gap 38 cp

**FEN:** `rnbqkbnr/pp2pppp/2p5/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 0 3`  
**Played:** Bf5 cxd5 Bxb1 Rxb1 Qxd5 e3 Qxa2 Bd3  
**Better:** Nf6 e3 e6 Nc3 Be7 Bd3 O-O O-O  
**Measured:** before: undeveloped: knight on b8, knight on g8, bishop on c8, bishop on f8 · after yours: undeveloped: knight on b8, knight on g8, bishop on f8 · after better: undeveloped: knight on b8, bishop on c8  
**Verdict:** Mobility is a main reason (+0.25)  
**Term gains for the better line:** Mobility +0.55, Rooks +0.10, Threats +0.05, Knights -0.09, Bishops -0.21  
**Taught instead at this move:** nothing

```
On move 3 you played Bf5. Nf6 was better.

  What you played:  3...Bf5 4. cxd5 Bxb1 5. Rxb1 Qxd5 6. e3 Qxa2 7. Bd3
  What was better:  3...Nf6 4. e3 e6 5. Nc3 Be7 6. Bd3 O-O 7. O-O

Your move wasn't a disaster, but Nf6 would have improved development.
After the better line: undeveloped: knight on b8, bishop on c8. After yours: undeveloped: knight on b8, knight on g8, bishop on f8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 7, 15. Kg1 (white): centre, missed_chance, gap 43 cp

**FEN:** `r1b2rk1/pp3ppp/2n2q2/bN1p4/3Nn3/4BB2/PP3PPP/R2Q1K1R w - - 10 15`  
**Played:** Kg1 Rd8 h4 Bb6 g3 Bd7 Kg2 Rac8  
**Better:** Nb3 Qxb2 Rb1 Qxa2 Nxa5 Qxa5 Qxd5 Nf6  
**Measured:** before: centre control 5 vs 8 · after yours: centre control 5 vs 9 · after better: centre control 8 vs 4  
**Verdict:** Mobility is a main reason (+0.58)  
**Term gains for the better line:** King safety +1.20, Mobility +0.50, Space +0.08, Bishops -0.15, Passed -0.15, Pawns -0.32, Knights -0.33, Rooks -0.39, Threats -1.09  
**Taught instead at this move:** nothing

```
On move 15 you played Kg1. Nb3 was better.

  What you played:  15. Kg1 Rd8 16. h4 Bb6 17. g3 Bd7 18. Kg2 Rac8
  What was better:  15. Nb3 Qxb2 16. Rb1 Qxa2 17. Nxa5 Qxa5 18. Qxd5 Nf6

Your move wasn't a disaster, but Nb3 would have improved control of the centre.
After the better line: centre control 8 vs 4. After yours: centre control 5 vs 9.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 13, 8. Nf1 (white): centre, missed_chance, gap 50 cp

**FEN:** `r1bqkb1r/pp3pp1/2n1pn1p/3p4/3P4/P2BP3/1P1N1PPP/R1BQK1NR w KQkq - 0 8`  
**Played:** Nf1 e5 dxe5 Nxe5 Be2 Bd6 Bd2 Ne4  
**Better:** Ngf3 Bd6 O-O O-O h3 Qe7 e4 dxe4  
**Measured:** before: centre control 6 vs 9 · after yours: centre control 1 vs 6 · after better: centre control 7 vs 8  
**Verdict:** Mobility is a main reason (+0.59)  
**Term gains for the better line:** King safety +0.83, Mobility +0.53, Rooks +0.21, Bishops +0.14, Space +0.06, Knights -0.34, Pawns -0.35, Threats -2.09  
**Taught instead at this move:** nothing

```
On move 8 you played Nf1. Ngf3 was better.

  What you played:  8. Nf1 e5 9. dxe5 Nxe5 10. Be2 Bd6 11. Bd2 Ne4
  What was better:  8. Ngf3 Bd6 9. O-O O-O 10. h3 Qe7 11. e4 dxe4

Your move wasn't a disaster, but Ngf3 would have improved control of the centre.
After the better line: centre control 7 vs 8. After yours: centre control 1 vs 6.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 14, 8... Na6 (black): their_pawns, missed_chance, gap 51 cp

**FEN:** `rnbqk2r/ppp2ppp/3b4/3Pp3/2P5/2NPB3/PP3PPP/R2QK1NR b KQkq - 4 8`  
**Played:** Na6 Nge2 O-O O-O Re8 d4 c6 h3  
**Better:** O-O h3 f5 Nf3 Nd7 O-O h6 Re1  
**Measured:** before: opponent's pawns: doubled pawns on the d-file; backward pawn(s) on d3 · after yours: opponent's pawns: doubled pawns on the d-file · after better: opponent's pawns: doubled pawns on the d-file; backward pawn(s) on d3  
**Verdict:** Pawns is a main reason (+0.40)  
**Term gains for the better line:** Threats +0.49, Pawns +0.40, Space +0.24, Rooks -0.09, Mobility -0.28, King safety -0.31  
**Taught instead at this move:** nothing

```
On move 8 you played Na6. O-O was better.

  What you played:  8...Na6 9. Nge2 O-O 10. O-O Re8 11. d4 c6 12. h3
  What was better:  8...O-O 9. h3 f5 10. Nf3 Nd7 11. O-O h6 12. Re1

Your move wasn't a disaster, but O-O would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: doubled pawns on the d-file; backward pawn(s) on d3. After yours: opponent's pawns: doubled pawns on the d-file.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 15, 6. Bg5 (white): king_safety, missed_chance, gap 68 cp

**FEN:** `r1bqk1nr/pppn1ppp/8/1BbP4/3p4/5N2/PPP2PPP/RNBQK2R w KQkq - 3 6`  
**Played:** Bg5 Ne7 Nxd4 h6 Bh4 O-O Nb3  
**Better:** O-O Ne7 b4 Bb6 a4 a6 Bxd7+  
**Measured:** before: 1 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it · after yours: 1 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it · after better: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it  
**Verdict:** King safety is a main reason (+0.70)  
**Term gains for the better line:** Mobility +0.78, King safety +0.70, Rooks +0.52, Bishops -0.16, Knights -0.19, Queens -0.25, Space -0.26, Threats -1.15  
**Taught instead at this move:** nothing

```
On move 6 you played Bg5. O-O was better.

  What you played:  6. Bg5 Ne7 7. Nxd4 h6 8. Bh4 O-O 9. Nb3
  What was better:  6. O-O Ne7 7. b4 Bb6 8. a4 a6 9. Bxd7+

Your move wasn't a disaster, but O-O would have improved king safety.
After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it. After yours: 1 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 2... d6 (black): development, missed_chance, gap 42 cp

**FEN:** `rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2`  
**Played:** d6 d4 exd4 Nxd4 Nf6 Nc3  
**Better:** Nf6 Nc3 Nc6 Bb5 Bc5 O-O  
**Measured:** before: undeveloped: knight on b8, knight on g8, bishop on c8, bishop on f8 · after yours: undeveloped: knight on b8, bishop on c8, bishop on f8 · after better: undeveloped: bishop on c8  
**Verdict:** Mobility is a main reason (+0.73)  
**Term gains for the better line:** Mobility +0.63, King safety +0.49, Space +0.20, Bishops +0.12, Pawns -0.20, Rooks -0.26, Threats -0.65  
**Taught instead at this move:** nothing

```
On move 2 you played d6. Nf6 was better.

  What you played:  2...d6 3. d4 exd4 4. Nxd4 Nf6 5. Nc3
  What was better:  2...Nf6 3. Nc3 Nc6 4. Bb5 Bc5 5. O-O

Your move wasn't a disaster, but Nf6 would have improved development.
After the better line: undeveloped: bishop on c8. After yours: undeveloped: knight on b8, bishop on c8, bishop on f8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 20, 1... d6 (black): mobility, missed_chance, gap 37 cp

**FEN:** `rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1`  
**Played:** d6 g3 e5 Nc3 g6 Nf3 Bg7 d4  
**Better:** e5 g3 Nf6 Bg2 d5 cxd5 Nxd5 Nf3  
**Measured:** before: 4 piece moves available vs opponent's 7 · after yours: 19 piece moves available vs opponent's 24 · after better: 27 piece moves available vs opponent's 14  
**Verdict:** Mobility is a main reason (+0.73)  
**Term gains for the better line:** Mobility +0.73, King safety +0.54, Space +0.42, Rooks +0.11, Bishops -0.12, Threats -0.13, Pawns -0.21  
**Taught instead at this move:** nothing

```
On move 1 you played d6. e5 was better.

  What you played:  1...d6 2. g3 e5 3. Nc3 g6 4. Nf3 Bg7 5. d4
  What was better:  1...e5 2. g3 Nf6 3. Bg2 d5 4. cxd5 Nxd5 5. Nf3

Your move wasn't a disaster, but e5 would have improved piece activity.
After the better line: 27 piece moves available vs opponent's 14. After yours: 19 piece moves available vs opponent's 24.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

## Rejected near misses

### Game 2, 5... b6 (black): development, missed_chance, gap 52 cp

**FEN:** `rnbqkb1r/1pp1pp1p/p4np1/3p4/3P4/2NBPN2/PPP2PPP/R1BQK2R b KQkq - 1 5`  
**Played:** b6 e4 dxe4 Nxe4 Nbd7 Ne5 Nxe5 dxe5  
**Better:** Bg7 e4 dxe4 Nxe4 Nxe4 Bxe4 Nd7 Bf4  
**Measured:** before: undeveloped: knight on b8, bishop on c8, bishop on f8 · after yours: undeveloped: bishop on c8, bishop on f8 · after better: undeveloped: bishop on c8  
**Verdict:** Threats (+0.68) dwarfs Mobility/Knights/Bishops (+0.15)  
**Term gains for the better line:** Threats +0.68, Bishops +0.56, Pawns +0.08, Knights +0.07, King safety -0.14, Mobility -0.48  
**Taught instead at this move:** nothing

```
On move 5 you played b6. Bg7 was better.

  What you played:  5...b6 6. e4 dxe4 7. Nxe4 Nbd7 8. Ne5 Nxe5 9. dxe5
  What was better:  5...Bg7 6. e4 dxe4 7. Nxe4 Nxe4 8. Bxe4 Nd7 9. Bf4

Your move wasn't a disaster, but Bg7 would have improved development.
After the better line: undeveloped: bishop on c8. After yours: undeveloped: bishop on c8, bishop on f8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 2, 24... h5 (black): king_safety, missed_chance, gap 38 cp

**FEN:** `1r2k2r/R3ppbp/1Nb3p1/5q2/4p3/1P2B1P1/2P2P1P/3Q1RK1 b - - 4 24`  
**Played:** h5 Qe2 Qe6 b4 h4 b5 Bb7  
**Better:** Be5 Qe2 Qf3 Qxf3 exf3 Rd1 f6  
**Measured:** before: 2 pawn(s) shielding the king, 5 enemy attack(s) on the squares around it · after yours: 2 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it · after better: the enemy queen is gone, so your king is fairly safe  
**Verdict:** King safety gains only -0.42  
**Term gains for the better line:** Threats +0.59, Passed +0.14, Knights +0.07, Pawns -0.06, Bishops -0.14, Rooks -0.42, King safety -0.42, Mobility -0.62  
**Taught instead at this move:** nothing

```
On move 24 you played h5. Be5 was better.

  What you played:  24...h5 25. Qe2 Qe6 26. b4 h4 27. b5 Bb7
  What was better:  24...Be5 25. Qe2 Qf3 26. Qxf3 exf3 27. Rd1 f6

Your move wasn't a disaster, but Be5 would have improved king safety.
After the better line: the enemy queen is gone, so your king is fairly safe. After yours: 2 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 3, 3. Kf1 (white): centre, consequence, gap 69 cp

**FEN:** `rnb1kbnr/pppp1ppp/4p3/6q1/8/4P3/PPPPBPPP/RNBQK1NR w KQkq - 2 3`  
**Played:** Kf1 d5 h4 Qd8 b3 c5 Bb2 Nf6  
**Better:** Nf3 Qd8 O-O Be7 e4 d5 Nc3 dxe4  
**Measured:** before: centre control 1 vs 3 · after yours: centre control 3 vs 8 · after better: centre control 4 vs 5  
**Verdict:** Space/Mobility gains only -0.18  
**Term gains for the better line:** Space +0.16, Rooks +0.11, Threats +0.05, Pawns -0.10, Knights -0.18, Mobility -0.34, Bishops -0.70  
**Taught instead at this move:** nothing

```
On move 3 you played Kf1. Nf3 was better.

  What you played:  3. Kf1 d5 4. h4 Qd8 5. b3 c5 6. Bb2 Nf6
  What was better:  3. Nf3 Qd8 4. O-O Be7 5. e4 d5 6. Nc3 dxe4

The difference is control of the centre. Before your move: centre control 1 vs 3.
After your line: centre control 3 vs 8. After the better line: centre control 4 vs 5.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 3, 15. Nh4 (white): mobility, consequence, gap 47 cp

**FEN:** `r3k2r/1bpnqpp1/pp1b1n1p/3p4/3P4/P1NBPN2/1P1B1PPP/R2QK2R w kq - 2 15`  
**Played:** Nh4 g6 f3 c5 Bxg6 fxg6 Nxg6 Qg7  
**Better:** h4 Ne4 h5 c5 dxc5 bxc5 Nh4 Ne5  
**Measured:** before: 34 piece moves available vs opponent's 31 · after yours: 25 piece moves available vs opponent's 31 · after better: 34 piece moves available vs opponent's 32  
**Verdict:** Mobility gains only -0.08  
**Term gains for the better line:** Rooks +0.52, Passed +0.19, Mobility -0.08, Knights -0.14, Space -0.28, Pawns -0.40, Threats -0.75, King safety -4.29  
**Taught instead at this move:** nothing

```
On move 15 you played Nh4. h4 was better.

  What you played:  15. Nh4 g6 16. f3 c5 17. Bxg6 fxg6 18. Nxg6 Qg7
  What was better:  15. h4 Ne4 16. h5 c5 17. dxc5 bxc5 18. Nh4 Ne5

The difference is piece activity. Before your move: 34 piece moves available vs opponent's 31.
After your line: 25 piece moves available vs opponent's 31. After the better line: 34 piece moves available vs opponent's 32.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 4, 6... Qb6 (black): their_pawns, missed_chance, gap 35 cp

**FEN:** `rnbqkb1r/pp3ppp/4pn2/2p5/2B5/4PN2/PPNP1PPP/R1BQK2R b KQkq - 1 6`  
**Played:** Qb6 b3 Be7 Bb2 O-O O-O Nc6  
**Better:** a6 a4 Bd6 b3 b6 O-O Bb7  
**Measured:** before: opponent's pawns: no pawn weaknesses · after yours: opponent's pawns: no pawn weaknesses · after better: opponent's pawns: backward pawn(s) on b3  
**Verdict:** Pawns isn't a main reason (top: Threats 0.54, Mobility 0.51)  
**Term gains for the better line:** Threats +0.54, Mobility +0.51, Bishops +0.45, King safety +0.34, Pawns +0.23, Knights -0.05, Rooks -0.26  
**Taught instead at this move:** nothing

```
On move 6 you played Qb6. a6 was better.

  What you played:  6...Qb6 7. b3 Be7 8. Bb2 O-O 9. O-O Nc6
  What was better:  6...a6 7. a4 Bd6 8. b3 b6 9. O-O Bb7

Your move wasn't a disaster, but a6 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: backward pawn(s) on b3. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 4, 13... exd5 (black): own_pawns, consequence, gap 50 cp

**FEN:** `rn3rk1/ppq2ppp/3bpn2/2pB4/P2P4/1P2PN1P/2N1QPP1/R1B2RK1 b - - 0 13`  
**Played:** exd5 dxc5 Bxc5 Bb2 Ne4 Ncd4 Nc6 Rac1  
**Better:** Nxd5 Na3 a6 Bb2 Nc6 Rfc1 cxd4 Nxd4  
**Measured:** before: no pawn weaknesses · after yours: isolated pawn(s) on d5 · after better: no pawn weaknesses  
**Verdict:** Pawns isn't a main reason (top: Threats 0.82, Knights 0.40)  
**Term gains for the better line:** Threats +0.82, Knights +0.40, Pawns +0.27, Mobility +0.09, King safety +0.09, Space -0.10, Queens -0.24  
**Taught instead at this move:** nothing

```
On move 13 you played exd5. Nxd5 was better.

  What you played:  13...exd5 14. dxc5 Bxc5 15. Bb2 Ne4 16. Ncd4 Nc6 17. Rac1
  What was better:  13...Nxd5 14. Na3 a6 15. Bb2 Nc6 16. Rfc1 cxd4 17. Nxd4

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on d5. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 4, 26... Ne4 (black): outposts, missed_chance, gap 60 cp

**FEN:** `r4qk1/3n1p1p/1p3np1/1P1p4/P1rN4/4P2P/5PP1/R1RQN1K1 b - - 3 26`  
**Played:** Ne4 Rxc4 dxc4 Qc2 Nd6 Nef3 Qe7 Nd2  
**Better:** Qd6 Nc6 Rxc1 Qxc1 Nc5 Qc2 Nfe4 Nf3  
**Measured:** before: your knight outposts: none; theirs: d4 · after yours: your knight outposts: none; theirs: d4 · after better: your knight outposts: c5; theirs: c6  
**Verdict:** Knights/Bishops gains only 0.09  
**Term gains for the better line:** Threats +0.24, Knights +0.09, King safety +0.06, Mobility -0.19, Passed -0.31  
**Taught instead at this move:** nothing

```
On move 26 you played Ne4. Qd6 was better.

  What you played:  26...Ne4 27. Rxc4 dxc4 28. Qc2 Nd6 29. Nef3 Qe7 30. Nd2
  What was better:  26...Qd6 27. Nc6 Rxc1 28. Qxc1 Nc5 29. Qc2 Nfe4 30. Nf3

Your move wasn't a disaster, but Qd6 would have improved knight outposts.
After the better line: your knight outposts: c5; theirs: c6. After yours: your knight outposts: none; theirs: d4.

Principle: Knights love outposts. A knight on a square that enemy pawns can never attack, defended by your own pawn, is often as strong as a rook.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 6, 23... g5 (black): king_activity, missed_chance, gap 41 cp

**FEN:** `1r4k1/1p3pp1/1p2p2p/r7/1n1P3P/4P1P1/1P2KPB1/1R1R4 b - - 1 23`  
**Played:** g5 hxg5 hxg5 Rdc1 Na6 Rh1 Nc7 Rh5  
**Better:** Kf8 Rdc1 Na6 Rc3 Ke7 Rb3 b5 Ra3  
**Measured:** before: your king on g8 is 3 step(s) from the centre; theirs on e2 is 2 · after yours: your king on g8 is 3 step(s) from the centre; theirs on e2 is 2 · after better: your king on e7 is 2 step(s) from the centre; theirs on e2 is 2  
**Verdict:** can't be verified  
**Term gains for the better line:** none  
**Taught instead at this move:** nothing

```
On move 23 you played g5. Kf8 was better.

  What you played:  23...g5 24. hxg5 hxg5 25. Rdc1 Na6 26. Rh1 Nc7 27. Rh5
  What was better:  23...Kf8 24. Rdc1 Na6 25. Rc3 Ke7 26. Rb3 b5 27. Ra3

Your move wasn't a disaster, but Kf8 would have improved king activity.
After the better line: your king on e7 is 2 step(s) from the centre; theirs on e2 is 2. After yours: your king on g8 is 3 step(s) from the centre; theirs on e2 is 2.

Principle: Activate your king in the endgame. Once the queens are off, the king is no longer in danger and becomes a strong piece. Bring it towards the centre.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 6, 34... Ra2+ (black): king_activity, consequence, gap 38 cp

**FEN:** `8/1p3pk1/1p5p/8/1P6/r5P1/5KB1/1R6 b - - 2 34`  
**Played:** Ra2+ Kf3 f5  
**Better:** Ra7 Bf3 Kf6  
**Measured:** before: your king on g7 is 2 step(s) from the centre; theirs on f2 is 2 · after yours: your king on g7 is 2 step(s) from the centre; theirs on f3 is 1 · after better: your king on f6 is 1 step(s) from the centre; theirs on f2 is 2  
**Verdict:** can't be verified  
**Term gains for the better line:** none  
**Taught instead at this move:** nothing

```
On move 34 you played Ra2+. Ra7 was better.

  What you played:  34...Ra2+ 35. Kf3 f5
  What was better:  34...Ra7 35. Bf3 Kf6

The difference is king activity. Before your move: your king on g7 is 2 step(s) from the centre; theirs on f2 is 2.
After your line: your king on g7 is 2 step(s) from the centre; theirs on f3 is 1. After the better line: your king on f6 is 1 step(s) from the centre; theirs on f2 is 2.

Principle: Activate your king in the endgame. Once the queens are off, the king is no longer in danger and becomes a strong piece. Bring it towards the centre.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 6, 36... Kf6 (black): open_files, consequence, gap 57 cp

**FEN:** `8/1p3pk1/1p5p/8/1P6/6P1/2r3B1/1R5K b - - 6 36`  
**Played:** Kf6 Rf1+ Kg7 Bxb7 Rb2 Rf4  
**Better:** h5 Bxb7 f5 b5 Kf6 Rb4  
**Measured:** before: your rooks on open files: c2; theirs: none · after yours: your rooks on open files: none; theirs: f4 · after better: your rooks on open files: c2; theirs: none  
**Verdict:** Rooks gains only 0.00  
**Term gains for the better line:** Mobility +0.27  
**Taught instead at this move:** nothing

```
On move 36 you played Kf6. h5 was better.

  What you played:  36...Kf6 37. Rf1+ Kg7 38. Bxb7 Rb2 39. Rf4
  What was better:  36...h5 37. Bxb7 f5 38. b5 Kf6 39. Rb4

The difference is rooks on open files. Before your move: your rooks on open files: c2; theirs: none.
After your line: your rooks on open files: none; theirs: f4. After the better line: your rooks on open files: c2; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 7, 8. Bc4 (white): their_pawns, missed_chance, gap 45 cp

**FEN:** `rnbqk2r/pp2bppp/3p1n2/1N6/3pP3/5N2/PP3PPP/R1BQKB1R w KQkq - 2 8`  
**Played:** Bc4 Nxe4 O-O O-O Qxd4 Nc5 Bf4 Ne6  
**Better:** Bd3 Nxe4 Bxe4 Qa5+ Bd2 Qxb5 a4 Qa6  
**Measured:** before: opponent's pawns: isolated pawn(s) on d4, d6; doubled pawns on the d-file · after yours: opponent's pawns: isolated pawn(s) on d6 · after better: opponent's pawns: isolated pawn(s) on d4, d6; doubled pawns on the d-file  
**Verdict:** Pawns gains only -0.05  
**Term gains for the better line:** Threats +2.03, Queens +0.24, Knights +0.14, Pawns -0.05, Mobility -0.10, Space -0.12, Passed -0.22, King safety -0.34  
**Taught instead at this move:** nothing

```
On move 8 you played Bc4. Bd3 was better.

  What you played:  8. Bc4 Nxe4 9. O-O O-O 10. Qxd4 Nc5 11. Bf4 Ne6
  What was better:  8. Bd3 Nxe4 9. Bxe4 Qa5+ 10. Bd2 Qxb5 11. a4 Qa6

Your move wasn't a disaster, but Bd3 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on d4, d6; doubled pawns on the d-file. After yours: opponent's pawns: isolated pawn(s) on d6.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 7, 17. Na3 (white): open_files, missed_chance, gap 58 cp

**FEN:** `r1b2rk1/1p3ppp/p4q2/bN1pn3/3Nn2P/4BB2/PP3PP1/R2Q2KR w - - 0 17`  
**Played:** Na3 h6 Nb3 Bb6 Bxb6 Qxb6 Qd4 Qf6  
**Better:** Nc3 Nxc3 bxc3 Bxc3 Rc1 Bb2 Rc2 Nxf3+  
**Measured:** before: your rooks on open files: none; theirs: none · after yours: your rooks on open files: none; theirs: none · after better: your rooks on open files: c2; theirs: none  
**Verdict:** Rooks isn't a main reason (top: King safety 0.99, Knights 0.33)  
**Term gains for the better line:** King safety +0.99, Knights +0.33, Mobility +0.24, Rooks +0.20, Threats +0.10  
**Taught instead at this move:** nothing

```
On move 17 you played Na3. Nc3 was better.

  What you played:  17. Na3 h6 18. Nb3 Bb6 19. Bxb6 Qxb6 20. Qd4 Qf6
  What was better:  17. Nc3 Nxc3 18. bxc3 Bxc3 19. Rc1 Bb2 20. Rc2 Nxf3+

Your move wasn't a disaster, but Nc3 would have improved rooks on open files.
After the better line: your rooks on open files: c2; theirs: none. After yours: your rooks on open files: none; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 7, 21. Qd3 (white): own_pawns, consequence, gap 45 cp

**FEN:** `r1b2rk1/1p3ppp/pb6/3pq1P1/2nN4/5B2/PPN2PP1/R2Q2KR w - - 1 21`  
**Played:** Qd3 g6 b3 Nd6 Qe3 Qxe3 fxe3 Ne4  
**Better:** b3 Nd6 Qd2 Ne4 Re1 Re8 Bxe4 dxe4  
**Measured:** before: doubled pawns on the g-file · after yours: isolated pawn(s) on g2, e3, g5; doubled pawns on the g-file · after better: doubled pawns on the g-file  
**Verdict:** Pawns gains only -0.02  
**Term gains for the better line:** Queens +0.21, Rooks +0.09, Knights +0.07, King safety +0.05, Space -0.10, Bishops -0.12, Threats -0.62  
**Taught instead at this move:** nothing

```
On move 21 you played Qd3. b3 was better.

  What you played:  21. Qd3 g6 22. b3 Nd6 23. Qe3 Qxe3 24. fxe3 Ne4
  What was better:  21. b3 Nd6 22. Qd2 Ne4 23. Re1 Re8 24. Bxe4 dxe4

The difference is your pawn structure. Before your move: doubled pawns on the g-file.
After your line: isolated pawn(s) on g2, e3, g5; doubled pawns on the g-file. After the better line: doubled pawns on the g-file.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 8, 4... Nf6 (black): their_pawns, missed_chance, gap 37 cp

**FEN:** `r1bqkbnr/ppp1pp1p/2n3p1/3p4/4P3/3P1N2/PPPB1PPP/RN1QKB1R b KQkq - 1 4`  
**Played:** Nf6 e5 Nd7 d4 Bg7 Be3 O-O c3  
**Better:** Bg7 Nc3 d4 Ne2 e5 c3 dxc3 Bxc3  
**Measured:** before: opponent's pawns: no pawn weaknesses · after yours: opponent's pawns: no pawn weaknesses · after better: opponent's pawns: backward pawn(s) on d3  
**Verdict:** Pawns isn't a main reason (top: Mobility 0.68, Space 0.47)  
**Term gains for the better line:** Mobility +0.68, Space +0.47, Pawns +0.38, Knights +0.27, King safety +0.06, Threats +0.06, Bishops -0.14, Rooks -0.37  
**Taught instead at this move:** nothing

```
On move 4 you played Nf6. Bg7 was better.

  What you played:  4...Nf6 5. e5 Nd7 6. d4 Bg7 7. Be3 O-O 8. c3
  What was better:  4...Bg7 5. Nc3 d4 6. Ne2 e5 7. c3 dxc3 8. Bxc3

Your move wasn't a disaster, but Bg7 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: backward pawn(s) on d3. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 10, 2... Nc6 (black): own_pawns, consequence, gap 42 cp

**FEN:** `rnbqkbnr/ppppp1pp/8/5p2/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2`  
**Played:** Nc6 Nf3 d6 d5 Ne5 Nc3 Nf6 e4  
**Better:** e6 Nc3 Nf6 g3 Be7 Bg2 O-O Nh3  
**Measured:** before: no pawn weaknesses · after yours: backward pawn(s) on e7 · after better: no pawn weaknesses  
**Verdict:** Pawns gains only 0.08  
**Term gains for the better line:** King safety +1.08, Space +0.39, Rooks +0.26, Mobility +0.14, Threats +0.13, Pawns +0.08, Knights -0.13, Bishops -0.42  
**Taught instead at this move:** nothing

```
On move 2 you played Nc6. e6 was better.

  What you played:  2...Nc6 3. Nf3 d6 4. d5 Ne5 5. Nc3 Nf6 6. e4
  What was better:  2...e6 3. Nc3 Nf6 4. g3 Be7 5. Bg2 O-O 6. Nh3

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: backward pawn(s) on e7. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 10, 7... Nb8 (black): their_pawns, missed_chance, gap 46 cp

**FEN:** `r1bqkb1r/pppp3p/2n1p1p1/3P1p1n/2P5/2N1P1B1/PP3PPP/R2QKBNR b KQkq - 0 7`  
**Played:** Nb8 Be5 Bg7 Bxg7 Nxg7 h4  
**Better:** Nxg3 hxg3 Ne5 Rc1 Bg7 Nh3  
**Measured:** before: opponent's pawns: no pawn weaknesses · after yours: opponent's pawns: no pawn weaknesses · after better: opponent's pawns: doubled pawns on the g-file  
**Verdict:** Pawns gains only -0.13  
**Term gains for the better line:** Mobility +0.65, King safety +0.38, Knights +0.12, Bishops +0.05, Rooks -0.09, Pawns -0.13, Threats -0.29  
**Taught instead at this move:** nothing

```
On move 7 you played Nb8. Nxg3 was better.

  What you played:  7...Nb8 8. Be5 Bg7 9. Bxg7 Nxg7 10. h4
  What was better:  7...Nxg3 8. hxg3 Ne5 9. Rc1 Bg7 10. Nh3

Your move wasn't a disaster, but Nxg3 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: doubled pawns on the g-file. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 11, 4. Qe2 (white): development, missed_chance, gap 58 cp

**FEN:** `rnbqkb1r/pp1p1ppp/4pn2/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 2 4`  
**Played:** Qe2 Nc6 Nf3 d5 exd5 Nxd5 g3 Be7  
**Better:** e5 Nd5 Nc3 d6 Nf3 Nc6 Bb5 Bd7  
**Measured:** before: undeveloped: knight on b1, knight on g1, bishop on c1, bishop on f1 · after yours: undeveloped: knight on b1, bishop on c1, bishop on f1 · after better: undeveloped: bishop on c1  
**Verdict:** Mobility/Knights/Bishops gains only -0.31  
**Term gains for the better line:** King safety +0.27, Space +0.27, Knights -0.05, Threats -0.15, Pawns -0.24, Bishops -0.29  
**Taught instead at this move:** nothing

```
On move 4 you played Qe2. e5 was better.

  What you played:  4. Qe2 Nc6 5. Nf3 d5 6. exd5 Nxd5 7. g3 Be7
  What was better:  4. e5 Nd5 5. Nc3 d6 6. Nf3 Nc6 7. Bb5 Bd7

Your move wasn't a disaster, but e5 would have improved development.
After the better line: undeveloped: bishop on c1. After yours: undeveloped: knight on b1, bishop on c1, bishop on f1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 13, 18. Rab1 (white): open_files, missed_chance, gap 38 cp

**FEN:** `r1b1r1k1/pp3pp1/1q3n2/3pnB1p/8/P3P1N1/2Q1NPPP/R4RK1 w - - 2 18`  
**Played:** Rab1 Qa6 Bxc8 Raxc8 Qb2 b6 Nf4 Nc4  
**Better:** Qa4 Nc4 Bxc8 Rexc8 Rfb1 Qc6 Qb4 b6  
**Measured:** before: your rooks on open files: none; theirs: e8 · after yours: your rooks on open files: b1; theirs: c8, e8 · after better: your rooks on open files: b1; theirs: c8  
**Verdict:** Rooks gains only 0.08  
**Term gains for the better line:** Threats +0.26, Knights +0.15, Rooks +0.08, Mobility +0.07  
**Taught instead at this move:** nothing

```
On move 18 you played Rab1. Qa4 was better.

  What you played:  18. Rab1 Qa6 19. Bxc8 Raxc8 20. Qb2 b6 21. Nf4 Nc4
  What was better:  18. Qa4 Nc4 19. Bxc8 Rexc8 20. Rfb1 Qc6 21. Qb4 b6

Your move wasn't a disaster, but Qa4 would have improved rooks on open files.
After the better line: your rooks on open files: b1; theirs: c8. After yours: your rooks on open files: b1; theirs: c8, e8.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 14, 6... Qd8 (black): their_pawns, missed_chance, gap 67 cp

**FEN:** `rnb1kb1r/pppq1ppp/8/3Pp3/2P5/3P4/PP3PPP/RNBQK1NR b KQkq - 0 6`  
**Played:** Qd8 d4 Bb4+ Bd2 Bxd2+ Qxd2 exd4 Qxd4  
**Better:** Qg4 Qxg4 Bxg4 Be3 c6 Nc3 Na6 Kd2  
**Measured:** before: opponent's pawns: doubled pawns on the d-file; backward pawn(s) on d3 · after yours: opponent's pawns: no pawn weaknesses · after better: opponent's pawns: doubled pawns on the d-file; backward pawn(s) on d3  
**Verdict:** Pawns gains only 0.09  
**Term gains for the better line:** King safety +1.15, Space +0.27, Mobility +0.25, Pawns +0.09, Threats +0.07, Knights -0.08, Passed -0.13, Bishops -0.14, Rooks -0.23  
**Taught instead at this move:** mobility (consequence)

```
On move 6 you played Qd8. Qg4 was better.

  What you played:  6...Qd8 7. d4 Bb4+ 8. Bd2 Bxd2+ 9. Qxd2 exd4 10. Qxd4
  What was better:  6...Qg4 7. Qxg4 Bxg4 8. Be3 c6 9. Nc3 Na6 10. Kd2

Your move wasn't a disaster, but Qg4 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: doubled pawns on the d-file; backward pawn(s) on d3. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 15, 3. d4 (white): development, missed_chance, gap 53 cp

**FEN:** `rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3`  
**Played:** d4 exd4 Qxd4 Nf6 exd5 Qxd5 Qxd5 Nxd5  
**Better:** exd5 Qxd5 Nc3 Qe6 Nb5 Na6 d4 Bb4+  
**Measured:** before: undeveloped: knight on b1, bishop on c1, bishop on f1 · after yours: undeveloped: knight on b1, bishop on c1, bishop on f1 · after better: undeveloped: bishop on c1, bishop on f1  
**Verdict:** Mobility/Knights/Bishops gains only -0.07  
**Term gains for the better line:** Rooks +0.11, King safety +0.10, Knights -0.11, Threats -0.56  
**Taught instead at this move:** nothing

```
On move 3 you played d4. exd5 was better.

  What you played:  3. d4 exd4 4. Qxd4 Nf6 5. exd5 Qxd5 6. Qxd5 Nxd5
  What was better:  3. exd5 Qxd5 4. Nc3 Qe6 5. Nb5 Na6 6. d4 Bb4+

Your move wasn't a disaster, but exd5 would have improved development.
After the better line: undeveloped: bishop on c1, bishop on f1. After yours: undeveloped: knight on b1, bishop on c1, bishop on f1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 15, 7. h3 (white): development, missed_chance, gap 51 cp

**FEN:** `r1bqk2r/pppnnppp/8/1BbP2B1/3p4/5N2/PPP2PPP/RN1QK2R w KQkq - 5 7`  
**Played:** h3 f6 Bh4 Nf5 O-O O-O  
**Better:** O-O O-O Nbd2 f6 Bh4 Nb6  
**Measured:** before: undeveloped: knight on b1 · after yours: undeveloped: knight on b1 · after better: all minor pieces developed  
**Verdict:** Mobility/Knights/Bishops gains only -0.12  
**Term gains for the better line:** Pawns -0.10, Bishops -0.10, Queens -0.25, Threats -0.27  
**Taught instead at this move:** nothing

```
On move 7 you played h3. O-O was better.

  What you played:  7. h3 f6 8. Bh4 Nf5 9. O-O O-O
  What was better:  7. O-O O-O 8. Nbd2 f6 9. Bh4 Nb6

Your move wasn't a disaster, but O-O would have improved development.
After the better line: all minor pieces developed. After yours: undeveloped: knight on b1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 8... O-O (black): development, missed_chance, gap 49 cp

**FEN:** `rnbqk2r/ppp1bppp/1n1p4/8/P2NP3/2NB4/1PP2PPP/R1BQK2R b KQkq - 4 8`  
**Played:** O-O a5 N6d7 Nd5 Nf6 Nxe7+ Qxe7  
**Better:** a5 Be3 O-O Nb3 Na6 Bxb6 cxb6  
**Measured:** before: undeveloped: knight on b8, bishop on c8 · after yours: undeveloped: knight on b8, bishop on c8 · after better: undeveloped: bishop on c8  
**Verdict:** Mobility/Knights/Bishops gains only -0.03  
**Term gains for the better line:** Mobility +0.33, Space +0.05, Knights -0.18, Bishops -0.18, Pawns -0.36, Threats -0.83  
**Taught instead at this move:** nothing

```
On move 8 you played O-O. a5 was better.

  What you played:  8...O-O 9. a5 N6d7 10. Nd5 Nf6 11. Nxe7+ Qxe7
  What was better:  8...a5 9. Be3 O-O 10. Nb3 Na6 11. Bxb6 cxb6

Your move wasn't a disaster, but a5 would have improved development.
After the better line: undeveloped: bishop on c8. After yours: undeveloped: knight on b8, bishop on c8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 17, 14. e4 (white): own_pawns, consequence, gap 47 cp

**FEN:** `rb1qr1k1/pp1b1pp1/n4n1p/3Pp3/P7/4PN1P/1P2BPP1/RNBQ1RK1 w - - 1 14`  
**Played:** e4 Nxe4 Be3 Nf6 Nc3 e4 Nd2 Qc7  
**Better:** Nfd2 Nxd5 Ne4 Bc6 Nbc3 Nxc3 Nxc3 e4  
**Measured:** before: no pawn weaknesses · after yours: isolated pawn(s) on d5 · after better: no pawn weaknesses  
**Verdict:** Pawns isn't a main reason (top: King safety 3.91, Knights 0.24)  
**Term gains for the better line:** King safety +3.91, Knights +0.24, Pawns +0.16, Threats +0.10, Space -0.11, Passed -0.13, Bishops -0.43, Mobility -0.51  
**Taught instead at this move:** nothing

```
On move 14 you played e4. Nfd2 was better.

  What you played:  14. e4 Nxe4 15. Be3 Nf6 16. Nc3 e4 17. Nd2 Qc7
  What was better:  14. Nfd2 Nxd5 15. Ne4 Bc6 16. Nbc3 Nxc3 17. Nxc3 e4

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on d5. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 17, 16. Re1 (white): their_pawns, missed_chance, gap 51 cp

**FEN:** `rb1qr1k1/pp1b1pp1/n2n3p/3Pp3/P7/4BN1P/1P2BPP1/RN1Q1RK1 w - - 2 16`  
**Played:** Re1 e4 Nfd2 Nb4 Nc3 a5 Bf4  
**Better:** Bxa6 bxa6 Nbd2 e4 Nd4 Qf6 Re1  
**Measured:** before: opponent's pawns: no pawn weaknesses · after yours: opponent's pawns: no pawn weaknesses · after better: opponent's pawns: isolated pawn(s) on a6, a7; doubled pawns on the a-file  
**Verdict:** Pawns isn't a main reason (top: Knights 0.43, Bishops 0.43)  
**Term gains for the better line:** Knights +0.43, Bishops +0.43, Pawns +0.12, Threats -0.09, King safety -0.11  
**Taught instead at this move:** nothing

```
On move 16 you played Re1. Bxa6 was better.

  What you played:  16. Re1 e4 17. Nfd2 Nb4 18. Nc3 a5 19. Bf4
  What was better:  16. Bxa6 bxa6 17. Nbd2 e4 18. Nd4 Qf6 19. Re1

Your move wasn't a disaster, but Bxa6 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on a6, a7; doubled pawns on the a-file. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 18, 9... b6 (black): own_pawns, consequence, gap 42 cp

**FEN:** `rnbq1rk1/1pp2ppp/4pn2/p1b5/P2pP3/1NPP1N2/1P3PPP/R1BQKB1R b KQ - 1 9`  
**Played:** b6 Nfxd4 e5 Nxc5 bxc5 Nc2  
**Better:** Bb6 Nbxd4 e5 Nxe5 Bxd4 cxd4  
**Measured:** before: no pawn weaknesses · after yours: isolated pawn(s) on a5, c5, c7; doubled pawns on the c-file · after better: no pawn weaknesses  
**Verdict:** Pawns isn't a main reason (top: Threats 0.39, Knights 0.20)  
**Term gains for the better line:** Threats +0.39, Knights +0.20, Pawns +0.16, Bishops +0.12, Mobility -0.28, King safety -0.28, Space -0.28  
**Taught instead at this move:** nothing

```
On move 9 you played b6. Bb6 was better.

  What you played:  9...b6 10. Nfxd4 e5 11. Nxc5 bxc5 12. Nc2
  What was better:  9...Bb6 10. Nbxd4 e5 11. Nxe5 Bxd4 12. cxd4

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on a5, c5, c7; doubled pawns on the c-file. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 19, 7. Qb2 (white): open_files, consequence, gap 47 cp

**FEN:** `rnbqk1nr/2pp1ppp/p2b4/4p3/1Pp5/1QN2N2/P2PPPPP/R1B1KB1R w KQkq - 0 7`  
**Played:** Qb2 Nc6 e4 Rb8 a3 Nd4 Bxc4 Nxf3+  
**Better:** Qxc4 Nf6 a3 O-O e4 Nc6 Be2 Re8  
**Measured:** before: your rooks on open files: none; theirs: none · after yours: your rooks on open files: none; theirs: b8 · after better: your rooks on open files: none; theirs: none  
**Verdict:** Rooks gains only -0.28  
**Term gains for the better line:** Bishops +0.34, Knights +0.25, Queens +0.25, Mobility +0.16, Threats -0.21, Rooks -0.28  
**Taught instead at this move:** nothing

```
On move 7 you played Qb2. Qxc4 was better.

  What you played:  7. Qb2 Nc6 8. e4 Rb8 9. a3 Nd4 10. Bxc4 Nxf3+
  What was better:  7. Qxc4 Nf6 8. a3 O-O 9. e4 Nc6 10. Be2 Re8

The difference is rooks on open files. Before your move: your rooks on open files: none; theirs: none.
After your line: your rooks on open files: none; theirs: b8. After the better line: your rooks on open files: none; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

