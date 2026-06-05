import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { VetClinic } from '../types';
import { Building2, MapPin, Star, Navigation2 } from 'lucide-react';

const createMarkerIcon = (color = "#f97316", iconSvg?: string) =>
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
        ${iconSvg ? `<div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">${iconSvg}</div>` : `<div style="width: 14px; height: 14px; background: white; border-radius: 50%;"></div>`}
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
  const count = cluster.getChildCount();
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        width: 44px;
        height: 44px;
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
          font-size: 14px;
        ">${count}</span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });
};

function ClinicPopupContent({ clinic, isFavorite, onToggleFavorite, categoryColor, cat }: any) {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<{rating: number, text: string}[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`patidestek_reviews_${clinic.id}`);
      if (stored) {
        setReviews(JSON.parse(stored));
      }
    } catch {}
  }, [clinic.id]);

  const saveReview = () => {
    if (rating === 0) return;
    const review = { rating, text: newReviewText, date: new Date().toLocaleDateString() };
    const updated = [...reviews, review];
    setReviews(updated);
    localStorage.setItem(`patidestek_reviews_${clinic.id}`, JSON.stringify(updated));
    setNewReviewText("");
    setRating(0);
    setShowReviewForm(false);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : null;

  return (
    <div className="flex flex-col min-w-[280px] max-w-[300px] rounded-[12px] overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      {clinic.media && (
        <img
          src={clinic.media}
          alt={clinic.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="mb-3"
          style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px 12px 0 0', display: 'block' }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3e%3crect width='400' height='200' fill='%23f1f5f9'/%3e%3c/svg%3e";
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
        
        <div className="flex items-center justify-between">
          <div className="w-fit px-2.5 py-1 font-bold text-xs flex items-center gap-1.5 rounded-lg" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColor }}></div>
             <span className="truncate">{cat}</span>
          </div>
          {avgRating && (
            <div className="flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
              <span>{avgRating} <span className="text-xs font-normal text-slate-500">({reviews.length})</span></span>
            </div>
          )}
        </div>
        
        <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          <MapPin className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 mt-0.5" />
          <p className="m-0 leading-snug">
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">{clinic.district}</strong> / {clinic.neighborhood}<br/>
            <span className="text-slate-500 dark:text-slate-400 mt-1 inline-block">{clinic.address}</span>
          </p>
        </div>

        {reviews.length > 0 && !showReviewForm && (
           <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
             <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Son Yorum</p>
             <div className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                "{reviews[reviews.length-1].text}"
             </div>
           </div>
        )}

        {!showReviewForm ? (
          <div className="flex items-center gap-2 mt-1">
            <button
               onClick={() => setShowReviewForm(true)}
               className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              Yorum Yap
            </button>
            <a 
               href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex-1 flex items-center justify-center gap-1.5 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 rounded-lg transition-colors"
            >
              <Navigation2 className="w-3.5 h-3.5" />
              <span>Yol Tarifi</span>
            </a>
          </div>
        ) : (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Puan Verin:</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                   <button key={star} onClick={() => setRating(star)}>
                     <Star className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-500' : 'text-slate-300 dark:text-slate-600'} hover:scale-110 transition-transform`} />
                   </button>
                ))}
              </div>
            </div>
            <textarea
              className="text-sm w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 resize-none font-sans"
              rows={2}
              placeholder="Deneyiminizi paylaşın..."
              value={newReviewText}
              onChange={e => setNewReviewText(e.target.value)}
            />
            <div className="flex gap-2">
               <button 
                 onClick={() => setShowReviewForm(false)}
                 className="flex-1 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
               >İptal</button>
               <button 
                 onClick={saveReview}
                 disabled={rating === 0}
                 className="flex-1 py-1.5 text-xs font-bold bg-orange-500 text-white rounded-lg disabled:opacity-50"
               >Kaydet</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
            
            let categoryColor = "#f97316"; // Default orange
            let iconSvg = undefined;
            const lowerCat = cat.toLowerCase();
            
            if (lowerCat.includes("park")) {
              categoryColor = "#22c55e"; // Green for parks
              iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-6"/><path d="m5 12 7-10 7 10"/><path d="m9 16 3-3 3 3"/></svg>`;
            } else if (lowerCat.includes("kafe") || lowerCat.includes("cafe")) {
              categoryColor = "#a855f7"; // Purple for cafes
              iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`;
            }

            const icon = createMarkerIcon(categoryColor, iconSvg);

            return (
            <Marker key={clinic.id} position={[clinic.lat, clinic.lng]} icon={icon}>
              <Tooltip direction="top" offset={[0, -20]} className="font-sans font-medium dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800">
                {clinic.name}<br/>
                <span className="text-slate-500 dark:text-slate-400 text-xs">{clinic.district}</span>
              </Tooltip>
              <Popup className="custom-popup border-0">
                <ClinicPopupContent 
                  clinic={clinic} 
                  isFavorite={isFavorite} 
                  onToggleFavorite={onToggleFavorite} 
                  categoryColor={categoryColor} 
                  cat={cat} 
                />
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
