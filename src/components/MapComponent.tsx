import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { VetClinic } from '../types';
import { Building2, MapPin, Star, Navigation2 } from 'lucide-react';

const createMarkerIcon = (color = "#f97316") =>
  L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 14px; height: 14px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -38],
  });


const INITIAL_CENTER: [number, number] = [40.9996, 29.0251]; // Somewhere between Kadıköy and Üsküdar
const INITIAL_ZOOM = 13;

interface MapComponentProps {
  clinics: VetClinic[];
  userLocation: [number, number] | null;
  focusLocation?: [number, number] | null;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

// Controller component to smoothly fly to new locations
function MapController({ center, zoom }: { center: [number, number] | null, zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-styled',
    iconSize: L.point(40, 40, true),
  });
};

export default function MapComponent({ clinics, userLocation, focusLocation, favorites, onToggleFavorite }: MapComponentProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [mapZoom, setMapZoom] = useState(INITIAL_ZOOM);

  useEffect(() => {
    if (focusLocation) {
      setMapCenter(focusLocation);
      setMapZoom(16);
    }
  }, [focusLocation]);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(15);
    }
  }, [userLocation]);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
      <MapContainer 
        center={INITIAL_CENTER} 
        zoom={INITIAL_ZOOM} 
        style={{ height: '100%', width: '100%', background: '#f8fafc' }}
        zoomControl={true}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={50}
        >
          {clinics.map((clinic) => {
            const cat = clinic.subCategory || 'Diğer';
            const isFavorite = favorites.includes(clinic.id);
            
            let categoryColor = "#f97316";
            if (cat === "Veteriner" || cat === "Veteriner Kliniği") {
              categoryColor = "#f97316";
            } else if (cat === "Veteriner Polikliniği") {
              categoryColor = "#3b82f6";
            } else if (cat === "Veteriner Hastanesi") {
              categoryColor = "#22c55e";
            } else if (cat === "Acil Veteriner") {
              categoryColor = "#ef4444";
            } else if (cat === "Diğer" || cat === "Other") {
              categoryColor = "#8b5cf6";
            } else {
              categoryColor = "#8b5cf6";
            }

            const icon = createMarkerIcon(categoryColor);

            return (
            <Marker key={clinic.id} position={[clinic.lat, clinic.lng]} icon={icon}>
              <Tooltip direction="top" offset={[0, -20]} className="font-sans font-medium dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800">
                {clinic.name}<br/>
                <span className="text-slate-500 dark:text-slate-400 text-xs">{clinic.district}</span>
              </Tooltip>
              <Popup className="custom-popup border-0">
                <div className="flex flex-col min-w-[260px] max-w-[280px] rounded-[12px] overflow-hidden shadow-sm bg-white dark:bg-slate-900">
                  {clinic.media && (
                    <img
                      src={clinic.media}
                      alt={clinic.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="mb-3"
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px 12px 0 0', display: 'block' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3e%3crect width='400' height='200' fill='%23fff7ed'/%3e%3cpath transform='translate(176, 76) scale(2)' fill='%23f97316' d='M12 8.5c-1.5 0-2.8 1.5-3 3.3-.2 1.8 1 3.2 2.5 3.2h1c1.5 0 2.7-1.4 2.5-3.2-.2-1.8-1.5-3.3-3-3.3zM7.5 10c1.2 0 2.2-1.4 2.2-3s-1-3-2.2-3S5.3 5.3 5.3 7 6.3 10 7.5 10zM16.5 10c1.2 0 2.2-1.4 2.2-3s-1-3-2.2-3-2.2 1.3-2.2 3 1 3 2.2 3zM4.3 15.5c-1.2 0-2 1.2-2 2.5s1 2.5 2 2.5 2.5-.8 2.5-2-1-3-2.5-3zM19.7 15.5c-1.5 0-2.5 1.8-2.5 3s1.5 2 2.5 2 2-1.2 2-2.5-.8-2.5-2-2.5z'/%3e%3c/svg%3e";
                      }}
                    />
                  )}
                  <div className={`px-4 pb-4 flex flex-col gap-3 bg-white dark:bg-slate-900 ${!clinic.media ? 'pt-4' : 'pt-1'}`}>
                    <div className="flex items-start justify-between gap-2 mt-1">
                      <h3 className="font-bold text-[15px] text-slate-800 dark:text-slate-100 m-0 leading-tight">{clinic.name}</h3>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(clinic.id); }}
                        className="shrink-0 group/fav"
                        title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                      >
                        <Star className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-yellow-400 text-yellow-500' : 'text-slate-300 dark:text-slate-600 group-hover/fav:text-yellow-400 group-hover/fav:fill-yellow-100'}`} />
                      </button>
                    </div>
                    
                    <div className="w-fit px-2.5 py-1 font-bold text-xs flex items-center gap-1.5 rounded-lg max-w-full" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColor }}></div>
                       <span className="truncate">{cat}</span>
                    </div>
                    
                    <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      <MapPin className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 mt-0.5" />
                      <p className="m-0 leading-snug">
                        <strong className="text-slate-800 dark:text-slate-200 font-semibold">{clinic.district}</strong> / {clinic.neighborhood}<br/>
                        <span className="text-slate-500 dark:text-slate-400 mt-1 inline-block">{clinic.address}</span>
                      </p>
                    </div>

                    <a 
                       href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="mt-1 flex items-center justify-center gap-1.5 w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm py-2 rounded-lg transition-colors"
                    >
                      <Navigation2 className="w-4 h-4" />
                      <span>Yol Tarifi Al</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          )})}
        </MarkerClusterGroup>

        {userLocation && (
           <Marker position={userLocation} icon={L.divIcon({
              html: `<div style="width:16px; height:16px; background-color:#3b82f6; border:3px solid white; border-radius:50%; box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>`,
              className: '',
              iconSize: [20, 20]
           })}>
              <Popup>Buradasınız</Popup>
           </Marker>
        )}
      </MapContainer>
    </div>
  );
}
