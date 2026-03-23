import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine,RiMap2Line } from 'react-icons/ri';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const TruckIcon = L.divIcon({
  html: `<div style="background-color: #4f46e5; padding: 8px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <svg stroke="currentColor" fill="white" stroke-width="0" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 15V17H11V15H7ZM13 15V17H17V15H13ZM2 3H17C17.5523 3 18 3.44772 18 4V8H21C21.5523 8 22 8.44772 22 9V18C22 18.5523 21.5523 19 21 19H19C19 20.6569 17.6569 22 16 22C14.3431 22 13 20.6569 13 19H7C7 20.6569 5.65685 22 4 22C2.34315 22 1 20.6569 1 19H1V11.125C1 10.5186 1.35334 9.9723 1.91004 9.72488L5.27508 8.22931C5.72266 8.03038 6 7.58554 6 7.09641V4C6 3.44772 5.55228 3 5 3H2V3ZM6 10.1654L3 11.5V17H4.17419C4.58661 15.8291 5.69421 15 7 15C8.30579 15 9.41339 15.8291 9.82581 17H11.1742C11.5866 15.8291 12.6942 15 14 15C15.3058 15 16.4134 15.8291 16.8258 17H20V10H16V13H6V10.1654ZM16 5V8H4V7.09641L6.47161 5.99804C6.7849 5.85879 7 5.5474 7 5.20455V5H16ZM4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18C5 17.4477 4.55228 17 4 17ZM16 17C15.4477 17 15 17.4477 15 18C15 18.5523 15.4477 19 16 19C16.5523 19 17 18.5523 17 18C17 17.4477 16.5523 17 16 17Z"></path></svg>
         </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
};

const MapaRuta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [miUbicacion, setMiUbicacion] = useState(null);

  const { latDestino, lngDestino, descripcion } = location.state || {};

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setMiUbicacion([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("Error GPS:", err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!latDestino || !lngDestino) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-10 text-center bg-gray-50">
        <RiMap2Line size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-black text-gray-800 mb-2">Sin ruta activa</h2>
        <button onClick={() => navigate('/conductor/rutas')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100">
          Volver a Mis Rutas
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute top-6 left-6 right-6 z-[1000] flex justify-between items-start pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="pointer-events-auto bg-white p-4 rounded-2xl shadow-xl border border-gray-100 text-gray-700 active:scale-90 transition-all"
        >
          <RiArrowLeftLine size={24} />
        </button>

        <div className="pointer-events-auto bg-white p-5 rounded-[2rem] shadow-2xl border border-gray-100 max-w-[280px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Punto de Entrega</h4>
          </div>
          <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
            {descripcion?.split('|')[0].replace(/[[\]]/g, '') || "Recolección General"}
          </p>
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${latDestino},${lngDestino}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 bg-emerald-500 text-white text-xs font-black py-3 rounded-xl hover:bg-emerald-600 transition-colors"
          >
            ABRIR EN GOOGLE MAPS
          </a>
        </div>
      </div>

      <MapContainer 
        center={[latDestino, lngDestino]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} 
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        <Marker position={[latDestino, lngDestino]} icon={DefaultIcon}>
          <Popup>
            <div className="font-bold text-center p-1">Lugar de los residuos</div>
          </Popup>
        </Marker>

        {/* Marcador */}
        {miUbicacion && (
          <>
            <Marker position={miUbicacion} icon={TruckIcon}>
              <Popup><div className="font-bold">Tu posición actual</div></Popup>
            </Marker>
            <RecenterMap coords={miUbicacion} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapaRuta;