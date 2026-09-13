import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

// Configuración específica para el canal del Pastor Alfredo Dimiro
const YOUTUBE_API_KEY = env.YOUTUBE_API_KEY
const PASTOR_CHANNEL_ID = env.PASTOR_CHANNEL_ID
const PASTOR_CHANNEL_HANDLE = '@AlfredoDimiroLive'

const PAGE_SIZE = 50
const PAGE_TTL_MS = 10 * 60 * 1000      // Una página de videos: 10 minutos
const CHANNEL_TTL_MS = 60 * 60 * 1000   // Datos del canal: 1 hora
const VIDEO_TTL_MS = 30 * 60 * 1000     // Un video suelto: 30 minutos

export type PastorVideo = {
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

type ChannelInfo = {
  title: string
  handle: string
  subscriberCount: string
  videoCount: string
}

type VideoPage = {
  videos: PastorVideo[]
  nextPageToken: string | null
  totalResults: number
}

// ─── Caché en memoria ──────────────────────────────────────────────────
// La instancia de Vercel se recicla, así que esto no es un caché duradero:
// es lo que evita que cada visita a /videos gaste cuota de la YouTube API.

type Cached<T> = { data: T; expiresAt: number }

const pageCache = new Map<string, Cached<VideoPage>>()
const videoCache = new Map<string, Cached<PastorVideo | null>>()
let channelCache: Cached<{ info: ChannelInfo; uploadsPlaylistId: string }> | null = null

function readCache<T>(entry: Cached<T> | undefined | null): T | null {
  if (!entry || Date.now() >= entry.expiresAt) return null
  return entry.data
}

// ─── Utilidades ────────────────────────────────────────────────────────

/** Segundos de una duración ISO-8601 de YouTube. `P0D` (en vivo / sin procesar) da 0. */
function durationSeconds(iso: string): number {
  const match = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/)
  if (!match) return 0
  const [, d, h, m, s] = match
  return (
    parseInt(d || '0', 10) * 86400 +
    parseInt(h || '0', 10) * 3600 +
    parseInt(m || '0', 10) * 60 +
    parseInt(s || '0', 10)
  )
}

/** Duración legible. Las transmisiones en vivo llegan como `P0D` y no tienen duración todavía. */
function formatDuration(iso: string): string {
  const total = durationSeconds(iso)
  if (total === 0) return 'EN VIVO'

  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatCount(count: string): string {
  const num = parseInt(count, 10)
  if (!Number.isFinite(num)) return count
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

function decodeHTMLEntities(text: string): string {
  if (!text) return text
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // `&amp;` va al final: si se reemplaza primero, `&amp;lt;` termina como `<`.
    .replace(/&amp;/g, '&')
}

function categorize(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('conferencia') || t.includes('evento')) return 'Conferencia'
  if (t.includes('serie') || t.includes('parte')) return 'Serie'
  if (t.includes('estudio') || t.includes('salmo') || t.includes('biblia')) return 'Estudio Bíblico'
  return 'Enseñanza'
}

/**
 * Un short dura 60 segundos o menos. Los `P0D` (en vivo o recién subidos, todavía
 * sin duración) no se descartan: justamente son los que hay que mostrar arriba.
 */
function isShort(iso: string): boolean {
  const seconds = durationSeconds(iso)
  return seconds > 0 && seconds <= 60
}

async function youtube(path: string, params: Record<string, string>) {
  const query = new URLSearchParams({ key: YOUTUBE_API_KEY as string, ...params })
  const response = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${query}`)
  if (!response.ok) {
    throw new Error(`YouTube API ${path} respondió ${response.status}: ${await response.text()}`)
  }
  return response.json()
}

// ─── Canal ─────────────────────────────────────────────────────────────

/**
 * Datos del canal y, sobre todo, el id de su playlist de subidas. Esa playlist
 * es la lista real y completa de videos en orden cronológico inverso; `search.list`
 * consulta el índice de búsqueda, que para este canal devuelve una veintena de
 * videos sueltos de 1190 y no permite paginar más allá.
 */
async function getChannel() {
  const cached = readCache(channelCache)
  if (cached) return cached

  let channelId = PASTOR_CHANNEL_ID

  if (!channelId) {
    const search = await youtube('search', {
      q: PASTOR_CHANNEL_HANDLE,
      type: 'channel',
      part: 'snippet',
      maxResults: '1',
    })
    channelId = search.items?.[0]?.snippet?.channelId
    if (!channelId) throw new Error('No se pudo resolver el canal del Pastor')
  }

  const data = await youtube('channels', {
    id: channelId,
    part: 'snippet,statistics,contentDetails',
  })

  const channel = data.items?.[0]
  if (!channel) throw new Error(`El canal ${channelId} no existe o no es accesible`)

  const result = {
    info: {
      title: channel.snippet.title,
      handle: channel.snippet.customUrl || PASTOR_CHANNEL_HANDLE,
      subscriberCount: formatCount(channel.statistics.subscriberCount ?? '0'),
      videoCount: channel.statistics.videoCount ?? '0',
    },
    uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads as string,
  }

  channelCache = { data: result, expiresAt: Date.now() + CHANNEL_TTL_MS }
  return result
}

// ─── Videos ────────────────────────────────────────────────────────────

/**
 * Cruza los ids con `videos.list` para traer duración y vistas. La API no
 * garantiza el orden de la respuesta y omite los ids que no puede devolver
 * (privados, borrados, bloqueados por región), así que el cruce va por id y
 * nunca por posición.
 */
async function getDetails(ids: string[]) {
  if (ids.length === 0) return new Map<string, { duration: string; viewCount: string }>()

  const data = await youtube('videos', {
    id: ids.join(','),
    part: 'contentDetails,statistics',
  })

  return new Map<string, { duration: string; viewCount: string }>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data.items ?? []).map((item: any) => [
      item.id as string,
      {
        duration: item.contentDetails?.duration ?? 'P0D',
        viewCount: item.statistics?.viewCount ?? '0',
      },
    ]),
  )
}

/** Una página de la playlist de subidas, ya cruzada con los detalles y sin shorts. */
async function getVideoPage(pageToken: string): Promise<VideoPage> {
  const cached = readCache(pageCache.get(pageToken))
  if (cached) return cached

  const { uploadsPlaylistId } = await getChannel()

  const playlist = await youtube('playlistItems', {
    playlistId: uploadsPlaylistId,
    part: 'snippet,contentDetails',
    maxResults: String(PAGE_SIZE),
    ...(pageToken ? { pageToken } : {}),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: any[] = playlist.items ?? []
  const ids = items.map((item) => item.contentDetails.videoId as string)
  const details = await getDetails(ids)

  const videos: PastorVideo[] = []
  for (const item of items) {
    const id = item.contentDetails.videoId as string
    const detail = details.get(id)

    // Sin detalles el video es privado, borrado o bloqueado: no se muestra.
    if (!detail) continue
    if (isShort(detail.duration)) continue

    const title = decodeHTMLEntities(item.snippet.title)
    const thumbnails = item.snippet.thumbnails ?? {}

    videos.push({
      id,
      title,
      description: decodeHTMLEntities(item.snippet.description),
      thumbnail:
        thumbnails.maxres?.url ||
        thumbnails.standard?.url ||
        thumbnails.high?.url ||
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      // `videoPublishedAt` es la fecha real de publicación; `snippet.publishedAt`
      // es cuándo se agregó a la playlist, que para algunos videos no coincide.
      publishedAt: item.contentDetails.videoPublishedAt ?? item.snippet.publishedAt,
      duration: formatDuration(detail.duration),
      viewCount: detail.viewCount,
      url: `https://youtube.com/watch?v=${id}`,
      category: categorize(title),
      isLive: durationSeconds(detail.duration) === 0,
    })
  }

  const page: VideoPage = {
    videos,
    nextPageToken: playlist.nextPageToken ?? null,
    totalResults: playlist.pageInfo?.totalResults ?? videos.length,
  }

  pageCache.set(pageToken, { data: page, expiresAt: Date.now() + PAGE_TTL_MS })
  return page
}

