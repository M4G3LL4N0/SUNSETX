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

function Section({
  title,
  items,
}: {
  title: string
  items: RankedSunset[]
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
        {title}
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div
            key={`${title}-${item.city}-${item.country}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-zinc-500">#{index + 1}</div>
                <div className="mt-1 text-lg font-semibold">
                  {item.city}, {item.country}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {item.why}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Score
                </div>
                <div className="mt-1 text-2xl font-bold">{item.score}</div>
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
      <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl">
        <div className="text-sm text-zinc-400">Loading global sunset board…</div>
      </section>
    )
  }

  return (
    <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            Global sunset board
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Best sunset windows across the world
          </h2>
        </div>

        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-400">
          Updated {new Date(board.updatedAt).toLocaleTimeString()}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Section title="Today" items={board.today} />
        <Section title="Tomorrow" items={board.tomorrow} />
        <Section title="This week" items={board.week} />
      </div>
    </section>
  )
}
