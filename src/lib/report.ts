type ClosestSpot = {
  name: string
  address: string
  score: number
  spotScore: number
  scent: number
  smellLabel: string
  parkingLabel: string
  vibeLabel: string
  bestFor: string
  whyItWins: string
  panoramaLabel: string
  easeLabel: string
  waterLabel: string
  distanceMiles: number
  driveMinutes: number
}

type LiveScorePayload = {
  cityLabel?: string
  regionLabel?: string
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
  nearbyRankedLocations: ClosestSpot[]
  aiNarrative?: {
    title: string
    intro: string
    whyTonightIsGood: {
      cloudStructure: string
      atmosphere: string
      wind: string
    }
    whatToExpect: string[]
    avoid: string[]
    decision: {
      goNoGo: string
      bestMove: string
    }
  }
}

function getRating(score: number) {
  if (score >= 90) return "INCREDIBLE"
  if (score >= 80) return "STRONG SUNSET POTENTIAL"
  if (score >= 70) return "GOOD SUNSET POTENTIAL"
  if (score >= 60) return "DECENT SUNSET POTENTIAL"
  return "WEAK SUNSET POTENTIAL"
}

function getWorthIt(score: number) {
  return score >= 70 ? "YES" : "NO"
}

function getAfterglowWindow(peakEnd: string) {
  return `${peakEnd} + ~15–20 min`
}

export function generateSunsetReport(data: LiveScorePayload) {
  return {
    header: {
      title:
        data.aiNarrative?.title ??
        `SUNSETX REPORT — ${(data.cityLabel ?? "Your Area").toUpperCase()}`,
      dateLabel: "Tonight",
      regionLabel: data.regionLabel ?? "Nearby region",
      preferenceLabel: "Closest quality spots • clean smell • low friction • easy access",
      intro:
        data.aiNarrative?.intro ??
        `Tonight in ${data.cityLabel ?? "your area"}, conditions show a ${data.skyScore}/100 sunset setup with visible upside during the peak window.`,
    },

    summary: {
      score: data.skyScore,
      rating: getRating(data.skyScore),
      worthIt: getWorthIt(data.skyScore),
      bullets: [
        "Balanced cloud layer can help reflect color",
        "Visibility supports a readable horizon",
        "Atmospheric softness can enrich gradients without flattening the sky",
      ],
    },

    timing: {
      goldenHourStart: `~1 hour before ${data.sunsetLocalTime}`,
      peakWindow: `${data.peakWindow.start} – ${data.peakWindow.end}`,
      sunsetOfficial: data.sunsetLocalTime,
      afterglow: getAfterglowWindow(data.peakWindow.end),
      leaveBy: "Leave 10–20 minutes before the peak window begins",
    },

    whyTonightIsGood:
      data.aiNarrative?.whyTonightIsGood ?? {
        cloudStructure: "Useful cloud structure can catch warm light without fully blocking the horizon.",
        atmosphere: "Current visibility and air balance support cleaner color and readable gradients.",
        wind: "Moderate wind helps prevent the sky from feeling dull or flat.",
      },

    conditions: {
      clouds: data.liveConditions.clouds,
      humidity: data.liveConditions.humidity,
      visibility: data.liveConditions.visibilityMiles,
      wind: data.liveConditions.windMph,
      explanation: data.explanation,
    },

    whatToExpect:
      data.aiNarrative?.whatToExpect ?? [
        "Strong gold → orange → pink gradient potential",
        "Best colors likely after the sun dips below the horizon",
        "Smooth, cinematic sky rather than chaotic storm drama",
      ],

    avoid:
      data.aiNarrative?.avoid ?? [
        "Blocked western horizons",
        "Heavy waterfront if the smell or dampness hurts the experience",
        "Leaving late and missing the real peak",
      ],

    spots: data.nearbyRankedLocations,

    decision:
      data.aiNarrative?.decision ?? {
        goNoGo: data.skyScore >= 75 ? "GO — HIGH CONFIDENCE" : "GO — MODERATE CONFIDENCE",
        bestMove: `Go to ${data.nearbyRankedLocations[0]?.name ?? "the top nearby spot"} and arrive before ${data.peakWindow.start}. Stay through afterglow.`,
      },

    productInsight: {
      title: "SUNSETX core product layer",
      combinedSignals: [
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
