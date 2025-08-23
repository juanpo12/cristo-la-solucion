"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, ExternalLink, Calendar, Eye, Radio } from "lucide-react"
import Link from "next/link"
import { YouTubePlayer } from "./youtube-player"

// Tipos para los videos de YouTube
interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  duration: string
  viewCount: string
  url: string
}

interface LiveStream {
  isLive: boolean
  title?: string
  description?: string
  thumbnail?: string
  url?: string
  viewerCount?: string
}

// Videos iniciales (se reemplazarán con datos de la API)
const initialVideos: YouTubeVideo[] = [
  {
    id: "1",
    title: "El Poder de la Oración - Pastor Alfredo Dimiro",
    description: "Una enseñanza profunda sobre cómo la oración transforma nuestras vidas y nos conecta con Dios de manera íntima.",
    thumbnail: "/CONFE.jpg",
    publishedAt: "2024-01-15",
    duration: "45:30",
    viewCount: "1,234",
    url: "https://youtube.com/watch?v=ejemplo1"
  },
  {
    id: "2",
    title: "Invictos Kids - Historias Bíblicas",
    description: "Los niños aprenden sobre David y Goliat de una manera divertida e interactiva.",
    thumbnail: "/CONFE.jpg",
    publishedAt: "2024-01-10",
    duration: "25:15",
    viewCount: "856",
    url: "https://youtube.com/watch?v=ejemplo2"
  },
  {
    id: "3",
    title: "Conferencia Especial - La Fe que Transforma",
    description: "Una conferencia especial sobre cómo la fe puede transformar completamente nuestras vidas.",
    thumbnail: "/CONFE.jpg",
    publishedAt: "2024-01-05",
    duration: "1:15:20",
    viewCount: "2,145",
    url: "https://youtube.com/watch?v=ejemplo3"
  }
]

export function YouTubeSection() {
  const [liveStream, setLiveStream] = useState<LiveStream>({ isLive: false })
  const [videos, setVideos] = useState<YouTubeVideo[]>(initialVideos)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)

  // Función para verificar si hay stream en vivo
  const checkLiveStream = async () => {
    try {
      // Llamada a la API de YouTube
      const response = await fetch('/api/youtube?action=live-status')
      if (response.ok) {
        const data = await response.json()
        setLiveStream(data.liveStream)
      } else {
        setLiveStream({ isLive: false })
      }
    } catch (error) {
      console.error('Error verificando stream en vivo:', error)
      setLiveStream({ isLive: false })
    }
  }

  // Cargar videos y verificar stream en vivo al cargar
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetch('/api/youtube')
        if (response.ok) {
          const data = await response.json()
          if (data.videos && data.videos.length > 0) {
            setVideos(data.videos)
          }
          if (data.liveStream) {
            setLiveStream(data.liveStream)
          }
        }
      } catch (error) {
        console.error('Error cargando videos:', error)
      }
    }

    loadVideos()
    
    // Verificar stream en vivo cada 2 minutos
    const interval = setInterval(checkLiveStream, 120000) // 2 minutos
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatViewCount = (count: string) => {
    const num = parseInt(count.replace(/,/g, ''))
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return count
  }

  return (
    <section id="videos" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold church-text mb-6">NUESTRO CANAL</h2>
          <p className="text-xl church-text-muted max-w-3xl mx-auto leading-relaxed">
            Mantente conectado con nuestras enseñanzas, eventos especiales y transmisiones en vivo
          </p>
        </div>

        {/* Stream en Vivo */}
        {liveStream.isLive && (
          <div className="mb-16">
            <Card className="church-card overflow-hidden border-2 border-red-500 shadow-2xl">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      <span className="font-bold text-lg">EN VIVO</span>
                    </div>
                    {liveStream.viewerCount && (
                      <div className="flex items-center space-x-1 text-red-100">
                        <Eye className="w-4 h-4" />
                        <span>{liveStream.viewerCount} viendo</span>
                      </div>
                    )}
                  </div>
                  <Radio className="w-6 h-6" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-video">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${liveStream.thumbnail}')` }}
                  />
                  <div 
                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer"
                    onClick={() => setSelectedVideo({
                      id: liveStream.url?.split('v=')[1] || 'live',
                      title: liveStream.title || '🔴 EN VIVO',
                      description: liveStream.description || 'Transmisión en vivo',
                      thumbnail: liveStream.thumbnail || '',
                      publishedAt: new Date().toISOString(),
                      duration: 'EN VIVO',
                      viewCount: liveStream.viewerCount || '0',
                      url: liveStream.url || ''
                    })}
                  >
                    <div className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110">
                      <Play className="w-8 h-8 fill-current" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold church-text mb-4">{liveStream.title}</h3>
                  <p className="church-text-muted mb-6 leading-relaxed">{liveStream.description}</p>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setSelectedVideo({
                      id: liveStream.url?.split('v=')[1] || 'live',
                      title: liveStream.title || '🔴 EN VIVO',
                      description: liveStream.description || 'Transmisión en vivo',
                      thumbnail: liveStream.thumbnail || '',
                      publishedAt: new Date().toISOString(),
                      duration: 'EN VIVO',
                      viewCount: liveStream.viewerCount || '0',
                      url: liveStream.url || ''
                    })}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Ver Transmisión en Vivo
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Videos Recientes */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold church-text">Videos Recientes</h3>
            <Link 
              href="https://youtube.com/@cristolasolucion" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Ver Canal Completo</span>
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="church-card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => {
                  console.log('Video seleccionado:', video);
                  setSelectedVideo(video);
                }}
              >
                <div className="relative aspect-video">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${video.thumbnail}')` }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 p-3 rounded-full">
                      <Play className="w-6 h-6 text-church-electric-600 fill-current" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>

                <CardContent className="p-6">
                  <h4 className="font-bold church-text text-lg mb-2 line-clamp-2 leading-tight">
                    {video.title}
                  </h4>
                  <p className="church-text-muted text-sm mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs church-text-muted">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatViewCount(video.viewCount)} vistas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Modal de Video */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              // Solo cerrar si se hace clic fuera del contenido del modal
              if (e.target === e.currentTarget) {
                setSelectedVideo(null);
              }
            }}
          >
            <div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold church-text">Ver Video</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedVideo(null)}
                    className="rounded-full"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="aspect-video bg-gray-100 rounded-lg mb-4">
                  {/* Reproductor de YouTube */}
                  <div key={selectedVideo.id}>
                    <YouTubePlayer 
                      videoId={selectedVideo.url || selectedVideo.id} 
                      className="rounded-lg overflow-hidden"
                      autoplay={true}
                    />
                  </div>
                </div>
                <div className="flex justify-end mb-4">
                  <Link 
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver en YouTube
                    </Button>
                  </Link>
                </div>
                
                <h4 className="text-xl font-bold church-text mb-2">{selectedVideo.title}</h4>
                <p className="church-text-muted leading-relaxed">{selectedVideo.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-church-electric-500 to-church-navy-600 rounded-2xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-4">¡Explora Más Contenido!</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            No te pierdas ninguna enseñanza, evento especial o transmisión en vivo. 
            Mantente conectado con nuestra comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/videos">
              <Button size="lg" className="bg-white text-church-electric-600 hover:bg-gray-100 px-8 py-4 text-lg">
                <Play className="w-6 h-6 mr-3" />
                Videos del Pastor
              </Button>
            </Link>
            <Link 
              href="https://youtube.com/@cristolasolucion?sub_confirmation=1" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg">
                <ExternalLink className="w-6 h-6 mr-3" />
                Suscribirse al Canal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}