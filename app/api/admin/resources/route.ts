import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { desc, eq, ilike, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const role = user.user_metadata?.role
  if (role !== 'admin' && role !== 'superadmin') return null
  return user
}

function generateSlug(title: string): string {
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
  content: z.record(z.string(), z.unknown()),
  excerpt: z.string().optional().nullable(),
  category: z.string().default('general'),
  type: z.enum(['apunte', 'articulo']).default('articulo'),
  published: z.boolean().default(false),
  coverImage: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
})

export async function GET(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const published = searchParams.get('published')

  const type = searchParams.get('type')
  const conditions = []
  if (search) conditions.push(ilike(resources.title, `%${search}%`))
  if (category && category !== 'all') conditions.push(eq(resources.category, category))
  if (type && type !== 'all') conditions.push(eq(resources.type, type))
  if (published === 'true') conditions.push(eq(resources.published, true))
  if (published === 'false') conditions.push(eq(resources.published, false))

  const rows = await db
    .select()
    .from(resources)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(resources.createdAt))

  return NextResponse.json({ resources: rows })
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const slug = data.slug || generateSlug(data.title)

  const [created] = await db.insert(resources).values({
    title: data.title,
    slug,
    content: data.content,
    excerpt: data.excerpt ?? null,
    category: data.category,
    type: data.type,
    published: data.published,
    coverImage: data.coverImage ?? null,
    author: data.author ?? null,
  }).returning()

  revalidatePath('/recursos')
  return NextResponse.json({ resource: created }, { status: 201 })
}
