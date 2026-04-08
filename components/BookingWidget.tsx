"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, ArrowRight, Star } from "lucide-react";

export default function BookingWidget() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1",
  });

  const handleSearch = () => {
    // Verileri URL'e ekleyerek araç seçim sayfasına saniyeler içinde süzül
    const params = new URLSearchParams(bookingData).toString();
    router.push(`/rezervasyon-yap?${params}`);
  };

  return (
    <motion.div 
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-20 -mt-16 mx-auto max-w-6xl px-4"
    >
      <div className="bg-[#080808]/80 backdrop-blur-3xl border border-white/5 p-2 md:p-4 rounded-[2.5rem] shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center gap-2">
          
          {/* 📍 NEREDEN */}
          <div className="w-full lg:flex-1 bg-white/5 rounded-[1.8rem] p-4 flex items-center gap-4 group hover:bg-white/10 transition-all border border-transparent focus-within:border-gold/30">
            <MapPin className="text-gold" size={20} />
            <div className="flex flex-col flex-1">
              <label className="text-[7px] font-black text-gray-500 uppercase tracking-widest italic">BAŞLANGIÇ</label>
              <select 
                className="bg-transparent text-white text-[11px] font-black uppercase outline-none appearance-none cursor-pointer"
                onChange={(e) => setBookingData({...bookingData, from: e.target.value})}
              >
                <option value="">LOKASYON SEÇİN</option>
                <option value="ayt">ANTALYA HAVALİMANI (AYT)</option>
                <option value="belek">BELEK BÖLGESİ</option>
                <option value="kemer">KEMER BÖLGESİ</option>
              </select>
            </div>
          </div>

          <div className="hidden lg:block text-white/10 italic"><ArrowRight size={16} /></div>

          {/* 🏁 NEREYE */}
          <div className="w-full lg:flex-1 bg-white/5 rounded-[1.8rem] p-4 flex items-center gap-4 group hover:bg-white/10 transition-all border border-transparent focus-within:border-gold/30">
            <MapPin className="text-red-500" size={20} />
            <div className="flex flex-col flex-1">
              <label className="text-[7px] font-black text-gray-500 uppercase tracking-widest italic">VARALACAK NOKTA</label>
              <select 
                className="bg-transparent text-white text-[11px] font-black uppercase outline-none appearance-none cursor-pointer"
                onChange={(e) => setBookingData({...bookingData, to: e.target.value})}
              >
                <option value="">OTEL VEYA BÖLGE</option>
                <option value="ayt">ANTALYA HAVALİMANI (AYT)</option>
                <option value="belek">BELEK BÖLGESİ</option>
                <option value="side">SİDE / MANAVGAT</option>
              </select>
            </div>
          </div>

          {/* 📅 TARİH */}
          <div className="w-full lg:w-48 bg-white/5 rounded-[1.8rem] p-4 flex items-center gap-4 group hover:bg-white/10 transition-all border border-transparent focus-within:border-gold/30">
            <Calendar className="text-gold" size={20} />
            <div className="flex flex-col flex-1">
              <label className="text-[7px] font-black text-gray-500 uppercase tracking-widest italic">TRANSFER TARİHİ</label>
              <input 
                type="date" 
                className="bg-transparent text-white text-[11px] font-black outline-none color-scheme-dark"
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
              />
            </div>
          </div>

          {/* 🚀 BUTON */}
          <button 
            onClick={handleSearch}
            className="w-full lg:w-auto bg-gold text-black px-10 py-6 rounded-[1.8rem] text-[10px] font-black uppercase italic tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            ARAÇLARI GÖR
          </button>

        </div>

        {/* Alt Bilgi Rozeti */}
        <div className="mt-4 px-6 flex items-center justify-between text-[7px] font-black text-gray-600 uppercase tracking-[0.3em] italic">
          <div className="flex items-center gap-2">
            <Star size={8} className="text-gold" />
            <span>Saniyeler içinde sarsıntısız VIP onay</span>
          </div>
          <div className="flex items-center gap-2">
            <span>256+ aktif araç saniyeler içinde hatta</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}