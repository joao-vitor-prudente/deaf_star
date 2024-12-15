CREATE TABLE IF NOT EXISTS "deaf_star_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"name" varchar(255) NOT NULL,
	"data" varchar NOT NULL,
	"format" varchar NOT NULL,
	"size" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deaf_star_user" ADD COLUMN "imageId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_user" ADD CONSTRAINT "deaf_star_user_imageId_deaf_star_image_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."deaf_star_image"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
