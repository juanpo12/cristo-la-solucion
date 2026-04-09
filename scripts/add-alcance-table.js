import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

async function main() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "alcance_signups" (
        "id" serial PRIMARY KEY NOT NULL,
        "nombre" varchar(255) NOT NULL,
        "telefono" varchar(50) NOT NULL,
        "edad" integer NOT NULL,
        "lider" varchar(255) NOT NULL,
        "area" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now()
      );
    `;
    console.log("Table alcance_signups created successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    await sql.end();
  }
}

main();
