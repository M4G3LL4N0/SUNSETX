import { useEffect, useRef, useState } from "react"

type Location = {
  name: string
  lat: number
  lon: number
  [key: string]: any
}

export default function Map({ locations }: { locations: Location[] }) {
  const mapRef = useRef<google.maps.Map | null>(null)
  const [mapsLoaded, setMapsLoaded] = useState(false)

  useEffect(() => {
    // Load Google Maps API
    const loadMaps = () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY      if (!apiKey) {
        console.error("Google Maps API key not found")
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`
      script.async = true
      script.defer = true      window.initMap = () => {
        setMapsLoaded(true)
      }
      document.head.appendChild(script)
    }

    if (!mapsLoaded) {
      loadMaps()
    }

    return () => {
      // Cleanup
      window.initMap = null
    }
  }, [mapsLoaded])

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || locations.length === 0) return

    // Clear existing markers
    if (window.markers) {
      window.markers.forEach((marker: google.maps.Marker) => marker.setMap(null))
    }

    // Create markers for each location    const markers: google.maps.Marker[] = []
    const bounds = new google.maps.LatLngBounds()

    locations.forEach((loc) => {
      const position = new google.maps.LatLng(loc.lat, loc.lon)
      const marker = new google.maps.Marker({
        position,
        map: mapRef.current,
        title: loc.name,
      })
      markers.push(marker)
      bounds.extend(position)
    })

    // Fit map to show all markers
    if (locations.length > 0) {
      mapRef.current.fitBounds(bounds)
      // Adjust zoom if only one marker
      if (locations.length === 1) {
        mapRef.current.setZoom(15)
      }
    }

    window.markers = markers
  }, [locations, mapsLoaded])

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px", marginTop: "2rem", borderRadius: "0.5rem" }}
    />
  )
}
