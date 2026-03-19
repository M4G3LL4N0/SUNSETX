export const dynamic = "force-dynamic"
export const revalidate = 0

type RankedSunset = {
  city: string
  country: string
  score: number
  why: string
  window: string
}

function seededScore(base: number, variance: number) {
  return Math.max(70, Math.min(99, base + Math.floor(Math.random() * variance)))
}

function buildBoard() {
  const today: RankedSunset[] = [
    {
      city: "Santorini",
      country: "Greece",
      score: seededScore(94, 4),
      window: "Today",
      why: "Layered high clouds, open sea horizon, and strong afterglow potential.",
    },
    {
      city: "Maui",
      country: "United States",
      score: seededScore(92, 4),
      window: "Today",
      why: "Clear western ocean line with balanced cloud texture and clean visibility.",
    },
    {
      city: "Cape Town",
      country: "South Africa",
      score: seededScore(91, 4),
      window: "Today",
      why: "Wide coastal horizon, dramatic sky structure, and strong late color carry.",
    },
  ]

  const tomorrow: RankedSunset[] = [
    {
      city: "Honolulu",
      country: "United States",
      score: seededScore(93, 4),
      window: "Tomorrow",
      why: "Excellent horizon openness with light cloud layering and reflective water.",
    },
    {
      city: "Lisbon",
      country: "Portugal",
      score: seededScore(90, 4),
      window: "Tomorrow",
      why: "Good atmospheric clarity and mid-cloud structure without heavy blockage.",
    },
    {
      city: "Sydney",
      country: "Australia",
      score: seededScore(89, 4),
      window: "Tomorrow",
      why: "Balanced cloud pattern with broad harbor exposure and strong warm tones.",
    },
  ]

  const week: RankedSunset[] = [
    {
      city: "Malibu",
      country: "United States",
      score: seededScore(95, 4),
      window: "This week",
      why: "High-upside coastal horizon with layered cloud windows and vivid afterglow setup.",
    },
    {
      city: "Ibiza",
      country: "Spain",
      score: seededScore(93, 4),
      window: "This week",
      why: "Open water, strong horizon access, and repeated favorable evening structure.",
    },
    {
      city: "Bali",
      country: "Indonesia",
      score: seededScore(92, 4),
      window: "This week",
      why: "Consistent tropical color potential with reflective water and broad viewing angles.",
    },
  ]

  return {
    updatedAt: new Date().toISOString(),
    today: today.sort((a, b) => b.score - a.score),
    tomorrow: tomorrow.sort((a, b) => b.score - a.score),
    week: week.sort((a, b) => b.score - a.score),
  }
}

export async function GET() {
  return Response.json(buildBoard(), {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
