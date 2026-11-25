# Near-miss strategic lessons: what a lower bar would add

20 simulated games (student: Stockfish skill 6, 10 ms/move; opponent skill 3, levelling up; analysis depth 10; at most 50 moves). 913 student moves. Took 104 s.

A near miss is a strategic lesson with an eval gap between 35 and 70 centipawns: today's detection would find it at a lower bar, but never teaches it.

## Summary

| | Total | Per game |
|---|---|---|
| Lessons taught today | 62 | 3.1 |
| …of which strategic | 15 | 0.8 |
| Strategic lessons today's check rejected | 21 | 1.1 |
| Near misses found at 35 cp | 34 | 1.7 |
| …kept by the classical check | **16** | **0.8** |
| …rejected by the classical check | 18 | 0.9 |
| …of kept, the app taught something else at the same move | 0 | |

## Lessons taught today, by kind

Material lessons sorted by what happened: the student lost their own material (blunder), left a capture that was already on the board (missed free material), or the better line won material by force (missed tactic).

| Category | Count |
|---|---|
| tactics: blunder (consequence) | 26 |
| tactics: missed free material (consequence) | 11 |
| strategy (missed_chance) | 9 |
| tactics: missed tactic (missed_chance) | 8 |
| strategy (consequence) | 6 |
| tactics: missed free material (missed_chance) | 2 |

## Near misses by feature

| Feature | Consequence | Missed chance | Kept | Rejected |
|---|---|---|---|---|
| mobility | 4 | 0 | 4 | 0 |
| king_safety | 1 | 3 | 3 | 1 |
| development | 1 | 4 | 2 | 3 |
| own_pawns | 4 | 0 | 2 | 2 |
| open_files | 2 | 0 | 2 | 0 |
| passed_pawns | 2 | 2 | 1 | 3 |
| their_pawns | 0 | 4 | 1 | 3 |
| centre | 2 | 1 | 1 | 2 |
| king_activity | 2 | 2 | 0 | 4 |

## Kept near misses

### Game 1, 38. Kd4 (white): passed_pawns, missed_chance, gap 57 cp

**FEN:** `8/1p6/pR2pk1p/2P5/1P6/2K2r1P/P7/8 w - - 0 38`  
**Played:** Kd4 Rxh3 Rxb7 e5+ Kd5 Rd3+ Kc4 e4  
**Better:** Kc4 Ra3 Rxb7 Rxa2 Kb3 Ra1 Kb2 Rh1  
**Measured:** before: your passed pawns: none; theirs: e6 · after yours: your passed pawns: c5; theirs: e4, h6 · after better: your passed pawns: c5; theirs: e6  
**Verdict:** Passed is a main reason (+0.85)  
**Term gains for the better line:** Passed +0.85, Mobility +0.11, King safety -0.16, Pawns -0.18, Threats -0.43  
**Taught instead at this move:** nothing

```
On move 38 you played Kd4. Kc4 was better.

  What you played:  38. Kd4 Rxh3 39. Rxb7 e5+ 40. Kd5 Rd3+ 41. Kc4 e4
  What was better:  38. Kc4 Ra3 39. Rxb7 Rxa2 40. Kb3 Ra1 41. Kb2 Rh1

Your move wasn't a disaster, but Kc4 would have improved passed pawns.
After the better line: your passed pawns: c5; theirs: e6. After yours: your passed pawns: c5; theirs: e4, h6.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 2, 4... dxe4 (black): development, missed_chance, gap 38 cp

**FEN:** `rnbqkbnr/pp3ppp/4p3/2pp4/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 1 4`  
**Played:** dxe4 Nxe4 cxd4 Qxd4 Nf6 Qxd8+ Kxd8 Ne5  
**Better:** Nf6 exd5 Nxd5 Nxd5 exd5 Bb5+ Bd7 Bxd7+  
**Measured:** before: undeveloped: knight on b8, knight on g8, bishop on c8, bishop on f8 · after yours: undeveloped: knight on b8, bishop on c8, bishop on f8 · after better: undeveloped: knight on b8, bishop on f8  
**Verdict:** Bishops is a main reason (+0.80)  
**Term gains for the better line:** Bishops +0.55, Threats +0.42, Rooks +0.32, Mobility +0.22, Space +0.12, Pawns +0.06, King safety -0.31  
**Taught instead at this move:** nothing

```
On move 4 you played dxe4. Nf6 was better.

  What you played:  4...dxe4 5. Nxe4 cxd4 6. Qxd4 Nf6 7. Qxd8+ Kxd8 8. Ne5
  What was better:  4...Nf6 5. exd5 Nxd5 6. Nxd5 exd5 7. Bb5+ Bd7 8. Bxd7+

Your move wasn't a disaster, but Nf6 would have improved development.
After the better line: undeveloped: knight on b8, bishop on f8. After yours: undeveloped: knight on b8, bishop on c8, bishop on f8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 3, 3. Ne2 (white): mobility, consequence, gap 39 cp

**FEN:** `rnbqkbnr/ppp2ppp/3p4/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 3`  
**Played:** Ne2 Nf6 d4 Nxe4 dxe5 c6 O-O d5  
**Better:** Nf3 Nf6 Nc3 Be7 d4 exd4 Nxd4 O-O  
**Measured:** before: 18 piece moves available vs opponent's 17 · after yours: 23 piece moves available vs opponent's 30 · after better: 35 piece moves available vs opponent's 17  
**Verdict:** Mobility is a main reason (+0.52)  
**Term gains for the better line:** Mobility +0.52, King safety +0.51, Threats +0.51, Bishops +0.17, Space +0.13, Pawns +0.06, Rooks -0.52  
**Taught instead at this move:** nothing

