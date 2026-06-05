import React from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Navigation2, Map as MapIcon, Heart, Shield, Activity, Users, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-orange-200 dark:selection:bg-orange-900">
      {/* Navbar Minimal */}
      <nav className="absolute top-0 w-full px-6 py-6 flex justify-between items-center z-50">
        <Logo iconClassName="w-10 h-10" textClassName="text-2xl dark:text-slate-100" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex gap-4 items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">Hayvan Dostu</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100 dark:bg-orange-900/20 rounded-full blur-[100px] opacity-60 -z-10" />
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-amber-100 dark:bg-amber-900/20 rounded-full blur-[80px] opacity-60 -z-10" />
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-rose-50 dark:bg-rose-900/10 rounded-full blur-[80px] opacity-80 -z-10" />

        <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start gap-6 relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-bold tracking-wide border border-orange-200 dark:border-orange-500/20 shadow-sm">
              <Heart className="w-4 h-4" /> Güvenilir Rehber
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] text-slate-900 dark:text-slate-100 tracking-tight">
              Kadıköy ve Üsküdar <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Veteriner Haritası
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
              Hayvan dostlarımızın acil anlarında saniyeler bile önemlidir. PatiDestek, size en yakın veteriner kliniklerini tek tıkla bulmanızı sağlar.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/map')}
              className="mt-6 group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4.5 rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/30 dark:shadow-orange-900/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <MapIcon className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Haritayı Keşfet</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <div className="flex items-center gap-6 mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> Ücretsiz ve Açık Veri
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Hızlı Erişim
              </div>
            </div>
          </motion.div>

          {/* Hero Illustration / Dashboard Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg lg:max-w-none perspective-1000 z-10"
          >
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-slate-700/60 p-4 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 transform rotate-y-[-5deg] rotate-x-[5deg]">
               <div className="bg-slate-100 dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700 relative aspect-[4/3] flex items-center justify-center">
                  {/* Decorative Mock Map Elements */}
                  <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                  <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-orange-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg animate-bounce" style={{ animationDuration: '3s' }} />
                  <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-slate-400 dark:bg-slate-600 rounded-full border-4 border-white dark:border-slate-800 shadow-md" />
                  <div className="absolute bottom-1/4 left-1/2 w-10 h-10 bg-amber-500 rounded-full border-4 border-white dark:border-slate-800 shadow-md delay-100" />
                  
                  {/* Mock UI Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 flex items-center gap-4 border border-slate-100 dark:border-slate-800">
                     <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex flex-shrink-0 items-center justify-center">
                        <Heart className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                     </div>
                     <div>
                        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-md mb-2"></div>
                        <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white dark:bg-slate-900/50 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">Amacımız</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto font-medium">
            PatiDestek, İstanbul'un yoğun nüfuslu Kadıköy ve Üsküdar bölgelerinde yaşayan
            hayvan severlerin ve sahiplerinin, acil ve normal ihtiyaç anında en yakın veteriner kliniğine
            hızlı ve kolay bir şekilde erişebilmesini sağlamak için tasarlanmıştır. Güvenilir ve
            sürekli güncellenen verilerle hayvan dostlarımızın yanında olmaya odaklanır.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Öne Çıkan Özellikler</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Haritamızı kullanışlı kılan güçlü araçlar.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<MapPin className="w-6 h-6" />}
              title="İnteraktif Harita" 
              desc="Tüm klinikleri Leaflet destekli dinamik harita üzerinde detaylı olarak görüntüleyin." 
            />
            <FeatureCard 
              icon={<Search className="w-6 h-6" />}
              title="Gelişmiş Filtreleme" 
              desc="İlçe, mahalle veya doğrudan klinik ismine göre hızlı ve anlık arama yapın." 
            />
            <FeatureCard 
              icon={<Navigation2 className="w-6 h-6" />}
              title="Yakınımdakiler" 
              desc="Konum izni ile sadece size en yakın(3km) veterinerleri anında bulun." 
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6" />}
              title="Hızlı ve Kesintisiz" 
              desc="Binlerce veriyi kümelendirme (clustering) ile takılmadan, akıcı bir şekilde inceleyin." 
            />
             <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="Kullanıcı Dostu" 
              desc="Glassmorphism destekli modern ve temiz arayüz ile karmaşadan uzak deneyim." 
            />
             <FeatureCard 
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
              title="Mobil Öncelikli" 
              desc="Telefon, tablet ve masaüstünde kusursuz çalışan esnek (responsive) tasarım." 
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-orange-600 dark:bg-orange-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-orange-400 dark:divide-orange-700">
            <div className="py-4">
              <div className="text-5xl font-extrabold text-white mb-2">~180</div>
              <div className="text-orange-200 font-semibold uppercase tracking-wider">Toplam Klinik</div>
            </div>
            <div className="py-4">
              <div className="text-5xl font-extrabold text-white mb-2">120+</div>
              <div className="text-orange-200 font-semibold uppercase tracking-wider">Kadıköy</div>
            </div>
            <div className="py-4">
              <div className="text-5xl font-extrabold text-white mb-2">50+</div>
              <div className="text-orange-200 font-semibold uppercase tracking-wider">Üsküdar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 dark:text-slate-500 py-12 border-t border-slate-800 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Logo iconClassName="text-orange-500 w-8 h-8" textClassName="text-white text-xl" className="mb-4" />
            <p className="text-sm max-w-sm">
              Hayvan dostlarımızın sağlığı için veriyi görünür kılıyoruz.
              Kadıköy ve Üsküdar ilçelerindeki klinikler haritada.
            </p>
          </div>
          <div className="md:text-right text-sm">
            <p className="mt-4 text-slate-500 dark:text-slate-600">&copy; {new Date().getFullYear()} PatiDestek. Tüm Hakları Saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-orange-100 dark:hover:border-orange-500/30 transition-all group"
    >
      <div className="w-14 h-14 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white dark:group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
