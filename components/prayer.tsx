'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChurchIcon as Praying, Heart, Users, Star, CheckCircle, AlertCircle } from "lucide-react"
import { usePrayerForm, type PrayerFormData } from '@/lib/hooks/use-prayer-form'

const prayerCategories = [
  { name: "Sanidad", icon: Heart, color: "bg-red-100 text-red-600" },
  { name: "Familia", icon: Users, color: "bg-green-100 text-green-600" },
  { name: "Trabajo", icon: Star, color: "bg-blue-100 text-blue-600" },
  { name: "Ministerio", icon: Praying, color: "bg-purple-100 text-purple-600" },
]

export function Prayer() {
  const { submitPrayer, isLoading, isSuccess, error, resetForm } = usePrayerForm()
  const [formData, setFormData] = useState<PrayerFormData>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    category: '',
    message: ''
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const handleInputChange = (field: keyof PrayerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    handleInputChange('category', category)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.lastName || !formData.category || !formData.message) {
      return
    }
    
    await submitPrayer(formData)
    
    if (!error) {
      // Reset form on success
      setFormData({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        category: '',
        message: ''
      })
      setSelectedCategory('')
    }
  }

  const handleNewPrayer = () => {
    resetForm()
    setFormData({
      name: '',
      lastName: '',
      email: '',
      phone: '',
      category: '',
      message: ''
    })
    setSelectedCategory('')
  }

  return (
    <section id="oracion" className="py-20 bg-gradient-to-br from-church-electric-50 to-blue-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold church-text mb-10">PETICIONES DE ORACIÓN</h2>
            <p className="text-xl church-text-muted leading-relaxed max-w-4xl mx-auto">
              Creemos en el poder de la oración. Comparte tu petición con nosotros y permítenos acompañarte en oración.
              Juntos llevamos tus necesidades ante el trono de la gracia.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Card className="church-card shadow-xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-church-electric-500 to-church-electric-600 rounded-full flex items-center justify-center">
                      <Praying className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="church-text text-2xl">Envía tu petición</CardTitle>
                      <CardDescription className="church-text-muted text-lg">
                        Oraremos por vos con amor y fe
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isSuccess ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold church-text mb-2">¡Petición Enviada!</h3>
                      <p className="church-text-muted mb-6">
                        Tu petición de oración ha sido recibida. Estaremos orando por vos.
                      </p>
                      <Button 
                        onClick={handleNewPrayer}
                        className="church-button-primary"
                      >
                        Enviar Nueva Petición
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="Nombre" 
                          className="church-card h-12" 
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                        <Input 
                          placeholder="Apellido" 
                          className="church-card h-12" 
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        className="church-card h-12" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      <Input 
                        placeholder="Teléfono (opcional)" 
                        className="church-card h-12" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />

                      <div>
                        <label className="block text-sm font-semibold church-text mb-3">Categoría de oración: *</label>
                        <div className="flex flex-wrap gap-2">
                          {prayerCategories.map((category) => (
                            <Badge
                              key={category.name}
                              variant="secondary"
                              className={`${
                                selectedCategory === category.name 
                                  ? 'bg-church-electric-500 text-white' 
                                  : category.color
                              } cursor-pointer hover:scale-105 transition-transform duration-200 px-3 py-2`}
                              onClick={() => handleCategorySelect(category.name)}
                            >
                              <category.icon className="w-4 h-4 mr-2" />
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Textarea 
                        placeholder="Comparte tu petición de oración..." 
                        rows={6} 
                        className="church-card" 
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                      />

                      {error && (
                        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm">{error}</span>
                        </div>
                      )}

                      <Button 
                        type="submit"
                        className="w-full church-button-primary h-12 text-lg font-semibold"
                        disabled={isLoading || !formData.name || !formData.lastName || !formData.category || !formData.message || !selectedCategory || !formData.email} 
                      >
                        {isLoading ? 'Enviando...' : 'Enviar Petición de Oración'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="church-card">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold church-text mb-6">¿Por qué orar juntos?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-church-electric-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Heart className="w-4 h-4 text-church-electric-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold church-text mb-1">Comunión</h4>
                        <p className="church-text-muted">Compartimos las cargas y celebramos juntos las victorias</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-church-electric-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="w-4 h-4 text-church-electric-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold church-text mb-1">Apoyo</h4>
                        <p className="church-text-muted">Nadie camina solo en su jornada de fe</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-church-electric-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Star className="w-4 h-4 text-church-electric-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold church-text mb-1">Poder</h4>
                        <p className="church-text-muted">La oración unida tiene un poder especial ante Dios</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="church-card bg-gradient-to-r from-church-electric-500 to-church-navy-600 text-white hidden">
                <CardContent className="p-8 text-center">
                  <Praying className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-4">Horarios de Oración</h3>
                  <div className="space-y-3 text-lg">
                    <p>
                      <strong>Jueves 20:30 HS</strong> - Reunión de Oración
                    </p>
                    <p>
                      <strong>Domingos 10:30 HS</strong> - Oración Pre-Servicio
                    </p>
                    <p>
                      <strong>Lunes a Viernes 6:00 AM</strong> - Oración Matutina (Online)
                    </p>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
