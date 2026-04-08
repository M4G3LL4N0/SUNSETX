"use client"

import { useEffect, useMemo, useState } from "react"
import ShareLiveCard from "@/components/ShareLiveCard"
import { PerfectSunsetFramework as SunsetReportWidget } from "@/components/PerfectSunsetFramework"
import { Share as EnableNotifications } from "@/components/Share"
import { generateSunsetReport } from "@/lib/report"
import { getLeaveNowStatus, type LeaveNowStatus } from "@/lib/leave-now"

type NearbySpot = {
  id?: string
  name: string
  address: string
  lat?: number
  lon?: number
  score: number
  spotScore: number
  scent: number
  smellLabel: string
  parkingLabel: string
  vibeLabel: string
  bestFor: string
  whyItWins: string
  panoramaLabel: string
  easeLabel: string
  waterLabel: string
  woodsyBias?: number
  distanceMiles: number
  driveMinutes: number
  reasons?: string[]
  tier?: "close" | "mid" | "destination"
}

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
  nearbyRankedLocations: NearbySpot[]
  aiNarrative?: {
    title?: string
    intro?: string
    whyTonightIsGood?: {
      cloudStructure?: string
      atmosphere?: string
      wind?: string
    }
    whatToExpect?: string[]
    avoid?: string[]
    decision?: {
      goNoGo?: string
      bestMove?: string
    }
  }
  aiStatus?: "live" | "cached" | "fallback"
  updatedAt: string
}

const FALLBACK_COORDS = {
  lat: 37.5985,
  lon: -122.3872,
}

function buildEmergencyData(coords: { lat: number; lon: number }): ApiResponse {
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
    cityLabel: `${coords.lat.toFixed(3)}, ${coords.lon.toFixed(3)} area`,
    regionLabel: "Live fallback region",
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
        id: "fallback-1",
        name: "Nearby Scenic Spot",
        address: "Live location fallback",
        score: 91,
        spotScore: 91,
        scent: 0.95,
        smellLabel: "clean, natural air",
        parkingLabel: "Easy",
        vibeLabel: "Quiet, scenic",
        bestFor: "quick sunset access",
        whyItWins: "Strong fallback sunset option while live location refreshes.",
        panoramaLabel: "Open horizon",
        easeLabel: "Very easy",
        waterLabel: "Low water smell risk",
        distanceMiles: 3.4,
        driveMinutes: 9,
        tier: "close",
      },
      {
        id: "fallback-2",
        name: "Hillside Overlook",
        address: "Live location fallback",
        score: 88,
        spotScore: 88,
        scent: 0.9,
        smellLabel: "dry grass, hillside air",
        parkingLabel: "Easy",
        vibeLabel: "Elevated, expansive",
        bestFor: "higher elevation",
        whyItWins: "Elevation supports stronger sky intensity.",
        panoramaLabel: "High hillside panorama",
        easeLabel: "Easy",
        waterLabel: "Low water smell risk",
        distanceMiles: 4.8,
        driveMinutes: 11,
        tier: "mid",
      },
      {
        id: "fallback-3",
        name: "Open Bay View",
        address: "Live location fallback",
        score: 84,
        spotScore: 84,
        scent: 0.75,
        smellLabel: "clean, slight water",
        parkingLabel: "Easy",
        vibeLabel: "Open, airy",
        bestFor: "wide sky and reflections",
        whyItWins: "Open sky helps color spread.",
        panoramaLabel: "Open shoreline sky",
        easeLabel: "Very easy",
        waterLabel: "Moderate water presence",
        distanceMiles: 2.9,
        driveMinutes: 8,
        tier: "destination",
      },
    ],
    aiNarrative: {
      title: "SUNSETX REPORT — YOUR AREA",
      intro: "Using fallback sunset intelligence while live location updates.",
    },
    aiStatus: "fallback",
    updatedAt: new Date().toISOString(),
  }
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-medium text-zinc-200">
      {children}
    </span>
  )
}

