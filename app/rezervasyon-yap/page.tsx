"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearchForm from "@/components/HeroSearchForm";
import Link from "next/link";
import { 
  Users, Briefcase, ChevronRight, 
  ShieldCheck, MapPin, RefreshCcw, ArrowRight
} from "lucide-react"; 

export default function RezervasyonYapPage() {
  const searchParams = useSearchParams();
  const [fleet, setFleet] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  const hasSearchParams = from && to;

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "active"); 

      if (!error) setFleet(data || []);
      setLoading(false);
    };

    if (hasSearchParams) fetchVehicles();
    else setLoading(false);
  }, [hasSearchParams]);

  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />

      {/* 🖼️ ARKA PLAN GÖRSELİ VE OVERLAY */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/how-it-works/hizli-rezervasyon.jpeg" 
          alt="Xrem Transfer Background" 
          className="w-full h-full object-cover"
        />
        {/* Kontrast için hafifletilmiş overlay, blur azaltıldı */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/80 to-cream/85 backdrop-blur-[1px]" />
      </div>

      <section className="flex-1 pt-32 pb-20 px-4 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          
          <AnimatePresence mode="wait">
            {!hasSearchParams ? (
              <motion.div 
                key="search-form" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                className="text-center"
              >
                <div className="mb-16">
                  <span className="text-[10px] font-black text-gold tracking-[0.5em] uppercase mb-4 block">Premium Seyahat Planla</span>
                  <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-luxury-dark mb-6 leading-none">
                    FİYAT ARA <br className="md:hidden" /> <span className="text-gold">& REZERVASYON</span>
                  </h1>
                  <div className="h-1.5 w-24 bg-gold mx-auto rounded-full" />
                </div>
                
                {/* ✅ BEYAZLIK KALDIRILDI: bg-white/80, shadow ve border sınıfları silindi */}
                <div className="p-4 md:p-8">
                    <HeroSearchForm />
                </div>
              </motion.div>
            ) : loading ? (
              <div className="h-96 flex flex-col items-center j
              
              stify-center gap-6 text-center">
                <div className="relative">
                    <RefreshCcw className="text-gold animate-spin" size={48} />
                    <div className="absolute inset-0 blur-xl bg-gold/20 animate-pulse" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-luxury-dark/60 italic">VIP Filo Hazırlanıyor...</span>
              </div>
            ) : (
              <motion.div key="vehicle-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                
                {/* ÜST BİLGİ PANELI: Glassmorphism */}
                <div className="bg-white/70 backdrop-blur-md border border-white p-6 md:p-8 rounded-[2.5rem] shadow-xl flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white border border-cream-dark rounded-2xl flex items-center justify-center text-gold shadow-sm">
                        <MapPin size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-luxury-gray uppercase tracking-[0.3em] mb-1 opacity-70">GÜZERGAH HATTINIZ</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm md:text-xl font-black text-luxury-dark uppercase tracking-tight">{from}</span>
                        <ArrowRight size={18} className="text-gold animate-pulse" />
                        <span className="text-sm md:text-xl font-black text-luxury-dark uppercase tracking-tight">{to}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-10 items-center border-l border-luxury-gray/10 pl-10 h-full">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-luxury-gray uppercase tracking-[0.3em] mb-1 opacity-70">TRANSFER TARİHİ</span>
                      <span className="text-sm md:text-lg font-black text-gold tracking-tight">{date}</span>
                    </div>
                    <Link href="/rezervasyon-yap" className="bg-white hover:bg-gold hover:text-white border border-cream-dark text-luxury-dark px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95">
                        DÜZENLE
                    </Link>
                  </div>
                </div>

                {/* ARAÇ KARTLARI */}
                <div className="grid grid-cols-1 gap-8">
                  {fleet.map((car, i) => (
                    <motion.div 
                        key={car.id} 
                        initial={{ opacity: 0, y: 40 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }} 
                        className="bg-white/80 backdrop-blur-xl border border-white rounded-[3.5rem] p-8 md:p-10 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                        {/* ARAÇ GÖRSEL ALANI */}
                        <div className="w-full lg:w-1/3 flex justify-center">
                           <div className="w-full aspect-video bg-cream-dark/20 rounded-[2.5rem] flex items-center justify-center border border-white/50 overflow-hidden p-6 group-hover:scale-105 transition-transform duration-1000">
                              {car.image_url ? (
                                <img src={car.image_url} alt={car.name} className="w-full h-full object-contain drop-shadow-2xl" />
                              ) : (
                                <span className="text-[10px] text-luxury-gray font-black uppercase tracking-widest opacity-40">GÖRSEL HAZIRLANIYOR</span>
                              )}
                           </div>
                        </div>

                        {/* DETAYLAR */}
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                          <div>
                            <span className="bg-gold/10 text-gold text-[9px] font-black px-4 py-1.5 rounded-full tracking-[0.3em] uppercase">Özel Seçim</span>
                            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-luxury-dark mt-4 italic">{car.name}</h3>
                          </div>
                          <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                            <VehicleFeature icon={<Users size={16} />} label={`${car.capacity} Kişi`} />
                            <VehicleFeature icon={<Briefcase size={16} />} label={`${car.luggage} Bavul`} />
                            <div className="flex items-center gap-3 text-luxury-dark text-[11px] font-black uppercase tracking-widest bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                                <ShieldCheck size={16} className="text-emerald-600" />
                                <span className="text-emerald-700">Onaylı VIP Araç</span>
                            </div>
                          </div>
                        </div>

                        {/* FİYAT ALANI */}
                        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-6 border-t lg:border-t-0 lg:border-l border-luxury-gray/10 pt-8 lg:pt-0 lg:pl-12">
                          <div className="text-center lg:text-right">
                             <span className="text-[10px] font-black text-luxury-gray uppercase tracking-[0.4em] block mb-2 opacity-60">SABİT FİYAT GARANTİSİ</span>
                             <span className="text-4xl md:text-5xl font-black text-luxury-dark tracking-tighter">{car.price} <span className="text-gold">TL</span></span>
                          </div>
                          <Link href={`/rezervasyon-yap/onay?car=${car.id}&${searchParams.toString()}`} className="w-full lg:w-auto">
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                className="w-full bg-luxury-black hover:bg-gold text-white px-10 py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-all relative overflow-hidden group/btn"
                            >
                              <span className="relative z-10 flex items-center gap-2">SEÇİMİ MÜHÜRLE <ChevronRight size={18} /></span>
                              <motion.div 
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] z-5"
                              />
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function VehicleFeature({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-3 text-luxury-dark text-[11px] font-black uppercase tracking-widest bg-cream/50 px-4 py-2 rounded-xl border border-cream-dark/50">
      <div className="text-gold">{icon}</div>
      {label}
    </div>
  );
}