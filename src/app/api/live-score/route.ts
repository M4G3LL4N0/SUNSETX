import {
  getCurrentWeather,
  getForecastWeather,
  unixSecondsToDate,
  formatWithOffset,
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
  try {
    const url = new URL(req.url)
    const lat = Number(url.searchParams.get("lat") ?? "37.485")
    const lon = Number(url.searchParams.get("lon") ?? "-122.23")

    const current = await getCurrentWeather(lat, lon)
    const forecast = await getForecastWeather(lat, lon)

    const timezoneOffset = current.timezone ?? forecast.city?.timezone ?? -25200
    const sunsetUnix = current.sys?.sunset ?? forecast.city?.sunset
    const currentUnix = current.dt

    if (!sunsetUnix || !currentUnix) {
      return Response.json(
        { error: "Missing sunset data from weather provider" },
        { status: 500 }
      )
    }

    const sunsetDate = unixSecondsToDate(sunsetUnix)
    const currentDate = unixSecondsToDate(currentUnix)

    const peakStartDate = new Date(sunsetDate.getTime() - 2 * 60 * 1000)
    const peakEndDate = new Date(sunsetDate.getTime() + 8 * 60 * 1000)

    const sunElevation = getSolarElevation(currentDate, lat, lon)
    const visibilityMiles = milesFromMeters(current.visibility)
    const windMph = mphFromMs(current.wind?.speed)

    const afterglowScore = estimateAfterglowScore({
      clouds: current.clouds?.all ?? 40,
      humidity: current.main?.humidity ?? 55,
      visibilityMiles,
      sunElevation,
    })

    const skyScore = calculateSkyScore({
      clouds: current.clouds?.all ?? 40,
      humidity: current.main?.humidity ?? 55,
      visibilityMiles,
      windMph,
      sunElevation,
      afterglowScore,
    })

    const ranked = rankLocations(locations, skyScore)
    const curve = buildSunElevationCurve(sunsetDate, lat, lon, 45, 45, 5)

    const nextHours = (forecast.list ?? []).slice(0, 6).map((h) => {
      const d = unixSecondsToDate(h.dt)
      const elevation = getSolarElevation(d, lat, lon)
      const visMiles = milesFromMeters(h.visibility)
      const hourAfterglow = estimateAfterglowScore({
        clouds: h.clouds?.all ?? 40,
        humidity: h.main?.humidity ?? 55,
        visibilityMiles: visMiles,
        sunElevation: elevation,
      })

      return {
        localTime: formatWithOffset(d, timezoneOffset),
        clouds: h.clouds?.all ?? 40,
        humidity: h.main?.humidity ?? 55,
        visibilityMiles: visMiles,
        windMph: mphFromMs(h.wind?.speed),
        elevation: Number(elevation.toFixed(2)),
        afterglowScore: hourAfterglow,
      }
    })

    return Response.json(
      {
        lat,
        lon,
        timezoneOffset,
        currentLocalTime: formatWithOffset(currentDate, timezoneOffset),
        sunsetLocalTime: formatWithOffset(sunsetDate, timezoneOffset),
        peakWindow: {
          start: formatWithOffset(peakStartDate, timezoneOffset),
          end: formatWithOffset(peakEndDate, timezoneOffset),
        },
        skyScore,
        afterglowScore,
        explanation: buildExplanation({
          clouds: current.clouds?.all ?? 40,
          humidity: current.main?.humidity ?? 55,
          visibilityMiles,
          afterglowScore,
        }),
        liveConditions: {
          clouds: current.clouds?.all ?? 40,
          humidity: current.main?.humidity ?? 55,
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown live-score error"

    return Response.json(
      {
        error: message,
        hint: "Check OPENWEATHER_API_KEY and provider plan.",
      },
      { status: 500 }
    )
  }
}
