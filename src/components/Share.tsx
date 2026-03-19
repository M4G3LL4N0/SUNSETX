"use client"

export default function Share() {
  const share = () => {
    const url = window.location.origin + "/api/share"

    navigator.clipboard.writeText(url)
    alert("Share link copied!")
  }

  return (
    <button
      onClick={share}
      className="mt-6 bg-white text-black px-4 py-2 rounded"
    >
      Share Sunset
    </button>
  )
}
