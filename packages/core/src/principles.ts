/** The fixed curriculum. Every lesson maps to exactly one principle. */

export interface Principle {
  id: string;
  title: string;
  text: string;
}

const list: Principle[] = [
  {
    id: "hanging",
    title: "Don't leave pieces undefended",
    text:
      "Before you move, check that every piece is protected, and that " +
      "the move doesn't remove a defender from something else.",
  },
  {
    id: "safety",
    title: "Check checks, captures and threats",
    text:
      "Before every move, ask: what can my opponent capture, which checks do they " +
      "have, and what does their last move threaten?",
  },
  {
    id: "develop",
    title: "Develop your knights and bishops first",
    text:
      "In the opening, get your minor pieces off the back rank before starting " +
      "an attack. Undeveloped pieces can't help.",
  },
  {
    id: "king_safety",
    title: "Keep your king safe",
    text:
      "Castle early and keep the pawns in front of your king where they are. " +
      "Every pawn move there leaves holes your opponent can use.",
  },
  {
    id: "centre",
    title: "Control the centre",
    text:
      "Pieces and pawns that control d4, e4, d5 and e5 influence the whole board " +
      "and make it easier to move pieces from one side to the other.",
  },
  {
    id: "activity",
    title: "Keep your pieces active",
    text:
      "A piece with lots of squares is worth more than one that is stuck. " +
      "Look for your worst piece and improve it.",
  },
  {
    id: "pawn_weaknesses",
    title: "Avoid weakening your pawns",
    text:
      "Isolated, doubled and backward pawns are hard to defend and give your " +
      "opponent targets. Don't create them without a good reason.",
  },
  {
    id: "target_weaknesses",
    title: "Create and attack weaknesses",
    text:
      "If you can force your opponent into isolated, doubled or backward pawns, " +
      "they become long-term targets.",
  },
  {
    id: "passed_pawns",
    title: "Passed pawns must be pushed (or stopped)",
    text:
      "A pawn with no enemy pawns in front of it, or on the files next to it, can " +
      "become a queen. Create your own and blockade theirs.",
  },
  {
    id: "outposts",
    title: "Knights love outposts",
    text:
      "A knight on a square that enemy pawns can never attack, defended by your own " +
      "pawn, is often as strong as a rook.",
  },
  {
    id: "open_files",
    title: "Rooks belong on open files",
    text:
      "Rooks need open lines. Put them on files without your own pawns, where they " +
      "can reach the enemy position.",
  },
  {
    id: "king_activity",
    title: "Activate your king in the endgame",
    text:
      "Once the queens are off, the king is no longer in danger and becomes a strong " +
      "piece. Bring it towards the centre.",
  },
];

export const PRINCIPLES: Record<string, Principle> = Object.fromEntries(list.map((p) => [p.id, p]));
