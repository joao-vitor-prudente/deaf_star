ALTER TABLE "deaf_star_user" RENAME COLUMN "imageId" TO "image_id";--> statement-breakpoint
ALTER TABLE "deaf_star_user" DROP CONSTRAINT "deaf_star_user_imageId_deaf_star_image_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deaf_star_user" ADD CONSTRAINT "deaf_star_user_image_id_deaf_star_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."deaf_star_image"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
