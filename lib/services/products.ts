import { db } from '@/lib/db'
import { products, type NewProduct } from '@/lib/db/schema'
import { eq, desc, asc, and, or, like, sql } from 'drizzle-orm'
import { fallbackProducts } from '@/lib/data/products-fallback'

export class ProductService {
  // Obtener todos los productos
  static async getAll(filters?: {
    category?: string
    featured?: boolean
    active?: boolean
    search?: string
    sortBy?: 'name' | 'price' | 'rating' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
    limit?: number
    offset?: number
  }) {
    try {
      let query = db.select().from(products)

      // Aplicar filtros
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
      
      if (filters?.search) {
        conditions.push(
          or(
            like(products.name, `%${filters.search}%`),
            like(products.author, `%${filters.search}%`),
            like(products.description, `%${filters.search}%`)
          )
        )
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions))
      }

      // Aplicar ordenamiento
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
        query = query.orderBy(order)
      } else {
        query = query.orderBy(desc(products.createdAt))
      }

      // Aplicar paginación
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      
      if (filters?.offset) {
        query = query.offset(filters.offset)
      }

      return await query
    } catch (error) {
      console.error('Error in ProductService.getAll, using fallback data:', error)
      
      // Usar datos de fallback cuando la base de datos no esté disponible
      let filteredProducts = [...fallbackProducts]
      
      // Aplicar filtros a los datos de fallback
      if (filters?.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category)
      }
      
      if (filters?.featured !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.featured === filters.featured)
      }
      
      if (filters?.active !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.active === filters.active)
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.author.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        )
      }
      
      // Aplicar ordenamiento
      if (filters?.sortBy) {
        filteredProducts.sort((a, b) => {
          let aVal, bVal
          switch (filters.sortBy) {
            case 'name':
              aVal = a.name
              bVal = b.name
              break
            case 'price':
              aVal = parseFloat(a.price)
              bVal = parseFloat(b.price)
              break
            case 'rating':
              aVal = parseFloat(a.rating)
              bVal = parseFloat(b.rating)
              break
            case 'createdAt':
              aVal = a.createdAt
              bVal = b.createdAt
              break
            default:
              aVal = a.createdAt
              bVal = b.createdAt
          }
          
          if (filters.sortOrder === 'desc') {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
          } else {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
          }
        })
      }
      
      // Aplicar paginación
      if (filters?.offset) {
        filteredProducts = filteredProducts.slice(filters.offset)
      }
      
      if (filters?.limit) {
        filteredProducts = filteredProducts.slice(0, filters.limit)
      }
      
      return filteredProducts
    }
  }

  // Obtener producto por ID
  static async getById(id: number) {
    try {
      const result = await db.select().from(products).where(eq(products.id, id)).limit(1)
      return result[0] || null
    } catch (error) {
      console.error('Error in ProductService.getById, using fallback data:', error)
      return fallbackProducts.find(p => p.id === id) || null
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
      console.error('Error in ProductService.getFeatured, using fallback data:', error)
      return fallbackProducts
        .filter(p => p.featured && p.active)
        .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        .slice(0, limit)
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