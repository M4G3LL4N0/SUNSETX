"use client"

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "400px",
}

export default function Map({ locations }: any) {
  const center = {
    lat: locations[0].lat,
    lng: locations[0].lon,
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {locations.map((loc: any) => (
          <Marker key={loc.name} position={{ lat: loc.lat, lng: loc.lon }} />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}
