import { NextRequest, NextResponse } from 'next/server'

// Configuración para YouTube API
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCejy-Y-YJBgQq-o2UpfJaEw' // Reemplazar con el ID real del canal

// Función para obtener videos del canal
async function getChannelVideos() {
  if (!YOUTUBE_API_KEY) {
    // Datos de ejemplo si no hay API key configurada
    return {
      videos: [
        {
          id: "ejemplo1",
          title: "El Poder de la Oración - Pastor Alfredo Dimiro",
          description: "Una enseñanza profunda sobre cómo la oración transforma nuestras vidas y nos conecta con Dios de manera íntima.",
          thumbnail: "https://img.youtube.com/vi/ejemplo1/maxresdefault.jpg",
          publishedAt: "2024-01-15T10:00:00Z",
          duration: "PT45M30S",
          viewCount: "1234",
          url: "https://youtube.com/watch?v=ejemplo1"
        },
        {
          id: "ejemplo2",
          title: "Invictos Kids - Historias Bíblicas",
          description: "Los niños aprenden sobre David y Goliat de una manera divertida e interactiva.",
          thumbnail: "https://img.youtube.com/vi/ejemplo2/maxresdefault.jpg",
          publishedAt: "2024-01-10T19:30:00Z",
          duration: "PT25M15S",
          viewCount: "856",
          url: "https://youtube.com/watch?v=ejemplo2"
        }
      ],
      liveStream: {
        isLive: false
      }
    }
  }

  try {
    // Obtener videos recientes del canal
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=6&type=video`
    )
    
    if (!videosResponse.ok) {
      throw new Error('Error fetching videos from YouTube API')
    }
    
    const videosData = await videosResponse.json()
    
    // Obtener detalles adicionales de los videos (duración, vistas)
    const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',')
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,statistics`
    )
    
    const detailsData = await detailsResponse.json()
    
    // Combinar datos
    const videos = videosData.items.map((item: any, index: number) => {
      const details = detailsData.items[index]
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        duration: details.contentDetails.duration,
        viewCount: details.statistics.viewCount,
        url: `https://youtube.com/watch?v=${item.id.videoId}`
      }
    })

    // Verificar si hay stream en vivo
    const liveResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&eventType=live&type=video&maxResults=1`
    )
    
    const liveData = await liveResponse.json()
    const isLive = liveData.items && liveData.items.length > 0
    
    let liveStream = { isLive: false }
    
    if (isLive) {
      const liveVideo = liveData.items[0]
      
      // Obtener detalles del stream en vivo
      const liveDetailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${liveVideo.id.videoId}&part=liveStreamingDetails,statistics`
      )
      
      const liveDetailsData = await liveDetailsResponse.json()
      const liveDetails = liveDetailsData.items[0]
      
      liveStream = {
        isLive: true,
        title: liveVideo.snippet.title,
        description: liveVideo.snippet.description,
        thumbnail: liveVideo.snippet.thumbnails.maxres?.url || liveVideo.snippet.thumbnails.high.url,
        url: `https://youtube.com/watch?v=${liveVideo.id.videoId}`,
        viewerCount: liveDetails.liveStreamingDetails?.concurrentViewers || '0'
      }
    }

    return { videos, liveStream }

  } catch (error) {
    console.error('Error fetching YouTube data:', error)
    throw error
  }
}

// Función para formatear duración de YouTube (PT45M30S -> 45:30)
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'live-status') {
      // Solo verificar estado del stream en vivo
      const data = await getChannelVideos()
      return NextResponse.json({ liveStream: data.liveStream })
    }

    // Obtener todos los datos
    const data = await getChannelVideos()
    
    // Formatear duración de videos
    const formattedVideos = data.videos.map(video => ({
      ...video,
      duration: formatDuration(video.duration),
      viewCount: parseInt(video.viewCount).toLocaleString()
    }))

    return NextResponse.json({
      videos: formattedVideos,
      liveStream: data.liveStream,
      success: true
    })

  } catch (error) {
    console.error('Error in YouTube API route:', error)
    return NextResponse.json(
      { 
        error: 'Error fetching YouTube data',
        videos: [],
        liveStream: { isLive: false }
      },
      { status: 500 }
    )
  }
}

// Endpoint para activar/desactivar stream manualmente (para administradores)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, streamData } = body

    // Verificar autenticación (implementar según tus necesidades)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (action === 'start-stream') {
      // Lógica para activar stream manualmente
      // Esto podría guardar el estado en una base de datos o archivo
      console.log('Stream activado manualmente:', streamData)
      
      return NextResponse.json({
        success: true,
        message: 'Stream activado exitosamente'
      })
    }

    if (action === 'stop-stream') {
      // Lógica para desactivar stream manualmente
      console.log('Stream desactivado manualmente')
      
      return NextResponse.json({
        success: true,
        message: 'Stream desactivado exitosamente'
      })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })

  } catch (error) {
    console.error('Error in YouTube POST route:', error)
    return NextResponse.json(
      { error: 'Error procesando solicitud' },
      { status: 500 }
    )
  }
}