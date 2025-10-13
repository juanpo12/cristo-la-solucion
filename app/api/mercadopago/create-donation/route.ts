import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configuración de Mercado Pago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!
const client = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
  },
})

const preference = new Preference(client)

interface DonationData {
  amount: number
  payer?: {
    name?: string
    surname?: string
    email?: string
    phone?: {
      area_code?: string
      number?: string
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DonationData = await request.json()

    console.log('Received donation request:', JSON.stringify(body, null, 2))

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Monto de donación inválido' },
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"

    const preferenceData = {
      items: [
        {
          id: 'donation',
          title: 'Donación a Cristo La Solución',
          description: 'Donación para apoyar el ministerio de Cristo La Solución',
          quantity: 1,
          unit_price: body.amount,
          currency_id: 'ARS',
        }
      ],
      back_urls: {
        success: `${baseUrl}/dar/success`,
        failure: `${baseUrl}/dar/failure`,
        pending: `${baseUrl}/dar/pending`,
      },
      auto_return: 'approved',
      statement_descriptor: 'Cristo la Solucion',
      external_reference: `donation_${Date.now()}`,
      notification_url: `${baseUrl}/api/mercadopago/webhook`,
      expires: false,
      binary_mode: false,
    }

    console.log('Creating donation preference with data:', JSON.stringify(preferenceData, null, 2))

    const response = await preference.create({ body: preferenceData })

    console.log('Donation preference created successfully:', response.id)

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      external_reference: response.external_reference
    })
  } catch (error: unknown) {
    console.error('Error creating donation preference:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create donation preference'
    const errorDetails = error instanceof Error ? error.cause : error
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}