import { db } from '@/lib/db'
import { alcanceSignups } from '@/lib/db/schema'
import { desc, gte, count, sql } from 'drizzle-orm'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AlcanceTable } from '@/components/admin/alcance-table'

export const dynamic = 'force-dynamic'

export default async function AdminAlcancePage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Deduplicate by (nombre, telefono, area), keeping the latest entry
  const [signups, [{ total }], [{ hoy }]] = await Promise.all([
    db.execute(sql`
      SELECT * FROM (
        SELECT DISTINCT ON (nombre, telefono, area) *
        FROM alcance_signups
        ORDER BY nombre, telefono, area, created_at DESC
      ) deduped
      ORDER BY created_at DESC
    `),
    db.select({ total: count() }).from(alcanceSignups),
    db.select({ hoy: count() }).from(alcanceSignups).where(gte(alcanceSignups.createdAt, today)),
  ])

  const mockUser = {
    id: '1',
    email: 'admin',
    role: 'admin',
    username: 'Admin',
  }

  const rows = (signups as unknown as Array<{
    id: number
    nombre: string
    telefono: string
    edad: number
    lider: string
    area: string
    created_at: Date | null
  }>).map((r) => ({
    id: r.id,
    nombre: r.nombre,
    telefono: r.telefono,
    edad: r.edad,
    lider: r.lider,
    area: r.area,
    createdAt: r.created_at,
  }))

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <AdminSidebar user={mockUser} />

      <div className="flex-1 lg:ml-72">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Día de Alcance
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Registros del formulario de voluntarios
            </p>
          </div>

          <AlcanceTable signups={rows} total={total} hoy={hoy} />
        </div>
      </div>
    </div>
  )
}
