"use client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        {/* Premium layered background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] to-[#030305]" />
        <div className="absolute left-[-15%] top-[-20%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[80px]" />
        <div className="absolute right-[-10%] top-[-15%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[60px]" />
        <div className="absolute bottom-[-30%] left-[25%] h-[700px] w-[700px] rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute inset-0 backdrop-blur-4xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_40%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* Compact cinematic hero */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="text-4xl font-bold text-violet-100 tracking-tight">
              SUNSETX
            </div>
            <div className="text-[18px] text-zinc-400">
              The premium sunset intelligence you can trust
            </div>
          </div>
          <div className="text-3xl font-bold text-violet-100 tracking-tight">
            89/100
          </div>
        </div>

        {/* iOS widget-style sunset board */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 shadow-lg backdrop-blur-xl">
            <div className="text-[14px] text-zinc-400">Score</div>
            <div className="text-3xl font-bold text-violet-100">89</div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 shadow-lg backdrop-blur-xl">
            <div className="text-[14px] text-zinc-400">Peak</div>
            <div className="text-18px font-medium text-violet-100">18:43–19:03</div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 shadow-lg backdrop-blur-xl">
            <div className="text-[14px] text-zinc-400">Sunset</div>
            <div className="text-18px font-medium text-violet-100">19:03</div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 shadow-lg backdrop-blur-xl">
            <div className="text-[14px] text-zinc-400">Leave by</div>
            <div className="text-18px font-medium text-violet-100">18:30</div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 shadow-lg backdrop-blur-xl">
            <div className="text-[14px] text-zinc-400">Clouds</div>
            <div className="text-18px font-medium text-violet-100">42%</div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 shadow-lg backdrop-blur-xl">
            <div className="text-[14px] text-zinc-400">Visibility</div>
            <div className="text-18px font-medium text-violet-100">9.2mi</div>
          </div>
        </div>

        {/* Spot recommendations */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
            <div className="text-[12px] text-zinc-400">Junipero Serra Park</div>
            <div className="text-sm text-zinc-300">3.4mi | 9min</div>
            <div className="text-sm text-zinc-300">Pine scent | Easy parking</div>
            <div className="text-2xl font-bold text-violet-100">91</div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
            <div className="text-[12px] text-zinc-400">Skyline College Hills</div>
            <div className="text-sm text-zinc-300">4.8mi | 11min</div>
            <div className="text-sm text-zinc-300">Dry grass scent | Elevated view</div>
            <div className="text-2xl font-bold text-violet-100">88</div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-400/5 to-transparent p-4 shadow-lg backdrop-blur-xl">
            <div className="text-[12px] text-zinc-400">Bayfront Park</div>
            <div className="text-sm text-zinc-300">2.9mi | 8min</div>
            <div className="text-sm text-zinc-300">Clean scent | Reflective</div>
            <div className="text-2xl font-bold text-violet-100">84</div>
          </div>
        </div>

        {/* Supporting sections */}
        <div className="mt-8">
          <div className="text-[14px] text-zinc-400">Why tonight is good</div>
          <div className="text-sm text-zinc-300">Balanced cloud layer for color reflection · good visibility</div>
        </div>
        <div className="mt-4">
          <div className="text-[14px] text-zinc-400">What to expect</div>
          <div className="text-sm text-zinc-300">Warm gold, orange, and pink gradient potential</div>
        </div>
        <div className="mt-4">
          <div className="text-[14px] text-zinc-400">What to avoid</div>
          <div className="text-sm text-zinc-300">Blocked western horizons</div>
        </div>
        <div className="mt-4">
          <div className="text-[14px] text-zinc-400">Decision</div>
          <div className="text-sm text-zinc-300">GO — HIGH CONFIDENCE</div>
        </div>
      </div>
    </main>
  )
}
