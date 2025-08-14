import { NextRequest, NextResponse } from 'next/server'

// Configuración específica para el canal del Pastor Alfredo Dimiro
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const PASTOR_CHANNEL_ID = process.env.PASTOR_CHANNEL_ID || 'UC_ALFREDO_DIMIRO_CHANNEL_ID' // Reemplazar con el ID real
const PASTOR_CHANNEL_HANDLE = '@AlfredoDimiroLive'

// Función para obtener todos los videos del Pastor
async function getPastorVideos(maxResults: number = 50) {
  if (!YOUTUBE_API_KEY) {
    // Datos de ejemplo más extensos si no hay API key configurada
    return {
      videos: [
        {
          id: "pastor1",
          title: "El Poder de la Oración - Parte 1: Fundamentos",
          description: "Una enseñanza profunda sobre cómo la oración transforma nuestras vidas y nos conecta con Dios de manera íntima. En esta primera parte exploramos los fundamentos bíblicos de la oración efectiva.",
          thumbnail: "https://img.youtube.com/vi/pastor1/maxresdefault.jpg",
          publishedAt: "2024-01-15T10:00:00Z",
          duration: "PT45M30S",
          viewCount: "2340",
          url: "https://youtube.com/watch?v=pastor1",
          category: "Enseñanza"
        },
        {
          id: "pastor2",
          title: "El Poder de la Pasión - Conferencia Completa",
          description: "Conferencia especial sobre cómo descubrir y vivir con pasión el propósito que Dios tiene para tu vida. Una enseñanza que cambiará tu perspectiva sobre el llamado divino.",
          thumbnail: "https://img.youtube.com/vi/pastor2/maxresdefault.jpg",
          publishedAt: "2024-01-10T19:30:00Z",
          duration: "PT1H15M20S",
          viewCount: "3567",
          url: "https://youtube.com/watch?v=pastor2",
          category: "Conferencia"
        },
        {
          id: "pastor3",
          title: "Administración Financiera Bíblica - Serie Completa",
          description: "Principios bíblicos para manejar las finanzas de manera sabia. Aprende cómo Dios quiere que administremos los recursos que nos ha dado según Su palabra.",
          thumbnail: "https://img.youtube.com/vi/pastor3/maxresdefault.jpg",
          publishedAt: "2024-01-05T20:00:00Z",
          duration: "PT38M45S",
          viewCount: "1890",
          url: "https://youtube.com/watch?v=pastor3",
          category: "Serie"
        },
        {
          id: "pastor4",
          title: "Desechando Maldiciones - Parte 1: Identificación",
          description: "Una serie poderosa sobre cómo identificar y romper las maldiciones que pueden estar afectando tu vida. En esta primera parte aprendemos a identificar las maldiciones.",
          thumbnail: "https://img.youtube.com/vi/pastor4/maxresdefault.jpg",
          publishedAt: "2023-12-28T19:30:00Z",
          duration: "PT52M15S",
          viewCount: "4123",
          url: "https://youtube.com/watch?v=pastor4",
          category: "Serie"
        },
        {
          id: "pastor5",
          title: "El Poder de la Imaginación - Renovando la Mente",
          description: "Descubre cómo Dios quiere renovar tu mente y transformar tu imaginación para que puedas ver las cosas desde Su perspectiva divina.",
          thumbnail: "https://img.youtube.com/vi/pastor5/maxresdefault.jpg",
          publishedAt: "2023-12-20T20:00:00Z",
          duration: "PT41M30S",
          viewCount: "2756",
          url: "https://youtube.com/watch?v=pastor5",
          category: "Enseñanza"
        },
        {
          id: "pastor6",
          title: "Salmo 91 - Protección Divina en Tiempos Difíciles",
          description: "Un estudio detallado del Salmo 91 y cómo vivir bajo la protección sobrenatural de Dios en estos tiempos difíciles que estamos viviendo.",
          thumbnail: "https://img.youtube.com/vi/pastor6/maxresdefault.jpg",
          publishedAt: "2023-12-15T19:00:00Z",
          duration: "PT47M20S",
          viewCount: "3234",
          url: "https://youtube.com/watch?v=pastor6",
          category: "Estudio Bíblico"
        },
        {
          id: "pastor7",
          title: "El Poder del Trabajo - Prosperidad Bíblica",
          description: "Entiende los principios bíblicos del trabajo y cómo Dios quiere prosperarte a través de tu labor diaria. El trabajo como adoración a Dios.",
          thumbnail: "https://img.youtube.com/vi/pastor7/maxresdefault.jpg",
          publishedAt: "2023-12-10T20:30:00Z",
          duration: "PT43M45S",
          viewCount: "2890",
          url: "https://youtube.com/watch?v=pastor7",
          category: "Enseñanza"
        },
        {
          id: "pastor8",
          title: "El Poder de la Paternidad Espiritual",
          description: "La importancia de tener padres espirituales y cómo esto impacta nuestro crecimiento en el reino de Dios. Relaciones que transforman vidas.",
          thumbnail: "https://img.youtube.com/vi/pastor8/maxresdefault.jpg",
          publishedAt: "2023-12-05T19:30:00Z",
          duration: "PT39M15S",
          viewCount: "1567",
          url: "https://youtube.com/watch?v=pastor8",
          category: "Enseñanza"
        },
        {
          id: "pastor9",
          title: "Las Primicias - Principio de Bendición",
          description: "Ponerlo a Dios primero en todo es la clave de una vida fructífera y próspera. El beneficio de que pongamos a Dios primero en nuestras finanzas.",
          thumbnail: "https://img.youtube.com/vi/pastor9/maxresdefault.jpg",
          publishedAt: "2023-11-28T20:00:00Z",
          duration: "PT35M20S",
          viewCount: "2145",
          url: "https://youtube.com/watch?v=pastor9",
          category: "Enseñanza"
        },
        {
          id: "pastor10",
          title: "Camino hacia la Sanidad - Fe que Sana",
          description: "Muchas personas que están enfermas aceptan con resignación su condición. No hay razón para resignarse, usted puede encontrar el camino hacia su sanidad.",
          thumbnail: "https://img.youtube.com/vi/pastor10/maxresdefault.jpg",
          publishedAt: "2023-11-20T19:00:00Z",
          duration: "PT42M10S",
          viewCount: "3456",
          url: "https://youtube.com/watch?v=pastor10",
          category: "Enseñanza"
        }
      ],
      totalResults: 10,
      channelInfo: {
        title: "Pastor Alfredo Dimiro",
        handle: "@AlfredoDimiroLive",
        subscriberCount: "15.2K",
        videoCount: "127"
      }
    }
  }

  try {
    // Primero, obtener información del canal usando el handle
    let channelId = PASTOR_CHANNEL_ID
    
    if (!channelId || channelId.includes('ALFREDO_DIMIRO')) {
      // Buscar el canal por handle si no tenemos el ID
      const channelSearchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=${PASTOR_CHANNEL_HANDLE}&type=channel&part=snippet&maxResults=1`
      )
      
      if (channelSearchResponse.ok) {
        const channelSearchData = await channelSearchResponse.json()
        if (channelSearchData.items && channelSearchData.items.length > 0) {
          channelId = channelSearchData.items[0].snippet.channelId
        }
      }
    }

    // Obtener información del canal
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&id=${channelId}&part=snippet,statistics`
    )
    
    let channelInfo = {
      title: "Pastor Alfredo Dimiro",
      handle: "@AlfredoDimiroLive",
      subscriberCount: "N/A",
      videoCount: "N/A"
    }

    if (channelResponse.ok) {
      const channelData = await channelResponse.json()
      if (channelData.items && channelData.items.length > 0) {
        const channel = channelData.items[0]
        channelInfo = {
          title: channel.snippet.title,
          handle: channel.snippet.customUrl || "@AlfredoDimiroLive",
          subscriberCount: formatCount(channel.statistics.subscriberCount),
          videoCount: channel.statistics.videoCount
        }
      }
    }

    // Obtener videos del canal
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=${maxResults}&type=video`
    )
    
    if (!videosResponse.ok) {
      throw new Error('Error fetching videos from YouTube API')
    }
    
    const videosData = await videosResponse.json()
    
    // Obtener detalles adicionales de los videos
    const videoIds = videosData.items.map((item: Record<string, unknown>) => (item.id as Record<string, string>).videoId).join(',')
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,statistics,snippet`
    )
    
    const detailsData = await detailsResponse.json()
    
    // Combinar datos y categorizar videos
    const videos = videosData.items.map((item: Record<string, unknown>, index: number) => {
      const details = detailsData.items[index]
      const title = item.snippet.title.toLowerCase()
      
      // Categorizar automáticamente basado en el título
      let category = "Enseñanza"
      if (title.includes("conferencia") || title.includes("evento")) {
        category = "Conferencia"
      } else if (title.includes("serie") || title.includes("parte")) {
        category = "Serie"
      } else if (title.includes("estudio") || title.includes("salmo") || title.includes("biblia")) {
        category = "Estudio Bíblico"
      }

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        duration: details.contentDetails.duration,
        viewCount: details.statistics.viewCount,
        url: `https://youtube.com/watch?v=${item.id.videoId}`,
        category
      }
    })

    return {
      videos,
      totalResults: videosData.pageInfo.totalResults,
      channelInfo
    }

  } catch {
    throw new Error('Error fetching Pastor videos')
  }
}



