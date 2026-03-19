export async function getSunsetData(lat: number, lon: number) {
  const res = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch sunset data")
  }

  const data = await res.json()

  return {
    sunset: data.results.sunset as string,
    sunrise: data.results.sunrise as string,
  }
}
