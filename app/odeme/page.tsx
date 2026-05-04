"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from "@/context/CurrencyContext";
import { 
  ShieldCheck, CreditCard, Lock, CheckCircle2, 
  ArrowLeft, Landmark, Car, MapPin, Calendar
} from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pnr = searchParams.get("pnr");
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();

  const [booking, setBooking] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [cardData, setCardData] = useState({ number: "", holder: "", expiry: "", cvc: "" });

  const tStrings = {
    loading: lang === 'en' ? "Secure Connection..." : "Güvenli Bağlantı...",
    ssl: lang === 'en' ? "256-BIT SSL SECURE PAYMENT" : "256-BİT SSL GÜVENLİ ÖDEME",
    title1: lang === 'en' ? "COMPLETE" : "ÖDEMEYİ",
    title2: lang === 'en' ? "PAYMENT" : "TAMAMLA",
    cardTitle: lang === 'en' ? "Credit / Debit Card" : "Kredi / Banka Kartı",
    cardName: lang === 'en' ? "Name on Card" : "Kart Üzerindeki İsim",
    cardNamePh: lang === 'en' ? "FULL NAME" : "AD SOYAD",
    cardNo: lang === 'en' ? "Card Number" : "Kart Numarası",
    cardExp: lang === 'en' ? "Expiry (MM/YY)" : "S.K.T. (AA/YY)",
    cardCvc: lang === 'en' ? "Security Code (CVC)" : "Güvenlik Kodu (CVC)",
    btnConfirm: lang === 'en' ? "CONFIRM PAYMENT" : "ÖDEMEYİ ONAYLA",
    btnProcessing: lang === 'en' ? "PROCESSING..." : "İŞLEM YAPILIYOR...",
    btnSuccess: lang === 'en' ? "PAYMENT SUCCESSFUL" : "ÖDEME BAŞARILI",
    btnError: lang === 'en' ? "TRY AGAIN" : "TEKRAR DENE",
    orderDetail: lang === 'en' ? "Order Details" : "Sipariş Detayı",
    pax: lang === 'en' ? "TRANSFER PASSENGER" : "TRANSFER YOLCUSU",
    depRoute: lang === 'en' ? "FROM" : "NEREDEN",
    retRoute: lang === 'en' ? "TO" : "NEREYE",
    vipCar: lang === 'en' ? "VIP VEHICLE" : "VIP ARAÇ",
    total: lang === 'en' ? "TOTAL AMOUNT" : "ÖDENECEK TUTAR",
    errorMsg: lang === 'en' ? "An error occurred during payment." : "Ödeme işlemi sırasında bir hata oluştu."
  };

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
   
      const { error: sbError } = await supabase
        .from('reservations')
        .update({ status: "ÖDENDİ / ONAYLANDI" })
        .eq('pnr_code', pnr);

      
      if (sbError) {
        console.warn("Sipariş durumu güncellenirken uyarı:", sbError.message);
      }

      setPaymentStatus("success");
      setTimeout(() => {
        router.push(`/onay?pnr=${pnr}`);
      }, 2000);

    } catch (err: any) {
      setPaymentStatus("error");
      setErrorMessage(err.message || tStrings.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return (
    <div className="h-screen bg-cream flex flex-col items-center justify-center text-gold gap-4">
      <div className="w-12 h-12 border-4 border-cream-dark border-t-gold rounded-full animate-spin"></div>
      <span className="font-black uppercase tracking-[0.4em] text-[10px]">{tStrings.loading}</span>
    </div>
  );

  const notesString = booking.notes || "";
  const notesParts = notesString.split("| Ekstralar:");
  const customNotes = notesParts[0]?.trim();
  const extrasString = notesParts[1]?.trim();

  const rawPrice = booking.total_price ? Number(booking.total_price) : (booking.totalPrice ? Number(booking.totalPrice) : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative z-10">
      
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 mb-6 border border-emerald-100 shadow-sm"
        >
          <Lock size={14} className="animate-pulse" /> {tStrings.ssl}
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-luxury-dark italic">
          {tStrings.title1} <span className="text-gold">{tStrings.title2}</span>
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
                  <h3 className="text-sm font-black uppercase tracking-widest text-luxury-dark">{tStrings.cardTitle}</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-luxury-gray font-black uppercase tracking-[0.2em] ml-1">{tStrings.cardName}</label>
                  <input required type="text" className="w-full bg-cream/30 border border-cream-dark p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all uppercase text-sm font-bold text-luxury-dark shadow-inner" placeholder={tStrings.cardNamePh} onChange={(e) => setCardData({...cardData, holder: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] text-luxury-gray font-black uppercase tracking-[0.2em] ml-1">{tStrings.cardNo}</label>
                  <div className="relative">
                    <input required type="text" value={cardData.number} onChange={handleCardNumber} className="w-full bg-cream/30 border border-cream-dark p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all text-lg tracking-[0.2em] font-mono font-bold text-luxury-dark shadow-inner" placeholder="0000 0000 0000 0000" />
                    <Landmark className="absolute right-5 top-5 text-luxury-gray/30" size={24} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-luxury-gray font-black uppercase tracking-[0.2em] ml-1">{tStrings.cardExp}</label>
                    <input required type="text" value={cardData.expiry} onChange={handleExpiry} className="w-full bg-cream/30 border border-cream-dark p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all text-center font-mono font-bold text-luxury-dark" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-luxury-gray font-black uppercase tracking-[0.2em] ml-1">{tStrings.cardCvc}</label>
                    <input required type="password" maxLength={3} className="w-full bg-cream/30 border border-cream-dark p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all text-center font-mono font-bold text-luxury-dark" placeholder="***" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              disabled={loading || paymentStatus === "success"} 
              type="submit" 
              className={`w-full font-black py-6 rounded-[2rem] transition-all uppercase text-[12px] tracking-[0.3em] shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group/btn ${
                paymentStatus === "error" ? "bg-red-600 text-white" : 
                paymentStatus === "success" ? "bg-emerald-500 text-white" : 
                "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500"
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                {paymentStatus === "idle" && <><Lock size={18} /> {tStrings.btnConfirm} ({formatPrice(rawPrice)})</>} 
                {paymentStatus === "processing" && <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {tStrings.btnProcessing}</>} 
                {paymentStatus === "success" && <><CheckCircle2 size={20} /> {tStrings.btnSuccess}</>}
                {paymentStatus === "error" && tStrings.btnError}
              </span>
              <motion.div initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.7 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] z-5" />
            </button>
          </form>
        </motion.div>

        <div className="order-1 lg:order-2">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 backdrop-blur-2xl border border-white p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden h-full">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center mb-8 border-b border-cream-dark pb-4">
               <h3 className="font-black uppercase tracking-[0.2em] text-sm text-luxury-dark italic">{tStrings.orderDetail}</h3>
            </div>
            
            <div className="space-y-6 relative z-10">
              
              <div className="bg-cream/40 p-5 rounded-2xl border border-cream-dark/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-luxury-gray uppercase">SEÇİLEN ARAÇ</span>
                  <span className="text-[11px] font-black text-gold uppercase italic">{booking.vehicle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-luxury-gray uppercase">YOLCU SAYISI</span>
                  <span className="text-[10px] font-bold text-luxury-dark uppercase">{booking.adults || 1} Yetişkin, {booking.children || 0} Çocuk</span>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="relative pl-6 border-l-2 border-gold/30 space-y-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gold border-4 border-white shadow-sm" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-gold uppercase tracking-widest block">{tStrings.depRoute}</span>
                    <span className="text-[11px] font-bold text-luxury-dark uppercase leading-tight block">
                      {booking.pickup}
                    </span>
                  </div>
                  
                  <div className="absolute -left-[9px] bottom-0 w-4 h-4 rounded-full bg-luxury-dark border-4 border-white shadow-sm" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-luxury-gray/60 uppercase tracking-widest block">{tStrings.retRoute}</span>
                    <span className="text-[11px] font-bold text-luxury-dark uppercase leading-tight block">
                      {booking.dropoff}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-luxury-dark bg-cream/30 px-4 py-2 rounded-xl border border-cream-dark/50 w-full mt-4">
                  <Calendar size={12} className="text-gold" /> {booking.transfer_date || booking.date} | {booking.transfer_time || booking.time}
                </div>
              </div>

              {extrasString && extrasString.length > 0 && (
                <div className="pt-4 space-y-3 border-t border-cream-dark/50">
                  <span className="text-[9px] font-black text-luxury-gray uppercase tracking-widest">SEÇİLEN EKSTRALAR</span>
                  <div className="text-[10px] font-bold text-luxury-dark leading-relaxed">
                    {extrasString.split(",").map((extra: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={10} className="text-gold" /> 
                        <span className="uppercase">{extra.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-3 border-t border-cream-dark/50">
                <span className="text-[9px] font-black text-luxury-gray uppercase tracking-widest">MÜŞTERİ BİLGİLERİ</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-luxury-dark">
                    <span className="text-luxury-gray">Ad Soyad</span>
                    <span className="text-right truncate max-w-[130px]">{booking.full_name || booking.fullName || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-luxury-dark">
                    <span className="text-luxury-gray">E-Posta</span>
                    <span className="text-right truncate max-w-[130px]">{booking.user_email || booking.email || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-luxury-dark">
                    <span className="text-luxury-gray">Telefon</span>
                    <span className="text-right">{booking.phone || "-"}</span>
                  </div>
                </div>
              </div>

              {customNotes && customNotes.length > 0 && (
                <div className="pt-4 space-y-3 border-t border-cream-dark/50">
                  <span className="text-[9px] font-black text-luxury-gray uppercase tracking-widest">ÖZEL NOTLAR</span>
                  <p className="text-[10px] font-bold text-luxury-dark leading-relaxed italic bg-cream/20 p-3 rounded-xl border border-cream-dark">
                    "{customNotes}"
                  </p>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-luxury-dark/5 space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-luxury-gray uppercase tracking-widest">{tStrings.total}</span>
                    <span className="text-luxury-dark font-black text-xs uppercase italic">TOPLAM</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl font-black text-luxury-dark tracking-tighter italic">
                      {formatPrice(rawPrice)}
                    </span>
                  </div>
                </div>
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