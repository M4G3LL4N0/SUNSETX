export const getUserLocation = async () => {
  try {
    const response = await navigator.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 })
    return {
      lat: response.coords.latitude,
      lon: response.coords.longitude
    }
  } catch (err) {
    throw new Error("Geolocation error: " + err.message)
  }
}
