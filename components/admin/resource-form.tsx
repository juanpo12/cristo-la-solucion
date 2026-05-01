'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Eye, EyeOff, Loader2, Upload, X, Clock, Tag, FolderOpen, FileText, BookMarked } from 'lucide-react'
import Link from 'next/link'
import { ResourceEditor } from './resource-editor'
import { ResourceContent } from '@/components/resource-content'

interface ResourceCategory {
  id: number
  title: string
  slug: string
  description: string | null
  image: string | null
}

interface ResourceFormProps {
  initial?: {
    id?: number
    title: string
    slug: string
    excerpt: string
    category: string
    type?: string
    author: string
    published: boolean
    content: object | null
    coverImage?: string | null
  }
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function ResourceForm({ initial }: ResourceFormProps) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [type, setType] = useState<'articulo' | 'apunte'>((initial?.type as 'articulo' | 'apunte') ?? 'articulo')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [published, setPublished] = useState(initial?.published ?? false)
  const [content, setContent] = useState<object | null>(initial?.content ?? null)
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetch('/api/admin/resource-categories')
      .then((r) => r.json())
      .then((data) => {
        const cats: ResourceCategory[] = data.categories ?? []
        setCategories(cats)
        if (!initial?.category && cats.length > 0) setCategory(cats[0].slug)
      })
      .catch(() => {})
  }, [])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isEdit) setSlug(generateSlug(val))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'recursos')
      formData.append('folder', 'covers')

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setCoverImage(data.url)
    } catch {
      setError('No se pudo subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content) { setError('El contenido no puede estar vacío'); return }

    setSaving(true)
    setError('')

    const payload = { title, slug, excerpt, category, type, author, published, content, coverImage: coverImage || null }
    const url = isEdit ? `/api/admin/resources/${initial!.id}` : '/api/admin/resources'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error?.message ?? 'Error al guardar')
      setSaving(false)
      return
    }

    router.push('/admin/recursos')
    router.refresh()
  }

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/recursos">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isEdit ? 'Editar Recurso' : 'Nuevo Recurso'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit ? 'Modificá el contenido y guardá los cambios' : 'Completá los datos y escribí el contenido'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata card */}
          <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">Información general</h2>

            {/* Type selector */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Tipo *</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType('articulo')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    type === 'articulo'
                      ? 'border-church-electric-500 bg-church-electric-50 text-church-electric-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Artículo
                </button>
                <button
                  type="button"
                  onClick={() => setType('apunte')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    type === 'apunte'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <BookMarked className="h-4 w-4" />
                  Apunte
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título del recurso"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author" className="text-sm font-medium text-gray-700">Autor</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nombre del autor"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Categoría{' '}
                  <Link href="/admin/recursos/categorias" className="text-xs text-church-electric-600 hover:underline font-normal">
                    (gestionar)
                  </Link>
                </Label>
                {categories.length === 0 ? (
                  <div className="mt-1 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <FolderOpen className="h-4 w-4 flex-shrink-0" />
                    <span>No hay categorías. <Link href="/admin/recursos/categorias" className="underline font-medium">Creá una primero</Link>.</span>
                  </div>
                ) : (
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-church-electric-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.title}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">Descripción corta</Label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Un resumen breve que aparecerá en la lista de recursos..."
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-church-electric-500 resize-none"
              />
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 text-base mb-4">Foto de portada</h2>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-full sm:w-48 h-32 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                {coverImage ? (
                  <img src={coverImage} alt="Portada" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="h-6 w-6 text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Sin imagen</p>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3 pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Subiendo...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2" />{coverImage ? 'Cambiar imagen' : 'Subir imagen'}</>
                  )}
                </Button>
                {coverImage && !uploading && (
                  <button
                    type="button"
                    onClick={() => { setCoverImage(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Quitar imagen
                  </button>
                )}
                <p className="text-xs text-gray-400">JPG o PNG recomendado. Se guarda en Supabase Storage.</p>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Contenido *</Label>
            <ResourceEditor
              content={content}
              onChange={setContent}
              placeholder="Empezá a escribir el contenido del recurso..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPublished((p) => !p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                published
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {published ? 'Publicado — hacer click para guardar como borrador' : 'Borrador — hacer click para publicar'}
            </button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista previa
              </Button>
              <Link href="/admin/recursos">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-church-electric-600 to-church-electric-700 hover:from-church-electric-700 hover:to-church-electric-800 shadow-lg shadow-church-electric-600/30 min-w-[120px]"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" />Guardar</>}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen">
            {/* Preview bar */}
            <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-white/10">
              <span className="text-white font-medium text-sm">Vista previa — así se verá publicado</span>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Simulated public page */}
            <div className="min-h-screen bg-gray-50">
              {coverImage && (
                <div className="w-full h-56 md:h-72 overflow-hidden">
                  <img src={coverImage} alt="Portada" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-white border-b border-gray-200/50">
                <div className="max-w-3xl mx-auto px-4 py-4">
                  <span className="inline-flex items-center gap-2 text-sm text-gray-400 cursor-default select-none">
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Recursos
                  </span>
                </div>
              </div>

              <article className="max-w-3xl mx-auto px-4 py-10 md:py-16">
                <header className="mb-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-church-electric-700 bg-church-electric-50 px-3 py-1.5 rounded-full border border-church-electric-100">
                      <Tag className="h-3 w-3" />
                      {categories.find((c) => c.slug === category)?.title || category}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    {title || <span className="text-gray-300">Sin título</span>}
                  </h1>
                  {excerpt && (
                    <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-6 border-l-4 border-church-electric-300 pl-4">
                      {excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 pb-6 border-b border-gray-200">
                    {author && (
                      <span className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-church-electric-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {author.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-700">{author}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 md:p-10">
                  {content ? (
                    <ResourceContent content={content} />
                  ) : (
                    <p className="text-gray-400 italic text-center py-8">El contenido aparecerá acá...</p>
                  )}
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200 text-center">
                  <p className="text-gray-500 text-sm mb-4">¿Te fue útil este recurso?</p>
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-church-electric-600 to-church-electric-700 text-white rounded-xl font-medium shadow-lg shadow-church-electric-600/25 cursor-default select-none">
                    Contactanos
                  </span>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
