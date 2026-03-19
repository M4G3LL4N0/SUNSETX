"use client"

import { useEffect, useState } from "react"

export default function FavoriteSpotButton({
  userKey,
  spotId,
}: {
  userKey: string
  spotId: string
}) {
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/favorites?userKey=${encodeURIComponent(userKey)}`)
      const json = await res.json()

      if (res.ok) {
        setFavorite((json.favorites ?? []).includes(spotId))
      }
    }

    load()
  }, [userKey, spotId])

  const toggle = async () => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userKey, spotId }),
    })

    const json = await res.json()

    if (res.ok) {
      setFavorite(!!json.favorited)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-zinc-300"
    >
      {favorite ? "★ Favorited" : "☆ Favorite"}
    </button>
  )
}
