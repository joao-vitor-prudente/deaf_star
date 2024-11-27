CREATE TABLE IF NOT EXISTS "deaf_star_friendship" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"friend_id" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_friendship" ADD CONSTRAINT "deaf_star_friendship_user_id_deaf_star_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_friendship" ADD CONSTRAINT "deaf_star_friendship_friend_id_deaf_star_user_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."deaf_star_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friendship_user_id_friend_id_idx" ON "deaf_star_friendship" USING btree ("user_id","friend_id");