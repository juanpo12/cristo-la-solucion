import { db } from '@/lib/db'
import { escapeLike } from '@/lib/utils'
import { orders, orderItems, type NewOrder, type NewOrderItem } from '@/lib/db/schema'
import { eq, desc, asc, and, or, like, sql, gte, lte, type SQL } from 'drizzle-orm'

export class OrderService {
  // Obtener todas las órdenes con filtros
  static async getAll(filters?: {
    status?: string
    search?: string
    dateFrom?: Date
    dateTo?: Date
    sortBy?: 'createdAt' | 'total' | 'status'
    sortOrder?: 'asc' | 'desc'
    limit?: number
    offset?: number
  }) {
    const baseQuery = db.select().from(orders)

    // Aplicar filtros
    const conditions: SQL[] = []

    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(orders.status, filters.status))
    }

    if (filters?.search) {
      const searchCondition = or(
        like(orders.externalReference, `%${escapeLike(filters.search)}%`),
        like(orders.payerEmail, `%${escapeLike(filters.search)}%`),
        like(orders.payerName, `%${escapeLike(filters.search)}%`)
      )
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }

    if (filters?.dateFrom) {
      conditions.push(gte(orders.createdAt, filters.dateFrom))
    }

    if (filters?.dateTo) {
      conditions.push(lte(orders.createdAt, filters.dateTo))
    }

    const queryWithFilters = conditions.length > 0
      ? baseQuery.where(and(...conditions))
      : baseQuery

    // Aplicar ordenamiento
    let queryWithOrder
    if (filters?.sortBy) {
      let column
      switch (filters.sortBy) {
        case 'total':
          column = orders.total
          break
        case 'status':
          column = orders.status
          break
        case 'createdAt':
        default:
          column = orders.createdAt
      }
      const order = filters.sortOrder === 'asc' ? asc(column) : desc(column)
      queryWithOrder = queryWithFilters.orderBy(order)
    } else {
      queryWithOrder = queryWithFilters.orderBy(desc(orders.createdAt))
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
  }

  // Obtener orden por ID con items
  static async getById(id: number) {
    const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
    if (!order[0]) return null

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id))

    return {
      ...order[0],
      items
    }
  }

  // Obtener orden por referencia externa
  static async getByExternalReference(externalReference: string) {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.externalReference, externalReference))
      .limit(1)

    if (!order[0]) return null

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order[0].id))

    return {
      ...order[0],
      items
    }
  }

  // Crear orden
  static async create(orderData: NewOrder, items: NewOrderItem[]) {
    const result = await db.transaction(async (tx) => {
      // Crear la orden
      const [order] = await tx.insert(orders).values(orderData).returning()

      // Crear los items de la orden
      const orderItemsData = items.map(item => ({
        ...item,
        orderId: order.id
      }))

      await tx.insert(orderItems).values(orderItemsData)

      return order
    })

    return result
  }

  // Actualizar estado de orden
  static async updateStatus(id: number, status: string, additionalData?: Partial<NewOrder>) {
    const updateData = {
      status,
      updatedAt: new Date(),
      ...additionalData
    }

    const result = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning()

    return result[0] || null
  }

  // Marcar orden como entregada
  static async markAsDelivered(id: number) {
    return this.updateStatus(id, 'delivered', {
      dateApproved: new Date()
    })
  }

  // Obtener estadísticas de órdenes
  static async getStats(dateFrom?: Date, dateTo?: Date) {
    const conditions = []

    if (dateFrom) {
      conditions.push(gte(orders.createdAt, dateFrom))
    }

    if (dateTo) {
      conditions.push(lte(orders.createdAt, dateTo))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const totalOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereClause)

    const pendingOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(eq(orders.status, 'pending'), ...(conditions || [])))

    const approvedOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(eq(orders.status, 'approved'), ...(conditions || [])))

    const deliveredOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(eq(orders.status, 'delivered'), ...(conditions || [])))

    const totalRevenue = await db
      .select({
        total: sql<number>`sum(${orders.total}::numeric)`
      })
      .from(orders)
      .where(and(or(eq(orders.status, 'approved'), eq(orders.status, 'delivered')), ...(conditions || [])))

    const averageOrderValue = await db
      .select({
        avg: sql<number>`avg(${orders.total}::numeric)`
      })
      .from(orders)
      .where(and(or(eq(orders.status, 'approved'), eq(orders.status, 'delivered')), ...(conditions || [])))

    return {
      totalOrders: totalOrders[0]?.count || 0,
      pendingOrders: pendingOrders[0]?.count || 0,
      approvedOrders: approvedOrders[0]?.count || 0,
      deliveredOrders: deliveredOrders[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageOrderValue: averageOrderValue[0]?.avg || 0,
    }
  }

  // Obtener órdenes recientes
  static async getRecent(limit = 10) {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
  }

  // Obtener productos más vendidos
  static async getTopSellingProducts(limit = 10, dateFrom?: Date, dateTo?: Date) {
    const baseQuery = db
      .select({
        productId: orderItems.productId,
        productName: orderItems.productName,
        productAuthor: orderItems.productAuthor,
        totalQuantity: sql<number>`sum(${orderItems.quantity})`,
        totalRevenue: sql<number>`sum(${orderItems.totalPrice}::numeric)`,
        orderCount: sql<number>`count(distinct ${orderItems.orderId})`
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orders.status, 'approved'))
      .groupBy(orderItems.productId, orderItems.productName, orderItems.productAuthor)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(limit)

    let finalQuery = baseQuery

    if (dateFrom || dateTo) {
      const conditions: SQL[] = [eq(orders.status, 'approved')]

      if (dateFrom) {
        conditions.push(gte(orders.createdAt, dateFrom))
      }

      if (dateTo) {
        conditions.push(lte(orders.createdAt, dateTo))
      }

      finalQuery = (baseQuery as any).where(and(...conditions))
    }

    return await finalQuery
  }
}