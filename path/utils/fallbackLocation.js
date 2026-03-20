export const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
    );
    if (!res.ok) throw new Error("Reverse geocode failed");
    const data = await res.json();
    const address = data.address;
    const city = address.city || address.town || address.village;
    const state = address.state;
    if (city && state) return `Near ${city}, ${state}`;
    if (city) return `Near ${city}`;
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
