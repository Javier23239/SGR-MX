import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';

const CONTAINER_STYLE = { width: '100%', height: '100%' };

const MapaRuta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [miUbicacion, setMiUbicacion] = useState(null);

  const { latDestino, lngDestino } = location.state || {};

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBBId3Tq2n3OHWzOM6lENZ6QeqDzHppPsk", 
    libraries: [] 
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMiUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  if (loadError) return <div className="p-20 text-center">Error de Google Maps: {loadError.message}</div>;

  if (!latDestino || !lngDestino) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10">
        <h2 className="text-xl font-bold mb-4">No hay coordenadas de destino</h2>
        <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">Volver</button>
      </div>
    );
  }

  return isLoaded ? (
    <div className="relative w-full h-[calc(100vh-80px)] bg-gray-100 rounded-[2rem] overflow-hidden shadow-inner">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 z-10 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:bg-gray-50"
      >
        <RiArrowLeftLine size={20} />
      </button>

      <GoogleMap
        mapContainerStyle={CONTAINER_STYLE}
        center={{ lat: parseFloat(latDestino), lng: parseFloat(lngDestino) }}
        zoom={15}
        options={{
          disableDefaultUI: false,
          clickableIcons: false
        }}
      >
        {/* Marcador del destino */}
        <Marker position={{ lat: parseFloat(latDestino), lng: parseFloat(lngDestino) }} />

        {/* Marcador del conductor */}
        {miUbicacion && (
          <Marker 
            position={miUbicacion} 
            icon={{
              url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
              scaledSize: new window.google.maps.Size(30, 30)
            }}
          />
        )}
      </GoogleMap>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-indigo-600 font-bold">SGR-MX: CONECTANDO CON GOOGLE...</p>
    </div>
  );
};

export default MapaRuta;