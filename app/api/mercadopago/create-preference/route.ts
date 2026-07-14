import { NextRequest, NextResponse } from 'next/server'
import { createPreference } from '@/lib/mercadopago'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/ratelimit'
import { ProductService } from '@/lib/services/products'
import { z } from 'zod'

// El precio y los datos del producto NO se confían desde el cliente:
// solo usamos id + cantidad y recalculamos todo contra la base de datos.
const preferenceSchema = z.object({
  items: z.array(z.object({
    id: z.union([z.number(), z.string()]),
    quantity: z.number().int().positive(),
  })).min(1, "No items provided"),
  payer: z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.object({
      area_code: z.string().optional(),
      number: z.string().optional(),
    }).optional(),
    address: z.object({
      zip_code: z.string().optional(),
      street_name: z.string().optional(),
      street_number: z.number().optional(),
    }).optional(),
  }).optional(),
  customerInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }).optional(),
})

class CheckoutError extends Error {}

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const limitResult = await rateLimit(`mp_pref:${ip}`, 10, 3600) // 10 requests per hour

    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const json = await request.json()
    const body = preferenceSchema.parse(json)

    if (!env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error('MERCADOPAGO_ACCESS_TOKEN not configured')
      return NextResponse.json(
        { error: 'Mercado Pago not configured' },
        { status: 500 }
      )
    }

    // Recalcular cada ítem contra la base: precio, nombre y stock son la fuente de verdad.
    const items = await Promise.all(body.items.map(async (item) => {
      const productId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id
      const product = Number.isFinite(productId) ? await ProductService.getById(productId) : null

      if (!product || !product.active) {
        throw new CheckoutError('Uno de los productos ya no está disponible')
      }
      if ((product.stock ?? 0) < item.quantity) {
        throw new CheckoutError(`Stock insuficiente para "${product.name}"`)
      }

      return {
        id: product.id,
        name: product.name,
        author: product.author,
        price: Number(product.price),
        image: product.image ?? '',
        quantity: item.quantity,
      }
    }))

    const preference = await createPreference({ items, payer: body.payer })

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
      external_reference: preference.external_reference
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('Error creating preference:', error)
    return NextResponse.json(
      { error: 'No se pudo crear la preferencia de pago' },
      { status: 500 }
    )
  }
}
