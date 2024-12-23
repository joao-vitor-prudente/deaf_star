CREATE TABLE IF NOT EXISTS "deaf_star_posts_liked_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deaf_star_thread" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_posts_liked_users" ADD CONSTRAINT "deaf_star_posts_liked_users_post_id_deaf_star_thread_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."deaf_star_thread"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_posts_liked_users" ADD CONSTRAINT "deaf_star_posts_liked_users_user_id_deaf_star_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
