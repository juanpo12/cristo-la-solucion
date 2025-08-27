'use client'

import { useState } from 'react'

export interface PrayerFormData {
  name: string
  lastName: string
  email?: string
  phone?: string
  category: string
  message: string
}

export function usePrayerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitPrayer = async (data: PrayerFormData) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/prayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar la petición de oración')
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setError(null)
  }

  return {
    submitPrayer,
    isLoading,
    isSuccess,
    error,
    resetForm
  }
}