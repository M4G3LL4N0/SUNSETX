import { calculateSkyScore } from "./scoring"
import { calculateScentScore } from "./scent"
import { sunsetXScore } from "./finalScore"

const weather = {
  clouds: 40,
  humidity: 60,
  visibility: 9000,
  pollution: 0.2
}

const env = {
  vegetation: 0.8,
  pollution: 0.2,
  humidity: 0.5,
  windQuality: 0.7,
  terrain: 0.8
}

const sky = calculateSkyScore(weather)
const scent = calculateScentScore(env)
const final = sunsetXScore(sky, scent, 85)

console.log({ sky, scent, final })
