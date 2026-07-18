ALTER TABLE "resources" ADD COLUMN "notified_at" timestamp;--> statement-breakpoint
UPDATE "resources" SET "notified_at" = now() WHERE "published" = true;
