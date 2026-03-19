export async function getWeather(lat: number, lon: number) {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return {
      clouds: 40,
      humidity: 55,
      visibility: 10000,
      windSpeed: 3,
      pollution: 0.2,
    }
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    return {
      clouds: 40,
      humidity: 55,
      visibility: 10000,
      windSpeed: 3,
      pollution: 0.2,
    }
  }

  const data = await res.json()

  return {
    clouds: data?.clouds?.all ?? 40,
    humidity: data?.main?.humidity ?? 55,
    visibility: data?.visibility ?? 10000,
    windSpeed: data?.wind?.speed ?? 3,
    pollution: 0.2,
  }
}
