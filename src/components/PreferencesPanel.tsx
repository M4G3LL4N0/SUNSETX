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

  // Custom toggle switch component
  const Toggle = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean
    onChange: (c: boolean) => void
    label: string
  }) => (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="text-base text-zinc-200">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-12 h-7 rounded-full transition-all duration-300 ${
            checked ? "bg-gradient-to-r from-pink-500 to-orange-500" : "bg-white/10"
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-300 ${
            checked ? "translate-x-5" : ""
          }`}
        ></div>
      </div>
    </label>
  )

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 md:p-8 backdrop-blur-xl">
      <div className="text-lg font-semibold text-zinc-100 mb-6">Preferences</div>

      <div className="space-y-6">
        <Toggle
          label="Prefer woodsy spots"
          checked={prefs.prefersWoodsy}
          onChange={(c) => setPrefs((p) => ({ ...p, prefersWoodsy: c }))}
        />
        <Toggle
          label="Avoid water smell"
          checked={prefs.avoidWaterSmell}
          onChange={(c) => setPrefs((p) => ({ ...p, avoidWaterSmell: c }))}
        />
        <Toggle
          label="Prefer quiet vibe"
          checked={prefs.quietVibe}
          onChange={(c) => setPrefs((p) => ({ ...p, quietVibe: c }))}
        />

        <div>
          <div className="flex justify-between text-sm text-zinc-300 mb-3">
            <span>Max drive minutes</span>
            <span className="font-medium text-white">{prefs.maxDriveMinutes}</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            value={prefs.maxDriveMinutes}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, maxDriveMinutes: Number(e.target.value) }))
            }
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-white/50"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        className="mt-8 w-full rounded-full border border-white/10 bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-3 text-sm font-medium text-white shadow-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
      >
        Save preferences
      </button>

      {status ? <div className="mt-4 text-xs text-zinc-400 text-center">{status}</div> : null}
    </div>
  )
}
