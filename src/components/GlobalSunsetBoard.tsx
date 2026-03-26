"use client"

import { useEffect, useState } from "react"

type RankedSunset = {
  city: string
  country: string
  region: string
  score: number
  why: string
  window: string
  trend?: "rising" | "falling" | "steady"
}

type BoardResponse = {
  updatedAt: string
  today: {
    regions: RankedSunset[]
    cities: RankedSunset[]
  }
  tomorrow: {
    preview: RankedSunset[]
    trendAnalysis: string
  }
  week: {
    highlight: RankedSunset
    explanation: string
  }
  scoringExplanation: {
    factors: string[]
    idealConditions: string
  }
}

type SectionProps = {
  title: string
  items: RankedSunset[]
}

function Section({ title, items, compact = false }: SectionProps & { compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100/10 to-fuchsia-100/10 p-4 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[14px] font-medium text-zinc-300 uppercase tracking-wider">{title}</div>
        {!compact && <div className="text-[12px] text-zinc-500">SCORE</div>}
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`${title}-${item.city}-${item.country}`}
            className={`rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors ${
              compact ? "py-2" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-medium text-zinc-100">{item.city}</div>
                <div className="text-[12px] text-zinc-400">{item.country}</div>
                {compact && (
                  <div className="text-[12px] text-zinc-500 mt-1">{item.region}</div>
                )}
              </div>
              <div className="text-2xl font-bold text-violet-100">{item.score}</div>
            </div>
            {!compact && (
              <div className="mt-2 text-[12px] text-zinc-400 leading-tight">{item.why}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GlobalSunsetBoard() {
  const [board, setBoard] = useState<BoardResponse | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      const res = await fetch("/api/global-sunset-board", { cache: "no-store" })
      const data = (await res.json()) as BoardResponse
      if (active) setBoard(data)
    }

    load()
    const id = window.setInterval(load, 60000)

    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [])

  if (!board) {
    return (
      <section className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 md:p-6 shadow-lg backdrop-blur-xl">
        <div className="text-[14px] text-zinc-400">Loading global sunset board...</div>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-violet-100/10 to-fuchsia-100/10 p-4 backdrop-blur-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[14px] text-zinc-400 uppercase tracking-wider">Global Sunset Intelligence</div>
          <div className="text-2xl font-bold text-violet-100">Sunset Leaderboard</div>
        </div>
        <div className="text-sm text-zinc-500">
          Updated {new Date(board.updatedAt).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <Section 
            title="Today's Top Regions" 
            items={board.today.regions} 
            compact={true}
          />
        </div>
        <div className="lg:col-span-1">
          <Section 
            title="Tomorrow Preview" 
            items={board.tomorrow.preview} 
            compact={true}
          />
        </div>
      </div>

      <div className="mt-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
        <div className="text-sm font-medium text-zinc-100 mb-2">
          Week Highlight: {board.week.highlight.city} ({board.week.highlight.score})
        </div>
        <div className="text-[12px] text-zinc-400 leading-tight">
          {board.week.explanation}
        </div>
      </div>

      <div className="mt-3 text-[12px] text-zinc-400">
        <div className="font-medium mb-1">Scoring Factors:</div>
        <ul className="list-disc list-inside space-y-1">
          {board.scoringExplanation.factors.map((factor, i) => (
            <li key={i}>{factor}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
