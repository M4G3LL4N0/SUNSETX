export function getPeakWindow(sunsetISO: string) {
  // JS Date automatically converts ISO UTC → local time
  const sunset = new Date(sunsetISO)

  const peakStart = new Date(sunset.getTime() - 2 * 60 * 1000)
  const peakEnd = new Date(sunset.getTime() + 6 * 60 * 1000)

  return { peakStart, peakEnd }
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}
