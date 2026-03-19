"use client"

import { useEffect, useState } from "react"

export default function PreferencesPanel({
  userKey,
}: {
  userKey: string
}) {
  const [prefs, setPrefs] = useState({
    prefersWoodsy: true,
    maxDriveMinutes: 12,
    avoidWaterSmell: false,
    quietVibe: true,
  })
  const [status, setStatus] = useState("")

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/preferences?userKey=${encodeURIComponent(userKey)}`)
      const json = await res.json()

      if (res.ok) {
        setPrefs({
          prefersWoodsy: json.prefersWoodsy,
          maxDriveMinutes: json.maxDriveMinutes,
          avoidWaterSmell: json.avoidWaterSmell,
          quietVibe: json.quietVibe,
        })
      }
    }

    load()
  }, [userKey])

  const save = async () => {
    setStatus("Saving…")

    const res = await fetch("/api/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userKey,
        ...prefs,
      }),
    })

    setStatus(res.ok ? "Saved." : "Failed to save.")
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-sm font-medium text-zinc-100">Preferences</div>

      <div className="mt-4 space-y-3 text-sm text-zinc-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.prefersWoodsy}
            onChange={(e) => setPrefs((p) => ({ ...p, prefersWoodsy: e.target.checked }))}
          />
          Prefer woodsy spots
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.avoidWaterSmell}
            onChange={(e) => setPrefs((p) => ({ ...p, avoidWaterSmell: e.target.checked }))}
          />
          Avoid water smell
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.quietVibe}
            onChange={(e) => setPrefs((p) => ({ ...p, quietVibe: e.target.checked }))}
          />
          Prefer quiet vibe
        </label>

        <label className="block">
          <div className="mb-2">Max drive minutes: {prefs.maxDriveMinutes}</div>
          <input
            type="range"
            min="5"
            max="30"
            value={prefs.maxDriveMinutes}
            onChange={(e) => setPrefs((p) => ({ ...p, maxDriveMinutes: Number(e.target.value) }))}
            className="w-full"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={save}
        className="mt-4 rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-medium text-black"
      >
        Save preferences
      </button>

      {status ? <div className="mt-3 text-sm text-zinc-400">{status}</div> : null}
    </div>
  )
}
