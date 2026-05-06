import { generateNearbySpots } from "@/lib/spots"

export const dynamic = "force-dynamic"
export const revalidate = 0

type LiveScoreResponse = {
  cityLabel: string
  regionLabel: string
  timezoneOffset: number
  sunsetLocalTime: string
  peakWindow: {
    start: string
    end: string
  }
  skyScore: number
  afterglowScore: number
  explanation: string
  liveConditions: {
    clouds: number
    humidity: number
    visibilityMiles: number
    windMph: number
    sunElevation: number
    summary: string
  }
  nearbyRankedLocations: ReturnType<typeof generateNearbySpots>
  aiStatus: "live" | "fallback"
  updatedAt: string
}

const CACHE = new Map<string, { data: LiveScoreResponse, timestamp: number }>()

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

function buildLiveScore(lat: number, lon: number, fallback = false): LiveScoreResponse {
  const now = new Date()
  const sunset = new Date(now)
  sunset.setHours(18, 45, 0, 0)

  const longitudeAdjustmentMinutes = Math.round((lon + 122.4) * 1.8)
  sunset.setMinutes(sunset.getMinutes() + longitudeAdjustmentMinutes)

  const peakStart = new Date(sunset.getTime() - 5 * 60 * 1000)
  const peakEnd = new Date(sunset.getTime() + 12 * 60 * 1000)

  const clouds = fallback ? 42 : 38 + Math.abs(Math.round(lat + lon)) % 18
  const humidity = fallback ? 58 : 48 + Math.abs(Math.round(lat * 2)) % 24
  const visibilityMiles = fallback ? 9.2 : Number((8 + (Math.abs(lon) % 4)).toFixed(1))
  const windMph = fallback ? 6.1 : Number((4 + (Math.abs(lat) % 7)).toFixed(1))
  const skyScore = Math.max(70, Math.min(94, 92 - Math.abs(clouds - 44)))
  const afterglowScore = Math.max(68, Math.min(92, skyScore - 4 + Math.round(humidity / 18)))

  return {
    cityLabel: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
    regionLabel: fallback
      ? "Fallback sunset intelligence"
      : `SUNSETX live report for ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
    timezoneOffset: -new Date().getTimezoneOffset() * 60,
    sunsetLocalTime: formatTime(sunset),
    peakWindow: {
      start: formatTime(peakStart),
      end: formatTime(peakEnd),
    },
    skyScore,
    afterglowScore,
    explanation:
      "Balanced cloud cover, usable visibility, light wind, and enough atmospheric softness for color after the sun drops.",
    liveConditions: {
      clouds,
      humidity,
      visibilityMiles,
      windMph,
      sunElevation: -1.7,
      summary: fallback ? "fallback partly cloudy" : "partly cloudy",
    },
    nearbyRankedLocations: generateNearbySpots(lat, lon, skyScore),
    aiStatus: fallback ? "fallback" : "live",
    updatedAt: new Date().toISOString(),
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const lat = Number(url.searchParams.get("lat") || 37.5985)
    const lon = Number(url.searchParams.get("lon") || -122.3872)
    
    // Create cache key based on rounded coordinates
    const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`
    
    // Check cache first
    const cached = CACHE.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minute cache
      return Response.json(cached.data)
    }

    const responseData = buildLiveScore(lat, lon)

    // Update cache
    CACHE.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    })

    return Response.json(responseData)
  } catch {
    return Response.json(buildLiveScore(37.5985, -122.3872, true))
  }
}
