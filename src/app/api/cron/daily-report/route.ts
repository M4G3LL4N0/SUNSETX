import { saveDailyReport } from "@/lib/daily-reports"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const trackedLocations = [
      { cityLabel: "Millbrae, CA", regionLabel: "Peninsula / South San Francisco Bay", lat: 37.5985, lon: -122.3872 },
      { cityLabel: "Redwood City, CA", regionLabel: "Peninsula / South San Francisco Bay", lat: 37.485, lon: -122.23 },
      { cityLabel: "San Francisco, CA", regionLabel: "San Francisco", lat: 37.7749, lon: -122.4194 },
    ]

    const today = new Date().toISOString().slice(0, 10)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sunsetx.vercel.app"

    for (const loc of trackedLocations) {
      const res = await fetch(
        `${baseUrl}/api/live-score?lat=${loc.lat}&lon=${loc.lon}`,
        { cache: "no-store" }
      )

      const json = await res.json()

      if (res.ok) {
        await saveDailyReport({
          cityLabel: loc.cityLabel,
          regionLabel: loc.regionLabel,
          lat: loc.lat,
          lon: loc.lon,
          reportDate: today,
          report: json,
        })
      }
    }

    return Response.json({ ok: true, reportDate: today })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown cron error" },
      { status: 500 }
    )
  }
}
