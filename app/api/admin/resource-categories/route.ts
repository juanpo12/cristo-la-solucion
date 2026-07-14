import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resourceCategories } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const role = user.app_metadata?.role
  if (role !== 'admin' && role !== 'superadmin') return null
  return user
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
})

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(resourceCategories).orderBy(asc(resourceCategories.title))
  return NextResponse.json({ categories: rows })
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { title, description, image } = parsed.data
  const slug = parsed.data.slug || generateSlug(title)

  const [created] = await db.insert(resourceCategories).values({
    title, slug, description: description ?? null, image: image ?? null,
  }).returning()

  return NextResponse.json({ category: created }, { status: 201 })
}
