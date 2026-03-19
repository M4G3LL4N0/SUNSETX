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
import { getClosestRankedSpots } from "@/lib/geo"
import { generateAiSunsetNarrative } from "@/lib/openai-report"

export const dynamic = "force-dynamic"
export const revalidate = 0

function milesFromMeters(meters?: number) {
  return Number((((meters ?? 16093) as number) / 1609.34).toFixed(1))
}

function mphFromMs(ms?: number) {
  return Number((((ms ?? 2.7) as number) * 2.23694).toFixed(1))
}

function inferCityLabel(lat: number, lon: number) {
  if (lat > 37.58 && lat < 37.63 && lon < -122.35 && lon > -122.42) return "Millbrae, CA"
  if (lat > 37.45 && lat < 37.51 && lon < -122.21 && lon > -122.29) return "Redwood City, CA"
  return "Your Area"
}

function inferRegionLabel() {
  return "Peninsula / South San Francisco Bay"
}

function buildExplanation(input: {
  clouds: number
  humidity: number
  visibilityMiles: number
  afterglowScore: number
}) {
  const parts: string[] = []

  if (input.clouds >= 20 && input.clouds <= 65) {
    parts.push("balanced cloud layer for color reflection")
  } else if (input.clouds < 20) {
    parts.push("clean sky but lighter cloud texture")
  } else {
    parts.push("heavier cloud cover risk")
  }

  if (input.visibilityMiles >= 8) {
    parts.push("good visibility")
  } else if (input.visibilityMiles >= 5) {
    parts.push("moderate clarity")
  } else {
    parts.push("lower clarity")
  }

  if (input.humidity >= 40 && input.humidity <= 70) {
    parts.push("balanced atmospheric softness")
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
    const lat = Number(url.searchParams.get("lat") ?? "37.5985")
    const lon = Number(url.searchParams.get("lon") ?? "-122.3872")

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

    const peakStartDate = new Date(sunsetDate.getTime() - 5 * 60 * 1000)
    const peakEndDate = new Date(sunsetDate.getTime() + 5 * 60 * 1000)

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

    const closestSpots = getClosestRankedSpots(lat, lon, locations, skyScore)

    const cityLabel = inferCityLabel(lat, lon)
    const regionLabel = inferRegionLabel()

    const aiNarrative = await generateAiSunsetNarrative({
      cityLabel,
      regionLabel,
      score: skyScore,
      sunsetLocalTime: formatWithOffset(sunsetDate, timezoneOffset),
      peakStart: formatWithOffset(peakStartDate, timezoneOffset),
      peakEnd: formatWithOffset(peakEndDate, timezoneOffset),
      afterglow: `${formatWithOffset(peakEndDate, timezoneOffset)} + ~15–20 min`,
      explanation: buildExplanation({
        clouds: current.clouds?.all ?? 40,
        humidity: current.main?.humidity ?? 55,
        visibilityMiles,
        afterglowScore,
      }),
      clouds: current.clouds?.all ?? 40,
      humidity: current.main?.humidity ?? 55,
      visibility: visibilityMiles,
      wind: windMph,
      spots: closestSpots.map((spot) => ({
        name: spot.name,
        address: spot.address,
        score: spot.score,
        distanceMiles: spot.distanceMiles,
        driveMinutes: spot.driveMinutes,
        smellLabel: spot.smellLabel,
        parkingLabel: spot.parkingLabel,
        vibeLabel: spot.vibeLabel,
        bestFor: spot.bestFor,
        whyItWins: spot.whyItWins,
        panoramaLabel: spot.panoramaLabel,
        easeLabel: spot.easeLabel,
        waterLabel: spot.waterLabel,
      })),
    })

    return Response.json(
      {
        cityLabel,
        regionLabel,
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
        nearbyRankedLocations: closestSpots,
        elevationCurve: buildSunElevationCurve(sunsetDate, lat, lon, 45, 45, 5),
        aiNarrative,
        aiStatus: aiNarrative ? "live" : "fallback",
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
        hint: "Check OPENWEATHER_API_KEY and route dependencies.",
      },
      { status: 500 }
    )
  }
}
