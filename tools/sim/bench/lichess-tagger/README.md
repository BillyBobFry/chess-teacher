# Lichess puzzle tagger (vendored)

`cook.py`, `util.py` and `model.py` are copied unchanged from
[ornicar/lichess-puzzler](https://github.com/ornicar/lichess-puzzler/tree/master/tagger)
(AGPL-3.0, the same licence as this app). Lichess tags its puzzle database with them.

The benchmark uses them as an independent source of tactical-motif labels: a mistake's
punishment line is a puzzle for the opponent, and a missed win is a puzzle for the player.
They are not used by the teacher, so the benchmark doesn't grade the teacher with its own
code. Needs `chess==1.3.0` (python-chess).
