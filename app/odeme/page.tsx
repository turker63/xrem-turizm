"use client";

import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ShieldCheck, CreditCard, Lock, CheckCircle2, 
  AlertCircle, ArrowLeft, Landmark, Car, MapPin, Calendar
} from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pnr = searchParams.get("pnr");

  const [booking, setBooking] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [cardData, setCardData] = useState({ number: "", holder: "", expiry: "", cvc: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const saved = localStorage.getItem("currentBooking");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.pnr === pnr || data.pnr_code === pnr) {
        setBooking(data);
      }
    }
  }, [pnr]);

  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").substring(0, 16);
    v = v.match(/.{1,4}/g)?.join(" ") || v;
    setCardData({ ...cardData, number: v });
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (v.length >= 3) v = v.substring(0, 2) + "/" + v.substring(2);
    setCardData({ ...cardData, expiry: v });
  };

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setLoading(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      const { data: existing } = await supabase
        .from('bookings')
        .select('pnr')
        .eq('pnr', pnr)
        .maybeSingle();

      if (existing) {
        setPaymentStatus("success");
        setTimeout(() => router.push(`/onay?pnr=${pnr}`), 1000);
        return;
      }

      const { error: sbError } = await supabase
        .from('bookings')
        .insert([{
          pnr: String(booking.pnr || pnr || ""),
          user_email: String(user?.email || booking.email || "misafir@xrem.com"),
          pickup: String(booking.pickup || ""),
          dropoff: String(booking.dropoff || ""),
          transfer_date: String(booking.date || booking.transfer_date || ""),
          transfer_time: String(booking.time || booking.transfer_time || ""),
          vehicle: String(booking.vehicle || booking.vehicle_model || ""),
          total_price: String(booking.totalPrice || ""),
          status: "ONAYLANDI"
        }]);

      if (sbError) throw sbError;

      setPaymentStatus("success");
      setTimeout(() => {
        router.push(`/onay?pnr=${pnr}`);
      }, 2000);

    } catch (err: any) {
      setPaymentStatus("error");
      setErrorMessage(err.message || "Ödeme işlemi sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return (
    <div className="h-screen bg-cream flex flex-col items-center justify-center text-gold gap-4">
      <div className="w-12 h-12 border-4 border-cream-dark border-t-gold rounded-full animate-spin"></div>
      <span className="font-black uppercase tracking-[0.4em] text-[10px]">Güvenli Bağlantı...</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-20 relative z-10">
      
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 mb-6 border border-emerald-100 shadow-sm"
        >
          <Lock size={14} className="animate-pulse" /> 256-BİT SSL GÜVENLİ ÖDEME
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-luxury-dark italic">
          ÖDEMEYİ <span className="text-gold">TAMAMLA</span>
        </h1>
        <div className="h-1.5 w-24 bg-gold mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
        
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="order-2 lg:order-1">
          <form onSubmit={processPayment} className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold via-yellow-400 to-gold" />
              
              <div className="flex items-center justify-between mb-10 border-b border-cream-dark pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-gold shadow-sm">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-luxury-dark">Kredi / Banka Kartı</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-luxury-gray font-black uppercase tracking-[0.2em] ml-1">Kart Üzerindeki İsim</label>
                  <input required type="text" className="w-full bg-cream/30 border border-cream-dark p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all uppercase text-sm font-bold text-luxury-dark shadow-inner" placeholder="AD SOYAD" onChange={(e) => setCardData({...cardData, holder: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] text-luxury-gray font-black uppercase tracking-[0.2em] ml-1">Kart Numarası</label>
                  <div className="relative">
                    <input required type="text" value={cardData.number} onChange={handleCardNumber} className="w-full bg-cream/30 border border-cream-dark p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all text-lg tracking-[0.2em] font-mono font-bold text-luxury-dark shadow-inner" placeholder="0000 0000 0000 0000" />
                    <Landmark className="absolute right-5 top-5 text-luxury-gray/30" size={24} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-luxury-gray font-black uppercase tracking-[0.2em] ml-1">S.K.T. (AA/YY)</label>
                    <input required type="text" value={cardData.expiry} onChange={handleExpiry} className="w-full bg-cream/30 border border-cream-dark p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all text-center font-mono font-bold text-luxury-dark" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-luxury-gray font-black uppercase tracking-[0.2em] ml-1">Güvenlik Kodu (CVC)</label>
                    <input required type="password" maxLength={3} className="w-full bg-cream/30 border border-cream-dark p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all text-center font-mono font-bold text-luxury-dark" placeholder="***" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              disabled={loading || paymentStatus === "success"} 
              type="submit" 
              className={`w-full font-black py-6 rounded-[2rem] transition-all uppercase text-[12px] tracking-[0.3em] shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group/btn ${
                paymentStatus === "error" ? "bg-red-600 text-white" : 
                paymentStatus === "success" ? "bg-emerald-600 text-white" : 
                "bg-luxury-black hover:bg-gold text-white"
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                {paymentStatus === "idle" && <><Lock size={18} /> ÖDEMEYİ ONAYLA ({booking.totalPrice})</>} 
                {paymentStatus === "processing" && <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> İŞLEM YAPILIYOR...</>} 
                {paymentStatus === "success" && <><CheckCircle2 size={20} /> ÖDEME BAŞARILI</>}
                {paymentStatus === "error" && "TEKRAR DENE"}
              </span>
              <motion.div initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.7 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] z-5" />
            </button>
          </form>
        </motion.div>

        <div className="order-1 lg:order-2">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 backdrop-blur-2xl border border-white p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden h-full">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center mb-10 border-b border-cream-dark pb-6">
               <h3 className="font-black uppercase tracking-[0.2em] text-sm text-luxury-dark italic">Sipariş Detayı</h3>
            </div>
            
            <div className="space-y-8 relative z-10">
              <div className="bg-cream/40 p-5 rounded-2xl border border-cream-dark/50">
                <span className="text-[9px] font-black text-luxury-gray/60 uppercase tracking-widest block mb-2">TRANSFER YOLCUSU</span>
                <span className="text-base font-black text-luxury-dark tracking-tight uppercase">
                  {user ? `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim() : (booking.fullName || booking.full_name)}
                </span>
              </div>

              <div className="space-y-6 px-1">
                <div className="relative pl-8 border-l-2 border-gold/30 space-y-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gold border-4 border-white shadow-sm" />
                  <div>
                    <span className="text-[9px] font-black text-gold uppercase tracking-widest block mb-1">GİDİŞ ROTALAMASI</span>
                    <span className="text-[13px] font-bold text-luxury-dark uppercase block leading-tight">{booking.pickup} ➔ {booking.dropoff}</span>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-black text-luxury-gray bg-white w-fit px-3 py-1 rounded-lg border border-cream-dark">
                        <Calendar size={12} className="text-gold" /> {booking.date} | {booking.time}
                    </div>
                  </div>
                  {booking.isRoundTrip && (
                    <div className="pt-2">
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-1">DÖNÜŞ ROTALAMASI</span>
                      <span className="text-[13px] font-bold text-luxury-dark uppercase block leading-tight">{booking.returnPickup || booking.dropoff} ➔ {booking.returnDropoff || booking.pickup}</span>
                      <div className="flex items-center gap-2 mt-2 text-[10px] font-black text-luxury-gray bg-white w-fit px-3 py-1 rounded-lg border border-cream-dark">
                          <Calendar size={12} className="text-emerald-500" /> {booking.returnDate} | {booking.returnTime}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-cream-dark shadow-sm">
                   <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-gold"><Car size={20} /></div>
                   <div>
                      <span className="text-[9px] font-black text-luxury-gray/50 uppercase tracking-widest block">VIP ARAÇ</span>
                      <span className="text-[11px] font-black text-luxury-dark uppercase italic">{booking.vehicle}</span>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-cream-dark flex flex-col items-end">
                <span className="text-[10px] font-black text-luxury-gray uppercase tracking-[0.3em] mb-2">TOPLAM TUTAR</span>
                <span className="text-5xl md:text-6xl font-black text-luxury-dark tracking-tighter italic">
                  {booking.totalPrice}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />
      <div className="fixed inset-0 z-0">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/80 to-cream/95 backdrop-blur-[1px]" />
      </div>
      <Suspense fallback={<div className="h-screen bg-cream" />}>
        <PaymentContent />
      </Suspense>
      <Footer />
    </main>
  );
}