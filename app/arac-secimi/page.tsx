"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState, useRef } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VehicleList from "@/components/VehicleList";
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Flag, Users, ArrowRightLeft, Star, X, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const STATIC_AIRPORTS = [{ name: "Antalya Havalimanı (AYT)", type: "airport" }, { name: "Gazipaşa-Alanya Havalimanı (GZP)", type: "airport" }];

function SelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const formRef = useRef<HTMLDivElement>(null);
  const vehicleListRef = useRef<any>(null);
  const { lang } = useLanguage();

  const [summary, setSummary] = useState<any>(null);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [gidis, setGidis] = useState({ pickup: "", dropoff: "", date: null as Date | null, time: "12:00" });
  const [donus, setDonus] = useState({ pickup: "", dropoff: "", date: null as Date | null, time: "18:00" });

  const localeDateString = lang === 'en' ? 'en-US' : 'tr-TR';
  
  const tStrings = {
    alertSame: lang === 'en' ? "Locations cannot be the same!" : "Noktalar aynı olamaz!",
    vipCenter: lang === 'en' ? "VIP OPERATION CENTER" : "VIP OPERASYON MERKEZİ",
    update1: lang === 'en' ? "UPDATE" : "ROTAYI",
    update2: lang === 'en' ? "ROUTE" : "GÜNCELLE",
    roundTripPkg: lang === 'en' ? "ROUND TRIP PACKAGE" : "GİDİŞ - DÖNÜŞ PAKETİ",
    oneWayPkg: lang === 'en' ? "ONE WAY TRANSFER" : "TEK YÖN TRANSFER",
    depPickup: lang === 'en' ? "DEPARTURE PICKUP" : "GİDİŞ KALKIŞ",
    depDropoff: lang === 'en' ? "DEPARTURE DROPOFF" : "GİDİŞ VARIŞ",
    retPickup: lang === 'en' ? "RETURN PICKUP" : "DÖNÜŞ KALKIŞ",
    retDropoff: lang === 'en' ? "RETURN DROPOFF" : "DÖNÜŞ VARIŞ",
    date: lang === 'en' ? "DATE" : "TARİH",
    retDate: lang === 'en' ? "R.DATE" : "D.TARİH",
  };

  useEffect(() => {
    const saved = localStorage.getItem("transferSummary");
    const parsed = saved ? JSON.parse(saved) : {};
    
    const p = searchParams.get("dep") || parsed.pickup || "";
    const d = searchParams.get("arr") || parsed.dropoff || "";
    const rt = searchParams.get("roundTrip") === "true" || parsed.isRoundTrip === true;

    const parseLocalDate = (dateStr: string) => {
      if (!dateStr) return null;
      const [y, m, day] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, day);
    };

    const gDate = parseLocalDate(parsed.date);
    const gTime = parsed.time || "12:00";
    setGidis({ pickup: p, dropoff: d, date: gDate, time: gTime });

    if (rt) {
      const dDate = parseLocalDate(parsed.returnDate);
      const dTime = parsed.returnTime || "18:00";
      setDonus({ pickup: parsed.returnPickup || d, dropoff: parsed.returnDropoff || p, date: dDate, time: dTime });
    }
    
    setIsRoundTrip(rt);
    setSummary(parsed);

    const fetchAll = async () => {
      const { data } = await supabase.from("regions").select("name").order("name");
      setAllLocations([...STATIC_AIRPORTS, ...(data ? data.map(r => ({ name: r.name, type: 'region' })) : [])]);
    };
    fetchAll();
  }, [searchParams]);

  const updateGlobalState = (newGidis: any, newDonus: any) => {
    const formatLocal = (d: Date | null) => {
      if (!d) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    let finalDonusDate = newDonus.date;
    let finalDonusTime = newDonus.time;

    if (isRoundTrip && newGidis.date && newDonus.date) {
      const [gH, gM] = newGidis.time.split(':').map(Number);
      const gFull = new Date(newGidis.date); gFull.setHours(gH, gM, 0, 0);
      const [rH, rM] = newDonus.time.split(':').map(Number);
      const rFull = new Date(newDonus.date); rFull.setHours(rH, rM, 0, 0);
      const gap = 6 * 60 * 60 * 1000;
      if (rFull.getTime() - gFull.getTime() < gap) {
        const adjusted = new Date(gFull.getTime() + gap);
        finalDonusDate = new Date(adjusted); finalDonusDate.setHours(0,0,0,0);
        finalDonusTime = `${adjusted.getHours().toString().padStart(2, '0')}:${adjusted.getMinutes().toString().padStart(2, '0')}`;
      }
    }

    const updatedSummary = { 
      ...summary, 
      pickup: newGidis.pickup, dropoff: newGidis.dropoff, date: formatLocal(newGidis.date), time: newGidis.time,
      isRoundTrip,
      returnPickup: isRoundTrip ? newDonus.pickup : null, returnDropoff: isRoundTrip ? newDonus.dropoff : null,
      returnDate: isRoundTrip ? formatLocal(finalDonusDate) : null, returnTime: isRoundTrip ? finalDonusTime : null
    };
    
    setGidis(newGidis);
    if (isRoundTrip) setDonus({ ...newDonus, date: finalDonusDate, time: finalDonusTime });
    localStorage.setItem("transferSummary", JSON.stringify(updatedSummary));
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("dep", newGidis.pickup);
    params.set("arr", newGidis.dropoff);
    params.set("roundTrip", isRoundTrip.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    if (vehicleListRef.current) vehicleListRef.current.refreshPrices(newGidis.dropoff, newGidis.pickup);
  };

  const handleLocSelect = (type: "p" | "d" | "rp" | "rd", name: string) => {
    let ng = { ...gidis }, nd = { ...donus };
    if (type === "p") ng.pickup = name;
    if (type === "d") ng.dropoff = name;
    if (type === "rp") nd.pickup = name;
    if (type === "rd") nd.dropoff = name;
    if (ng.pickup === ng.dropoff || (isRoundTrip && nd.pickup === nd.dropoff)) { alert(tStrings.alertSame); return; }
    updateGlobalState(ng, nd);
    setActiveDropdown(null);
  };

  const handleClear = (type: "p" | "d" | "rp" | "rd", e: React.MouseEvent) => {
    e.stopPropagation();
    let ng = { ...gidis }, nd = { ...donus };
    if (type === "p") ng.pickup = ""; if (type === "d") ng.dropoff = "";
    if (type === "rp") nd.pickup = ""; if (type === "rd") nd.dropoff = "";
    updateGlobalState(ng, nd);
  };

  const renderCalendar = (target: "g" | "d") => {
    const year = currentMonth.getFullYear(), month = currentMonth.getMonth();
    const days = new Date(year, month + 1, 0).getDate(), first = (new Date(year, month, 1).getDay() + 6) % 7;
    const items = []; const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < first; i++) items.push(<div key={`e-${i}`} />);
    for (let i = 1; i <= days; i++) {
      const d = new Date(year, month, i);
      let disabled = d < today;
      if (target === "d" && gidis.date && d < gidis.date) disabled = true;
      const sel = target === "g" ? gidis.date?.getTime() === d.getTime() : donus.date?.getTime() === d.getTime();
      items.push(<button key={i} disabled={disabled} onClick={() => { 
        const ng = {...gidis}, nd = {...donus};
        if(target === "g") ng.date = d; else nd.date = d;
        updateGlobalState(ng, nd); setActiveDropdown(null);
      }} className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${sel ? 'bg-gold text-white' : disabled ? 'text-gray-200' : 'hover:bg-gold/10 text-luxury-dark'}`}>{i}</button>);
    }
    
    const daysArr = lang === 'en' ? ['Mo','Tu','We','Th','Fr','Sa','Su'] : ['Pt','Sa','Ça','Pe','Cu','Ct','Pz'];
    
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 mt-2 bg-white border p-4 rounded-2xl shadow-2xl z-[100] w-64">
        <div className="flex justify-between items-center mb-4 text-[11px] font-black uppercase">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))}><ChevronLeft size={14}/></button>
          {new Intl.DateTimeFormat(localeDateString, { month: 'long', year: 'numeric' }).format(currentMonth)}
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))}><ChevronRight size={14}/></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">{daysArr.map(x => <div key={x} className="text-[8px] text-gray-400 font-bold">{x}</div>)}{items}</div>
      </motion.div>
    );
  };

  const renderTime = (target: "g" | "d") => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full right-0 mt-2 bg-white border p-3 rounded-2xl shadow-2xl z-[100] w-40 flex gap-2">
      <div className="flex-1 max-h-40 overflow-y-auto custom-scrollbar flex flex-col">
        {Array.from({length:24}, (_,i)=>i.toString().padStart(2,'0')).map(h => (
          <button key={h} onClick={() => {
            const ng = {...gidis}, nd = {...donus};
            if(target==="g") ng.time = `${h}:${ng.time.split(':')[1]}`; else nd.time = `${h}:${nd.time.split(':')[1]}`;
            updateGlobalState(ng, nd);
          }} className={`py-1 text-[10px] font-bold rounded ${ (target==="g"?gidis.time:donus.time).startsWith(h) ? 'bg-gold text-white' : 'hover:bg-gold/10'}`}>{h}</button>
        ))}
      </div>
      <div className="flex-1 max-h-40 overflow-y-auto custom-scrollbar flex flex-col">
        {["00","15","30","45"].map(m => (
          <button key={m} onClick={() => {
            const ng = {...gidis}, nd = {...donus};
            if(target==="g") ng.time = `${ng.time.split(':')[0]}:${m}`; else nd.time = `${nd.time.split(':')[0]}:${m}`;
            updateGlobalState(ng, nd); setActiveDropdown(null);
          }} className={`py-1 text-[10px] font-bold rounded ${ (target==="g"?gidis.time:donus.time).endsWith(m) ? 'bg-gold text-white' : 'hover:bg-gold/10'}`}>{m}</button>
        ))}
      </div>
    </motion.div>
  );

  if (!summary) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
      <motion.div ref={formRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[3rem] border border-white shadow-2xl relative z-[100]">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8 border-b pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1"><Star size={12} className="text-gold fill-gold" /><span className="text-[9px] font-black text-gold tracking-widest uppercase">{tStrings.vipCenter}</span></div>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-luxury-dark italic">{tStrings.update1} <span className="text-gold">{tStrings.update2}</span></h1>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-cream shadow-sm flex items-center gap-3">
            <Users size={16} className="text-gold" />
            <span className="text-[10px] font-black text-luxury-dark tracking-widest uppercase">{isRoundTrip ? tStrings.roundTripPkg : tStrings.oneWayPkg}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative bg-cream/50 p-2 rounded-[2rem] border border-white flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <button onClick={() => setActiveDropdown('gp')} className="w-full flex items-center gap-3 bg-white p-3 rounded-2xl border border-cream-dark text-left relative pr-10">
                  <MapPin size={18} className="text-gold" /><div className="overflow-hidden"><span className="block text-[8px] text-gray-400 font-black uppercase">{tStrings.depPickup}</span><span className="block text-[11px] font-black text-luxury-dark uppercase truncate">{gidis.pickup}</span></div>
                  {gidis.pickup && <X onClick={(e) => handleClear('p', e)} size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors" />}
                </button>
                <AnimatePresence>{activeDropdown === 'gp' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white border rounded-2xl z-[9999] shadow-2xl max-h-56 overflow-y-auto">
                    {allLocations.map((l, i) => <div key={i} onClick={() => handleLocSelect('p', l.name)} className="p-3 border-b text-[10px] font-bold uppercase hover:bg-gold/10 cursor-pointer">{l.name}</div>)}
                  </motion.div>
                )}</AnimatePresence>
              </div>
              <div className="flex-1 relative">
                <button onClick={() => setActiveDropdown('gd')} className="w-full flex items-center gap-3 bg-white p-3 rounded-2xl border border-cream-dark text-left relative pr-10">
                  <Flag size={18} className="text-gold" /><div className="overflow-hidden"><span className="block text-[8px] text-gray-400 font-black uppercase">{tStrings.depDropoff}</span><span className="block text-[11px] font-black text-luxury-dark uppercase truncate">{gidis.dropoff}</span></div>
                  {gidis.dropoff && <X onClick={(e) => handleClear('d', e)} size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors" />}
                </button>
                <AnimatePresence>{activeDropdown === 'gd' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white border rounded-2xl z-[9999] shadow-2xl max-h-56 overflow-y-auto">
                    {allLocations.map((l, i) => <div key={i} onClick={() => handleLocSelect('d', l.name)} className="p-3 border-b text-[10px] font-bold uppercase hover:bg-gold/10 cursor-pointer">{l.name}</div>)}
                  </motion.div>
                )}</AnimatePresence>
              </div>
            </div>
            <div className="lg:w-72 bg-gold/5 p-2 rounded-[2rem] border border-gold/10 flex gap-2">
              <div className="flex-1 relative">
                <button onClick={() => setActiveDropdown('gt')} className="w-full h-full flex flex-col justify-center items-center bg-white rounded-2xl border border-cream-dark p-2">
                  <Calendar size={14} className="text-gold mb-1" /><span className="text-[10px] font-black text-luxury-dark">{gidis.date?.toLocaleDateString(localeDateString) || tStrings.date}</span>
                </button>
                <AnimatePresence>{activeDropdown === 'gt' && renderCalendar('g')}</AnimatePresence>
              </div>
              <div className="flex-1 relative">
                <button onClick={() => setActiveDropdown('gs')} className="w-full h-full flex flex-col justify-center items-center bg-white rounded-2xl border border-cream-dark p-2">
                  <Clock size={14} className="text-gold mb-1" /><span className="text-[10px] font-black text-luxury-dark">{gidis.time}</span>
                </button>
                <AnimatePresence>{activeDropdown === 'gs' && renderTime('g')}</AnimatePresence>
              </div>
            </div>
          </div>

          {isRoundTrip && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-col lg:flex-row gap-3 pt-3 border-t border-dashed border-gold/20">
              <div className="flex-1 relative bg-gold/5 p-2 rounded-[2rem] border border-gold/10 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <button onClick={() => setActiveDropdown('dp')} className="w-full flex items-center gap-3 bg-white p-3 rounded-2xl border border-cream-dark text-left relative pr-10">
                    <MapPin size={18} className="text-gold" /><div className="overflow-hidden"><span className="block text-[8px] text-gray-400 font-black uppercase">{tStrings.retPickup}</span><span className="block text-[11px] font-black text-luxury-dark uppercase truncate">{donus.pickup}</span></div>
                    {donus.pickup && <X onClick={(e) => handleClear('rp', e)} size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors" />}
                  </button>
                  <AnimatePresence>{activeDropdown === 'dp' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white border rounded-2xl z-[9999] shadow-2xl max-h-56 overflow-y-auto">
                      {allLocations.map((l, i) => <div key={i} onClick={() => handleLocSelect('rp', l.name)} className="p-3 border-b text-[10px] font-bold uppercase hover:bg-gold/10 cursor-pointer">{l.name}</div>)}
                    </motion.div>
                  )}</AnimatePresence>
                </div>
                <div className="flex-1 relative">
                  <button onClick={() => setActiveDropdown('dd')} className="w-full flex items-center gap-3 bg-white p-3 rounded-2xl border border-cream-dark text-left relative pr-10">
                    <Flag size={18} className="text-gold" /><div className="overflow-hidden"><span className="block text-[8px] text-gray-400 font-black uppercase">{tStrings.retDropoff}</span><span className="block text-[11px] font-black text-luxury-dark uppercase truncate">{donus.dropoff}</span></div>
                    {donus.dropoff && <X onClick={(e) => handleClear('rd', e)} size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors" />}
                  </button>
                  <AnimatePresence>{activeDropdown === 'dd' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 w-full mt-2 bg-white border rounded-2xl z-[9999] shadow-2xl max-h-56 overflow-y-auto">
                      {allLocations.map((l, i) => <div key={i} onClick={() => handleLocSelect('rd', l.name)} className="p-3 border-b text-[10px] font-bold uppercase hover:bg-gold/10 cursor-pointer">{l.name}</div>)}
                    </motion.div>
                  )}</AnimatePresence>
                </div>
              </div>
              <div className="lg:w-72 bg-gold/5 p-2 rounded-[2rem] border border-gold/10 flex gap-2">
                <div className="flex-1 relative">
                  <button onClick={() => setActiveDropdown('dt')} className="w-full h-full flex flex-col justify-center items-center bg-white rounded-2xl border border-cream-dark p-2">
                    <Calendar size={14} className="text-gold mb-1" /><span className="text-[10px] font-black text-luxury-dark">{donus.date?.toLocaleDateString(localeDateString) || tStrings.retDate}</span>
                  </button>
                  <AnimatePresence>{activeDropdown === 'dt' && renderCalendar('d')}</AnimatePresence>
                </div>
                <div className="flex-1 relative">
                  <button onClick={() => setActiveDropdown('ds')} className="w-full h-full flex flex-col justify-center items-center bg-white rounded-2xl border border-cream-dark p-2">
                    <Clock size={14} className="text-gold mb-1" /><span className="text-[10px] font-black text-luxury-dark">{donus.time}</span>
                  </button>
                  <AnimatePresence>{activeDropdown === 'ds' && renderTime('d')}</AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      <VehicleList ref={vehicleListRef} />
    </div>
  );
}

export default function VehicleSelectionPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />
      <div className="fixed inset-0 z-0">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/80 to-cream/95 backdrop-blur-[1px]" />
      </div>
      <Suspense fallback={<div className="h-screen flex items-center justify-center bg-cream"><div className="w-10 h-10 border-4 border-t-gold animate-spin rounded-full shadow-xl"></div></div>}>
        <div className="pt-24 flex-1"><SelectionContent /></div>
      </Suspense>
      <Footer />
    </main>
  );
}