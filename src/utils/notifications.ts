export function showNotification(title: string, body: string) {
  if (typeof window === "undefined") return false
  if (!("Notification" in window)) return false

  if (Notification.permission === "granted") {
    new Notification(title, { body })
    return true
  }

  return false
}
