"use client"

import { useEffect, useRef } from 'react'

interface YouTubePlayerProps {
  videoId: string
  autoplay?: boolean
  className?: string
}

declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement | string, options: Record<string, unknown>) => {
        destroy: () => void
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

export function YouTubePlayer({ videoId, autoplay = true, className = '' }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<{ destroy: () => void } | null>(null)
  
  // Extraer el ID del video si se proporciona una URL completa
  const extractVideoId = (url: string): string => {
    if (!url) return ''
    
    // Si ya es un ID simple (11 caracteres), devolverlo
    if (url.length === 11 && !/[/=]/.test(url)) {
      return url
    }
    
    // Patrones para diferentes formatos de URL de YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
      /(?:youtu\.be\/)([^&\n?#]+)/,
      /(?:youtube\.com\/v\/)([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    
    // Si no coincide con ningún patrón, intentar extraer de la URL
    const urlParts = url.split(/[/=&?]/).filter(part => part.length === 11)
    return urlParts[0] || url
  }
  
  const extractedVideoId = extractVideoId(videoId)

  useEffect(() => {
    // Función para inicializar el reproductor
    const initPlayer = () => {
      if (!playerRef.current || !extractedVideoId) {
        console.warn('No se puede inicializar el reproductor: elemento o videoId faltante')
        return
      }

      // Validar que el videoId tenga el formato correcto (11 caracteres)
      if (extractedVideoId.length !== 11) {
        console.error('ID de video inválido:', extractedVideoId)
        return
      }

      // Si ya existe un reproductor, destruirlo
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy()
        } catch (error) {
          console.warn('Error al destruir reproductor anterior:', error)
        }
      }

      try {
        // Crear un nuevo reproductor
        playerInstanceRef.current = new window.YT.Player(playerRef.current, {
          width: '100%',
          height: '100%',
          videoId: extractedVideoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            controls: 1,
            fs: 1, // Permitir pantalla completa
            playsinline: 1, // Reproducir inline en iOS
            enablejsapi: 1, // Habilitar API de JavaScript
            origin: window.location.origin, // Origen para seguridad
            widget_referrer: window.location.href, // Referrer para analytics
          },
          events: {
            onReady: () => {
              console.log('YouTube player ready for video:', extractedVideoId)
            },
            onError: (event: { data: unknown }) => {
              console.error('YouTube player error:', event.data, 'for video:', extractedVideoId)
              // Mostrar mensaje de error más amigable
              if (playerRef.current) {
                playerRef.current.innerHTML = `
                  <div class="flex items-center justify-center h-full bg-gray-100 text-gray-600">
                    <div class="text-center">
                      <p class="mb-2">Error al cargar el video</p>
                      <p class="text-sm">ID: ${extractedVideoId}</p>
                    </div>
                  </div>
                `
              }
            },
          },
        })
      } catch (error) {
        console.error('Error al crear reproductor YouTube:', error)
      }
    }

    // Cargar la API de YouTube si aún no está cargada
    if (!window.YT || !window.YT.Player) {
      // Guardar la función de inicialización para llamarla cuando la API esté lista
      window.onYouTubeIframeAPIReady = initPlayer
      
      // Verificar si el script ya está cargando
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      }
    } else {
      // Si la API ya está cargada, inicializar el reproductor directamente
      initPlayer()
    }

    return () => {
      // Limpiar el reproductor cuando el componente se desmonte
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy()
      }
    }
  }, [videoId, autoplay, extractedVideoId])

  return (
    <div className={`aspect-video ${className}`}>
      <div ref={playerRef} className="w-full h-full" />
    </div>
  )
}