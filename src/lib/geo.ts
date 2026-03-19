import type { SunsetSpot } from "@/lib/locations"

export function toRadians(value: number) {
  return (value * Math.PI) / 180
}

export function haversineMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 3958.8
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(1))
}

export function estimateDriveMinutes(distanceMiles: number) {
  if (distanceMiles <= 2) return 6
  if (distanceMiles <= 4) return 9
  if (distanceMiles <= 7) return 14
  if (distanceMiles <= 10) return 18
  return Math.round(distanceMiles * 2.2)
}

export function getClosestRankedSpots(
  userLat: number,
  userLon: number,
  spots: SunsetSpot[],
  skyScore: number
) {
  return spots
    .map((spot) => {
      const distanceMiles = haversineMiles(userLat, userLon, spot.lat, spot.lon)
      const driveMinutes = estimateDriveMinutes(distanceMiles)

      const distancePenalty =
        distanceMiles <= 2 ? 0 :
        distanceMiles <= 5 ? 2 :
        distanceMiles <= 8 ? 4 :
        distanceMiles <= 12 ? 7 : 10

      const score = Math.max(
        0,
        Math.round(
          0.45 * skyScore +
          0.30 * spot.spotScore +
          0.15 * Math.round(spot.scent * 100) +
          0.10 * Math.round(spot.woodsyBias * 100) -
          distancePenalty
        )
      )

      return {
        ...spot,
        distanceMiles,
        driveMinutes,
        score,
      }
    })
    .sort((a, b) => a.distanceMiles - b.distanceMiles || b.score - a.score)
    .slice(0, 3)
}
