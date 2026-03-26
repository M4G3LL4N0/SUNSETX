import { generateNearbySpots } from "@/lib/spots"

export const dynamic = "force-dynamic"
export const revalidate = 0

const CACHE = new Map<string, { data: any, timestamp: number }>()

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

    // Generate fresh data
    const now = new Date()
    const sunset = new Date()
    sunset.setHours(18, 45, 0, 0)

    const peakStart = "6:40 PM"
    const peakEnd = "6:50 PM"

    // Only generate spots we need
    const closeSpots = generateNearbySpots(lat, lon, 82).filter(s => s.tier === "close").slice(0, 3)
    const midSpot = generateNearbySpots(lat, lon, 82).find(s => s.tier === "mid")
    const destinationSpot = generateNearbySpots(lat, lon, 82).find(s => s.tier === "destination")

    const responseData = {
      cityLabel: `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      regionLabel: `Live sunset report for ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      sunsetLocalTime: sunset.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      peakWindow: {
        start: peakStart,
        end: peakEnd,
      },
      skyScore: 82,
      afterglowScore: 78,
      explanation: "Balanced clouds and visibility",
      liveConditions: {
        clouds: 40,
        humidity: 55,
        visibilityMiles: 9,
        windMph: 6,
        sunElevation: -2,
        summary: "partly cloudy",
      },
      nearbyRankedLocations: [
        ...closeSpots,
        ...(midSpot ? [midSpot] : []),
        ...(destinationSpot ? [destinationSpot] : [])
      ],
      updatedAt: new Date().toISOString(),
    }

    // Update cache
    CACHE.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    })

    return Response.json(responseData)
  } catch (e) {
    return Response.json(
      { error: "fallback live-score error" },
      { status: 500 }
    )
  }
}
