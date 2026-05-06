"use client"

export default function Share() {
  const share = async () => {
    try {
      const url = window.location.origin + "/api/share"
      await navigator.clipboard.writeText(url)
      alert("Share link copied to clipboard!")
    } catch (error) {
      console.error('Failed to copy share link:', error)
      alert("Failed to copy share link. Please try again.")
    }
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
