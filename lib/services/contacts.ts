import { db } from '@/lib/db'
import { contacts, insertContactSchema, type Contact, type NewContact } from '@/lib/db/schema'
import { eq, desc, and, count } from 'drizzle-orm'

export interface ContactsFilters {
  status?: string
  type?: string
  page?: number
  limit?: number
}

export interface ContactsResponse {
  contacts: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * Crear un nuevo contacto
 */
export async function createContact(data: Omit<NewContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
  // Validar datos
  const validatedData = insertContactSchema.parse({
    ...data,
    status: 'pending'
  })

  // Insertar en la base de datos
  const result = await db.insert(contacts).values(validatedData).returning()
  
  if (result.length === 0) {
    throw new Error('Error al crear el contacto')
  }

  return result[0]
}

/**
 * Obtener contactos con filtros y paginación
 */
export async function getContacts(filters: ContactsFilters = {}): Promise<ContactsResponse> {
  const {
    status,
    type,
    page = 1,
    limit = 10
  } = filters

  const offset = (page - 1) * limit

  // Construir condiciones de filtro
  const conditions = []
  if (status && status !== 'all') {
    conditions.push(eq(contacts.status, status as 'pending' | 'read' | 'responded' | 'closed'))
  }
  if (type && type !== 'all') {
    conditions.push(eq(contacts.type, type as 'general' | 'prayer' | 'pastoral' | 'group'))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Obtener contactos
  const contactsList = await db
    .select()
    .from(contacts)
    .where(whereClause)
    .orderBy(desc(contacts.createdAt))
    .limit(limit)
    .offset(offset)

  // Obtener total para paginación
  const totalResult = await db
    .select({ count: count() })
    .from(contacts)
    .where(whereClause)

  const total = totalResult[0]?.count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    contacts: contactsList,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

/**
 * Obtener un contacto por ID
 */
export async function getContactById(id: number): Promise<Contact | null> {
  const result = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1)

  return result[0] || null
}

/**
 * Actualizar el estado de un contacto
 */
export async function updateContactStatus(
  id: number, 
  status: Contact['status']
): Promise<Contact | null> {
  const result = await db
    .update(contacts)
    .set({ 
      status,
      updatedAt: new Date()
    })
    .where(eq(contacts.id, id))
    .returning()

  return result[0] || null
}

/**
 * Obtener estadísticas de contactos
 */
export async function getContactsStats() {
  const totalResult = await db.select({ count: count() }).from(contacts)
  const pendingResult = await db
    .select({ count: count() })
    .from(contacts)
    .where(eq(contacts.status, 'pending'))
  
  const readResult = await db
    .select({ count: count() })
    .from(contacts)
    .where(eq(contacts.status, 'read'))
  
  const respondedResult = await db
    .select({ count: count() })
    .from(contacts)
    .where(eq(contacts.status, 'responded'))
  
  const closedResult = await db
    .select({ count: count() })
    .from(contacts)
    .where(eq(contacts.status, 'closed'))

  // Estadísticas por tipo
  const generalResult = await db
    .select({ count: count() })
    .from(contacts)
    .where(eq(contacts.type, 'general'))
  
  const prayerResult = await db
    .select({ count: count() })
    .from(contacts)
    .where(eq(contacts.type, 'prayer'))
  
  const pastoralResult = await db
    .select({ count: count() })
    .from(contacts)
    .where(eq(contacts.type, 'pastoral'))
  
  const groupResult = await db
    .select({ count: count() })
    .from(contacts)
    .where(eq(contacts.type, 'group'))

  return {
    total: totalResult[0]?.count || 0,
    byStatus: {
      pending: pendingResult[0]?.count || 0,
      read: readResult[0]?.count || 0,
      responded: respondedResult[0]?.count || 0,
      closed: closedResult[0]?.count || 0
    },
    byType: {
      general: generalResult[0]?.count || 0,
      prayer: prayerResult[0]?.count || 0,
      pastoral: pastoralResult[0]?.count || 0,
      group: groupResult[0]?.count || 0
    }
  }
}

/**
 * Eliminar un contacto (soft delete cambiando status a 'closed')
 */
export async function deleteContact(id: number): Promise<boolean> {
  const result = await db
    .update(contacts)
    .set({ 
      status: 'closed',
      updatedAt: new Date()
    })
    .where(eq(contacts.id, id))
    .returning()

  return result.length > 0
}

/**
 * Marcar contacto como leído
 */
export async function markAsRead(id: number): Promise<Contact | null> {
  return updateContactStatus(id, 'read')
}

/**
 * Marcar contacto como respondido
 */
export async function markAsResponded(id: number): Promise<Contact | null> {
  return updateContactStatus(id, 'responded')
}