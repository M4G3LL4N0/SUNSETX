import { sunsetXScore } from "@/lib/finalScore"

type Location = {
  name: string
  lat: number
  lon: number
  spotScore: number
  scent: number
}

export function rankLocations(locations: Location[], skyScore: number) {
  return locations
    .map((loc) => {
      const score = sunsetXScore(skyScore, loc.scent * 100, loc.spotScore)
      return { ...loc, score }
    })
    .sort((a, b) => b.score - a.score)
}
