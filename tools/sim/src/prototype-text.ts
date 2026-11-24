/**
 * The Python prototype's English, for the parity tests and the simulation reports.
 *
 * The core returns lesson text as data; the app renders it from its message catalogue in
 * the player's language. The prototype (prototype/teacher) wrote sentences instead, and its
 * recorded fixtures hold those sentences. Rendering the core's data the prototype's way, word
 * for word, keeps the parity tests exact about every fact the core measured, without tying
 * the app's copy to the prototype's.
 */

import {
  CONSEQUENCE,
  MATE_FEATURE,
  facts,
  hints,
  lessonBestSan,
  lessonMoveNumber,
  lessonUserSan,
  lineSan,
  type Detail,
  type GameEvent,
  type Hint,
  type Lesson,
  type MoveRef,
  type PieceCount,
  type PieceType,
  type PrincipleId,
  type Trigger,
} from "@chess-teacher/core";

const PIECE_NAMES: Record<PieceType, string> = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

/** prototype/teacher/principles.py */
export const PRINCIPLES: Record<PrincipleId, { title: string; text: string }> = {
  hanging: {
    title: "Don't leave pieces undefended",
    text:
      "Before you move, check that every piece is protected, and that " +
      "the move doesn't remove a defender from something else.",
  },
  safety: {
    title: "Check checks, captures and threats",
    text:
      "Before every move, ask: what can my opponent capture, which checks do they " +
      "have, and what does their last move threaten?",
  },
  // Added after the port: the prototype files every material lesson under the two above.
  free_material: {
    title: "Take free material",
    text:
      "When your opponent leaves a piece or pawn you can win, take it. Before every move, " +
      "look at everything you can capture.",
  },
  forcing_moves: {
    title: "Look for forcing moves",
    text:
      "Checks, captures and threats force your opponent to respond. Before a quiet move, " +
      "look at yours: one of them may win material.",
  },
  develop: {
    title: "Develop your knights and bishops first",
    text:
      "In the opening, get your minor pieces off the back rank before starting " +
      "an attack. Undeveloped pieces can't help.",
  },
  king_safety: {
    title: "Keep your king safe",
    text:
      "Castle early and keep the pawns in front of your king where they are. " +
      "Every pawn move there leaves holes your opponent can use.",
  },
  centre: {
    title: "Control the centre",
    text:
      "Pieces and pawns that control d4, e4, d5 and e5 influence the whole board " +
      "and make it easier to move pieces from one side to the other.",
  },
  activity: {
    title: "Keep your pieces active",
    text:
      "A piece with lots of squares is worth more than one that is stuck. " +
      "Look for your worst piece and improve it.",
  },
  pawn_weaknesses: {
    title: "Avoid weakening your pawns",
    text:
      "Isolated, doubled and backward pawns are hard to defend and give your " +
      "opponent targets. Don't create them without a good reason.",
  },
  target_weaknesses: {
    title: "Create and attack weaknesses",
    text:
      "If you can force your opponent into isolated, doubled or backward pawns, " +
      "they become long-term targets.",
  },
  passed_pawns: {
    title: "Passed pawns must be pushed (or stopped)",
    text:
      "A pawn with no enemy pawns in front of it, or on the files next to it, can " +
      "become a queen. Create your own and blockade theirs.",
  },
  outposts: {
    title: "Knights love outposts",
    text:
      "A knight on a square that enemy pawns can never attack, defended by your own " +
      "pawn, is often as strong as a rook.",
  },
  open_files: {
    title: "Rooks belong on open files",
    text:
      "Rooks need open lines. Put them on files without your own pawns, where they " +
      "can reach the enemy position.",
  },
  king_activity: {
    title: "Activate your king in the endgame",
    text:
      "Once the queens are off, the king is no longer in danger and becomes a strong " +
      "piece. Bring it towards the centre.",
  },
};

