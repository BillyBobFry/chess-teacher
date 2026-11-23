# Classical-evaluation check on strategic lessons

24 simulated games, depth 10. 43 strategic lessons: **17 kept**, **26 rejected**, 0 not checkable.

| Feature | Kept | Rejected |
|---|---|---|
| centre | 6 | 2 |
| their_pawns | 0 | 5 |
| king_safety | 4 | 0 |
| king_activity | 0 | 2 |
| development | 0 | 3 |
| own_pawns | 0 | 7 |
| mobility | 5 | 3 |
| outposts | 1 | 0 |
| open_files | 1 | 1 |
| passed_pawns | 0 | 3 |

## Kept

### Game 3, 22. Ba3 (white): king_safety, consequence

**Verdict:** King safety is a main reason (+0.38)  
**Term gains for the better line:** Threats +1.13, King safety +0.38, Passed +0.18, Rooks +0.14, Space +0.11, Bishops -0.05, Mobility -0.25

```
On move 22 you played Ba3. c3 was better.

  What you played:  22. Ba3 Rc7 23. Bb4 dxe3
  What was better:  22. c3 dxe3 23. Qxd8+ Rxd8

The difference is king safety. Before your move: 2 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it.
After your line: 1 pawn(s) shielding the king, 5 enemy attack(s) on the squares around it. After the better line: the enemy queen is gone, so your king is fairly safe.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 3, 23. fxe3 (white): king_safety, missed_chance

**Verdict:** King safety is a main reason (+0.65)  
**Term gains for the better line:** Threats +1.37, King safety +0.65, Bishops +0.27, Pawns +0.06, Passed -0.08

```
On move 23 you played fxe3. Qxd8+ was better.

  What you played:  23. fxe3 Rd7 24. Qb4 Rc8 25. Qb3 Bc4 26. Qc3 Be6
  What was better:  23. Qxd8+ Rxd8 24. fxe3 Rc7 25. c4 Rxc4 26. Rd1 Rxd1+

Your move wasn't a disaster, but Qxd8+ would have improved king safety.
After the better line: the enemy queen is gone, so your king is fairly safe. After yours: 1 pawn(s) shielding the king, 2 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 4, 34... Nc6 (black): centre, consequence

**Verdict:** Mobility is a main reason (+0.48)  
**Term gains for the better line:** Mobility +0.48, King safety +0.46, Knights +0.06, Threats -0.18, Passed -0.49

```
On move 34 you played Nc6. g5 was better.

  What you played:  34...Nc6 35. f4 Bb8 36. Bd5 d3 37. Kf2
  What was better:  34...g5 35. f3 Nf5 36. Kf2 Bg3+ 37. Ke2

The difference is control of the centre. Before your move: centre control 8 vs 2.
After your line: centre control 4 vs 4. After the better line: centre control 7 vs 3.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 5, 3. c4 (white): king_safety, consequence

**Verdict:** King safety is a main reason (+0.25)  
**Term gains for the better line:** King safety +0.25, Knights +0.24, Mobility +0.13, Bishops +0.11, Pawns -0.14, Threats -0.23, Space -0.24

```
On move 3 you played c4. Bb2 was better.

  What you played:  3. c4 d4 4. e3 Nc6 5. exd4 Nxd4 6. Bb2 e5
  What was better:  3. Bb2 Bf5 4. e3 e6 5. Be2 c5 6. c4 Be7

The difference is king safety. Before your move: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.
After your line: 2 pawn(s) shielding the king, 1 enemy attack(s) on the squares around it. After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 7, 24. Rc4 (white): mobility, missed_chance

**Verdict:** Mobility is a main reason (+0.10)  
**Term gains for the better line:** Mobility +0.10, Rooks +0.08, King safety -0.16, Threats -0.25

