"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play, Search, Filter, Calendar, Eye, Clock, ExternalLink, Grid, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { YouTubePlayer } from "@/components/youtube-player"

interface PastorVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  duration: string
  viewCount: string
  url: string
  category: string
}

// Videos de ejemplo del Pastor Alfredo Dimiro (en producción vendrían de YouTube API)


const categories = ["Todos", "Enseñanza", "Conferencia", "Serie", "Estudio Bíblico"]
const sortOptions = [
  { value: "newest", label: "Más Recientes" },
  { value: "oldest", label: "Más Antiguos" },
  { value: "most-viewed", label: "Más Vistos" },
  { value: "duration-long", label: "Más Largos" },
  { value: "duration-short", label: "Más Cortos" }
]

export default function VideosPage() {
  const [videos, setVideos] = useState<PastorVideo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedVideo, setSelectedVideo] = useState<PastorVideo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  console.log(setIsLoading);
  console.log(setVideos);
  
  

  // Filtrar y ordenar videos
  const filteredAndSortedVideos = useMemo(() => {
    const filtered = videos.filter((video) => {
      const matchesSearch = 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "Todos" || video.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "oldest":
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        case "most-viewed":
          return parseInt(b.viewCount.replace(/,/g, '')) - parseInt(a.viewCount.replace(/,/g, ''))
        case "duration-long":
          return parseDuration(b.duration) - parseDuration(a.duration)
        case "duration-short":
          return parseDuration(a.duration) - parseDuration(b.duration)
        default:
          return 0
      }
    })

    return filtered
  }, [videos, searchTerm, selectedCategory, sortBy])

  // Función para convertir duración a segundos
  const parseDuration = (duration: string): number => {
    const parts = duration.split(':').map(Number)
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    }
    return 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatViewCount = (count: string) => {
    const num = parseInt(count.replace(/,/g, ''))
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return count
  }

  // Cargar videos reales de YouTube API (opcional)
    const loadVideosFromAPI = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/youtube/pastor-videos')
        if (response.ok) {
          const data = await response.json()
          setVideos(data.videos)
        }
      } catch (error) {
        console.error('Error cargando videos:', error)
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    // Cargar videos reales si la API está disponible
    loadVideosFromAPI()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="relative h-[50vh] overflow-hidden -mt-20">
        <Image 
          src="/youtube.png" 
          alt="Pastor Alfredo Dimiro" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-church-electric-600/80 to-church-navy-600/80" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">Transmisiones</h1>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-md mb-4">
              Pastor Alfredo Dimiro
            </p>
            <p className="text-lg opacity-80 drop-shadow-md">
              Biblioteca completa de enseñanzas, conferencias y estudios bíblicos
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      {/* Controles y Filtros */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Búsqueda */}
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar videos, temas, palabras clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base sm:text-lg border-2 border-gray-200 focus:border-church-electric-400 w-full"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 h-12">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 h-12">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Modo de Vista */}
              <div className="flex border border-gray-200 rounded-lg w-fit">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-church-text-muted">
              <Filter className="w-5 h-5" />
              <span>{filteredAndSortedVideos.length} videos encontrados</span>
            </div>
            <Link 
              href="https://youtube.com/@AlfredoDimiroLive" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Ver Canal Completo</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Videos */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-church-electric-600 mx-auto mb-4"></div>
            <p className="text-church-text-muted">Cargando videos...</p>
          </div>
        ) : filteredAndSortedVideos.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold church-text mb-2">No se encontraron videos</h3>
            <p className="text-church-text-muted">
              Intenta con otros términos de búsqueda o selecciona una categoría diferente
            </p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
            : "space-y-4"
          }>
            {filteredAndSortedVideos.map((video) => (
              <Card
                key={video.id}
                className={`church-card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-white ${
                  viewMode === "list" ? "flex" : ""
                }`}
                onClick={() => setSelectedVideo(video)}
              >
                <div className={`relative ${viewMode === "list" ? "w-full sm:w-80 flex-shrink-0" : "aspect-video"}`}>
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

                <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <h4 className="font-bold church-text text-lg mb-2 line-clamp-2 leading-tight">
                    {video.title}
                  </h4>
                  <p className={`church-text-muted text-sm mb-4 ${viewMode === "list" ? "line-clamp-3" : "line-clamp-2"}`}>
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
        )}

        {/* Modal de Video */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => {
              // Solo cerrar si se hace clic fuera del contenido del modal
              if (e.target === e.currentTarget) {
                setSelectedVideo(null);
              }
            }}
          >
            <div 
              className="bg-white rounded-lg sm:rounded-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-2xl font-bold church-text">Detalles del Video</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedVideo(null)}
                    className="rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 sm:mb-6 relative">
                  {/* Reproductor de YouTube */}
                  {selectedVideo.url && selectedVideo.url !== '#' ? (
                    <div key={selectedVideo.id} className="absolute inset-0">
                      <YouTubePlayer 
                        videoId={selectedVideo.url || selectedVideo.id} 
                        className="rounded-lg overflow-hidden w-full h-full"
                        autoplay={true}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                      <div className="text-center text-gray-600">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-medium mb-2">Video no disponible</p>
                        <p className="text-sm">Este video aún no está configurado</p>
                      </div>
                    </div>
                  )}
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
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-church-text-muted">
                      <Clock className="w-4 h-4" />
                      <span>{selectedVideo.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-church-text-muted">
                      <Eye className="w-4 h-4" />
                      <span>{selectedVideo.viewCount} vistas</span>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold church-text">{selectedVideo.title}</h4>
                  <p className="church-text-muted leading-relaxed">{selectedVideo.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-church-electric-500 to-church-navy-600 rounded-2xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-4">¡Suscríbete al Canal del Pastor!</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            No te pierdas ninguna enseñanza del Pastor Alfredo Dimiro. 
            Mantente al día con todas sus conferencias y estudios bíblicos.
          </p>
          <Link 
            href="https://youtube.com/@AlfredoDimiroLive?sub_confirmation=1" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg">
              <Play className="w-6 h-6 mr-3" />
              Suscribirse a @AlfredoDimiroLive
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}