function MiniCard({
  title,
  value,
  subtitle,
  className = "",
}: {
  title: string
  value: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={`
      rounded-[24px] border border-white/15 p-4 backdrop-blur-2xl
      bg-gradient-to-br from-white/[0.03] to-white/[0.01]
      shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]
      hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)]
      transition-all duration-300 ease-in-out
      relative isolate overflow-hidden
      after:absolute after:inset-0 after:rounded-[24px]
      after:pointer-events-none after:bg-gradient-to-b 
      after:from-white/[0.02] after:to-white/0
      ${className}
    `}>
      <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
        <span className="bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
          {value}
        </span>
      </div>
      {subtitle ? (
        <div className="mt-1 text-xs text-zinc-300/80">{subtitle}</div>
      ) : null}
    </div>
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
  const [coords, setCoords] = useState(FALLBACK_COORDS)
  const [userKey, setUserKey] = useState("anonymous")
  const [status, setStatus] = useState("Initializing live location")
  const [data, setData] = useState<ApiResponse | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [hasLiveCoords, setHasLiveCoords] = useState(false)

  useEffect(() => {
    setUserKey(getUserKey())

    const saved = localStorage.getItem("sunsetx:last-location")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (typeof parsed.lat === "number" && typeof parsed.lon === "number") {
          setCoords(parsed)
          setStatus("Using saved location while refreshing live location")
        }
      } catch {
        setStatus("Using fallback location while requesting live location")
      }
    } else {
      setStatus("Using fallback location while requesting live location")
    }

    if (!navigator.geolocation) {
      setStatus("Geolocation unavailable, using fallback location")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lon: Number(pos.coords.longitude.toFixed(6)),
        }
        setCoords(next)
        setHasLiveCoords(true)
        setStatus("Using your live location")
        localStorage.setItem("sunsetx:last-location", JSON.stringify(next))
      },
      () => {
        setStatus("Location permission denied, using saved/fallback location")
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 120000,
      }
    )
  }, [])

  useEffect(() => {
    let active = true

    async function load() {
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
          setData(buildEmergencyData(coords))
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

    return undefined
  }, [coords.lat, coords.lon, userKey])

  const report = useMemo(() => {
    try {
      return data ? generateSunsetReport(data) : null
    } catch {
      return null
    }
  }, [data])

  const leaveNow = useMemo<LeaveNowStatus | null>(() => {
    const top = data?.nearbyRankedLocations?.[0]
    if (!top || !data) return null

    try {
      return getLeaveNowStatus({
        peakStart: data.peakWindow.start,
        driveMinutes: top.driveMinutes ?? 10,
      })
    } catch {
      return null
    }
  }, [data])

  const topSpot = data?.nearbyRankedLocations?.[0]

  if (!data || !report) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="text-sm text-zinc-400">Loading SUNSETX live engine…</div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-6">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            Personalized live sunset report
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
            SUNSETX
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
            Every visitor sees a location-aware sunset report with nearby spots, timing intelligence,
            premium narrative guidance, and a clear go / no-go decision.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Pill>{status}</Pill>
            <Pill>Mode: {fallbackMode ? "Fallback" : "Live"}</Pill>
            <Pill>{hasLiveCoords ? "Live GPS active" : "Waiting for live GPS"}</Pill>
            <Pill>
              Lat {coords.lat} · Lon {coords.lon}
            </Pill>
            <Pill>Updated {new Date(data.updatedAt).toLocaleTimeString()}</Pill>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MiniCard
            title="Tonight"
            value={`${data.skyScore}`}
            subtitle="Sunset score"
            className="bg-[linear-gradient(135deg,rgba(244,114,182,0.22),rgba(251,146,60,0.16),rgba(56,189,248,0.14))]"
          />
          <MiniCard
            title="Peak"
            value={data.peakWindow.start}
            subtitle={`${data.peakWindow.start} – ${data.peakWindow.end}`}
            className="bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(168,85,247,0.16))]"
          />
          <MiniCard
            title="Sunset"
            value={data.sunsetLocalTime}
            subtitle="Official sunset"
            className="bg-[linear-gradient(135deg,rgba(251,146,60,0.18),rgba(244,114,182,0.14))]"
          />
          <MiniCard
            title="Top Spot"
            value={topSpot?.name ?? "Nearby spot"}
            subtitle={`~${topSpot?.driveMinutes ?? 0} min away`}
            className="bg-[linear-gradient(135deg,rgba(34,197,94,0.16),rgba(16,185,129,0.10))]"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
          <div className="text-sm font-medium text-zinc-100">Leave-now engine</div>
          <div className="mt-2 text-sm text-zinc-300">
            {leaveNow?.copy ?? "Leave timing unavailable."}
          </div>
          {leaveNow ? (
            <div className="mt-3 flex gap-2">
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-200">
                Ideal leave time: {leaveNow.leaveAt}
              </div>
              {leaveNow.urgency !== "unknown" && (
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-200">
                  Status: {leaveNow.urgency}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <EnableNotifications
          lat={coords.lat}
          lon={coords.lon}
          cityLabel={data.cityLabel}
          timezoneOffset={data.timezoneOffset}
        />

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
          <div className="text-sm font-medium text-zinc-100">Share</div>
          <div className="mt-2 text-sm text-zinc-300">
            Create a live sunset share card from your current report.
          </div>
          <div className="mt-4">
            <ShareLiveCard
              cityLabel={data.cityLabel}
              score={data.skyScore}
              peakStart={data.peakWindow.start}
              peakEnd={data.peakWindow.end}
              bestSpot={topSpot?.name}
            />
          </div>
        </div>
      </div>

      <SunsetReportWidget />
    </section>
  )
}
