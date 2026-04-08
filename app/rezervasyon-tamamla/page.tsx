"use client";

import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation"; 
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Ticket, CheckCircle2, AlertCircle, MessageSquare, 
  ArrowRight, ShieldCheck, MapPin, Calendar, Users, Car, Loader2
} from "lucide-react";

function BookingFinalContent() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter(); 
  
  const [formData, setFormData] = useState({
    pickup: "", dropoff: "", date: "", time: "",
    returnPickup: "", returnDropoff: "", returnDate: "", returnTime: "",
    isRoundTrip: false, adults: 1, children: 0,
    returnAdults: 1, returnChildren: 0, notes: ""
  });

  const [basePrice, setBasePrice] = useState(0); 
  const [vehicleName, setVehicleName] = useState("VIP Araç Yükleniyor...");
  const [promoRate, setPromoRate] = useState(0); 
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "loading" | "success" | "error" | "used">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userProfile, setUserProfile] = useState({
    fullName: "---", phone: "---", tcNo: "---", email: "---" 
  });

  useEffect(() => {
    const savedData = localStorage.getItem("transferSummary");
    const urlPrice = searchParams.get("price");
    if (urlPrice) setBasePrice(Number(urlPrice));

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(prev => ({ 
        ...prev, 
        pickup: parsed.pickup || "",
        dropoff: parsed.dropoff || "",
        date: parsed.date || "",
        time: parsed.time || "",
        returnPickup: parsed.returnPickup || "",
        returnDropoff: parsed.returnDropoff || "",
        returnDate: parsed.returnDate || "",
        returnTime: parsed.returnTime || "",
        isRoundTrip: parsed.isRoundTrip === true || parsed.isRoundTrip === "true",
        adults: parseInt(parsed.adults) || 1,
        children: parseInt(parsed.children) || 0,
        returnAdults: parseInt(parsed.returnAdults) || 1,
        returnChildren: parseInt(parsed.returnChildren) || 0
      }));
      
      if (!urlPrice && parsed.totalPrice) setBasePrice(Number(parsed.totalPrice.replace('€', '')));
      
      if (parsed.selectedCarName || parsed.carName) {
        setVehicleName(parsed.selectedCarName || parsed.carName);
      }
    }

    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUserProfile({
          fullName: `${metadata?.first_name || ""} ${metadata?.last_name || ""}`.trim() || "DEĞERLİ MİSAFİRİMİZ",
          phone: metadata?.phone || "---",
          tcNo: metadata?.identity_no || "---",
          email: session.user.email || "---" 
        });
      }
    };
    fetchProfile();
  }, [searchParams]);

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoStatus("loading");
    const { data, error } = await supabase.from("coupons").select("*").eq("code", promoCode.toUpperCase().trim()).maybeSingle();
    if (error || !data || !data.is_active) { setPromoStatus("error"); return; }
    if ((data.used_count ?? 0) >= (data.usage_limit ?? 1)) { setPromoStatus("used"); return; }
    setPromoRate(data.discount_rate || 0);
    setPromoStatus("success");
  };

  const activeBasePrice = formData.isRoundTrip ? basePrice : basePrice;
  const discountAmount = (activeBasePrice * promoRate) / 100;
  const finalPriceValue = activeBasePrice - discountAmount;

  // Patron, burası Supabase'e mühür vurduğumuz yer:
  const handleConfirm = async () => {
    setIsSubmitting(true);
    const pnr = `XREM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const cleanPhone = userProfile.phone.replace(/\s/g, "");

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            pnr: pnr,
            user_email: userProfile.email,
            full_name: userProfile.fullName, // Ad Soyad artık düşüyor
            phone: cleanPhone,               // Telefon temizlenip düşüyor
            pickup: formData.pickup,
            dropoff: formData.dropoff,
            transfer_date: formData.date,
            transfer_time: formData.time,
            vehicle: vehicleName,
            total_price: `€${finalPriceValue.toFixed(2)}`,
            adults: formData.adults,
            children: formData.children,
            is_round_trip: Boolean(formData.isRoundTrip), // Gerçek Boolean garantisi
            return_date: formData.isRoundTrip ? formData.returnDate : null,
            return_time: formData.isRoundTrip ? formData.returnTime : null,
            return_pickup: formData.isRoundTrip ? (formData.returnPickup || formData.dropoff) : null,
            return_dropoff: formData.isRoundTrip ? (formData.returnDropoff || formData.pickup) : null,
            notes: formData.notes,
            status: "ONAY BEKLİYOR"
          }
        ])
        .select();

      if (error) throw error;

      // LocalStorage'ı da güncelleyelim
      localStorage.setItem("currentBooking", JSON.stringify(data[0]));
      router.push(`/odeme?pnr=${pnr}`);

    } catch (err) {
      console.error("Supabase Insert Hatası:", err);
      alert("Rezervasyon kaydedilirken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-xl">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-luxury-dark italic">
          SON <span className="text-gold">ADIM</span>
        </h1>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
           <span className="text-luxury-gray/40">1. Araç Seçimi</span>
           <ArrowRight size={14} className="text-gold" />
           <span className="text-luxury-dark bg-gold/10 px-4 py-2 rounded-full border border-gold/20">2. Rezervasyon Onayı</span>
           <ArrowRight size={14} className="text-gold" />
           <span className="text-luxury-gray/40">3. Güvenli Ödeme</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl">
            <div className="flex items-center gap-4 mb-8 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <CheckCircle2 className="text-emerald-600" size={28} />
              <div className="flex-1">
                <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">MÜŞTERİ BİLGİLERİ DOĞRULANDI</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase">{userProfile.fullName} | {userProfile.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-luxury-dark ml-2">
                <MessageSquare size={16} className="text-gold" /> Özel İstekleriniz
              </label>
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-cream/30 border border-cream-dark p-6 rounded-2xl outline-none focus:border-gold focus:bg-white h-40 transition-all text-xs font-bold text-luxury-dark placeholder:text-luxury-gray/40 shadow-inner" 
                placeholder="Uçuş kodunuz, bebek koltuğu talebiniz veya şoförümüze iletmek istediğiniz notlar..."
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Ticket className="text-gold" size={20} />
              <h3 className="text-[12px] font-black uppercase tracking-widest text-luxury-dark">VIP İndirim Kuponu</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-cream/30 border border-cream-dark p-5 rounded-xl outline-none focus:border-gold transition-all uppercase text-xs font-black tracking-widest" 
                placeholder="KUPON KODU" 
              />
              <button onClick={handleApplyPromo} className="bg-luxury-black text-white px-10 py-5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-gold transition-all shadow-lg">UYGULA</button>
            </div>
            {promoStatus === "success" && <p className="mt-4 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">✓ İndirim Başarıyla Uygulandı!</p>}
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 backdrop-blur-2xl p-8 rounded-[3rem] sticky top-28 border border-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gold" />
            
            <h3 className="font-black uppercase tracking-[0.2em] text-sm mb-8 text-luxury-dark border-b border-cream-dark pb-4 italic">Sipariş Özeti</h3>
            
            <div className="space-y-6">
              <div className="bg-cream/40 p-5 rounded-2xl border border-cream-dark/50 space-y-3">
                <div className="flex items-center gap-3"><Car size={16} className="text-gold" /><span className="text-[11px] font-black text-luxury-dark uppercase italic">{vehicleName}</span></div>
                <div className="flex items-center gap-3"><Users size={16} className="text-gold" /><span className="text-[10px] font-bold text-luxury-gray uppercase">{formData.adults} Yetişkin, {formData.children} Çocuk</span></div>
              </div>

              <div className="space-y-4 px-2">
                <div className="relative pl-6 border-l-2 border-gold/30 space-y-4">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gold border-4 border-white shadow-sm" />
                  <div>
                    <span className="text-[9px] font-black text-gold uppercase tracking-widest block">KALKIŞ</span>
                    <span className="text-[11px] font-bold text-luxury-dark uppercase">{formData.pickup}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-luxury-gray/60 uppercase tracking-widest block">VARIŞ</span>
                    <span className="text-[11px] font-bold text-luxury-dark uppercase">{formData.dropoff}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-luxury-dark bg-white px-3 py-1.5 rounded-lg border border-cream-dark w-fit">
                    <Calendar size={12} className="text-gold" /> {formData.date} | {formData.time}
                  </div>
                </div>
              </div>

              {formData.isRoundTrip && (
                 <div className="bg-gold/5 p-5 rounded-2xl border border-gold/20">
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest block mb-2 italic">DÖNÜŞ TRANSFERİ DAHİL</span>
                    <span className="text-[10px] font-bold text-luxury-dark uppercase">{formData.returnDate} | {formData.returnTime}</span>
                 </div>
              )}

              <div className="pt-6 mt-6 border-t border-cream-dark space-y-4">
                <div className="flex justify-between items-end pt-4">
                  <span className="text-luxury-dark font-black tracking-widest text-[12px]">TOPLAM:</span> 
                  <span className="text-4xl font-black text-luxury-dark tracking-tighter italic">€{finalPriceValue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span className="text-[8px] font-bold text-emerald-700 uppercase tracking-widest">256-BIT SSL GÜVENLİĞİ</span>
                </div>
            </div>

            <button 
              onClick={handleConfirm} 
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-luxury-black text-white font-black py-6 rounded-2xl transition-all uppercase text-[12px] tracking-[0.3em] shadow-xl relative overflow-hidden group/btn disabled:opacity-50"
            >
                {isSubmitting ? (
                  <span className="relative z-10 flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> İŞLENİYOR...</span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-3">GÜVENLİ ÖDEME <ArrowRight size={18} /></span>
                )}
                <motion.div initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.7 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] z-5" />
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default function BookingFinalPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />
      <div className="fixed inset-0 z-0">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/80 to-cream/95 backdrop-blur-[1px]" />
      </div>
      <Suspense fallback={<div className="h-screen bg-cream flex items-center justify-center"><Loader2 className="animate-spin text-gold" size={40} /></div>}>
        <BookingFinalContent />
      </Suspense>
      <Footer />
    </main>
  );
}