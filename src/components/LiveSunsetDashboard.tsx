"use client"

import { useEffect, useMemo, useState } from "react"
import SunsetReportWidget from "@/components/SunsetReportWidget"
import EnableNotifications from "@/components/EnableNotifications"
import ShareLiveCard from "@/components/ShareLiveCard"
import PreferencesPanel from "@/components/PreferencesPanel"
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
  if (message.includes("429") || message.toLowerCase().includes("quota")) {
    return "Using SUNSETX fallback intelligence right now. Your sunset report is still live."
  }

  return "We hit a temporary live-data issue. Please refresh in a moment."
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-400">
      {children}
    </span>
  )
}

function getUserKey() {
  if (typeof window === "undefined") return "anonymous"
  const existing = localStorage.getItem("sunsetx:user-key")
  if (existing) return existing

  const next = crypto.randomUUID()
  localStorage.setItem("sunsetx:user-key", next)
  return next
}

export default function LiveSunsetDashboard() {
  const [coords, setCoords] = useState(FALLBACK)
  const [userKey, setUserKey] = useState("anonymous")
  const [status, setStatus] = useState("Using default location")
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    setUserKey(getUserKey())

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
        const res = await fetch(
          `/api/live-score?lat=${coords.lat}&lon=${coords.lon}&userKey=${encodeURIComponent(userKey)}`,
          { cache: "no-store" }
        )

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

    if (userKey !== "anonymous") {
      load()
      const id = window.setInterval(load, 300000)
      return () => {
        active = false
        window.clearInterval(id)
      }
    }
  }, [coords.lat, coords.lon, userKey])

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
      <section className="rounded-[36px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">
          Personalized live sunset report
        </div>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">
          SUNSETX
        </h1>
        <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-6">
          <div className="text-xl font-medium text-zinc-100">{prettyError(error)}</div>
        </div>
      </section>
    )
  }

  if (!data || !report) {
    return (
      <section className="rounded-[36px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-8">
        <div className="text-sm text-zinc-400">Loading SUNSETX live engine…</div>
      </section>
    )
  }

  return (
    <section className="rounded-[36px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
      <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">
        Personalized live sunset report
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            SUNSETX
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            Every visitor sees a live, location-aware sunset report with nearby spots,
            timing, conditions, narrative explanation, and a clear go / no-go decision.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusPill>{status}</StatusPill>
          <StatusPill>
            AI: {data.aiStatus === "live" ? "live" : data.aiStatus === "cached" ? "cached" : "fallback"}
          </StatusPill>
          <StatusPill>
            Updated {new Date(data.updatedAt).toLocaleTimeString()}
          </StatusPill>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
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

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="text-sm font-medium text-zinc-100">Share</div>
          <div className="mt-2 text-sm text-zinc-400">
            Create a live sunset share card from your current report.
          </div>
          <div className="mt-4">
            <ShareLiveCard
              cityLabel={data.cityLabel}
              score={data.skyScore}
              peakStart={data.peakWindow.start}
              peakEnd={data.peakWindow.end}
              bestSpot={data.nearbyRankedLocations?.[0]?.name}
            />
          </div>
        </div>

        <PreferencesPanel userKey={userKey} />
      </div>

      <SunsetReportWidget report={report} />
    </section>
  )
}
