"use client";

import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react"; 
import { supabase } from "@/lib/supabase"; 
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from "@/context/CurrencyContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  MapPin, Flag, Calendar, Clock, 
  ArrowRight, Printer, ShieldCheck, Search, Car, AlertTriangle
} from "lucide-react";

function InquiryContent() {
  const searchParams = useSearchParams(); 
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const [inquiryData, setInquiryData] = useState({ pnr: "", email: "", phone: "" });
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const urlPnr = searchParams.get("pnr");

  const tStrings = {
    title1: lang === 'en' ? "CHECK" : "BİLET",
    title2: lang === 'en' ? "TICKET" : "SORGULA",
    pnrPh: lang === 'en' ? "PNR CODE" : "PNR KODU",
    emailPh: lang === 'en' ? "EMAIL" : "E-POSTA",
    phonePh: lang === 'en' ? "PHONE" : "TELEFON",
    btnChecking: lang === 'en' ? "CHECKING..." : "DOĞRULANIYOR...",
    btnGet: lang === 'en' ? "GET TICKET" : "BİLETİ GETİR",
    errTitle: lang === 'en' ? "ACCESS DENIED" : "ERİŞİM REDDEDİLDİ",
    errMsg: lang === 'en' ? "The PNR, Email or Phone information you entered did not match any records in our system." : "Girdiğiniz PNR, E-posta veya Telefon bilgileri sistemimizdeki hiçbir kayıtla eşleşmedi.",
    printBtn: lang === 'en' ? "PRINT / SAVE PDF" : "YAZDIR / PDF KAYDET",
    systemLabel: lang === 'en' ? "SECURE TICKET SYSTEM" : "GÜVENLİ BİLET SİSTEMİ",
    roundTrip: lang === 'en' ? "ROUND TRIP" : "GİDİŞ - DÖNÜŞ",
    oneWay: lang === 'en' ? "ONE WAY" : "TEK YÖN",
    paxInfo: lang === 'en' ? "PASSENGER INFO" : "YOLCU BİLGİSİ",
    carClass: lang === 'en' ? "VEHICLE CLASS" : "ARAÇ SINIFI",
    depDetails: lang === 'en' ? "DEPARTURE DETAILS" : "GİDİŞ DETAYLARI",
    pickup: lang === 'en' ? "PICKUP" : "KALKIŞ",
    dropoff: lang === 'en' ? "DROPOFF" : "VARIŞ",
    adult: lang === 'en' ? "ADULT" : "YETİŞKİN",
    child: lang === 'en' ? "CHILD" : "ÇOCUK",
    retDetails: lang === 'en' ? "RETURN DETAILS" : "DÖNÜŞ DETAYLARI",
    retConfirmed: lang === 'en' ? "RETURN CONFIRMED" : "DÖNÜŞ ONAYLI",
    pnrLabel: lang === 'en' ? "PNR CODE" : "PNR KODU",
    verified: lang === 'en' ? "DATA VERIFIED" : "ÖDEME ONAYLANDI.",
    totalAmount: lang === 'en' ? "TOTAL AMOUNT" : "TOPLAM TUTAR"
  };

  const fetchBookingFromDb = async (p: string, e?: string, ph?: string) => {
    if (!p) return;
    setLoading(true);
    setError(false);
    setBooking(null);

    let query = supabase
      .from("reservations")
      .select("*")
      .eq("pnr_code", p.toUpperCase().trim());

    if (e) query = query.eq("user_email", e.toLowerCase().trim());
    if (ph) query = query.eq("phone", ph.replace(/\s/g, ""));

    const { data, error: dbError } = await query.maybeSingle();

    if (dbError || !data) {
      setError(true);
    } else {
      setBooking(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (urlPnr && !booking && !loading) {
      setInquiryData(prev => ({ ...prev, pnr: urlPnr }));
      fetchBookingFromDb(urlPnr); 
    }
  }, [urlPnr]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20 pt-32 relative z-10 print:pt-0 print:pb-0 min-h-[80vh] flex flex-col items-center justify-center">
      
      <div className="text-center mb-12 w-full no-print">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.1em] text-[#2C2C2C] mb-8 italic">
            {tStrings.title1} <span className="text-[#D4AF37]">{tStrings.title2}</span>
          </h1>
        </motion.div>

        <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              value={inquiryData.pnr}
              onChange={(e) => setInquiryData({...inquiryData, pnr: e.target.value})}
              placeholder={tStrings.pnrPh}
              className="w-full bg-white/80 px-6 py-4 rounded-2xl outline-none text-[12px] font-bold tracking-widest text-[#2C2C2C] uppercase focus:bg-white transition-all border border-gray-100 focus:border-[#D4AF37] shadow-sm"
            />
            <input 
              type="email" 
              value={inquiryData.email}
              onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
              placeholder={tStrings.emailPh}
              className="w-full bg-white/80 px-6 py-4 rounded-2xl outline-none text-[12px] font-bold tracking-widest text-[#2C2C2C] uppercase focus:bg-white transition-all border border-gray-100 focus:border-[#D4AF37] shadow-sm"
            />
            <input 
              type="tel" 
              value={inquiryData.phone}
              onChange={(e) => setInquiryData({...inquiryData, phone: e.target.value})}
              placeholder={tStrings.phonePh}
              className="w-full bg-white/80 px-6 py-4 rounded-2xl outline-none text-[12px] font-bold tracking-widest text-[#2C2C2C] uppercase focus:bg-white transition-all border border-gray-100 focus:border-[#D4AF37] shadow-sm"
            />
          </div>
          <button 
            onClick={() => fetchBookingFromDb(inquiryData.pnr, inquiryData.email, inquiryData.phone)}
            className="bg-[#D4AF37] hover:bg-[#BF953F] text-black w-full py-4 rounded-2xl font-black uppercase text-[12px] tracking-[0.3em] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 mt-2"
          >
            {loading ? tStrings.btnChecking : tStrings.btnGet} <Search size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full mx-auto p-8 bg-red-50 border-2 border-red-100 rounded-[2.5rem] text-center space-y-4 no-print shadow-xl">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
               <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black text-red-700 uppercase tracking-tight">{tStrings.errTitle}</h2>
            <p className="text-red-600/70 font-bold text-xs uppercase tracking-widest leading-relaxed">{tStrings.errMsg}</p>
          </motion.div>
        )}

        {booking && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl mx-auto space-y-8 printable-area">
            <div className="flex justify-center md:justify-end no-print">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-3 bg-white border border-gray-200 px-8 py-4 rounded-2xl text-[#2C2C2C] hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] transition-all font-black text-[11px] tracking-widest uppercase shadow-md"
              >
                <Printer size={18} /> {tStrings.printBtn}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row bg-white rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden print:shadow-none print:border-2 print:border-black print:rounded-none relative ticket-container">
              
              <div className="flex-1 p-8 md:p-12 relative border-b lg:border-b-0 lg:border-r-2 border-dashed border-gray-200 print:p-6 print:border-black">
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6 print:mb-4 print:pb-4 print:border-black">
                  <div>
                    <h2 className="text-3xl font-black text-[#2C2C2C] tracking-tighter leading-none uppercase italic print:text-black">XREM<span className="text-[#D4AF37] print:text-black">TRANSFER</span></h2>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mt-2 block print:text-black">{tStrings.systemLabel}</span>
                  </div>
                  <div className="bg-[#D4AF37] text-white px-5 py-2 rounded-full font-black text-[10px] tracking-widest uppercase shadow-sm print:bg-black print:text-white">
                    {booking.is_round_trip ? tStrings.roundTrip : tStrings.oneWay}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:mb-3 print:gap-3">
                  <div className="bg-gray-50/80 p-5 rounded-3xl border border-gray-100 print:bg-white print:border-black print:p-3">
                    <p className="text-[9px] text-gray-400 font-black uppercase mb-1 print:text-black">{tStrings.paxInfo}</p>
                    <p className="text-sm font-black text-[#2C2C2C] uppercase print:text-black">{booking.full_name || booking.user_email}</p>
                  </div>
                  <div className="bg-gray-50/80 p-5 rounded-3xl border border-gray-100 flex items-center gap-4 print:bg-white print:border-black print:p-3">
                    <Car size={20} className="text-[#D4AF37] print:text-black" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-black uppercase mb-1 print:text-black">{tStrings.carClass}</p>
                      <p className="text-sm font-black text-[#2C2C2C] uppercase italic print:text-black">{booking.vehicle}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 print:space-y-2">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-[#2C2C2C] text-white text-[9px] px-4 py-1.5 rounded-full font-black tracking-widest mb-2 print:bg-black print:text-white">{tStrings.depDetails}</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm print:p-3 print:border-black print:rounded-none">
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <p className="text-[9px] text-[#D4AF37] font-black uppercase mb-1 print:text-black">{tStrings.pickup}</p>
                          <p className="text-[12px] font-bold text-[#2C2C2C] print:text-black leading-tight">{booking.pickup}</p>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 print:text-black" />
                        <div className="flex-1 text-right">
                          <p className="text-[9px] text-[#D4AF37] font-black uppercase mb-1 print:text-black">{tStrings.dropoff}</p>
                          <p className="text-[12px] font-bold text-[#2C2C2C] print:text-black leading-tight">{booking.dropoff}</p>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 print:border-black print:mt-2 print:pt-2">
                        <div className="text-[10px] font-black text-[#2C2C2C] print:text-black italic">{booking.transfer_date} | {booking.transfer_time}</div>
                        <div className="text-[10px] font-black text-[#2C2C2C] print:text-black uppercase">{booking.adults} {tStrings.adult} {booking.children > 0 && `| ${booking.children} ${tStrings.child}`}</div>
                      </div>
                    </div>
                  </div>

                  {booking.is_round_trip && (
                    <div>
                      <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-white text-[9px] px-4 py-1.5 rounded-full font-black tracking-widest mb-2 print:bg-black print:text-white">{tStrings.retDetails}</div>
                      <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-6 rounded-[2rem] print:bg-white print:border-black print:rounded-none print:p-3">
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <p className="text-[9px] text-[#D4AF37] font-black uppercase mb-1 print:text-black">{tStrings.pickup}</p>
                            <p className="text-[12px] font-bold text-[#2C2C2C] print:text-black leading-tight">{booking.return_pickup || booking.dropoff}</p>
                          </div>
                          <ArrowRight size={18} className="text-[#D4AF37]/40 print:text-black" />
                          <div className="flex-1 text-right">
                            <p className="text-[9px] text-[#D4AF37] font-black uppercase mb-1 print:text-black">{tStrings.dropoff}</p>
                            <p className="text-[12px] font-bold text-[#2C2C2C] print:text-black leading-tight">{booking.return_dropoff || booking.pickup}</p>
                          </div>
                        </div>
                        <div className="flex justify-between mt-4 pt-4 border-t border-[#D4AF37]/20 print:border-black print:mt-2 print:pt-2">
                          <div className="text-[10px] font-black text-[#2C2C2C] print:text-black italic">{booking.return_date} | {booking.return_time}</div>
                          <div className="text-[10px] font-black text-[#2C2C2C] print:text-black uppercase">{tStrings.retConfirmed}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-80 bg-[#2C2C2C] text-white p-8 md:p-12 flex flex-col justify-between items-center text-center relative print:bg-white print:text-black print:border-l-2 print:border-black print:p-4 print:w-56">
                <div className="space-y-6 w-full print:space-y-2">
                  <div className="inline-block p-4 bg-white rounded-3xl border-4 border-[#D4AF37] shadow-lg print:border-black print:rounded-none print:p-2 print:shadow-none">
                    <QRCodeSVG value={`https://xremtransfer.com/sorgula?pnr=${booking.pnr_code}&email=${booking.user_email}&phone=${booking.phone}`} size={120} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-black uppercase mb-1 print:text-black">{tStrings.pnrLabel}</p>
                    <p className="text-2xl font-mono font-black text-[#D4AF37] tracking-widest print:text-black">{booking.pnr_code}</p>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-[#D4AF37] text-[9px] font-black uppercase tracking-widest bg-[#D4AF37]/10 py-2.5 px-5 rounded-full border border-[#D4AF37]/30 print:bg-white print:text-black print:border-black print:py-1">
                    <ShieldCheck size={14} /> {tStrings.verified}
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 w-full print:border-black print:mt-4 print:pt-2">
                  <p className="text-[9px] text-gray-400 font-black mb-1 print:text-black">{tStrings.totalAmount}</p>
                  <p className="text-3xl font-black text-white tracking-tighter print:text-black">{formatPrice(Number(booking.total_price))}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          nav, footer, .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .printable-area { transform: scale(0.9); transform-origin: top center; width: 100% !important; margin: 0 !important; padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Ferah Crystal Pastel Köşeler - Tıpkı Menüdeki Gibi */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-[#C88A83] rounded-br-[100%] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-80 md:w-[30rem] h-80 md:h-[30rem] bg-[#E8CD89] rounded-bl-[100%] opacity-40 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-72 md:w-[28rem] h-72 md:h-[28rem] bg-[#4CBEC4] rounded-tr-[100%] opacity-40 pointer-events-none z-0" />

      <Suspense fallback={<div className="h-screen flex items-center justify-center relative z-10"><div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent animate-spin rounded-full"></div></div>}>
        <InquiryContent />
      </Suspense>
      
    </main>
  );
}