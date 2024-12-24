ALTER TABLE "deaf_star_thread" RENAME COLUMN "likes" TO "like_count";--> statement-breakpoint
ALTER TABLE "deaf_star_thread" ADD COLUMN "reply_count" integer DEFAULT 0 NOT NULL;