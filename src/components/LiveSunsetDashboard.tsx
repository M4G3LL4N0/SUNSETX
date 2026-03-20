"use client"

import { useEffect, useMemo, useState } from "react"
import SunsetReportWidget from "@/components/SunsetReportWidget"
import { generateSunsetReport } from "@/lib/report"
import { getLeaveNowStatus } from "@/lib/leave-now"
import { showNotification } from "@/utils/notifications"

type Props = {
  initialCoords: { lat: number; lon: number }
  cityLabel?: string | null
}

export default function LiveSunsetDashboard({ initialCoords, cityLabel }: Props) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [coords, setCoords] = useState(initialCoords)

  // Watch for location changes
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newCoords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lon: Number(pos.coords.longitude.toFixed(6)),
        }
        console.log('Location updated:', newCoords)
        setCoords(newCoords)
      },
      (err) => {
        console.error('Geolocation error:', err)
        showNotification('Location tracking paused', 'warning')
      },
      { enableHighAccuracy: true, maximumAge: 30000 }
    )
    
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/live-score?lat=${coords.lat}&lon=${coords.lon}`,
          { cache: "no-store" }
        )
        if (!res.ok) throw new Error('API failed')
        
        const json = await res.json()
        console.log('API response:', json)
        setData(json)
        setError(false)
      } catch (err) {
        console.error('Failed to load sunset data:', err)
        setError(true)
        // Fallback to default sunset data
        setData({
          skyScore: 75,
          sunsetLocalTime: '7:14 PM',
          peakWindow: {
            start: '6:59 PM',
            end: '7:29 PM'
          }
        })
      } finally {
        setLoading(false)
      }
    }

    const timer = setInterval(load, 120000) // Refresh every 2 minutes
    load() // Initial load
    
    return () => clearInterval(timer)
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

  if (loading || !data || !report) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-40 rounded-full bg-white/10" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5" />
          ))}
        </div>
        <div className="h-16 rounded-xl bg-white/5" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-zinc-300">
        {cityLabel 
          ? `Near ${cityLabel}`
          : `Lat ${coords.lat} · Lon ${coords.lon}`
        }
        {error && (
          <span className="ml-2 text-xs text-amber-400">
            (using offline data)
          </span>
        )}
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
