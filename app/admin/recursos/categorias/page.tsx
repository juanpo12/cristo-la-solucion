'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Upload, X, FolderOpen } from 'lucide-react'
import Link from 'next/link'

interface ResourceCategory {
  id: number
  title: string
  slug: string
  description: string | null
  image: string | null
  createdAt: string
}

const EMPTY = { title: '', slug: '', description: '', image: '' }

function generateSlug(title: string) {
  return title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

export default function ResourceCategoriasPage() {
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'new' | 'edit' | null>(null)
  const [editing, setEditing] = useState<ResourceCategory | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const res = await fetch('/api/admin/resource-categories')
    const data = await res.json()
    setCategories(data.categories ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY)
    setError('')
    setModal('new')
  }

  const openEdit = (cat: ResourceCategory) => {
    setEditing(cat)
    setForm({ title: cat.title, slug: cat.slug, description: cat.description ?? '', image: cat.image ?? '' })
    setError('')
    setModal('edit')
  }

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: modal === 'new' ? generateSlug(val) : f.slug }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'recursos')
      formData.append('folder', 'categories')

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setForm((f) => ({ ...f, image: data.url }))
    } catch {
      setError('No se pudo subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setError('El título es requerido'); return }
    setSaving(true)
    setError('')
    try {
      const url = modal === 'edit' ? `/api/admin/resource-categories/${editing!.id}` : '/api/admin/resource-categories'
      const method = modal === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, slug: form.slug || generateSlug(form.title), description: form.description || null, image: form.image || null }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error?.message ?? 'Error al guardar') }
      await load()
      setModal(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría? Los recursos que la usen quedarán sin categoría válida.')) return
    setDeleting(id)
    await fetch(`/api/admin/resource-categories/${id}`, { method: 'DELETE' })
    await load()
    setDeleting(null)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/recursos">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Categorías de Recursos</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestioná las categorías que aparecen al crear un recurso</p>
          </div>
        </div>
        <Button onClick={openNew} className="bg-gradient-to-r from-church-electric-600 to-church-electric-700 hover:from-church-electric-700 hover:to-church-electric-800 shadow-lg shadow-church-electric-600/30">
          <Plus className="h-4 w-4 mr-2" />
          Nueva categoría
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200/50">
          <FolderOpen className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No hay categorías todavía</p>
          <p className="text-sm text-gray-400 mt-1">Creá la primera para poder asignarla a los recursos</p>
          <Button onClick={openNew} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />Nueva categoría
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden flex">
              {/* Image */}
              <div className="w-28 h-28 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                {cat.image ? (
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                ) : (
                  <FolderOpen className="h-8 w-8 text-gray-300" />
                )}
              </div>
              {/* Info */}
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">{cat.title}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">/{cat.slug}</p>
                  {cat.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => openEdit(cat)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <Pencil className="h-3.5 w-3.5" />Editar
                  </button>
                  <button onClick={() => handleDelete(cat.id)} disabled={deleting === cat.id} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                    {deleting === cat.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{modal === 'new' ? 'Nueva categoría' : 'Editar categoría'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Image */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Imagen</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                    {form.image ? (
                      <img src={form.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      {uploading ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Subiendo...</> : <><Upload className="h-3.5 w-3.5 mr-1.5" />Subir imagen</>}
                    </Button>
                    {form.image && (
                      <button type="button" onClick={() => setForm((f) => ({ ...f, image: '' }))} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                        <X className="h-3 w-3" />Quitar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="cat-title" className="text-sm font-medium text-gray-700">Título *</Label>
                <Input id="cat-title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Ej: Devocional" className="mt-1" />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="cat-desc" className="text-sm font-medium text-gray-700">Descripción</Label>
                <textarea
                  id="cat-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Descripción breve de esta categoría..."
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-church-electric-500 resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            </div>

            <div className="flex justify-end gap-3 px-6 pb-6">
              <Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-church-electric-600 to-church-electric-700 hover:from-church-electric-700 hover:to-church-electric-800 min-w-[100px]">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
