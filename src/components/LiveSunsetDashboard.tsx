"use client"

import { useEffect, useMemo, useState } from "react"
import SunsetReportWidget from "@/components/SunsetReportWidget"
import EnableNotifications from "@/components/EnableNotifications"
import { generateSunsetReport } from "@/lib/report"
import { getLeaveNowStatus } from "@/lib/leave-now"

type ApiResponse = {
  cityLabel?: string
  regionLabel?: string
  timezoneOffset?: number
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
  aiStatus?: "live" | "cached" | "fallback"
  updatedAt: string
}

const FALLBACK = {
  lat: 37.5985,
  lon: -122.3872,
}

function prettyError(message: string) {
  if (message.includes("429")) {
    return "Using SUNSETX fallback intelligence right now. Your sunset report is still live."
  }

  if (message.toLowerCase().includes("quota")) {
    return "Live AI narration is temporarily unavailable, but your sunset report is still working."
  }

  return "We hit a temporary live-data issue. Please refresh in a moment."
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

  const report = useMemo(() => (data ? generateSunsetReport(data) : null), [data])

  const leaveNow = useMemo(() => {
    const top = data?.nearbyRankedLocations?.[0]
    if (!top || !data) return null

    return getLeaveNowStatus({
      peakStart: data.peakWindow.start,
      driveMinutes: top.driveMinutes ?? 10,
    })
  }, [data])

  if (error && !data) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">
          Personalized live sunset report
        </div>

        <div className="mt-4">
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            SUNSETX
          </h1>

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="text-lg font-medium text-zinc-100">
              {prettyError(error)}
            </div>
            <div className="mt-3 text-sm leading-6 text-zinc-400">
              We’re keeping the product graceful under load so the homepage never shows raw provider failures.
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!data || !report) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-8">
        <div className="text-sm text-zinc-400">Loading SUNSETX live engine…</div>
      </section>
    )
  }

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

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-400">
            {status}
          </span>
          <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-400">
            AI: {data.aiStatus === "live" ? "live" : data.aiStatus === "cached" ? "cached" : "fallback"}
          </span>
          <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-400">
            Updated {new Date(data.updatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="text-sm font-medium text-zinc-100">Leave-now engine</div>
          <div className="mt-2 text-sm text-zinc-400">
            {leaveNow?.copy ?? "Leave timing unavailable."}
          </div>
          {leaveNow?.leaveAt ? (
            <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Ideal leave time: {leaveNow.leaveAt}
            </div>
          ) : null}
        </div>

        <EnableNotifications
          lat={coords.lat}
          lon={coords.lon}
          cityLabel={data.cityLabel}
          timezoneOffset={data.timezoneOffset}
        />
      </div>

      <SunsetReportWidget report={report} />
    </section>
  )
}
