export function calculateSkyScore(weather: any) {
  const cloud = weather.clouds / 100
  const humidity = weather.humidity / 100
  const visibility = weather.visibility / 10000

  const pollution = weather.pollution || 0.2

  const score =
    0.3 * (1 - Math.abs(cloud - 0.5)) +
    0.2 * cloud +
    0.2 * visibility +
    0.15 * (1 - humidity) +
    0.15 * (1 - pollution)

  return Math.round(score * 100)
}
