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
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      Share
    </button>
  )
}
