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

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-300 backdrop-blur-xl">
          SUNSETX · Live Sunset Intelligence
        </div>

        <div className="space-y-5">
          <LiveSunsetDashboard />
          <EducationRotator />
          <GlobalSunsetBoard />
          <PerfectSunsetFramework />
        </div>
      </div>
    </main>
  )
}
