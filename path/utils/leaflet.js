import { MapContainer, TileLayer } from "react-leaflet";

export const createMap = (lat: number, lon: number) => {
  return (
    <MapContainer center={[lat, lon]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};
