import { config } from 'dotenv'
config({ path: '.env.local' })
import { sql } from 'drizzle-orm'

async function main() {
    console.log('Creating rate_limits table...')
    try {
        // Dynamic import to ensure env vars are loaded first
        const { db } = await import('@/lib/db')

        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        key VARCHAR(255) PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0,
        expires_at TIMESTAMP NOT NULL
      );
    `)
        console.log('✅ Table rate_limits created successfully')
    } catch (error) {
        console.error('❌ Error creating table:', error)
        process.exit(1)
    }
    process.exit(0)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