```
On move 3 you played Ne2. Nf3 was better.

  What you played:  3. Ne2 Nf6 4. d4 Nxe4 5. dxe5 c6 6. O-O d5
  What was better:  3. Nf3 Nf6 4. Nc3 Be7 5. d4 exd4 6. Nxd4 O-O

The difference is piece activity. Before your move: 18 piece moves available vs opponent's 17.
After your line: 23 piece moves available vs opponent's 30. After the better line: 35 piece moves available vs opponent's 17.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 6, 13... Be5 (black): own_pawns, consequence, gap 39 cp

**FEN:** `rnb2rk1/pp3pp1/2pb3p/6qQ/4P3/P1NB2N1/1PP2PPP/R3K2R b KQ - 3 13`  
**Played:** Be5 Qxg5 hxg5 Nge2 Nd7 h4 g4 O-O-O  
**Better:** g6 Qxg5 hxg5 h4 gxh4 Rxh4 Bxg3 fxg3  
**Measured:** before: no pawn weaknesses · after yours: doubled pawns on the g-file · after better: no pawn weaknesses  
**Verdict:** Pawns is a main reason (+0.40)  
**Term gains for the better line:** Pawns +0.40, Threats +0.30, Bishops +0.05, King safety -0.07, Knights -0.10, Mobility -0.59  
**Taught instead at this move:** nothing

```
On move 13 you played Be5. g6 was better.

  What you played:  13...Be5 14. Qxg5 hxg5 15. Nge2 Nd7 16. h4 g4 17. O-O-O
  What was better:  13...g6 14. Qxg5 hxg5 15. h4 gxh4 16. Rxh4 Bxg3 17. fxg3

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: doubled pawns on the g-file. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 7, 16. Qb3 (white): king_safety, missed_chance, gap 58 cp

**FEN:** `2kr3r/nppq2p1/p2bpp2/5b1p/3Pn3/2N1PN1P/PP2BPP1/R1RQB1K1 w - - 0 16`  
**Played:** Qb3 g5 Na4 Qe8 Nd2 g4 h4 Nxd2  
**Better:** Nxe4 Bxe4 Nd2 Bd5 b4 Bxb4 Nc4 Bxc4  
**Measured:** before: 3 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it · after yours: 2 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it · after better: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it  
**Verdict:** King safety is a main reason (+0.47)  
**Term gains for the better line:** Threats +1.28, King safety +0.47, Pawns +0.10, Space -0.05, Bishops -0.07  
**Taught instead at this move:** nothing

```
On move 16 you played Qb3. Nxe4 was better.

  What you played:  16. Qb3 g5 17. Na4 Qe8 18. Nd2 g4 19. h4 Nxd2
  What was better:  16. Nxe4 Bxe4 17. Nd2 Bd5 18. b4 Bxb4 19. Nc4 Bxc4

Your move wasn't a disaster, but Nxe4 would have improved king safety.
After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it. After yours: 2 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 10, 8... Bxg2 (black): open_files, consequence, gap 46 cp

**FEN:** `rn1qk2r/pb1pbppp/1p2pn2/8/2PN4/1P2P3/PB2BPPP/RN1QK2R b KQkq - 0 8`  
**Played:** Bxg2 Rg1 Be4 Nd2 Bg6 h4 h5  
**Better:** Nc6 Bf3 O-O Nxc6 dxc6 Qxd8 Rfxd8  
**Measured:** before: your rooks on open files: none; theirs: none · after yours: your rooks on open files: none; theirs: g1 · after better: your rooks on open files: d8; theirs: none  
**Verdict:** Rooks is a main reason (+0.39)  
**Term gains for the better line:** Mobility +0.89, Rooks +0.39, Space +0.10, Knights +0.06, Bishops +0.05, Pawns -0.13, King safety -0.51, Threats -0.81  
**Taught instead at this move:** nothing

```
On move 8 you played Bxg2. Nc6 was better.

  What you played:  8...Bxg2 9. Rg1 Be4 10. Nd2 Bg6 11. h4 h5
  What was better:  8...Nc6 9. Bf3 O-O 10. Nxc6 dxc6 11. Qxd8 Rfxd8

The difference is rooks on open files. Before your move: your rooks on open files: none; theirs: none.
After your line: your rooks on open files: none; theirs: g1. After the better line: your rooks on open files: d8; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 11, 29. Rb1 (white): mobility, consequence, gap 62 cp

**FEN:** `1rr5/8/Rp2pk2/4p3/Pb5p/1P2P3/5PPP/2R2NK1 w - - 4 29`  
**Played:** Rb1 Rc2 h3 e4 Nh2 Rb7  
**Better:** Rd1 Rb7 h3 Rc3 Nh2 Rxb3  
**Measured:** before: 17 piece moves available vs opponent's 23 · after yours: 13 piece moves available vs opponent's 29 · after better: 19 piece moves available vs opponent's 23  
**Verdict:** Mobility is a main reason (+0.48)  
**Term gains for the better line:** Mobility +0.48, Rooks +0.26, Pawns +0.09, Bishops +0.09, Threats +0.06  
**Taught instead at this move:** nothing

```
On move 29 you played Rb1. Rd1 was better.

  What you played:  29. Rb1 Rc2 30. h3 e4 31. Nh2 Rb7
  What was better:  29. Rd1 Rb7 30. h3 Rc3 31. Nh2 Rxb3

The difference is piece activity. Before your move: 17 piece moves available vs opponent's 23.
After your line: 13 piece moves available vs opponent's 29. After the better line: 19 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 13, 41. Rc2 (white): their_pawns, missed_chance, gap 37 cp

**FEN:** `7r/1r3p2/1ppnk3/3p1p1p/Pp1P3P/1P2P1P1/R4P2/R4BK1 w - - 30 41`  
**Played:** Rc2 Kd7 a5 Ra8 a6 Rba7 Be2 Rh8  
**Better:** a5 b5 Rc1 Kd7 Rac2 Rc8 Kh2 Ra7  
**Measured:** before: opponent's pawns: isolated pawn(s) on f5, h5, f7; doubled pawns on the b-file, f-file · after yours: opponent's pawns: isolated pawn(s) on f5, h5, f7; doubled pawns on the b-file, f-file · after better: opponent's pawns: isolated pawn(s) on f5, h5, f7; doubled pawns on the b-file, f-file; backward pawn(s) on c6  
**Verdict:** Pawns is a main reason (+0.30)  
**Term gains for the better line:** Pawns +0.30, Knights +0.08, Bishops +0.05, Rooks +0.05, Mobility -0.05, Threats -0.22, Passed -0.51  
**Taught instead at this move:** nothing

```
On move 41 you played Rc2. a5 was better.

  What you played:  41. Rc2 Kd7 42. a5 Ra8 43. a6 Rba7 44. Be2 Rh8
  What was better:  41. a5 b5 42. Rc1 Kd7 43. Rac2 Rc8 44. Kh2 Ra7

