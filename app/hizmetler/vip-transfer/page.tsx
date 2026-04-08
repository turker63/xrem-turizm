"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/context/LanguageContext";
import { Clock, CheckCircle2, Send, CalendarDays, Users, Timer, ChevronRight, Plus, Minus, Star, Plane, Wifi, Coffee } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function VipTransferPage() {
  const { lang } = useLanguage();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    details: ""
  });
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const passengerRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const tStrings = {
    badge: lang === 'en' ? "Professional Transport" : "Profesyonel Taşıma",
    title1: lang === 'en' ? "ANTALYA AIRPORT" : "ANTALYA HAVALİMANI",
    title2: lang === 'en' ? "VIP TRANSFER" : "VIP TRANSFER",
    heading: lang === 'en' ? "Service Details" : "Hizmet Detayları",
    para1: lang === 'en'
      ? "As Antalya airport transfer experts, we serve many domestic and foreign guests. We offer comfortable, high-quality, and affordable transportation with vehicles selected according to the number of people. Whether you are alone, a small family, or a large group of friends, we are at your service with Mercedes VIP Vito (1-6 pax) and Mercedes VIP Sprinter (1-13 pax). Our vehicles feature leather seats, TV, and WiFi upon request."
      : "Antalya havalimanı transfer firması olarak yerli ve yabancı birçok misafire hizmet vermekteyiz. Kişi sayısına göre tercih edilen araçlar ile tüm misafirlerimize konforlu, kaliteli ve uygun fiyat ulaşım hizmeti sunmaktayız. 1-6 kişilik Mercedes VIP Vito ve 1-13 kişilik Mercedes VIP Sprinter araçlarımız ile deri koltuklu, televizyonlu ve wifi bulunan donanımlarla hizmetinizdeyiz.",
    para2: lang === 'en'
      ? "To ensure no issues during hot weather, all vehicle AC and engine maintenance is routinely performed. We provide in-car refrigerators and bottled water. We greet you at the airport and provide VIP transfer to your address without waiting. You can reach us 24/7 via WhatsApp, Viber, or Email. Our service is private; no 3rd parties will disturb you during your journey."
      : "Sıcak havalarda sorun yaşamamanız için tüm araçların rutin klima ve motor bakımları yapılmaktadır. Araç içi buzdolabı ve su hizmetimiz mutlaka bulunmaktadır. Sizleri havalimanında karşılıyor ve bekletmeden VIP transfer hizmeti sunuyoruz. 7/24 WhatsApp, Viber veya e-posta üzerinden bize ulaşabilirsiniz. Yolculuk boyunca araçta yalnızca siz ve sevdikleriniz bulunur.",
    para3: lang === 'en'
      ? "Whether for holiday, business, or meetings, we will be waiting for you at Antalya Airport. Upon request, a baby seat is added to your vehicle so our little guests can complete their journey comfortably and safely. With small in-car treats, your journey starts with joy. Let your holiday begin the moment you enter the vehicle."
      : "Tatil, iş seyahati veya bir toplantı için uçak ile seyahat ettiğinizde her zaman Antalya havalimanında sizi bekliyor olacağız. Bebek koltuğu talebiniz doğrultusunda aracınıza eklenir ve minik misafirlerimiz de konforlu bir şekilde yolculuklarını tamamlarlar. Tatiliniz araçtayken başlasın.",
    formTitle: lang === 'en' ? "CONTACT US!" : "BİZİMLE İLETİŞİME GEÇİN!",
    formDesc: lang === 'en' ? "To get a reservation and detailed information, please fill out the form below! We will call you as soon as possible." : "Rezervasyon ve detaylı bilgi almak için Lütfen aşağıdaki formu doldurarak bizimle iletişime geçin! En kısa sürede sizi arayalım.",
    phName: lang === 'en' ? "Your Full Name" : "Adınız Soyadınız",
    phPhone: lang === 'en' ? "Your Phone Number" : "Telefon Numaranız",
    phEmail: lang === 'en' ? "Your Email Address" : "E-posta Adresiniz",
    paxLabel: lang === 'en' ? "PASSENGER COUNT" : "YOLCU SAYISI",
    paxValue: lang === 'en' ? `${adults} Adult, ${children} Child` : `${adults} Yetişkin, ${children} Çocuk`,
    adult: lang === 'en' ? "Adult" : "Yetişkin",
    child: lang === 'en' ? "Child (2-12 years)" : "Çocuk (2-12 yaş)",
    details: lang === 'en' ? "Pickup-Dropoff point and Special Requests..." : "Alış-Varış Noktası ve Özel Talepleriniz...",
    btnSend: lang === 'en' ? "SEND" : "GÖNDER",
    btnSending: lang === 'en' ? "SENDING..." : "GÖNDERİLİYOR...",
    successMsg: lang === 'en' ? "Your request has been sent successfully. Thank you for contacting us. We will call you shortly." : "Talebiniz başarıyla Gönderildi. Bizimle iletişime geçtiğiniz için Teşekkür ederiz. Mümkün olan en kısa sürede sizi arayacağız."
  };

  const highlights = [
    { title: lang === 'en' ? "Wide Fleet" : "Geniş Filo", desc: lang === 'en' ? "Vito & Sprinter options" : "Vito & Sprinter seçenekleri", icon: Plane },
    { title: lang === 'en' ? "VIP Comfort" : "VIP Konfor", desc: lang === 'en' ? "TV, WiFi and Fridge" : "TV, WiFi ve Buzdolabı", icon: Wifi },
    { title: lang === 'en' ? "24/7 Support" : "7/24 Destek", desc: lang === 'en' ? "WhatsApp & Viber line" : "WhatsApp & Viber hattı", icon: Clock },
    { title: lang === 'en' ? "Child Friendly" : "Çocuk Dostu", desc: lang === 'en' ? "Free baby seat" : "Ücretsiz bebek koltuğu", icon: Star },
    { title: lang === 'en' ? "Special Treats" : "Özel İkram", desc: lang === 'en' ? "Cold water and snacks" : "Soğuk su ve atıştırmalık", icon: Coffee },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setShowPassengerDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const passengerCountText = `${adults} ${lang === 'en' ? 'Adult' : 'Yetişkin'}, ${children} ${lang === 'en' ? 'Child' : 'Çocuk'}`;

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([
          {
            service_type: 'VIP Transfer',
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_email: formData.email,
            requested_date: formData.date,
            requested_time: formData.time,
            passenger_count: passengerCountText,
            details: formData.details
          }
        ]);

      if (error) throw error;
      
      setSubmitStatus("success");
      setFormData({ name: "", phone: "", email: "", date: "", time: "", details: "" });
      setAdults(1);
      setChildren(0);
      
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 12);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <img 
          src="/how-it-works/hizli-rezervasyon.jpeg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/80 to-cream/95 backdrop-blur-[1px]" />
      </div>

      <section className="relative pt-44 pb-16 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/60 border border-white rounded-[2rem] flex items-center justify-center text-gold mx-auto mb-6 shadow-lg">
              <Star size={32} />
            </div>
            <span className="text-[10px] font-black text-gold tracking-[0.5em] uppercase mb-4 block italic">{tStrings.badge}</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1a1a1a] italic leading-tight mb-6">
              {tStrings.title1} <br /> <span className="text-gold">{tStrings.title2}</span>
            </h1>
            <div className="h-1.5 w-24 bg-gold mx-auto rounded-full shadow-lg" />
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 xl:col-span-8 space-y-12">
              <div className="bg-white/40 backdrop-blur-md border border-white p-8 md:p-14 rounded-[3.5rem] shadow-xl">
                <h2 className="text-2xl font-black italic uppercase text-[#1a1a1a] mb-8 tracking-tighter">{tStrings.heading}</h2>
                <div className="space-y-6 text-[#1a1a1a] font-bold text-sm md:text-base leading-relaxed opacity-80 text-justify">
                  <p>{tStrings.para1}</p>
                  <p>{tStrings.para2}</p>
                  <p>{tStrings.para3}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {highlights.map((item, idx) => (
                  <div key={idx} className="bg-white/40 backdrop-blur-sm border border-white p-6 rounded-[2rem] text-center flex flex-col items-center gap-3 shadow-md hover:border-gold transition-all duration-300 group">
                    <item.icon size={24} className="text-gold group-hover:scale-110 transition-transform" />
                    <div>
                      <h5 className="text-sm font-black italic uppercase text-[#1a1a1a] tracking-tight leading-none">{item.title}</h5>
                      <p className="text-[9px] font-bold uppercase text-gray-500 tracking-wider mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 xl:col-span-4 space-y-8 lg:sticky lg:top-32">
              <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <h4 className="text-[#1a1a1a] font-black text-2xl uppercase italic tracking-tighter mb-2 text-center">{tStrings.formTitle}</h4>
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-8 leading-relaxed text-center opacity-80">
                  {tStrings.formDesc}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder={tStrings.phName} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner" />
                  <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder={tStrings.phPhone} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder={tStrings.phEmail} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group/field bg-cream border border-cream rounded-2xl transition-all focus-within:border-gold shadow-inner overflow-hidden">
                      <CalendarDays size={18} className="absolute inset-y-0 left-4 flex items-center text-gray-400" />
                      <input type="date" name="date" required min={today} value={formData.date} onChange={handleChange} className="w-full bg-transparent outline-none pl-12 pr-3 py-4.5 text-[10px] font-black text-[#1a1a1a] uppercase cursor-pointer" />
                    </div>
                    <div className="relative group/field bg-cream border border-cream rounded-2xl transition-all focus-within:border-gold shadow-inner overflow-hidden">
                      <Timer size={18} className="absolute inset-y-0 left-4 flex items-center text-gray-400" />
                      <input type="time" name="time" required value={formData.time} onChange={handleChange} className="w-full bg-transparent outline-none pl-12 pr-3 py-4.5 text-[10px] font-black text-[#1a1a1a] cursor-pointer" />
                    </div>
                  </div>

                  <div className="relative group/field bg-cream border border-cream rounded-2xl transition-all focus-within:border-gold shadow-inner" ref={passengerRef}>
                    <button type="button" onClick={() => setShowPassengerDropdown(!showPassengerDropdown)} className="w-full flex items-center gap-4 pl-5 pr-5 py-4.5">
                      <Users size={18} className="text-gray-400" />
                      <div className="flex-1 text-left">
                        <span className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-wider block">{tStrings.paxLabel}</span>
                        <span className="text-[11px] font-bold text-gray-600 block leading-tight mt-0.5">{tStrings.paxValue}</span>
                      </div>
                      <ChevronRight size={16} className={`text-gold transition-transform duration-300 ${showPassengerDropdown ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showPassengerDropdown && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white rounded-[2rem] p-6 shadow-2xl z-50 space-y-5">
                          <PassengerCounter title={tStrings.adult} value={adults} setValue={setAdults} min={1} />
                          <div className="h-px bg-cream" />
                          <PassengerCounter title={tStrings.child} value={children} setValue={setChildren} min={0} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <textarea name="details" required rows={3} value={formData.details} onChange={handleChange} placeholder={tStrings.details} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner resize-none" />
                  
                  <button type="submit" disabled={isSubmitting} className="bg-[#1a1a1a] hover:bg-gold text-white px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 w-full disabled:opacity-70">
                    {isSubmitting ? tStrings.btnSending : <>{tStrings.btnSend} <Send size={16} /></>}
                  </button>

                  <AnimatePresence mode="wait">
                    {submitStatus === "success" && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-500/10 border border-green-500/20 text-green-700 text-[10px] font-black uppercase p-4 rounded-2xl text-center">
                        {tStrings.successMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.aside>

          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}

function PassengerCounter({ title, value, setValue, min }: { title: string, value: number, setValue: (val: number) => void, min: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-black uppercase text-[#1a1a1a] tracking-wider">{title}</span>
      <div className="flex items-center gap-4 bg-cream p-1.5 rounded-full border border-cream-dark shadow-inner">
        <button type="button" onClick={() => setValue(Math.max(min, value - 1))} className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-gold transition-all border border-cream shadow-sm disabled:opacity-50" disabled={value <= min}><Minus size={14} strokeWidth={3} /></button>
        <span className="text-sm font-black text-[#1a1a1a] w-6 text-center">{value}</span>
        <button type="button" onClick={() => setValue(value + 1)} className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-gold transition-all border border-cream shadow-sm"><Plus size={14} strokeWidth={3} /></button>
      </div>
    </div>
  );
}