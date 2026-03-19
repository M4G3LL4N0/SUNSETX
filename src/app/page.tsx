import EducationRotator from "@/components/EducationRotator"
import GlobalSunsetBoard from "@/components/GlobalSunsetBoard"
import PerfectSunsetFramework from "@/components/PerfectSunsetFramework"
import LiveSunsetDashboard from "@/components/LiveSunsetDashboard"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[8%] h-[360px] w-[360px] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[420px] w-[420px] rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,#050505_0%,#0a0a0f_45%,#060606_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-16">
        <div className="mb-12 text-center">
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-300 backdrop-blur-xl mb-6">
            SUNSETX · Live Sunset Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-pink-200 to-orange-200 mb-6">
            Never miss a perfect sunset
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-zinc-300">
            Location-aware sunset intelligence with nearby spots, timing precision, and premium narrative guidance.
            Know exactly when and where to be for the best colors.
          </p>
        </div>

        <div className="space-y-20">
          <LiveSunsetDashboard />
          <EducationRotator />
          <GlobalSunsetBoard />
          <PerfectSunsetFramework />
        </div>
      </div>
    </main>
  )
}
