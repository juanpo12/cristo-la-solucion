'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HeartHandshake, CheckCircle, AlertCircle } from "lucide-react"

interface VolunteerFormData {
  nombre: string
  apellido: string
  fechaNacimiento: string
  email: string
  telefono: string
}

const emptyForm: VolunteerFormData = {
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  email: '',
  telefono: '',
}

export function Volunteering() {
  const [formData, setFormData] = useState<VolunteerFormData>(emptyForm)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (field: keyof VolunteerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Feedback inmediato: el año lo escriben a mano y es fácil tipear mal (ej. 1071)
  const birthdateError = (() => {
    if (formData.fechaNacimiento === '') return null
    const fecha = new Date(`${formData.fechaNacimiento}T00:00:00`)
    if (isNaN(fecha.getTime()) || fecha.getFullYear() < 1900) {
      return `Revisá el año: ${formData.fechaNacimiento.split('-')[0]} no parece correcto.`
    }
    if (fecha >= new Date()) {
      return 'La fecha de nacimiento no puede ser futura.'
    }
    return null
  })()

  const hasContact = formData.email.trim() !== '' || formData.telefono.trim() !== ''
  const isComplete = formData.nombre.trim() !== '' && formData.apellido.trim() !== ''
    && formData.fechaNacimiento !== '' && !birthdateError && hasContact

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isComplete) {
      setStatus('error')
      setErrorMessage('Completá tus datos y dejanos al menos un correo o un teléfono.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'No pudimos enviar tus datos. Intentá de nuevo.')
      }

      setStatus('success')
      setFormData(emptyForm)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'No pudimos enviar tus datos. Intentá de nuevo.')
    }
  }

  return (
    <section id="voluntariado" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold church-text mb-10">VOLUNTARIADO</h2>
            <p className="text-xl church-text-muted leading-relaxed">
              ¿No servís en ningún área de la iglesia y te interesa ser parte?
              Dejanos tu contacto y nos comunicamos con vos.
            </p>
          </div>

          <Card className="church-card shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-church-electric-500 to-church-electric-600 rounded-full flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="church-text text-2xl">Quiero ser voluntario</CardTitle>
                  <CardDescription className="church-text-muted text-lg">
                    Contanos quién sos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {status === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold church-text mb-2">¡Gracias por sumarte!</h3>
                  <p className="church-text-muted mb-6">
                    Recibimos tus datos. Pronto alguien del equipo se va a comunicar con vos.
                  </p>
                  <Button onClick={() => setStatus('idle')} className="church-button-primary">
                    Enviar otro registro
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Nombre"
                      className="church-card h-12"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Apellido"
                      className="church-card h-12"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="volunteer-birthdate" className="block text-sm font-semibold church-text mb-2">
                      Fecha de nacimiento *
                    </label>
                    <Input
                      id="volunteer-birthdate"
                      type="date"
                      className={`church-card h-12 ${birthdateError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      min="1900-01-01"
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {birthdateError && (
                      <p className="flex items-center gap-1.5 text-sm text-red-600 mt-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {birthdateError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold church-text mb-2">
                      ¿Cómo te contactamos? Completá al menos uno *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        type="email"
                        placeholder="Correo electrónico"
                        className="church-card h-12"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      <Input
                        type="tel"
                        placeholder="Teléfono"
                        className="church-card h-12"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                      />
                    </div>
                  </div>

                  {status === 'error' && errorMessage && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{errorMessage}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full church-button-primary h-12 text-lg font-semibold"
                    disabled={status === 'loading' || !isComplete}
                  >
                    {status === 'loading' ? 'Enviando...' : 'Quiero sumarme'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