```
On move 24 you played Rc4. Be3 was better.

  What you played:  24. Rc4 g5 25. Be3 Nxe5 26. Rxb4 Ncd3 27. Rb5
  What was better:  24. Be3 Nxd4 25. Nxd4 Rd7 26. Rc2 Nd3 27. Nc6

Your move wasn't a disaster, but Be3 would have improved piece activity.
After the better line: 29 piece moves available vs opponent's 30. After yours: 28 piece moves available vs opponent's 39.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 7, 30. Bb6 (white): outposts, consequence

**Verdict:** Knights is a main reason (+0.41)  
**Term gains for the better line:** Threats +0.39, Knights +0.24, Bishops +0.17, Passed +0.10, King safety -0.10, Rooks -0.11, Mobility -0.43

```
On move 30 you played Bb6. Kf1 was better.

  What you played:  30. Bb6 Nd5 31. Rc1 Ra6 32. Nb8 Ra8 33. Rc8 Kg7
  What was better:  30. Kf1 Kh7 31. Ke2 Ra6 32. Nb8 Ra8 33. Nd7 Be7

The difference is knight outposts. Before your move: your knight outposts: none; theirs: none.
After your line: your knight outposts: none; theirs: d5. After the better line: your knight outposts: none; theirs: none.

Principle: Knights love outposts. A knight on a square that enemy pawns can never attack, defended by your own pawn, is often as strong as a rook.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 10, 17... Nb5 (black): centre, missed_chance

**Verdict:** Mobility is a main reason (+0.44)  
**Term gains for the better line:** King safety +0.45, Mobility +0.30, Threats +0.26, Space +0.14, Bishops +0.13, Queens -0.21

```
On move 17 you played Nb5. Qxd4 was better.

  What you played:  17...Nb5 18. Bd3
  What was better:  17...Qxd4 18. Bb3

Your move wasn't a disaster, but Qxd4 would have improved control of the centre.
After the better line: centre control 7 vs 5. After yours: centre control 4 vs 8.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 13, 29. Nd5 (white): centre, missed_chance

**Verdict:** Mobility is a main reason (+0.84)  
**Term gains for the better line:** Mobility +0.84, Threats +0.68, Pawns +0.25, Bishops +0.06, Knights -0.16, Rooks -0.16, Passed -0.32, King safety -0.98

```
On move 29 you played Nd5. Ng4 was better.

  What you played:  29. Nd5 Re6 30. Qh5 Bb8 31. Re3 b5 32. Rf3 f6
  What was better:  29. Ng4 Rf5 30. Nxe5 Qd4 31. Nf3 Qxd3 32. Qxd3 Rxd3

Your move wasn't a disaster, but Ng4 would have improved control of the centre.
After the better line: centre control 5 vs 4. After yours: centre control 4 vs 7.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 14, 4... Bd6 (black): centre, consequence

**Verdict:** Space is a main reason (+0.92)  
**Term gains for the better line:** Threats +0.80, Space +0.61, Mobility +0.31, Pawns +0.18, Bishops +0.08, King safety +0.06

```
On move 4 you played Bd6. d4 was better.

  What you played:  4...Bd6 5. d4 Nd7 6. Bd3 Bc7 7. Qe2
  What was better:  4...d4 5. Nb1 c5 6. Bb5+ Bd7 7. a4

The difference is control of the centre. Before your move: centre control 6 vs 7.
After your line: centre control 7 vs 12. After the better line: centre control 4 vs 5.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 14, 11... f5 (black): mobility, consequence

**Verdict:** Mobility is a main reason (+0.32)  
**Term gains for the better line:** Threats +0.56, Mobility +0.32, Pawns +0.10, Space -0.08, Rooks -0.12, King safety -0.53

```
On move 11 you played f5. O-O was better.

  What you played:  11...f5 12. Bg5 Ne7 13. Ng3 O-O 14. Rfe1 Nf6 15. Bc4
  What was better:  11...O-O 12. Rae1 e5 13. h4 exd4 14. Bxd4 Nde5 15. Bxe5

The difference is piece activity. Before your move: 22 piece moves available vs opponent's 33.
After your line: 24 piece moves available vs opponent's 44. After the better line: 25 piece moves available vs opponent's 37.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 15, 22. Nd3 (white): mobility, consequence

**Verdict:** Mobility is a main reason (+0.57)  
**Term gains for the better line:** Mobility +0.57, Queens +0.50, King safety +0.17, Knights -0.05, Bishops -0.06, Space -0.06, Rooks -0.13, Threats -1.45

