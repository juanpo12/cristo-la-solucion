import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { ResourceForm } from '@/components/admin/resource-form'

export default async function EditRecursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [resource] = await db.select().from(resources).where(eq(resources.id, Number(id)))
  if (!resource) notFound()

  return (
    <ResourceForm
      initial={{
        id: resource.id,
        title: resource.title,
        slug: resource.slug,
        excerpt: resource.excerpt ?? '',
        category: resource.category,
        type: resource.type,
        author: resource.author ?? '',
        published: resource.published ?? false,
        content: resource.content as object,
        coverImage: resource.coverImage ?? '',
      }}
    />
  )
}
