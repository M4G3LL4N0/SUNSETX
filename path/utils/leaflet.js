import { MapContainer, TileLayer } from "react-leaflet";

export const createMap = (lat: number, lon: number) => {
  const map = new MapContainer({
    position: [lat, lon],
    zoom: 13,
  });
  const tileLayer = new TileLayer({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  });
  map.addLayer(tileLayer);
  return map;
}
