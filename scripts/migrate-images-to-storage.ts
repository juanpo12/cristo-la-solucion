import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { products } from '../lib/db/schema'
import { eq, like } from 'drizzle-orm'

const BUCKET = 'productos'

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const databaseUrl = process.env.DATABASE_URL!

  if (!supabaseUrl || !databaseUrl) {
    console.error('❌ Faltan NEXT_PUBLIC_SUPABASE_URL o DATABASE_URL en .env.local')
    process.exit(1)
  }
  if (!serviceRoleKey) {
    console.error('❌ Falta SUPABASE_SERVICE_ROLE_KEY en .env.local')
    console.error('   La encontrás en: Supabase Dashboard → Settings → API → service_role key')
    process.exit(1)
  }

  // Service role bypasea RLS — necesario para subir archivos desde scripts
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  const client = postgres(databaseUrl, { prepare: false, ssl: 'require' })
  const db = drizzle(client)

  console.log(`✅ Usando bucket "${BUCKET}"`)

  // Traer solo productos con imagen base64
  const rows = await db
    .select({ id: products.id, name: products.name, image: products.image })
    .from(products)
    .where(like(products.image, 'data:%'))

  if (rows.length === 0) {
    console.log('✅ No hay imágenes base64 para migrar. Todo está en Storage.')
    await client.end()
    return
  }

  console.log(`\n📦 ${rows.length} producto(s) con imagen base64 para migrar...\n`)

  let ok = 0
  let fail = 0

  for (const row of rows) {
    try {
      // Parsear base64 data URL: "data:image/jpeg;base64,/9j/..."
      const match = row.image!.match(/^data:([^;]+);base64,(.+)$/)
      if (!match) {
        console.log(`  ⚠️  [${row.id}] "${row.name}" — formato de imagen no reconocido, saltando`)
        fail++
        continue
      }

      const mimeType = match[1]
      const base64Data = match[2]
      const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
      const buffer = Buffer.from(base64Data, 'base64')
      const path = `products/${row.id}-${Date.now()}.${ext}`

      // Subir a Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: mimeType, upsert: true })

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
      const publicUrl = urlData.publicUrl

      // Actualizar la DB con la URL
      await db.update(products).set({ image: publicUrl }).where(eq(products.id, row.id))

      console.log(`  ✅ [${row.id}] "${row.name}" → ${publicUrl}`)
      ok++
    } catch (err) {
      console.error(`  ❌ [${row.id}] "${row.name}" — error:`, (err as Error).message)
      fail++
    }
  }

  await client.end()

  console.log(`\n─────────────────────────────────`)
  console.log(`✅ Migrados:  ${ok}`)
  if (fail > 0) console.log(`❌ Fallidos:  ${fail}`)
  console.log(`─────────────────────────────────`)
  console.log(`\nEl egress de Supabase va a bajar en el próximo ciclo de facturación.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
