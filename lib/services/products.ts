import { db } from '@/lib/db'
import { products, type NewProduct } from '@/lib/db/schema'
import { eq, desc, asc, and, or, like, sql } from 'drizzle-orm'

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
      const conditions = []
      
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
        conditions.push(
          or(
            like(products.name, `%${filters.search}%`),
            like(products.author, `%${filters.search}%`),
            like(products.description, `%${filters.search}%`)
          )
        )
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
        finalQuery = finalQuery.limit(filters.limit)
      }
      
      if (filters?.offset) {
        finalQuery = finalQuery.offset(filters.offset)
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

  // Obtener estadísticas de productos
  static async getStats() {
    const totalProducts = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.active, true))

    const featuredProducts = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(eq(products.active, true), eq(products.featured, true)))

    const lowStockProducts = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(eq(products.active, true), sql`${products.stock} <= 5`))

    const totalValue = await db
      .select({ 
        total: sql<number>`sum(${products.price}::numeric * ${products.stock})` 
      })
      .from(products)
      .where(eq(products.active, true))

    return {
      totalProducts: totalProducts[0]?.count || 0,
      featuredProducts: featuredProducts[0]?.count || 0,
      lowStockProducts: lowStockProducts[0]?.count || 0,
      totalInventoryValue: totalValue[0]?.total || 0,
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
            like(products.name, `%${query}%`),
            like(products.author, `%${query}%`),
            like(products.description, `%${query}%`)
          )
        )
      )
      .orderBy(desc(products.rating))
      .limit(limit)
  }
}