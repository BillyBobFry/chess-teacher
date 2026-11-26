-- The opponent's normal moves come from Maia at a rating, not weakened Stockfish at a skill
-- level. Saved games keep the strength they were started at: Gentle (skill 0), Steady (3) and
-- Testing (6) become 800, 1100 and 1400.
ALTER TABLE "games" RENAME COLUMN "opponent_skill" TO "opponent_rating";--> statement-breakpoint
UPDATE "games" SET "opponent_rating" = CASE
  WHEN "opponent_rating" <= 1 THEN 800
  WHEN "opponent_rating" <= 4 THEN 1100
  ELSE 1400
END;
