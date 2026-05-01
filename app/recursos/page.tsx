import { db } from '@/lib/db'
import { resources, resourceCategories } from '@/lib/db/schema'
import { desc, eq, and } from 'drizzle-orm'
import Link from 'next/link'
import { BookOpen, Clock, User2, BookMarked, FileText, FolderOpen, ArrowLeft } from 'lucide-react'

export const revalidate = 60

interface Props {
  searchParams: Promise<{ tipo?: string; categoria?: string }>
}

export default async function RecursosPage({ searchParams }: Props) {
  const { tipo, categoria } = await searchParams

  const validTipo = tipo === 'apunte' || tipo === 'articulo' ? tipo : null

  // — Vista 3: recursos filtrados por tipo + categoría —
  if (validTipo && categoria) {
    const conditions = [
      eq(resources.published, true),
      eq(resources.type, validTipo),
      eq(resources.category, categoria),
    ]

    const [rows, cats] = await Promise.all([
      db
        .select({
          id: resources.id,
          title: resources.title,
          slug: resources.slug,
          excerpt: resources.excerpt,
          coverImage: resources.coverImage,
          author: resources.author,
          createdAt: resources.createdAt,
        })
        .from(resources)
        .where(and(...conditions))
        .orderBy(desc(resources.createdAt)),
      db.select().from(resourceCategories),
    ])

    const catTitle = cats.find((c) => c.slug === categoria)?.title ?? categoria
    const catImage = cats.find((c) => c.slug === categoria)?.image ?? null
    const tipoLabel = validTipo === 'apunte' ? 'Apuntes' : 'Artículos'

    const formatDate = (date: Date | null) =>
      date ? new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero compacto con imagen de categoría */}
        <section className={`relative text-white py-14 md:py-20 overflow-hidden ${
          validTipo === 'apunte'
            ? 'bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-700'
            : 'bg-gradient-to-br from-church-electric-700 via-church-electric-600 to-purple-700'
        }`}>
          {catImage && (
            <div className="absolute inset-0">
              <img src={catImage} alt={catTitle} className="w-full h-full object-cover opacity-20" />
            </div>
          )}
          <div className="relative max-w-6xl mx-auto px-4">
            <Link
              href={`/recursos?tipo=${validTipo}`}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {tipoLabel}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{catTitle}</h1>
            <p className="text-white/80">{rows.length} {rows.length === 1 ? 'recurso disponible' : 'recursos disponibles'}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          {rows.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/50">
              <BookOpen className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Próximamente</p>
              <p className="text-sm text-gray-400 mt-1">Estamos preparando contenido para esta categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rows.map((resource) => (
                <Link key={resource.id} href={`/recursos/${resource.slug}`} className="group">
                  <article className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg hover:border-church-electric-200 transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {resource.coverImage ? (
                      <div className="h-44 overflow-hidden">
                        <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className={`h-1.5 w-full ${validTipo === 'apunte' ? 'bg-blue-500' : 'bg-church-electric-500'}`} />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-church-electric-600 transition-colors leading-snug">
                        {resource.title}
                      </h2>
                      {resource.excerpt && (
                        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{resource.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                        {resource.author && (
                          <span className="flex items-center gap-1"><User2 className="h-3 w-3" />{resource.author}</span>
                        )}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(resource.createdAt)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    )
  }

  // — Vista 2: categorías de un tipo —
  if (validTipo) {
    const [cats, allResources] = await Promise.all([
      db.select().from(resourceCategories).orderBy(resourceCategories.title),
      db
        .select({ category: resources.category })
        .from(resources)
        .where(and(eq(resources.published, true), eq(resources.type, validTipo))),
    ])

    // Contar recursos por categoría
    const countByCategory: Record<string, number> = {}
    for (const r of allResources) {
      countByCategory[r.category] = (countByCategory[r.category] ?? 0) + 1
    }

    // Categorías que tienen al menos un recurso de este tipo
    const activeCats = cats.filter((c) => countByCategory[c.slug] > 0)
    const tipoLabel = validTipo === 'apunte' ? 'Apuntes' : 'Artículos'
    const TipoIcon = validTipo === 'apunte' ? BookMarked : FileText
    const accentColor = validTipo === 'apunte' ? 'from-blue-700 via-blue-600 to-cyan-700' : 'from-church-electric-700 via-church-electric-600 to-purple-700'

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero */}
        <section className={`bg-gradient-to-br ${accentColor} text-white py-16 md:py-24`}>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 mb-6 backdrop-blur-sm">
              <TipoIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{tipoLabel}</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              {validTipo === 'apunte'
                ? 'Materiales de estudio y notas para tu formación espiritual'
                : 'Lecturas, reflexiones y enseñanzas para tu vida'}
            </p>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <Link href="/recursos" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Todos los recursos
          </Link>
        </div>

        {/* Categorías */}
        <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {activeCats.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200/50">
              <FolderOpen className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Próximamente</p>
              <p className="text-sm text-gray-400 mt-1">Estamos preparando contenido para esta sección</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCats.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/recursos?tipo=${validTipo}&categoria=${cat.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:border-church-electric-200 transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Imagen */}
                    <div className="h-44 overflow-hidden bg-gray-100 flex items-center justify-center relative">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${
                          validTipo === 'apunte' ? 'bg-blue-50' : 'bg-church-electric-50'
                        }`}>
                          <FolderOpen className={`h-14 w-14 ${
                            validTipo === 'apunte' ? 'text-blue-200' : 'text-church-electric-200'
                          }`} />
                        </div>
                      )}
                      {/* Badge de cantidad */}
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {countByCategory[cat.slug]} {countByCategory[cat.slug] === 1 ? 'recurso' : 'recursos'}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-church-electric-600 transition-colors">
                        {cat.title}
                      </h3>
                      {cat.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{cat.description}</p>
                      )}
                      <div className={`mt-4 flex items-center gap-1.5 text-sm font-medium ${
                        validTipo === 'apunte' ? 'text-blue-600' : 'text-church-electric-600'
                      }`}>
                        Ver {countByCategory[cat.slug] === 1 ? 'recurso' : 'recursos'}
                        <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    )
  }

  // — Vista 1: landing — elegir tipo —
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <section className="bg-gradient-to-br from-church-electric-700 via-church-electric-600 to-purple-700 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 mb-6 backdrop-blur-sm">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Recursos</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Contenido para tu crecimiento espiritual — elegí qué tipo querés explorar
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/recursos?tipo=articulo" className="group">
            <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:border-church-electric-300 transition-all duration-300 p-8 flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-2xl bg-church-electric-100 flex items-center justify-center mb-5 group-hover:bg-church-electric-200 transition-colors">
                <FileText className="h-8 w-8 text-church-electric-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-church-electric-700 transition-colors">Artículos</h2>
              <p className="text-gray-500 leading-relaxed">
                Lecturas, reflexiones y enseñanzas para profundizar tu fe y crecer espiritualmente.
              </p>
              <div className="mt-6 text-church-electric-600 font-medium flex items-center gap-1.5">
                Explorar artículos
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </Link>

          <Link href="/recursos?tipo=apunte" className="group">
            <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-8 flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-5 group-hover:bg-blue-200 transition-colors">
                <BookMarked className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">Apuntes</h2>
              <p className="text-gray-500 leading-relaxed">
                Materiales de estudio, notas y recursos para tu formación y estudio bíblico.
              </p>
              <div className="mt-6 text-blue-600 font-medium flex items-center gap-1.5">
                Explorar apuntes
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
