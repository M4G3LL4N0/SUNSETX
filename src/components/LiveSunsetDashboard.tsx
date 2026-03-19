"use client"

import { useEffect, useMemo, useState } from "react"

type RankedLocation = {
  name: string
  lat: number
  lon: number
  spotScore: number
  scent: number
  score: number
}

type ApiResponse = {
  lat: number
  lon: number
  timezone: string
  currentLocalTime: string
  sunsetLocalTime: string
  peakWindow: { start: string; end: string }
  skyScore: number
  afterglowScore: number
  explanation: string
  liveConditions: {
    clouds: number
    humidity: number
    visibilityMiles: number
    windMph: number
    sunElevation: number
    summary: string
  }
  nearbyRankedLocations: RankedLocation[]
  elevationCurve: Array<{ iso: string; elevation: number }>
  hourlyPreview: Array<{
    localTime: string
    clouds: number
    humidity: number
    visibilityMiles: number
    windMph: number
    elevation: number
    afterglowScore: number
  }>
  updatedAt: string
}

const FALLBACK = {
  lat: 37.485,
  lon: -122.23,
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
        const res = await fetch(
          `/api/live-score?lat=${coords.lat}&lon=${coords.lon}`,
          { cache: "no-store" }
        )

        if (!res.ok) {
          throw new Error(`Failed: ${res.status}`)
        }

        const json = (await res.json()) as ApiResponse
        if (active) setData(json)
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load")
      }
    }

    load()
    const id = window.setInterval(load, 300000)

    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [coords.lat, coords.lon])

  const top = useMemo(() => data?.nearbyRankedLocations?.[0], [data])

  if (error) {
    return (
      <section className="rounded-[32px] border border-red-500/20 bg-red-500/5 p-8">
        <div className="text-sm text-red-300">Live dashboard error: {error}</div>
      </section>
    )
  }

  if (!data || !top) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-8">
        <div className="text-sm text-zinc-400">Loading SUNSETX live engine…</div>
      </section>
    )
  }

  return (
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
            Predict where to go, when to leave, and whether tonight is truly worth it.
            Now running on live location, live weather, timezone-aware sunset timing,
            solar elevation, and afterglow modeling.
          </p>

          <div className="mt-4 text-sm text-zinc-500">
            {status} · {data.timezone} · local time {data.currentLocalTime}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/30 px-6 py-5">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            Live score
          </div>
          <div className="mt-2 text-6xl font-bold">{top.score} 🔥</div>
          <div className="mt-2 text-sm text-zinc-400">
            Peak: {data.peakWindow.start} – {data.peakWindow.end}
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            Sunset: {data.sunsetLocalTime}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            Best nearby spots
          </div>

          <div className="mt-4 space-y-4">
            {data.nearbyRankedLocations.map((loc, index) => (
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
            Why tonight scores this way
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Live sunset reasoning
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            {data.explanation}
          </p>

          <div className="mt-6 grid gap-3 text-sm text-zinc-300">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              Clouds {data.liveConditions.clouds}% · Humidity {data.liveConditions.humidity}% · Visibility {data.liveConditions.visibilityMiles} mi
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              Wind {data.liveConditions.windMph} mph · Sun elevation {data.liveConditions.sunElevation}°
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              Sky score {data.skyScore} · Afterglow score {data.afterglowScore} · {data.liveConditions.summary}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            Next hours
          </div>
          <div className="mt-4 space-y-3">
            {data.hourlyPreview.map((hour) => (
              <div
                key={hour.localTime}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm"
              >
                <div>{hour.localTime}</div>
                <div className="text-zinc-400">
                  clouds {hour.clouds}% · afterglow {hour.afterglowScore}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            Sun elevation curve
          </div>
          <div className="mt-4 flex h-[220px] items-end gap-1">
            {data.elevationCurve.map((point) => {
              const normalized = Math.max(8, Math.min(100, (point.elevation + 15) * 3))
              return (
                <div
                  key={point.iso}
                  className="flex-1 rounded-t-md bg-white/80"
                  style={{ height: `${normalized}%` }}
                  title={`${new Date(point.iso).toLocaleTimeString()} · ${point.elevation}°`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