```
On move 22 you played Nd3. Na7 was better.

  What you played:  22. Nd3 Nd5 23. Bd4 Bg5 24. Rb1
  What was better:  22. Na7 axb4 23. axb4 Ra8 24. Nec6

The difference is piece activity. Before your move: 39 piece moves available vs opponent's 25.
After your line: 35 piece moves available vs opponent's 37. After the better line: 35 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 12... Qc7 (black): mobility, missed_chance

**Verdict:** Mobility is a main reason (+0.50)  
**Term gains for the better line:** Mobility +0.50, Threats +0.29, Space +0.07, Knights -0.08, Bishops -0.08, King safety -0.36

```
On move 12 you played Qc7. b5 was better.

  What you played:  12...Qc7 13. Nc2 Nbd7 14. a4 O-O
  What was better:  12...b5 13. Nc2 g5 14. Bg3 h5

Your move wasn't a disaster, but b5 would have improved piece activity.
After the better line: 28 piece moves available vs opponent's 24. After yours: 18 piece moves available vs opponent's 27.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 29... Qd8 (black): centre, missed_chance

**Verdict:** Mobility is a main reason (+0.85)  
**Term gains for the better line:** King safety +0.84, Mobility +0.50, Space +0.35, Pawns +0.34, Queens -0.25, Knights -0.44, Bishops -0.49, Threats -1.41

```
On move 29 you played Qd8. Rh7 was better.

  What you played:  29...Qd8 30. Nxe5 Bg7 31. f4
  What was better:  29...Rh7 30. Qa3 Kg8 31. Ne1

Your move wasn't a disaster, but Rh7 would have improved control of the centre.
After the better line: centre control 7 vs 8. After yours: centre control 4 vs 11.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 17, 4. d3 (white): king_safety, missed_chance

**Verdict:** King safety is a main reason (+0.76)  
**Term gains for the better line:** King safety +0.76, Rooks +0.24, Space +0.07, Knights -0.24, Bishops -0.26, Pawns -0.29, Mobility -0.32, Threats -0.34

```
On move 4 you played d3. exd5 was better.

  What you played:  4. d3 Nc6 5. Be2 Bd6 6. exd5 exd5 7. d4 cxd4
  What was better:  4. exd5 exd5 5. Bb5+ Bd7 6. Bxd7+ Qxd7 7. O-O Nc6

Your move wasn't a disaster, but exd5 would have improved king safety.
After the better line: 3 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it. After yours: 1 pawn(s) shielding the king, 0 enemy attack(s) on the squares around it.

Principle: Keep your king safe. Castle early and keep the pawns in front of your king where they are. Every pawn move there leaves holes your opponent can use.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 19, 7. Nbd2 (white): mobility, consequence

**Verdict:** Mobility is a main reason (+0.71)  
**Term gains for the better line:** Mobility +0.71, King safety +0.17, Rooks +0.15, Knights -0.05, Pawns -0.11, Space -0.22, Bishops -0.30, Threats -0.48

```
On move 7 you played Nbd2. Bf4 was better.

  What you played:  7. Nbd2 Bd6 8. c4 Ngf6 9. e3 a5 10. Nh4
  What was better:  7. Bf4 Qb6 8. Ra2 a5 9. Nh4 Bxb1 10. Qxb1

The difference is piece activity. Before your move: 21 piece moves available vs opponent's 34.
After your line: 20 piece moves available vs opponent's 41. After the better line: 27 piece moves available vs opponent's 29.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 21, 14. Nb5 (white): open_files, missed_chance

**Verdict:** Rooks is a main reason (+0.20)  
**Term gains for the better line:** Rooks +0.20, Passed +0.09, Knights +0.05, Pawns -0.14, Space -0.22, Bishops -0.38, Mobility -0.39, Threats -0.39, King safety -0.49

```
On move 14 you played Nb5. h3 was better.

  What you played:  14. Nb5 a3 15. b3 Nb4 16. Bxb4 cxb4 17. h3 Nh6
  What was better:  14. h3 Nh6 15. g4 e5 16. d5 e4 17. dxc6 exf3

Your move wasn't a disaster, but h3 would have improved rooks on open files.
After the better line: your rooks on open files: d1; theirs: none. After yours: your rooks on open files: none; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 23, 2. d3 (white): centre, consequence

