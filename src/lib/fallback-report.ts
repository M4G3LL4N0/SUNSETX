export function buildFallbackNarrative(input: {
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
    sunsetLocalTime: input.sunsetLocalTime,
  }
}
