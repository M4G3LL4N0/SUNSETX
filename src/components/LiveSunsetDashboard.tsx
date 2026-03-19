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
    <section className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-b from-black/40 to-black/20 p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-violet-200 ring-1 ring-violet-500/20 backdrop-blur-xl mb-4">
          Live sunset intelligence
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-fuchsia-200 to-amber-200 mb-3">
          SUNSETX
        </h1>
        <p className="max-w-xl mx-auto text-base leading-relaxed text-zinc-300/90">
          Location-aware sunset intelligence with nearby spots, timing precision, and premium guidance.
        </p>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {/* Score Card */}
        <div className="col-span-2 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-baseline gap-2">
            <div className="text-5xl font-bold text-white">{data.skyScore}</div>
            <div className="text-sm text-zinc-400">/ 100</div>
          </div>
          <div className="mt-2 text-sm font-medium text-zinc-300">Tonight's Score</div>
        </div>

        {/* Peak Window */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 shadow-xl backdrop-blur-xl">
          <div className="text-lg font-semibold text-white">{data.peakWindow.start}</div>
          <div className="text-xs text-zinc-400 mt-1">Peak Start</div>
        </div>

        {/* Sunset Time */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 shadow-xl backdrop-blur-xl">
          <div className="text-lg font-semibold text-white">{data.sunsetLocalTime}</div>
          <div className="text-xs text-zinc-400 mt-1">Sunset</div>
        </div>
      </div>

      {/* Top Spot & Leave Now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Top Spot Card */}
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <div className="text-sm font-medium text-zinc-100 mb-4">Top Spot</div>
          <div>
            <div className="text-2xl font-semibold text-white mb-2">{topSpot?.name ?? "Nearby spot"}</div>
            <div className="text-zinc-300 mb-4">{topSpot?.address}</div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-zinc-200">
              <span>~{topSpot?.driveMinutes ?? 0} min drive</span>
              <span>•</span>
              <span>{topSpot?.distanceMiles ?? 0} miles</span>
            </div>
          </div>
        </div>

        {/* Leave Now Card */}
        <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-orange-900/20 via-amber-900/10 to-transparent p-8 backdrop-blur-xl">
          <div className="text-sm font-medium text-zinc-100 mb-4">Leave-Now Engine</div>
          <div className="text-xl text-zinc-200 mb-4">
            {leaveNow?.copy ?? "Leave timing unavailable."}
          </div>
          {leaveNow?.leaveAt ? (
            <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-6 py-3 text-base font-medium text-zinc-200">
              Ideal leave time: {leaveNow.leaveAt}
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
