import { db } from '@/lib/db'
import { orders, orderItems, type NewOrder, type NewOrderItem } from '@/lib/db/schema'
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm'
import { ProductService } from './products'

export class OrderService {
  // Crear nueva orden
  static async create(orderData: NewOrder, items: Array<{
    productId: number
    quantity: number
    unitPrice: number
  }>) {
    return await db.transaction(async (tx) => {
      // Crear la orden
      const [newOrder] = await tx.insert(orders).values(orderData).returning()

      // Crear los items de la orden
      const orderItemsData: NewOrderItem[] = []
      
      for (const item of items) {
        // Obtener información del producto
        const product = await ProductService.getById(item.productId)
        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`)
        }

        // Verificar stock disponible
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`)
        }

        // Reducir stock del producto
        await ProductService.reduceStock(item.productId, item.quantity)

        // Preparar item de orden
        orderItemsData.push({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          totalPrice: (item.unitPrice * item.quantity).toString(),
          productName: product.name,
          productAuthor: product.author,
        })
      }

      // Insertar items de la orden
      await tx.insert(orderItems).values(orderItemsData)

      return newOrder
    })
  }

  // Obtener orden por ID
  static async getById(id: number) {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)

    if (!result[0]) return null

    // Obtener items de la orden
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id))

    return {
      ...result[0],
      items
    }
  }

  // Obtener orden por referencia externa (Mercado Pago)
  static async getByExternalReference(externalReference: string) {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.externalReference, externalReference))
      .limit(1)

    if (!result[0]) return null

    // Obtener items de la orden
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, result[0].id))

    return {
      ...result[0],
      items
    }
  }

  // Obtener todas las órdenes con filtros
  static async getAll(filters?: {
    status?: string
    dateFrom?: Date
    dateTo?: Date
    payerEmail?: string
    limit?: number
    offset?: number
  }) {
    let query = db.select().from(orders)

    // Aplicar filtros
    const conditions = []
    
    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status))
    }
    
    if (filters?.dateFrom) {
      conditions.push(gte(orders.createdAt, filters.dateFrom))
    }
    
    if (filters?.dateTo) {
      conditions.push(lte(orders.createdAt, filters.dateTo))
    }
    
    if (filters?.payerEmail) {
      conditions.push(eq(orders.payerEmail, filters.payerEmail))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    // Ordenar por fecha de creación (más recientes primero)
    query = query.orderBy(desc(orders.createdAt))

    // Aplicar paginación
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset)
    }

    return await query
  }

  // Actualizar estado de orden
  static async updateStatus(id: number, status: string, paymentData?: {
    mercadoPagoId?: string
    paymentMethod?: string
    paymentType?: string
    transactionAmount?: number
    netReceivedAmount?: number
    totalPaidAmount?: number
    feeDetails?: Record<string, unknown>
    dateApproved?: Date
  }) {
    const updateData: Record<string, unknown> = {
      status,
      lastModified: new Date(),
      updatedAt: new Date(),
    }

    if (paymentData) {
      Object.assign(updateData, paymentData)
    }

    const result = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning()

    return result[0] || null
  }

  // Actualizar orden por referencia externa
  static async updateByExternalReference(externalReference: string, status: string, paymentData?: Record<string, unknown>) {
    const updateData: Record<string, unknown> = {
      status,
      lastModified: new Date(),
      updatedAt: new Date(),
    }

    if (paymentData) {
      Object.assign(updateData, paymentData)
    }

    const result = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.externalReference, externalReference))
      .returning()

    return result[0] || null
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

    // Total de órdenes
    const totalOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereClause)

    // Órdenes por estado
    const ordersByStatus = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
        total: sql<number>`sum(${orders.total}::numeric)`
      })
      .from(orders)
      .where(whereClause)
      .groupBy(orders.status)

    // Ingresos totales
    const totalRevenue = await db
      .select({ 
        total: sql<number>`sum(${orders.total}::numeric)` 
      })
      .from(orders)
      .where(
        whereClause 
          ? and(whereClause, eq(orders.status, 'approved'))
          : eq(orders.status, 'approved')
      )

    // Orden promedio
    const averageOrder = await db
      .select({ 
        average: sql<number>`avg(${orders.total}::numeric)` 
      })
      .from(orders)
      .where(
        whereClause 
          ? and(whereClause, eq(orders.status, 'approved'))
          : eq(orders.status, 'approved')
      )

    return {
      totalOrders: totalOrders[0]?.count || 0,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.status] = {
          count: item.count,
          total: item.total || 0
        }
        return acc
      }, {} as Record<string, { count: number; total: number }>),
      totalRevenue: totalRevenue[0]?.total || 0,
      averageOrderValue: averageOrder[0]?.average || 0,
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

  // Obtener top productos vendidos
  static async getTopProducts(limit = 10, dateFrom?: Date, dateTo?: Date) {
    let query = db
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

    if (dateFrom || dateTo) {
      const conditions = [eq(orders.status, 'approved')]
      
      if (dateFrom) {
        conditions.push(gte(orders.createdAt, dateFrom))
      }
      
      if (dateTo) {
        conditions.push(lte(orders.createdAt, dateTo))
      }

      query = query.where(and(...conditions))
    }

    return await query
  }

  // Cancelar orden
  static async cancel(id: number) {
    return await db.transaction(async (tx) => {
      // Obtener la orden con sus items
      const order = await OrderService.getById(id)
      if (!order) {
        throw new Error('Orden no encontrada')
      }

      if (order.status === 'cancelled') {
        throw new Error('La orden ya está cancelada')
      }

      // Restaurar stock de los productos
      for (const item of order.items) {
        await ProductService.updateStock(item.productId, item.quantity)
      }

      // Actualizar estado de la orden
      const result = await tx
        .update(orders)
        .set({
          status: 'cancelled',
          lastModified: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(orders.id, id))
        .returning()

      return result[0]
    })
  }
}