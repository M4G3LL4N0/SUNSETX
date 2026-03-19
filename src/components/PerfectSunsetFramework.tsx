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
    <section className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-4 md:p-6 shadow-lg backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">
            Perfect sunset framework
          </div>
          <h2 className="text-2xl font-medium text-white">
            {data.title}
          </h2>
        </div>

        <div className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400">
          Updated {new Date(data.updatedAt).toLocaleTimeString()}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-400/5 via-fuchsia-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl mb-4">
        <p className="text-sm leading-6 text-zinc-300">
          {data.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.bullets.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-3 backdrop-blur-xl"
          >
            <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Signal</div>
            <div className="text-lg font-medium text-white mb-2">{item}</div>
            <p className="text-sm leading-5 text-zinc-400">
              This factor helps predict stronger structure, cleaner color, and memorable finish.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
