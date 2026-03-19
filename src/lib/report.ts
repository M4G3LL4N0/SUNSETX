type RankedLocation = {
  name: string
  lat: number
  lon: number
  spotScore: number
  scent: number
  score: number
  address?: string
  smellLabel?: string
  parkingLabel?: string
  vibeLabel?: string
  whyItWins?: string
  bestFor?: string
}

type LiveScorePayload = {
  skyScore: number
  afterglowScore: number
  sunsetLocalTime: string
  peakWindow: {
    start: string
    end: string
  }
  explanation: string
  liveConditions: {
    clouds: number
    humidity: number
    visibilityMiles: number
    windMph: number
    sunElevation: number
    summary: string
  }
  nearbyRankedLocations: RankedLocation[]
}

function getRating(score: number) {
  if (score >= 90) return "INCREDIBLE"
  if (score >= 80) return "STRONG"
  if (score >= 70) return "GOOD"
  if (score >= 60) return "DECENT"
  return "WEAK"
}

function getWorthIt(score: number) {
  return score >= 70 ? "YES" : "NO"
}

function getGoldenHourStart(sunsetLocalTime: string) {
  return `~1 hour before ${sunsetLocalTime}`
}

function getAfterglowEnd(peakEnd: string) {
  return `~15–20 min after ${peakEnd}`
}

function buildWhatToExpect(score: number, afterglowScore: number) {
  const items: string[] = []

  if (score >= 80) {
    items.push("Strong gold → orange → pink gradient potential")
  } else if (score >= 70) {
    items.push("Good warm-toned sky with moderate color payoff")
  } else {
    items.push("More subtle sunset with limited dramatic color")
  }

  if (afterglowScore >= 75) {
    items.push("Best colors likely after the sun dips below the horizon")
  } else {
    items.push("Color may peak closer to official sunset")
  }

  items.push("Smooth, cinematic sky more likely than chaotic storm drama")

  return items
}

function buildAvoidList() {
  return [
    "Low valley areas with blocked western horizon",
    "Heavy waterfront if smell or damp air is unpleasant",
    "Leaving late and arriving after the peak window starts",
  ]
}

function buildWhyTonightIsGood(data: LiveScorePayload) {
  const cloudText =
    data.liveConditions.clouds >= 20 && data.liveConditions.clouds <= 60
      ? "Ideal cloud structure with enough texture to catch warm light"
      : data.liveConditions.clouds < 20
      ? "Cleaner sky with less cloud texture but strong visibility"
      : "Heavier cloud cover adds drama but may reduce direct horizon color"

  const atmosphereText =
    data.liveConditions.visibilityMiles >= 8
      ? "Good atmospheric clarity with strong visibility"
      : "Moderate clarity with some softness in the air"

  const windText =
    data.liveConditions.windMph >= 3 && data.liveConditions.windMph <= 12
      ? "Moderate wind helps keep the sky from going flat"
      : "Wind conditions are less ideal but still workable"

  return {
    cloudStructure: cloudText,
    atmosphere: atmosphereText,
    wind: windText,
  }
}

export function generateSunsetReport(data: LiveScorePayload) {
  const score = data.skyScore
  const topSpots = data.nearbyRankedLocations ?? []
  const bestSpot = topSpots[0]

  return {
    summary: {
      score,
      rating: getRating(score),
      worthIt: getWorthIt(score),
    },

    timing: {
      goldenHourStart: getGoldenHourStart(data.sunsetLocalTime),
      sunset: data.sunsetLocalTime,
      peakStart: data.peakWindow.start,
      peakEnd: data.peakWindow.end,
      afterglow: getAfterglowEnd(data.peakWindow.end),
      leaveBy: "Leave 10–20 minutes before peak begins",
    },

    whyTonightIsGood: buildWhyTonightIsGood(data),

    conditions: {
      clouds: data.liveConditions.clouds,
      humidity: data.liveConditions.humidity,
      visibility: data.liveConditions.visibilityMiles,
      wind: data.liveConditions.windMph,
      explanation: data.explanation,
    },

    whatToExpect: buildWhatToExpect(score, data.afterglowScore),

    avoid: buildAvoidList(),

    spots: topSpots,

    decision: {
      goNoGo: score >= 75 ? "GO — HIGH CONFIDENCE" : score >= 65 ? "GO — MODERATE CONFIDENCE" : "MAYBE / SKIP",
      bestMove: bestSpot
        ? `Go to ${bestSpot.name}. Arrive before ${data.peakWindow.start}. Stay through afterglow.`
        : "Choose the highest-ranked nearby spot and arrive before peak.",
    },

    productInsight: {
      title: "SUNSETX core product layer",
      items: [
        "weather",
        "terrain",
        "smell",
        "human experience",
        "timing optimization",
      ],
      becomes: [
        "daily report",
        "push notification",
        "leave now engine",
        "viral share card",
      ],
    },
  }
}
