type OneCallCurrent = {
  dt: number
  sunrise?: number
  sunset?: number
  temp?: number
  humidity?: number
  clouds?: number
  visibility?: number
  wind_speed?: number
  weather?: Array<{ main?: string; description?: string }>
}

type OneCallHourly = {
  dt: number
  temp?: number
  humidity?: number
  clouds?: number
  visibility?: number
  wind_speed?: number
  weather?: Array<{ main?: string; description?: string }>
}

type OneCallResponse = {
  lat: number
  lon: number
  timezone?: string
  timezone_offset?: number
  current?: OneCallCurrent
  hourly?: OneCallHourly[]
}

export async function getOneCallWeather(lat: number, lon: number): Promise<OneCallResponse> {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error("Missing OPENWEATHER_API_KEY")
  }

  const url =
    `https://api.openweathermap.org/data/3.0/onecall` +
    `?lat=${lat}&lon=${lon}` +
    `&appid=${apiKey}` +
    `&units=imperial` +
    `&exclude=minutely,daily,alerts`

  const res = await fetch(url, {
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenWeather request failed: ${res.status} ${text}`)
  }

  return (await res.json()) as OneCallResponse
}

export function unixToLocalDate(unixSeconds: number, timezoneOffsetSeconds: number) {
  return new Date((unixSeconds + timezoneOffsetSeconds) * 1000)
}

export function formatLocalClock(unixSeconds: number, timezoneOffsetSeconds: number) {
  const d = unixToLocalDate(unixSeconds, timezoneOffsetSeconds)
  return d.toUTCString().slice(17, 22)
}
