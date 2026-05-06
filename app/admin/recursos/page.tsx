'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Search, Edit, Trash2, Eye, EyeOff,
  BookOpen, FileText, Globe, Lock
} from 'lucide-react'

interface Resource {
  id: number
  title: string
  slug: string
  excerpt: string | null
  category: string
  type: string
  published: boolean
  author: string | null
  createdAt: string
}

export default function AdminRecursosPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [deleting, setDeleting] = useState<number | null>(null)

  const loadResources = useCallback(async () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (categoryFilter !== 'all') params.set('category', categoryFilter)
    if (typeFilter !== 'all') params.set('type', typeFilter)

    const res = await fetch(`/api/admin/resources?${params}`)
    if (res.ok) {
      const data = await res.json()
      setResources(data.resources)
    }
  }, [searchTerm, categoryFilter, typeFilter])

  useEffect(() => {
    loadResources().finally(() => setLoading(false))
  }, [loadResources])

  const togglePublish = async (resource: Resource) => {
    await fetch(`/api/admin/resources/${resource.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !resource.published }),
    })
    loadResources()
  }

  const deleteResource = async (id: number) => {
    if (!confirm('¿Eliminar este recurso? Esta acción no se puede deshacer.')) return
    setDeleting(id)
    await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' })
    await loadResources()
    setDeleting(null)
  }

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">Recursos</h1>
          <p className="text-sm md:text-base text-gray-600">Gestiona artículos, sermones y devocionales</p>
        </div>
        <Link href="/admin/recursos/new">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-church-electric-600 to-church-electric-700 hover:from-church-electric-700 hover:to-church-electric-800 shadow-lg shadow-church-electric-600/30">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Recurso
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar recursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-church-electric-500"
        >
          <option value="all">Todos los tipos</option>
          <option value="archivo">Archivos</option>
          <option value="apunte">Apuntes</option>
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/50 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No hay recursos todavía</p>
          <p className="text-sm text-gray-400 mt-1">Creá tu primer recurso con el botón de arriba</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-church-electric-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    resource.type === 'apunte' ? 'bg-blue-100 text-blue-700' : 'bg-church-electric-50 text-church-electric-700'
                  }`}>
                    {resource.type === 'apunte' ? 'Apunte' : 'Archivo'}
                  </span>
                  {resource.published ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Globe className="h-3 w-3" /> Publicado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      <Lock className="h-3 w-3" /> Borrador
                    </span>
                  )}
                </div>
                {resource.excerpt && (
                  <p className="text-sm text-gray-500 truncate">{resource.excerpt}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {resource.author && <span className="mr-2">Por {resource.author}</span>}
                  {formatDate(resource.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(resource)}
                  title={resource.published ? 'Despublicar' : 'Publicar'}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  {resource.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <Link
                  href={`/admin/recursos/${resource.id}`}
                  className="p-2 rounded-lg text-church-electric-600 hover:bg-church-electric-50 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => deleteResource(resource.id)}
                  disabled={deleting === resource.id}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
