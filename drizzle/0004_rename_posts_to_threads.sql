ALTER TABLE "deaf_star_posts_liked_users" RENAME TO "deaf_star_threads_liked_users";--> statement-breakpoint
ALTER TABLE "deaf_star_threads_liked_users" RENAME COLUMN "post_id" TO "thread_id";--> statement-breakpoint
ALTER TABLE "deaf_star_threads_liked_users" DROP CONSTRAINT "deaf_star_posts_liked_users_post_id_deaf_star_thread_id_fk";
--> statement-breakpoint
ALTER TABLE "deaf_star_threads_liked_users" DROP CONSTRAINT "deaf_star_posts_liked_users_user_id_deaf_star_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_threads_liked_users" ADD CONSTRAINT "deaf_star_threads_liked_users_thread_id_deaf_star_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."deaf_star_thread"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_threads_liked_users" ADD CONSTRAINT "deaf_star_threads_liked_users_user_id_deaf_star_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
