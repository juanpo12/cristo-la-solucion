import { db } from '@/lib/db'
import { alcanceSignups } from '@/lib/db/schema'
import { desc, gte, count } from 'drizzle-orm'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const dynamic = 'force-dynamic'

export default async function AdminAlcancePage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [signups, [{ total }], [{ hoy }]] = await Promise.all([
    db.query.alcanceSignups.findMany({
      orderBy: [desc(alcanceSignups.createdAt)],
    }),
    db.select({ total: count() }).from(alcanceSignups),
    db.select({ hoy: count() }).from(alcanceSignups).where(gte(alcanceSignups.createdAt, today)),
  ])

  // We mock a user for the sidebar as it expects it
  const mockUser = {
    id: '1',
    email: 'admin',
    role: 'admin',
    username: 'Admin',
  }

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.197-3.764M9 20H4v-2a4 4 0 015.197-3.764M15 11a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 10-6 0 3 3 0 006 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Registros</p>
                <p className="text-3xl font-bold text-gray-900">{total}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Registros Hoy</p>
                <p className="text-3xl font-bold text-gray-900">{hoy}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 border-b border-gray-200/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nombre</th>
                    <th className="px-6 py-4 font-semibold">Teléfono</th>
                    <th className="px-6 py-4 font-semibold">Edad</th>
                    <th className="px-6 py-4 font-semibold">Líder</th>
                    <th className="px-6 py-4 font-semibold">Área Asignada</th>
                    <th className="px-6 py-4 font-semibold">Fecha de Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {signups.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No hay inscriptos todavía.
                      </td>
                    </tr>
                  ) : (
                    signups.map((signup) => (
                      <tr key={signup.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{signup.nombre}</td>
                        <td className="px-6 py-4">{signup.telefono}</td>
                        <td className="px-6 py-4">{signup.edad}</td>
                        <td className="px-6 py-4">{signup.lider}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {signup.area}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {signup.createdAt ? new Date(signup.createdAt).toLocaleString('es-AR') : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
