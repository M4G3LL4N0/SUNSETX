type CurrentWeatherResponse = {
  coord?: { lat: number; lon: number }
  timezone?: number
  dt?: number
  visibility?: number
  clouds?: { all?: number }
  wind?: { speed?: number }
  main?: {
    temp?: number
    humidity?: number
  }
  weather?: Array<{ main?: string; description?: string }>
  sys?: {
    sunrise?: number
    sunset?: number
  }
  name?: string
}

type ForecastItem = {
  dt: number
  visibility?: number
  clouds?: { all?: number }
  wind?: { speed?: number }
  main?: {
    temp?: number
    humidity?: number
  }
  weather?: Array<{ main?: string; description?: string }>
}

type ForecastResponse = {
  city?: {
    timezone?: number
    sunrise?: number
    sunset?: number
    name?: string
  }
  list?: ForecastItem[]
}

export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeatherResponse> {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error("Missing OPENWEATHER_API_KEY")
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?lat=${lat}&lon=${lon}` +
    `&appid=${apiKey}` +
    `&units=imperial`

  const res = await fetch(url, { cache: "no-store" })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Current weather failed: ${res.status} ${text}`)
  }

  return (await res.json()) as CurrentWeatherResponse
}

export async function getForecastWeather(lat: number, lon: number): Promise<ForecastResponse> {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error("Missing OPENWEATHER_API_KEY")
  }

  const url =
    `https://api.openweathermap.org/data/2.5/forecast` +
    `?lat=${lat}&lon=${lon}` +
    `&appid=${apiKey}` +
    `&units=imperial`

  const res = await fetch(url, { cache: "no-store" })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Forecast failed: ${res.status} ${text}`)
  }

  return (await res.json()) as ForecastResponse
}

export function unixSecondsToDate(unixSeconds: number) {
  return new Date(unixSeconds * 1000)
}

export function formatWithOffset(date: Date, timezoneOffsetSeconds: number) {
  const shifted = new Date(date.getTime() + timezoneOffsetSeconds * 1000)

  return shifted.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}
