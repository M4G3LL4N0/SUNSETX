export function generateSunsetReport(data: any) {
  const score = data.skyScore

  const rating =
    score >= 85 ? "INCREDIBLE" :
    score >= 75 ? "STRONG" :
    score >= 65 ? "DECENT" :
    "WEAK"

  const worthIt = score >= 70 ? "YES" : "NO"

  const bestSpot = data.nearbyRankedLocations?.[0]

  return {
    summary: {
      score,
      rating,
      worthIt,
    },

    timing: {
      goldenHour: "~1 hour before sunset",
      sunset: data.sunsetLocalTime,
      peakStart: data.peakWindow.start,
      peakEnd: data.peakWindow.end,
    },

    conditions: {
      clouds: data.liveConditions.clouds,
      humidity: data.liveConditions.humidity,
      visibility: data.liveConditions.visibilityMiles,
      wind: data.liveConditions.windMph,
      explanation: data.explanation,
    },

    recommendation: {
      bestLocation: bestSpot?.name || "Unknown",
      score: bestSpot?.score || score,
    },

    verdict:
      score >= 80
        ? "Go. This is a high-quality sunset with strong color potential."
        : score >= 65
        ? "Worth going if nearby."
        : "Skip tonight unless convenient.",
  }
}
