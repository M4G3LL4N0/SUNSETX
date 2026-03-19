"use client"

import dynamic from "next/dynamic"

type Location = {
  name: string
  lat: number
  lon: number
  score?: number
}

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
})

export default function MapSection({ locations }: { locations: Location[] }) {
  return (
    <div className="h-[300px] md:h-[400px]">
      <Map locations={locations} />
    </div>
  )
}
