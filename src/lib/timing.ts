export function getPeakWindow(sunsetISO: string) {
  const sunset = new Date(sunsetISO)

  const peakStart = new Date(sunset.getTime() - 2 * 60 * 1000)
  const peakEnd = new Date(sunset.getTime() + 6 * 60 * 1000)

  return { peakStart, peakEnd }
}

export function getLeaveTime(travelMinutes: number, peakStart: Date) {
  return new Date(peakStart.getTime() - travelMinutes * 60 * 1000)
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
}