Your move wasn't a disaster, but a5 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on f5, h5, f7; doubled pawns on the b-file, f-file; backward pawn(s) on c6. After yours: opponent's pawns: isolated pawn(s) on f5, h5, f7; doubled pawns on the b-file, f-file.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 15, 23. Kh2 (white): mobility, consequence, gap 47 cp

**FEN:** `r1r3k1/ppn2ppp/2b5/3p2P1/8/R4N1P/Pp3PB1/1R4K1 w - - 1 23`  
**Played:** Kh2 Ne6 Rxb2 d4 Rd2 Rd8 h4 Nf4  
**Better:** h4 Re8 Nd4 Ne6 Nxc6 bxc6 Rxb2 a5  
**Measured:** before: 22 piece moves available vs opponent's 13 · after yours: 21 piece moves available vs opponent's 24 · after better: 25 piece moves available vs opponent's 17  
**Verdict:** Mobility is a main reason (+0.32)  
**Term gains for the better line:** Mobility +0.32, Passed +0.15, Threats +0.12, King safety +0.09, Rooks -0.05, Bishops -0.11  
**Taught instead at this move:** nothing

```
On move 23 you played Kh2. h4 was better.

  What you played:  23. Kh2 Ne6 24. Rxb2 d4 25. Rd2 Rd8 26. h4 Nf4
  What was better:  23. h4 Re8 24. Nd4 Ne6 25. Nxc6 bxc6 26. Rxb2 a5

The difference is piece activity. Before your move: 22 piece moves available vs opponent's 13.
After your line: 21 piece moves available vs opponent's 24. After the better line: 25 piece moves available vs opponent's 17.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 12... Rc8 (black): mobility, consequence, gap 36 cp

**FEN:** `r2qr1k1/2pb1pp1/p2b1n1p/1p2p3/P3P3/1NNP1Q1P/1PP2PP1/R1B2RK1 b - - 0 12`  
**Played:** Rc8 axb5 axb5 Be3 Nh7 Ra7  
**Better:** b4 Ne2 Nh7 Na5 Ng5 Qg3  
**Measured:** before: 25 piece moves available vs opponent's 29 · after yours: 22 piece moves available vs opponent's 44 · after better: 26 piece moves available vs opponent's 24  
**Verdict:** Mobility is a main reason (+0.83)  
**Term gains for the better line:** Mobility +0.83, Rooks +0.37, King safety +0.35, Queens +0.24, Knights -0.33, Threats -1.20  
**Taught instead at this move:** nothing

```
On move 12 you played Rc8. b4 was better.

  What you played:  12...Rc8 13. axb5 axb5 14. Be3 Nh7 15. Ra7
  What was better:  12...b4 13. Ne2 Nh7 14. Na5 Ng5 15. Qg3

The difference is piece activity. Before your move: 25 piece moves available vs opponent's 29.
After your line: 22 piece moves available vs opponent's 44. After the better line: 26 piece moves available vs opponent's 24.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 36... Ne6 (black): open_files, consequence, gap 59 cp

**FEN:** `6k1/5pp1/1r1q3p/1p2p3/4Pn2/1Q1P2PP/2PN1P1K/5R2 b - - 0 36`  
**Played:** Ne6 Nf3 Kh7 Kg2 f6 Ra1 Qc7 Ra5  
**Better:** Qf6 Qb1 Rc6 Qd1 Ne6 Nf3 b4 Kg2  
**Measured:** before: your rooks on open files: none; theirs: none · after yours: your rooks on open files: none; theirs: a5 · after better: your rooks on open files: c6; theirs: none  
**Verdict:** Rooks is a main reason (+0.40)  
**Term gains for the better line:** Rooks +0.40, King safety +0.13, Mobility -0.08, Queens -0.14, Threats -0.14  
**Taught instead at this move:** nothing

```
On move 36 you played Ne6. Qf6 was better.

  What you played:  36...Ne6 37. Nf3 Kh7 38. Kg2 f6 39. Ra1 Qc7 40. Ra5
  What was better:  36...Qf6 37. Qb1 Rc6 38. Qd1 Ne6 39. Nf3 b4 40. Kg2

The difference is rooks on open files. Before your move: your rooks on open files: none; theirs: none.
After your line: your rooks on open files: none; theirs: a5. After the better line: your rooks on open files: c6; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 41... Rb6 (black): king_safety, missed_chance, gap 63 cp

**FEN:** `4R3/6pk/r2qnp1p/1p2p3/4P3/1Q1P1NPP/2P2PK1/8 b - - 3 41`  
**Played:** Rb6 Nh4 Qd7 Ra8 Rb7 Nf5 h5 Qd5  
**Better:** b4 Nh4 Qc6 Re7 Qc3 Qxc3 bxc3 Nf5  
**Measured:** before: 1 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it · after yours: 1 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it · after better: the enemy queen is gone, so your king is fairly safe  
**Verdict:** King safety is a main reason (+0.75)  
**Term gains for the better line:** King safety +0.75, Mobility +0.30, Pawns +0.19, Threats -0.89  
**Taught instead at this move:** nothing

```
On move 41 you played Rb6. b4 was better.

  What you played:  41...Rb6 42. Nh4 Qd7 43. Ra8 Rb7 44. Nf5 h5 45. Qd5
  What was better:  41...b4 42. Nh4 Qc6 43. Re7 Qc3 44. Qxc3 bxc3 45. Nf5

