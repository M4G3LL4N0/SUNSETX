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

      <div className="mx-auto max-w-6xl px-4 py-4 md:px-5 md:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-8 space-y-3">
            <LiveSunsetDashboard />
            <EducationRotator />
          </div>
          <div className="lg:col-span-4 space-y-3">
            <GlobalSunsetBoard />
            <PerfectSunsetFramework />
          </div>
        </div>
      </div>
    </main>
  )
}