const FEATURE_LABELS: Record<string, string> = {
  material: "material",
  development: "development",
  king_safety: "king safety",
  centre: "control of the centre",
  mobility: "piece activity",
  own_pawns: "your pawn structure",
  their_pawns: "your opponent's pawn weaknesses",
  passed_pawns: "passed pawns",
  outposts: "knight outposts",
  open_files: "rooks on open files",
  king_activity: "king activity",
  [MATE_FEATURE]: "king safety",
};

const TRIGGER_OPENERS: Record<string, string> = {
  development: "You've fallen behind in development",
  king_safety: "Your king has come under fire",
  centre: "Your opponent has taken over the centre",
  mobility: "Your pieces have run short of squares",
  own_pawns: "Your pawn structure has been damaged",
  their_pawns: "Your opponent has fixed their pawn weaknesses",
  passed_pawns: "Your opponent now has the more dangerous passed pawns",
  outposts: "Your opponent's knight has found a strong outpost",
  open_files: "Your opponent's rook has taken an open file",
  king_activity: "Your opponent's king has become more active than yours",
};

const list = (squares: string[]): string => squares.join(", ");
const sides = (mine: string[], theirs: string[], label: string): string =>
  `your ${label}: ${list(mine) || "none"}; theirs: ${list(theirs) || "none"}`;

/** prototype/teacher/features.py: each feature's detail. */
export function detailText(d: Detail): string {
  switch (d.kind) {
    case "material":
      return `material balance ${d.balance >= 0 ? "+" : ""}${d.balance}`;
    case "opening_over":
      return "opening phase over";
    case "undeveloped":
      return d.pieces.length
        ? `undeveloped: ${d.pieces.map((p) => `${PIECE_NAMES[p.piece]} on ${p.square}`).join(", ")}`
        : "all minor pieces developed";
    case "queen_gone":
      return "the enemy queen is gone, so your king is fairly safe";
    case "king_shelter":
      return `${d.shield} pawn(s) shielding the king, ${d.attacks} enemy attack(s) on the squares around it`;
    case "centre":
      return `centre control ${d.mine} vs ${d.theirs}`;
    case "mobility":
      return `${d.mine} piece moves available vs opponent's ${d.theirs}`;
    case "pawns": {
      const parts: string[] = [];
      if (d.isolated.length) parts.push(`isolated pawn(s) on ${list(d.isolated)}`);
      if (d.doubledFiles.length)
        parts.push(`doubled pawns on the ${d.doubledFiles.map((f) => `${f}-file`).join(", ")}`);
      if (d.backward.length) parts.push(`backward pawn(s) on ${list(d.backward)}`);
      const text = parts.join("; ") || "no pawn weaknesses";
      return d.side === "theirs" ? `opponent's pawns: ${text}` : text;
    }
    case "passed_pawns":
      return sides(d.mine, d.theirs, "passed pawns");
    case "outposts":
      return sides(d.mine, d.theirs, "knight outposts");
    case "open_files":
      return sides(d.mine, d.theirs, "rooks on open files");
    case "not_endgame":
      return "not an endgame yet";
    case "king_activity":
      return (
        `your king on ${d.mine} is ${d.mineSteps} step(s) from the centre; ` +
        `theirs on ${d.theirs} is ${d.theirsSteps}`
      );
    case "checkmated":
      return "your king gets checkmated";
    case "no_mate":
      return "no mate";
    case "none":
      return "";
  }
}

const pieces = (counts: PieceCount[]): string =>
  counts
    .map((c) => (c.count > 1 ? `${c.count} ${PIECE_NAMES[c.piece]}s` : `a ${PIECE_NAMES[c.piece]}`))
    .join(", ");

