"use client"

import { useEffect, useMemo, useState } from "react"
import SunsetReportWidget from "@/components/SunsetReportWidget"
import EnableNotifications from "@/components/EnableNotifications"
import ShareLiveCard from "@/components/ShareLiveCard"
import { generateSunsetReport } from "@/lib/report"
import { getLeaveNowStatus } from "@/lib/leave-now"

export default function LiveSunsetDashboard() {
  const [data, setData] = useState<any>(null)
  const [coords, setCoords] = useState({ lat: 37.5985, lon: -122.3872 })

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: Number(pos.coords.latitude.toFixed(6)),
        lon: Number(pos.coords.longitude.toFixed(6)),
      })
    })
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `/api/live-score?lat=${coords.lat}&lon=${coords.lon}`,
          { cache: "no-store" }
        )
        const json = await res.json()
        setData(json)
      } catch {
        setData(null)
      }
    }

    load()
  }, [coords.lat, coords.lon])

  const report = useMemo(() => {
    try {
      return data ? generateSunsetReport(data as any) : null
    } catch (e) {
      console.error("Report generation failed:", e)
      return null
    }
  }, [data])

  const topSpot = data?.nearbyRankedLocations?.[0]

  const leaveNow = useMemo(() => {
    if (!data || !topSpot) return null
    try {
      return getLeaveNowStatus({
        peakStart: data.peakWindow?.start,
        driveMinutes: topSpot?.driveMinutes ?? 10,
      })
    } catch {
      return null
    }
  }, [data, topSpot])

  if (!data || !report) {
    return <div className="p-6 text-zinc-400">Loading sunset data…</div>
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-zinc-400">
        Lat {coords.lat} · Lon {coords.lon}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-white/5">
          Score: {data.skyScore}
        </div>
        <div className="p-4 rounded-xl bg-white/5">
          Sunset: {data.sunsetLocalTime}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white/5">
        Leave Now: {leaveNow?.copy || "—"}
      </div>

      <div className="space-y-2">
        {(data.nearbyRankedLocations || []).slice(0, 3).map((spot: any) => (
          <div key={spot.name} className="p-3 rounded-xl bg-white/5">
            <div className="font-semibold">{spot.name}</div>
            <div className="text-sm text-zinc-400">
              {spot.driveMinutes} min · {spot.score}
            </div>
          </div>
        ))}
      </div>

      <SunsetReportWidget report={report} />
    </div>
  )
}
