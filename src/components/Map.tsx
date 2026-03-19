"use client"

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

type Location = {
  name: string
  lat: number
  lon: number
  score?: number
}

type MapProps = {
  locations: Location[]
}

const containerStyle = {
  width: "100%",
  height: "420px",
}

export default function Map({ locations }: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const fallbackCenter = {
    lat: 37.485,
    lng: -122.23,
  }

  const center =
    locations.length > 0
      ? { lat: locations[0].lat, lng: locations[0].lon }
      : fallbackCenter

  if (!apiKey) {
    return (
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
        Google Maps API key missing. Add{" "}
        <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to{" "}
        <code>.env.local</code>.
      </div>
    )
  }

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
          options={{
            clickableIcons: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {locations.map((loc) => (
            <Marker
              key={`${loc.name}-${loc.lat}-${loc.lon}`}
              position={{ lat: loc.lat, lng: loc.lon }}
              title={loc.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}
