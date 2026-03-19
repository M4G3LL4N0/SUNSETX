import { useEffect, useRef } from "react";
import { MapContainer } from "react-leaflet";

export const useLeaflet = (initialMap: any) => {
  const mapRef = useRef<any>(null);
  useEffect(() => {
    mapRef.current = initialMap;
  }, [initialMap]);
  return mapRef.current;
}
