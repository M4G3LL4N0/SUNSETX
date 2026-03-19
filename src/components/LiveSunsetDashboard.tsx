"use client"

import { useEffect, useState } from "react"
import SunsetReportWidget from "@/components/SunsetReportWidget"
import { generateSunsetReport } from "@/lib/report"

type ApiResponse = {
  cityLabel?: string
  regionLabel?: string
  skyScore: number
  afterglowScore: number
  sunsetLocalTime: string
  peakWindow: {
    start: string
    end: string
  }
  explanation: string
  liveConditions: {
    clouds: number
    humidity: number
    visibilityMiles: number
    windMph: number
    sunElevation: number
    summary: string
  }
  nearbyRankedLocations: Array<any>
  aiNarrative?: any
  updatedAt: string
}

const FALLBACK = {
  lat: 37.5985,
  lon: -122.3872,
}

export default function LiveSunsetDashboard() {
  const [coords, setCoords] = useState(FALLBACK)
  const [status, setStatus] = useState("Using default location")
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("sunsetx:last-location")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (typeof parsed.lat === "number" && typeof parsed.lon === "number") {
          setCoords(parsed)
          setStatus("Using saved location")
        }
      } catch {}
    }

    if (!navigator.geolocation) {
      setStatus("Geolocation unavailable, using fallback")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lon: Number(pos.coords.longitude.toFixed(6)),
        }
        setCoords(next)
        localStorage.setItem("sunsetx:last-location", JSON.stringify(next))
        setStatus("Using your live location")
      },
      () => {
        setStatus("Location permission denied, using fallback")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }, [])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setError("")
        const res = await fetch(`/api/live-score?lat=${coords.lat}&lon=${coords.lon}`, {
          cache: "no-store",
        })

        const json = await res.json()

        if (!res.ok) {
          throw new Error(json?.error || `Failed: ${res.status}`)
        }

        if (active) {
          setData(json)
        }
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : "Failed to load")
        }
      }
    }

    load()
    const id = window.setInterval(load, 300000)

    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [coords.lat, coords.lon])

  if (error) {
    return (
      <section className="rounded-[32px] border border-red-500/20 bg-red-500/5 p-8">
        <div className="text-sm text-red-300">Live dashboard error: {error}</div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-8">
        <div className="text-sm text-zinc-400">Loading SUNSETX live engine…</div>
      </section>
    )
  }

  const report = generateSunsetReport(data)

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl">
      <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">
        Personalized live sunset report
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            SUNSETX
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            Every visitor sees a live, location-aware sunset report with nearby spots,
            timing, conditions, narrative explanation, and a clear go / no-go decision.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-400">
          {status} · updated {new Date(data.updatedAt).toLocaleTimeString()}
        </div>
      </div>

      <SunsetReportWidget report={report} />
    </section>
  )
}
