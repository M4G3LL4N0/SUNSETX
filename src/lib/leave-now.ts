export function parseClockTimeToday(label: string): Date | null {
  const now = new Date()
  const match = label.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i)

  if (!match) {
    return null
  }

  let hours = Number(match[1])
  const minutes = Number(match[2])
  const meridiem = match[3].toUpperCase()

  if (meridiem === "PM" && hours !== 12) hours += 12
  if (meridiem === "AM" && hours === 12) hours = 0

  const date = new Date(now)
  date.setHours(hours, minutes, 0, 0)
  return date
}

interface LeaveNowStatus {
  leaveAt: string
  shouldLeaveNow: boolean
  urgency: "unknown" | "now" | "soon" | "later"
  copy: string
}

export function getLeaveNowStatus(input: {
  peakStart: string
  driveMinutes: number
}): LeaveNowStatus {
  const peakStartDate = parseClockTimeToday(input.peakStart)
  if (!peakStartDate) {
    return {
      leaveAt: "Unknown",
      shouldLeaveNow: false,
      urgency: "unknown",
      copy: "Timing unavailable",
    }
  }

  const leaveAt = new Date(peakStartDate.getTime() - input.driveMinutes * 60 * 1000)
  const now = new Date()
  const deltaMinutes = Math.round((leaveAt.getTime() - now.getTime()) / 60000)

  if (deltaMinutes <= 0) {
    return {
      leaveAt: leaveAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      shouldLeaveNow: true,
      urgency: "now",
      copy: "Leave now to catch the best window.",
    }
  }

  if (deltaMinutes <= 10) {
    return {
      leaveAt: leaveAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      shouldLeaveNow: false,
      urgency: "soon",
      copy: `Leave in ${deltaMinutes} min for ideal timing.`,
    }
  }

  return {
    leaveAt: leaveAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    shouldLeaveNow: false,
    urgency: "later",
    copy: `You have about ${deltaMinutes} min before you should go.`,
    }
}
