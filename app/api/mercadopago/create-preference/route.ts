import { NextRequest, NextResponse } from 'next/server'
import { createPreference, type CreatePreferenceData } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body: CreatePreferenceData = await request.json()

    console.log('Received request body:', JSON.stringify(body, null, 2))

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error('MERCADOPAGO_ACCESS_TOKEN not configured')
      return NextResponse.json(
        { error: 'Mercado Pago not configured' },
        { status: 500 }
      )
    }

    const preference = await createPreference(body)

    console.log('Preference created successfully:', preference.id)

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point
    })
  } catch (error: any) {
    console.error('Error creating preference:', error)
    
    // Proporcionar más detalles del error
    const errorMessage = error?.message || 'Failed to create preference'
    const errorDetails = error?.cause || error?.response?.data || error
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}