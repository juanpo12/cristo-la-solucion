import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { desc, eq, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  const conditions = [eq(resources.published, true)]
  if (category && category !== 'all') conditions.push(eq(resources.category, category))

  const rows = await db
    .select({
      id: resources.id,
      title: resources.title,
      slug: resources.slug,
      excerpt: resources.excerpt,
      category: resources.category,
      coverImage: resources.coverImage,
      author: resources.author,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .where(and(...conditions))
    .orderBy(desc(resources.createdAt))

  return NextResponse.json({ resources: rows })
}
