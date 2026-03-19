"use client"

export default function ShareLiveCard({
  cityLabel,
  score,
  peakStart,
  peakEnd,
  bestSpot,
}: {
  cityLabel?: string
  score: number
  peakStart: string
  peakEnd: string
  bestSpot?: string
}) {
  const share = async () => {
    const params = new URLSearchParams({
      city: cityLabel ?? "Your Area",
      score: String(score),
      peak: `${peakStart} – ${peakEnd}`,
      spot: bestSpot ?? "Top nearby spot",
    })

    const url = `${window.location.origin}/api/share?${params.toString()}`

    await navigator.clipboard.writeText(url)
    alert("Live sunset share card copied.")
  }

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-medium text-black"
    >
      Copy live share card
    </button>
  )
}
