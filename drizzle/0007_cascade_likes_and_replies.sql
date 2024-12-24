ALTER TABLE "deaf_star_replies" DROP CONSTRAINT "deaf_star_replies_thread_id_deaf_star_thread_id_fk";
--> statement-breakpoint
ALTER TABLE "deaf_star_replies" DROP CONSTRAINT "deaf_star_replies_reply_id_deaf_star_thread_id_fk";
--> statement-breakpoint
ALTER TABLE "deaf_star_threads_liked_users" DROP CONSTRAINT "deaf_star_threads_liked_users_thread_id_deaf_star_thread_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_replies" ADD CONSTRAINT "deaf_star_replies_thread_id_deaf_star_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."deaf_star_thread"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_replies" ADD CONSTRAINT "deaf_star_replies_reply_id_deaf_star_thread_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."deaf_star_thread"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_threads_liked_users" ADD CONSTRAINT "deaf_star_threads_liked_users_thread_id_deaf_star_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."deaf_star_thread"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
