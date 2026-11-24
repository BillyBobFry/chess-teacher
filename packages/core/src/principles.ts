/**
 * The fixed curriculum. Every lesson maps to exactly one principle. Titles and texts are in
 * the app's message catalogue, keyed by id.
 */

export const PRINCIPLE_IDS = [
  "hanging",
  "safety",
  "develop",
  "king_safety",
  "centre",
  "activity",
  "pawn_weaknesses",
  "target_weaknesses",
  "passed_pawns",
  "outposts",
  "open_files",
  "king_activity",
] as const;

export type PrincipleId = (typeof PRINCIPLE_IDS)[number];

export const isPrincipleId = (id: string): id is PrincipleId =>
  (PRINCIPLE_IDS as readonly string[]).includes(id);
