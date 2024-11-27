CREATE TABLE IF NOT EXISTS "deaf_star_account" (
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
	CONSTRAINT "deaf_star_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_chat" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_chat_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"chat_id" integer NOT NULL,
	"text" text NOT NULL,
	"sender_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deaf_star_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "deaf_star_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_account" ADD CONSTRAINT "deaf_star_account_user_id_deaf_star_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_chat_user" ADD CONSTRAINT "deaf_star_chat_user_chat_id_deaf_star_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."deaf_star_chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_chat_user" ADD CONSTRAINT "deaf_star_chat_user_user_id_deaf_star_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_message" ADD CONSTRAINT "deaf_star_message_chat_id_deaf_star_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."deaf_star_chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_message" ADD CONSTRAINT "deaf_star_message_sender_id_deaf_star_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."deaf_star_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_session" ADD CONSTRAINT "deaf_star_session_user_id_deaf_star_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."deaf_star_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "deaf_star_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_user_chat_id_user_id_idx" ON "deaf_star_chat_user" USING btree ("chat_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_chat_id_idx" ON "deaf_star_message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_sender_id_idx" ON "deaf_star_message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "deaf_star_session" USING btree ("user_id");