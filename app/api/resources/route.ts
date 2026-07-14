import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { asc, desc, eq, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const type = searchParams.get('type')

  const conditions = [eq(resources.published, true)]
  if (category && category !== 'all') conditions.push(eq(resources.category, category))
  if (type && type !== 'all') conditions.push(eq(resources.type, type))

  const rows = await db
    .select({
      id: resources.id,
      title: resources.title,
      slug: resources.slug,
      excerpt: resources.excerpt,
      category: resources.category,
      type: resources.type,
      coverImage: resources.coverImage,
      author: resources.author,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .where(and(...conditions))
    .orderBy(asc(resources.sortOrder), desc(resources.createdAt))

  return NextResponse.json(
    { resources: rows },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' } }
  )
}
