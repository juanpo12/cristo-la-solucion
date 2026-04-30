import { db } from '@/lib/db'
import { resources, resourceCategories } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { ResourceContent } from '@/components/resource-content'

export const revalidate = 60

export default async function RecursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [[resource], cats] = await Promise.all([
    db.select().from(resources).where(and(eq(resources.slug, slug), eq(resources.published, true))),
    db.select().from(resourceCategories),
  ])

  if (!resource) notFound()

  const categoryTitle = cats.find((c) => c.slug === resource.category)?.title ?? resource.category
  const backHref = resource.type === 'apunte'
    ? `/recursos?tipo=apunte&categoria=${resource.category}`
    : `/recursos?tipo=archivo`

  const formatDate = (date: Date | null) =>
    date ? new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {resource.coverImage && (
        <div className="w-full h-56 md:h-80 overflow-hidden">
          <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="bg-white border-b border-gray-200/50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-church-electric-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {categoryTitle}
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              resource.type === 'apunte'
                ? 'text-blue-700 bg-blue-50 border-blue-100'
                : 'text-church-electric-700 bg-church-electric-50 border-church-electric-100'
            }`}>
              <Tag className="h-3 w-3" />
              {categoryTitle}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              resource.type === 'apunte' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {resource.type === 'apunte' ? 'Apunte' : 'Archivo'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {resource.title}
          </h1>

          {resource.excerpt && (
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-6 border-l-4 border-church-electric-300 pl-4">
              {resource.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 pb-6 border-b border-gray-200">
            {resource.author && (
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-church-electric-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {resource.author.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">{resource.author}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(resource.createdAt)}
            </span>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 md:p-10">
          <ResourceContent content={resource.content as object} />
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm mb-4">¿Te fue útil este recurso?</p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-church-electric-600 to-church-electric-700 text-white rounded-xl font-medium hover:from-church-electric-700 hover:to-church-electric-800 transition-all shadow-lg shadow-church-electric-600/25"
          >
            Contactanos
          </Link>
        </div>
      </article>
    </div>
  )
}
