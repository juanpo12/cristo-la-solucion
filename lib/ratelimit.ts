import { db } from '@/lib/db'
import { rateLimits } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + windowSeconds * 1000)

    // Upsert logic: Insert new record or update existing one
    // If existing record is expired, reset count to 1 and update expiration
    // If not expired, increment count
    const result = await db.insert(rateLimits)
        .values({ key, count: 1, expiresAt })
        .onConflictDoUpdate({
            target: rateLimits.key,
            set: {
                count: sql`CASE WHEN ${rateLimits.expiresAt} < ${now.toISOString()} THEN 1 ELSE ${rateLimits.count} + 1 END`,
                expiresAt: sql`CASE WHEN ${rateLimits.expiresAt} < ${now.toISOString()} THEN ${expiresAt.toISOString()} ELSE ${rateLimits.expiresAt} END`
            }
        })
        .returning()

    const current = result[0]

    return {
        success: current.count <= limit,
        limit,
        remaining: Math.max(0, limit - current.count),
        reset: current.expiresAt
    }
}
