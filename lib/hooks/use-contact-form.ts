"use client"

import { useState } from 'react'

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  type: 'general' | 'prayer' | 'pastoral' | 'group'
}

export function useContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitForm = async (data: ContactFormData) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el formulario')
      }

      setIsSuccess(true)
      return { success: true, message: result.message }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }

    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setError(null)
    setIsLoading(false)
  }

  return {
    submitForm,
    resetForm,
    isLoading,
    isSuccess,
    error,
  }
}