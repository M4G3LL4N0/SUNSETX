import { MapContainer, TileLayer, Marker, Popup } from "leaflet"

export const createMap = (lat: number, lon: number) => {
  const map = new MapContainer({
    zoomLevel: 13,
    center: [lat, lon],
    style: () => ({
      color: "#6366f1",
      weight: 2,
    }),
  })
  const tileLayer = new TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  map.addLayer(tileLayer)
  return map
}
