"use client";

import { Search, Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingSearch() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-full p-2 flex items-center shadow-2xl mx-auto w-full max-w-4xl">
      <div className="flex-1 flex items-center px-6 md:px-8 border-r border-white/20 gap-4 hover:bg-white/10 rounded-l-full transition-colors cursor-pointer py-3">
        <MapPin size={20} className="text-[#D4AF37]" />
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">NEREDEN?</span>
          <input type="text" placeholder="Havalimanı Seçiniz" className="bg-transparent text-white text-[12px] font-bold outline-none placeholder-white" />
        </div>
      </div>
      <div className="flex-1 flex items-center px-6 md:px-8 border-r border-white/20 gap-4 hover:bg-white/10 transition-colors cursor-pointer py-3">
        <Calendar size={20} className="text-[#D4AF37]" />
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">TARİH</span>
          <span className="text-white text-[12px] font-bold">04 May Pts</span>
        </div>
      </div>
      <div className="flex-1 flex items-center px-6 md:px-8 gap-4 hover:bg-white/10 transition-colors cursor-pointer py-3">
        <Users size={20} className="text-[#D4AF37]" />
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">YOLCU</span>
          <span className="text-white text-[12px] font-bold">2 Yetişkin</span>
        </div>
      </div>
      <button className="bg-[#D4AF37] text-black w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(212,175,55,0.4)] ml-2">
        <Search size={24} />
      </button>
    </motion.div>
  );
}