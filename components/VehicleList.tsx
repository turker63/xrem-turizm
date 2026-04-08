"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useRouter, useSearchParams, usePathname } from "next/navigation"; 
import { supabase } from "@/lib/supabase"; 
import { Users, Briefcase, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

const VehicleList = forwardRef((props: any, ref) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); 
  const sliderRef = useRef<HTMLDivElement>(null);

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [gidisPrices, setGidisPrices] = useState<any>(null);
  const [donusPrices, setDonusPrices] = useState<any>(null);
  const [minPrices, setMinPrices] = useState({ standard: 0, ultra: 0, minivan: 0, minibus: 0 });
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const isSelectionPage = pathname === "/arac-secimi";

  const fetchPrices = async (targetDropoff?: string, targetPickup?: string) => {
    setIsSyncing(true);
    let dropoff = targetDropoff;
    let pickup = targetPickup;
    let rDropoff = undefined;
    let rPickup = undefined;
    let isRound = false;

    if (dropoff === undefined && pickup === undefined) {
      if (searchParams.has("arr") || searchParams.has("dep")) {
        dropoff = searchParams.get("arr") || "";
        pickup = searchParams.get("dep") || "";
      }
      const saved = localStorage.getItem("transferSummary");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!dropoff && !pickup) {
          dropoff = parsed.dropoff || "";
          pickup = parsed.pickup || "";
        }
        rDropoff = parsed.returnDropoff || "";
        rPickup = parsed.returnPickup || "";
        isRound = parsed.isRoundTrip === true;
      }
    }

    const getRegionData = async (p: string, a: string) => {
      if (!p || !a) return null;
      let { data } = await supabase.from("regions").select("price, price_ultra_vip, price_minivan, price_minibus").eq("name", a).maybeSingle();
      if (!data) {
        let { data: pData } = await supabase.from("regions").select("price, price_ultra_vip, price_minivan, price_minibus").eq("name", p).maybeSingle();
        data = pData;
      }
      return data;
    };

    try {
      const gData = await getRegionData(pickup!, dropoff!);
      setGidisPrices(gData || null);
      if (isRound) {
        const dData = await getRegionData(rPickup!, rDropoff!);
        setDonusPrices(dData || null);
      } else {
        setDonusPrices(null);
      }
      setIsRoundTrip(isRound);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsSyncing(false), 400);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshPrices: (newDropoff: string, newPickup: string) => {
      fetchPrices(newDropoff, newPickup);
    }
  }));

  useEffect(() => {
    const fetchInitial = async () => {
      const { data: vData } = await supabase.from("cars").select("*").eq("status", "active").order("id", { ascending: true });
      if (vData) setVehicles(vData);

      const { data: allRegions } = await supabase.from("regions").select("price, price_ultra_vip, price_minivan, price_minibus");
      if (allRegions) {
        const valids = (arr: any[]) => arr.filter(n => n && n > 0);
        setMinPrices({
          standard: valids(allRegions.map(r => r.price)).length ? Math.min(...valids(allRegions.map(r => r.price))) : 0,
          ultra: valids(allRegions.map(r => r.price_ultra_vip)).length ? Math.min(...valids(allRegions.map(r => r.price_ultra_vip))) : 0,
          minivan: valids(allRegions.map(r => r.price_minivan)).length ? Math.min(...valids(allRegions.map(r => r.price_minivan))) : 0,
          minibus: valids(allRegions.map(r => r.price_minibus)).length ? Math.min(...valids(allRegions.map(r => r.price_minibus))) : 0
        });
      }
      if (isSelectionPage) await fetchPrices();
      setLoading(false);
    };
    fetchInitial();
  }, [searchParams, isSelectionPage]);

  useEffect(() => {
    let animationId: number;
    const scroll = () => {
      if (sliderRef.current && !isPaused && !isDragging && vehicles.length > 0 && !isSelectionPage) {
        sliderRef.current.scrollLeft += 1;
        if (sliderRef.current.scrollLeft >= sliderRef.current.scrollWidth / 2) {
          sliderRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, isDragging, vehicles.length, isSelectionPage]);

  const calculateTotal = (vName: string) => {
    const name = vName.toLowerCase();
    const getPriceFromData = (data: any) => {
      if (!data) return 0;
      if (name.includes("ultra")) return data.price_ultra_vip;
      if (name.includes("minivan")) return data.price_minivan;
      if (name.includes("minibüs") || name.includes("sprinter") || name.includes("bus")) return data.price_minibus;
      return data.price;
    };
    const gidisPrice = getPriceFromData(gidisPrices);
    const donusPrice = isRoundTrip ? getPriceFromData(donusPrices) : 0;
    return gidisPrice + donusPrice;
  };

  const getSliderMinPrice = (vName: string) => {
    const name = vName.toLowerCase();
    if (name.includes("ultra")) return minPrices.ultra;
    if (name.includes("minivan")) return minPrices.minivan;
    if (name.includes("minibüs") || name.includes("sprinter") || name.includes("bus")) return minPrices.minibus;
    return minPrices.standard; 
  };

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setDragDistance(0);
    setStartX(e.pageX - sliderRef.current!.offsetLeft);
    setScrollLeft(sliderRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current!.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current!.scrollLeft = scrollLeft - walk;
    setDragDistance(Math.abs(walk));
  };

  const executeAction = async (e: any, action: () => void) => {
    if (dragDistance > 10) { e.preventDefault(); e.stopPropagation(); return; }
    action();
  };

  const handleSelect = async (vehicle: any) => {
    if (isSyncing) return;
    const dep = searchParams.get("dep");
    const arr = searchParams.get("arr");
    if (!dep || !arr) {
      alert("Lütfen rezervasyon adımına geçmeden önce Kalkış ve Varış noktalarınızı eksiksiz seçiniz.");
      return;
    }
    const finalPrice = calculateTotal(vehicle.name);
    const savedSummary = localStorage.getItem("transferSummary");
    if (savedSummary) {
      const summary = JSON.parse(savedSummary);
      const updated = { ...summary, totalPrice: `€${finalPrice}`, vehicle: vehicle.id, selectedCarName: vehicle.name };
      localStorage.setItem("transferSummary", JSON.stringify(updated));
    }
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("price", finalPrice.toString());
    const { data: { session } } = await supabase.auth.getSession();
    router.push(session ? `/rezervasyon-tamamla?${currentParams.toString()}` : `/auth?redirect=arac-secimi&${currentParams.toString()}`);
  };

  if (loading) return <div className="py-20 flex justify-center bg-cream-dark"><div className="w-10 h-10 border-4 border-cream-dark border-t-gold rounded-full animate-spin"></div></div>;

  if (isSelectionPage) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-4 pb-20 bg-cream-dark px-4">
        {vehicles.map((v, index) => {
          const carPrice = calculateTotal(v.name);
          return (
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={index} className="bg-cream border border-cream-dark rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              {isSyncing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center font-black text-gold text-[10px] tracking-widest uppercase italic">
                  <Loader2 className="animate-spin mr-2" size={16} /> Fiyat Güncelleniyor...
                </div>
              )}
              <div className="w-full md:w-1/4 flex justify-center items-center p-2">
                {v.image_url ? <img src={v.image_url} alt={v.name} className="h-24 md:h-32 object-contain" /> : <span className="text-6xl">🚐</span>}
              </div>
              <div className="flex-1 w-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-gold/10 text-gold text-[9px] font-black px-2 py-0.5 rounded uppercase">VIP SEÇENEK</span>
                  <h4 className="text-lg md:text-xl font-bold text-luxury-dark uppercase tracking-tight">{v.name}</h4>
                </div>
                <p className="text-[11px] text-luxury-gray font-medium mb-4">{v.description || "Premium donanım, geniş bagaj hacmi ve konforlu koltuklar."}</p>
                <div className="flex flex-wrap gap-4 text-[11px] font-bold text-luxury-gray">
                  <span className="flex items-center gap-1.5"><Users size={14} className="text-gold" /> {v.capacity} Yolcu</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-gold" /> {v.luggage} Valiz</span>
                  <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={14} /> Ücretsiz İptal</span>
                </div>
              </div>
              <div className="w-full md:w-auto flex flex-col items-center md:items-end md:border-l border-cream-dark md:pl-8 min-w-[180px]">
                {v.contact_for_price ? (
                  <button onClick={() => window.open(`https://wa.me/905322855572?text=Merhaba, ${v.name} aracı için fiyat almak istiyorum.`, "_blank")} className="w-full bg-[#25D366] text-white font-bold px-6 py-3 rounded-lg uppercase text-[11px] tracking-wide hover:bg-green-600 transition-all">FİYAT SOR</button>
                ) : (
                  <>
                    <div className="text-luxury-gray text-[10px] font-bold uppercase mb-1 opacity-60">{isRoundTrip ? 'TOPLAM PAKET FİYATI' : 'ARAÇ FİYATI'}</div>
                    <div className="text-3xl font-black text-luxury-dark mb-4">€{isSyncing ? "---" : (carPrice || "---")}</div>
                    <button 
                      disabled={isSyncing}
                      onClick={() => handleSelect(v)} 
                      className={`w-full font-bold px-10 py-3 rounded-lg transition-all uppercase text-[12px] tracking-widest flex items-center justify-center gap-2 ${isSyncing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gold hover:bg-luxury-dark text-white'}`}
                    >
                      {isSyncing ? 'BEKLEYİN' : 'SEÇ'} <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  const duplicatedVehicles = [...vehicles, ...vehicles, ...vehicles, ...vehicles];

  return (
    <section id="vehicles" className="w-full py-20 bg-cream-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h3 className="text-2xl md:text-3xl font-black text-luxury-dark uppercase tracking-tighter">LÜKS <span className="text-gold">FİLOMUZ</span><div className="h-1.5 w-16 bg-gold mt-2 rounded-full"></div></h3>
      </div>
      <div ref={sliderRef} className="flex overflow-x-auto cursor-grab active:cursor-grabbing relative z-20 px-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => { setIsPaused(false); setIsDragging(false); }} onMouseDown={handleMouseDown} onMouseUp={() => setIsDragging(false)} onMouseMove={handleMouseMove} onTouchStart={() => { setIsPaused(true); setIsDragging(true); setDragDistance(0); }} onTouchEnd={() => { setIsPaused(false); setIsDragging(false); }}>
        <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
        <div className="flex gap-4 md:gap-6 w-max">
          {duplicatedVehicles.map((v, index) => {
            const minPrice = getSliderMinPrice(v.name);
            return (
              <div key={index} className="bg-cream shrink-0 min-w-[280px] md:min-w-[350px] rounded-2xl p-6 border border-cream-dark shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group select-none">
                <div className="h-40 md:h-48 mb-6 flex items-center justify-center bg-cream-dark/50 rounded-xl pointer-events-none">
                  {v.image_url ? <img src={v.image_url} alt={v.name} className="h-[85%] object-contain group-hover:scale-110 transition-transform duration-700" /> : <span className="text-6xl">🚐</span>}
                </div>
                <h4 className="text-xl font-bold text-luxury-dark uppercase mb-4 tracking-tight group-hover:text-gold transition-colors">{v.name}</h4>
                <div className="flex justify-between items-center text-[12px] font-bold text-luxury-gray uppercase bg-cream-dark/30 p-3 rounded-lg border border-cream-dark">
                  <span className="flex items-center gap-1.5"><Users size={16} className="text-gold"/> {v.capacity} KİŞİ </span>
                  <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-gold"/> {v.luggage} BAGAJ </span>
                </div>
                <div className="mt-6">
                  {v.contact_for_price ? (
                    <button onClick={(e) => executeAction(e, () => window.open(`https://wa.me/905322855572?text=Merhaba, ${v.name} aracı için bilgi ve fiyat almak istiyorum.`, "_blank"))} className="w-full bg-[#25D366] hover:bg-green-600 text-white font-black px-6 py-4 rounded-xl uppercase text-[10px] md:text-[11px] tracking-widest transition-all shadow-md flex justify-center items-center gap-2">FİYAT AL!</button>
                  ) : (
                    <div onClick={(e) => executeAction(e, () => router.push("/rezervasyon"))} className="flex items-center justify-between cursor-pointer">
                      <div className="text-left"><span className="text-[10px] text-luxury-gray/60 block font-bold uppercase">Başlayan Fiyatlar</span><span className="text-2xl font-black text-luxury-dark">{minPrice ? `€${minPrice}` : "---"}</span></div>
                      <div className="w-12 h-12 bg-cream-dark text-gold rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all duration-300 shadow-sm pointer-events-none"><ChevronRight size={24} /></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-24 md:w-64 h-full bg-gradient-to-r from-cream-dark via-cream-dark/80 to-transparent z-10 pointer-events-none" /><div className="absolute top-0 right-0 w-24 md:w-64 h-full bg-gradient-to-l from-cream-dark via-cream-dark/80 to-transparent z-10 pointer-events-none" />
    </section>
  );
});

VehicleList.displayName = "VehicleList";
export default VehicleList;