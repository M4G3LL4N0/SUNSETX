import dynamicImport from "next/dynamic"
import { getSunsetData } from "@/lib/sunset"
import { getWeather } from "@/lib/weather"
import { calculateSkyScore } from "@/lib/scoring"
import { rankLocations } from "@/lib/rank"
import { locations } from "@/lib/locations"
import { getPeakWindow, formatTime } from "@/lib/timing"

export const dynamic = "force-dynamic"

const Map = dynamicImport(() => import("@/components/Map"), { ssr: false })

export default async function Home() {
  const lat = 37.485
  const lon = -122.23

  const sunsetData = await getSunsetData(lat, lon)
  const weather = await getWeather(lat, lon)
  const sky = calculateSkyScore(weather)
  const ranked = rankLocations(locations, sky)
  const best = ranked[0]
  const { peakStart, peakEnd } = getPeakWindow(sunsetData.sunset)

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl">
          <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">
            Sunset Intelligence
          </div>

          <h1 className="mt-3 text-5xl font-semibold tracking-tight">SUNSETX</h1>

          <div className="mt-10 text-7xl font-bold">{best.score} 🔥</div>

          <p className="mt-3 text-lg text-zinc-400">Live sunset conditions</p>

          <div className="mt-6 text-base text-zinc-300">
            Peak: {formatTime(peakStart)} – {formatTime(peakEnd)}
          </div>

          <div className="mt-10 grid gap-4">
            {ranked.map((loc) => (
              <div
                key={loc.name}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-medium">{loc.name}</div>
                    <div className="mt-1 text-sm text-zinc-500">
                      Spot {loc.spotScore} · Scent {Math.round(loc.scent * 100)}
                    </div>
                  </div>
                  <div className="text-2xl font-semibold">{loc.score}</div>
                </div>
              </div>
            ))}
          </div>

          <Map locations={ranked} />
        </div>
      </div>
    </main>
  )
}
