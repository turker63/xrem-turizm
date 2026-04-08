"use client";

import { motion } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';

export default function WhatsAppButton() {
  const { lang } = useLanguage();
  
  const phoneNumber = "905322855572"; 
  const message = lang === 'en' 
    ? "Hello XREMTRANSFER, I would like to get information about VIP transfer booking." 
    : "Merhaba XREMTRANSFER, VIP transfer rezervasyonu hakkında bilgi almak istiyorum.";
  
  const hoverText = lang === 'en' ? "Quick Booking" : "Hızlı Rezervasyon";

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 3, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[999] bg-[#25D366] p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all flex items-center justify-center group"
    >
      {/* Üzerine gelince açılan metin */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-white text-[10px] font-black mr-0 group-hover:mr-3 uppercase tracking-[0.2em]">
        {hoverText}
      </span>

      {/* WhatsApp Logosu (SVG) */}
      <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="white" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.481 5.229 3.481 8.404c0 6.556-5.332 11.888-11.888 11.888-2.022 0-4.005-.515-5.756-1.491l-6.228 1.616zm6.052-15.827c-.249-.551-.511-.563-.747-.573-.193-.008-.415-.008-.636-.008s-.58.083-.884.414c-.304.331-1.159 1.132-1.159 2.759s1.187 3.203 1.353 3.423c.166.22 2.334 3.563 5.654 4.994 2.76 1.19 3.322.953 3.929.897.607-.055 1.959-.801 2.235-1.573s.276-1.435.193-1.573c-.083-.138-.304-.221-.635-.387s-1.959-.966-2.263-1.076-.525-.165-.747.165-.856 1.076-1.049 1.3-.387.248-.718.082c-.331-.166-1.397-.514-2.661-1.641-1.012-.903-1.694-2.019-1.892-2.35-.199-.331-.021-.51.145-.675.148-.149.331-.387.497-.58s.221-.331.331-.552c.11-.221.055-.414-.028-.58-.083-.165-.747-1.793-1.025-2.411z"/>
      </svg>
    </motion.a>
  );
}