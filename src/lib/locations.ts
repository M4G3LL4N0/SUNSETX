export type SunsetSpot = {
  id: string
  name: string
  address: string
  driveMinutes: number
  distanceMiles: number
  score: number
  reasons: string[]
  tier: "close" | "mid" | "destination"
}

export function buildStaticLocations(lat: number, lon: number): SunsetSpot[] {
  return [
    {
      id: "spot-1",
      name: "Nearby Hill Overlook",
      address: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      driveMinutes: 9,
      distanceMiles: 3.2,
      score: 91,
      reasons: ["elevated view", "open horizon"],
      tier: "close",
    },
    {
      id: "spot-2",
      name: "Scenic Park Vista",
      address: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      driveMinutes: 12,
      distanceMiles: 4.8,
      score: 87,
      reasons: ["easy access", "wide sky"],
      tier: "close",
    },
    {
      id: "spot-3",
      name: "Bay View Point",
      address: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      driveMinutes: 15,
      distanceMiles: 6.4,
      score: 84,
      reasons: ["water reflections", "open exposure"],
      tier: "close",
    },
    {
      id: "spot-4",
      name: "Premium Ridge Lookout",
      address: `Within 30 minutes of ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      driveMinutes: 27,
      distanceMiles: 14.5,
      score: 93,
      reasons: ["high elevation", "less obstruction"],
      tier: "mid",
    },
    {
      id: "spot-5",
      name: "Regional Sunset Destination",
      address: `Top regional option from ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      driveMinutes: 52,
      distanceMiles: 34.8,
      score: 95,
      reasons: ["consistent sunsets", "wide horizon"],
      tier: "destination",
    },
  ]
}
