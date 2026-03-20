"use client"

import { useEffect, useMemo, useState } from "react"

type FactCard = {
  title: string
  readTime: string
  category: string
  body: string
}

const FACTS: FactCard[] = [
  {
    title: "Why sunsets turn orange, pink, and red",
    readTime: "20 sec read",
    category: "Science",
    body:
      "As the sun drops lower, its light travels through more atmosphere. Shorter blue wavelengths get scattered away first, leaving warmer colors like orange, pink, and red to dominate what you see near the horizon.",
  },
  {
    title: "A few clouds are better than a totally clear sky",
    readTime: "20 sec read",
    category: "Scoring insight",
    body:
      "A perfect sunset usually is not a fully empty sky. Thin or broken mid and high clouds can catch and reflect warm light after the sun drops, creating layered color and stronger afterglow without fully blocking the horizon.",
  },
  {
    title: "Why the best color often happens after sunset",
    readTime: "18 sec read",
    category: "Timing",
    body:
      "Many people leave too early. Once the sun slips below the horizon, light can still illuminate clouds from below and behind. That is why the peak glow often happens a few minutes after official sunset time.",
  },
  {
    title: "Haze can help or hurt",
    readTime: "22 sec read",
    category: "Atmosphere",
    body:
      "A small amount of haze can soften light and deepen warm tones. Too much haze, smoke, or pollution can flatten contrast, mute color, and reduce clarity. The best sunsets usually balance warmth with crisp visibility.",
  },
  {
    title: "Open western horizons matter",
    readTime: "17 sec read",
    category: "Location",
    body:
      "Even a strong sunset can disappoint from the wrong spot. The best viewing locations have a broad west-facing horizon with minimal obstruction from buildings, hills, poles, or dense trees close to the horizon line.",
  },
  {
    title: "Water can amplify a sunset",
    readTime: "16 sec read",
    category: "Composition",
    body:
      "Ocean, bay, and lake surfaces can reflect color back into the scene. That creates a bigger, more immersive visual field and often makes a sunset feel richer than the same sky seen from a closed urban street view.",
  },
  {
    title: "Humidity changes the mood",
    readTime: "17 sec read",
    category: "Atmosphere",
    body:
      "Moderate humidity can increase softness and glow. Very high humidity can create haze and reduce definition. SUNSETX looks for the zone where the atmosphere helps the sky bloom without turning muddy or washed out.",
  },
  {
    title: "What the perfect sunset usually looks like",
    readTime: "24 sec read",
    category: "Perfect sunset",
    body:
      "The ideal setup is a clear or mostly clear western horizon, some layered mid or high clouds, good visibility, limited pollution, and a great viewing spot. The result is strong color, visible structure, and a memorable afterglow.",
  },
]

export default function EducationRotator() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(9)

  useEffect(() => {
    if (paused) return

    const tick = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          setIndex((prev) => (prev + 1) % FACTS.length)
          return 9
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(tick)
  }, [paused])

  const current = useMemo(() => FACTS[index], [index])

  const goTo = (nextIndex: number) => {
    setIndex(nextIndex)
    setSecondsRemaining(9)
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-3 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-zinc-500">
            Learn while you watch
          </div>
          <h2 className="mt-1.5 text-lg font-medium text-white">
            Sunset intelligence
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-300"
        >
          {paused ? "Resume" : `${secondsRemaining}s`}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-4 shadow-lg backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
            {current.category}
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-zinc-400">
            {current.readTime}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-medium text-white">{current.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {current.body}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {FACTS.map((fact, factIndex) => (
          <button
            key={fact.title}
            type="button"
            onClick={() => goTo(factIndex)}
            className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
              factIndex === index 
                ? "bg-gradient-to-r from-violet-400/80 to-fuchsia-400/80" 
                : "bg-white/10 hover:bg-white/20"
            }`}
            aria-label={`Show fact ${factIndex + 1}`}
            title={fact.title}
          />
        ))}
      </div>
    </section>
  )
}
