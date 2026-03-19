type Spot = {
  id?: string
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
  nearbyRankedLocations: Spot[]
  aiNarrative?: {
    title?: string
    intro?: string
    whyTonightIsGood?: {
      cloudStructure?: string
      atmosphere?: string
      wind?: string
    }
    whatToExpect?: string[]
    avoid?: string[]
    decision?: {
      goNoGo?: string
      bestMove?: string
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

function buildSummaryBullets(score: number) {
  if (score >= 80) {
    return [
      "Balanced cloud layer can help reflect color",
      "Good visibility supports a clearer horizon",
      "Atmospheric softness can enrich gradients without flattening the sky",
    ]
  }

  if (score >= 70) {
    return [
      "Some useful cloud structure can still create color payoff",
      "Moderate visibility supports a readable horizon",
      "There is enough atmospheric texture for a worthwhile sunset",
    ]
  }

  return [
    "Conditions are more mixed tonight",
    "Color may be softer and less dramatic",
    "A strong viewing spot matters more than usual",
  ]
}

export function generateSunsetReport(data: LiveScorePayload) {
  const spots = (data.nearbyRankedLocations ?? []).slice(0, 3)
  const bestSpot = spots[0]

  return {
    header: {
      title:
        data.aiNarrative?.title ??
        `SUNSETX REPORT — ${(data.cityLabel ?? "YOUR AREA").toUpperCase()}`,
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
      bullets: buildSummaryBullets(data.skyScore),
    },

    timing: {
      goldenHourStart: `~1 hour before ${data.sunsetLocalTime}`,
      peakWindow: `${data.peakWindow.start} – ${data.peakWindow.end}`,
      sunsetOfficial: data.sunsetLocalTime,
      afterglow: `${data.peakWindow.end} + ~15–20 min`,
      leaveBy: bestSpot
        ? `Leave by ~${Math.max(0, bestSpot.driveMinutes)} minutes before peak to reach ${bestSpot.name} on time`
        : "Leave 10–20 minutes before the peak window begins",
    },

    whyTonightIsGood: {
      cloudStructure:
        data.aiNarrative?.whyTonightIsGood?.cloudStructure ??
        "Useful cloud structure can catch warm light without fully blocking the horizon.",
      atmosphere:
        data.aiNarrative?.whyTonightIsGood?.atmosphere ??
        "Current visibility and air balance support cleaner color and readable gradients.",
      wind:
        data.aiNarrative?.whyTonightIsGood?.wind ??
        "Moderate wind helps prevent the sky from feeling dull or flat.",
    },

    conditions: {
      clouds: data.liveConditions.clouds,
      humidity: data.liveConditions.humidity,
      visibility: data.liveConditions.visibilityMiles,
      wind: data.liveConditions.windMph,
      explanation: data.explanation,
    },

    whatToExpect:
      data.aiNarrative?.whatToExpect?.length
        ? data.aiNarrative.whatToExpect
        : [
            "Strong gold → orange → pink gradient potential",
            "Best colors likely after the sun dips below the horizon",
            "Smooth, cinematic sky rather than chaotic storm drama",
          ],

    avoid:
      data.aiNarrative?.avoid?.length
        ? data.aiNarrative.avoid
        : [
            "Blocked western horizons",
            "Heavy waterfront if the smell or dampness hurts the experience",
            "Leaving late and missing the real peak",
          ],

    spots,

    decision: {
      goNoGo:
        data.aiNarrative?.decision?.goNoGo ??
        (data.skyScore >= 75 ? "GO — HIGH CONFIDENCE" : "GO — MODERATE CONFIDENCE"),
      bestMove:
        data.aiNarrative?.decision?.bestMove ??
        (bestSpot
          ? `Go to ${bestSpot.name}. Arrive before ${data.peakWindow.start}. Stay through afterglow.`
          : "Choose the highest-ranked nearby spot and arrive before peak."),
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
