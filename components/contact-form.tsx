"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useContactForm, ContactFormData } from '@/lib/hooks/use-contact-form'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ContactFormProps {
  title?: string
  defaultType?: ContactFormData['type']
  className?: string
}

export function ContactForm({ 
  title = "Envía tu Petición", 
  defaultType = 'general',
  className = ""
}: ContactFormProps) {
  const { submitForm, resetForm, isLoading, isSuccess, error } = useContactForm()
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: defaultType
  })

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await submitForm(formData)
    
    if (result.success) {
      // Limpiar formulario después del éxito
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: defaultType
      })
    }
  }

  const handleReset = () => {
    resetForm()
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      type: defaultType
    })
  }

  if (isSuccess) {
    return (
      <Card className={`church-card ${className}`}>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold church-text mb-4">¡Petición Enviada!</h3>
          <p className="text-church-text-muted mb-6 leading-relaxed">
            Tu petición ha sido enviada exitosamente. Nos pondremos en contacto contigo pronto.
          </p>
          <Button onClick={handleReset} className="church-button-primary">
            Enviar Otra Petición
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`church-card ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl church-text text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Petición */}
          <div>
            <label className="block text-sm font-semibold church-text mb-2">
              Tipo de Petición
            </label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleInputChange('type', value as string)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona el tipo de petición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Consulta General</SelectItem>
                <SelectItem value="prayer">Petición de Oración</SelectItem>
                <SelectItem value="pastoral">Consejería Pastoral</SelectItem>
                <SelectItem value="group">Información de Grupos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold church-text mb-2">
              Nombre Completo *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Tu nombre completo"
              required
              className="w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold church-text mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold church-text mb-2">
              Teléfono (Opcional)
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+54 9 11 1234-5678"
              className="w-full"
            />
          </div>

          {/* Asunto */}
          <div>
            <label className="block text-sm font-semibold church-text mb-2">
              Asunto (Opcional)
            </label>
            <Input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Breve descripción del tema"
              className="w-full"
            />
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-sm font-semibold church-text mb-2">
              Mensaje *
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Escribe tu petición, consulta o mensaje aquí..."
              required
              rows={5}
              className="w-full resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !formData.name || !formData.email || !formData.message}
            className="w-full church-button-primary h-12 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Petición
              </>
            )}
          </Button>

          <p className="text-sm text-church-text-muted text-center">
            * Campos requeridos. Tu información será tratada con confidencialidad.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}