**Verdict:** Mobility is a main reason (+0.78)  
**Term gains for the better line:** King safety +1.04, Mobility +0.78, Queens +0.25, Knights -0.10, Bishops -0.12, Pawns -0.15, Threats -0.40

```
On move 2 you played d3. exd5 was better.

  What you played:  2. d3 e5 3. exd5 Qxd5 4. a3 Nc6
  What was better:  2. exd5 Qxd5 3. Nc3 Qa5 4. a3 c5

The difference is control of the centre. Before your move: centre control 3 vs 4.
After your line: centre control 1 vs 9. After the better line: centre control 2 vs 1.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

## Rejected

### Game 1, 12. Qe2 (white): centre, consequence

**Verdict:** Space/Mobility isn't a main reason (top: Passed 0.76, King safety 0.59)  
**Term gains for the better line:** Passed +0.76, King safety +0.59, Space +0.36, Knights +0.09, Mobility +0.05, Pawns -0.08, Rooks -0.09, Bishops -0.27, Threats -0.70

```
On move 12 you played Qe2. e5 was better.

  What you played:  12. Qe2 b4 13. e5 bxc3 14. exf6 Bxf6
  What was better:  12. e5 Ne8 13. Bc2 b4 14. Na4 c5

The difference is control of the centre. Before your move: centre control 13 vs 5.
After your line: centre control 8 vs 5. After the better line: centre control 11 vs 5.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 2, 30... a5 (black): their_pawns, missed_chance

**Verdict:** Pawns isn't a main reason (top: Threats 0.41, Bishops 0.22)  
**Term gains for the better line:** Threats +0.41, Bishops +0.22, Pawns +0.19, Rooks +0.17, King safety -0.40, Mobility -0.54

```
On move 30 you played a5. Be6 was better.

  What you played:  30...a5 31. Qc7 Ree8 32. Kg2 Bf5 33. Rc4 Qb3
  What was better:  30...Be6 31. Kg2 d3 32. exd3 Bd5 33. Bxd5 Qg4+

Your move wasn't a disaster, but Be6 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on f2, d3, a4, h4. After yours: opponent's pawns: isolated pawn(s) on a4, h4.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 4, 31... d4 (black): king_activity, missed_chance

**Verdict:** can't be verified  
**Term gains for the better line:** none

```
On move 31 you played d4. Nc6 was better.

  What you played:  31...d4 32. Bd3 Nc6 33. Nd6+ Bxd6 34. Bxd6 Na5 35. b4
  What was better:  31...Nc6 32. Bd3 Kf6 33. Bd6 Bxd6 34. Nxd6 Nb4 35. Be2

Your move wasn't a disaster, but Nc6 would have improved king activity.
After the better line: your king on f6 is 1 step(s) from the centre; theirs on g1 is 3. After yours: your king on f7 is 2 step(s) from the centre; theirs on g1 is 3.

Principle: Activate your king in the endgame. Once the queens are off, the king is no longer in danger and becomes a strong piece. Bring it towards the centre.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 5, 21. Qf2 (white): their_pawns, missed_chance

**Verdict:** Pawns isn't a main reason (top: Rooks 0.63, King safety 0.60)  
**Term gains for the better line:** Rooks +0.63, King safety +0.60, Passed +0.39, Pawns +0.38, Space +0.08, Mobility +0.07, Bishops -0.13, Queens -0.22, Threats -1.67

```
On move 21 you played Qf2. Bxf6 was better.

  What you played:  21. Qf2 Qe7 22. Qg3 O-O-O
  What was better:  21. Bxf6 gxf6 22. Rxb7 Bc6

Your move wasn't a disaster, but Bxf6 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on a6, h7; doubled pawns on the f-file. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 7, 3. h3 (white): development, missed_chance

**Verdict:** Mobility/Knights/Bishops gains only -0.24  
**Term gains for the better line:** Threats +0.19, Mobility -0.06, Space -0.06, Rooks -0.10, Pawns -0.13, Bishops -0.15, King safety -1.05

```
On move 3 you played h3. Bxc4 was better.

  What you played:  3. h3 Nc6 4. Bxc4 Ne5 5. Qb3 Nxc4 6. Qxc4 b6
  What was better:  3. Bxc4 Nf6 4. Nc3 e6 5. Nf3 Be7 6. O-O O-O

