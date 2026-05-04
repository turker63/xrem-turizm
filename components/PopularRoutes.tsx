"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { supabase } from "@/lib/supabase";
import { ArrowUpRight, Star, MapPin, Sparkles, ChevronRight } from "lucide-react";

export default function PopularRoutes() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tStrings = {
    title1: lang === 'en' ? "EXCLUSIVE" : "ÖZEL",
    title2: lang === 'en' ? "ROUTES" : "ROTALAR",
    subtitle: lang === 'en' ? "Discover Our Most Preferred Destinations" : "En Çok Tercih Edilen Güzergahları Keşfedin",
    startFrom: lang === 'en' ? "STARTING FROM" : "BAŞLAYAN FİYATLARLA",
    premiumLabel: lang === 'en' ? "PREMIUM DESTINATION" : "PREMIUM GÜZERGAH",
    viewAll: lang === 'en' ? "VIEW ALL REGIONS" : "TÜM BÖLGELERİ GÖR",
  };

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      const { data, error } = await supabase
        .from("regions")
        .select("*")
        .eq("is_popular", true)
        .limit(4);

      if (!error && data) {
        setRoutes(data);
      }
      setLoading(false);
    };

    fetchPopularRoutes();
  }, []);

  const handleRouteClick = (region: any) => {
    const summary = {
      pickup: "Antalya Havalimanı (AYT)",
      dropoff: region.name,
      basePrice: region.price,
      totalPrice: region.price,
      dist: region.dist || "---"
    };
    localStorage.setItem("transferSummary", JSON.stringify(summary));
    router.push("/arac-secimi");
  };

  if (loading) return (
    <div className="w-full py-32 bg-cream flex justify-center items-center">
      <div className="relative">
        <div className="w-20 h-20 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Star size={20} className="text-gold animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (routes.length === 0) return null;

  const getGridSpan = (index: number) => {
    if (index === 0) return "lg:col-span-8";
    if (index === 1) return "lg:col-span-4";
    return "lg:col-span-6";
  };

  const getHeight = (index: number) => {
    if (index === 0) return "h-[450px] md:h-[500px]";
    if (index === 1) return "h-[450px] md:h-[500px]";
    return "h-[400px]";
  };

  return (
    <section id="routes" className="w-full py-24 md:py-32 bg-cream relative overflow-hidden z-20">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-luxury-dark/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={16} className="text-gold" />
              <span className="text-[10px] font-black text-gold tracking-[0.4em] uppercase">{tStrings.subtitle}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-luxury-dark italic leading-none">
              {tStrings.title1} <span className="text-gold block md:inline">{tStrings.title2}</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-24 h-1.5 bg-gold rounded-full"></motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {routes.map((route, index) => (
            <motion.div
              key={route.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.7, ease: "easeOut" }}
              className={`group relative rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-all duration-500 bg-luxury-dark ${getGridSpan(index)} ${getHeight(index)}`}
              onClick={() => handleRouteClick(route)}
            >
              <img 
                src={route.img_url || "/how-it-works/hizli-rezervasyon.jpeg"} 
                alt={route.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-700" />
              
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 rounded-[2.5rem] transition-colors duration-700 pointer-events-none" />

              <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                  <MapPin size={14} className="text-gold" />
                  <span className="text-white text-[10px] font-black tracking-widest">{route.dist || "VIP"}</span>
                </div>
                {index === 0 && (
                  <div className="bg-gold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                    <span className="text-[#1a1a1a] text-[10px] font-black tracking-widest uppercase">{tStrings.premiumLabel}</span>
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 w-full p-8 md:p-10 flex flex-col justify-end h-full">
                <div className="flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div>
                    <h3 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-3 drop-shadow-2xl">
                      {route.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-gold/80 text-[10px] font-black uppercase tracking-widest">{tStrings.startFrom}</span>
                      <span className="text-white text-2xl font-black bg-white/10 px-4 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
                        {formatPrice(route.price)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                    <ArrowUpRight size={28} className="group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TÜM BÖLGELERİ GÖR BUTONU (Yeni Eklendi) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <button 
            onClick={() => router.push("/bolgeler")}
            className="group relative flex items-center gap-4 bg-luxury-dark border border-gold/30 px-10 py-5 rounded-full text-white text-[11px] font-black tracking-[0.3em] uppercase hover:bg-gold hover:text-[#1a1a1a] transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] active:scale-95"
          >
            {tStrings.viewAll}
            <div className="w-8 h-8 rounded-full bg-gold/10 group-hover:bg-[#1a1a1a]/10 flex items-center justify-center transition-colors">
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>

      </div>
    </section>
  );
}