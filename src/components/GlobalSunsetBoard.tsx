"use client"

import { useEffect, useState } from "react"

type RankedSunset = {
  city: string
  country: string
  score: number
  why: string
  window: string
}

type BoardResponse = {
  updatedAt: string
  today: RankedSunset[]
  tomorrow: RankedSunset[]
  week: RankedSunset[]
}

type SectionProps = {
  title: string
  items: RankedSunset[]
}

function Section({ title, items }: SectionProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 shadow-lg backdrop-blur-xl">
      <div className="text-[14px] text-zinc-400">{title}</div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`${title}-${item.city}-${item.country}`}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm text-zinc-300">{item.city}</div>
                <div className="text-sm text-zinc-300">{item.country}</div>
              </div>
              <div className="text-sm text-zinc-300">{item.why}</div>
            </div>
            <div className="text-2xl font-bold text-violet-100">{item.score}</div>
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
    <section className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 md:p-6 shadow-lg backdrop-blur-xl">
      <div className="text-[14px] text-zinc-400">Global sunset board</div>
      <div className="text-2xl font-bold text-violet-100">Best sunset windows worldwide</div>
      <div className="text-sm text-zinc-300">Updated {new Date(board.updatedAt).toLocaleTimeString()}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Section title="Today" items={board.today} />
        <Section title="Tomorrow" items={board.tomorrow} />
        <Section title="This week" items={board.week} />
      </div>
    </section>
  )
}
