"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Search, Filter, Calendar, Eye, ExternalLink, Grid, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  isLive: boolean
}

// Videos de ejemplo del Pastor Alfredo Dimiro (en producción vendrían de YouTube API)


const sortOptions = [
  { value: "Más Recientes", label: "Más Recientes" },
  { value: "Más Antiguos", label: "Más Antiguos" },
]

export default function VideosPage() {
  const [videos, setVideos] = useState<PastorVideo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("Más Recientes")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [error, setError] = useState("")
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Filtrar y ordenar videos
  const filteredAndSortedVideos = useMemo(() => {
    const filtered = videos.filter((video) => {
      const matchesSearch = 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Más Recientes":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "Más Antiguos":
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [videos, searchTerm, sortBy])



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // El backend manda el número crudo: se formatea acá, sin pasar por toLocaleString
  // del servidor, que según su idioma usa punto o coma y rompía el parseo.
  const formatViewCount = (count: string) => {
    const num = parseInt(count, 10)
    if (!Number.isFinite(num)) return "0"
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return String(num)
  }

  /**
   * El canal tiene más de mil videos, así que se traen de a 50 con el pageToken
   * de la playlist de subidas. Sin token se arranca de cero; con token se suma
   * a lo que ya está en pantalla.
   */
  const loadVideos = useCallback(async (pageToken?: string) => {
    if (pageToken) setIsLoadingMore(true)
    else setIsLoading(true)
    setError("")

    try {
      const url = pageToken
        ? `/api/youtube/pastor-videos?pageToken=${encodeURIComponent(pageToken)}`
        : '/api/youtube/pastor-videos'
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'No se pudieron cargar los videos')
      }

      setVideos((prev) => {
        if (!pageToken) return data.videos
        // Una recarga puede repetir videos entre páginas: se deduplica por id.
        const seen = new Set(prev.map((v: PastorVideo) => v.id))
        return [...prev, ...data.videos.filter((v: PastorVideo) => !seen.has(v.id))]
      })
      setNextPageToken(data.nextPageToken ?? null)
      setTotalResults(data.totalResults ?? 0)
    } catch (err) {
      console.error('Error cargando videos:', err)
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los videos')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    loadVideos()
  }, [loadVideos])

  // Scroll infinito: cuando el centinela entra en pantalla, se pide la página siguiente.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !nextPageToken || isLoading || isLoadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadVideos(nextPageToken)
      },
      { rootMargin: '400px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [nextPageToken, isLoading, isLoadingMore, loadVideos])

  return (
    <div className="min-h-screen bg-gray-50 pt-20 overflow-x-hidden">
      {/* Header */}
      <div className="relative h-[50vh] overflow-hidden -mt-20">
        <Image 
          src="/color2.jpg" 
          alt="Pastor Alfredo Dimiro" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-r  to-church-navy-600/80" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">TRANSMISIONES</h1>
            <p className="text-lg opacity-80 drop-shadow-md">
              Biblioteca completa de enseñanzas, conferencias y estudios bíblicos
            </p>
          </div>
        </div>
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
              <span>
                {searchTerm
                  ? `${filteredAndSortedVideos.length} de ${videos.length} videos cargados`
                  : totalResults > videos.length
                    ? `${videos.length} de ${totalResults} videos`
                    : `${videos.length} videos`}
              </span>
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

        {searchTerm && nextPageToken ? (
          <p className="mb-4 text-sm text-church-text-muted bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            La búsqueda mira los {videos.length} videos cargados hasta ahora. Seguí bajando para
            cargar el resto del canal.
          </p>
        ) : null}

        {error ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold church-text mb-2">No se pudieron cargar los videos</h3>
            <p className="text-church-text-muted mb-6">{error}</p>
            <Button onClick={() => loadVideos()}>Reintentar</Button>
          </div>
        ) : null}

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
              <Link href={`/videos/${video.id}`} key={video.id} className="block h-full group">
                <Card
                  className={`church-card overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 cursor-pointer bg-white h-full ${
                    viewMode === "list" ? "flex" : "flex flex-col"
                  }`}
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
                  <div className={`absolute bottom-2 right-2 px-2 py-1 rounded text-sm text-white ${
                    video.isLive ? "bg-red-600" : "bg-black/80"
                  }`}>
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
              </Link>
            ))}
          </div>
        )}

        {/* Centinela del scroll infinito + salida manual por si el observer no dispara */}
        {!isLoading && !error && nextPageToken ? (
          <div ref={sentinelRef} className="mt-10 flex justify-center">
            {isLoadingMore ? (
              <div className="flex items-center space-x-3 text-church-text-muted">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-church-electric-600"></div>
                <span>Cargando más videos...</span>
              </div>
            ) : (
              <Button variant="outline" size="lg" onClick={() => loadVideos(nextPageToken)}>
                Cargar más videos
              </Button>
            )}
          </div>
        ) : null}

        {!isLoading && !error && !nextPageToken && videos.length > 0 ? (
          <p className="mt-10 text-center text-church-text-muted">
            Ya viste los {videos.length} videos del canal.
          </p>
        ) : null}

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
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 md:text-lg">
              <Play className="w-6 h-6 mr-3" />
              Suscribirse a @AlfredoDimiroLive
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}