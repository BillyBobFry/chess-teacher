# Chess Teacher

An app that teaches chess strategy by letting your mistakes come back to bite you, then
helping you work out which move caused it. See [`docs/concept.md`](docs/concept.md) for
the product concept.

This repository currently contains **Prototype 1**: a command-line version that tests
the riskiest idea, namely that we can detect a mistake, predict its consequence as a
checkable condition, have the opponent deliberately exploit it, and reveal the lesson
when the consequence actually lands.

## Setup

Needs Python 3.10+ and [Stockfish](https://stockfishchess.org/).

```bash
# Stockfish: apt install stockfish   |   brew install stockfish
# (or set STOCKFISH_PATH to the binary)
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

## Play

```bash
.venv/bin/python play.py                 # play white against the teaching opponent
.venv/bin/python play.py --color black
.venv/bin/python play.py --easy          # warns when the opponent has spotted a weakness
.venv/bin/python play.py --no-level-up   # opponent never exploits on purpose (test mode)
.venv/bin/python play.py -v              # show when the opponent levels up, and lesson details
.venv/bin/python play.py --llm           # explanations written by Claude (needs ANTHROPIC_API_KEY)
```

Enter moves as `Nf3`, `exd5`, `O-O` or `g1f3`. Type `moves` to list legal moves,
`board` to redraw, `quit` to stop (you still get the post-game review).

## Simulate

Runs a weak engine "student" against the teaching opponent, with no human in the loop,
and reports how lessons behave:

```bash
.venv/bin/python simulate.py --games 12 --compare
```

Writes `reports/simulation.md` (summary + sample explanations to judge by eye) and
`reports/simulation.json`. `--compare` also runs a control where the opponent never
levels up.

## How it works

| Module | Role |
|---|---|
| `teacher/engine.py` | Stockfish wrapper (python-chess) |
| `teacher/features.py` | Strategic factors measured in code: material (after exchanges settle), development, king safety, centre, activity, pawn structure, passed pawns, outposts, open files, endgame king activity |
| `teacher/principles.py` | The fixed curriculum; every lesson maps to one principle |
| `teacher/lessons.py` | Mistake detection: compares the two futures, picks the factor that explains the gap, turns it into a checkable trigger condition |
| `teacher/opponent.py` | The teaching opponent: weakened Stockfish normally; when a lesson is pending, picks from the strong engine's top moves the one that most directly cashes in the lesson |
| `teacher/session.py` | Game flow: pending lessons, triggers, fixes, expiry, supersession, rewind |
| `teacher/explain.py` | Template explanations, plus optional Claude explanations from the facts only, with a guardrail that rejects any mentioned square not in the facts |
| `play.py` / `simulate.py` | Interactive CLI / simulation harness |

## Known limitations

- The normal-mode opponent is Stockfish at a low skill level, standing in for Maia.
- The simulated student is also an engine, so its mistakes aren't quite human mistakes.
- Strategic explanations are right roughly half the time when judged by eye; see
  "Prototype 1 findings" in the concept doc.
- The LLM path is implemented but hasn't yet been run against the live API.
