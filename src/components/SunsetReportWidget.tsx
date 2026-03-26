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
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
      {children}
    </span>
  )
}

function Card({
  title,
  children,
  className = "",
  tier,
}: {
  title?: string
  children: React.ReactNode
  className?: string
  tier?: "quick" | "premium" | "destination"
}) {
  const tierGradients = {
    quick: "from-violet-400/5 via-fuchsia-400/5",
    premium: "from-amber-500/5 to-yellow-400/5",
    destination: "from-pink-500/5 to-fuchsia-600/5",
    default: "from-violet-400/5 via-fuchsia-400/5"
  };

  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-gradient-to-br ${
        tierGradients[tier || "default"]
      } to-transparent p-3 shadow-lg backdrop-blur-xl ${className}`}
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

function SpotCard({ spot, index, label, className = "" }: { 
  spot: Spot; 
  index: number; 
  label?: string;
  className?: string;
}) {
  const tierClasses = {
    close: `
      bg-gradient-to-br from-violet-600/10 via-fuchsia-600/8 to-transparent
      shadow-[0_8px_40px_-15px_rgba(139,92,246,0.2)]
      hover:shadow-[0_12px_50px_-12px_rgba(139,92,246,0.25)]
    `,
    premium: `
      bg-gradient-to-br from-amber-500/10 to-yellow-400/8
      shadow-[0_8px_40px_-15px_rgba(245,158,11,0.2)]
      hover:shadow-[0_12px_50px_-12px_rgba(245,158,11,0.25)]
    `,
    destination: `
      bg-gradient-to-br from-pink-600/10 to-fuchsia-600/8
      shadow-[0_8px_40px_-15px_rgba(219,39,119,0.2)]
      hover:shadow-[0_12px_50px_-12px_rgba(219,39,119,0.25)]
    `,
  }[spot.tier || "close"];

  return (
    <div className={`
      rounded-2xl border border-white/15 p-3 backdrop-blur-xl
      transition-all duration-300 ease-in-out
      relative isolate overflow-hidden
      after:absolute after:insect-0 after:rounded-2xl
      after:pointer-events-none after:bg-gradient-to-b 
      after:from-white/[0.02] after:to-white/0
      ${tierClasses} ${className}
    `}>
      <div className="flex items-start justify-between gap-2">
        <div>
          {label && (
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{label}</div>
          )}
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">Spot #{index + 1}</div>
          <div className="text-base font-medium text-white mb-1">{spot.name}</div>
          <div className="text-xs text-zinc-400 truncate">{spot.address}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{spot.distanceMiles} mi • {spot.driveMinutes} min</div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-100 to-fuchsia-100">
            {spot.score}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-zinc-500 mt-1">Score</div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        <Chip>{spot.smellLabel}</Chip>
        <Chip>{spot.parkingLabel} parking</Chip>
        <Chip>{spot.vibeLabel}</Chip>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <div className="text-[10px] uppercase text-zinc-500">Panorama</div>
          <div className="text-xs text-zinc-300">{spot.panoramaLabel}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-zinc-500">Ease</div>
          <div className="text-xs text-zinc-300">{spot.easeLabel}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-zinc-500">Best for</div>
          <div className="text-xs text-zinc-300">{spot.bestFor}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-zinc-500">Water risk</div>
          <div className="text-xs text-zinc-300">{spot.waterLabel}</div>
        </div>
      </div>

      <div className="mt-2">
        <div className="text-[10px] uppercase text-zinc-500 mb-1">Why it wins</div>
        <div className="text-xs text-zinc-300">{spot.whyItWins}</div>
      </div>
    </div>
  )
}

export default function SunsetReportWidget({ report }: { report: Report | null }) {
  if (!report) return null

  // Categorize spots for display
  const closeSpots = report.spots.slice(0, 3)
  const midRangeSpot = report.spots[3] || null
  const premiumSpot = report.spots[4] || null

  return (
    <section className="mt-2 space-y-2">
      <div className="rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-violet-400/10 via-fuchsia-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
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
        <p className="mt-3 text-sm leading-6 text-zinc-300">{report.header.intro}</p>
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

      <div className="grid gap-2 md:grid-cols-3">
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

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-violet-400/5 via-fuchsia-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-3">Live conditions</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">Clouds</div>
              <div className="flex items-baseline gap-1">
                <div className="text-lg font-medium text-white">{report.conditions.clouds}</div>
                <div className="text-sm text-zinc-400">%</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">Humidity</div>
              <div className="flex items-baseline gap-1">
                <div className="text-lg font-medium text-white">{report.conditions.humidity}</div>
                <div className="text-sm text-zinc-400">%</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">Visibility</div>
              <div className="flex items-baseline gap-1">
                <div className="text-lg font-medium text-white">{report.conditions.visibility}</div>
                <div className="text-sm text-zinc-400">mi</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">Wind</div>
              <div className="flex items-baseline gap-1">
                <div className="text-lg font-medium text-white">{report.conditions.wind}</div>
                <div className="text-sm text-zinc-400">mph</div>
              </div>
            </div>
          </div>
          <div className="text-sm leading-5 text-zinc-400">
            {report.conditions.explanation}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-violet-400/5 via-fuchsia-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-3">What to expect</div>
          <div className="space-y-2">
            {report.whatToExpect.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-sm leading-5 text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Close Spots Section */}
      {closeSpots.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2">
            Nearby spots (5–15 min)
          </div>
          {closeSpots.map((spot, index) => (
            <SpotCard key={`${spot.name}-${index}`} spot={spot} index={index} />
          ))}
        </div>
      )}

      {/* Mid-Range Spot Section */}
      {midRangeSpot && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2">
            Worth the drive (~30 min)
          </div>
          <SpotCard spot={midRangeSpot} index={0} label="Premium option" />
        </div>
      )}

      {/* Premium Spot Section */}
      {premiumSpot && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2">
            Best in region (~1 hour)
          </div>
          <SpotCard spot={premiumSpot} index={0} label="Destination spot" />
        </div>
      )}

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-violet-400/5 via-fuchsia-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2">Decision</div>
          <div className="text-xl font-medium text-white mb-3">{report.decision.goNoGo}</div>
          <div className="text-sm leading-5 text-zinc-400">{report.decision.bestMove}</div>
        </div>

        <div className="rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-violet-400/5 via-fuchsia-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-3">{report.productInsight.title}</div>
          
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 mb-3">
            <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">Combined signals</div>
            <div className="flex flex-wrap gap-1.5">
              {report.productInsight.combinedSignals.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
            <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">This becomes</div>
            <div className="flex flex-wrap gap-1.5">
              {report.productInsight.becomes.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
