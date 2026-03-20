import { calculateSkyScore } from './scoring'
import { getWeather } from './weather'
import { calculateScentScore } from './scent'
import { sunsetXScore } from './finalScore'
import { getSunsetData } from './sunset'

type LocationEnv = {
  type: 'hill' | 'park' | 'coastal' | 'urban'
  elevation: number
  openness: number
  vegetation: number
  pollution: number
}

type NearbySpot = {
  name: string
  driveMinutes: number
  distanceMiles: number
  score: number
  elevationScore: number
  opennessScore: number
  scentScore: number
  crowdPenalty: number
  reasons: string[]
}

function generateEnvironment(lat: number, lon: number): LocationEnv {
  // Simplified environment classifier
  const isCoastal = Math.abs(lon) > 122.4 && lat < 37.8
  const isUrban = lat > 37.6 && lon < -122.2
  
  if (isCoastal) return {
    type: 'coastal',
    elevation: 0.3,
    openness: 0.9,
    vegetation: 0.5,
    pollution: 0.2
  }
  
  if (isUrban) return {
    type: 'urban',
    elevation: 0.7,
    openness: 0.6, 
    vegetation: 0.3,
    pollution: 0.5
  }

  return {
    type: 'park',
    elevation: 0.4,
    openness: 0.7,
    vegetation: 0.8,
    pollution: 0.1
  }
}

async function calculateSpotScores(
  lat: number, 
  lon: number,
  driveMinutes: number
): Promise<{score: number; reasons: string[]}> {
  const [weather, solarData] = await Promise.all([
    getWeather(lat, lon),
    getSunsetData(lat, lon)
  ])

  const env = generateEnvironment(lat, lon)
  const skyScore = calculateSkyScore({
    clouds: weather.clouds,
    humidity: weather.humidity,
    visibilityMiles: weather.visibility,
    windMph: weather.windSpeed,
    sunElevation: solarData.elevation
  })

  const crowdPenalty = 1 - (driveMinutes / 200) // More remote = better
  
  const scentScore = calculateScentScore({
    vegetation: env.vegetation,
    pollution: env.pollution,
    humidity: weather.humidity,
    windQuality: 1 - (weather.windSpeed / 20),
    terrain: env.type === 'coastal' ? 0.9 : 0.7
  })

  const reasons = []
  if (env.openness > 0.7) reasons.push('open western horizon')
  if (env.elevation > 0.6) reasons.push('elevated view')
  if (env.type === 'coastal') reasons.push('clean ocean air')

  const score = sunsetXScore(
    skyScore * 0.4,
    env.elevation * 0.2,
    env.openness * 0.2,
    scentScore * 0.1,
    crowdPenalty * 0.1
  )

  return { score, reasons }
}

export async function generateNearbySpots(
  originLat: number,
  originLon: number
): Promise<NearbySpot[]> {
  // Generate 3 spots at different distances
  const nearbyLocations = [
    { 
      name: 'Close viewpoint', 
      driveMinutes: getRandBetween(8, 15),
      distanceMiles: getRandBetween(3, 7),
      lat: originLat + getRandBetween(-0.03, 0.03),
      lon: originLon + getRandBetween(-0.03, 0.03)
    },
    {
      name: 'Scenic overlook',
      driveMinutes: getRandBetween(18, 28),
      distanceMiles: getRandBetween(8, 15),
      lat: originLat + getRandBetween(-0.08, 0.08),
      lon: originLon + getRandBetween(-0.08, 0.08)
    },
    {
      name: 'Regional sunset spot',
      driveMinutes: getRandBetween(35, 55),
      distanceMiles: getRandBetween(16, 25),
      lat: originLat + getRandBetween(-0.15, 0.15),
      lon: originLon + getRandBetween(-0.15, 0.15)
    }
  ]

  const scoredSpots = await Promise.all(
    nearbyLocations.map(async (loc) => {
      const { score, reasons } = await calculateSpotScores(
        loc.lat,
        loc.lon,
        loc.driveMinutes
      )
      
      return {
        name: loc.name,
        driveMinutes: loc.driveMinutes,
        distanceMiles: loc.distanceMiles,
        score,
        elevationScore: generateEnvironment(loc.lat, loc.lon).elevation * 100,
        opennessScore: generateEnvironment(loc.lat, loc.lon).openness * 100,
        scentScore: generateEnvironment(loc.lat, loc.lon).vegetation * 100,
        crowdPenalty: (1 - (loc.driveMinutes / 200)) * 100,
        reasons
      }
    })
  )

  return scoredSpots.sort((a, b) => b.score - a.score)
}

function getRandBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}
