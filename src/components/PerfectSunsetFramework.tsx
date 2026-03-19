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
      <section className="mt-16 rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="text-sm text-zinc-400">Loading perfect sunset framework…</div>
      </section>
    )
  }

  return (
    <section className="mt-16 rounded-[28px] border border-white/10 bg-white/5 p-8 md:p-12 shadow-2xl backdrop-blur-sm">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500 mb-2">
        What makes a great sunset
      </div>

      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-pink-200 to-orange-200 mb-6">
        {data.title}
      </h2>

      <p className="max-w-4xl text-xl leading-relaxed text-zinc-300 mb-12">
        {data.summary}
      </p>

      <div className="space-y-6">
        {data.bullets.map((item) => (
          <div
            key={item}
            className="rounded-2xl border-l-4 border-l-pink-500 bg-white/[0.03] p-6 hover:bg-white/[0.06] transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-white mb-3">{item}</h3>
            <p className="text-base leading-relaxed text-zinc-300">
              This signal increases the odds that the sky will show stronger
              structure, cleaner color, and a more memorable finish.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-xs text-zinc-500 text-right">
        Updated {new Date(data.updatedAt).toLocaleTimeString()}
      </div>
    </section>
  )
}
