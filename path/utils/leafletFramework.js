import { useEffect, useRef } from "react";

export const useLeaflet = (initialMap: any) => {
  const mapRef = useRef<any>(null);
  useEffect(() => {
    mapRef.current = initialMap;
  }, [initialMap]);
  return mapRef.current;
}
