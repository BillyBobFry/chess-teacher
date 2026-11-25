import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  Game,
  MATE_SCORE,
  SESSION_STATE_VERSION,
  detectMistake,
  gameOutcome,
  newSession,
  opponentMove,
  pyRound,
  resign,
  reviewTree,
  rewind,
  settledBalance,
  upgradeSession,
  userMove,
  variationSan,
  type Candidate,
  type Engine,
  type Engines,
  type Lesson,
  type LessonStatus,
  type ReviewLine,
  type SavedSessionState,
  type TeachingConfig,
} from "../src/index.ts";

/** A real lesson, placed by hand: for tests that read only where and on which line it was. */
function lesson(id: number, line: number, ply: number, status: LessonStatus = "triggered"): Lesson {
  const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 2";
  const base = detectMistake(
    1,
    0,
    fen,
    "f3g5",
    new Game(fen, ["f3g5"]),
    [{ move: "b1c3", score: 30, pv: ["b1c3", "b8c6", "f1c4", "g8f6"] }],
    [{ move: "d8g5", score: 300, pv: ["d8g5", "d2d4", "g5g6"] }],
    DEFAULT_CONFIG,
  );
  if (!base) throw new Error("expected a lesson");
  return { ...base, id, line, ply, status };
}

/** 1. f3 e5 2. g4 Qh4#: Black mates. */
const FOOLS_MATE = ["f2f3", "e7e5", "g2g4", "d8h4"];

describe("pyRound", () => {
  it("rounds like Python's round(), including ties to even", () => {
    expect(pyRound(1.25, 1)).toBe(1.2); // exact tie → even
    expect(pyRound(0.75, 1)).toBe(0.8); // exact tie → even
    expect(pyRound(1.35, 1)).toBe(1.4); // 1.35 is stored slightly above
    expect(pyRound(1.15, 1)).toBe(1.1); // 1.15 is stored slightly below
    expect(pyRound(2.675, 2)).toBe(2.67);
    expect(pyRound(3.1, 1)).toBe(3.1);
  });
});

describe("Game", () => {
  it("ends on fivefold repetition, not threefold", () => {
    const shuffle = ["g1f3", "g8f6", "f3g1", "f6g8"];
    const game = new Game();
    for (let i = 0; i < 2; i++) for (const m of shuffle) game.push(m);
    expect(game.isGameOver()).toBe(false); // threefold: claimable, not automatic
    for (let i = 0; i < 2; i++) for (const m of shuffle) game.push(m);
    expect(game.isGameOver()).toBe(true);
  });
});

describe("variationSan", () => {
  it("formats lines like python-chess", () => {
    const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(variationSan(start, ["e2e4", "e7e5", "g1f3"])).toBe("1. e4 e5 2. Nf3");
    const afterE4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
    expect(variationSan(afterE4, ["e7e5", "g1f3"])).toBe("1...e5 2. Nf3");
  });
});

describe("settledBalance", () => {
  it("resolves a pending recapture", () => {
    // 1. e4 d5 2. exd5: white is a pawn up for a moment, but Qxd5 recaptures.
    const fen = "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2";
    expect(settledBalance(fen, "w")).toBe(0);
    expect(settledBalance(fen, "b")).toBe(0);
  });
});

