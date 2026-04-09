import { db } from '@/lib/db'
import { alcanceSignups } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const dynamic = 'force-dynamic'

export default async function AdminAlcancePage() {
  const signups = await db.query.alcanceSignups.findMany({
    orderBy: [desc(alcanceSignups.createdAt)],
  })

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