/** Un video puntual, para la página de detalle: no hace falta recorrer la playlist. */
async function getVideo(id: string): Promise<PastorVideo | null> {
  const cached = videoCache.get(id)
  if (cached && Date.now() < cached.expiresAt) return cached.data

  const data = await youtube('videos', {
    id,
    part: 'snippet,contentDetails,statistics',
  })

  const item = data.items?.[0]
  let video: PastorVideo | null = null

  if (item) {
    const title = decodeHTMLEntities(item.snippet.title)
    const thumbnails = item.snippet.thumbnails ?? {}
    video = {
      id: item.id,
      title,
      description: decodeHTMLEntities(item.snippet.description),
      thumbnail:
        thumbnails.maxres?.url ||
        thumbnails.standard?.url ||
        thumbnails.high?.url ||
        `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
      publishedAt: item.snippet.publishedAt,
      duration: formatDuration(item.contentDetails.duration),
      viewCount: item.statistics?.viewCount ?? '0',
      url: `https://youtube.com/watch?v=${item.id}`,
      category: categorize(title),
      isLive: durationSeconds(item.contentDetails.duration) === 0,
    }
  }

  videoCache.set(id, { data: video, expiresAt: Date.now() + VIDEO_TTL_MS })
  return video
}

// ─── Handler ───────────────────────────────────────────────────────────

const FALLBACK_CHANNEL: ChannelInfo = {
  title: 'Pastor Alfredo Dimiro',
  handle: PASTOR_CHANNEL_HANDLE,
  subscriberCount: 'N/A',
  videoCount: 'N/A',
}

export async function GET(request: NextRequest) {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      {
        error: 'YOUTUBE_API_KEY no está configurada',
        videos: [],
        nextPageToken: null,
        totalResults: 0,
        channelInfo: FALLBACK_CHANNEL,
        success: false,
      },
      { status: 503 },
    )
  }

  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get('id')

  try {
    // Página de detalle: el video pedido más una primera página para "relacionados".
    if (videoId) {
      const [video, page] = await Promise.all([getVideo(videoId), getVideoPage('')])
      if (!video) {
        return NextResponse.json({ error: 'Video no encontrado', video: null, related: [], success: false }, { status: 404 })
      }
      return NextResponse.json({
        video,
        related: page.videos.filter((v) => v.id !== videoId).slice(0, 15),
        success: true,
      })
    }

    const [page, channel] = await Promise.all([
      getVideoPage(searchParams.get('pageToken') ?? ''),
      getChannel(),
    ])

    return NextResponse.json({
      videos: page.videos,
      nextPageToken: page.nextPageToken,
      totalResults: page.totalResults,
      channelInfo: channel.info,
      success: true,
    })
  } catch (error) {
    console.error('Error obteniendo los videos del Pastor:', error)
    return NextResponse.json(
      {
        error: 'Error fetching Pastor videos',
        videos: [],
        nextPageToken: null,
        totalResults: 0,
        channelInfo: FALLBACK_CHANNEL,
        success: false,
      },
      { status: 500 },
    )
  }
}
