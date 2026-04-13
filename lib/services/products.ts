import { db } from '@/lib/db'
import { escapeLike } from '@/lib/utils'
import { products, type NewProduct } from '@/lib/db/schema'
import { eq, desc, asc, and, or, like, sql, type SQL } from 'drizzle-orm'

export class ProductService {
  // Obtener todos los productos
  static async getAll(filters?: {
    category?: string
    featured?: boolean
    active?: boolean
    inStock?: boolean
    search?: string
    sortBy?: 'name' | 'price' | 'rating' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
    limit?: number
    offset?: number
  }) {
    try {
      // Construir condiciones de filtro
      const conditions: SQL[] = []

      if (filters?.category && filters.category !== 'all') {
        conditions.push(eq(products.category, filters.category))
      }

      if (filters?.featured !== undefined) {
        conditions.push(eq(products.featured, filters.featured))
      }

      if (filters?.active !== undefined) {
        conditions.push(eq(products.active, filters.active))
      }

      if (filters?.inStock !== undefined && filters.inStock) {
        conditions.push(sql`${products.stock} > 0`)
      }

      if (filters?.search) {
        const searchCondition = or(
          like(products.name, `%${escapeLike(filters.search)}%`),
          like(products.author, `%${escapeLike(filters.search)}%`),
          like(products.description, `%${escapeLike(filters.search)}%`)
        )
        if (searchCondition) {
          conditions.push(searchCondition)
        }
      }

      // Construir query de manera más compatible
      const baseQuery = db.select().from(products)

      // Aplicar filtros
      const queryWithFilters = conditions.length > 0
        ? baseQuery.where(and(...conditions))
        : baseQuery

      // Aplicar ordenamiento
      let queryWithOrder
      if (filters?.sortBy) {
        let column
        switch (filters.sortBy) {
          case 'name':
            column = products.name
            break
          case 'price':
            column = products.price
            break
          case 'rating':
            column = products.rating
            break
          case 'createdAt':
            column = products.createdAt
            break
          default:
            column = products.createdAt
        }
        const order = filters.sortOrder === 'desc' ? desc(column) : asc(column)
        queryWithOrder = queryWithFilters.orderBy(order)
      } else {
        queryWithOrder = queryWithFilters.orderBy(desc(products.createdAt))
      }

      // Aplicar paginación
      let finalQuery = queryWithOrder
      if (filters?.limit) {
        finalQuery = (finalQuery as any).limit(filters.limit)
      }

      if (filters?.offset) {
        finalQuery = (finalQuery as any).offset(filters.offset)
      }

      return await finalQuery
    } catch (error) {
      console.error('Error in ProductService.getAll:', error)
      // Retornar array vacío cuando la base de datos no esté disponible
      return []
    }
  }

  // Obtener producto por ID
  static async getById(id: number) {
    try {
      const result = await db.select().from(products).where(eq(products.id, id)).limit(1)
      return result[0] || null
    } catch (error) {
      console.error('Error in ProductService.getById:', error)
      return null
    }
  }

  // Obtener productos destacados
  static async getFeatured(limit = 6) {
    try {
      return await db
        .select()
        .from(products)
        .where(and(eq(products.featured, true), eq(products.active, true)))
        .orderBy(desc(products.rating))
        .limit(limit)
    } catch (error) {
      console.error('Error in ProductService.getFeatured:', error)
      return []
    }
  }

  // Crear producto
  static async create(data: NewProduct) {
    const result = await db.insert(products).values(data).returning()
    return result[0]
  }

  // Actualizar producto
  static async update(id: number, data: Partial<NewProduct>) {
    const result = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning()
    return result[0] || null
  }

  // Eliminar producto (soft delete)
  static async delete(id: number) {
    const result = await db
      .update(products)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning()
    return result[0] || null
  }

  // Eliminar producto permanentemente
  static async hardDelete(id: number) {
    const result = await db.delete(products).where(eq(products.id, id)).returning()
    return result[0] || null
  }

  // Actualizar stock
  static async updateStock(id: number, quantity: number) {
    const result = await db
      .update(products)
      .set({
        stock: sql`${products.stock} + ${quantity}`,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning()
    return result[0] || null
  }

  // Reducir stock (para ventas)
  static async reduceStock(id: number, quantity: number) {
    const result = await db
      .update(products)
      .set({
        stock: sql`GREATEST(0, ${products.stock} - ${quantity})`,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning()
    return result[0] || null
  }

  // Obtener estadísticas de productos — una sola query con agregación condicional
  static async getStats() {
    const [row] = await db
      .select({
        totalProducts:       sql<number>`count(*) filter (where ${products.active} = true)`,
        featuredProducts:    sql<number>`count(*) filter (where ${products.active} = true and ${products.featured} = true)`,
        lowStockProducts:    sql<number>`count(*) filter (where ${products.active} = true and ${products.stock} <= 5)`,
        totalInventoryValue: sql<number>`coalesce(sum(${products.price}::numeric * ${products.stock}) filter (where ${products.active} = true), 0)`,
      })
      .from(products)

    return {
      totalProducts:       row?.totalProducts       || 0,
      featuredProducts:    row?.featuredProducts    || 0,
      lowStockProducts:    row?.lowStockProducts    || 0,
      totalInventoryValue: row?.totalInventoryValue || 0,
    }
  }

  // Buscar productos
  static async search(query: string, limit = 10) {
    return await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.active, true),
          or(
            like(products.name, `%${escapeLike(query)}%`),
            like(products.author, `%${escapeLike(query)}%`),
            like(products.description, `%${escapeLike(query)}%`)
          )
        )
      )
      .orderBy(desc(products.rating))
      .limit(limit)
  }
}