import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { BookOpen, Clock, User2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  sermon: 'Sermón',
  devocional: 'Devocional',
  estudio: 'Estudio Bíblico',
  testimonio: 'Testimonio',
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-gray-100 text-gray-700',
  sermon: 'bg-purple-100 text-purple-700',
  devocional: 'bg-blue-100 text-blue-700',
  estudio: 'bg-emerald-100 text-emerald-700',
  testimonio: 'bg-orange-100 text-orange-700',
}

export default async function RecursosPage() {
  const rows = await db
    .select({
      id: resources.id,
      title: resources.title,
      slug: resources.slug,
      excerpt: resources.excerpt,
      category: resources.category,
      author: resources.author,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .where(eq(resources.published, true))
    .orderBy(desc(resources.createdAt))

  const formatDate = (date: Date | null) =>
    date
      ? new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
      : ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-church-electric-700 via-church-electric-600 to-purple-700 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 mb-6 backdrop-blur-sm">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Recursos</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Sermones, devocionales y estudios bíblicos para tu crecimiento espiritual
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {rows.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Próximamente</p>
            <p className="text-gray-400 mt-1">Estamos preparando contenido para vos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((resource) => (
              <Link key={resource.id} href={`/recursos/${resource.slug}`} className="group">
                <article className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg hover:border-church-electric-200 transition-all duration-300 overflow-hidden h-full flex flex-col">
                  {/* Color top bar by category */}
                  <div className={`h-1.5 w-full ${
                    resource.category === 'sermon' ? 'bg-purple-500' :
                    resource.category === 'devocional' ? 'bg-blue-500' :
                    resource.category === 'estudio' ? 'bg-emerald-500' :
                    resource.category === 'testimonio' ? 'bg-orange-500' :
                    'bg-church-electric-500'
                  }`} />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[resource.category] || CATEGORY_COLORS.general}`}>
                        {CATEGORY_LABELS[resource.category] || resource.category}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-church-electric-600 transition-colors leading-snug">
                      {resource.title}
                    </h2>

                    {resource.excerpt && (
                      <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
                        {resource.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                      {resource.author && (
                        <span className="flex items-center gap-1">
                          <User2 className="h-3 w-3" />
                          {resource.author}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(resource.createdAt)}
                      </span>
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
