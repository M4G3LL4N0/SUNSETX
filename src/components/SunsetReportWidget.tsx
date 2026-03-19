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
    <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
      {children}
    </span>
  )
}

function Card({
  title,
  children,
  className = "",
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-3 shadow-lg backdrop-blur-xl ${className}`}
    >
      {title ? (
        <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2">
          {title}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  )
}

function SpotCard({ spot, index }: { spot: Spot; index: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-400/5 via-fuchsia-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1.5">Spot #{index + 1}</div>
          <div className="text-xl font-medium text-white mb-1">{spot.name}</div>
          <div className="text-sm text-zinc-400">{spot.address}</div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-100 to-fuchsia-100">
            {spot.score}
          </div>
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mt-1">Score</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip>{spot.distanceMiles} mi</Chip>
        <Chip>~{spot.driveMinutes} min</Chip>
        <Chip>{spot.smellLabel}</Chip>
        <Chip>{spot.parkingLabel} parking</Chip>
        <Chip>{spot.vibeLabel}</Chip>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Panorama">
          <div className="text-sm leading-5 text-zinc-300">{spot.panoramaLabel}</div>
        </Card>
        <Card title="Ease">
          <div className="text-sm leading-5 text-zinc-300">{spot.easeLabel}</div>
        </Card>
        <Card title="Best for">
          <div className="text-sm leading-5 text-zinc-300">{spot.bestFor}</div>
        </Card>
        <Card title="Water risk">
          <div className="text-sm leading-5 text-zinc-300">{spot.waterLabel}</div>
        </Card>
      </div>

      <div className="mt-2">
        <Card title="Why it wins">
          <div className="text-sm leading-5 text-zinc-300">{spot.whyItWins}</div>
        </Card>
      </div>
    </div>
  )
}

export default function SunsetReportWidget({ report }: { report: Report | null }) {
  if (!report) return null

  return (
    <section className="mt-4 space-y-2">
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-400/10 via-fuchsia-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2">Tonight's Report</div>
            <div className="text-xl font-medium text-white mb-2">{report.header.title}</div>
            <div className="flex flex-wrap gap-1.5">
              <Chip>{report.summary.rating}</Chip>
              <Chip>Worth it: {report.summary.worthIt}</Chip>
              <Chip>{report.header.regionLabel}</Chip>
            </div>
          </div>
          <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-100 to-fuchsia-100">
            {report.summary.score}
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{report.header.intro}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card title="Golden Hour">
          <div className="text-lg font-medium text-white">{report.timing.goldenHourStart}</div>
          <div className="mt-0.5 text-xs text-zinc-400">Start time</div>
        </Card>
        <Card title="Peak Window">
          <div className="text-lg font-medium text-white">{report.timing.peakWindow}</div>
          <div className="mt-0.5 text-xs text-zinc-400">Best color</div>
        </Card>
        <Card title="Official Sunset">
          <div className="text-lg font-medium text-white">{report.timing.sunsetOfficial}</div>
          <div className="mt-0.5 text-xs text-zinc-400">Sun crosses horizon</div>
        </Card>
        <Card title="Afterglow">
          <div className="text-lg font-medium text-white">{report.timing.afterglow}</div>
          <div className="mt-0.5 text-xs text-zinc-400">Post-sunset color</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <Card title="Cloud Structure">
          <div className="text-sm leading-5 text-zinc-300">{report.whyTonightIsGood.cloudStructure}</div>
        </Card>
        <Card title="Atmosphere">
          <div className="text-sm leading-5 text-zinc-300">{report.whyTonightIsGood.atmosphere}</div>
        </Card>
        <Card title="Wind">
          <div className="text-sm leading-5 text-zinc-300">{report.whyTonightIsGood.wind}</div>
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
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="What to avoid">
        <div className="grid gap-2">
          {report.avoid.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-zinc-300"
            >
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
        <Card title="SUNSETX decision">
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