// Función para formatear números grandes
function formatCount(count: string): string {
  const num = parseInt(count)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return count
}

// Función para formatear duración de YouTube
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
    const maxResults = parseInt(searchParams.get('maxResults') || '50')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Obtener videos del pastor
    const data = await getPastorVideos(maxResults)
    
    // Formatear duración y conteo de vistas
    let formattedVideos = data.videos.map(video => ({
      ...video,
      duration: formatDuration(video.duration),
      viewCount: parseInt(video.viewCount).toLocaleString()
    }))

    // Filtrar por categoría si se especifica
    if (category && category !== 'Todos') {
      formattedVideos = formattedVideos.filter(video => video.category === category)
    }

    // Filtrar por búsqueda si se especifica
    if (search) {
      const searchLower = search.toLowerCase()
      formattedVideos = formattedVideos.filter(video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      videos: formattedVideos,
      totalResults: data.totalResults,
      channelInfo: data.channelInfo,
      success: true
    })

  } catch {
    return NextResponse.json(
      { 
        error: 'Error fetching Pastor videos',
        videos: [],
        totalResults: 0,
        channelInfo: {
          title: "Pastor Alfredo Dimiro",
          handle: "@AlfredoDimiroLive",
          subscriberCount: "N/A",
          videoCount: "N/A"
        }
      },
      { status: 500 }
    )
  }
}