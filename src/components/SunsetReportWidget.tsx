"use client"

type Spot = {
  id?: string
  name: string
  address: string
  score: number
  spotScore: number
  scent: number
  smellLabel: string
  parkingLabel: string
  vibeLabel: string
  bestFor: string
  whyItWins: string
  panoramaLabel: string
  easeLabel: string
  waterLabel: string
  distanceMiles: number
  driveMinutes: number
}

type Report = {
  header: {
    title: string
    dateLabel: string
    regionLabel: string
    preferenceLabel: string
    intro: string
  }
  summary: {
    score: number
    rating: string
    worthIt: string
    bullets: string[]
  }
  timing: {
    goldenHourStart: string
    peakWindow: string
    sunsetOfficial: string
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
    combinedSignals: string[]
    becomes: string[]
  }
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
      {children}
    </span>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
        {title}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function SpotCard({ spot, index }: { spot: Spot; index: number }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-black/30 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-500">Spot #{index + 1}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">{spot.name}</div>
          <div className="mt-2 text-sm text-zinc-400">{spot.address}</div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.05] px-4 py-3 text-right">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Score
          </div>
          <div className="mt-1 text-2xl font-bold">{spot.score} 🔥</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip>{spot.distanceMiles} mi away</Chip>
        <Chip>~{spot.driveMinutes} min</Chip>
        <Chip>Smell: {spot.smellLabel}</Chip>
        <Chip>Parking: {spot.parkingLabel}</Chip>
        <Chip>Vibe: {spot.vibeLabel}</Chip>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Panorama</div>
          <div className="mt-2 text-sm leading-6 text-zinc-300">{spot.panoramaLabel}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ease</div>
          <div className="mt-2 text-sm leading-6 text-zinc-300">{spot.easeLabel}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Water / smell risk</div>
          <div className="mt-2 text-sm leading-6 text-zinc-300">{spot.waterLabel}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Why it wins</div>
          <div className="mt-2 text-sm leading-6 text-zinc-300">{spot.whyItWins}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Best for</div>
          <div className="mt-2 text-sm leading-6 text-zinc-300">{spot.bestFor}</div>
        </div>
      </div>
    </div>
  )
}

export default function SunsetReportWidget({ report }: { report: Report | null }) {
  if (!report) return null

  return (
    <section className="mt-10 space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-black/30 p-8">
        <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">
          {report.header.dateLabel}
        </div>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight">{report.header.title}</h2>
        <div className="mt-3 text-sm text-zinc-500">{report.header.regionLabel}</div>
        <div className="mt-2 text-sm text-zinc-500">{report.header.preferenceLabel}</div>
        <p className="mt-6 max-w-4xl text-base leading-8 text-zinc-300">{report.header.intro}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Section title="Overall sunset score">
          <div className="text-6xl font-bold tracking-tight">{report.summary.score} / 100</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip>{report.summary.rating}</Chip>
            <Chip>Worth it: {report.summary.worthIt}</Chip>
          </div>

          <div className="mt-5 space-y-3">
            {report.summary.bullets.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Timeline (local time)">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Golden hour start</div>
              <div className="mt-2 text-lg font-medium">{report.timing.goldenHourStart}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Peak window</div>
              <div className="mt-2 text-lg font-medium">{report.timing.peakWindow}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Sunset (official)</div>
              <div className="mt-2 text-lg font-medium">{report.timing.sunsetOfficial}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Afterglow</div>
              <div className="mt-2 text-lg font-medium">{report.timing.afterglow}</div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Leave by</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">{report.timing.leaveBy}</div>
          </div>
        </Section>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Section title="Why tonight is good — cloud structure">
          <div className="text-sm leading-7 text-zinc-300">{report.whyTonightIsGood.cloudStructure}</div>
        </Section>

        <Section title="Why tonight is good — atmosphere">
          <div className="text-sm leading-7 text-zinc-300">{report.whyTonightIsGood.atmosphere}</div>
        </Section>

        <Section title="Why tonight is good — wind">
          <div className="text-sm leading-7 text-zinc-300">{report.whyTonightIsGood.wind}</div>
        </Section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Live sunset intelligence">
          <div className="flex flex-wrap gap-2">
            <Chip>Clouds {report.conditions.clouds}%</Chip>
            <Chip>Humidity {report.conditions.humidity}%</Chip>
            <Chip>Visibility {report.conditions.visibility} mi</Chip>
            <Chip>Wind {report.conditions.wind} mph</Chip>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300">
            {report.conditions.explanation}
          </div>
        </Section>

        <Section title="What to expect">
          <div className="space-y-3">
            {report.whatToExpect.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="What to avoid">
        <div className="grid gap-3">
          {report.avoid.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300"
            >
              {item}
            </div>
          ))}
        </div>
      </Section>

      <div className="space-y-4">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          Top sunset spots (closest + ranked)
        </div>
        {report.spots.map((spot, index) => (
          <SpotCard key={`${spot.name}-${index}`} spot={spot} index={index} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="SUNSETX decision">
          <div className="text-lg font-medium">{report.decision.goNoGo}</div>
          <div className="mt-3 text-sm leading-6 text-zinc-300">{report.decision.bestMove}</div>
        </Section>

        <Section title={report.productInsight.title}>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Combined signals</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.productInsight.combinedSignals.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>

          <div className="mt-5 text-xs uppercase tracking-[0.2em] text-zinc-500">This becomes</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.productInsight.becomes.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </Section>
      </div>
    </section>
  )
}