Your move wasn't a disaster, but b4 would have improved king safety.
After the better line: the enemy queen is gone, so your king is fairly safe. After yours: 1 pawn(s) shielding the king, 4 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 17, 5. c4 (white): king_safety, missed_chance, gap 38 cp

**FEN:** `r1bqkbnr/pp1n1ppp/2pp4/4p3/3PP3/4B3/PPP1QPPP/RN2KBNR w KQkq - 0 5`  
**Played:** c4 Be7 Nc3 Ngf6 O-O-O Qa5 Kb1 exd4  
**Better:** Nd2 Ngf6 O-O-O Be7 dxe5 dxe5 Kb1 O-O  
**Measured:** before: 1 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it · after yours: 2 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it · after better: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it  
**Verdict:** King safety is a main reason (+0.40)  
**Term gains for the better line:** King safety +0.40, Pawns +0.13, Passed +0.13, Knights +0.06, Bishops +0.06, Mobility -0.09, Rooks -0.14, Threats -0.46  
**Taught instead at this move:** nothing

```
On move 5 you played c4. Nd2 was better.

  What you played:  5. c4 Be7 6. Nc3 Ngf6 7. O-O-O Qa5 8. Kb1 exd4
  What was better:  5. Nd2 Ngf6 6. O-O-O Be7 7. dxe5 dxe5 8. Kb1 O-O

Your move wasn't a disaster, but Nd2 would have improved king safety.
After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it. After yours: 2 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 17, 15. Rg1 (white): development, consequence, gap 43 cp

**FEN:** `r1b1kbn1/pp1nqp1r/2pp2p1/7p/3QP3/2N1BP2/PP2N1PP/1K1R1B1R w q - 3 15`  
**Played:** Rg1 Ne5 Nf4 g5 Nfe2 b5 Bc1  
**Better:** Nf4 Ne5 Be2 h4 Rhe1 Bg7 Qd2  
**Measured:** before: undeveloped: bishop on f1 · after yours: undeveloped: bishop on c1, bishop on f1 · after better: all minor pieces developed  
**Verdict:** Mobility is a main reason (+0.34)  
**Term gains for the better line:** Mobility +0.59, King safety +0.57, Space +0.12, Threats -0.09, Bishops -0.22  
**Taught instead at this move:** nothing

```
On move 15 you played Rg1. Nf4 was better.

  What you played:  15. Rg1 Ne5 16. Nf4 g5 17. Nfe2 b5 18. Bc1
  What was better:  15. Nf4 Ne5 16. Be2 h4 17. Rhe1 Bg7 18. Qd2

The difference is development. Before your move: undeveloped: bishop on f1.
After your line: undeveloped: bishop on c1, bishop on f1. After the better line: all minor pieces developed.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 19, 7. e5 (white): own_pawns, consequence, gap 36 cp

**FEN:** `r1bqk2r/1ppnbppp/p2ppn2/8/3PP3/2N2NP1/PPP2P1P/R1BQKB1R w KQkq - 1 7`  
**Played:** e5 Nd5 exd6 Bxd6 Bg2 Nxc3 bxc3 O-O  
**Better:** Bg2 O-O O-O b5 e5 Nd5 Nxd5 exd5  
**Measured:** before: no pawn weaknesses · after yours: isolated pawn(s) on a2; doubled pawns on the c-file · after better: no pawn weaknesses  
**Verdict:** Pawns is a main reason (+0.68)  
**Term gains for the better line:** Pawns +0.68, Rooks +0.24, Bishops +0.21, Space +0.21, King safety +0.09, Knights -0.07, Mobility -0.10, Threats -0.33  
**Taught instead at this move:** nothing

```
On move 7 you played e5. Bg2 was better.

  What you played:  7. e5 Nd5 8. exd6 Bxd6 9. Bg2 Nxc3 10. bxc3 O-O
  What was better:  7. Bg2 O-O 8. O-O b5 9. e5 Nd5 10. Nxd5 exd5

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on a2; doubled pawns on the c-file. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 19, 21. Rab1 (white): centre, missed_chance, gap 37 cp

**FEN:** `1rb1r1k1/5pp1/3p3p/1pn5/3p4/B5P1/P1P2PBP/R2R2K1 w - - 0 21`  
**Played:** Rab1 Ne4 Bxe4 Rxe4 Bxd6 Ra8  
**Better:** Rxd4 Rb6 Bb4 Bf5 Rad1 Re2  
**Measured:** before: centre control 3 vs 6 · after yours: centre control 2 vs 5 · after better: centre control 6 vs 5  
**Verdict:** Mobility is a main reason (+0.38)  
**Term gains for the better line:** Mobility +0.38, Bishops +0.05, Knights -0.08, Threats -0.18, Rooks -0.36  
**Taught instead at this move:** nothing

```
On move 21 you played Rab1. Rxd4 was better.

  What you played:  21. Rab1 Ne4 22. Bxe4 Rxe4 23. Bxd6 Ra8
  What was better:  21. Rxd4 Rb6 22. Bb4 Bf5 23. Rad1 Re2

Your move wasn't a disaster, but Rxd4 would have improved control of the centre.
After the better line: centre control 6 vs 5. After yours: centre control 2 vs 5.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

## Rejected near misses

### Game 2, 3... d5 (black): king_safety, consequence, gap 53 cp