Your move wasn't a disaster, but Bxc4 would have improved development.
After the better line: undeveloped: bishop on c1. After yours: undeveloped: knight on b1, knight on g1, bishop on c1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 7, 13. Re1 (white): own_pawns, consequence

**Verdict:** Pawns gains only -0.15  
**Term gains for the better line:** King safety +0.37, Knights +0.28, Threats +0.10, Rooks -0.09, Mobility -0.12, Passed -0.13, Pawns -0.15, Space -0.17, Bishops -0.31

```
On move 13 you played Re1. d4 was better.

  What you played:  13. Re1 c5 14. Nb3 e5 15. Be3 Rc7 16. Rec1 Nc6
  What was better:  13. d4 c5 14. Nb3 cxd4 15. Bf4 g5 16. Bg3 e5

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: backward pawn(s) on d3. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 8, 14... Rc8 (black): their_pawns, missed_chance

**Verdict:** Pawns gains only -0.02  
**Term gains for the better line:** Passed +0.57, Mobility +0.30, Knights +0.08, Rooks +0.06, Bishops -0.42, Threats -0.86

```
On move 14 you played Rc8. f5 was better.

  What you played:  14...Rc8 15. Nxa8 b5 16. Nc7 Rxc7 17. Rc1
  What was better:  14...f5 15. Nxa8 f4 16. Nc7 fxe3 17. f3

Your move wasn't a disaster, but f5 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: isolated pawn(s) on d5. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 9, 13. g3 (white): own_pawns, consequence

**Verdict:** Threats (+1.18) dwarfs Pawns (+0.29)  
**Term gains for the better line:** Threats +1.18, Pawns +0.29, Rooks +0.15, Knights +0.11, Mobility +0.11, Bishops -0.07, Space -0.13, King safety -0.24

```
On move 13 you played g3. Nf3 was better.

  What you played:  13. g3 Nxg3 14. Bxh7+ Kh8
  What was better:  13. Nf3 f5 14. O-O Rc8

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on h3. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 9, 21. Kd1 (white): own_pawns, consequence

**Verdict:** Pawns gains only -0.02  
**Term gains for the better line:** Threats +0.46, Rooks +0.35, Queens +0.24, Bishops +0.19, Mobility +0.10, Knights -0.17, King safety -0.58

```
On move 21 you played Kd1. b3 was better.

  What you played:  21. Kd1 c4 22. Bg6
  What was better:  21. b3 Qg5 22. Bb2

The difference is your pawn structure. Before your move: isolated pawn(s) on h3; backward pawn(s) on e3.
After your line: isolated pawn(s) on h3; backward pawn(s) on b2, e3. After the better line: isolated pawn(s) on h3; backward pawn(s) on e3.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 11, 22. d5 (white): own_pawns, consequence

**Verdict:** Pawns gains only 0.04  
**Term gains for the better line:** Threats +0.89, Mobility +0.85, Knights +0.12, King safety +0.11, Bishops +0.07, Rooks +0.07, Space -0.14, Passed -0.38

```
On move 22 you played d5. Nd2 was better.

  What you played:  22. d5 c3 23. Bxc3 Qxc3 24. dxc6 bxc6 25. Bxc6 Rb8
  What was better:  22. Nd2 Ne7 23. Ba1 Qxa4 24. Ne4 Qa3 25. Bc3 Nf5

The difference is your pawn structure. Before your move: isolated pawn(s) on h3, a4.
After your line: isolated pawn(s) on e3, h3, a4. After the better line: isolated pawn(s) on h3.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 11, 31. Qd3+ (white): centre, consequence

**Verdict:** Space/Mobility gains only -0.05  
**Term gains for the better line:** Threats +0.17, Bishops +0.12, Pawns +0.09, Mobility -0.05, King safety -1.14

```
On move 31 you played Qd3+. Qc6 was better.

  What you played:  31. Qd3+ Kg8 32. Qg6 Bb7 33. Qe8+ Kh7 34. Bd3+ Be4
  What was better:  31. Qc6 Qd6 32. Qa8 Bb8 33. h5 Qe5 34. Bd3+ Kg8