/** prototype/teacher/lessons.py describe_consequence, and the missed chance's trigger. */
export function triggerText(t: Trigger | null): string {
  if (!t) return "";
  switch (t.kind) {
    case "checkmated":
      return "You've been checkmated.";
    case "losing_material":
      return "You're about to lose material.";
    case "lost_material": {
      const lost = pieces(t.lost);
      const taken = pieces(t.taken);
      const worth = `${t.net} pawn${t.net !== 1 ? "s" : ""}`;
      const text =
        lost && taken
          ? `Since that move you've lost ${lost} and taken ${taken}: overall you're ${worth} down.`
          : `You've lost ${lost}: you're ${worth} worse off than before.`;
      return text + (t.more ? " And more is about to fall." : "");
    }
    case "feature":
      return `${TRIGGER_OPENERS[t.feature] ?? "Something went wrong"} (${detailText(t.detail)}).`;
    case "chance_gone":
      return "The chance has gone.";
    case "legacy":
      return t.text;
  }
}

/** The text the prototype put on each event. */
export function eventText(e: GameEvent, lessons: Lesson[]): string {
  if (e.kind === "warning") return "Your opponent has spotted something…";
  if (e.kind === "triggered" || e.kind === "chanceGone")
    return triggerText(lessons.find((l) => l.id === e.lessonId)?.trigger ?? null);
  return "";
}

export const moveLabel = (m: MoveRef): string => `${m.moveNumber}${m.colour === "w" ? "." : "..."} ${m.san}`;

const hintText = (h: Hint): string => {
  switch (h.kind) {
    case "castled":
      return "It was when you castled.";
    case "piece":
      return `It was a ${PIECE_NAMES[h.piece]} move.`;
    case "move":
      return `Look at move ${h.move.moveNumber}, when you played ${h.move.san}.`;
  }
};

export const hintTexts = (l: Lesson): string[] => hints(l).map(hintText);

/** prototype/teacher/explain.py facts(): the same keys, with English values. */
export function factsText(l: Lesson) {
  const f = facts(l);
  const p = PRINCIPLES[f.principle];
  return {
    ...f,
    lesson_type:
      f.lesson_type === CONSEQUENCE
        ? "something went wrong because of this move"
        : "a better opportunity was missed",
    what_happened_in_the_game: triggerText(f.what_happened_in_the_game),
    key_factor: FEATURE_LABELS[f.key_factor] ?? f.key_factor,
    before_your_move: detailText(f.before_your_move),
    end_of_your_line: detailText(f.end_of_your_line),
    end_of_better_line: detailText(f.end_of_better_line),
    pieces_left_undefended_by_your_move: f.pieces_left_undefended_by_your_move.map((u) =>
      u.moved ? `the piece you moved, now on ${u.square}` : `${PIECE_NAMES[u.piece]} on ${u.square}`,
    ),
    principle: { title: p.title, explanation: p.text },
  };
}

/** prototype/teacher/explain.py template_explanation(). */
export function templateExplanation(l: Lesson): string {
  const p = PRINCIPLES[l.principle];
  const f = FEATURE_LABELS[l.feature] ?? l.feature;
  const userSan = lessonUserSan(l);
  const bestSan = lessonBestSan(l);
  const lines = [
    `On move ${lessonMoveNumber(l)} you played ${userSan}. ${bestSan} was better.`,
    "",
    `  What you played:  ${lineSan(l, l.userLine)}`,
    `  What was better:  ${lineSan(l, l.bestLine)}`,
    "",
  ];
  const baseline = detailText(l.baselineDetail);
  const user = detailText(l.userDetail);
  const best = detailText(l.bestDetail);
  if (l.feature === MATE_FEATURE) {
    lines.push("After your move, your opponent had a forced checkmate.");
  } else if (l.kind === CONSEQUENCE) {
    lines.push(`The difference is ${f}. Before your move: ${baseline}.`);
    lines.push(`After your line: ${user}. After the better line: ${best}.`);
  } else {
    lines.push(`Your move wasn't a disaster, but ${bestSan} would have improved ${f}.`);
    lines.push(`After the better line: ${best}. After yours: ${user}.`);
  }
  const undefended = factsText(l).pieces_left_undefended_by_your_move;
  if (l.principle === "hanging" && undefended.length) {
    lines.push(`Your move left this undefended: ${undefended.join(", ")}.`);
  }
  lines.push("", `Principle: ${p.title}. ${p.text}`);
  return lines.join("\n");
}
