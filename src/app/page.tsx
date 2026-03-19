import LiveSunsetDashboard from "@/components/LiveSunsetDashboard"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030305] text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        {/* Premium layered background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] to-[#030305]" />
        <div className="absolute left-[-20%] top-[-30%] h-[600px] w-[600px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-[-40%] left-[30%] h-[800px] w-[800px] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_40%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <LiveSunsetDashboard />
      </div>
    </main>
  )
}
