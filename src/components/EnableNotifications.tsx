"use client"

import { useState } from "react"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export default function EnableNotifications({
  lat,
  lon,
  cityLabel,
  timezoneOffset,
}: {
  lat: number
  lon: number
  cityLabel?: string
  timezoneOffset?: number
}) {
  const [status, setStatus] = useState("")

  const enable = async () => {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("Push notifications are not supported on this device.")
        return
      }

      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setStatus("Notifications were not allowed.")
        return
      }

      const registration = await navigator.serviceWorker.register("/sw.js")
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

      if (!vapidKey) {
        setStatus("Missing public VAPID key.")
        return
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      const res = await fetch("/api/push-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...subscription.toJSON(),
          lat,
          lon,
          cityLabel,
          timezoneOffset,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.error || "Failed to save push subscription")
      }

      setStatus("Notifications enabled.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to enable notifications")
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4 shadow-lg backdrop-blur-xl">
      <div className="text-[14px] text-zinc-400">Notifications</div>
      <div className="mt-2 text-sm text-zinc-300">Get daily sunset alerts and leave-now reminders.</div>
      <button
        type="button"
        onClick={enable}
        className="mt-4 rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-medium text-black"
      >
        Enable notifications
      </button>
      {status ? <div className="mt-3 text-xs text-zinc-400">{status}</div> : null}
    </div>
  )
}
