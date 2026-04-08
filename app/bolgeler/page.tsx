"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Navigation, ArrowRight, Star } from "lucide-react";

export default function AntalyaRegions() {
  const { lang } = useLanguage();
  const router = useRouter(); 
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      const { data, error } = await supabase
        .from("regions")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data) {
        setRegions(data);
      }
      setLoading(false);
    };

    fetchRegions();
  }, []);

  // 🏎️ REZERVASYON BAŞLATMA MOTORU
  const handleStartBooking = (region: any) => {
    const transferSummary = {
      pickup: "Antalya Havalimanı (AYT)",
      dropoff: region.name,
      dist: region.dist,
      // Admin panelinden gelen tüm fiyatları pakete ekliyoruz
      prices: {
        standard: region.price,
        ultra: region.price_ultra_vip,
        minivan: region.price_minivan,
        minibus: region.price_minibus
      },
      // İlk etapta ekranda görünecek baz fiyat
      basePrice: region.price, 
      totalPrice: `€${region.price}`, 
      date: "", 
      time: ""  
    };

    // Bilgileri saniyeler içinde tarayıcı hafızasına mühürle
    localStorage.setItem("transferSummary", JSON.stringify(transferSummary));
    
    // Araç seçimi sayfasına yönlendir
    router.push("/arac-secimi"); 
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <img 
          src="/bolgeler-bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/80 to-cream/85 backdrop-blur-[1px]" />
      </div>

      <section className="flex-1 pt-32 pb-24 px-4 relative z-10">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-20"
          >
            <div className="w-16 h-16 bg-white/60 border border-white rounded-[2rem] flex items-center justify-center text-gold mx-auto mb-6 shadow-lg">
              <Star size={32} />
            </div>
            <span className="text-[10px] font-black text-gold tracking-[0.5em] uppercase mb-4 block italic">VIP Transfer Rehberi</span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#1a1a1a] mb-6 italic">
              TRANSFER <span className="text-gold">BÖLGELERİ</span>
            </h1>
            <div className="h-1.5 w-24 bg-gold mx-auto rounded-full shadow-lg" />
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="w-12 h-12 border-4 border-cream-dark border-t-gold rounded-full animate-spin shadow-xl"></div>
              <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">Bölgeler Hazırlanıyor...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {regions.map((region, index) => (
                <motion.div
                  key={region.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 8) * 0.1 }}
                  className="group bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] overflow-hidden hover:shadow-2xl transition-all duration-700 flex flex-col relative"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img 
                      src={region.img_url || "/bolgeler/default.png"}
                      alt={region.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.85]" 
                    />
                    
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-sm flex items-center gap-2">
                      <Navigation size={12} className="text-gold" />
                      <span className="text-[#1a1a1a] text-[10px] font-black uppercase tracking-widest">{region.dist}</span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col justify-between flex-grow text-center">
                    <div className="mb-6">
                      <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight mb-2 group-hover:text-gold transition-colors duration-500 italic">
                        {region.name}
                      </h3>
                      <div className="flex justify-center items-baseline gap-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest opacity-60">€</span>
                        <span className="text-3xl font-black text-[#1a1a1a] tracking-tighter">{region.price}</span>
                        <span className="text-[9px] font-black text-gold uppercase tracking-tighter ml-1">'dan itibaren</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleStartBooking(region)}
                      className="w-full bg-[#1a1a1a] hover:bg-gold text-white px-6 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl group/btn transition-all duration-500"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {lang === 'tr' ? 'REZERVE ET' : 'BOOK NOW'} <ArrowRight size={16} />
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}