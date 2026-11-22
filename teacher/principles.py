"""The fixed curriculum. Every lesson maps to exactly one principle."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Principle:
    id: str
    title: str
    text: str


PRINCIPLES = {p.id: p for p in [
    Principle("hanging", "Don't leave pieces undefended",
              "Before you move, check that every piece is protected, and that "
              "the move doesn't remove a defender from something else."),
    Principle("safety", "Check checks, captures and threats",
              "Before every move, ask: what can my opponent capture, which checks do they "
              "have, and what does their last move threaten?"),
    Principle("develop", "Develop your knights and bishops first",
              "In the opening, get your minor pieces off the back rank before starting "
              "an attack. Undeveloped pieces can't help."),
    Principle("king_safety", "Keep your king safe",
              "Castle early and keep the pawns in front of your king where they are. "
              "Every pawn move there leaves holes your opponent can use."),
    Principle("centre", "Control the centre",
              "Pieces and pawns that control d4, e4, d5 and e5 influence the whole board "
              "and make it easier to move pieces from one side to the other."),
    Principle("activity", "Keep your pieces active",
              "A piece with lots of squares is worth more than one that is stuck. "
              "Look for your worst piece and improve it."),
    Principle("pawn_weaknesses", "Avoid weakening your pawns",
              "Isolated, doubled and backward pawns are hard to defend and give your "
              "opponent targets. Don't create them without a good reason."),
    Principle("target_weaknesses", "Create and attack weaknesses",
              "If you can force your opponent into isolated, doubled or backward pawns, "
              "they become long-term targets."),
    Principle("passed_pawns", "Passed pawns must be pushed (or stopped)",
              "A pawn with no enemy pawns in front of it, or on the files next to it, can "
              "become a queen. Create your own and blockade theirs."),
    Principle("outposts", "Knights love outposts",
              "A knight on a square that enemy pawns can never attack, defended by your own "
              "pawn, is often as strong as a rook."),
    Principle("open_files", "Rooks belong on open files",
              "Rooks need open lines. Put them on files without your own pawns, where they "
              "can reach the enemy position."),
    Principle("king_activity", "Activate your king in the endgame",
              "Once the queens are off, the king is no longer in danger and becomes a strong "
              "piece. Bring it towards the centre."),
]}
