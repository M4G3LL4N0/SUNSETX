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
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-4 backdrop-blur-xl">
      <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-4">
        {title}
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${title}-${item.city}-${item.country}`}
            className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-3 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-lg font-medium text-white">
                    {item.city}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {item.country}
                  </div>
                </div>
                <p className="text-sm leading-5 text-zinc-300">
                  {item.why}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-100 to-fuchsia-100">
                  {item.score}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-zinc-500 mt-1">Score</div>
              </div>
            </div>
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
      <section className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-4 md:p-6 shadow-lg backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">
              Global sunset board
            </div>
            <div className="h-8 w-48 bg-white/[0.08] rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-4 backdrop-blur-xl">
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                    <div className="h-5 w-32 bg-white/[0.08] rounded mb-2" />
                    <div className="h-4 w-full bg-white/[0.08] rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-4 md:p-6 shadow-lg backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">
            Global sunset board
          </div>
          <h2 className="text-2xl font-medium text-white">
            Best sunset windows worldwide
          </h2>
        </div>

        <div className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400">
          Updated {new Date(board.updatedAt).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Section title="Today" items={board.today} />
        <Section title="Tomorrow" items={board.tomorrow} />
        <Section title="This week" items={board.week} />
      </div>
    </section>
  )
}
