type RankedSunset = {
  city: string
  country: string
  score: number
  why: string
  window: string
}

const TODAY: RankedSunset[] = [
  {
    city: "Santorini",
    country: "Greece",
    score: 96,
    window: "Today",
    why: "Layered high clouds, open sea horizon, and strong afterglow potential.",
  },
  {
    city: "Maui",
    country: "United States",
    score: 94,
    window: "Today",
    why: "Clear western ocean line with balanced cloud texture and clean visibility.",
  },
  {
    city: "Cape Town",
    country: "South Africa",
    score: 93,
    window: "Today",
    why: "Wide coastal horizon, dramatic sky structure, and strong late color carry.",
  },
]

const TOMORROW: RankedSunset[] = [
  {
    city: "Honolulu",
    country: "United States",
    score: 95,
    window: "Tomorrow",
    why: "Excellent horizon openness with light cloud layering and reflective water.",
  },
  {
    city: "Lisbon",
    country: "Portugal",
    score: 92,
    window: "Tomorrow",
    why: "Good atmospheric clarity and mid-cloud structure without heavy blockage.",
  },
  {
    city: "Sydney",
    country: "Australia",
    score: 91,
    window: "Tomorrow",
    why: "Balanced cloud pattern with broad harbor exposure and strong warm tones.",
  },
]

const THIS_WEEK: RankedSunset[] = [
  {
    city: "Malibu",
    country: "United States",
    score: 97,
    window: "This week",
    why: "High-upside coastal horizon with layered cloud windows and vivid afterglow setup.",
  },
  {
    city: "Ibiza",
    country: "Spain",
    score: 95,
    window: "This week",
    why: "Open water, strong horizon access, and repeated favorable evening structure.",
  },
  {
    city: "Bali",
    country: "Indonesia",
    score: 94,
    window: "This week",
    why: "Consistent tropical color potential with reflective water and broad viewing angles.",
  },
]

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
          Demo ranking widget for homepage preview
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Section title="Today" items={TODAY} />
        <Section title="Tomorrow" items={TOMORROW} />
        <Section title="This week" items={THIS_WEEK} />
      </div>
    </section>
  )
}