The difference is control of the centre. Before your move: centre control 4 vs 6.
After your line: centre control 2 vs 8. After the better line: centre control 4 vs 6.

Principle: Control the centre. Pieces and pawns that control d4, e4, d5 and e5 influence the whole board and make it easier to move pieces from one side to the other.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 12, 16... Ra6 (black): their_pawns, missed_chance

**Verdict:** Pawns gains only 0.04  
**Term gains for the better line:** King safety +1.83, Bishops +0.51, Threats +0.45, Rooks +0.36, Mobility +0.33, Knights +0.25

```
On move 16 you played Ra6. e4+ was better.

  What you played:  16...Ra6 17. Nxe5 f6 18. Ng6 Rg8 19. Bxa6 Nxa6
  What was better:  16...e4+ 17. Kc4 Nd7 18. Bxa8 Ke7 19. Bd4 Rd8

Your move wasn't a disaster, but e4+ would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: backward pawn(s) on f2. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 13, 38. Rb1 (white): open_files, consequence

**Verdict:** Rooks gains only 0.06  
**Term gains for the better line:** Queens +0.18, Bishops +0.16, Mobility +0.09, Rooks +0.06, Knights -0.14, King safety -0.22, Threats -0.39

```
On move 38 you played Rb1. Nf4 was better.

  What you played:  38. Rb1 Kg8 39. Qf3 Bd6
  What was better:  38. Nf4 Ref6 39. Ng6+ Rxg6

The difference is rooks on open files. Before your move: your rooks on open files: e1, e2; theirs: none.
After your line: your rooks on open files: e2; theirs: none. After the better line: your rooks on open files: e1, e2; theirs: none.

Principle: Rooks belong on open files. Rooks need open lines. Put them on files without your own pawns, where they can reach the enemy position.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 14, 19... Ne4 (black): their_pawns, missed_chance

**Verdict:** King safety (+3.29) dwarfs Pawns (+0.38)  
**Term gains for the better line:** King safety +3.29, Pawns +0.38, Rooks +0.31, Knights +0.08, Threats -0.07, Bishops -0.33

```
On move 19 you played Ne4. h6 was better.

  What you played:  19...Ne4 20. Rxe4 Qd7 21. Re6 Re8 22. Rf6+ gxf6
  What was better:  19...h6 20. Qb4+ c5 21. dxc5 hxg5 22. cxb6+ Ne7

Your move wasn't a disaster, but h6 would have improved your opponent's pawn weaknesses.
After the better line: opponent's pawns: doubled pawns on the b-file. After yours: opponent's pawns: no pawn weaknesses.

Principle: Create and attack weaknesses. If you can force your opponent into isolated, doubled or backward pawns, they become long-term targets.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 14, 20... Qc8 (black): mobility, missed_chance

**Verdict:** Mobility isn't a main reason (top: King safety 0.66, Rooks 0.39)  
**Term gains for the better line:** King safety +0.66, Rooks +0.39, Mobility +0.28, Bishops +0.24, Space -0.12, Knights -0.14, Threats -0.36

```
On move 20 you played Qc8. Qd7 was better.

  What you played:  20...Qc8 21. Re6 Bd8 22. Qd3 Bxg5 23. Nxg5 Nh4
  What was better:  20...Qd7 21. Be6 Qd6 22. Bxf5 Re8 23. h4 h6

Your move wasn't a disaster, but Qd7 would have improved piece activity.
After the better line: 30 piece moves available vs opponent's 34. After yours: 13 piece moves available vs opponent's 34.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 15, 19. Nb5 (white): passed_pawns, missed_chance

**Verdict:** Passed gains only 0.07  
**Term gains for the better line:** Mobility +0.22, Bishops +0.14, Passed +0.07, Pawns -0.09, Rooks -0.09, Space -0.14, King safety -0.28, Threats -0.54

