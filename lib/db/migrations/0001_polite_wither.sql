CREATE TABLE "alcance_signups" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"telefono" varchar(50) NOT NULL,
	"edad" integer NOT NULL,
	"lider" varchar(255) NOT NULL,
	"area" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp NOT NULL
);
