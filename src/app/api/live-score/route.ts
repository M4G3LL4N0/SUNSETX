export const dynamic = "force-dynamic"
export const revalidate = 0

import { generateNearbySpots } from '../../lib/spots'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const lat = Number(url.searchParams.get("lat") || 37.5985)
    const lon = Number(url.searchParams.get("lon") || -122.3872)
    
    const nearbySpots = await generateNearbySpots(lat, lon)

    const now = new Date()
    const sunset = new Date()
    sunset.setHours(18, 45, 0, 0)

    const peakStart = "6:40 PM"
    const peakEnd = "6:50 PM"

    const spots = [
      {
        name: "Nearby Hill",
        driveMinutes: 8,
        distanceMiles: 2.5,
        score: 90,
      },
      {
        name: "Scenic Park",
        driveMinutes: 12,
        distanceMiles: 4.2,
        score: 87,
      },
      {
        name: "Bay View",
        driveMinutes: 10,
        distanceMiles: 3.1,
        score: 84,
      },
    ]

    return Response.json({
      cityLabel: `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
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
      nearbyRankedLocations: spots || [],
      updatedAt: new Date().toISOString(),
    })
  } catch (e) {
    return Response.json(
      { error: "fallback live-score error" },
      { status: 500 }
    )
  }
}
