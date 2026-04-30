import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [resource] = await db
    .select()
    .from(resources)
    .where(and(eq(resources.slug, slug), eq(resources.published, true)))

  if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ resource })
}
