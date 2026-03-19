import { getSunsetData } from "@/lib/sunset"
import { getWeather } from "@/lib/weather"
import { calculateSkyScore } from "@/lib/scoring"
import { rankLocations } from "@/lib/rank"
import { locations } from "@/lib/locations"
import { getPeakWindow, formatTime } from "@/lib/timing"
import EducationRotator from "@/components/EducationRotator"
import GlobalSunsetBoard from "@/components/GlobalSunsetBoard"
import PerfectSunsetFramework from "@/components/PerfectSunsetFramework"
import MapSection from "@/components/MapSection"

export const dynamic = "force-dynamic"
export const revalidate = 0

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
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl">
          <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">
            Sunset Intelligence
          </div>

          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
                SUNSETX
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                Predict where to go, when to leave, and whether tonight is
                truly worth it. Built for sunset timing, location ranking,
                atmosphere, and experience quality.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/30 px-6 py-5">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Live score
              </div>
              <div className="mt-2 text-6xl font-bold">{best.score} 🔥</div>
              <div className="mt-2 text-sm text-zinc-400">
                Peak: {formatTime(peakStart)} – {formatTime(peakEnd)}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Best nearby spots
              </div>

              <div className="mt-4 space-y-4">
                {ranked.map((loc, index) => (
                  <div
                    key={loc.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-zinc-500">#{index + 1}</div>
                        <div className="mt-1 text-lg font-medium">{loc.name}</div>
                        <div className="mt-1 text-sm text-zinc-500">
                          Spot {loc.spotScore} · Scent {Math.round(loc.scent * 100)}
                        </div>
                      </div>

                      <div className="text-2xl font-semibold">{loc.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Why this matters
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                SUNSETX is more than a sunset timer
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Great sunsets are a combination of sky conditions, horizon
                openness, cloud structure, clarity, and where you choose to
                watch from. The homepage should teach users just enough to
                appreciate the system while keeping the full scoring engine
                proprietary.
              </p>

              <div className="mt-6 space-y-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  Better sunsets usually need some cloud texture, not an empty sky.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  The best color often shows up after official sunset time.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  A better viewing location can outperform a better forecast.
                </div>
              </div>
            </div>
          </div>

          <MapSection locations={ranked} />
        </section>

        <EducationRotator />
        <GlobalSunsetBoard />
        <PerfectSunsetFramework />
      </div>
    </main>
  )
}
