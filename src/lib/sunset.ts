export async function getSunsetData(lat: number, lon: number) {
  const res = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`
  )

  const data = await res.json()

  return {
    sunset: data.results.sunset,
    sunrise: data.results.sunrise,
  }
}