**FEN:** `rnbqkbnr/pp1p1ppp/4p3/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3`  
**Played:** d5 exd5 exd5 Bb5+ Bd7 Bxd7+ Nxd7 O-O  
**Better:** cxd4 Nxd4 a6 Be2 Qc7 c4 Nf6 Nc3  
**Measured:** before: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it · after yours: 1 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it · after better: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it  
**Verdict:** King safety gains only 0.04  
**Term gains for the better line:** Threats +0.52, Rooks +0.35, Pawns +0.13, Knights -0.12, Bishops -0.20, Space -0.46, Mobility -0.62  
**Taught instead at this move:** nothing

```
On move 3 you played d5. cxd4 was better.

  What you played:  3...d5 4. exd5 exd5 5. Bb5+ Bd7 6. Bxd7+ Nxd7 7. O-O
  What was better:  3...cxd4 4. Nxd4 a6 5. Be2 Qc7 6. c4 Nf6 7. Nc3

The difference is king safety. Before your move: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.
After your line: 1 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it. After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 2, 23... Rg5 (black): king_activity, consequence, gap 44 cp

**FEN:** `5brr/1p2kp2/p6p/4pP2/4p3/1NP5/PP3P1P/2KRR3 b - - 0 23`  
**Played:** Rg5 Nc5 Rxf5 Rd7+ Ke8 Rxb7  
**Better:** Kf6 Nd2 e3 Ne4+ Kxf5 Rxe3  
**Measured:** before: your king on e7 is 2 step(s) from the centre; theirs on c1 is 3 · after yours: your king on e8 is 3 step(s) from the centre; theirs on c1 is 3 · after better: your king on f5 is 1 step(s) from the centre; theirs on c1 is 3  
**Verdict:** can't be verified  
**Term gains for the better line:** none  
**Taught instead at this move:** nothing

```
On move 23 you played Rg5. Kf6 was better.

  What you played:  23...Rg5 24. Nc5 Rxf5 25. Rd7+ Ke8 26. Rxb7
  What was better:  23...Kf6 24. Nd2 e3 25. Ne4+ Kxf5 26. Rxe3

The difference is king activity. Before your move: your king on e7 is 2 step(s) from the centre; theirs on c1 is 3.
After your line: your king on e8 is 3 step(s) from the centre; theirs on c1 is 3. After the better line: your king on f5 is 1 step(s) from the centre; theirs on c1 is 3.

Principle: Activate your king in the endgame. Once the queens are off, the king is no longer in danger and becomes a strong piece. Bring it towards the centre.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 4, 9... Nf6 (black): their_pawns, missed_chance, gap 44 cp

**FEN:** `r2qk1nr/1pp1bppp/p2p4/n2Pp3/8/1BP2N2/PP1P1PPP/R1BQ1RK1 b kq - 0 9`  
**Played:** Nf6 Bc2 Nxd5 d4 Nc6 Re1 Nf6  
**Better:** Nxb3 Qxb3 b6 Qc2 Nf6 d4 e4  
**Measured:** before: opponent's pawns: doubled pawns on the d-file · after yours: opponent's pawns: no pawn weaknesses · after better: opponent's pawns: doubled pawns on the d-file  
**Verdict:** Pawns gains only -0.16  
**Term gains for the better line:** Threats +0.82, Mobility +0.25, Rooks +0.12, Bishops +0.08, Knights +0.06, Space -0.12, Pawns -0.16, King safety -0.49  
**Taught instead at this move:** nothing

```
On move 9 you played Nf6. Nxb3 was better.

  What you played:  9...Nf6 10. Bc2 Nxd5 11. d4 Nc6 12. Re1 Nf6
  What was better:  9...Nxb3 10. Qxb3 b6 11. Qc2 Nf6 12. d4 e4

Your move wasn't a disaster, but Nxb3 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: doubled pawns on the d-file. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 5, 8. Qe2 (white): their_pawns, missed_chance, gap 55 cp

**FEN:** `r1bqk2r/ppp3pp/2npp2n/4Pp2/3P4/P1B5/1PP2PPP/R2QKBNR w KQkq - 1 8`  
**Played:** Qe2 dxe5 dxe5 Qe7 O-O-O Bd7 Nh3 O-O-O  
**Better:** exd6 Qxd6 Qh5+ Nf7 O-O-O Bd7 Bc4 Qf4+  
**Measured:** before: opponent's pawns: no pawn weaknesses · after yours: opponent's pawns: no pawn weaknesses · after better: opponent's pawns: backward pawn(s) on e6  
**Verdict:** Pawns gains only 0.00  
**Term gains for the better line:** Mobility +0.47, Rooks +0.24, King safety +0.11, Space -0.08, Bishops -0.18  
**Taught instead at this move:** nothing

```
On move 8 you played Qe2. exd6 was better.

  What you played:  8. Qe2 dxe5 9. dxe5 Qe7 10. O-O-O Bd7 11. Nh3 O-O-O
  What was better:  8. exd6 Qxd6 9. Qh5+ Nf7 10. O-O-O Bd7 11. Bc4 Qf4+

Your move wasn't a disaster, but exd6 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: backward pawn(s) on e6. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 8, 5... Nxd5 (black): development, missed_chance, gap 39 cp

**FEN:** `rnbqkb1r/pp1p1ppp/2p2n2/3P4/4p3/1PN1P3/P1P2PPP/R1BQKBNR b KQkq - 1 5`  
**Played:** Nxd5 Nxd5 Qa5+ c3 Qxd5 Qxd5 cxd5 Bb2  
**Better:** Bb4 Bd2 cxd5 Nb5 Bxd2+ Qxd2 Nc6 Nd6+  
**Measured:** before: undeveloped: knight on b8, bishop on c8, bishop on f8 · after yours: undeveloped: knight on b8, bishop on c8, bishop on f8 · after better: undeveloped: bishop on c8  
**Verdict:** Mobility/Knights/Bishops gains only -0.38  
**Term gains for the better line:** Space +0.48, Threats +0.24, Rooks +0.05, Knights -0.15, Bishops -0.23, King safety -1.11  
**Taught instead at this move:** nothing

