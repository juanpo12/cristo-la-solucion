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
  const role = user.app_metadata?.role
  if (role !== 'admin' && role !== 'superadmin') return null
  return user
}

const reorderSchema = z.object({
  ids: z.array(z.number().int()).min(1),
})

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = reorderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { ids } = parsed.data

  await db.transaction(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      await tx.update(resources).set({ sortOrder: i }).where(eq(resources.id, ids[i]))
    }
  })

  revalidatePath('/recursos')
  revalidatePath('/admin/recursos')
  return NextResponse.json({ success: true })
}
