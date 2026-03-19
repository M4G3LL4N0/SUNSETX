export function getPeakWindow(sunsetISO: string) {
  // Convert UTC → local time
  const sunsetUTC = new Date(sunsetISO)
  const sunsetLocal = new Date(
    sunsetUTC.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
  )

  const peakStart = new Date(sunsetLocal.getTime() - 2 * 60 * 1000)
  const peakEnd = new Date(sunsetLocal.getTime() + 6 * 60 * 1000)

  return { peakStart, peakEnd }
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}
