import { db } from '@/lib/db'
import { contacts, insertContactSchema, type Contact, type NewContact } from '@/lib/db/schema'
import { eq, desc, and, count, sql } from 'drizzle-orm'

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
 * Obtener estadísticas de contactos — una sola query con agregación condicional
 */
export async function getContactsStats() {
  const [row] = await db
    .select({
      total: count(),
      pending:   sql<number>`count(*) filter (where ${contacts.status} = 'pending')`,
      read:      sql<number>`count(*) filter (where ${contacts.status} = 'read')`,
      responded: sql<number>`count(*) filter (where ${contacts.status} = 'responded')`,
      closed:    sql<number>`count(*) filter (where ${contacts.status} = 'closed')`,
      general:   sql<number>`count(*) filter (where ${contacts.type} = 'general')`,
      prayer:    sql<number>`count(*) filter (where ${contacts.type} = 'prayer')`,
      pastoral:  sql<number>`count(*) filter (where ${contacts.type} = 'pastoral')`,
      group:     sql<number>`count(*) filter (where ${contacts.type} = 'group')`,
    })
    .from(contacts)

  return {
    total: row?.total || 0,
    byStatus: {
      pending:   row?.pending   || 0,
      read:      row?.read      || 0,
      responded: row?.responded || 0,
      closed:    row?.closed    || 0,
    },
    byType: {
      general:  row?.general  || 0,
      prayer:   row?.prayer   || 0,
      pastoral: row?.pastoral || 0,
      group:    row?.group    || 0,
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