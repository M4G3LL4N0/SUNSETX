type WeatherInput = {
  clouds: number
  humidity: number
  visibility: number
  pollution?: number
}

export function calculateSkyScore(weather: WeatherInput) {
  const cloud = (weather.clouds ?? 40) / 100
  const humidity = (weather.humidity ?? 55) / 100
  const visibility = Math.min((weather.visibility ?? 10000) / 10000, 1)
  const pollution = weather.pollution ?? 0.2

  const score =
    0.3 * (1 - Math.abs(cloud - 0.5)) +
    0.2 * cloud +
    0.2 * visibility +
    0.15 * (1 - humidity) +
    0.15 * (1 - pollution)

  return Math.max(0, Math.min(100, Math.round(score * 100)))
}
