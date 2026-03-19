"use client"

import { useEffect, useState, useMemo } from "react"
import SunsetReportWidget from "@/components/SunsetReportWidget"
import EnableNotifications from "@/components/EnableNotifications"
import ShareLiveCard from "@/components/ShareLiveCard"
import { generateSunsetReport } from "@/lib/report"
import { getLeaveNowStatus } from "@/lib/leave-now"

type NearbySpot = {
  id?: string
  name: string
  address: string
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
  distanceMiles: number
  driveMinutes: number
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
  closeSpots: NearbySpot[]
  midRangeSpot: NearbySpot | null
  premiumSpot: NearbySpot | null
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
    closeSpots: [
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
    midRangeSpot: {
      id: "crystal-springs-overlook",
      name: "Crystal Springs Overlook",
      address: "2600 Skyline Blvd, Burlingame, CA 94010",
      score: 86,
      spotScore: 86,
      scent: 0.9,
      smellLabel: "eucalyptus, grass, cool hillside air",
      parkingLabel: "Moderate",
      vibeLabel: "Scenic, elevated, breezy",
      bestFor: "panoramic hillside sunset",
      whyItWins: "Strong elevation and fresh hillside air support a premium sunset feel.",
      panoramaLabel: "Wide scenic overlook",
      easeLabel: "Easy to moderate",
      waterLabel: "Low water smell risk",
      distanceMiles: 6.2,
      driveMinutes: 16,
    },
    premiumSpot: {
      id: "edgewood-park",
      name: "Edgewood Park",
      address: "1600 Edgewood Rd, Redwood City, CA 94062",
      score: 90,
      spotScore: 90,
      scent: 0.95,
      smellLabel: "oak woodland, dry grass, clean nature",
      parkingLabel: "Easy",
      vibeLabel: "Calm, woodsy, scenic",
      bestFor: "clean smell, low friction, natural vibe",
      whyItWins: "Excellent woodsy scent profile with meadow openness and clean air.",
      panoramaLabel: "Meadow + hillside opening",
      easeLabel: "Easy",
      waterLabel: "Very low water smell risk",
      distanceMiles: 12.4,
      driveMinutes: 22,
    },
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
    <div
      className={`rounded-[24px] border border-white/10 p-4 backdrop-blur-2xl ${className}`}
    >
      <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</div>
      {subtitle ? <div className="mt-1 text-xs text-zinc-300">{subtitle}</div> : null}
    </div>
  )
}

function TierSpotCard({ spot, rank, label }: { spot: NearbySpot, rank?: number, label?: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl hover:bg-white/10 transition-colors">
      {label && <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{label}</div>}
      {rank !== undefined && <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">#{rank}</div>}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium text-zinc-100">{spot.name}</div>
          <div className="text-xs text-zinc-400 truncate">{spot.address}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{spot.distanceMiles} mi • {spot.driveMinutes} min</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-zinc-100">{spot.score}</div>
          <div className="text-[10px] text-zinc-500">Score</div>
        </div>
      </div>
      <div className="mt-1 text-[10px] text-zinc-400 line-clamp-1">{spot.bestFor}</div>
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
  const [status, setStatus] = useState("Using default location")
  const [data, setData] = useState<ApiResponse | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)

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
    const top = data?.closeSpots?.[0] || data?.midRangeSpot || data?.premiumSpot
    if (!top || !data) return null

    return getLeaveNowStatus({
      peakStart: data.peakWindow.start,
      driveMinutes: top.driveMinutes ?? 10,
    })
  }, [data])

  const topSpot = data?.closeSpots?.[0] || data?.midRangeSpot || data?.premiumSpot

  if (!data || !report) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="text-sm text-zinc-400">Loading SUNSETX live engine…</div>
      </section>
    )
  }

  const quickOptions = data.closeSpots.slice(0, 3)
  const premiumOption = data.midRangeSpot || data.premiumSpot
  const regionalDestination = data.premiumSpot || (data.closeSpots.find(s => s.driveMinutes > 60) || null)

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-6">
      {/* DEBUG INFO */}
      <div className="mb-4 flex flex-wrap gap-2">
        {coords.lat && <Pill>Lat: {coords.lat}</Pill>}
        {coords.lon && <Pill>Lon: {coords.lon}</Pill>}
        <Pill className={fallbackMode ? "border-red-500/30 text-red-300" : "border-green-500/30 text-green-300"}>
          {fallbackMode ? "Fallback Mode" : "Live GPS Active"}
        </Pill>
        <Pill>Close: {data.closeSpots.length}</Pill>
        <Pill>Mid: {data.midRangeSpot ? 1 : 0}</Pill>
        <Pill>Premium: {data.premiumSpot ? 1 : 0}</Pill>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            Personalized live sunset report
          </div>

          <div className="mt-3 flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">SUNSETX</h1>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${fallbackMode ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${fallbackMode ? 'bg-red-400' : 'bg-green-400'} animate-pulse`}></span>
              {fallbackMode ? 'FALLBACK' : 'LIVE'}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
            Every visitor sees a location-aware sunset report with nearby spots,
            timing intelligence, premium narrative guidance, and a clear go / no-go decision.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Pill>{status}</Pill>
            <Pill>Mode: {fallbackMode ? "Fallback" : "Live"}</Pill>
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

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-xl">
          <div className="text-sm font-medium text-zinc-100">Leave-now engine</div>
          <div className="mt-2 text-sm text-zinc-300">
            {leaveNow?.copy ?? "Leave timing unavailable."}
          </div>
          {leaveNow?.leaveAt ? (
            <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-200">
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

        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-xl">
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

      {/* RECOMMENDATION TIERS */}
      <div className="mt-6">
        <div className="text-sm font-medium text-zinc-100 mb-3">Quick Options (5‑15 min)</div>
        <div className="grid gap-3 md:grid-cols-3">
          {quickOptions.map((spot, index) => (
            <TierSpotCard key={spot.id} spot={spot} rank={index+1} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-medium text-zinc-100 mb-3">Premium Option (~30 min)</div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
          {premiumOption ? (
            <TierSpotCard spot={premiumOption} label="Premium option" />
          ) : (
            <div className="text-zinc-300 text-sm">None</div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-medium text-zinc-100 mb-3">Regional Destination (~1 hr)</div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
          {regionalDestination ? (
            <TierSpotCard spot={regionalDestination} label="Destination spot" />
          ) : (
            <div className="text-zinc-300 text-sm">None</div>
          )}
        </div>
      </div>

      <SunsetReportWidget report={report} />
    </section>
  )
}
