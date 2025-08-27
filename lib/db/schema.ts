import { pgTable, serial, varchar, text, decimal, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Tabla de productos
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  category: varchar('category', { length: 100 }).notNull().default('books'),
  image: text('image'),
  featured: boolean('featured').default(false),
  active: boolean('active').default(true),
  stock: integer('stock').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer('review_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Tabla de órdenes
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  externalReference: varchar('external_reference', { length: 255 }).unique(),
  mercadoPagoId: varchar('mercado_pago_id', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, approved, rejected, cancelled
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('ARS'),
  payerEmail: varchar('payer_email', { length: 255 }),
  payerName: varchar('payer_name', { length: 255 }),
  payerSurname: varchar('payer_surname', { length: 255 }),
  payerPhone: varchar('payer_phone', { length: 50 }),
  items: jsonb('items').notNull(), // Array de items del pedido
  paymentMethod: varchar('payment_method', { length: 100 }),
  paymentType: varchar('payment_type', { length: 100 }),
  transactionAmount: decimal('transaction_amount', { precision: 10, scale: 2 }),
  netReceivedAmount: decimal('net_received_amount', { precision: 10, scale: 2 }),
  totalPaidAmount: decimal('total_paid_amount', { precision: 10, scale: 2 }),
  feeDetails: jsonb('fee_details'),
  dateApproved: timestamp('date_approved'),
  dateCreated: timestamp('date_created'),
  lastModified: timestamp('last_modified'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Tabla de items de orden (relación muchos a muchos entre orders y products)
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(), // Snapshot del nombre
  productAuthor: varchar('product_author', { length: 255 }).notNull(), // Snapshot del autor
  createdAt: timestamp('created_at').defaultNow(),
})

// Tabla de categorías
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Admin users are now managed through Supabase Auth
// Users with admin role have user_metadata.role = 'admin' or 'superadmin'

// Tabla de contactos/peticiones
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull().default('general'), // general, prayer, pastoral, group
  status: varchar('status', { length: 50 }).default('pending'), // pending, read, responded, closed
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Tabla de configuración de la tienda
export const storeConfig = pgTable('store_config', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
  type: varchar('type', { length: 50 }).default('string'), // string, number, boolean, json
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Schemas de validación con Zod
export const insertProductSchema = createInsertSchema(products, {
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal with up to 2 decimal places"),
  originalPrice: z.string().optional().nullable().refine(
    (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
    "Original price must be a valid decimal with up to 2 decimal places"
  ),
  stock: z.number().int().min(0),
  rating: z.string().optional().nullable().refine(
    (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
    "Rating must be a valid decimal with up to 2 decimal places"
  ).transform((val) => val || "0"),
})

export const selectProductSchema = createSelectSchema(products)

export const insertOrderSchema = createInsertSchema(orders, {
  total: z.string().transform((val) => parseFloat(val)),
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    author: z.string(),
    price: z.number(),
    quantity: z.number(),
    image: z.string().optional(),
  })),
})

export const selectOrderSchema = createSelectSchema(orders)

export const insertCategorySchema = createInsertSchema(categories)
export const selectCategorySchema = createSelectSchema(categories)

// Admin user schemas removed - using Supabase Auth

export const insertContactSchema = createInsertSchema(contacts, {
  email: z.string().email("Email must be valid"),
  type: z.enum(['general', 'prayer', 'pastoral', 'group']),
  status: z.enum(['pending', 'read', 'responded', 'closed']).optional(),
})
export const selectContactSchema = createSelectSchema(contacts)

export const insertStoreConfigSchema = createInsertSchema(storeConfig)
export const selectStoreConfigSchema = createSelectSchema(storeConfig)

// Tipos TypeScript
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert
export type StoreConfig = typeof storeConfig.$inferSelect
export type NewStoreConfig = typeof storeConfig.$inferInsert
// AdminUser types removed - using Supabase Auth types