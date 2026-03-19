"use client"

export default function SunsetReportWidget({ report }: { report: any }) {
  if (!report) return null

  return (
    <section className="mt-8 grid gap-4">

      {/* SCORE */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
        <div className="text-xs text-zinc-500">Tonight</div>
        <div className="mt-2 text-4xl font-bold">
          {report.summary.score} 🔥
        </div>
        <div className="text-sm text-zinc-400">
          {report.summary.rating} · Worth it: {report.summary.worthIt}
        </div>
      </div>

      {/* TIMING */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
        <div className="text-xs text-zinc-500">Timing</div>
        <div className="mt-2 text-lg">
          Peak: {report.timing.peakStart} – {report.timing.peakEnd}
        </div>
        <div className="text-sm text-zinc-400">
          Sunset: {report.timing.sunset}
        </div>
      </div>

      {/* CONDITIONS */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
        <div className="text-xs text-zinc-500">Why it looks like this</div>
        <div className="mt-2 text-sm text-zinc-300">
          {report.conditions.explanation}
        </div>
      </div>

      {/* BEST LOCATION */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
        <div className="text-xs text-zinc-500">Best nearby</div>
        <div className="mt-2 text-lg font-medium">
          {report.recommendation.bestLocation}
        </div>
      </div>

      {/* VERDICT */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-lg font-medium">
          {report.verdict}
        </div>
      </div>

    </section>
  )
}
