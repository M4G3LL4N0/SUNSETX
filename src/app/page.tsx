import EducationRotator from "@/components/EducationRotator"
import GlobalSunsetBoard from "@/components/GlobalSunsetBoard"
import PerfectSunsetFramework from "@/components/PerfectSunsetFramework"
import LiveSunsetDashboard from "@/components/LiveSunsetDashboard"

// Page will be statically generated with ISR
export const revalidate = 3600 // 1 hour

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-20%] top-[-20%] h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] md:h-[420px] md:w-[420px] rounded-full bg-fuchsia-500/20 blur-2xl sm:blur-3xl" />
        <div className="absolute right-[-15%] top-[5%] h-[240px] w-[240px] sm:h-[280px] sm:w-[280px] md:h-[360px] md:w-[360px] rounded-full bg-sky-500/20 blur-2xl sm:blur-3xl" />
        <div className="absolute bottom-[-20%] left-[10%] h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] md:h-[420px] md:w-[420px] rounded-full bg-orange-500/15 blur-2xl sm:blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,#050505_0%,#0a0a0f_45%,#060606_100%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3">
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            <LiveSunsetDashboard />
            <EducationRotator />
          </div>
          <div className="lg:col-span-4 space-y-2 sm:space-y-3">
            <GlobalSunsetBoard />
            <PerfectSunsetFramework />
          </div>
        </div>
      </div>
    </main>
  )
}
