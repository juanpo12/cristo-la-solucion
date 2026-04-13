import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

const YOUTUBE_API_KEY = env.YOUTUBE_API_KEY
const CHANNEL_ID = env.PASTOR_CHANNEL_ID

const VIDEOS_TTL_MS = 5 * 60 * 1000  // 5 minutos
const LIVE_TTL_MS = 60 * 1000         // 1 minuto

type VideoObject = {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  duration: string
  viewCount: string
  url: string
}

type LiveStreamData = {
  isLive: boolean
  title?: string
  description?: string
  thumbnail?: string
  url?: string
  viewerCount?: string
}

type ChannelData = {
  videos: VideoObject[]
  liveStream: LiveStreamData
}

// Caché en memoria — evita golpear la YouTube API en cada request
let videosCache: { data: ChannelData; expiresAt: number } | null = null
let liveCache: { data: LiveStreamData; expiresAt: number } | null = null

const FALLBACK_DATA: ChannelData = {
  videos: [
    {
      id: 'ejemplo1',
      title: 'El Poder de la Oración - Pastor Alfredo Dimiro',
      description: 'Una enseñanza profunda sobre cómo la oración transforma nuestras vidas y nos conecta con Dios de manera íntima.',
      thumbnail: '/CONFE.jpg',
      publishedAt: '2024-01-15T10:00:00Z',
      duration: 'PT45M30S',
      viewCount: '1234',
      url: 'https://youtube.com/watch?v=ejemplo1'
    },
    {
      id: 'ejemplo2',
      title: 'Invictos Kids - Historias Bíblicas',
      description: 'Los niños aprenden sobre David y Goliat de una manera divertida e interactiva.',
      thumbnail: '/CONFE.jpg',
      publishedAt: '2024-01-10T19:30:00Z',
      duration: 'PT25M15S',
      viewCount: '856',
      url: 'https://youtube.com/watch?v=ejemplo2'
    }
  ],
  liveStream: { isLive: false }
}

async function fetchLiveStatus(): Promise<LiveStreamData> {
  const liveResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&eventType=live&type=video&maxResults=1`
  )

  if (!liveResponse.ok) {
    console.warn('Error al verificar stream en vivo:', await liveResponse.text())
    return { isLive: false }
  }

  const liveData = await liveResponse.json()
  if (!liveData.items || liveData.items.length === 0) return { isLive: false }

  const liveVideo = liveData.items[0]
  const videoId = liveVideo.id.videoId

  try {
    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=liveStreamingDetails,statistics`
    )
    if (detailsRes.ok) {
      const detailsData = await detailsRes.json()
      const details = detailsData.items?.[0]
      return {
        isLive: true,
        title: liveVideo.snippet.title,
        description: liveVideo.snippet.description,
        thumbnail: liveVideo.snippet.thumbnails.maxres?.url || liveVideo.snippet.thumbnails.high?.url || '/CONFE.jpg',
        url: `https://youtube.com/watch?v=${videoId}`,
        viewerCount: details?.liveStreamingDetails?.concurrentViewers || '0'
      }
    }
  } catch (error) {
    console.error('Error obteniendo detalles del stream en vivo:', error)
  }

  return {
    isLive: true,
    title: liveVideo.snippet.title,
    description: liveVideo.snippet.description,
    thumbnail: liveVideo.snippet.thumbnails.high?.url || '/CONFE.jpg',
    url: `https://youtube.com/watch?v=${videoId}`,
    viewerCount: '0'
  }
}

async function getChannelVideos(): Promise<ChannelData> {
  if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
    console.warn('YouTube API Key o Channel ID no configurados')
    return FALLBACK_DATA
  }

  // Servir desde caché si todavía está vigente
  if (videosCache && Date.now() < videosCache.expiresAt) {
    return videosCache.data
  }

  try {
    // Lanzar búsqueda de videos y estado en vivo en paralelo
    const [videosResponse, liveStream] = await Promise.all([
      fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=6&type=video`),
      fetchLiveStatus()
    ])

    if (!videosResponse.ok) {
      console.error('Error en la respuesta de YouTube API:', await videosResponse.text())
      throw new Error('Error fetching videos from YouTube API')
    }

    const videosData = await videosResponse.json()

    if (!videosData.items || videosData.items.length === 0) {
      console.warn('No se encontraron videos en el canal')
      const result: ChannelData = { videos: [], liveStream }
      videosCache = { data: result, expiresAt: Date.now() + VIDEOS_TTL_MS }
      return result
    }

    // Obtener detalles de todos los videos en una sola llamada
    const videoIds = videosData.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.id.videoId)
      .join(',')

    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,statistics`
    )
    const detailsData = await detailsResponse.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videos: VideoObject[] = videosData.items.map((item: any) => {
      const videoId = item.id.videoId
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const details = detailsData.items?.find((d: any) => d.id === videoId)
      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: details
          ? (item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || '/CONFE.jpg')
          : (item.snippet.thumbnails.high?.url || '/CONFE.jpg'),
        publishedAt: item.snippet.publishedAt,
        duration: details?.contentDetails?.duration || 'PT0M0S',
        viewCount: details?.statistics?.viewCount || '0',
        url: `https://youtube.com/watch?v=${videoId}`
      }
    })

    const result: ChannelData = { videos, liveStream }
    videosCache = { data: result, expiresAt: Date.now() + VIDEOS_TTL_MS }
    // Actualizar también el caché de live con el dato recién obtenido
    liveCache = { data: liveStream, expiresAt: Date.now() + LIVE_TTL_MS }

    return result
  } catch {
    throw new Error('Error fetching YouTube data')
  }
}

async function getLiveStatus(): Promise<LiveStreamData> {
  if (!YOUTUBE_API_KEY || !CHANNEL_ID) return { isLive: false }

  // Si el caché de videos es reciente, reutilizamos su live status
  if (videosCache && Date.now() < videosCache.expiresAt) {
    return videosCache.data.liveStream
  }

  // Caché dedicado para live (TTL más corto)
  if (liveCache && Date.now() < liveCache.expiresAt) {
    return liveCache.data
  }

  const data = await fetchLiveStatus()
  liveCache = { data, expiresAt: Date.now() + LIVE_TTL_MS }
  return data
}

function formatDuration(duration: string): string {
  if (!duration || typeof duration !== 'string') return '0:00'
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'live-status') {
      const liveStream = await getLiveStatus()
      return NextResponse.json(
        { liveStream },
        { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' } }
      )
    }

    const data = await getChannelVideos()

    const formattedVideos = data.videos.map((video) => ({
      ...video,
      duration: formatDuration(video.duration),
      viewCount: isNaN(parseInt(video.viewCount)) ? '0' : parseInt(video.viewCount).toLocaleString()
    }))

    return NextResponse.json(
      { videos: formattedVideos, liveStream: data.liveStream, success: true },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    )
  } catch {
    return NextResponse.json(
      { error: 'Error fetching YouTube data', videos: [], liveStream: { isLive: false } },
      { status: 500 }
    )
  }
}

// Endpoint para activar/desactivar stream manualmente (para administradores)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, streamData } = body

    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${env.ADMIN_TOKEN}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (action === 'start-stream') {
      console.log('Stream activado manualmente:', streamData)
      return NextResponse.json({ success: true, message: 'Stream activado exitosamente' })
    }

    if (action === 'stop-stream') {
      console.log('Stream desactivado manualmente')
      return NextResponse.json({ success: true, message: 'Stream desactivado exitosamente' })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Error procesando solicitud' }, { status: 500 })
  }
}