```
On move 5 you played Nxd5. Bb4 was better.

  What you played:  5...Nxd5 6. Nxd5 Qa5+ 7. c3 Qxd5 8. Qxd5 cxd5 9. Bb2
  What was better:  5...Bb4 6. Bd2 cxd5 7. Nb5 Bxd2+ 8. Qxd2 Nc6 9. Nd6+

Your move wasn't a disaster, but Bb4 would have improved development.
After the better line: undeveloped: bishop on c8. After yours: undeveloped: knight on b8, bishop on c8, bishop on f8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 9, 24. axb4 (white): own_pawns, consequence, gap 45 cp

**FEN:** `r3k2r/p4p2/b1p1p1p1/1qb1P2p/1n2B3/P3BN1P/1P3PP1/R1Q3K1 w kq - 0 24`  
**Played:** axb4 Bxe3 Bxc6+ Ke7 fxe3 Qc4 Bxa8 Rxa8  
**Better:** Bxc5 Nd5 Bxd5 cxd5 Bd6 Rc8 Qg5 Qd7  
**Measured:** before: no pawn weaknesses · after yours: isolated pawn(s) on b2, e3, b4, e5; doubled pawns on the b-file, e-file · after better: no pawn weaknesses  
**Verdict:** King safety (+0.81) dwarfs Pawns (+0.15)  
**Term gains for the better line:** King safety +0.81, Pawns +0.15, Mobility +0.06, Rooks -0.22, Bishops -0.33, Threats -0.61  
**Taught instead at this move:** own_pawns (consequence)

```
On move 24 you played axb4. Bxc5 was better.

  What you played:  24. axb4 Bxe3 25. Bxc6+ Ke7 26. fxe3 Qc4 27. Bxa8 Rxa8
  What was better:  24. Bxc5 Nd5 25. Bxd5 cxd5 26. Bd6 Rc8 27. Qg5 Qd7

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on b2, e3, b4, e5; doubled pawns on the b-file, e-file. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 10, 9... Bc6 (black): development, missed_chance, gap 52 cp

**FEN:** `rn1qk2r/p2pbppp/1p2pn2/8/2PN4/1P2P3/PB2BPbP/RN1QK1R1 b Qkq - 1 9`  
**Played:** Bc6 Rxg7 Qc7 Rg3 a6 Nc3 h5 h4  
**Better:** Bb7 Rxg7 Nc6 Nc3 Qc7 Rg3 a6 Nxc6  
**Measured:** before: undeveloped: knight on b8 · after yours: undeveloped: knight on b8 · after better: all minor pieces developed  
**Verdict:** Mobility/Knights/Bishops gains only 0.06  
**Term gains for the better line:** Threats +1.51, Knights +0.25, Space -0.06, Mobility -0.19, Rooks -0.26, King safety -0.82  
**Taught instead at this move:** nothing

```
On move 9 you played Bc6. Bb7 was better.

  What you played:  9...Bc6 10. Rxg7 Qc7 11. Rg3 a6 12. Nc3 h5 13. h4
  What was better:  9...Bb7 10. Rxg7 Nc6 11. Nc3 Qc7 12. Rg3 a6 13. Nxc6

Your move wasn't a disaster, but Bb7 would have improved development.
After the better line: all minor pieces developed. After yours: undeveloped: knight on b8.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 11, 15. a4 (white): own_pawns, consequence, gap 51 cp

**FEN:** `2r1k2r/1bqn1p1p/pp2pp2/2b5/2B5/1P2PN2/P3NPPP/R2Q1RK1 w k - 1 15`  
**Played:** a4 Ke7 Ng3 h5 Nh4 a5 Rc1 Ne5  
**Better:** Rc1 Ne5 Nxe5 Qxe5 b4 Be7 Nf4 Rg8  
**Measured:** before: no pawn weaknesses · after yours: backward pawn(s) on b3 · after better: no pawn weaknesses  
**Verdict:** Pawns gains only -0.06  
**Term gains for the better line:** King safety +1.76, Mobility +0.38, Bishops +0.05, Pawns -0.06, Rooks -0.08, Knights -0.18, Threats -0.50  
**Taught instead at this move:** nothing

```
On move 15 you played a4. Rc1 was better.

  What you played:  15. a4 Ke7 16. Ng3 h5 17. Nh4 a5 18. Rc1 Ne5
  What was better:  15. Rc1 Ne5 16. Nxe5 Qxe5 17. b4 Be7 18. Nf4 Rg8

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: backward pawn(s) on b3. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 12, 23... Ba4 (black): centre, consequence, gap 41 cp

**FEN:** `1rr1b2k/np2qpp1/4pn1p/2Pp4/1P1N4/4P2P/1Q1N1PP1/2RR1BK1 b - - 2 23`  
**Played:** Ba4 Re1 Be8 e4 b6 exd5 Nxd5 Nf5  
**Better:** b6 cxb6 Rxb6 Rxc8 Nxc8 b5 Nd6 Rc1  
**Measured:** before: centre control 6 vs 4 · after yours: centre control 2 vs 6 · after better: centre control 7 vs 4  
**Verdict:** Space/Mobility isn't a main reason (top: King safety 2.24, Queens 0.43)  
**Term gains for the better line:** King safety +2.24, Queens +0.43, Pawns +0.39, Mobility +0.39, Space +0.11, Passed +0.05, Bishops -0.09, Rooks -0.10, Knights -0.15, Threats -0.32  
**Taught instead at this move:** nothing

