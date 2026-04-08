"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';
import { 
  User, Fingerprint, Phone, Mail, KeyRound, Settings2, ShieldCheck, 
  Ticket, MapPin, Flag, Calendar, Clock, Car, ChevronRight, X, Printer, 
  LayoutDashboard, CreditCard, LogOut, BellRing, Settings
} from "lucide-react"; 

function ProfileContent() {
  const { lang } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const tStrings = {
    accControl: lang === 'en' ? "Account Control" : "Hesap Kontrolü",
    dashboard: lang === 'en' ? "Dashboard" : "Özet Paneli",
    logout: lang === 'en' ? "Logout" : "Oturumu Kapat",
    sysNotification: lang === 'en' ? "System Notification" : "Sistem Bildirimi",
    notificationText: lang === 'en' ? "For your account's security, we recommend changing your password periodically." : "Hesabınızın güvenliği için periyodik olarak şifrenizi güncellemenizi öneririz.",
    totalTransfer: lang === 'en' ? "TOTAL TRANSFERS" : "TOPLAM TRANSFER",
    pendingTicket: lang === 'en' ? "PENDING TICKETS" : "BEKLEYEN BİLET",
    activePnr: lang === 'en' ? "ACTIVE PNR" : "AKTİF PNR",
    profileTitle: lang === 'en' ? "Profile" : "Profil",
    profileSubtitle: lang === 'en' ? "Information" : "Bilgileri",
    profileDesc: lang === 'en' ? "Personal details and billing settings" : "Kişisel detaylar ve fatura ayarları",
    nameLabel: lang === 'en' ? "FULL NAME" : "ADINIZ VE SOYADINIZ",
    idLabel: lang === 'en' ? "ID NUMBER" : "T.C. KİMLİK NUMARASI",
    phoneLabel: lang === 'en' ? "CONTACT NUMBER" : "İLETİŞİM NUMARASI",
    emailLabel: lang === 'en' ? "EMAIL ADDRESS" : "E-POSTA ADRESİ",
    resetPass: lang === 'en' ? "Reset Password" : "Şifremi Sıfırla",
    editInfo: lang === 'en' ? "Edit Info" : "Bilgileri Düzenle",
    myTickets: lang === 'en' ? "My Tickets" : "Biletlerim",
    receipts: lang === 'en' ? "& Receipts" : "& Makbuzlar",
    amount: lang === 'en' ? "AMOUNT" : "TUTAR",
    noTicket: lang === 'en' ? "You have no active transfer tickets." : "Aktif transfer biletiniz bulunmuyor.",
    ticketDetail: lang === 'en' ? "TICKET" : "BİLET",
    detailWord: lang === 'en' ? "DETAILS" : "DETAYI",
    routeLabel: lang === 'en' ? "Transfer Route" : "Transfer Güzergahı",
    dateLabel: lang === 'en' ? "DATE & TIME" : "TARİH & SAAT",
    carType: lang === 'en' ? "VEHICLE TYPE" : "ARAÇ TİPİ",
    printBtn: lang === 'en' ? "PRINT RECEIPT / PDF" : "MAKBUZU YAZDIR / PDF"
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserBookings(session.user.email);
      }
    });
  }, []);

  const fetchUserBookings = async (email: string | undefined) => {
    if (!email) return;
    setLoadingBookings(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false });
      
    if (!error && data) setBookings(data);
    setLoadingBookings(false);
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth?mode=update-password`,
    });
    if (error) alert(error.message);
    else alert(lang === 'en' ? "Password reset link sent to your email!" : "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 relative z-10 flex flex-col lg:flex-row gap-8">
      
      <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-1/3 space-y-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-luxury-dark/5 border border-gray-100 p-8 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={80} className="text-gold" />
          </div>
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-24 h-24 bg-luxury-dark rounded-full flex items-center justify-center text-gold text-3xl font-black mb-4 border-4 border-cream shadow-2xl">
              {user.user_metadata?.first_name?.charAt(0)}{user.user_metadata?.last_name?.charAt(0)}
            </div>
            <h2 className="text-2xl font-black text-luxury-dark uppercase tracking-tight italic">
              {user.user_metadata?.first_name} <span className="text-gold">{user.user_metadata?.last_name}</span>
            </h2>
            <div className="mt-3 flex items-center gap-2 bg-gold/10 px-4 py-1.5 rounded-full">
              <ShieldCheck size={14} className="text-gold" />
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">XREM VIP PRESTIGE</span>
            </div>
          </div>

          <div className="mt-10 space-y-1.5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-4">{tStrings.accControl}</p>
            <button className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-cream text-luxury-dark font-black text-[11px] uppercase tracking-widest hover:bg-gold/10 transition-all group">
              <span className="flex items-center gap-4"><LayoutDashboard size={18} className="text-gold" /> {tStrings.dashboard}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 transition-all">
              <LogOut size={18} /> {tStrings.logout}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><BellRing size={14} className="text-gold"/> {tStrings.sysNotification}</p>
           <p className="text-xs text-gray-500 leading-relaxed font-medium">{tStrings.notificationText}</p>
        </div>
      </motion.aside>

      <motion.main initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-8">
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
           {[
             { label: tStrings.totalTransfer, value: bookings.length, icon: Car },
             { label: tStrings.pendingTicket, value: bookings.filter(b => b.status === 'BEKLEMEDE' || b.status === 'PENDING').length, icon: Ticket },
             { label: tStrings.activePnr, value: bookings[0]?.pnr || '---', icon: CreditCard }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">{stat.label}</span><span className="text-2xl font-black text-luxury-dark">{stat.value}</span></div>
                <div className="bg-cream p-3 rounded-2xl text-gold"><stat.icon size={20} /></div>
             </div>
           ))}
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-xl shadow-luxury-dark/5 border border-gray-100 p-8 md:p-12">
          <div className="flex items-center justify-between border-b border-gray-50 pb-8 mb-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-luxury-dark uppercase italic tracking-tighter">{tStrings.profileTitle} <span className="text-gold">{tStrings.profileSubtitle}</span></h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{tStrings.profileDesc}</p>
            </div>
            <button className="bg-gold/10 hover:bg-gold text-gold hover:text-white p-3 rounded-2xl transition-all shadow-sm">
              <Settings size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[
               { label: tStrings.nameLabel, value: `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim(), icon: User },
               { label: tStrings.idLabel, value: user.user_metadata?.identity_no ? `********${user.user_metadata?.identity_no.slice(-3)}` : "---", icon: Fingerprint },
               { label: tStrings.phoneLabel, value: user.user_metadata?.phone || "---", icon: Phone },
               { label: tStrings.emailLabel, value: user.email, icon: Mail }
             ].map((item, i) => (
               <div key={i} className="group flex flex-col gap-2">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">{item.label}</span>
                 <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-5 rounded-2xl group-hover:border-gold transition-all group-hover:bg-white shadow-inner group-hover:shadow-none">
                    <item.icon size={18} className="text-gold opacity-50 group-hover:opacity-100 transition-all" />
                    <span className="text-[13px] font-black text-luxury-dark uppercase">{item.value}</span>
                 </div>
               </div>
             ))}
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-4 pt-8 border-t border-gray-50">
             <button onClick={handleResetPassword} disabled={loading} className="flex-1 bg-luxury-dark text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-3">
               <KeyRound size={18} /> {loading ? "..." : tStrings.resetPass}
             </button>
             <button className="flex-1 bg-white border-2 border-luxury-dark text-luxury-dark font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-luxury-dark hover:text-white transition-all flex items-center justify-center gap-3">
               <Settings2 size={18} /> {tStrings.editInfo}
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-xl shadow-luxury-dark/5 border border-gray-100 p-8 md:p-12">
           <div className="flex items-center gap-3 mb-10 border-b border-gray-50 pb-8">
             <Ticket size={28} className="text-gold" />
             <h3 className="text-2xl md:text-3xl font-black text-luxury-dark uppercase italic tracking-tighter">{tStrings.myTickets} <span className="text-gold">{tStrings.receipts}</span></h3>
           </div>

           {loadingBookings ? (
             <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-t-gold animate-spin rounded-full"></div></div>
           ) : bookings.length > 0 ? (
             <div className="space-y-4">
                {bookings.map((booking, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white hover:border-gold transition-all shadow-sm">
                    <div className="flex-1 w-full space-y-4">
                       <div className="flex items-center gap-4">
                         <span className="text-luxury-dark font-black tracking-widest text-lg px-4 py-1 bg-white rounded-xl border border-gray-200">{booking.pnr}</span>
                         <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase border border-emerald-100">{booking.status}</span>
                       </div>
                       <div className="flex items-center gap-6 text-[11px] font-black text-gray-500 uppercase">
                         <span className="flex items-center gap-2"><MapPin size={14} className="text-gold"/> {booking.pickup} ➔ {booking.dropoff}</span>
                         <span className="flex items-center gap-2"><Calendar size={14} className="text-gold"/> {booking.transfer_date}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 border-l border-gray-200 pl-6">
                       <div className="text-right"><span className="text-[9px] font-black text-gray-400 block uppercase">{tStrings.amount}</span><span className="text-2xl font-black text-gold italic">{booking.total_price}</span></div>
                       <button onClick={() => setSelectedBooking(booking)} className="bg-luxury-dark text-white p-4 rounded-2xl hover:bg-gold hover:text-black transition-all shadow-lg"><ChevronRight size={20} /></button>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <Ticket size={48} className="text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">{tStrings.noTicket}</p>
             </div>
           )}
        </div>
      </motion.main>

      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)} className="absolute inset-0 bg-luxury-dark/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden relative z-10 shadow-2xl">
               <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <div><h3 className="text-2xl font-black text-luxury-dark uppercase italic">{tStrings.ticketDetail} <span className="text-gold">{tStrings.detailWord}</span></h3><p className="text-[10px] font-black text-gray-400 uppercase mt-1">PNR: {selectedBooking.pnr}</p></div>
                 <button onClick={() => setSelectedBooking(null)} className="p-2 bg-white text-luxury-dark hover:text-red-500 rounded-full transition-colors shadow-sm"><X size={24} /></button>
               </div>
               <div className="p-10 space-y-8">
                 <div className="space-y-4">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{tStrings.routeLabel}</span>
                    <div className="flex items-center gap-4 bg-cream p-6 rounded-2xl border border-cream-dark">
                      <div className="flex flex-col items-center gap-1"><MapPin size={20} className="text-gold"/><div className="w-[2px] h-12 bg-gold/20"/><Flag size={20} className="text-gold"/></div>
                      <div className="flex-1 space-y-8"><span className="block text-sm font-black text-luxury-dark uppercase">{selectedBooking.pickup}</span><span className="block text-sm font-black text-luxury-dark uppercase">{selectedBooking.dropoff}</span></div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl"><span className="text-[9px] font-black text-gray-400 block uppercase">{tStrings.dateLabel}</span><span className="text-sm font-bold text-luxury-dark">{selectedBooking.transfer_date} | {selectedBooking.transfer_time}</span></div>
                    <div className="bg-gray-50 p-4 rounded-2xl"><span className="text-[9px] font-black text-gray-400 block uppercase">{tStrings.carType}</span><span className="text-sm font-bold text-luxury-dark uppercase">{selectedBooking.vehicle}</span></div>
                 </div>
                 <button className="w-full bg-gold text-black font-black py-5 rounded-2xl uppercase text-[12px] tracking-widest hover:bg-luxury-dark hover:text-white transition-all flex items-center justify-center gap-2">
                   <Printer size={18} /> {tStrings.printBtn}
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />
      <div className="fixed inset-0 z-0 opacity-50">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-cream/90" />
      </div>
      <section className="flex-1 pt-40 pb-20 relative z-10">
        <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><div className="w-12 h-12 border-4 border-t-gold animate-spin rounded-full"></div></div>}>
          <ProfileContent />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}