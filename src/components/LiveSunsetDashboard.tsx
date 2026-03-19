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

const FALLBACK_COORDS = {
  lat: 37.5985,
  lon: -122.3872,
}

function buildEmergencyData(): ApiResponse {
  const now = new Date()
  const sunset = new Date(now)
  sunset.setHours(18, 43, 0, 0)

  const peakStart = new Date(sunset.getTime() - 5 * 60 * 1000)
  const peakEnd = new Date(sunset.getTime() + 5 * 60 * 1000)

  const fmt = (d: Date) =>
    d.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })

  return {
    cityLabel: "Your Area",
    regionLabel: "Peninsula / South San Francisco Bay",
    timezoneOffset: -25200,
    skyScore: 82,
    afterglowScore: 78,
    sunsetLocalTime: fmt(sunset),
    peakWindow: {
      start: fmt(peakStart),
      end: fmt(peakEnd),
    },
    explanation:
      "Balanced cloud layer for color reflection · good visibility · balanced atmospheric softness · good afterglow potential",
    liveConditions: {
      clouds: 42,
      humidity: 58,
      visibilityMiles: 9.2,
      windMph: 6.1,
      sunElevation: -1.8,
      summary: "partly cloudy",
    },
    nearbyRankedLocations: [
      {
        id: "junipero-serra-park",
        name: "Junipero Serra Park",
        address: "1801 Crystal Springs Rd, San Bruno, CA 94066",
        score: 91,
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
        distanceMiles: 3.4,
        driveMinutes: 9,
      },
      {
        id: "skyline-college-hills",
        name: "Skyline College Hills",
        address: "3300 College Dr, San Bruno, CA 94066",
        score: 88,
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
        distanceMiles: 4.8,
        driveMinutes: 11,
      },
      {
        id: "bayfront-park",
        name: "Bayfront Park",
        address: "1600 Bayshore Hwy, Burlingame, CA 94010",
        score: 84,
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
        distanceMiles: 2.9,
        driveMinutes: 8,
      },
    ],
    aiNarrative: {
      title: "SUNSETX REPORT — YOUR AREA",
      intro:
        "Tonight in your area, sunset conditions look strong, with a SUNSETX score of 82/100 and a useful peak window near sunset.",
      whyTonightIsGood: {
        cloudStructure:
          "Useful cloud texture can help catch warm light without fully blocking the horizon.",
        atmosphere:
          "Visibility and atmospheric softness are balanced enough for color to show cleanly.",
        wind:
          "Moderate wind can help keep the sky from feeling flat and muddy.",
      },
      whatToExpect: [
        "Warm gold, orange, and pink gradient potential",
        "Best colors likely after the sun dips below the horizon",
        "A smoother cinematic sky rather than chaotic storm drama",
      ],
      avoid: [
        "Blocked western horizons",
        "Leaving too late and missing the peak",
        "Low-value spots with poor panorama or awkward access",
      ],
      decision: {
        goNoGo: "GO — HIGH CONFIDENCE",
        bestMove: "Go to Junipero Serra Park and arrive before the peak window.",
      },
    },
    aiStatus: "fallback",
    updatedAt: new Date().toISOString(),
  }
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
  const [coords, setCoords] = useState(FALLBACK_COORDS)
  const [userKey, setUserKey] = useState("anonymous")
  const [status, setStatus] = useState("Using default location")
  const [data, setData] = useState<ApiResponse | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

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
          setFallbackMode(false)
        }
      } catch {
        if (active) {
          setData(buildEmergencyData())
          setFallbackMode(true)
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

  if (!data || !report) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="text-sm text-zinc-400">Loading SUNSETX live engine…</div>
      </section>
    )
  }

  const topSpot = data.nearbyRankedLocations?.[0]

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-black/30 via-black/20 to-black/10 p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-400/10 to-fuchsia-400/10 px-3 py-1 text-[11px] font-medium tracking-wide text-violet-100 ring-1 ring-violet-400/20 backdrop-blur-xl mb-3">
          Live sunset intelligence
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-100 via-fuchsia-100 to-amber-100 mb-2">
          SUNSETX
        </h1>
        <p className="max-w-lg mx-auto text-sm leading-relaxed text-zinc-300/80">
          Premium sunset intelligence with real-time scoring and location-aware guidance
        </p>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {/* Main Score Widget */}
        <div className="col-span-2 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-400/10 via-fuchsia-400/5 to-transparent p-3.5 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-100 to-fuchsia-100">{data.skyScore}</div>
                <div className="text-sm text-zinc-400 font-medium">/ 100</div>
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-300">Tonight's Score</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-zinc-300">{data.cityLabel}</div>
              <div className="mt-0.5 text-xs text-zinc-400">{status}</div>
            </div>
          </div>
        </div>

        {/* Time Widgets */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-3 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Peak Start</div>
          <div className="text-lg font-medium text-white">{data.peakWindow.start}</div>
          <div className="mt-0.5 text-xs text-zinc-400">Best color</div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-3 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Sunset</div>
          <div className="text-lg font-medium text-white">{data.sunsetLocalTime}</div>
          <div className="mt-0.5 text-xs text-zinc-400">Official time</div>
        </div>
      </div>

      {/* Conditions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cyan-400/5 via-violet-400/5 to-transparent p-3 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Clouds</div>
          <div className="flex items-baseline gap-1">
            <div className="text-lg font-medium text-white">{data.liveConditions.clouds}</div>
            <div className="text-sm text-zinc-400">%</div>
          </div>
          <div className="mt-1 text-xs text-zinc-400">Coverage</div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-400/5 via-fuchsia-400/5 to-transparent p-3 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Visibility</div>
          <div className="flex items-baseline gap-1">
            <div className="text-lg font-medium text-white">{data.liveConditions.visibilityMiles}</div>
            <div className="text-sm text-zinc-400">mi</div>
          </div>
          <div className="mt-1 text-xs text-zinc-400">Range</div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-fuchsia-400/5 via-amber-400/5 to-transparent p-3 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Humidity</div>
          <div className="flex items-baseline gap-1">
            <div className="text-lg font-medium text-white">{data.liveConditions.humidity}</div>
            <div className="text-sm text-zinc-400">%</div>
          </div>
          <div className="mt-1 text-xs text-zinc-400">Current</div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-amber-400/5 via-orange-400/5 to-transparent p-3 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Wind</div>
          <div className="flex items-baseline gap-1">
            <div className="text-lg font-medium text-white">{data.liveConditions.windMph}</div>
            <div className="text-sm text-zinc-400">mph</div>
          </div>
          <div className="mt-1 text-xs text-zinc-400">Speed</div>
        </div>
      </div>

      {/* Top Spot & Leave Now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        {/* Top Spot Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Best Spot Tonight</div>
              <div className="text-xl font-medium text-white">{topSpot?.name ?? "Nearby spot"}</div>
              <div className="mt-1 text-sm text-zinc-400">{topSpot?.address}</div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300">
              <span>~{topSpot?.driveMinutes ?? 0}m</span>
              <span className="text-zinc-500">•</span>
              <span>{topSpot?.distanceMiles ?? 0}mi</span>
            </div>
          </div>
        </div>

        {/* Leave Now Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Leave-Now Status</div>
          <div className="text-lg text-zinc-200 mb-2">
            {leaveNow?.copy ?? "Leave timing unavailable."}
          </div>
          {leaveNow?.leaveAt ? (
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-300">
              Leave at {leaveNow.leaveAt}
            </div>
          ) : null}
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        <EnableNotifications
          lat={coords.lat}
          lon={coords.lon}
          cityLabel={data.cityLabel}
          timezoneOffset={data.timezoneOffset}
        />
        <ShareLiveCard
          cityLabel={data.cityLabel}
          score={data.skyScore}
          peakStart={data.peakWindow.start}
          peakEnd={data.peakWindow.end}
          bestSpot={topSpot?.name}
        />
        <button
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/10 transition-colors"
        >
          {showPreferences ? "Hide Preferences" : "Preferences"}
        </button>
      </div>

      {/* Preferences Panel (collapsible) */}
      {showPreferences && (
        <div className="mb-12">
          <PreferencesPanel userKey={userKey} />
        </div>
      )}

      {/* Detailed Report */}
      <div className="mt-16">
        <SunsetReportWidget report={report} />
      </div>
    </section>
  )
}
