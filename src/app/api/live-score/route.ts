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
import { getUserPreferences, personalizeSpotScore } from "@/lib/preferences"

export const dynamic = "force-dynamic"
export const revalidate = 0

function milesFromMeters(meters?: number) {
  return Number((((meters ?? 16093) as number) / 1609.34).toFixed(1))
}

function mphFromMs(ms?: number) {
  return Number((((ms ?? 2.7) as number) * 2.23694).toFixed(1))
}

function inferCityLabel(lat: number, lon: number) {
  // Bay Area detection
  if (lat > 37.4 && lat < 38 && lon > -122.6 && lon < -121.5) {
    if (lat > 37.58 && lat < 37.63 && lon < -122.35 && lon > -122.42) return "Millbrae, CA"
    if (lat > 37.45 && lat < 37.51 && lon < -122.21 && lon > -122.29) return "Redwood City, CA"
    if (lat > 37.7 && lat < 37.8 && lon < -122.4 && lon > -122.5) return "San Francisco, CA"
    return "Bay Area, CA"
  }
  
  // Los Angeles detection
  if (lat > 33.8 && lat < 34.2 && lon > -118.5 && lon < -117.5) {
    return "Los Angeles, CA"
  }
  
  // New York detection
  if (lat > 40.5 && lat < 41.0 && lon > -74.3 && lon < -73.7) {
    return "New York, NY"
  }
  
  return "Your Area"
}

function inferRegionLabel(lat: number, lon: number) {
  // Bay Area regions
  if (lat > 37.4 && lat < 37.7 && lon < -122.2 && lon > -122.5) {
    return "Peninsula / South San Francisco Bay"
  }
  if (lat > 37.7 && lat < 38.0 && lon < -122.4 && lon > -122.5) {
    return "San Francisco"
  }
  if (lat > 37.8 && lat < 38.2 && lon < -122.1 && lon > -121.5) {
    return "East Bay"
  }
  
  // Los Angeles regions
  if (lat > 33.8 && lat < 34.2 && lon > -118.5 && lon < -117.5) {
    return "Los Angeles Basin"
  }
  
  return "Your Region"
}

function buildExplanation(input: {
  clouds: number  humidity: number
  visibilityMiles: number
  afterglowScore: number}) {
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

function buildFallbackNarrative(input: {
  cityLabel: string
  score: number
  sunsetLocalTime: string
  peakStart: string
  peakEnd: string
  explanation: string
  topSpotName?: string
}) {
  const rating =
    input.score >= 90
      ? "incredible"
      : input.score >= 80
      ? "strong"
      : input.score >= 70
      ? "good"
      : input.score >= 60
      ? "decent"
      : "weak"

  return {
    title: `SUNSETX REPORT — ${input.cityLabel.toUpperCase()}`,
    intro: `Tonight in ${input.cityLabel}, sunset conditions look ${rating}, with a SUNSETX score of ${input.score}/100 and a projected peak window from ${input.peakStart} to ${input.peakEnd}.`,
    whyTonightIsGood: {
      cloudStructure: "Useful cloud texture can help catch warm light without fully blocking the horizon.",
      atmosphere: "Visibility and atmospheric softness are balanced enough for color to show cleanly.",
      wind: "Moderate wind can help keep the sky from feeling flat and muddy.",
    },
    whatToExpect: [
      "Warm gold, orange, and pink gradient potential",
      "Best colors likely after the sun dips below the horizon",
      "A smoother cinematic sky rather than chaotic storm drama",
    ],
    avoid: [
      "Blocked western horizons",
      "Leaving too late and missing the peak",
      "Low-value spots with poor panorama or awkward access",
    ],
    decision: {
      goNoGo: input.score >= 75 ? "GO — HIGH CONFIDENCE" : "GO — MODERATE CONFIDENCE",
      bestMove: `Go to ${input.topSpotName ?? "the top nearby spot"} and arrive before ${input.peakStart}.`,
    },
    source: "fallback",
    explanation: input.explanation,
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const lat = Number(url.searchParams.get("lat") ?? "37.5985")
    const lon = Number(url.searchParams.get("lon") ?? "-122.3872")
    const userKey = url.searchParams.get("userKey") ?? "anonymous"

    const current = await getCurrentWeather(lat, lon)
    const forecast = await getForecastWeather(lat, lon)
    const prefs = await getUserPreferences(userKey)

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

    // Get categorized spots
    const spotGroups = getClosestRankedSpots(lat, lon, locations, skyScore)
    
    // Personalize the scores for all spot groups    const personalizeSpot = (spot: any) => spot ? {
      ...spot,
      score: personalizeSpotScore(spot, prefs),
    } : null

    const closeSpots = spotGroups.closeSpots.map(personalizeSpot)
    const midRangeSpot = personalizeSpot(spotGroups.midRangeSpot)
    const premiumSpot = personalizeSpot(spotGroups.premiumSpot)

    const cityLabel = inferCityLabel(lat, lon)
    const regionLabel = inferRegionLabel(lat, lon)

    const explanation = buildExplanation({
      clouds: current.clouds?.all ?? 40,
      humidity: current.main?.humidity ?? 55,
      visibilityMiles,
      afterglowScore,
    })

    const aiNarrative = buildFallbackNarrative({
      cityLabel,
      score: skyScore,
      sunsetLocalTime: formatWithOffset(sunsetDate, timezoneOffset),
      peakStart: formatWithOffset(peakStartDate, timezoneOffset),
      peakEnd: formatWithOffset(peakEndDate, timezoneOffset),
      explanation,
      topSpotName: closeSpots[0]?.name,
    })

    return Response.json(
      {
        cityLabel,
        regionLabel,
        timezoneOffset,
        userPreferences: prefs,
        currentLocalTime: formatWithOffset(currentDate, timezoneOffset),
        sunsetLocalTime: formatWithOffset(sunsetDate, timezoneOffset),
        peakWindow: {
          start: formatWithOffset(peakStartDate, timezoneOffset),
          end: formatWithOffset(peakEndDate, timezoneOffset),
        },
        skyScore,
        afterglowScore,
        explanation,
        liveConditions: {
          clouds: current.clouds?.all ?? 40,
          humidity: current.main?.humidity ?? 55,
          visibilityMiles,
          windMph,
          sunElevation: Number(sunElevation.toFixed(2)),
          summary: current.weather?.[0]?.description ?? "unknown",
        },
        closeSpots,
        midRangeSpot,
        premiumSpot,
        elevationCurve: buildSunElevationCurve(sunsetDate, lat, lon, 45, 45, 5),
        aiNarrative,
        aiStatus: "live",
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown live-score error",
      },
      { status: 500 }
    )
  }
}
