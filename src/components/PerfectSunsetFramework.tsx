"use client"

import { useEffect, useState } from "react"

type PerfectSunsetResponse = {
  title: string
  summary: string
  bullets: string[]
  updatedAt: string
}

export default function PerfectSunsetFramework() {
  const [data, setData] = useState<PerfectSunsetResponse | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      const res = await fetch("/api/perfect-sunset", { cache: "no-store" })
      const json = (await res.json()) as PerfectSunsetResponse
      if (active) setData(json)
    }

    load()
    const id = window.setInterval(load, 45000)

    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [])

  if (!data) {
    return (
      <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl">
        <div className="text-sm text-zinc-400">Loading perfect sunset framework…</div>
      </section>
    )
  }

  return (
    <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
        What makes a great sunset
      </div>

      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        {data.title}
      </h2>

      <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">
        {data.summary}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.bullets.map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-white/10 bg-black/30 p-5"
          >
            <h3 className="text-lg font-semibold">{item}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              This signal increases the odds that the sky will show stronger
              structure, cleaner color, and a more memorable finish.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 text-xs text-zinc-500">
        Updated {new Date(data.updatedAt).toLocaleTimeString()}
      </div>
    </section>
  )
}
