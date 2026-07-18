import { db } from '@/lib/db'
import { volunteers } from '@/lib/db/schema'
import { desc, gte, count } from 'drizzle-orm'
import { Users, CalendarDays } from 'lucide-react'

export const dynamic = 'force-dynamic'

function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}

function formatearFecha(fecha: Date | string | null): string {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function AdminVoluntariosPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [rows, [{ total }], [{ hoy }]] = await Promise.all([
    db.select().from(volunteers).orderBy(desc(volunteers.createdAt)),
    db.select({ total: count() }).from(volunteers),
    db.select({ hoy: count() }).from(volunteers).where(gte(volunteers.createdAt, today)),
  ])

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Voluntariado
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Personas interesadas en servir en algún área de la iglesia
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-church-electric-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-church-electric-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{hoy}</p>
            <p className="text-xs text-gray-500">Hoy</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-gray-500">Todavía no hay registros.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Nacimiento</th>
                <th className="px-4 py-3 font-semibold">Edad</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Teléfono</th>
                <th className="px-4 py-3 font-semibold">Registrado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {v.nombre} {v.apellido}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatearFecha(v.fechaNacimiento)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{calcularEdad(v.fechaNacimiento)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {v.email ? (
                      <a href={`mailto:${v.email}`} className="text-church-electric-600 hover:underline">
                        {v.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{v.telefono || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {formatearFecha(v.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
