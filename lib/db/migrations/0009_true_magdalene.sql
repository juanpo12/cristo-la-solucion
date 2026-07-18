CREATE TABLE "volunteers" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"apellido" varchar(255) NOT NULL,
	"fecha_nacimiento" date NOT NULL,
	"email" varchar(255),
	"telefono" varchar(50),
	"created_at" timestamp DEFAULT now()
);
