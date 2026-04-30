CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" jsonb NOT NULL,
	"excerpt" text,
	"category" varchar(100) DEFAULT 'general' NOT NULL,
	"published" boolean DEFAULT false,
	"cover_image" text,
	"author" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "resources_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "idx_resources_published" ON "resources" USING btree ("published");--> statement-breakpoint
CREATE INDEX "idx_resources_category" ON "resources" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_resources_created_at" ON "resources" USING btree ("created_at");