```
On move 23 you played Ba4. b6 was better.

  What you played:  23...Ba4 24. Re1 Be8 25. e4 b6 26. exd5 Nxd5 27. Nf5
  What was better:  23...b6 24. cxb6 Rxb6 25. Rxc8 Nxc8 26. b5 Nd6 27. Rc1

The difference is control of the centre. Before your move: centre control 6 vs 4.
After your line: centre control 2 vs 6. After the better line: centre control 7 vs 4.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 12, 25... Qe8 (black): passed_pawns, consequence, gap 59 cp

**FEN:** `1rr4k/np2qpp1/4p2p/2Pp4/bP1Nn3/1N2P2P/1Q3PP1/R2R1BK1 b - - 6 25`  
**Played:** Qe8 Rdc1 b6 cxb6 Rxb6 b5 Bxb3 Rxc8  
**Better:** Bxb3 Qxb3 Nc6 Bd3 Nf6 Qb2 Nd7 Rac1  
**Measured:** before: your passed pawns: none; theirs: none · after yours: your passed pawns: none; theirs: b5 · after better: your passed pawns: none; theirs: none  
**Verdict:** Passed isn't a main reason (top: King safety 1.50, Threats 0.88)  
**Term gains for the better line:** King safety +1.50, Threats +0.88, Mobility +0.41, Passed +0.36, Rooks +0.30, Bishops +0.27, Space -0.07, Pawns -0.42  
**Taught instead at this move:** nothing

```
On move 25 you played Qe8. Bxb3 was better.

  What you played:  25...Qe8 26. Rdc1 b6 27. cxb6 Rxb6 28. b5 Bxb3 29. Rxc8
  What was better:  25...Bxb3 26. Qxb3 Nc6 27. Bd3 Nf6 28. Qb2 Nd7 29. Rac1

The difference is passed pawns. Before your move: your passed pawns: none; theirs: none.
After your line: your passed pawns: none; theirs: b5. After the better line: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 13, 23. O-O (white): king_activity, missed_chance, gap 40 cp

**FEN:** `r2kr3/1p3p2/2p2pn1/3p3p/Pp1P3P/1P2P1PB/5P2/2R1K2R w K - 3 23`  
**Played:** O-O Ne7 Bg2  
**Better:** Kd2 Ne7 g4  
**Measured:** before: your king on e1 is 3 step(s) from the centre; theirs on d8 is 3 · after yours: your king on g1 is 3 step(s) from the centre; theirs on d8 is 3 · after better: your king on d2 is 2 step(s) from the centre; theirs on d8 is 3  
**Verdict:** can't be verified  
**Term gains for the better line:** none  
**Taught instead at this move:** nothing

```
On move 23 you played O-O. Kd2 was better.

  What you played:  23. O-O Ne7 24. Bg2
  What was better:  23. Kd2 Ne7 24. g4

Your move wasn't a disaster, but Kd2 would have improved king activity.
After the better line: your king on d2 is 2 step(s) from the centre; theirs on d8 is 3. After yours: your king on g1 is 3 step(s) from the centre; theirs on d8 is 3.

Principle: Activate your king in the endgame. Once the queens are off, the king is no longer in danger and becomes a strong piece. Bring it towards the centre.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 13, 27. Rfc1 (white): king_activity, missed_chance, gap 43 cp

**FEN:** `r3r3/2k1np2/1pp5/3p1p1p/Pp1P3P/1P2P1PB/2R2PK1/5R2 w - - 2 27`  
**Played:** Rfc1 Kb7  
**Better:** Kf3 Rg8  
**Measured:** before: your king on g2 is 2 step(s) from the centre; theirs on c7 is 2 · after yours: your king on g2 is 2 step(s) from the centre; theirs on b7 is 2 · after better: your king on f3 is 1 step(s) from the centre; theirs on c7 is 2  
**Verdict:** can't be verified  
**Term gains for the better line:** none  
**Taught instead at this move:** nothing

```
On move 27 you played Rfc1. Kf3 was better.

  What you played:  27. Rfc1 Kb7
  What was better:  27. Kf3 Rg8

Your move wasn't a disaster, but Kf3 would have improved king activity.
After the better line: your king on f3 is 1 step(s) from the centre; theirs on c7 is 2. After yours: your king on g2 is 2 step(s) from the centre; theirs on b7 is 2.

Principle: Activate your king in the endgame. Once the queens are off, the king is no longer in danger and becomes a strong piece. Bring it towards the centre.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 13, 32. Bg2 (white): king_activity, consequence, gap 62 cp

**FEN:** `3k4/4np2/1pp4r/r2p1p1p/Pp1P3P/1P2P1PB/2R2P2/2R3K1 w - - 12 32`  
**Played:** Bg2 Kd7 Bf1  
**Better:** Kg2 Kd7 Kf3  
**Measured:** before: your king on g1 is 3 step(s) from the centre; theirs on d8 is 3 · after yours: your king on g1 is 3 step(s) from the centre; theirs on d7 is 2 · after better: your king on f3 is 1 step(s) from the centre; theirs on d7 is 2  
**Verdict:** can't be verified  
**Term gains for the better line:** none  
**Taught instead at this move:** nothing

```
On move 32 you played Bg2. Kg2 was better.

  What you played:  32. Bg2 Kd7 33. Bf1
  What was better:  32. Kg2 Kd7 33. Kf3

The difference is king activity. Before your move: your king on g1 is 3 step(s) from the centre; theirs on d8 is 3.
After your line: your king on g1 is 3 step(s) from the centre; theirs on d7 is 2. After the better line: your king on f3 is 1 step(s) from the centre; theirs on d7 is 2.

Principle: Activate your king in the endgame. Once the queens are off, the king is no longer in danger and becomes a strong piece. Bring it towards the centre.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 15, 14. Ra4 (white): passed_pawns, consequence, gap 69 cp

**FEN:** `rnb2rk1/pp3ppp/2p2b2/q7/4R1P1/2p2N1P/PP3PB1/R1BQ2K1 w - - 1 14`  
**Played:** Ra4 Qd8 Qc2 cxb2 Bxb2 Bxb2 Qxb2 Nd7  
**Better:** bxc3 Na6 Be3 Be6 Bd4 Bd5 Re3 Bxd4  
**Measured:** before: your passed pawns: none; theirs: none · after yours: your passed pawns: none; theirs: c6 · after better: your passed pawns: none; theirs: none  
**Verdict:** Passed gains only 0.02  
**Term gains for the better line:** Threats +1.02, Queens +0.22, Rooks +0.20, Knights +0.09, Bishops +0.06, King safety -0.16, Mobility -0.69  
**Taught instead at this move:** nothing

```
On move 14 you played Ra4. bxc3 was better.

  What you played:  14. Ra4 Qd8 15. Qc2 cxb2 16. Bxb2 Bxb2 17. Qxb2 Nd7
  What was better:  14. bxc3 Na6 15. Be3 Be6 16. Bd4 Bd5 17. Re3 Bxd4

