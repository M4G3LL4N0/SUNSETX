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
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm">
      <div className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-6">
        {title}
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={`${title}-${item.city}-${item.country}`}
            className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-white/[0.06] p-6 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-zinc-500 font-medium mb-2">#{index + 1}</div>
                <div className="text-2xl font-semibold text-white mb-3">
                  {item.city}, {item.country}
                </div>
                <p className="text-base leading-relaxed text-zinc-300">
                  {item.why}
                </p>
              </div>
              <div className="flex-shrink-0 text-center md:text-right">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-orange-200">
                  {item.score}
                </div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 mt-2">Score</div>
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
      <section className="mt-16 rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="text-sm text-zinc-400">Loading global sunset board…</div>
      </section>
    )
  }

  return (
    <section className="mt-16 rounded-[28px] border border-white/10 bg-white/5 p-8 md:p-12 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            Global sunset board
          </div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-pink-200 to-orange-200">
            Best sunset windows across the world
          </h2>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-400 whitespace-nowrap self-start md:self-auto">
          Updated {new Date(board.updatedAt).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Section title="Today" items={board.today} />
        <Section title="Tomorrow" items={board.tomorrow} />
        <Section title="This week" items={board.week} />
      </div>
    </section>
  )
}
