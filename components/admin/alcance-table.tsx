'use client'

import { useState, useMemo } from 'react'

type Signup = {
  id: number
  nombre: string
  telefono: string
  edad: number
  lider: string
  area: string
  createdAt: Date | null
}

type Props = {
  signups: Signup[]
  total: number
  hoy: number
}

const AREA_COLORS: Record<string, string> = {
  'Hogar de Niños': 'bg-purple-100 text-purple-800',
  'Hospital del Niño': 'bg-pink-100 text-pink-800',
  'Residencias de adultos mayores': 'bg-orange-100 text-orange-800',
  'Personas en situación de calle': 'bg-yellow-100 text-yellow-800',
}

function badgeClass(area: string) {
  return AREA_COLORS[area] ?? 'bg-blue-100 text-blue-800'
}

function exportToCSV(rows: Signup[], filename: string) {
  const headers = ['Nombre', 'Teléfono', 'Edad', 'Líder', 'Área Asignada', 'Fecha de Registro']
  const lines = rows.map((s) => [
    s.nombre,
    s.telefono,
    s.edad,
    s.lider,
    s.area,
    s.createdAt ? new Date(s.createdAt).toLocaleString('es-AR') : '',
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function AlcanceTable({ signups, total, hoy }: Props) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)

  const areas = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of signups) {
      map.set(s.area, (map.get(s.area) ?? 0) + 1)
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [signups])

  const filtered = useMemo(
    () => (selectedArea ? signups.filter((s) => s.area === selectedArea) : signups),
    [signups, selectedArea],
  )

  const exportLabel = selectedArea
    ? `Exportar "${selectedArea}"`
    : 'Exportar todo'
  const exportFilename = selectedArea
    ? `alcance-${selectedArea.replace(/\s+/g, '-').toLowerCase()}.csv`
    : 'alcance-todos.csv'

  return (
    <>
      {/* Stats cards */}
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

      {/* Area counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {areas.map(([area, count]) => (
          <div
            key={area}
            className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4 cursor-pointer hover:border-blue-300 transition-colors"
            onClick={() => setSelectedArea(selectedArea === area ? null : area)}
            style={{ outline: selectedArea === area ? '2px solid #3b82f6' : undefined }}
          >
            <p className="text-xs text-gray-500 font-medium leading-tight mb-1">{area}</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
          </div>
        ))}
      </div>

      {/* Filter bar + export */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setSelectedArea(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedArea === null
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Todos ({signups.length})
        </button>
        {areas.map(([area, count]) => (
          <button
            key={area}
            onClick={() => setSelectedArea(selectedArea === area ? null : area)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedArea === area
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {area} ({count})
          </button>
        ))}

        <div className="ml-auto">
          <button
            onClick={() => exportToCSV(filtered, exportFilename)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {exportLabel}
          </button>
        </div>
      </div>

      {/* Table */}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay inscriptos para esta área.
                  </td>
                </tr>
              ) : (
                filtered.map((signup) => (
                  <tr key={signup.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{signup.nombre}</td>
                    <td className="px-6 py-4">{signup.telefono}</td>
                    <td className="px-6 py-4">{signup.edad}</td>
                    <td className="px-6 py-4">{signup.lider}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass(signup.area)}`}>
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
    </>
  )
}
