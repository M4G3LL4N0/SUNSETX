function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

function radToDeg(rad: number) {
  return (rad * 180) / Math.PI
}

function normalizeDegrees(deg: number) {
  let value = deg % 360
  if (value < 0) value += 360
  return value
}

export function getJulianDate(date: Date) {
  return date.getTime() / 86400000 + 2440587.5
}

export function getSolarElevation(date: Date, lat: number, lon: number) {
  const jd = getJulianDate(date)
  const n = jd - 2451545.0

  const L = normalizeDegrees(280.46 + 0.9856474 * n)
  const g = normalizeDegrees(357.528 + 0.9856003 * n)

  const lambda =
    L +
    1.915 * Math.sin(degToRad(g)) +
    0.02 * Math.sin(degToRad(2 * g))

  const epsilon = 23.439 - 0.0000004 * n

  const alpha = radToDeg(
    Math.atan2(
      Math.cos(degToRad(epsilon)) * Math.sin(degToRad(lambda)),
      Math.cos(degToRad(lambda))
    )
  )

  const delta = radToDeg(
    Math.asin(
      Math.sin(degToRad(epsilon)) * Math.sin(degToRad(lambda))
    )
  )

  const GMST = normalizeDegrees(280.46061837 + 360.98564736629 * (jd - 2451545))
  const LST = normalizeDegrees(GMST + lon)
  const H = normalizeDegrees(LST - alpha)
  const Hsigned = H > 180 ? H - 360 : H

  const elevation = radToDeg(
    Math.asin(
      Math.sin(degToRad(lat)) * Math.sin(degToRad(delta)) +
        Math.cos(degToRad(lat)) *
          Math.cos(degToRad(delta)) *
          Math.cos(degToRad(Hsigned))
    )
  )

  return elevation
}

export function buildSunElevationCurve(
  centerDate: Date,
  lat: number,
  lon: number,
  minutesBefore = 45,
  minutesAfter = 45,
  stepMinutes = 5
) {
  const points: Array<{ iso: string; elevation: number }> = []

  for (let offset = -minutesBefore; offset <= minutesAfter; offset += stepMinutes) {
    const d = new Date(centerDate.getTime() + offset * 60 * 1000)
    points.push({
      iso: d.toISOString(),
      elevation: Number(getSolarElevation(d, lat, lon).toFixed(2)),
    })
  }

  return points
}

export function estimateAfterglowScore(input: {
  clouds: number
  humidity: number
  visibilityMiles: number
  sunElevation: number
}) {
  const cloudBalance = 1 - Math.abs(input.clouds / 100 - 0.45)
  const humidityBalance = 1 - Math.abs(input.humidity / 100 - 0.55)
  const visibilityScore = Math.min(input.visibilityMiles / 10, 1)
  const twilightBandScore =
    input.sunElevation <= 0 && input.sunElevation >= -8
      ? 1
      : Math.max(0, 1 - Math.abs(input.sunElevation + 4) / 8)

  const raw =
    0.35 * cloudBalance +
    0.20 * humidityBalance +
    0.25 * visibilityScore +
    0.20 * twilightBandScore

  return Math.max(0, Math.min(100, Math.round(raw * 100)))
}