```
On move 19 you played Nb5. Nd2 was better.

  What you played:  19. Nb5 Qb8 20. Nd2 a4 21. Nc3 Bc6 22. Nd5 Qb7
  What was better:  19. Nd2 a4 20. Bxc5 bxc5 21. Nxa4 Bxe4 22. Nxe4 Nxe4

Your move wasn't a disaster, but Nd2 would have improved passed pawns.
After the better line: your passed pawns: a3; theirs: none. After yours: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 6... Nc6 (black): mobility, consequence

**Verdict:** King safety (+1.18) dwarfs Mobility (+0.36)  
**Term gains for the better line:** King safety +1.18, Mobility +0.36, Bishops +0.21, Space +0.16, Knights +0.15, Rooks -0.09, Queens -0.25, Threats -0.68

```
On move 6 you played Nc6. Bg7 was better.

  What you played:  6...Nc6 7. d4 Nf6 8. d5 Nd8 9. Qa4+ Bd7 10. Nb5
  What was better:  6...Bg7 7. Bb5+ Bd7 8. Bxd7+ Qxd7 9. d4 exd4 10. cxd4

The difference is piece activity. Before your move: 19 piece moves available vs opponent's 19.
After your line: 20 piece moves available vs opponent's 32. After the better line: 21 piece moves available vs opponent's 23.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 16, 45... Qxd1 (black): passed_pawns, consequence

**Verdict:** Passed isn't a main reason (top: King safety 0.83, Mobility 0.53)  
**Term gains for the better line:** King safety +0.83, Mobility +0.53, Threats +0.25, Passed +0.16, Rooks -0.07

```
On move 45 you played Qxd1. Rf7+ was better.

  What you played:  45...Qxd1 46. Qb8+ Kg7 47. Qxe5+ Kg8 48. Qb8+
  What was better:  45...Rf7+ 46. Bf3 Qd1 47. Qb8+ Kh7 48. Qxa8

The difference is passed pawns. Before your move: your passed pawns: e5; theirs: d5, a7.
After your line: your passed pawns: none; theirs: d5, a7. After the better line: your passed pawns: e5; theirs: d5, a7.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 17, 20. Ndc4 (white): own_pawns, consequence

**Verdict:** Pawns gains only -0.01  
**Term gains for the better line:** Passed -0.08, Rooks -0.11, King safety -0.13, Mobility -0.65, Threats -0.75

```
On move 20 you played Ndc4. Nxb5 was better.

  What you played:  20. Ndc4 bxc4 21. Nxc4 Bxc2 22. Nxe5 Bxd1
  What was better:  20. Nxb5 Bxc2 21. Rdc1 Bxb2 22. Rxa6 Rxa6

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on b2. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 18, 28... Nb4 (black): king_activity, consequence

**Verdict:** can't be verified  
**Term gains for the better line:** none

```
On move 28 you played Nb4. Qc5 was better.

  What you played:  28...Nb4 29. axb4 Qd3 30. Qxd3 Rxd3 31. Kg2 Bxb4
  What was better:  28...Qc5 29. Nc3 Rd3 30. Qxd3 Qxf2+ 31. Kh1 Qxg3

The difference is king activity. Before your move: not an endgame yet.
After your line: your king on g8 is 3 step(s) from the centre; theirs on g2 is 2. After the better line: not an endgame yet.

Principle: Activate your king in the endgame. Once the queens are off, the king is no longer in danger and becomes a strong piece. Bring it towards the centre.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 19, 6. h3 (white): mobility, consequence

**Verdict:** King safety (+1.86) dwarfs Mobility (+0.44)  
**Term gains for the better line:** King safety +1.86, Mobility +0.44, Bishops +0.08, Threats -0.10, Rooks -0.11, Space -0.15

```
On move 6 you played h3. Bf4 was better.

  What you played:  6. h3 Qc7 7. c4 e6 8. e3
  What was better:  6. Bf4 e6 7. e3 Ne7 8. Bg3

The difference is piece activity. Before your move: 19 piece moves available vs opponent's 25.
After your line: 21 piece moves available vs opponent's 36. After the better line: 27 piece moves available vs opponent's 26.

Principle: Keep your pieces active. A piece with lots of squares is worth more than one that is stuck. Look for your worst piece and improve it.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 20, 8... dxe4 (black): own_pawns, consequence

**Verdict:** Pawns isn't a main reason (top: Queens 0.24, Knights 0.16)  
**Term gains for the better line:** Queens +0.24, Knights +0.16, Pawns +0.14, Rooks +0.10, King safety -0.08, Space -0.11, Bishops -0.13, Threats -0.18

