"use client"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-2xl">
        <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
          SUNSETX
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Sunset report fallback loaded.
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-300">
          The live dashboard hit a temporary browser-side issue. SUNSETX is still online.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
        >
          Reload report
        </button>
      </div>
    </main>
  )
}
