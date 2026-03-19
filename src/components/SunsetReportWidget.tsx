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
    <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-zinc-200">
      {children}
    </span>
  )
}

function Card({
  title,
  children,
  tint = "",
}: {
  title: string
  children: React.ReactNode
  tint?: string
}) {
  return (
    <div className={`rounded-[24px] border border-white/10 p-4 backdrop-blur-2xl ${tint}`}>
      <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
        {title}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function SpotCard({ spot, index }: { spot: Spot; index: number }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-500">Spot #{index + 1}</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">{spot.name}</div>
          <div className="mt-1 text-xs leading-5 text-zinc-400">{spot.address}</div>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-white/10 px-3 py-2 text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Score
          </div>
          <div className="mt-1 text-lg font-bold">{spot.score} 🔥</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip>{spot.distanceMiles} mi</Chip>
        <Chip>~{spot.driveMinutes} min</Chip>
        <Chip>{spot.smellLabel}</Chip>
        <Chip>{spot.parkingLabel} parking</Chip>
        <Chip>{spot.vibeLabel}</Chip>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Panorama</div>
          <div className="mt-2 text-xs leading-5 text-zinc-300">{spot.panoramaLabel}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Ease</div>
          <div className="mt-2 text-xs leading-5 text-zinc-300">{spot.easeLabel}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Best for</div>
          <div className="mt-2 text-xs leading-5 text-zinc-300">{spot.bestFor}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Water risk</div>
          <div className="mt-2 text-xs leading-5 text-zinc-300">{spot.waterLabel}</div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Why it wins</div>
        <div className="mt-2 text-xs leading-5 text-zinc-300">{spot.whyItWins}</div>
      </div>
    </div>
  )
}

export default function SunsetReportWidget({ report }: { report: Report | null }) {
  if (!report) return null

  return (
    <section className="mt-6 space-y-4">
      <Card
        title={report.header.dateLabel}
        tint="bg-[linear-gradient(135deg,rgba(244,114,182,0.10),rgba(251,146,60,0.10),rgba(59,130,246,0.08))]"
      >
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{report.header.title}</h2>
        <div className="mt-2 text-xs text-zinc-400">{report.header.regionLabel}</div>
        <div className="mt-1 text-xs text-zinc-500">{report.header.preferenceLabel}</div>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300">{report.header.intro}</p>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
        <Card title="Overall sunset score" tint="bg-[linear-gradient(135deg,rgba(244,114,182,0.10),rgba(251,146,60,0.08))]">
          <div className="text-5xl font-bold tracking-tight">{report.summary.score} / 100</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip>{report.summary.rating}</Chip>
            <Chip>Worth it: {report.summary.worthIt}</Chip>
          </div>
          <div className="mt-4 space-y-2">
            {report.summary.bullets.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-zinc-300">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Timeline" tint="bg-[linear-gradient(135deg,rgba(59,130,246,0.10),rgba(168,85,247,0.08))]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Golden hour</div>
              <div className="mt-2 text-sm font-medium">{report.timing.goldenHourStart}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Peak window</div>
              <div className="mt-2 text-sm font-medium">{report.timing.peakWindow}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Official sunset</div>
              <div className="mt-2 text-sm font-medium">{report.timing.sunsetOfficial}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Afterglow</div>
              <div className="mt-2 text-sm font-medium">{report.timing.afterglow}</div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-zinc-300">
            {report.timing.leaveBy}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Cloud structure" tint="bg-[linear-gradient(135deg,rgba(244,114,182,0.08),rgba(255,255,255,0.02))]">
          <div className="text-xs leading-6 text-zinc-300">{report.whyTonightIsGood.cloudStructure}</div>
        </Card>
        <Card title="Atmosphere" tint="bg-[linear-gradient(135deg,rgba(59,130,246,0.08),rgba(255,255,255,0.02))]">
          <div className="text-xs leading-6 text-zinc-300">{report.whyTonightIsGood.atmosphere}</div>
        </Card>
        <Card title="Wind" tint="bg-[linear-gradient(135deg,rgba(34,197,94,0.08),rgba(255,255,255,0.02))]">
          <div className="text-xs leading-6 text-zinc-300">{report.whyTonightIsGood.wind}</div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card title="Live sunset intelligence">
          <div className="flex flex-wrap gap-2">
            <Chip>Clouds {report.conditions.clouds}%</Chip>
            <Chip>Humidity {report.conditions.humidity}%</Chip>
            <Chip>Visibility {report.conditions.visibility} mi</Chip>
            <Chip>Wind {report.conditions.wind} mph</Chip>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-zinc-300">
            {report.conditions.explanation}
          </div>
        </Card>

        <Card title="What to expect">
          <div className="space-y-2">
            {report.whatToExpect.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-zinc-300">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="What to avoid">
        <div className="grid gap-2">
          {report.avoid.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-zinc-300">
              {item}
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
          Top sunset spots
        </div>
        {report.spots.map((spot, index) => (
          <SpotCard key={`${spot.name}-${index}`} spot={spot} index={index} />
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card title="SUNSETX decision" tint="bg-[linear-gradient(135deg,rgba(251,146,60,0.10),rgba(244,114,182,0.06))]">
          <div className="text-base font-medium">{report.decision.goNoGo}</div>
          <div className="mt-3 text-xs leading-6 text-zinc-300">{report.decision.bestMove}</div>
        </Card>

        <Card title={report.productInsight.title}>
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Combined signals</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.productInsight.combinedSignals.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>

          <div className="mt-4 text-[10px] uppercase tracking-[0.2em] text-zinc-500">This becomes</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.productInsight.becomes.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
