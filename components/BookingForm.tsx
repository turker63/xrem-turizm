"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Send, Search, ChevronDown, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from '@/context/LanguageContext';

const countryCodes = [
  { code: "+90", flag: "🇹🇷", label: "Turkey" },
  { code: "+49", flag: "🇩🇪", label: "Germany" },
  { code: "+7", flag: "🇷🇺", label: "Russia" },
  { code: "+44", flag: "🇬🇧", label: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", label: "USA" },
  { code: "+33", flag: "🇫🇷", label: "France" },
  { code: "+31", flag: "🇳🇱", label: "Netherlands" },
  { code: "+32", flag: "🇧🇪", label: "Belgium" },
  { code: "+41", flag: "🇨🇭", label: "Switzerland" },
  { code: "+43", flag: "🇦🇹", label: "Austria" },
  { code: "+971", flag: "🇦🇪", label: "UAE" },
  { code: "+34", flag: "🇪🇸", label: "Spain" },
  { code: "+39", flag: "🇮🇹", label: "Italy" },
  { code: "+994", flag: "🇦🇿", label: "Azerbaijan" },
  { code: "+966", flag: "🇸🇦", label: "Saudi Arabia" },
  { code: "+7", flag: "🇰🇿", label: "Kazakhstan" },
  { code: "+380", flag: "🇺🇦", label: "Ukraine" },
  { code: "+48", flag: "🇵🇱", label: "Poland" },
  { code: "+45", flag: "🇩🇰", label: "Denmark" },
  { code: "+46", flag: "🇸🇪", label: "Sweden" },
  { code: "+47", flag: "🇳🇴", label: "Norway" },
  { code: "+358", flag: "🇫🇮", label: "Finland" },
  { code: "+351", flag: "🇵🇹", label: "Portugal" },
  { code: "+30", flag: "🇬🇷", label: "Greece" },
  { code: "+974", flag: "🇶🇦", label: "Qatar" },
  { code: "+965", flag: "🇰🇼", label: "Kuwait" },
  { code: "+968", flag: "🇴🇲", label: "Oman" },
  { code: "+973", flag: "🇧🇭", label: "Bahrain" },
  { code: "+20", flag: "🇪🇬", label: "Egypt" },
  { code: "+212", flag: "🇲🇦", label: "Morocco" },
  { code: "+353", flag: "🇮🇪", label: "Ireland" },
  { code: "+420", flag: "🇨🇿", label: "Czechia" },
  { code: "+36", flag: "🇭🇺", label: "Hungary" },
  { code: "+40", flag: "🇷🇴", label: "Romania" },
  { code: "+359", flag: "🇧🇬", label: "Bulgaria" },
  { code: "+385", flag: "🇭🇷", label: "Croatia" },
  { code: "+381", flag: "🇷🇸", label: "Serbia" },
  { code: "+356", flag: "🇲🇹", label: "Malta" },
  { code: "+372", flag: "🇪🇪", label: "Estonia" },
  { code: "+370", flag: "🇱🇹", label: "Lithuania" },
  { code: "+371", flag: "🇱🇻", label: "Latvia" },
  { code: "+354", flag: "🇮🇸", label: "Iceland" },
  { code: "+382", flag: "🇲🇪", label: "Montenegro" },
  { code: "+355", flag: "🇦🇱", label: "Albania" },
  { code: "+389", flag: "🇲🇰", label: "North Macedonia" },
  { code: "+387", flag: "🇧🇦", label: "Bosnia" },
  { code: "+375", flag: "🇧🇾", label: "Belarus" },
  { code: "+65", flag: "🇸🇬", label: "Singapore" },
  { code: "+60", flag: "🇲🇾", label: "Malaysia" },
  { code: "+66", flag: "🇹🇭", label: "Thailand" },
  { code: "+62", flag: "🇮🇩", label: "Indonesia" },
  { code: "+84", flag: "🇻🇳", label: "Vietnam" },
  { code: "+63", flag: "🇵🇭", label: "Philippines" },
  { code: "+54", flag: "🇦🇷", label: "Argentina" },
  { code: "+56", flag: "🇨🇱", label: "Chile" },
  { code: "+57", flag: "🇨🇴", label: "Colombia" },
  { code: "+51", flag: "🇵🇪", label: "Peru" },
  { code: "+92", flag: "🇵🇰", label: "Pakistan" },
  { code: "+98", flag: "🇮🇷", label: "Iran" },
  { code: "+964", flag: "🇮🇶", label: "Iraq" },
  { code: "+216", flag: "🇹🇳", label: "Tunisia" },
  { code: "+213", flag: "🇩🇿", label: "Algeria" },
  { code: "+218", flag: "🇱🇾", label: "Libya" }
].sort((a, b) => {
  const priority = ["+90", "+49", "+7", "+44", "+1", "+33", "+31", "+971"];
  const aIndex = priority.indexOf(a.code);
  const bIndex = priority.indexOf(b.code);
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;
  return a.label.localeCompare(b.label);
});

export default function BookingForm() {
  const [phone, setPhone] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  const tStrings = {
    title1: lang === 'en' ? "Contact &" : "İletişim &",
    title2: lang === 'en' ? "Booking" : "Rezervasyon",
    subtitle: lang === 'en' ? "Reach Us 24/7" : "Bize 7/24 Ulaşabilirsiniz",
    formTitle: lang === 'en' ? "Quick Quote Form" : "Hızlı Teklif Formu",
    name: lang === 'en' ? "Full Name *" : "Ad Soyad *",
    phonePlaceholder: lang === 'en' ? "Phone Number *" : "Telefon Numarası *",
    email: lang === 'en' ? "Email Address *" : "E-posta Adresi *",
    from: lang === 'en' ? "From?" : "Nereden?",
    to: lang === 'en' ? "To?" : "Nereye?",
    details: lang === 'en' ? "Transfer Details (Flight No, Pax, etc...) *" : "Transfer Detayları (Uçuş No, Kişi Sayısı vb...) *",
    submitBtn: lang === 'en' ? "CONTACT US" : "İLETİŞİME GEÇ",
    searchCountry: lang === 'en' ? "Search country or code..." : "Ülke veya kod ara...",
    opsCenter: lang === 'en' ? "Operations Center" : "Operasyon Merkezi",
    supportLine: lang === 'en' ? "24/7 VIP Support Line" : "7/24 VIP Destek Hattı",
    corpContact: lang === 'en' ? "Corporate Contact" : "Kurumsal İletişim",
    waHeader: lang === 'en' ? "*HELLO, I WOULD LIKE A TRANSFER.*" : "*MERHABA, TRANSFER İSTİYORUM.*",
    waName: lang === 'en' ? "Name:" : "İsim:",
    waPhone: lang === 'en' ? "Phone:" : "Telefon:",
    waFrom: lang === 'en' ? "From:" : "Nereden:",
    waTo: lang === 'en' ? "To:" : "Nereye:",
    waDetails: lang === 'en' ? "Details:" : "Detaylar:"
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countryCodes.filter(c => 
    c.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      fullname: formData.get("fullname"),
      from: formData.get("from") || (lang === 'en' ? "Not Specified" : "Belirtilmedi"),
      to: formData.get("to") || (lang === 'en' ? "Not Specified" : "Belirtilmedi"),
      details: formData.get("details"),
    };

    const message = `${tStrings.waHeader}%0A` +
      `--------------------------%0A` +
      `👤 *${tStrings.waName}* ${data.fullname}%0A` +
      `📞 *${tStrings.waPhone}* ${selectedCountry.code} ${phone}%0A` +
      `📍 *${tStrings.waFrom}* ${data.from}%0A` +
      `🏁 *${tStrings.waTo}* ${data.to}%0A` +
      `📝 *${tStrings.waDetails}* ${data.details}`;

    const whatsappUrl = `https://wa.me/905322855572?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="booking" className="py-20 md:py-32 px-4 bg-cream-dark relative scroll-mt-20 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-luxury-dark"
          >
            {tStrings.title1} <span className="text-gold">{tStrings.title2}</span>
          </motion.h3>
          <div className="h-1.5 w-20 bg-gold mx-auto mt-4 rounded-full"></div>
          <p className="text-luxury-gray text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mt-6 opacity-70">{tStrings.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-cream p-8 md:p-10 rounded-[2.5rem] border border-cream-dark shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gold"></div>

            <h4 className="text-luxury-dark font-black mb-8 uppercase tracking-widest text-[11px] flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-cream-dark shadow-sm">
                <Send size={14} className="text-gold" />
              </span> 
              {tStrings.formTitle}
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required name="fullname" type="text" placeholder={tStrings.name} className="w-full bg-white border border-cream-dark p-4 h-[56px] rounded-xl text-xs font-bold outline-none text-luxury-dark focus:border-gold transition-all uppercase tracking-wider" />
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-[130px]" ref={dropdownRef}>
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-[56px] bg-white border border-cream-dark rounded-xl flex items-center justify-between px-4 cursor-pointer hover:border-gold transition-all"
                  >
                    <span className="text-[13px] font-bold text-luxury-dark">{selectedCountry.flag} {selectedCountry.code}</span>
                    <ChevronDown size={14} className={`text-gold transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-[62px] left-0 w-[260px] bg-white border border-cream-dark rounded-xl shadow-2xl z-[100] overflow-hidden"
                      >
                        <div className="p-3 border-b border-cream-dark flex items-center gap-2 bg-cream/30">
                          <Search size={14} className="text-luxury-gray/50" />
                          <input 
                            autoFocus
                            type="text" 
                            placeholder={tStrings.searchCountry}
                            className="bg-transparent border-none outline-none text-[11px] font-bold w-full uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                          {filteredCountries.map((c, idx) => (
                            <div 
                              key={idx}
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsDropdownOpen(false);
                                setSearchTerm("");
                              }}
                              className="px-4 py-3 hover:bg-cream cursor-pointer flex items-center justify-between border-b border-cream-dark/30 last:border-0 group/item"
                            >
                              <span className="text-[11px] font-bold text-luxury-dark group-hover/item:text-gold transition-colors">{c.flag} {c.label}</span>
                              <span className="text-[10px] text-luxury-gray/50 font-black">{c.code}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input 
                  required 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder={tStrings.phonePlaceholder}
                  className="flex-1 bg-white border border-cream-dark p-4 h-[56px] rounded-xl text-xs font-bold outline-none text-luxury-dark focus:border-gold transition-all" 
                />
              </div>

              <input required name="email" type="email" placeholder={tStrings.email} className="w-full bg-white border border-cream-dark p-4 h-[56px] rounded-xl text-xs font-bold outline-none text-luxury-dark focus:border-gold transition-all placeholder:text-luxury-gray/50" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="from" type="text" placeholder={tStrings.from} className="w-full bg-white border border-cream-dark p-4 h-[56px] rounded-xl text-xs font-bold outline-none text-luxury-dark focus:border-gold transition-all" />
                <input name="to" type="text" placeholder={tStrings.to} className="w-full bg-white border border-cream-dark p-4 h-[56px] rounded-xl text-xs font-bold outline-none text-luxury-dark focus:border-gold transition-all" />
              </div>
              
              <textarea required name="details" placeholder={tStrings.details} rows={4} className="w-full bg-white border border-cream-dark p-4 rounded-xl text-xs font-bold outline-none text-luxury-dark focus:border-gold transition-all resize-none" />
              
              <button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-5 rounded-xl transition-all uppercase text-[12px] tracking-[0.2em] shadow-xl mt-4 flex items-center justify-center gap-2 active:scale-[0.98] relative overflow-hidden group/btn">
                <span className="relative z-10 flex items-center gap-2"> {tStrings.submitBtn} <ArrowRight className="w-4 h-4" /></span>
                <motion.div initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.6, ease: "easeInOut" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/40 to-transparent skew-x-[-25deg] z-5" />
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8 h-full"
          >
            <div className="bg-cream p-8 md:p-10 rounded-[2.5rem] border border-cream-dark shadow-sm h-full flex flex-col justify-center">
              <h4 className="text-luxury-dark font-black mb-8 uppercase tracking-widest text-[11px] border-l-4 border-gold pl-4">{tStrings.opsCenter}</h4>
              <div className="space-y-6">
                <a href="tel:+905322855572" className="group flex items-center gap-5 p-3 -ml-3 rounded-2xl hover:bg-white/30 transition-colors">
                  <div className="w-14 h-14 bg-white border border-cream-dark rounded-xl flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300 shadow-sm text-gold group-hover:text-white">
                    <Phone size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-luxury-dark text-lg font-black tracking-tight">+90 532 285 5572</span>
                    <span className="text-gold text-[10px] font-bold tracking-widest uppercase">{tStrings.supportLine}</span>
                  </div>
                </a>
                <a href="mailto:info@xremtransfer.com" className="group flex items-center gap-5 p-3 -ml-3 rounded-2xl hover:bg-white/30 transition-colors">
                  <div className="w-14 h-14 bg-white border border-cream-dark rounded-xl flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300 shadow-sm text-gold group-hover:text-white">
                    <Mail size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-luxury-dark text-md font-black tracking-tight">info@xremtransfer.com</span>
                    <span className="text-luxury-gray/60 text-[10px] font-bold tracking-widest uppercase">{tStrings.corpContact}</span>
                  </div>
                </a>
                <div className="group flex items-center gap-5 p-3 -ml-3 rounded-2xl">
                  <div className="w-14 h-14 bg-white border border-cream-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm text-gold">
                    <MapPin size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-luxury-dark text-[12px] font-black uppercase tracking-wider mb-0.5">Antalya, {lang === 'en' ? 'Turkey' : 'Türkiye'}</span>
                    <span className="text-luxury-gray text-[11px] leading-relaxed font-bold opacity-70">Güzeloba Mah. 2262 Sok No 25/102</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[250px] w-full rounded-[2.5rem] overflow-hidden border-4 border-cream shadow-xl relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.748234857218!2d30.7656645!3d36.8484501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c38ff23467c641%3A0x6b60706697a29e46!2zR8O8emVsb2JhLCAyMjYyLiBTay4gTm86MjUsIDA3MjMwIE11cmF0cGHFn2EvQW50YWx5YQ!5e0!3m2!1str!2str!4v1709565000000!5m2!1str!2str" 
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000 opacity-90 group-hover:opacity-100" 
                allowFullScreen 
                loading="lazy" 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}