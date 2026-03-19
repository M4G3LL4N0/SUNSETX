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
  waterLabel: string  distanceMiles: number
  driveMinutes: number
}

type ApiResponse = {
  cityLabel?: string
  regionLabel?: string
  timezoneOffset?: number
  skyScore: number
  afterglowScore: number
  sunsetLocalTime: string
  peakWindow: {
    start: string
    end: string
  }
  explanation: string  liveConditions: {
    clouds: number    humidity: number
    visibilityMiles: number
    windMph: number
    sunElevation: number
    summary: string
  }
  closeSpots: Spot[]
  midRangeSpot: Spot | null
  premiumSpot: Spot | null
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

export function generateSunsetReport(data: ApiResponse) {
  const { skyScore, afterglowScore, sunsetLocalTime, peakWindow, explanation, liveConditions, closeSpots, midRangeSpot, premiumSpot, aiNarrative } = data

  // Group spots into tiers
  const quickOptions = closeSpots
    .filter(spot => spot.driveMinutes >= 5 && spot.driveMinutes <= 15)
    .slice(0, 3) // Top 3 quick options

  const premiumOption = midRangeSpot || premiumSpot || (closeSpots.find(spot => spot.driveMinutes > 30) || null)

  const regionalDestination = premiumSpot || (closeSpots.find(spot => spot.driveMinutes > 60) || null)

  const worthIt = `SUNSETX Score: ${skyScore}/100 • Afterglow: ${afterglowScore}/100`
  const timeline = `Peak window: ${peakWindow.start} – ${peakWindow.end}`
  const whyTonightIsGood = aiNarrative?.whyTonightIsGood?.cloudStructure || explanation.split("·")[0] || "Balanced cloud layer for color reflection"
  const whatToExpect = aiNarrative?.whatToExpect || [
    "Warm gold, orange, and pink gradient potential",
    "Best colors likely after the sun dips below the horizon",
    "A smoother cinematic sky rather than chaotic storm drama"
  ]
  const whatToAvoid = aiNarrative?.avoid || [
    "Blocked western horizons",
    "Leaving too late and missing the peak",
    "Low-value spots with poor panorama or awkward access"
  ]
  const goNoGo = aiNarrative?.decision?.goNoGo || "GO — HIGH CONFIDENCE"
  const bestMove = aiNarrative?.decision?.bestMove || "Go to Junipero Serra Park and arrive before the peak window."

  return {
    sunsetScore: skyScore,
    worthIt,
    timeline,
    whyTonightIsGood,
    whatToExpect,
    whatToAvoid,
    goNoGo,
    bestMove,
    recommendations: {
      quickOptions,
      premiumOption,
      regionalDestination    }
  }
}
