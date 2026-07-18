import Link from 'next/link'
import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { BookMarked, FileText, Clock, User2, ArrowRight } from 'lucide-react'
import { NewsletterSignup } from './newsletter-signup'

const formatDate = (date: Date | null) =>
  date ? new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

async function getLatestResources() {
  try {
    return await db
      .select({
        id: resources.id,
        title: resources.title,
        slug: resources.slug,
        excerpt: resources.excerpt,
        coverImage: resources.coverImage,
        author: resources.author,
        type: resources.type,
        createdAt: resources.createdAt,
      })
      .from(resources)
      .where(and(eq(resources.published, true)))
      .orderBy(desc(resources.createdAt))
      .limit(3)
  } catch {
    // Si la DB no está disponible, la home no se rompe: se muestran solo los accesos
    return []
  }
}

export async function ResourcesSection() {
  const latest = await getLatestResources()

  return (
    <section id="recursos" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold church-text mb-6">RECURSOS</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8 rounded-full" />
          <p className="text-xl church-text-muted max-w-3xl mx-auto">
            Apuntes y archivos para tu crecimiento espiritual, disponibles para leer y estudiar cuando quieras.
          </p>
        </div>

        {latest.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
              {latest.map((resource) => (
                <Link key={resource.id} href={`/recursos/${resource.slug}`} className="group">
                  <article className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg hover:border-church-electric-200 transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {resource.coverImage ? (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={resource.coverImage}
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className={`h-1.5 w-full ${resource.type === 'archivo' ? 'bg-church-electric-500' : 'bg-blue-500'}`} />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold mb-3 ${resource.type === 'archivo' ? 'text-church-electric-600' : 'text-blue-600'}`}>
                        {resource.type === 'archivo' ? <FileText className="h-3.5 w-3.5" /> : <BookMarked className="h-3.5 w-3.5" />}
                        {resource.type === 'archivo' ? 'Archivo' : 'Apunte'}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-church-electric-600 transition-colors leading-snug">
                        {resource.title}
                      </h3>
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

            <div className="text-center mb-16">
              <Link
                href="/recursos"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg"
              >
                Ver todos los recursos
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            <Link href="/recursos?tipo=apunte" className="group">
              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-5 group-hover:bg-blue-200 transition-colors">
                  <BookMarked className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">Apuntes</h3>
                <p className="text-gray-500 leading-relaxed">
                  Materiales de estudio organizados por categoría para tu formación y estudio bíblico.
                </p>
              </div>
            </Link>
            <Link href="/recursos?tipo=archivo" className="group">
              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:border-church-electric-300 transition-all duration-300 p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-church-electric-100 flex items-center justify-center mb-5 group-hover:bg-church-electric-200 transition-colors">
                  <FileText className="h-8 w-8 text-church-electric-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-church-electric-700 transition-colors">Archivos</h3>
                <p className="text-gray-500 leading-relaxed">
                  Documentos y recursos disponibles para explorar y estudiar.
                </p>
              </div>
            </Link>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
        </div>
      </div>
    </section>
  )
}
