# Simulation report (TypeScript core)

6 games per configuration. Student: Stockfish skill 0 (10 ms/move). Opponent normal mode: skill 3. Analysis depth 10. Max 50 moves per game. Took 66 s.

| Metric | teaching opponent | no level-up (control) |
|---|---|---|
| Lessons per game | 4.5 | 6.8 |
| Consequence lessons | 20 | 28 |
| …of which landed in the real game | 0.9 | 0.61 |
| Median moves from mistake to consequence | 1.5 | 1 |
| Longest delay (moves) | 3 | 4 |
| Missed-chance lessons | 7 | 13 |
| Share of opponent moves levelled up | 0.15 | 0 |
| Time per user move incl. engine (ms) | 64 | 75 |

## teaching opponent

- Consequence lesson outcomes: {"triggered":18,"superseded":2}
- Missed-chance outcomes: {"triggered":6,"expired":1}
- Features: {"material":18,"their_pawns":3,"king_safety":3,"open_files":1,"passed_pawns":1,"mobility":1}
- Principles: {"Check checks, captures and threats":14,"Create and attack weaknesses":3,"Don't leave pieces undefended":4,"Keep your king safe":3,"Rooks belong on open files":1,"Passed pawns must be pushed (or stopped)":1,"Keep your pieces active":1}

## no level-up (control)

- Consequence lesson outcomes: {"expired":3,"triggered":17,"fixed":3,"superseded":5}
- Missed-chance outcomes: {"triggered":10,"superseded":2,"fixed":1}
- Features: {"mobility":5,"material":28,"their_pawns":2,"own_pawns":2,"development":2,"open_files":1,"king_activity":1}
- Principles: {"Keep your pieces active":5,"Check checks, captures and threats":20,"Create and attack weaknesses":2,"Avoid weakening your pawns":2,"Don't leave pieces undefended":8,"Develop your knights and bishops first":2,"Rooks belong on open files":1,"Activate your king in the endgame":1}
