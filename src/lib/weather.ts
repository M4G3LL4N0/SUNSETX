export async function getWeather(lat: number, lon: number) {
  const apiKey = process.env.OPENWEATHER_API_KEY

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  )

  const data = await res.json()

  return {
    clouds: data.clouds.all,
    humidity: data.main.humidity,
    visibility: data.visibility,
    windSpeed: data.wind.speed,
  }
}
