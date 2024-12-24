CREATE TABLE IF NOT EXISTS "deaf_star_accounts" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "deaf_star_accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_friendships" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"friend_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"name" varchar(255) NOT NULL,
	"data" varchar NOT NULL,
	"format" varchar NOT NULL,
	"size" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"thread_id" integer NOT NULL,
	"reply_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_threads" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"text" text NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"type" varchar DEFAULT 'root'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_threads_liked_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"thread_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"image_id" integer,
	"bio" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "deaf_star_verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_accounts" ADD CONSTRAINT "deaf_star_accounts_user_id_deaf_star_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_friendships" ADD CONSTRAINT "deaf_star_friendships_user_id_deaf_star_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_friendships" ADD CONSTRAINT "deaf_star_friendships_friend_id_deaf_star_users_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."deaf_star_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_replies" ADD CONSTRAINT "deaf_star_replies_thread_id_deaf_star_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."deaf_star_threads"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_replies" ADD CONSTRAINT "deaf_star_replies_reply_id_deaf_star_threads_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."deaf_star_threads"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_sessions" ADD CONSTRAINT "deaf_star_sessions_user_id_deaf_star_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_threads" ADD CONSTRAINT "deaf_star_threads_author_id_deaf_star_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."deaf_star_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_threads_liked_users" ADD CONSTRAINT "deaf_star_threads_liked_users_thread_id_deaf_star_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."deaf_star_threads"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_threads_liked_users" ADD CONSTRAINT "deaf_star_threads_liked_users_user_id_deaf_star_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_users" ADD CONSTRAINT "deaf_star_users_image_id_deaf_star_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."deaf_star_images"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "deaf_star_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friendship_user_id_friend_id_idx" ON "deaf_star_friendships" USING btree ("user_id","friend_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "deaf_star_sessions" USING btree ("user_id");