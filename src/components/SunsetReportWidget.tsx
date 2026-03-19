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
    <span className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[9px] font-medium text-zinc-200">
      {children}
    </span>
  )
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-[20px] border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm ${className}`}>
      {title && (
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-[11px] uppercase tracking-[0.15em] font-medium text-zinc-400">
            {title}
          </h3>
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function SpotCard({ spot, index }: { spot: Spot; index: number }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="text-xs text-zinc-500">Spot #{index + 1}</div>
            <div className="text-lg font-semibold tracking-tight">{spot.name}</div>
            <div className="text-xs text-zinc-400">{spot.address}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
              Score
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{spot.score}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <Chip>{spot.distanceMiles} mi</Chip>
          <Chip>~{spot.driveMinutes} min</Chip>
          <Chip>{spot.smellLabel}</Chip>
          <Chip>{spot.parkingLabel} parking</Chip>
          <Chip>{spot.vibeLabel}</Chip>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Panorama</div>
            <div className="mt-1 text-sm text-zinc-300">{spot.panoramaLabel}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Ease</div>
            <div className="mt-1 text-sm text-zinc-300">{spot.easeLabel}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Best for</div>
            <div className="mt-1 text-sm text-zinc-300">{spot.bestFor}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Water risk</div>
            <div className="mt-1 text-sm text-zinc-300">{spot.waterLabel}</div>
          </div>
        </div>

        <div className="mt-2">
          <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Why it wins</div>
          <div className="mt-1 text-sm text-zinc-300">{spot.whyItWins}</div>
        </div>
      </div>
    </div>
  )
}

export default function SunsetReportWidget({ report }: { report: Report | null }) {
  if (!report) return null;
  return (
    <section className="mt-4 space-y-4">
      {/* Header: Overall Score */}
      <Card>
        <div className="flex items-baseline gap-3">
          <div className="text-4xl font-bold tracking-tight">{report.summary.score}</div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <Chip>{report.summary.rating}</Chip>
              <Chip>Worth it: {report.summary.worthIt}</Chip>
            </div>
            <div className="space-y-1 text-sm text-zinc-300">
              {report.summary.bullets.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card title="Timeline">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Golden hour</div>
            <div className="mt-1 text-sm font-medium">{report.timing.goldenHourStart}</div>
          </div>
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Peak window</div>
            <div className="mt-1 text-sm font-medium">{report.timing.peakWindow}</div>
          </div>
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Official sunset</div>
            <div className="mt-1 text-sm font-medium">{report.timing.sunsetOfficial}</div>
          </div>
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Afterglow</div>
            <div className="mt-1 text-sm font-medium">{report.timing.afterglow}</div>
          </div>
        </div>
        <div className="mt-3 text-center text-xs text-zinc-400">
          {report.timing.leaveBy}
        </div>
      </Card>

      {/* Why Tonight Is Good */}
      <Card title="Why Tonight Is Good">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Cloud structure</div>
            <div className="mt-1 text-sm text-zinc-300">{report.whyTonightIsGood.cloudStructure}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Atmosphere</div>
            <div className="mt-1 text-sm text-zinc-300">{report.whyTonightIsGood.atmosphere}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Wind</div>
            <div className="mt-1 text-sm text-zinc-300">{report.whyTonightIsGood.wind}</div>
          </div>
        </div>
      </Card>

      {/* Live Sunset Intelligence */}
      <Card title="Live Sunset Intelligence">
        <div className="flex flex-wrap gap-2 mb-3">
          <Chip>Clouds {report.conditions.clouds}%</Chip>
          <Chip>Humidity {report.conditions.humidity}%</Chip>
          <Chip>Visibility {report.conditions.visibility} mi</Chip>
          <Chip>Wind {report.conditions.wind} mph</Chip>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {report.conditions.explanation}
        </p>
      </Card>

      {/* What to Expect */}
      <Card title="What to Expect">
        <div className="space-y-2">
          {report.whatToExpect.map((item) => (
            <div key={item} className="rounded-[16px] border border-white/10 bg-white/[0.02] p-2.5 text-xs text-zinc-300">
              {item}
            </div>
          ))}
        </div>
      </Card>

      {/* What to Avoid */}
      <Card title="What to Avoid">
        <div className="space-y-2">
          {report.avoid.map((item) => (
            <div key={item} className="rounded-[16px] border border-white/10 bg-white/[0.02] p-2.5 text-xs text-zinc-300">
              {item}
            </div>
          ))}
        </div>
      </Card>

      {/* Top Sunset Spots */}
      <div className="space-y-3">
        <h3 className="text-[12px] uppercase tracking-[0.24em] text-zinc-500">
          Top sunset spots
        </h3>
        <div className="grid gap-3 sm:grid-cols-1">
          {report.spots.slice(0, 3).map((spot, index) => (
            <SpotCard key={`${spot.name}-${index}`} spot={spot} index={index} />
          ))}
        </div>
      </div>

      {/* Decision */}
      <Card title="SUNSETX decision">
        <div className="text-base font-medium">{report.decision.goNoGo}</div>
        <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
          {report.decision.bestMove}
        </p>
      </Card>

      {/* Product Insight */}
      <Card title={report.productInsight.title}>
        <div className="mb-2">
          <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Combined signals</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {report.productInsight.combinedSignals.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">This becomes</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {report.productInsight.becomes.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </div>
      </Card>
    </section>
  )
}
