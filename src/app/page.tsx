import { getSunsetData } from "@/lib/sunset"
import { getWeather } from "@/lib/weather"
import { calculateSkyScore } from "@/lib/scoring"
import { calculateScentScore } from "@/lib/scent"
import { rankLocations } from "@/lib/rank"
import { locations } from "@/lib/locations"
import { getPeakWindow, formatTime } from "@/lib/timing"

export default async function Home() {
  const lat = 37.485
  const lon = -122.230

  const sunsetData = await getSunsetData(lat, lon)
  const weather = await getWeather(lat, lon)

  const sky = calculateSkyScore(weather)
  const ranked = rankLocations(locations, sky)

  const best = ranked[0]

  const { peakStart, peakEnd } = getPeakWindow(sunsetData.sunset)

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-xl mx-auto">

        <h1 className="text-4xl font-semibold tracking-tight">
          SUNSETX
        </h1>

        <div className="mt-10 text-7xl font-bold">
          {best.score} 🔥
        </div>

        <div className="mt-2 text-zinc-400">
          Tonight is worth it
        </div>

        <div className="mt-6 text-lg">
          Peak: {formatTime(peakStart)} – {formatTime(peakEnd)}
        </div>

        <div className="mt-10 space-y-4">
          {ranked.map((loc) => (
            <div
              key={loc.name}
              className="border border-white/10 rounded-2xl p-4"
            >
              <div className="flex justify-between">
                <div>{loc.name}</div>
                <div>{loc.score}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}

import dynamic from "next/dynamic"
const Map = dynamic(() => import("@/components/Map"), { ssr: false })

// Add this inside return (below list)
<Map locations={ranked} />


import Auth from "@/components/Auth"

<Auth />


import Share from "@/components/Share"

<Share />

