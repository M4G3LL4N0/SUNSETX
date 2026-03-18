import { GoogleMap, Marker } from '@react-google-maps/api';

export default function Map({ locations }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div style={{ width: '100%', height: '400px', marginTop: '2rem', borderRadius: '0.5rem' }}>
      <GoogleMap
        apiKey={apiKey}
        center={{ lat: 37.7749, lng: -122.4194 }}
        zoom={15}
      >
        {locations.map((location, index) => (
          <Marker key={index} position={{ lat: location.lat, lng: location.lon }} />
        ))}
      </GoogleMap>
    </div>
  );
}
