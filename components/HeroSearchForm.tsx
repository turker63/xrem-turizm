"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin, Flag, Calendar as CalendarIcon, Clock, Users, ArrowRightLeft, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

const STATIC_AIRPORTS = [
  { name: "Antalya Havalimanı (AYT)", type: "airport" },
  { name: "Gazipaşa-Alanya Havalimanı (GZP)", type: "airport" }
];

export default function HeroSearchForm({ defaultDropoff = "" }: { defaultDropoff?: string }) {
  const { t, lang } = useLanguage(); 
  const router = useRouter();

  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  
  const [pickupValue, setPickupValue] = useState("");
  const [dropoffValue, setDropoffValue] = useState(defaultDropoff);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [returnPickupValue, setReturnPickupValue] = useState("");
  const [returnDropoffValue, setReturnDropoffValue] = useState("");
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [returnTime, setReturnTime] = useState("");
  const [returnAdults, setReturnAdults] = useState(1);
  const [returnChildren, setReturnChildren] = useState(0);

  const formRef = useRef<HTMLDivElement>(null);
  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [filteredPickup, setFilteredPickup] = useState<any[]>([]);
  const [filteredDropoff, setFilteredDropoff] = useState<any[]>([]);
  const [filteredReturnPickup, setFilteredReturnPickup] = useState<any[]>([]);
  const [filteredReturnDropoff, setFilteredReturnDropoff] = useState<any[]>([]);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const localeDateString = lang === 'tr' ? 'tr-TR' : 'en-US';

  useEffect(() => {
    const fetchAllData = async () => {
      const { data } = await supabase.from("regions").select("name").order("name");
      const dbRegions = data ? data.map(r => ({ name: r.name, type: 'region' })) : [];
      setAllLocations([...STATIC_AIRPORTS, ...dbRegions]);
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    if (isRoundTrip) {
      if (!returnPickupValue && dropoffValue) setReturnPickupValue(dropoffValue);
      if (!returnDropoffValue && pickupValue) setReturnDropoffValue(pickupValue);
    }
  }, [isRoundTrip, dropoffValue, pickupValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatLocal = (d: Date | null) => {
    if (!d) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isAirport = (locName: string) => STATIC_AIRPORTS.some(airport => airport.name === locName);

  const handleSearchClick = () => {
    if (!pickupValue || !dropoffValue || !selectedDate || !selectedTime) {
      alert(lang === 'tr' ? "Lütfen gidiş için tüm alanları doldurunuz!" : "Please fill in all departure fields!");
      return;
    }
    
    if (pickupValue === dropoffValue) {
      alert(lang === 'tr' ? "Kalkış ve varış noktaları aynı olamaz!" : "Locations cannot be the same!");
      return;
    }

    if (!isAirport(pickupValue) && !isAirport(dropoffValue)) {
      alert(lang === 'tr' ? "İki bölge arası transfer yapılamaz. En az bir nokta Havalimanı olmalıdır." : "Please select an Airport for one of the points.");
      return;
    }

    if (isRoundTrip) {
      if (!returnPickupValue || !returnDropoffValue || !returnDate || !returnTime) {
        alert(lang === 'tr' ? "Lütfen dönüş detaylarını doldurunuz!" : "Please fill in return details!");
        return;
      }

      const [gH, gM] = selectedTime.split(':').map(Number);
      const gFull = new Date(selectedDate); gFull.setHours(gH, gM, 0, 0);
      const [rH, rM] = returnTime.split(':').map(Number);
      const rFull = new Date(returnDate); rFull.setHours(rH, rM, 0, 0);
      const gap = 6 * 60 * 60 * 1000;

      if (rFull.getTime() - gFull.getTime() < gap) {
        alert(lang === 'tr' ? "Dönüş saati gidişten en az 6 saat sonra olmalıdır!" : "Return must be at least 6 hours after departure!");
        return;
      }
    }

    const summaryData = {
      pickup: pickupValue, dropoff: dropoffValue, date: formatLocal(selectedDate), time: selectedTime,
      adults, children, isRoundTrip,
      returnPickup: isRoundTrip ? returnPickupValue : null,
      returnDropoff: isRoundTrip ? returnDropoffValue : null,
      returnDate: isRoundTrip ? formatLocal(returnDate) : null,
      returnTime: isRoundTrip ? returnTime : null,
      returnAdults: isRoundTrip ? returnAdults : null,
      returnChildren: isRoundTrip ? returnChildren : null
    };
    localStorage.setItem("transferSummary", JSON.stringify(summaryData));

    const query = new URLSearchParams({
      dep: pickupValue, arr: dropoffValue, adult: adults.toString(), child: children.toString(), roundTrip: isRoundTrip.toString()
    }).toString();
    
    router.push(`/arac-secimi?${query}`);
  };

  const handleInputSearch = (query: string, type: "pickup" | "dropoff" | "returnPickup" | "returnDropoff") => {
    if (type === "pickup") setPickupValue(query);
    if (type === "dropoff") setDropoffValue(query);
    if (type === "returnPickup") setReturnPickupValue(query);
    if (type === "returnDropoff") setReturnDropoffValue(query);

    const filtered = allLocations.filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()));
    if (type === "pickup") setFilteredPickup(filtered);
    if (type === "dropoff") setFilteredDropoff(filtered);
    if (type === "returnPickup") setFilteredReturnPickup(filtered);
    if (type === "returnDropoff") setFilteredReturnDropoff(filtered);
    setHighlightedIndex(-1);
  };

  const handleClear = (type: "pickup" | "dropoff" | "returnPickup" | "returnDropoff") => {
    if (type === "pickup") { setPickupValue(""); setFilteredPickup(allLocations); document.getElementById("hero-pickup-input")?.focus(); }
    if (type === "dropoff") { setDropoffValue(""); setFilteredDropoff(allLocations); document.getElementById("hero-dropoff-input")?.focus(); }
    if (type === "returnPickup") { setReturnPickupValue(""); setFilteredReturnPickup(allLocations); document.getElementById("hero-return-pickup-input")?.focus(); }
    if (type === "returnDropoff") { setReturnDropoffValue(""); setFilteredReturnDropoff(allLocations); document.getElementById("hero-return-dropoff-input")?.focus(); }
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: string, currentList: any[]) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < currentList.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < currentList.length) {
        const name = currentList[highlightedIndex].name;
        if (type === "pickup") setPickupValue(name);
        if (type === "dropoff") setDropoffValue(name);
        if (type === "returnPickup") setReturnPickupValue(name);
        if (type === "returnDropoff") setReturnDropoffValue(name);
        setActiveDropdown(null);
      }
    } else if (e.key === "Escape") setActiveDropdown(null);
  };

  const renderCalendar = (type: 'date' | 'returnDate') => {
    const year = currentMonth.getFullYear(), month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate(), firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const today = new Date(); today.setHours(0,0,0,0);
    const items = [];
    for (let i = 0; i < firstDay; i++) items.push(<div key={`e-${i}`} className="w-7 h-7"></div>);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      let disabled = date < today;
      if (type === 'returnDate' && selectedDate && date < selectedDate) disabled = true;
      const sel = type === 'date' ? selectedDate?.getTime() === date.getTime() : returnDate?.getTime() === date.getTime();
      items.push(<button key={i} disabled={disabled} onClick={(e) => { e.preventDefault(); if (type === 'date') { setSelectedDate(date); if (returnDate && returnDate < date) setReturnDate(null); } else setReturnDate(date); setActiveDropdown(null); }} className={`w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-[#D4AF37]/20 text-[#2C2C2C]'} ${sel ? 'bg-[#D4AF37] text-white shadow-md' : ''}`}>{i}</button>);
    }
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-4 z-[9999] w-60">
        <div className="flex justify-between items-center mb-3"><button onClick={(e) => { e.preventDefault(); setCurrentMonth(new Date(year, month - 1)); }} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={14} /></button><span className="text-[11px] font-black uppercase text-[#2C2C2C] tracking-wider">{lang === 'tr' ? monthsTr[month] : monthsEn[month]} {year}</span><button onClick={(e) => { e.preventDefault(); setCurrentMonth(new Date(year, month + 1)); }} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={14} /></button></div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2 border-b border-gray-100 pb-2">{(lang === 'tr' ? daysTr : daysEn).map(d => <div key={d} className="text-[9px] font-bold text-gray-400 uppercase">{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">{items}</div>
      </motion.div>
    );
  };

  const renderTimePicker = (type: 'time' | 'returnTime') => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-3 z-[9999] w-40 flex gap-2">
      <div className="flex-1 max-h-40 overflow-y-auto custom-scrollbar flex flex-col gap-1">
        {Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0')).map(h => (
          <button key={h} onClick={(e) => { e.preventDefault(); const current = type === 'time' ? selectedTime : returnTime; const newTime = `${h}:${current.split(':')[1] || '00'}`; if(type === 'time') setSelectedTime(newTime); else setReturnTime(newTime); }} className={`py-1.5 rounded-lg text-[10px] font-bold ${(type === 'time' ? selectedTime : returnTime).startsWith(h) ? 'bg-[#D4AF37] text-white' : 'hover:bg-gray-100 text-[#2C2C2C]'}`}>{h}</button>
        ))}
      </div>
      <div className="flex-1 max-h-40 overflow-y-auto custom-scrollbar flex flex-col gap-1">
        {["00", "15", "30", "45"].map(m => (
          <button key={m} onClick={(e) => { e.preventDefault(); const current = type === 'time' ? selectedTime : returnTime; const newTime = `${current.split(':')[0] || '12'}:${m}`; if(type === 'time') setSelectedTime(newTime); else setReturnTime(newTime); setActiveDropdown(null); }} className={`py-1.5 rounded-lg text-[10px] font-bold ${(type === 'time' ? selectedTime : returnTime).endsWith(m) ? 'bg-[#D4AF37] text-white' : 'hover:bg-gray-100 text-[#2C2C2C]'}`}>{m}</button>
        ))}
      </div>
    </motion.div>
  );

  const monthsTr = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysTr = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];
  const daysEn = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const currentPickupList = pickupValue.length > 0 ? filteredPickup : allLocations;
  const currentDropoffList = dropoffValue.length > 0 ? filteredDropoff : allLocations;
  const currentReturnPickupList = returnPickupValue.length > 0 ? filteredReturnPickup : allLocations;
  const currentReturnDropoffList = returnDropoffValue.length > 0 ? filteredReturnDropoff : allLocations;

  return (
    <div className="w-full max-w-[95%] md:max-w-5xl mx-auto relative z-[100] px-1 md:px-0" ref={formRef}>
      <div className="flex gap-1 mb-0 ml-4 relative z-20">
        <button onClick={() => setIsRoundTrip(false)} className={`px-6 py-2.5 rounded-t-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 backdrop-blur-xl ${!isRoundTrip ? 'bg-white/30 border-t border-l border-r border-white/40 text-white shadow-[0_-10px_20px_rgba(0,0,0,0.1)]' : 'bg-black/20 text-white/70 hover:bg-white/20'}`}>
          <ArrowRight size={12} className={!isRoundTrip ? 'text-[#D4AF37]' : 'text-white/50'} /> {t.oneWay}
        </button>
        <button onClick={() => setIsRoundTrip(true)} className={`px-6 py-2.5 rounded-t-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 backdrop-blur-xl ${isRoundTrip ? 'bg-white/30 border-t border-l border-r border-white/40 text-white shadow-[0_-10px_20px_rgba(0,0,0,0.1)]' : 'bg-black/20 text-white/70 hover:bg-white/20'}`}>
          <ArrowRightLeft size={12} className={isRoundTrip ? 'text-[#D4AF37]' : 'text-white/50'} /> {t.roundTrip}
        </button>
      </div>

      <div className="bg-white/20 backdrop-blur-2xl p-4 md:p-6 rounded-2xl rounded-tl-none border border-white/30 shadow-[0_30px_60px_rgba(0,0,0,0.2)] relative z-10">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end relative z-20">
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[9px] text-white drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><MapPin size={12} className="text-[#D4AF37]" /> {t.pickup} {t.departureSuffix}</label>
              <div className="w-full bg-white/60 backdrop-blur-md border border-white/50 p-2.5 rounded-xl h-[44px] flex items-center shadow-inner transition-all hover:bg-white/80 focus-within:bg-white/90">
                <input id="hero-pickup-input" value={pickupValue} onFocus={() => { setActiveDropdown('pickup'); setHighlightedIndex(-1); handleInputSearch(pickupValue, "pickup"); }} onChange={(e) => handleInputSearch(e.target.value, "pickup")} onKeyDown={(e) => handleKeyDown(e, "pickup", currentPickupList)} placeholder={t.placeholderPickup} autoComplete="off" className="bg-transparent w-full outline-none text-[11px] font-bold text-[#2C2C2C] placeholder-gray-500 pr-2" />
                {pickupValue && <button onClick={() => handleClear('pickup')} className="text-gray-500 hover:text-red-500 shrink-0"><X size={14} /></button>}
              </div>
              <AnimatePresence>{activeDropdown === 'pickup' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-xl z-[9999] shadow-2xl overflow-hidden">
                  <div className="max-h-56 overflow-y-auto custom-scrollbar">
                    {currentPickupList.map((item: any, idx: number) => (
                      <div key={idx} id={`hero-pickup-item-${idx}`} onClick={() => { setPickupValue(item.name); setActiveDropdown(null); }} onMouseEnter={() => setHighlightedIndex(idx)} className={`p-3 border-b border-gray-100 text-[10px] font-bold uppercase transition-colors flex items-center cursor-pointer ${highlightedIndex === idx ? 'bg-[#D4AF37]/10 text-[#2C2C2C]' : 'hover:bg-gray-50 text-[#2C2C2C]'}`}>
                        <span className="text-[#D4AF37] mr-2 text-sm">{item.type === "airport" ? '✈️' : '📍'}</span>{item.name}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[9px] text-white drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><Flag size={12} className="text-[#D4AF37]" /> {t.dropoff} {t.departureSuffix}</label>
              <div className="w-full bg-white/60 backdrop-blur-md border border-white/50 p-2.5 rounded-xl h-[44px] flex items-center shadow-inner transition-all hover:bg-white/80 focus-within:bg-white/90">
                <input id="hero-dropoff-input" value={dropoffValue} onFocus={() => { setActiveDropdown('dropoff'); setHighlightedIndex(-1); handleInputSearch(dropoffValue, "dropoff"); }} onChange={(e) => handleInputSearch(e.target.value, "dropoff")} onKeyDown={(e) => handleKeyDown(e, "dropoff", currentDropoffList)} placeholder={t.placeholderDropoff} autoComplete="off" className="bg-transparent w-full outline-none text-[11px] font-bold text-[#2C2C2C] placeholder-gray-500 pr-2" />
                {dropoffValue && <button onClick={() => handleClear('dropoff')} className="text-gray-500 hover:text-red-500 shrink-0"><X size={14} /></button>}
              </div>
              <AnimatePresence>{activeDropdown === 'dropoff' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-xl z-[9999] shadow-2xl overflow-hidden">
                  <div className="max-h-56 overflow-y-auto custom-scrollbar">
                    {currentDropoffList.map((item: any, idx: number) => (
                      <div key={idx} id={`hero-dropoff-item-${idx}`} onClick={() => { setDropoffValue(item.name); setActiveDropdown(null); }} onMouseEnter={() => setHighlightedIndex(idx)} className={`p-3 border-b border-gray-100 text-[10px] font-bold uppercase transition-colors flex items-center cursor-pointer ${highlightedIndex === idx ? 'bg-[#D4AF37]/10 text-[#2C2C2C]' : 'hover:bg-gray-50 text-[#2C2C2C]'}`}>
                        <span className="text-[#D4AF37] mr-2 text-sm">{item.type === "airport" ? '✈️' : '🏁'}</span>{item.name}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[9px] text-white drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><CalendarIcon size={12} className="text-[#D4AF37]" /> {t.date}</label>
                <div onClick={() => setActiveDropdown('date')} className={`w-full h-[44px] bg-white/60 backdrop-blur-md border border-white/50 p-2.5 rounded-xl flex items-center justify-between cursor-pointer shadow-inner transition-all hover:bg-white/80 ${activeDropdown === 'date' ? 'bg-white/90 border-white' : ''}`}>
                  <span className={`text-[11px] font-bold ${selectedDate ? 'text-[#2C2C2C]' : 'text-gray-500'}`}>{selectedDate ? selectedDate.toLocaleDateString(localeDateString) : t.select}</span>
                </div>
                <AnimatePresence>{activeDropdown === 'date' && renderCalendar('date')}</AnimatePresence>
              </div>
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[9px] text-white drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><Clock size={12} className="text-[#D4AF37]" /> {t.timeLabel || t.time}</label>
                <div onClick={() => setActiveDropdown('time')} className={`w-full h-[44px] bg-white/60 backdrop-blur-md border border-white/50 p-2.5 rounded-xl flex items-center justify-between cursor-pointer shadow-inner transition-all hover:bg-white/80 ${activeDropdown === 'time' ? 'bg-white/90 border-white' : ''}`}>
                  <span className={`text-[11px] font-bold ${selectedTime ? 'text-[#2C2C2C]' : 'text-gray-500'}`}>{selectedTime || "00:00"}</span>
                </div>
                <AnimatePresence>{activeDropdown === 'time' && renderTimePicker('time')}</AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[9px] text-white drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><Users size={12} className="text-[#D4AF37]" /> {t.passengers} {t.departureSuffix}</label>
              <div onClick={() => setActiveDropdown('pax')} className={`w-full bg-white/60 backdrop-blur-md border border-white/50 p-2.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all hover:bg-white/80 flex justify-between items-center h-[44px] shadow-inner ${activeDropdown === 'pax' ? 'bg-white/90 border-white' : ''}`}>
                <span className="text-[#2C2C2C]">{adults} {t.adult} {children > 0 ? `, ${children} ${t.child}` : ""}</span>
                <span className="text-[#D4AF37] opacity-80 text-[9px]">▼</span>
              </div>
              <AnimatePresence>{activeDropdown === 'pax' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-xl p-4 z-[9999] shadow-2xl space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#2C2C2C]">
                    <span>{t.adult}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => adults > 1 && setAdults(adults-1)} className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100">-</button>
                      <span className="w-4 text-center">{adults}</span>
                      <button onClick={() => setAdults(adults+1)} className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#2C2C2C]">
                    <span>{t.child}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => children > 0 && setChildren(children-1)} className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100">-</button>
                      <span className="w-4 text-center">{children}</span>
                      <button onClick={() => setChildren(children+1)} className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100">+</button>
                    </div>
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </div>
          </div>

          <AnimatePresence>{isRoundTrip && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end pt-4 border-t border-white/20 relative z-10">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[9px] text-[#D4AF37] drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><MapPin size={12} className="text-[#D4AF37]" /> {t.pickup} {t.returnSuffix}</label>
                <div className="w-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 p-2.5 rounded-xl h-[44px] flex items-center shadow-inner hover:bg-[#D4AF37]/20 transition-all focus-within:bg-[#D4AF37]/30">
                  <input id="hero-return-pickup-input" value={returnPickupValue} onFocus={() => { setActiveDropdown('returnPickup'); setHighlightedIndex(-1); handleInputSearch(returnPickupValue, "returnPickup"); }} onChange={(e) => handleInputSearch(e.target.value, "returnPickup")} onKeyDown={(e) => handleKeyDown(e, "returnPickup", currentReturnPickupList)} placeholder={t.returnPickupPlaceholder} autoComplete="off" className="bg-transparent w-full outline-none text-[11px] font-bold text-white placeholder-white/70 pr-2" />
                  {returnPickupValue && <button onClick={() => handleClear('returnPickup')} className="text-white/50 hover:text-red-400 shrink-0"><X size={14} /></button>}
                </div>
                <AnimatePresence>{activeDropdown === 'returnPickup' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-xl z-[9999] shadow-2xl overflow-hidden">
                    <div className="max-h-56 overflow-y-auto custom-scrollbar">
                      {currentReturnPickupList.map((item: any, idx: number) => {
                        const isAirport = item.type === "airport";
                        return (
                          <div key={idx} id={`hero-returnPickup-item-${idx}`} onClick={() => { setReturnPickupValue(item.name); setActiveDropdown(null); }} onMouseEnter={() => setHighlightedIndex(idx)} className={`p-3 border-b border-gray-100 text-[10px] font-bold uppercase transition-colors flex items-center cursor-pointer ${highlightedIndex === idx ? 'bg-[#D4AF37]/10 text-[#2C2C2C]' : 'hover:bg-gray-50 text-[#2C2C2C]'}`}>
                            <span className="text-[#D4AF37] mr-2 text-sm">{isAirport ? '📍' : '⭐'}</span>{item.name}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}</AnimatePresence>
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[9px] text-[#D4AF37] drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><Flag size={12} className="text-[#D4AF37]" /> {t.dropoff} {t.returnSuffix}</label>
                <div className="w-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 p-2.5 rounded-xl h-[44px] flex items-center shadow-inner hover:bg-[#D4AF37]/20 transition-all focus-within:bg-[#D4AF37]/30">
                  <input id="hero-return-dropoff-input" value={returnDropoffValue} onFocus={() => { setActiveDropdown('returnDropoff'); setHighlightedIndex(-1); handleInputSearch(returnDropoffValue, "returnDropoff"); }} onChange={(e) => handleInputSearch(e.target.value, "returnDropoff")} onKeyDown={(e) => handleKeyDown(e, "returnDropoff", currentReturnDropoffList)} placeholder={t.returnDropoffPlaceholder} autoComplete="off" className="bg-transparent w-full outline-none text-[11px] font-bold text-white placeholder-white/70 pr-2" />
                  {returnDropoffValue && <button onClick={() => handleClear('returnDropoff')} className="text-white/50 hover:text-red-400 shrink-0"><X size={14} /></button>}
                </div>
                <AnimatePresence>{activeDropdown === 'returnDropoff' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-xl z-[9999] shadow-2xl overflow-hidden">
                    <div className="max-h-56 overflow-y-auto custom-scrollbar">
                      {currentReturnDropoffList.map((item: any, idx: number) => {
                        const isAirport = item.type === "airport";
                        return (
                          <div key={idx} id={`hero-returnDropoff-item-${idx}`} onClick={() => { setReturnDropoffValue(item.name); setActiveDropdown(null); }} onMouseEnter={() => setHighlightedIndex(idx)} className={`p-3 border-b border-gray-100 text-[10px] font-bold uppercase transition-colors flex items-center cursor-pointer ${highlightedIndex === idx ? 'bg-[#D4AF37]/10 text-[#2C2C2C]' : 'hover:bg-gray-50 text-[#2C2C2C]'}`}>
                            <span className="text-[#D4AF37] mr-2 text-sm">{isAirport ? '🏁' : '⭐'}</span>{item.name}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}</AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[9px] text-[#D4AF37] drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><CalendarIcon size={12} className="text-[#D4AF37]" /> {t.returnDate}</label>
                  <div onClick={() => setActiveDropdown('returnDate')} className={`w-full h-[44px] bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 p-2.5 rounded-xl flex items-center justify-between cursor-pointer shadow-inner hover:bg-[#D4AF37]/20 transition-all ${activeDropdown === 'returnDate' ? 'bg-[#D4AF37]/30 border-[#D4AF37]/50' : ''}`}>
                    <span className={`text-[11px] font-bold ${returnDate ? 'text-white' : 'text-white/70'}`}>{returnDate ? returnDate.toLocaleDateString(localeDateString) : t.select}</span>
                  </div>
                  <AnimatePresence>{activeDropdown === 'returnDate' && renderCalendar('returnDate')}</AnimatePresence>
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[9px] text-[#D4AF37] drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><Clock size={12} className="text-[#D4AF37]" /> {t.timeLabel || t.time}</label>
                  <div onClick={() => setActiveDropdown('returnTime')} className={`w-full h-[44px] bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 p-2.5 rounded-xl flex items-center justify-between cursor-pointer shadow-inner hover:bg-[#D4AF37]/20 transition-all ${activeDropdown === 'returnTime' ? 'bg-[#D4AF37]/30 border-[#D4AF37]/50' : ''}`}>
                    <span className={`text-[11px] font-bold ${returnTime ? 'text-white' : 'text-white/70'}`}>{returnTime || "00:00"}</span>
                  </div>
                  <AnimatePresence>{activeDropdown === 'returnTime' && renderTimePicker('returnTime')}</AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[9px] text-[#D4AF37] drop-shadow-md font-black uppercase tracking-widest ml-1 flex items-center gap-1.5 italic"><Users size={12} className="text-[#D4AF37]" /> {t.passengers} {t.returnSuffix}</label>
                <div onClick={() => setActiveDropdown('returnPax')} className={`w-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 p-2.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all hover:bg-[#D4AF37]/20 flex justify-between items-center h-[44px] shadow-inner ${activeDropdown === 'returnPax' ? 'bg-[#D4AF37]/30 border-[#D4AF37]/50' : ''}`}>
                  <span className="text-white">{returnAdults} {t.adult} {returnChildren > 0 ? `, ${returnChildren} ${t.child}` : ""}</span>
                  <span className="text-[#D4AF37] opacity-80 text-[9px]">▼</span>
                </div>
                <AnimatePresence>{activeDropdown === 'returnPax' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-xl p-4 z-[9999] shadow-2xl space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#2C2C2C]">
                      <span>{t.adult}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => returnAdults > 1 && setAdults(returnAdults-1)} className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100">-</button>
                        <span className="w-4 text-center">{returnAdults}</span>
                        <button onClick={() => setReturnAdults(returnAdults+1)} className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100">+</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#2C2C2C]">
                      <span>{t.child}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => returnChildren > 0 && setReturnChildren(returnChildren-1)} className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100">-</button>
                        <span className="w-4 text-center">{returnChildren}</span>
                        <button onClick={() => setReturnChildren(returnChildren+1)} className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100">+</button>
                      </div>
                    </div>
                  </motion.div>
                )}</AnimatePresence>
              </div>
            </motion.div>
          )}</AnimatePresence>
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={handleSearchClick} className="w-full md:w-auto md:px-14 bg-[#D4AF37] hover:bg-[#BF953F] text-black font-black py-3 md:py-4 rounded-xl shadow-[0_15px_30px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all uppercase text-[11px] tracking-[0.2em] italic flex items-center justify-center gap-2">
            {t.searchBtn} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}