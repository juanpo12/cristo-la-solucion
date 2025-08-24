"use client"

import { useState } from 'react'
import type { CartItem } from '@/lib/mercadopago'

interface PayerInfo {
  name?: string
  surname?: string
  email?: string
  phone?: {
    area_code?: string
    number?: string
  }
}

interface UseMercadoPagoReturn {
  isLoading: boolean
  error: string | null
  createPayment: (items: CartItem[], payer?: PayerInfo) => Promise<string | null>
}

export function useMercadoPago(): UseMercadoPagoReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPayment = async (items: CartItem[], payer?: PayerInfo): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          payer
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la preferencia de pago')
      }

      const data = await response.json()
      
      // Usar init_point para producción
      const paymentUrl = data.init_point

      return paymentUrl
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error creating payment:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    createPayment
  }
}