export const useLeaflet = (map: MapContainer) => {
  const [map, setMap] = useState(map)
  useEffect(() => {
    const init = async () => {
      const geocode = await reverseGeocode(map.lat, map.lon)
      if (geocode) {
        setMap(createMap(geocode.lat, geocode.lon))
      }
    }
    init()
  }, [map])
  return map
}
