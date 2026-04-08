"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Eye, MousePointer2, Map, 
  Globe, Zap, Activity, ShieldCheck, 
  Smartphone, Monitor, ChevronRight
} from "lucide-react";

const LIVE_SESSIONS = [
  { id: "SESS-102", country: "TR", city: "İstanbul", page: "/rezervasyon-yap", device: "Mobile", duration: "3d 12s", active: true },
  { id: "SESS-105", country: "DE", city: "Berlin", page: "/filo/vito-vip", device: "Desktop", duration: "1d 45s", active: true },
  { id: "SESS-108", country: "RU", city: "Moskova", page: "/", device: "Mobile", duration: "12s", active: true },
  { id: "SESS-110", country: "TR", city: "Antalya", page: "/hizmetler", device: "Desktop", duration: "5s", active: true },
];

export default function AdminLive() {
  const [liveCount, setLiveCount] = useState(14);

  // Sayı simülasyonu (VIP dinamizm)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12">
      {/* 🏎️ LIVE HEADER */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">CANLI <span className="text-gold">RADAR</span></h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic opacity-60 italic">Gerçek Zamanlı Kullanıcı Trafik Hattı</p>
        </div>

        <div className="flex items-center gap-4 bg-gold/10 border border-gold/20 px-8 py-4 rounded-3xl">
           <div className="relative">
              <div className="w-3 h-3 bg-gold rounded-full animate-ping absolute inset-0" />
              <div className="w-3 h-3 bg-gold rounded-full relative" />
           </div>
           <div className="flex flex-col">
              <span className="text-2xl font-black italic leading-none text-gold">{liveCount}</span>
              <span className="text-[7px] font-black uppercase tracking-widest text-gold/60">AKTİF KULLANICI</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🗺️ DÜNYA GENELİ TRAFİK (SOL KOLON) */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <Globe className="text-gold" size={20} />
                  <h2 className="text-sm font-black italic uppercase tracking-widest">AKTİF OTURUMLAR</h2>
               </div>
               <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic">YENİLENME: 2s</span>
            </div>

            <div className="space-y-4">
              {LIVE_SESSIONS.map((session, i) => (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/[0.03] rounded-2xl hover:bg-white/[0.03] transition-all group/item"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <span className="text-lg">{session.country === 'TR' ? '🇹🇷' : session.country === 'DE' ? '🇩🇪' : '🇷🇺'}</span>
                       <div className="flex flex-col">
                          <span className="text-[11px] font-black text-white italic uppercase">{session.city}</span>
                          <span className="text-[7px] font-bold text-gray-600 tracking-widest">{session.id}</span>
                       </div>
                    </div>
                    <div className="hidden md:flex flex-col">
                       <span className="text-[7px] font-black text-gold/40 uppercase tracking-widest">GÖRÜNTÜLENEN SAYFA</span>
                       <span className="text-[10px] font-bold text-gray-300 italic">{session.page}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-gray-500">
                       {session.device === 'Mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                       <span className="text-[9px] font-black italic">{session.duration}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-700 group-hover/item:text-gold transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -z-10 group-hover:bg-gold/10 transition-all" />
          </section>
        </div>

        {/* 📊 CANLI ANALİTİK (SAĞ KOLON) */}
        <div className="space-y-8">
           <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 backdrop-blur-3xl">
              <div className="flex items-center gap-4 mb-8">
                 <Zap className="text-gold" size={20} />
                 <h2 className="text-sm font-black italic uppercase tracking-widest">HIZLI VERİ</h2>
              </div>
              
              <div className="space-y-6">
                 {[
                   { label: "SAYFA GÖRÜNTÜLEME", value: "2.4K", icon: <Eye size={16} />, color: "text-blue-500" },
                   { label: "TIKLAMA ORANI", value: "%18.4", icon: <MousePointer2 size={16} />, color: "text-purple-500" },
                   { label: "REZERVASYON ADIMI", value: "4", icon: <Activity size={16} />, color: "text-gold" },
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className={`${stat.color} opacity-40`}>{stat.icon}</div>
                         <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className="text-sm font-black italic text-white">{stat.value}</span>
                   </div>
                 ))}
              </div>
           </section>

           <section className="bg-gold text-black rounded-[3rem] p-8 relative overflow-hidden group cursor-pointer shadow-[0_20px_40px_rgba(212,175,55,0.1)]">
              <div className="relative z-10">
                 <ShieldCheck size={32} className="mb-4" />
                 <h3 className="text-lg font-black italic uppercase leading-none mb-2">GÜVENLİK <br />TARAMASI</h3>
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Sistem saniyeler içinde sarsıntısız</p>
              </div>
              <div className="absolute bottom-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
                 <Activity size={80} />
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}