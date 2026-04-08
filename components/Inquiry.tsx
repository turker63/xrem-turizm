"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 
import { useLanguage } from "@/context/LanguageContext";
import { Search, Ticket, Mail, Phone } from "lucide-react"; // ✅ DÜZELTİLDİ: lucide-react yapıldı

export default function ReservationInquiry() {
  const { lang } = useLanguage();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    code: "",
    email: "",
    phone: ""
  });

  const handleRedirect = () => {
    if (!formData.code || !formData.email || !formData.phone) return;
    
    const params = new URLSearchParams({
      pnr: formData.code.toUpperCase().trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.replace(/\s/g, "")
    }).toString();

    router.push(`/sorgula?${params}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-6 md:p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
        
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gold/10 rounded-full blur-[40px] pointer-events-none" />
        
        <div className="flex flex-col gap-6 relative z-10">
          
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 select-none">
                {lang === 'tr' ? "GÜVENLİ BİLET SORGULAMA" : "SECURE TICKET INQUIRY"}
              </h3>
            </div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center">
              {lang === 'tr' ? "Erişim için bilet bilgilerinizi doğrulayın" : "Verify your ticket details to access"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="relative group/input">
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder={lang === 'tr' ? "PNR NUMARASI (XREM-XXXX)" : "PNR NUMBER"} 
                className="w-full bg-white border border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:border-gold/50 text-gray-900 text-[11px] font-black tracking-[0.2em] transition-all uppercase placeholder:text-gray-300 shadow-inner"
              />
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 group-hover/input:text-gold transition-colors" size={16} />
            </div>

            <div className="relative group/input">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder={lang === 'tr' ? "E-POSTA ADRESİ" : "EMAIL ADDRESS"} 
                className="w-full bg-white border border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:border-gold/50 text-gray-900 text-[11px] font-black tracking-[0.1em] transition-all placeholder:text-gray-300 shadow-inner"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 group-hover/input:text-gold transition-colors" size={16} />
            </div>

            <div className="relative group/input">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder={lang === 'tr' ? "TELEFON NUMARASI" : "PHONE NUMBER"} 
                className="w-full bg-white border border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:border-gold/50 text-gray-900 text-[11px] font-black tracking-[0.1em] transition-all placeholder:text-gray-300 shadow-inner"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 group-hover/input:text-gold transition-colors" size={16} />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleRedirect} 
              disabled={!formData.code || !formData.email || !formData.phone}
              className="bg-gold text-black w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-gold/20 hover:shadow-gold/40 disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3 mt-2 italic"
            >
              <Search size={18} />
              {lang === 'tr' ? "BİLETİ DOĞRULA VE GETİR" : "VERIFY & GET TICKET"}
            </motion.button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold group-hover:w-full transition-all duration-700"></div>
      </div>
    </div>
  );
}