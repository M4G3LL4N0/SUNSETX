type SunsetScoreInput = {
  clouds: number
  humidity: number
  visibilityMiles: number
  windMph: number
  sunElevation: number
  afterglowScore: number
}

export function calculateSkyScore(input: SunsetScoreInput) {
  const cloudStructure = 1 - Math.abs(input.clouds / 100 - 0.45)
  const humidityBalance = 1 - Math.abs(input.humidity / 100 - 0.55)
  const visibilityScore = Math.min(input.visibilityMiles / 10, 1)
  const windBalance = 1 - Math.min(Math.abs(input.windMph - 6) / 16, 1)

  const goldenBand =
    input.sunElevation <= 2 && input.sunElevation >= -8
      ? 1
      : Math.max(0, 1 - Math.abs(input.sunElevation + 2) / 10)

  const raw =
    0.25 * cloudStructure +
    0.14 * humidityBalance +
    0.18 * visibilityScore +
    0.08 * windBalance +
    0.15 * goldenBand +
    0.20 * (input.afterglowScore / 100)

  return Math.max(0, Math.min(100, Math.round(raw * 100)))
}
