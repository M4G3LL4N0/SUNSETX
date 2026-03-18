import { sunsetXScore } from "./finalScore"

export function rankLocations(locations: any[], skyScore: number) {
  return locations
    .map((loc) => {
      const score = sunsetXScore(
        skyScore,
        loc.scent * 100,
        loc.spotScore
      )
      return { ...loc, score }
    })
    .sort((a, b) => b.score - a.score)
}
