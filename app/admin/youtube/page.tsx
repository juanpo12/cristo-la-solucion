"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Radio, RadioOff, Play, Eye, Settings, Save, AlertCircle } from "lucide-react"

interface LiveStreamData {
  isLive: boolean
  title?: string
  description?: string
  thumbnail?: string
  url?: string
  viewerCount?: string
}

export default function YouTubeAdminPage() {
  const [liveStream, setLiveStream] = useState<LiveStreamData>({ isLive: false })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [adminToken, setAdminToken] = useState("")
  
  // Formulario para stream manual
  const [streamForm, setStreamForm] = useState({
    title: "🔴 CULTO EN VIVO - Cristo La Solución",
    description: "Únete a nosotros en este momento especial de adoración y enseñanza de la Palabra de Dios.",
    url: "https://youtube.com/watch?v=",
    thumbnail: "/frente.jpg"
  })

  // Verificar estado actual del stream
  const checkStreamStatus = async () => {
    try {
      const response = await fetch('/api/youtube?action=live-status')
      const data = await response.json()
      setLiveStream(data.liveStream)
    } catch (error) {
      console.error('Error verificando estado del stream:', error)
    }
  }

  // Activar stream manualmente
  const startStream = async () => {
    if (!adminToken) {
      setMessage("Token de administrador requerido")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          action: 'start-stream',
          streamData: streamForm
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage("Stream activado exitosamente")
        setLiveStream({
          isLive: true,
          ...streamForm
        })
      } else {
        setMessage(data.error || "Error activando stream")
      }
    } catch (error) {
      setMessage("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  // Desactivar stream
  const stopStream = async () => {
    if (!adminToken) {
      setMessage("Token de administrador requerido")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          action: 'stop-stream'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage("Stream desactivado exitosamente")
        setLiveStream({ isLive: false })
      } else {
        setMessage(data.error || "Error desactivando stream")
      }
    } catch (error) {
      setMessage("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStreamStatus()
    // Verificar cada 30 segundos
    const interval = setInterval(checkStreamStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold church-text mb-4">Panel de YouTube</h1>
            <p className="text-xl church-text-muted">
              Administra las transmisiones en vivo y el contenido del canal
            </p>
          </div>

          {/* Estado Actual */}
          <Card className="church-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Settings className="w-6 h-6" />
                <span>Estado Actual del Stream</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {liveStream.isLive ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <Badge className="bg-red-500 text-white">EN VIVO</Badge>
                      </div>
                      {liveStream.viewerCount && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span>{liveStream.viewerCount} viendo</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <RadioOff className="w-5 h-5 text-gray-400" />
                      <Badge variant="outline">DESCONECTADO</Badge>
                    </div>
                  )}
                </div>
                <Button onClick={checkStreamStatus} variant="outline" size="sm">
                  Actualizar Estado
                </Button>
              </div>
              
              {liveStream.isLive && liveStream.title && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-800">{liveStream.title}</h3>
                  <p className="text-red-600 text-sm mt-1">{liveStream.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token de Administrador */}
          <Card className="church-card mb-8">
            <CardHeader>
              <CardTitle>Autenticación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold church-text mb-2">
                    Token de Administrador
                  </label>
                  <Input
                    type="password"
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    placeholder="Ingresa el token de administrador"
                    className="w-full"
                  />
                </div>
                {message && (
                  <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{message}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuración del Stream */}
          <Card className="church-card mb-8">
            <CardHeader>
              <CardTitle>Configurar Stream en Vivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold church-text mb-2">
                    Título del Stream
                  </label>
                  <Input
                    value={streamForm.title}
                    onChange={(e) => setStreamForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título que aparecerá en el stream"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold church-text mb-2">
                    Descripción
                  </label>
                  <Textarea
                    value={streamForm.description}
                    onChange={(e) => setStreamForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción del stream"
                    rows={3}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold church-text mb-2">
                    URL del Stream de YouTube
                  </label>
                  <Input
                    value={streamForm.url}
                    onChange={(e) => setStreamForm(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold church-text mb-2">
                    Imagen de Portada (URL)
                  </label>
                  <Input
                    value={streamForm.thumbnail}
                    onChange={(e) => setStreamForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                    placeholder="/ruta/a/imagen.jpg"
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controles del Stream */}
          <Card className="church-card">
            <CardHeader>
              <CardTitle>Controles del Stream</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                {!liveStream.isLive ? (
                  <Button
                    onClick={startStream}
                    disabled={isLoading || !adminToken}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Radio className="w-5 h-5 mr-2" />
                    {isLoading ? "Activando..." : "Activar Stream"}
                  </Button>
                ) : (
                  <Button
                    onClick={stopStream}
                    disabled={isLoading || !adminToken}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <RadioOff className="w-5 h-5 mr-2" />
                    {isLoading ? "Desactivando..." : "Desactivar Stream"}
                  </Button>
                )}
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Instrucciones:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Asegúrate de tener el token de administrador correcto</li>
                      <li>Configura la URL del stream de YouTube antes de activar</li>
                      <li>El stream aparecerá automáticamente en la página principal</li>
                      <li>Los usuarios verán la notificación "EN VIVO" cuando esté activo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}