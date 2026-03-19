import {
  getOneCallWeather,
  unixSecondsToDate,
  formatInTimeZone,
} from "@/lib/openweather"
import {
  buildSunElevationCurve,
  estimateAfterglowScore,
  getSolarElevation,
} from "@/lib/solar"
import { calculateSkyScore } from "@/lib/scoring"
import { locations } from "@/lib/locations"
import { rankLocations } from "@/lib/rank"

export const dynamic = "force-dynamic"
export const revalidate = 0

function milesFromMeters(meters?: number) {
  return Number((((meters ?? 16093) as number) / 1609.34).toFixed(1))
}

function mphFromMs(ms?: number) {
  return Number((((ms ?? 2.7) as number) * 2.23694).toFixed(1))
}

function buildExplanation(input: {
  clouds: number
  humidity: number
  visibilityMiles: number
  afterglowScore: number
}) {
  const parts: string[] = []

  if (input.clouds >= 20 && input.clouds <= 65) {
    parts.push("useful cloud texture")
  } else if (input.clouds < 20) {
    parts.push("clean sky but less cloud structure")
  } else {
    parts.push("heavier cloud cover risk")
  }

  if (input.visibilityMiles >= 8) {
    parts.push("strong visibility")
  } else if (input.visibilityMiles >= 5) {
    parts.push("moderate clarity")
  } else {
    parts.push("lower clarity")
  }

  if (input.humidity >= 40 && input.humidity <= 70) {
    parts.push("balanced moisture for glow")
  } else if (input.humidity > 70) {
    parts.push("higher humidity and possible haze")
  } else {
    parts.push("drier atmosphere")
  }

  if (input.afterglowScore >= 75) {
    parts.push("high afterglow potential")
  } else if (input.afterglowScore >= 55) {
    parts.push("good afterglow potential")
  } else {
    parts.push("limited afterglow upside")
  }

  return parts.join(" · ")
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const lat = Number(url.searchParams.get("lat") ?? "37.485")
  const lon = Number(url.searchParams.get("lon") ?? "-122.23")

  const data = await getOneCallWeather(lat, lon)

  const timezone = data.timezone ?? "America/Los_Angeles"
  const current = data.current
  const hourly = data.hourly ?? []

  if (!current?.sunset || !current?.dt) {
    return Response.json({ error: "Missing sunset data" }, { status: 500 })
  }

  const sunsetDate = unixSecondsToDate(current.sunset)
  const currentDate = unixSecondsToDate(current.dt)

  const peakStartDate = new Date(sunsetDate.getTime() - 2 * 60 * 1000)
  const peakEndDate = new Date(sunsetDate.getTime() + 8 * 60 * 1000)

  const sunElevation = getSolarElevation(currentDate, lat, lon)
  const visibilityMiles = milesFromMeters(current.visibility)
  const windMph = mphFromMs(current.wind_speed)

  const afterglowScore = estimateAfterglowScore({
    clouds: current.clouds ?? 40,
    humidity: current.humidity ?? 55,
    visibilityMiles,
    sunElevation,
  })

  const skyScore = calculateSkyScore({
    clouds: current.clouds ?? 40,
    humidity: current.humidity ?? 55,
    visibilityMiles,
    windMph,
    sunElevation,
    afterglowScore,
  })

  const ranked = rankLocations(locations, skyScore)
  const curve = buildSunElevationCurve(sunsetDate, lat, lon, 45, 45, 5)

  const nextHours = hourly.slice(0, 6).map((h) => {
    const d = unixSecondsToDate(h.dt)
    const elevation = getSolarElevation(d, lat, lon)
    const visMiles = milesFromMeters(h.visibility)
    const hourAfterglow = estimateAfterglowScore({
      clouds: h.clouds ?? 40,
      humidity: h.humidity ?? 55,
      visibilityMiles: visMiles,
      sunElevation: elevation,
    })

    return {
      localTime: formatInTimeZone(d, timezone),
      clouds: h.clouds ?? 40,
      humidity: h.humidity ?? 55,
      visibilityMiles: visMiles,
      windMph: mphFromMs(h.wind_speed),
      elevation: Number(elevation.toFixed(2)),
      afterglowScore: hourAfterglow,
    }
  })

  return Response.json(
    {
      lat,
      lon,
      timezone,
      currentLocalTime: formatInTimeZone(currentDate, timezone),
      sunsetLocalTime: formatInTimeZone(sunsetDate, timezone),
      peakWindow: {
        start: formatInTimeZone(peakStartDate, timezone),
        end: formatInTimeZone(peakEndDate, timezone),
      },
      skyScore,
      afterglowScore,
      explanation: buildExplanation({
        clouds: current.clouds ?? 40,
        humidity: current.humidity ?? 55,
        visibilityMiles,
        afterglowScore,
      }),
      liveConditions: {
        clouds: current.clouds ?? 40,
        humidity: current.humidity ?? 55,
        visibilityMiles,
        windMph,
        sunElevation: Number(sunElevation.toFixed(2)),
        summary: current.weather?.[0]?.description ?? "unknown",
      },
      nearbyRankedLocations: ranked,
      elevationCurve: curve,
      hourlyPreview: nextHours,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
