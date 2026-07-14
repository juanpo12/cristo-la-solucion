/**
 * Migra el rol de admin desde user_metadata (inseguro: escribible por el usuario)
 * hacia app_metadata (solo escribible con la service-role key).
 *
 * Uso:
 *   npx tsx scripts/migrate-admin-role.ts                 # migra a todos los que ya tengan rol en user_metadata
 *   npx tsx scripts/migrate-admin-role.ts user@mail.com superadmin   # fuerza un usuario concreto
 *
 * Requiere SUPABASE_SERVICE_ROLE_KEY y NEXT_PUBLIC_SUPABASE_URL en el entorno (.env.local).
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  const [emailArg, roleArg] = process.argv.slice(2)

  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error('Error listando usuarios:', error.message)
    process.exit(1)
  }

  let migrated = 0

  for (const user of data.users) {
    const currentAppRole = (user.app_metadata as Record<string, unknown>)?.role
    const legacyRole = (user.user_metadata as Record<string, unknown>)?.role

    let targetRole: string | undefined

    if (emailArg) {
      if (user.email !== emailArg) continue
      targetRole = roleArg || 'superadmin'
    } else if (
      (legacyRole === 'admin' || legacyRole === 'superadmin') &&
      currentAppRole !== legacyRole
    ) {
      targetRole = legacyRole as string
    }

    if (!targetRole) continue

    const { error: updErr } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, role: targetRole },
    })

    if (updErr) {
      console.error(`✗ ${user.email}: ${updErr.message}`)
    } else {
      console.log(`✓ ${user.email} → app_metadata.role = ${targetRole}`)
      migrated++
    }
  }

  console.log(`\nListo. ${migrated} usuario(s) migrado(s).`)
  process.exit(0)
}

main()
