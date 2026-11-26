CREATE TABLE "coached_games" (
	"user_id" text NOT NULL,
	"period" text NOT NULL,
	"game_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coached_games_user_id_period_game_id_pk" PRIMARY KEY("user_id","period","game_id")
);
--> statement-breakpoint
-- Games that already had an AI explanation count as coached in the month it was written.
INSERT INTO "coached_games" ("user_id", "period", "game_id")
SELECT DISTINCT "user_id", to_char("updated_at", 'YYYY-MM'), "game_id"
FROM "explanations"
WHERE "status" = 'ready';--> statement-breakpoint
DROP TABLE "usage" CASCADE;--> statement-breakpoint
ALTER TABLE "coached_games" ADD CONSTRAINT "coached_games_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;