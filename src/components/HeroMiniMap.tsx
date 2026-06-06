import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchVetData } from '../services/api';
import { VetClinic } from '../types';

const INITIAL_CENTER: [number, number] = [40.9996, 29.0251];

// Duplicate from MapComponent (or we could extract it)
const createMarkerIcon = (color = "#f97316", iconSvg?: string) =>
  L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${iconSvg ? `<div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center; transform-origin: center; scale: 0.8;">${iconSvg}</div>` : `<div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>`}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });

const createClusterCustomIcon = function (cluster: any) {
  const count = cluster.getChildCount();
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: rgba(249, 115, 22, 0.95);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: 800;
          font-size: 12px;
        ">${count}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

export function HeroMiniMap() {
  const [clinics, setClinics] = useState<VetClinic[]>([]);

  useEffect(() => {
    fetchVetData().then(data => setClinics(data)).catch(console.error);
  }, []);

  return (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 relative z-0">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full focus:outline-none z-0"
        style={{ background: 'transparent' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={40}
        >
          {clinics.map((clinic) => {
            const cat = clinic.subCategory || 'Diğer';
            let categoryColor = "#f97316";
            let iconSvg = undefined;
            const lowerCat = cat.toLowerCase();
            
            if (lowerCat.includes("park")) {
              categoryColor = "#22c55e";
              iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-6"/><path d="m5 12 7-10 7 10"/><path d="m9 16 3-3 3 3"/></svg>`;
            } else if (lowerCat.includes("kafe") || lowerCat.includes("cafe")) {
              categoryColor = "#a855f7";
              iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`;
            } else {
               iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="8" r="2.3"/><circle cx="12" cy="5.5" r="2.5"/><circle cx="18" cy="8" r="2.3"/><circle cx="8" cy="13" r="2.2"/><path d="M12 12.5c-3.2 0-5.8 2.3-5.8 5.1 0 1.5 1.2 2.4 2.7 2.4 1.2 0 2.1-.7 3.1-.7s1.9.7 3.1.7c1.5 0 2.7-.9 2.7-2.4 0-2.8-2.6-5.1-5.8-5.1z"/></svg>`;
            }

            return (
              <Marker 
                key={clinic.id} 
                position={[clinic.lat, clinic.lng]} 
                icon={createMarkerIcon(categoryColor, iconSvg)}
              />
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
      
      {/* Dark mode overlay helper if needed */}
      <div className="absolute inset-0 pointer-events-none mix-blend-color dark:mix-blend-overlay opacity-0 dark:opacity-100 bg-slate-900 z-[400]" />
    </div>
  );
}
