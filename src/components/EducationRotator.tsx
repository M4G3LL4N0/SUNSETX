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
    <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            Sunset intelligence
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Learn the sky while it rotates
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-400"
        >
          {paused ? "Resume" : `Next in ${secondsRemaining}s`}
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
            {current.category}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-400">
            {current.readTime}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-semibold">{current.title}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
          {current.body}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {FACTS.map((fact, factIndex) => (
          <button
            key={fact.title}
            type="button"
            onClick={() => goTo(factIndex)}
            className={`h-2.5 w-10 rounded-full transition ${
              factIndex === index ? "bg-white" : "bg-white/15 hover:bg-white/25"
            }`}
            aria-label={`Show fact ${factIndex + 1}`}
            title={fact.title}
          />
        ))}
      </div>
    </section>
  )
}