The difference is passed pawns. Before your move: your passed pawns: none; theirs: none.
After your line: your passed pawns: none; theirs: c6. After the better line: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 33... Ng6 (black): their_pawns, missed_chance, gap 46 cp

**FEN:** `5nk1/4qpp1/1r5p/1p2p3/4P3/3P3P/2PN1PPK/Q4R2 b - - 1 33`  
**Played:** Ng6 g3 Qc5 Qa7 Nf8 Kg2 Rc6 Qxc5  
**Better:** Qc7 Qa5 Rb7 Qxc7 Rxc7 c4 bxc4 Nxc4  
**Measured:** before: opponent's pawns: no pawn weaknesses · after yours: opponent's pawns: no pawn weaknesses · after better: opponent's pawns: backward pawn(s) on d3  
**Verdict:** Pawns gains only 0.09  
**Term gains for the better line:** Rooks +0.10, Pawns +0.09, Mobility -0.12, Threats -0.25  
**Taught instead at this move:** nothing

```
On move 33 you played Ng6. Qc7 was better.

  What you played:  33...Ng6 34. g3 Qc5 35. Qa7 Nf8 36. Kg2 Rc6 37. Qxc5
  What was better:  33...Qc7 34. Qa5 Rb7 35. Qxc7 Rxc7 36. c4 bxc4 37. Nxc4

Your move wasn't a disaster, but Qc7 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: backward pawn(s) on d3. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 39... f6 (black): centre, consequence, gap 50 cp

**FEN:** `8/5ppk/2rqn2p/1p2p3/4P3/1Q1P1NPP/2P2PK1/R7 b - - 6 39`  
**Played:** f6 Qd5 Qc7 Ra7 Qb6 Re7 Rd6  
**Better:** Qb8 Ra5 Rc5 c3 Qd8 Rxb5 Qxd3  
**Measured:** before: centre control 7 vs 7 · after yours: centre control 7 vs 10 · after better: centre control 9 vs 7  
**Verdict:** Space/Mobility gains only -0.13  
**Term gains for the better line:** Threats +1.46, King safety +0.42, Pawns +0.15, Rooks -0.05, Mobility -0.13  
**Taught instead at this move:** material (consequence)

```
On move 39 you played f6. Qb8 was better.

  What you played:  39...f6 40. Qd5 Qc7 41. Ra7 Qb6 42. Re7 Rd6
  What was better:  39...Qb8 40. Ra5 Rc5 41. c3 Qd8 42. Rxb5 Qxd3

The difference is control of the centre. Before your move: centre control 7 vs 7.
After your line: centre control 7 vs 10. After the better line: centre control 9 vs 7.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 19, 4. d3 (white): development, missed_chance, gap 58 cp

**FEN:** `rnbqkb1r/1ppp1ppp/p3pn2/8/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4`  
**Played:** d3 d5 e5 Nfd7 Ne2 c5 c3 Qa5  
**Better:** e5 Nd5 Nxd5 exd5 d4 d6 Bd3 dxe5  
**Measured:** before: undeveloped: bishop on c1, bishop on f1 · after yours: undeveloped: bishop on c1, bishop on f1 · after better: undeveloped: bishop on c1  
**Verdict:** Mobility/Knights/Bishops gains only -0.01  
**Term gains for the better line:** Pawns -0.08, Threats -0.12, Queens -0.25, Space -0.25  
**Taught instead at this move:** nothing

```
On move 4 you played d3. e5 was better.

  What you played:  4. d3 d5 5. e5 Nfd7 6. Ne2 c5 7. c3 Qa5
  What was better:  4. e5 Nd5 5. Nxd5 exd5 6. d4 d6 7. Bd3 dxe5

Your move wasn't a disaster, but e5 would have improved development.
After the better line: undeveloped: bishop on c1. After yours: undeveloped: bishop on c1, bishop on f1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 20, 20... Ngh4 (black): passed_pawns, missed_chance, gap 43 cp

**FEN:** `2k3rr/1pq2p1p/p2bp1n1/2Bp1n2/N4P2/1N5P/PPPQ2P1/3R1RK1 b - - 10 20`  
**Played:** Ngh4 g4 h5 g5 Kb8 Bxd6 Qxd6 Nac5  
**Better:** Nxf4 Bxd6 Nxh3+ Kh1 Nxd6 gxh3 Ne4 Qf4  
**Measured:** before: your passed pawns: none; theirs: none · after yours: your passed pawns: none; theirs: none · after better: your passed pawns: e6, f7; theirs: none  
**Verdict:** Passed gains only -0.06  
**Term gains for the better line:** King safety +1.15, Pawns +0.37, Threats +0.32, Space +0.09, Passed -0.06, Knights -0.10, Mobility -0.10  
**Taught instead at this move:** nothing

```
On move 20 you played Ngh4. Nxf4 was better.

  What you played:  20...Ngh4 21. g4 h5 22. g5 Kb8 23. Bxd6 Qxd6 24. Nac5
  What was better:  20...Nxf4 21. Bxd6 Nxh3+ 22. Kh1 Nxd6 23. gxh3 Ne4 24. Qf4

Your move wasn't a disaster, but Nxf4 would have improved passed pawns.
After the better line: your passed pawns: e6, f7; theirs: none. After yours: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

