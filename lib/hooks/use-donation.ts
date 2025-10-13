import { useState } from 'react'

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

interface DonationResponse {
  init_point: string
  id: string
}

export function useDonation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDonation = async (donationData: DonationData): Promise<DonationResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/mercadopago/create-donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la donación')
      }

      const data: DonationResponse = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error creating donation:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const redirectToDonation = async (amount: number, payerInfo?: DonationData['payer']) => {
    const donationData: DonationData = {
      amount,
      payer: payerInfo
    }

    const result = await createDonation(donationData)
    
    if (result?.init_point) {
      // Redirigir a MercadoPago
      window.location.href = result.init_point
    }
  }

  return {
    createDonation,
    redirectToDonation,
    isLoading,
    error
  }
}