```
On move 8 you played dxe4. Nd7 was better.

  What you played:  8...dxe4 9. dxe4 Nxe4 10. Qc2 f5 11. Nc3 Qa5
  What was better:  8...Nd7 9. Nbd2 Bb7 10. O-O O-O 11. Re1 e5

The difference is your pawn structure. Before your move: isolated pawn(s) on a7; doubled pawns on the c-file.
After your line: isolated pawn(s) on c5, c6, a7; doubled pawns on the c-file. After the better line: isolated pawn(s) on a7; doubled pawns on the c-file.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 22, 19... Nfd7 (black): passed_pawns, consequence

**Verdict:** Passed isn't a main reason (top: Threats 1.70, Pawns 0.96)  
**Term gains for the better line:** Threats +1.70, Pawns +0.96, Space +0.38, Passed +0.35, Mobility +0.10, Rooks -0.23, King safety -0.29

```
On move 19 you played Nfd7. Rce7 was better.

  What you played:  19...Nfd7 20. Nc4 Nf6 21. Be3 Rb7 22. e5 dxe5 23. fxe5
  What was better:  19...Rce7 20. Nc4 Nxe4 21. Rxe4 Bxc3 22. Rxe7 Bd4+ 23. Be3

The difference is passed pawns. Before your move: your passed pawns: none; theirs: none.
After your line: your passed pawns: none; theirs: d5. After the better line: your passed pawns: none; theirs: none.

Principle: Passed pawns must be pushed (or stopped). A pawn with no enemy pawns in front of it, or on the files next to it, can become a queen. Create your own and blockade theirs.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 23, 9. Qf2 (white): development, missed_chance

**Verdict:** Mobility/Knights/Bishops gains only -0.16  
**Term gains for the better line:** Mobility +0.19, King safety +0.13, Threats +0.12, Knights -0.17, Bishops -0.18

```
On move 9 you played Qf2. Qxh5 was better.

  What you played:  9. Qf2 Bc5 10. Qf3 O-O 11. Qxh5 Nxh5
  What was better:  9. Qxh5 Nxh5 10. Bd2 Nf6 11. Be2 h5

Your move wasn't a disaster, but Qxh5 would have improved development.
After the better line: all minor pieces developed. After yours: undeveloped: bishop on c1, bishop on f1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 23, 10. Qe2 (white): development, missed_chance

**Verdict:** King safety (+4.76) dwarfs Mobility/Knights/Bishops (+0.57)  
**Term gains for the better line:** King safety +4.76, Mobility +0.56, Rooks +0.21, Space -0.08, Pawns -0.10, Threats -0.10, Queens -0.25

```
On move 10 you played Qe2. Qg3 was better.

  What you played:  10. Qe2 Bg4 11. Qc4 Na6 12. e5 O-O-O
  What was better:  10. Qg3 Qg6 11. Qf3 O-O 12. Be2 Bg4

Your move wasn't a disaster, but Qg3 would have improved development.
After the better line: undeveloped: bishop on c1. After yours: undeveloped: bishop on c1, bishop on f1.

Principle: Develop your knights and bishops first. In the opening, get your minor pieces off the back rank before starting an attack. Undeveloped pieces can't help.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

### Game 24, 15... f6 (black): own_pawns, consequence

**Verdict:** Pawns gains only 0.05  
**Term gains for the better line:** Threats +0.74, Mobility +0.28, Rooks +0.12, Space +0.10, Pawns +0.05, Passed +0.05, Queens -0.20, King safety -2.98

```
On move 15 you played f6. O-O-O was better.

  What you played:  15...f6 16. f3 Bg6 17. Bxb6 Qxb6
  What was better:  15...O-O-O 16. f3 Bg6 17. Rfd1 d4

The difference is your pawn structure. Before your move: no pawn weaknesses.
After your line: isolated pawn(s) on a7. After the better line: no pawn weaknesses.

Principle: Avoid weakening your pawns. Isolated, doubled and backward pawns are hard to defend and give your opponent targets. Don't create them without a good reason.
```

Judgement: ☐ real reason ☐ partly ☐ rationalisation

