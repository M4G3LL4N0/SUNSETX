export type GeneratedSpot = {
  id: string
  name: string
  address: string
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
  distanceMiles: number
  driveMinutes: number
  reasons: string[]
  tier: "close" | "mid" | "destination"
}

export function generateNearbySpots(lat: number, lon: number, skyScore = 82): GeneratedSpot[] {
  const base = Math.max(70, Math.min(99, skyScore))

  return [
    {
      id: "close-1",
      name: "Nearby Hill Overlook",
      address: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      score: Math.min(99, base + 6),
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
      distanceMiles: 3.2,
      driveMinutes: 9,
      reasons: ["elevated view", "quick access"],
      tier: "close",
    },
    {
      id: "close-2",
      name: "Scenic Park Vista",
      address: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      score: Math.min(99, base + 2),
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
      distanceMiles: 4.8,
      driveMinutes: 12,
      reasons: ["open sky", "easy parking"],
      tier: "close",
    },
    {
      id: "close-3",
      name: "Bay View Point",
      address: `Near ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      score: Math.min(99, base),
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
      distanceMiles: 6.4,
      driveMinutes: 15,
      reasons: ["wide horizon", "strong reflections"],
      tier: "close",
    },
    {
      id: "mid-1",
      name: "Premium Ridge Lookout",
      address: `Within 30 minutes of ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      score: Math.min(99, base + 8),
      spotScore: 93,
      scent: 0.9,
      smellLabel: "dry grass, cool ridge air",
      parkingLabel: "Moderate",
      vibeLabel: "Elevated, premium",
      bestFor: "bigger payoff if you drive farther",
      whyItWins: "Better elevation and horizon openness make it the best upgraded option.",
      panoramaLabel: "High ridge panorama",
      easeLabel: "Easy to moderate",
      waterLabel: "Low water smell risk",
      distanceMiles: 14.5,
      driveMinutes: 27,
      reasons: ["best within 30 min", "high elevation"],
      tier: "mid",
    },
    {
      id: "destination-1",
      name: "Regional Sunset Destination",
      address: `Best wider-area option from ${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      score: Math.min(99, base + 10),
      spotScore: 95,
      scent: 0.88,
      smellLabel: "clean coastal-hill air",
      parkingLabel: "Moderate",
      vibeLabel: "Destination-worthy",
      bestFor: "best overall sunset in the wider area",
      whyItWins: "Consistent horizon quality and stronger sunset payoff make it the standout destination.",
      panoramaLabel: "Signature western horizon",
      easeLabel: "Moderate",
      waterLabel: "Low to moderate water presence",
      distanceMiles: 34.8,
      driveMinutes: 52,
      reasons: ["regional favorite", "consistent sunsets"],
      tier: "destination",
    },
  ]
}
