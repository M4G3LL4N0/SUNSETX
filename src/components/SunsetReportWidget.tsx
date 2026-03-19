"use client"

type Spot = {
  name: string
  address?: string
  score: number
  spotScore: number
  scent: number
  smellLabel?: string
  parkingLabel?: string
  vibeLabel?: string
  bestFor?: string
  whyItWins?: string
}

type Report = {
  summary: {
    score: number
    rating: string
    worthIt: string
  }
  timing: {
    goldenHourStart: string
    sunset: string
    peakStart: string
    peakEnd: string
    afterglow: string
    leaveBy: string
  }
  whyTonightIsGood: {
    cloudStructure: string
    atmosphere: string
    wind: string
  }
  conditions: {
    clouds: number
    humidity: number
    visibility: number
    wind: number
    explanation: string
  }
  whatToExpect: string[]
  avoid: string[]
  spots: Spot[]
  decision: {
    goNoGo: string
    bestMove: string
  }
  productInsight: {
    title: string
    items: string[]
    becomes: string[]
  }
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
      {children}
    </span>
  )
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  )
}

function SpotCard({ spot, index }: { spot: Spot; index: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-500">Spot #{index + 1}</div>
          <div className="mt-1 text-xl font-semibold">{spot.name}</div>
          <div className="mt-2 text-sm text-zinc-400">{spot.address}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Score
          </div>
          <div className="mt-1 text-2xl font-bold">{spot.score} 🔥</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill>Smell: {spot.smellLabel ?? "N/A"}</Pill>
        <Pill>Parking: {spot.parkingLabel ?? "N/A"}</Pill>
        <Pill>Vibe: {spot.vibeLabel ?? "N/A"}</Pill>
        <Pill>Scent: {Math.round(spot.scent * 100)}/100</Pill>
        <Pill>Spot: {spot.spotScore}/100</Pill>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Why it wins
          </div>
          <div className="mt-2 text-sm leading-6 text-zinc-300">
            {spot.whyItWins ?? "Strong combination of sunset-viewing traits."}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Best for
          </div>
          <div className="mt-2 text-sm leading-6 text-zinc-300">
            {spot.bestFor ?? "General sunset viewing"}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SunsetReportWidget({ report }: { report: Report | null }) {
  if (!report) return null

  return (
    <section className="mt-8 space-y-8">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
          <SectionTitle eyebrow="Overall sunset score" title="Tonight’s outlook" />

          <div className="mt-6 text-6xl font-bold">{report.summary.score} 🔥</div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>{report.summary.rating}</Pill>
            <Pill>Worth it: {report.summary.worthIt}</Pill>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-medium text-zinc-200">Decision</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">
              {report.decision.goNoGo}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
          <SectionTitle eyebrow="Timeline" title="Local sunset timing" />

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Golden hour start
              </div>
              <div className="mt-2 text-lg font-medium text-zinc-100">
                {report.timing.goldenHourStart}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Official sunset
              </div>
              <div className="mt-2 text-lg font-medium text-zinc-100">
                {report.timing.sunset}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Peak window
              </div>
              <div className="mt-2 text-lg font-medium text-zinc-100">
                {report.timing.peakStart} – {report.timing.peakEnd}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Afterglow
              </div>
              <div className="mt-2 text-lg font-medium text-zinc-100">
                {report.timing.afterglow}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Leave by
            </div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">
              {report.timing.leaveBy}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
        <SectionTitle eyebrow="Why tonight is good" title="Sunset intelligence" />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Cloud structure
            </div>
            <div className="mt-3 text-sm leading-6 text-zinc-300">
              {report.whyTonightIsGood.cloudStructure}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Atmospheric conditions
            </div>
            <div className="mt-3 text-sm leading-6 text-zinc-300">
              {report.whyTonightIsGood.atmosphere}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Wind
            </div>
            <div className="mt-3 text-sm leading-6 text-zinc-300">
              {report.whyTonightIsGood.wind}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300">
          {report.conditions.explanation}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
          <SectionTitle eyebrow="What to expect" title="Tonight’s visual profile" />

          <div className="mt-6 space-y-3">
            {report.whatToExpect.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
          <SectionTitle eyebrow="What to avoid" title="Common mistakes" />

          <div className="mt-6 space-y-3">
            {report.avoid.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
        <SectionTitle eyebrow="Top sunset spots" title="Nearby recommendations" />

        <div className="mt-6 grid gap-4">
          {report.spots.map((spot, index) => (
            <SpotCard key={`${spot.name}-${index}`} spot={spot} index={index} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
          <SectionTitle eyebrow="Go / no-go" title="Decision" />
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-lg font-medium text-zinc-100">
              {report.decision.goNoGo}
            </div>
            <div className="mt-3 text-sm leading-6 text-zinc-300">
              {report.decision.bestMove}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
          <SectionTitle eyebrow="Product insight" title={report.productInsight.title} />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Combined signals
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {report.productInsight.items.map((item) => (
                  <Pill key={item}>{item}</Pill>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Becomes
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {report.productInsight.becomes.map((item) => (
                  <Pill key={item}>{item}</Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
