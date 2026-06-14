import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
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

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  excerpt: z.string().optional().nullable(),
  category: z.string().nullable().optional(),
  type: z.enum(['apunte', 'archivo']).optional(),
  published: z.boolean().optional(),
  coverImage: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const [resource] = await db.select().from(resources).where(eq(resources.id, Number(id)))
  if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ resource })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { category, ...rest } = parsed.data
  const [updated] = await db
    .update(resources)
    .set({ ...rest, category: category ?? '', updatedAt: new Date() })
    .where(eq(resources.id, Number(id)))
    .returning()

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  revalidatePath('/recursos')
  revalidatePath('/admin/recursos')
  return NextResponse.json({ resource: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.delete(resources).where(eq(resources.id, Number(id)))
  revalidatePath('/recursos')
  revalidatePath('/admin/recursos')
  return NextResponse.json({ success: true })
}
