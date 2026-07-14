ALTER TABLE "resources" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_resources_sort_order" ON "resources" USING btree ("sort_order");