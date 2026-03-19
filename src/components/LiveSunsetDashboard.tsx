"use client"

import { useEffect, useState } from "react"
import SunsetReportWidget from "./SunsetReportWidget"

export default function LiveSunsetDashboard() {
  const [data, setData] = useState<any>(null)
  const [report, setReport] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/live-score?lat=37.485&lon=-122.23")
      const json = await res.json()

      setData(json)

      const { generateSunsetReport } = await import("@/lib/report")
      setReport(generateSunsetReport(json))
    }

    load()
  }, [])

  if (!data) return <div className="p-8 text-zinc-400">Loading…</div>

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold">SUNSETX</h1>

      <SunsetReportWidget report={report} />
    </section>
  )
}
