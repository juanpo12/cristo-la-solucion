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
  const extractedVideoId = videoId.includes('youtube.com') || videoId.includes('youtu.be') 
    ? videoId.split(/[/=]/).pop() || videoId 
    : videoId

  useEffect(() => {
    // Función para inicializar el reproductor
    const initPlayer = () => {
      if (!playerRef.current) return

      // Si ya existe un reproductor, destruirlo
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy()
      }

      // Crear un nuevo reproductor
      playerInstanceRef.current = new window.YT.Player(playerRef.current, {
        videoId: extractedVideoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          controls: 1,
          fs: 1, // Permitir pantalla completa
        },
        events: {
          onReady: () => {
            // El reproductor está listo
            console.log('YouTube player ready')
          },
          onError: (event: { data: unknown }) => {
            console.error('YouTube player error:', event.data)
          },
        },
      })
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