import EducationRotator from "@/components/EducationRotator"
import GlobalSunsetBoard from "@/components/GlobalSunsetBoard"
import PerfectSunsetFramework from "@/components/PerfectSunsetFramework"
import LiveSunsetDashboard from "@/components/LiveSunsetDashboard"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <LiveSunsetDashboard />
        <EducationRotator />
        <GlobalSunsetBoard />
        <PerfectSunsetFramework />
      </div>
    </main>
  )
}
