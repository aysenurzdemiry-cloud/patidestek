import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Navigation2, Map as MapIcon, Loader2, Info, MapPin, SlidersHorizontal, X, RefreshCw, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVetData } from '../services/api';
import { VetClinic } from '../types';
import MapComponent from '../components/MapComponent';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;  
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
}

export default function MapPage() {
  const navigate = useNavigate();

  // State
  const [clinics, setClinics] = useState<VetClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'filters' | 'favorites'>('filters');
  const [focusLocation, setFocusLocation] = useState<[number, number] | null>(null);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('patidestek_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('patidestek_favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // Filters
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [districtFilter, setDistrictFilter] = useState<'Tümü' | 'Kadıköy' | 'Üsküdar'>('Tümü');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [nearbyMode, setNearbyMode] = useState(false);

  useEffect(() => {
    fetchVetData()
      .then(data => {
        setClinics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Data fetch error:", err);
        setError("Veriler yüklenirken bir sorun oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
        setLoading(false);
      });
  }, []);

  const handleLocateMe = (callback?: () => void) => {
    if (!navigator.geolocation) {
      alert("Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setLocationLoading(false);
        if (callback) callback();
      },
      (err) => {
        console.error("Location error:", err);
        alert("Konum alınamadı. Lütfen izinleri kontrol edin.");
        setLocationLoading(false);
        setNearbyMode(false);
      }
    );
  };

  const toggleNearbyMode = () => {
    if (nearbyMode) {
      setNearbyMode(false);
    } else {
      if (!userLocation) {
        handleLocateMe(() => setNearbyMode(true));
      } else {
        setNearbyMode(true);
      }
    }
  };

  const resetFilters = () => {
    setDistrictFilter('Tümü');
    setNeighborhoodSearch('');
    setNameSearch('');
    setNearbyMode(false);
    setShowFavoritesOnly(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Filter Logic
  const filteredClinics = useMemo(() => {
    return clinics.filter(clinic => {
      // Favorites Only Filter
      if (showFavoritesOnly && !favorites.includes(clinic.id)) return false;

      // Nearby Mode Filter (within 3km)
      if (nearbyMode && userLocation) {
        const dist = calculateDistance(userLocation[0], userLocation[1], clinic.lat, clinic.lng);
        if (dist > 3) return false;
      }
      
      // District Filter
      if (districtFilter !== 'Tümü' && !nearbyMode) { // Ignore district filter if nearby mode is active
        if (clinic.district.toUpperCase() !== districtFilter.toUpperCase()) return false;
      }
      
      // Neighborhood Search
      if (neighborhoodSearch.trim() !== '') {
        if (!clinic.neighborhood.toLowerCase().includes(neighborhoodSearch.toLowerCase())) return false;
      }
      
      // Name Search
      if (nameSearch.trim() !== '') {
        if (!clinic.name.toLowerCase().includes(nameSearch.toLowerCase())) return false;
      }
      
      return true;
    });
  }, [clinics, districtFilter, neighborhoodSearch, nameSearch, nearbyMode, userLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-900 dark:text-slate-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Harita Yükleniyor...</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Güncel klinik koordinatları alınıyor.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-900 dark:text-slate-50">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Hata!</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  const PageContainer = isFullscreen ? 'div' : 'main';
  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-50"
    : "min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans text-slate-900 dark:text-slate-50";

  return (
    <PageContainer className={containerClasses}>
      
      {/* Mobile Header / Navbar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
           <button 
             onClick={() => navigate('/')}
             className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition"
           >
             <ArrowLeft className="w-5 h-5" />
           </button>
           <Logo iconClassName="text-orange-500 w-6 h-6" textClassName="text-lg dark:text-slate-100" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtreler
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop) / Drawer (Mobile) */}
      <AnimatePresence>
        {(showMobileFilters || window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0
              ${showMobileFilters ? 'fixed inset-0 z-50' : 'hidden md:flex h-screen'}
            `}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <button 
                   onClick={() => navigate('/')}
                   className="hidden md:flex p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition"
                   title="Ana Sayfaya Dön"
                 >
                   <ArrowLeft className="w-5 h-5" />
                 </button>
                 <Logo iconClassName="text-orange-500 w-8 h-8" textClassName="text-xl hidden md:block dark:text-slate-100" />
                 <span className="md:hidden text-lg font-bold">Filtreler</span>
               </div>
               <div className="flex items-center justify-center gap-3">
                 <div className="hidden md:block">
                   <ThemeToggle />
                 </div>
                 {showMobileFilters && (
                   <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                     <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                   </button>
                 )}
               </div>
            </div>

            {/* Sidebar Content (Scrollable) */}
             <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
               
               {/* Stats Overview */}
               <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Bulunan SONUÇ</p>
                    <p className="text-3xl font-extrabold text-orange-700 dark:text-orange-500 leading-none">{filteredClinics.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">TOPLAM</p>
                    <p className="text-xl font-bold text-slate-500 dark:text-slate-400 leading-none">{clinics.length}</p>
                  </div>
               </div>

               <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 shrink-0 mt-1">
                  <button 
                    onClick={() => setSidebarTab('filters')} 
                    className={`flex-1 text-sm font-bold py-2.5 rounded-md transition ${sidebarTab === 'filters' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Filtreler
                  </button>
                  <button 
                    onClick={() => setSidebarTab('favorites')} 
                    className={`flex-1 text-sm font-bold py-2.5 rounded-md transition flex items-center justify-center gap-1.5 ${sidebarTab === 'favorites' ? 'bg-white dark:bg-slate-700 shadow-sm text-yellow-600 dark:text-yellow-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <Star className={`w-4 h-4 ${sidebarTab === 'favorites' ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    Favorilerim ({favorites.length})
                  </button>
               </div>

               <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

               {sidebarTab === 'favorites' ? (
                 <div className="flex flex-col gap-3 pb-4">
                    {favorites.length === 0 ? (
                      <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                         <Star className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                         <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">Henüz favorilere eklenmiş bir klinik bulunmuyor.</p>
                         <button onClick={() => setSidebarTab('filters')} className="text-orange-500 dark:text-orange-400 font-bold mt-4 text-sm hover:underline">
                           Klinikleri Keşfet
                         </button>
                      </div>
                    ) : (
                      clinics.filter(c => favorites.includes(c.id)).map(clinic => (
                        <div key={clinic.id} 
                             onClick={() => {
                                setFocusLocation([clinic.lat, clinic.lng]);
                                if (window.innerWidth < 768) setShowMobileFilters(false);
                             }}
                             className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-yellow-400 dark:hover:border-yellow-500 hover:shadow-md transition cursor-pointer flex flex-col gap-2 group">
                           <div className="flex justify-between items-start">
                             <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[15px] leading-tight pr-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{clinic.name}</h3>
                             <button onClick={(e) => { e.stopPropagation(); toggleFavorite(clinic.id); }} className="shrink-0 p-1 -m-1" title="Favorilerden Çıkar">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 hover:opacity-70 transition-opacity" />
                             </button>
                           </div>
                           <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                              <span className="leading-snug">{clinic.district} / {clinic.neighborhood}</span>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
               ) : (
                 <div className="flex flex-col gap-6">
                   {/* Quick Actions */}
                   <div className="flex flex-col gap-2">
                     <button
                       onClick={toggleNearbyMode}
                       disabled={locationLoading && !userLocation}
                       className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl font-bold transition w-full ${
                         nearbyMode 
                         ? 'bg-orange-500 text-white border-orange-600 shadow-md' 
                         : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10'
                       }`}
                     >
                       {(locationLoading && !userLocation) ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                       <span>{nearbyMode ? 'Yakınımdakiler (Aktif - Kapat)' : 'Bana En Yakın Klinikleri Bul'}</span>
                     </button>

                     <button
                       onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                       className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl font-bold transition w-full hidden md:flex ${
                         showFavoritesOnly 
                         ? 'bg-yellow-500 text-white border-yellow-600 shadow-md' 
                         : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10'
                       }`}
                     >
                       <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-white' : 'text-slate-400'}`} />
                       <span>{showFavoritesOnly ? 'Sadece Favorilerim (Aktif)' : 'Favorilerimi Göster'}</span>
                     </button>

                     <div className="grid grid-cols-2 gap-2 mt-1 -mb-2">
                        <button
                          onClick={() => handleLocateMe()}
                          disabled={locationLoading && !nearbyMode}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg font-medium transition text-sm disabled:opacity-50"
                        >
                          {(locationLoading && !nearbyMode) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation2 className="w-4 h-4" />}
                          <span>Konumuma Odaklan</span>
                        </button>
                        <button
                          onClick={() => resetFilters()}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg font-medium transition text-sm"
                        >
                          <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span>Filtreleri Sıfırla</span>
                        </button>
                     </div>
                   </div>

                   {/* Filter Forms */}
                   <div className={`flex flex-col gap-4 mt-2 ${nearbyMode ? 'opacity-50 pointer-events-none' : ''}`}>
                     
                     <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">İlçe Seçimi</label>
                       <div className="relative">
                         <select 
                           value={districtFilter}
                           onChange={(e) => setDistrictFilter(e.target.value as any)}
                           className="w-full pl-4 pr-10 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none text-slate-700 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                         >
                           <option value="Tümü">Tüm İlçeler</option>
                           <option value="Kadıköy">Kadıköy</option>
                           <option value="Üsküdar">Üsküdar</option>
                         </select>
                         <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                           <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                           </svg>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mahalle Ara</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                           <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                         </div>
                         <input
                           type="text"
                           placeholder="Örn: Acıbadem..."
                           value={neighborhoodSearch}
                           onChange={(e) => setNeighborhoodSearch(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                         />
                       </div>
                     </div>

                     <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Klinik İsmi Ara</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                           <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                         </div>
                         <input
                           type="text"
                           placeholder="Örn: Pati Vet..."
                           value={nameSearch}
                           onChange={(e) => setNameSearch(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                         />
                       </div>
                     </div>

                   </div>
                   
                   {/* Mobile Apply Filters Button */}
                   {showMobileFilters && (
                     <button 
                        onClick={() => setShowMobileFilters(false)}
                        className="mt-6 w-full bg-slate-900 dark:bg-slate-800 text-white font-bold py-4 rounded-xl"
                     >
                        Sonuçları Göster ({filteredClinics.length})
                     </button>
                   )}
                 </div>
               )}

            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Map Area */}
      <div className="flex-1 relative flex flex-col h-[calc(100vh-60px)] md:h-screen p-0 md:p-4 pb-4 md:pb-4">
         <div className="absolute top-6 right-6 z-[400] hidden md:block">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-sm border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors hover:shadow-md"
              title={isFullscreen ? "Küçült" : "Tam Ekran Yap"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 {isFullscreen ? (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                 )}
              </svg>
            </button>
         </div>

         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-none md:rounded-3xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative z-0"
         >
           <MapComponent clinics={filteredClinics} userLocation={userLocation} focusLocation={focusLocation} favorites={favorites} onToggleFavorite={toggleFavorite} />
         </motion.div>
      </div>
    </PageContainer>
  );
}
