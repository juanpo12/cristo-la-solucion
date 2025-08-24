import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Configuración de la conexión
const connectionString = process.env.DATABASE_URL!

// Configuración específica para Supabase
const client = postgres(connectionString, { 
  prepare: false,
  ssl: 'require',
  connection: {
    options: `--search_path=public`,
  },
})

export const db = drizzle(client, { schema })

// Función para cerrar la conexión (útil para testing)
export const closeConnection = async () => {
  await client.end()
}