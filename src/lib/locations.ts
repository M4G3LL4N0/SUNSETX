export type SunsetSpot = {
  id: string
  name: string
  address: string
  region: string
  lat: number
  lon: number
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
}

export const locations: SunsetSpot[] = [
  {
    id: "junipero-serra-park",
    name: "Junipero Serra Park",
    address: "1801 Crystal Springs Rd, San Bruno, CA 94066",
    region: "Peninsula / South San Francisco Bay",
    lat: 37.6389,
    lon: -122.4169,
    spotScore: 91,
    scent: 0.95,
    smellLabel: "pine, dry grass, woodsy",
    parkingLabel: "Easy",
    vibeLabel: "Quiet, natural, panoramic",
    bestFor: "woodsy smell, elevation, panoramic west views",
    whyItWins: "Perfect combo of elevation, trees, clean air, and open horizon.",
    panoramaLabel: "Wide west-facing hillside",
    easeLabel: "Very easy",
    waterLabel: "Low water smell risk",
    woodsyBias: 1.0,
  },
  {
    id: "bayfront-park",
    name: "Bayfront Park",
    address: "1600 Bayshore Hwy, Burlingame, CA 94010",
    region: "Peninsula / South San Francisco Bay",
    lat: 37.5898,
    lon: -122.3639,
    spotScore: 84,
    scent: 0.75,
    smellLabel: "clean, slight water, generally mild",
    parkingLabel: "Easy",
    vibeLabel: "Open, airy, reflective",
    bestFor: "open sky, reflections, easy access",
    whyItWins: "Less woodsy, but a very open sky makes color spread wider.",
    panoramaLabel: "Open shoreline sky",
    easeLabel: "Very easy",
    waterLabel: "Moderate water presence",
    woodsyBias: 0.35,
  },
  {
    id: "skyline-college-hills",
    name: "Skyline College Hills",
    address: "3300 College Dr, San Bruno, CA 94066",
    region: "Peninsula / South San Francisco Bay",
    lat: 37.6305,
    lon: -122.4682,
    spotScore: 88,
    scent: 0.9,
    smellLabel: "dry grass, hillside, fresh air",
    parkingLabel: "Easy",
    vibeLabel: "Elevated, expansive, quiet",
    bestFor: "elevation, hillside air, stronger sky intensity",
    whyItWins: "Elevation amplifies sunset intensity and gives a bigger sky feel.",
    panoramaLabel: "High hillside panorama",
    easeLabel: "Easy",
    waterLabel: "Low water smell risk",
    woodsyBias: 0.85,
  },
  {
    id: "edgewood-park",
    name: "Edgewood Park",
    address: "1600 Edgewood Rd, Redwood City, CA 94062",
    region: "Peninsula / South San Francisco Bay",
    lat: 37.4694,
    lon: -122.3071,
    spotScore: 90,
    scent: 0.95,
    smellLabel: "oak woodland, dry grass, clean nature",
    parkingLabel: "Easy",
    vibeLabel: "Calm, woodsy, scenic",
    bestFor: "clean smell, low friction, natural vibe",
    whyItWins: "Excellent woodsy scent profile with meadow openness and clean air.",
    panoramaLabel: "Meadow + hillside opening",
    easeLabel: "Easy",
    waterLabel: "Very low water smell risk",
    woodsyBias: 1.0,
  },
  {
    id: "stafford-park",
    name: "Stafford Park",
    address: "King St & Hopkins Ave, Redwood City, CA 94062",
    region: "Peninsula / South San Francisco Bay",
    lat: 37.487,
    lon: -122.246,
    spotScore: 84,
    scent: 0.85,
    smellLabel: "slightly wooded, fresh hillside",
    parkingLabel: "Easy",
    vibeLabel: "Neighborhood overlook",
    bestFor: "quick access and elevation",
    whyItWins: "Fast in-and-out sunset option with elevation and pleasant air.",
    panoramaLabel: "Compact overlook",
    easeLabel: "Very easy",
    waterLabel: "Low water smell risk",
    woodsyBias: 0.75,
  },
  {
    id: "crystal-springs-overlook",
    name: "Crystal Springs Overlook",
    address: "2600 Skyline Blvd, Burlingame, CA 94010",
    region: "Peninsula / South San Francisco Bay",
    lat: 37.5797,
    lon: -122.3816,
    spotScore: 86,
    scent: 0.9,
    smellLabel: "eucalyptus, grass, cool hillside air",
    parkingLabel: "Moderate",
    vibeLabel: "Scenic, elevated, breezy",
    bestFor: "panoramic hillside sunset",
    whyItWins: "Strong elevation and fresh hillside air support a premium sunset feel.",
    panoramaLabel: "Wide scenic overlook",
    easeLabel: "Easy to moderate",
    waterLabel: "Low water smell risk",
    woodsyBias: 0.82,
  }
]
