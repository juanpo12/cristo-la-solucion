import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

// Buckets permitidos (el cliente no puede escribir en uno arbitrario).
const ALLOWED_BUCKETS = new Set(['recursos', 'productos'])
// Solo imágenes. SVG queda excluido a propósito (puede contener scripts -> XSS).
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

async function requireAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const role = user.app_metadata?.role
  if (role !== 'admin' && role !== 'superadmin') return null
  return user
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY no configurada')
    return NextResponse.json({ error: 'Almacenamiento no configurado' }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const bucket = (formData.get('bucket') as string) || 'recursos'
  const rawFolder = (formData.get('folder') as string) || 'uploads'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_BUCKETS.has(bucket)) {
    return NextResponse.json({ error: 'Bucket no permitido' }, { status: 400 })
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json(
      { error: 'Tipo de archivo no permitido. Solo imágenes (jpg, png, webp, gif).' },
      { status: 400 }
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'El archivo supera el límite de 5 MB' }, { status: 400 })
  }

  // Sanear folder: solo letras, números, guiones y barras simples.
  const folder = rawFolder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/\.+/g, '').slice(0, 64) || 'uploads'
  const path = `${folder}/${randomUUID()}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) {
    console.error('Error subiendo archivo:', error)
    return NextResponse.json({ error: 'No se pudo subir el archivo' }, { status: 500 })
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
