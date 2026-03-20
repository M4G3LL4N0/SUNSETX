export type SunsetSpot = {
  id: string
  name: string
  address: string
  lat: number
  lon: number
  score: number
  spotScore: number
  scent: number
  smellLabel: string
  parkingLabel: string
  vibeLabel: string
  bestFor: string
  whyItWins: string
  panoramaLabel: string
  easeLabel: string
  waterLabel: string
  woodsyBias: number
  driveMinutes: number
  distanceMiles: number
  reasons: string[]
  tier: "close" | "mid" | "destination"
}

export function buildStaticLocations(lat: number, lon: number): SunsetSpot[] {
  return [
    {
      id: "spot-1",
      name: "Nearby Hill Overlook",
      address: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      lat: lat + 0.018,
      lon: lon - 0.022,
      score: 91,
      spotScore: 91,
      scent: 0.92,
      smellLabel: "clean, woodsy, fresh air",
      parkingLabel: "Easy",
      vibeLabel: "Quiet, scenic",
      bestFor: "fast access and elevated views",
      whyItWins: "Elevated angle and open western exposure make it the strongest quick option.",
      panoramaLabel: "Open hillside panorama",
      easeLabel: "Very easy",
      waterLabel: "Low water smell risk",
      woodsyBias: 0.92,
      driveMinutes: 9,
      distanceMiles: 3.2,
      reasons: ["elevated view", "open horizon"],
      tier: "close",
    },
    {
      id: "spot-2",
      name: "Scenic Park Vista",
      address: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      lat: lat + 0.024,
      lon: lon + 0.031,
      score: 87,
      spotScore: 87,
      scent: 0.86,
      smellLabel: "grass, light trees, fresh",
      parkingLabel: "Easy",
      vibeLabel: "Calm, open",
      bestFor: "balanced sunset quality",
      whyItWins: "A clean horizon and simple access make it a reliable nearby choice.",
      panoramaLabel: "Wide park-facing sky",
      easeLabel: "Easy",
      waterLabel: "Low water smell risk",
      woodsyBias: 0.78,
      driveMinutes: 12,
      distanceMiles: 4.8,
      reasons: ["easy access", "wide sky"],
      tier: "close",
    },
    {
      id: "spot-3",
      name: "Bay View Point",
      address: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      lat: lat - 0.015,
      lon: lon - 0.041,
      score: 84,
      spotScore: 84,
      scent: 0.74,
      smellLabel: "clean air, slight water",
      parkingLabel: "Moderate",
      vibeLabel: "Open, airy",
      bestFor: "wide sky and reflections",
      whyItWins: "A broad horizon gives sunset color room to spread.",
      panoramaLabel: "Open shoreline sky",
      easeLabel: "Easy",
      waterLabel: "Moderate water presence",
      woodsyBias: 0.35,
      driveMinutes: 15,
      distanceMiles: 6.4,
      reasons: ["water reflections", "open exposure"],
      tier: "close",
    }
  ]
}
