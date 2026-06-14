ALTER TABLE "resources" ADD COLUMN "type" varchar(50) DEFAULT 'articulo' NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_resources_type" ON "resources" USING btree ("type");