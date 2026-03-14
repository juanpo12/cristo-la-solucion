"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Eye, Calendar, ExternalLink, Play } from "lucide-react"
import Link from "next/link"
import { YouTubePlayer } from "@/components/youtube-player"
import { Skeleton } from "@/components/ui/skeleton"

export default function VideoDetailPage() {
  const params = useParams()
  const router = useRouter()
  // eslint-disable-next-line
  const videoId = params.id as string

  const [video, setVideo] = useState<any | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/youtube/pastor-videos')
        if (response.ok) {
          const data = await response.json()
          const foundVideo = data.videos.find((v: any) => v.id === videoId)
          if (foundVideo) {
            setVideo(foundVideo)
            // Get related videos (excluding current one)
            const related = data.videos
              .filter((v: any) => v.id !== videoId)
              .slice(0, 15) // Limit roughly to look good on desktop
            setRelatedVideos(related)
          }
        }
      } catch (error) {
        console.error('Error fetching video details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (videoId) {
      fetchVideo()
    }
  }, [videoId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatViewCount = (count: string | number) => {
    if (typeof count === 'string') {
      const num = parseInt(count.replace(/,/g, ''))
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`
      }
      return count
    } else {
        if (count >= 1000000) {
          return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
          return `${(count / 1000).toFixed(1)}k`
        }
        return count.toString()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 xl:w-3/4 space-y-4">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4 space-y-4">
            <Skeleton className="h-8 w-40 mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-40 aspect-video rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!video && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 flex flex-col items-center justify-center">
        <Play className="w-20 h-20 text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-church-navy-900 mb-4">Video no encontrado</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Lo sentimos, el video que estás buscando no existe o no está disponible en este momento.
        </p>
        <Button onClick={() => router.push('/videos')} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a todos los videos
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enlace de retroceso rápido */}
        <div className="mb-6">
          <Link href="/videos" className="inline-flex items-center text-church-navy-600 hover:text-church-electric-600 transition-colors font-medium text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a videos
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Columna Principal - Video */}
          <div className="w-full lg:w-2/3 xl:w-[70%] flex flex-col gap-6">
            {/* Reproductor */}
            <div className="aspect-video w-full bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
              <YouTubePlayer 
                videoId={video.id} 
                className="w-full h-full"
                autoplay={true}
              />
            </div>

            {/* Metadatos del Video */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              {/* Título y Acciones */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-church-navy-900 leading-tight">
                  {video.title}
                </h1>
                <div className="flex-shrink-0">
                   <Link 
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="flex items-center w-full sm:w-auto h-10 border-gray-300 hover:bg-gray-50">
                      <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                      Ver en YouTube
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Estadísticas Visuales Rápidas */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Eye className="w-4 h-4 mr-2 text-church-electric-500" />
                  <span className="font-medium text-gray-700">{video.viewCount} <span className="hidden sm:inline">vistas</span></span>
                </div>
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Calendar className="w-4 h-4 mr-2 text-church-electric-500" />
                  <span className="font-medium text-gray-700">{formatDate(video.publishedAt)}</span>
                </div>
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Clock className="w-4 h-4 mr-2 text-church-electric-500" />
                  <span className="font-medium text-gray-700">{video.duration}</span>
                </div>
                {video.category && (
                  <div className="bg-blue-50 text-church-electric-700 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide border border-blue-100">
                    {video.category}
                  </div>
                )}
              </div>

              {/* Descripción Expandible */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {video.description || "Video del Pastor Alfredo Dimiro."}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Lateral - Videos Relacionados */}
          <div className="w-full lg:w-1/3 xl:w-[30%]">
            <h3 className="text-xl font-bold text-gray-900 mb-5 px-1">Siguientes videos</h3>
            <div className="flex flex-col gap-4">
              {relatedVideos.map((relatedVideo) => (
                <Link 
                  href={`/videos/${relatedVideo.id}`} 
                  key={relatedVideo.id} 
                  className="group flex flex-row lg:flex-row gap-3 bg-white p-2 rounded-xl border border-transparent shadow-sm hover:border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="relative w-36 sm:w-48 lg:w-40 xl:w-44 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${relatedVideo.thumbnail}')` }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                      {relatedVideo.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-1 pl-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-church-electric-600 transition-colors mb-1.5">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mb-1 line-clamp-1">{relatedVideo.category || "Enseñanzas"}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{formatViewCount(relatedVideo.viewCount)} vistas</span>
                      <span className="mx-1.5">•</span>
                      <span>{new Date(relatedVideo.publishedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