describe("newSession", () => {
  it("produces plain JSON state", () => {
    const s = newSession({ userColour: "w" });
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
});

describe("resign", () => {
  it("finishes the game as resigned", () => {
    const s = resign({ ...newSession({ userColour: "w" }), moves: ["e2e4", "e7e5"] });
    expect(s.resigned).toBe(true);
    expect(s.lessons.filter((l) => l.status === "pending")).toEqual([]);
  });

  it("keeps the real result of a game already over by the rules", () => {
    const s = resign({ ...newSession({ userColour: "w" }), moves: FOOLS_MATE });
    expect(s.resigned).toBe(false);
    expect(gameOutcome(s)).toBe("lost");
  });
});

describe("gameOutcome", () => {
  it("reads checkmate from the user's side", () => {
    const mated = { ...newSession({ userColour: "w" }), moves: FOOLS_MATE };
    expect(gameOutcome(mated)).toBe("lost");
    expect(gameOutcome({ ...mated, userColour: "b" })).toBe("won");
  });

  it("counts resigning as a loss, and an unrecorded early stop as ended", () => {
    const early = { ...newSession({ userColour: "w" }), moves: ["e2e4"] };
    expect(gameOutcome(resign(early))).toBe("lost");
    expect(gameOutcome(early)).toBe("ended");
  });
});

describe("opponentMove", () => {
  it("scores the opponent's checkmate as lost, without asking the engine", async () => {
    const engine: Engine = {
      analyse: () => Promise.reject(new Error("a finished game needs no analysis")),
      play: () => Promise.resolve("d8h4"),
    };
    const s = { ...newSession({ userColour: "w" }), moves: FOOLS_MATE.slice(0, 3) };
    const r = await opponentMove(s, { analyst: engine, weak: engine });
    expect(r.state.scores[3]).toBe(-MATE_SCORE);
  });
});

describe("upgradeSession", () => {
  it("gives a version 2 save no evaluations and no resignation", () => {
    const saved: SavedSessionState = { ...newSession({ userColour: "b" }), version: 2, moves: ["e2e4"] };
    delete saved.scores;
    delete saved.resigned;
    const upgraded = upgradeSession(saved);
    expect(upgraded.scores).toEqual([]);
    expect(upgraded.resigned).toBe(false);
    expect(upgraded.version).toBe(SESSION_STATE_VERSION);
  });

  it("puts every lesson of a version 3 save on its one line", () => {
    const unlined: Omit<Lesson, "line"> & { line?: number } = lesson(1, 0, 2);
    delete unlined.line;
    const saved: SavedSessionState = { ...newSession({ userColour: "w" }), version: 3, lessons: [unlined] };
    delete saved.line;
    delete saved.branches;
    const upgraded = upgradeSession(saved);
    expect(upgraded.line).toBe(0);
    expect(upgraded.branches).toEqual([]);
    expect(upgraded.lessons.map((l) => l.line)).toEqual([0]);
  });

  it("drops scores for moves the save no longer has", () => {
    const saved: SavedSessionState = {
      ...newSession({ userColour: "w" }),
      moves: ["e2e4"],
      scores: [20, -15, 30],
    };
    expect(upgradeSession(saved).scores).toEqual([20]);
  });
});

describe("detectMistake", () => {
  /** The user (to move in `fen`) plays `move`; the engine's lines are given by hand. */
  const detect = (
    fen: string,
    move: string,
    best: Candidate,
    reply: Candidate,
    cfg: TeachingConfig = DEFAULT_CONFIG,
  ) => detectMistake(1, 0, fen, move, new Game(fen, [move]), [best], [reply], cfg);

  it("teaches a free piece left on the board as a missed chance, not a blunder", () => {
    // Black's queen on g5 is attacked by the knight on f3 and undefended.
    const fen = "rnb1kbnr/pppp1ppp/8/4p1q1/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3";
    const lesson = detect(
      fen,
      "h2h3",
      { move: "f3g5", score: 900, pv: ["f3g5", "f8e7", "d2d4", "g8f6"] },
      { move: "g5g6", score: -50, pv: ["g5g6", "b1c3", "b8c6"] },
    );
    expect(lesson).toMatchObject({ feature: "material", kind: "missed_chance", principle: "free_material" });
  });

  it("teaches losing a piece as a consequence", () => {
    // Ng5 walks into the queen on d8.
    const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 2";
    const lesson = detect(
      fen,
      "f3g5",
      { move: "b1c3", score: 30, pv: ["b1c3", "b8c6", "f1c4", "g8f6"] },
      { move: "d8g5", score: 300, pv: ["d8g5", "d2d4", "g5g6"] },
    );
    expect(lesson).toMatchObject({ feature: "material", kind: "consequence", principle: "hanging" });
  });

  it("teaches losing a piece as a blunder even when the line wins it back later", () => {
    // From a real game: Ne5 allows Qa5+, which wins the bishop on a3. The engine's line only
    // gets the material back at the end, with Nc4 and Nd6+.
    const fen = "rn1qkb1r/pp2pp1p/2p3p1/5b2/3Pp3/BP2PN2/P1P2PPP/R2QKB1R w KQkq - 0 8";
    const lesson = detect(
      fen,
      "f3e5",
      { move: "f3d2", score: 50, pv: ["f3d2", "h7h5", "c2c3", "b8d7", "d1c2", "e7e5", "a3f8", "e8f8"] },
      { move: "d8a5", score: 157, pv: ["d8a5", "d1d2", "a5a3", "e5c4", "a3a6", "c4d6", "e7d6"] },
    );
    expect(lesson).toMatchObject({ feature: "material", kind: "consequence", principle: "safety" });
  });

  it("teaches a recapture that leaves another pawn hanging as a blunder", () => {
    // From a real game: cxd4 wins the pawn back, but leaves b4 to the bishop.
    const fen = "rnbqkb1r/pp1p1ppp/4pn2/8/1P1p4/2P1PN2/P2N1PPP/R1BQKB1R w KQkq - 0 7";
    const lesson = detect(
      fen,
      "c3d4",
      { move: "e3d4", score: 40, pv: ["e3d4", "b7b6", "f1d3", "c8b7", "e1g1", "f8e7", "a2a4"] },
      { move: "f8b4", score: 81, pv: ["f8b4", "f1d3", "e8g8", "a2a3", "b4c3", "a1b1"] },
    );
    expect(lesson).toMatchObject({ feature: "material", kind: "consequence", principle: "hanging" });
  });

  describe("the lower bar for strategic lessons", () => {
    // Pushing rook pawns while the better line develops, for a gap of only 0.5 pawns.
    const atMove = (n: number) => `rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 ${n}`;
    const best: Candidate = {
      move: "g1f3",
      score: 50,
      pv: ["g1f3", "b8c6", "f1c4", "g8f6", "b1c3", "f8c5", "d2d3", "d7d6"],
    };
    const reply: Candidate = {
      move: "b8c6",
      score: 0,
      pv: ["b8c6", "a3a4", "g8f6", "h2h3", "f8c5", "h3h4", "d7d6"],
    };

    it("teaches a small strategic mistake", () => {
      const lesson = detect(atMove(4), "a2a3", best, reply);
      expect(lesson).not.toBeNull();
      expect(lesson?.feature).not.toBe("material");
    });

    it("doesn't apply in the first moves of the game", () => {
      expect(detect(atMove(2), "a2a3", best, reply)).toBeNull();
    });

    it("doesn't apply when it's set to the normal threshold", () => {
      const cfg = { ...DEFAULT_CONFIG, strategicThreshold: DEFAULT_CONFIG.threshold };
      expect(detect(atMove(4), "a2a3", best, reply, cfg)).toBeNull();
    });
  });
});

describe("credit for material lessons", () => {
  it("goes to the review when a later bad move leaves material to be taken, even in a lost position", async () => {
    // 2. Ng5 hangs the knight (a lesson), Black doesn't take, then 3. Nxf7 drops it for a pawn
    // in a position the engine already calls lost, so 3. Nxf7 isn't taught itself.
    const game = new Game("rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 2");
    const lines = new Map<string, Candidate[]>();
    lines.set(game.fen, [{ move: "b1c3", score: 30, pv: ["b1c3", "b8c6", "f1c4", "g8f6"] }]);
    game.push("f3g5");
    lines.set(game.fen, [{ move: "d8g5", score: 300, pv: ["d8g5", "d2d4", "g5g6"] }]);
    game.push("b8c6");
    lines.set(game.fen, [{ move: "g5f3", score: -600, pv: ["g5f3", "d7d5"] }]);
    game.push("g5f7");
    lines.set(game.fen, [{ move: "e8f7", score: 700, pv: ["e8f7", "d2d4"] }]);
    const engine = {
      analyse: (fen: string) => Promise.resolve(lines.get(fen) ?? []),
      play: () => Promise.resolve("b8c6"),
    };
    const engines: Engines = { analyst: engine, weak: engine };

    let s = newSession({ userColour: "w", startFen: game.startFen, config: { levelUp: false } });
    s = (await userMove(s, "f3g5", engines)).state;
    s = (await opponentMove(s, engines)).state;
    expect(s.lessons.map((l) => l.status)).toEqual(["pending"]);
    s = (await userMove(s, "g5f7", engines)).state;
    expect(s.lessons.map((l) => l.status)).toEqual(["superseded"]);
  });
});

describe("reviewTree", () => {
  type Shape = number | { from: number; move: string | undefined; items: Shape[] };
  const shape = (line: ReviewLine): Shape[] =>
    line.items.map((i) =>
      i.kind === "lesson"
        ? i.lesson.id
        : { from: i.line.from, move: i.line.firstMove?.san, items: shape(i.line) },
    );

  it("hangs each line left behind off the line played next, with lessons where their mistakes were", () => {
    const state = {
      ...newSession({ userColour: "w" }),
      // The game ended on line 3. Line 0 went 3. Bb5 where line 3 went 3. Bc4; line 1 went
      // 2. d4 and line 2 went 1... c5, which has no lessons.
      line: 3,
      moves: ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6"],
      branches: [
        { id: 0, moves: ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5", "a7a6"] },
        { id: 1, moves: ["e2e4", "e7e5", "d2d4"] },
        { id: 2, moves: ["e2e4", "c7c5"] },
      ],
      lessons: [
        lesson(1, 0, 0), // on line 0, but on the moves it shares with the game's line
        lesson(2, 0, 4),
        lesson(3, 1, 2),
        lesson(4, 3, 4),
        lesson(5, 3, 2, "rewound"), // undone: not reviewed
      ],
    };
    expect(shape(reviewTree(state))).toEqual([
      1,
      { from: 2, move: "d4", items: [3] },
      // Played before the game's 3. Bc4, so it comes first.
      { from: 4, move: "Bb5", items: [2] },
      4,
    ]);
  });

  it("puts two tries from the same move side by side, oldest first", () => {
    const state = {
      ...newSession({ userColour: "w" }),
      line: 2,
      moves: ["e2e4", "e7e5", "f1c4"],
      branches: [
        { id: 0, moves: ["e2e4", "e7e5", "f1b5"] },
        { id: 1, moves: ["e2e4", "e7e5", "d1h5"] },
      ],
      lessons: [lesson(1, 0, 2), lesson(2, 1, 2)],
    };
    expect(shape(reviewTree(state))).toEqual([
      { from: 2, move: "Bb5", items: [1] },
      { from: 2, move: "Qh5", items: [2] },
    ]);
  });

  it("is a plain list for a game that was never rewound", () => {
    const state = { ...newSession({ userColour: "w" }), moves: ["e2e4", "e7e5"], lessons: [lesson(2, 0, 0)] };
    expect(shape(reviewTree(state))).toEqual([2]);
  });
});

describe("rewind", () => {
  it("reopens lessons resolved by the moves going, and keeps the line's own outcomes on it", () => {
    const resolved = (l: Lesson, resolvedPly: number): Lesson => ({ ...l, resolvedPly });
    const state = {
      ...newSession({ userColour: "w" }),
      moves: ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6"],
      lessons: [
        resolved(lesson(1, 0, 0, "fixed"), 3), // fixed by a move that goes
        resolved(lesson(2, 0, 2), 4), // rewound to
        resolved(lesson(3, 0, 4, "fixed"), 5), // made and fixed on the line left behind
      ],
    };
    const r = rewind(state, 2);
    const byId = (id: number) => r.lessons.find((l) => l.id === id);
    expect(r.branches).toEqual([{ id: 0, moves: state.moves }]);
    expect(byId(1)).toMatchObject({ status: "pending", resolvedPly: null, line: r.line });
    expect(byId(2)).toMatchObject({ status: "triggered", line: 0 });
    expect(byId(3)).toMatchObject({ status: "fixed", line: 0 });
  });
});
