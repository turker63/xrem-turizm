"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Clock, CheckCircle2, Send, CalendarDays, Users, Timer, ChevronRight, Plus, Minus, Briefcase, Star, Map } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SoforluAracKiralamaPage() {
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

  const highlights = [
    { title: "Lüks Filo", desc: "Mercedes-Benz araçlar", icon: Star },
    { title: "7/24 Hizmet", desc: "Kesintisiz aktif lojistik", icon: Clock },
    { title: "Uzman Şoförler", desc: "Deneyimli ve belgeli", icon: CheckCircle2 },
    { title: "Esnek Rotalar", desc: "Size özel planlama", icon: Map },
    { title: "Tam Donanım", desc: "Masa, TV, internet", icon: Briefcase },
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

    const passengerCountText = `${adults} Yetişkin, ${children} Çocuk`;

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([
          {
            service_type: 'Şoförlü Araç Kiralama',
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

  const totalPassengers = adults + children;

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
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/60 border border-white rounded-[2rem] flex items-center justify-center text-gold mx-auto mb-6 shadow-lg">
              <Star size={32} />
            </div>
            <span className="text-[10px] font-black text-gold tracking-[0.5em] uppercase mb-4 block italic">VIP Solutions</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1a1a1a] italic leading-tight mb-6">
              ANTALYA ŞOFÖRLÜ <br /> <span className="text-gold">ARAÇ KİRALAMA</span>
            </h1>
            <div className="h-1.5 w-24 bg-gold mx-auto rounded-full shadow-lg" />
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 xl:col-span-8 space-y-12"
            >
              <div className="bg-white/40 backdrop-blur-md border border-white p-8 md:p-14 rounded-[3.5rem] shadow-xl">
                <h2 className="text-2xl font-black italic uppercase text-[#1a1a1a] mb-8 tracking-tighter">Hizmet Detayları</h2>
                
                <div className="space-y-6 text-[#1a1a1a] font-bold text-sm md:text-base leading-relaxed opacity-80 text-justify">
                  <p>
                    Konforlu ve keyifli bir tur, toplantı ulaşımı mı arıyorsunuz? Sizler için özel olarak planlanmış VIP araçlarımız ile ister kalabalık arkadaş gruplarınız için veya çekirdek aileniz ile yapacağınız keyifli Antalya şehir turu veya toplantı salonlarına yetişebilmeniz için sadece size özel VIP araçlarımız ile istediğiniz noktadan bir diğer konuma gitmenizi olabildiğince kolaylaştırıyor ve konforlu bir ortam sunuyoruz. Araç içi açılabilen masalar, televizyon bağlantısı Antalya şoförlü araç kiralama hizmetimiz ile sizlere 7/24 hizmet sunmaktayız. Araç filomuzdan dilediğiniz aracı seçerek, konserlere, etkinliklere, otelinize, Antalya şehirlerarası ulaşım hizmetimiz ile VIP araçlar ile özel transfer hizmetleri doğrultusunda gidebilirsiniz.
                  </p>
                  <p>
                    Özel günler için sunmuş olduğumuz Antalya şoförlü araç kiralama, Antalya transfer, Antalya Havalimanı ulaşım, servis hizmetimiz mevcuttur. Mercedes araç filomuz ile Antalya ve çevresini iyi bilen, tam donanımlı, müşteriye karşı nasıl davranılması gerektiğini bilen, hangi tip organizasyonlarda aracın ne tür ihtiyaçlarının karşılanması gerektiği bilgisine sahibiz. Tam donanımlı ve bilgili “şoför” personellerimiz bulunmaktadır. Düğün organizasyonları kapsamında, Antalya gelin arabası ve özel misafirlerinizin ya da davetlilerinizin düğün alanına ulaştırılması ya da düğün alanından evlerine kadar ulaştırılması hizmetimiz hem sizler için kolay misafirler ve davetliler için konforlu bir tercih olacaktır. Eğlence organizasyonu, düğün ya da konser gibi eğlence etkinliklerinde müzisyenlerin, müzisyen grup elemanlarının, müzisyen ekibinin malzemeleri ve özel eşyaları ile birlikte organizasyon alanına ulaştırılmaları, bu kategoride sunduğumuz hizmetlerimiz arasındadır. Farklı müşteri talepleri için farklı organizasyonlar doğrultusunda çok kişilik ya da az kişilik kapasitelere sahip farklı model araç seçeneklerimiz ile konforlu, sağlıklı, güvenli ve ekonomik bir ulaşım hizmeti vermekteyiz.
                  </p>
                  <p>
                    7 gün 24 saat sizler için Antalya Şoförlü Araç Kiralama sunduğumuz VIP araçlar ile özel transfer hizmetlerimiz, havalimanı veya otel transferleriniz için profesyonel çözümler üretiyoruz. Uzman ve deneyimli kadromuz, sizlerin ihtiyacını en iyi şekilde karşılamak için çalışmaktadır. Ulaşabileceğiz iletişim numaramız 7/24 aktif bir şekilde hizmet vermektedir. Dilerseniz mail olaraktan tarafımıza taleplerinizi iletebilirsiniz. Rezervasyon iptal veya değişikliği için hızlıca iletişime geçebilirsiniz. Antalya havalimanı transfer firması olarak sizlere Antalya havalimanı ve Antalya çevre illerine hizmet sunuyoruz.
                  </p>
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

            <motion.aside 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 xl:col-span-4 space-y-8 lg:sticky lg:top-32"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <h4 className="text-[#1a1a1a] font-black text-2xl uppercase italic tracking-tighter mb-2 text-center">BİZİMLE İLETİŞİME GEÇİN!</h4>
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-8 leading-relaxed text-center opacity-80">
                  Rezervasyon ve detaylı bilgi almak için Lütfen aşağıdaki formu doldurarak bizimle iletişime geçin! En kısa sürede sizi arayalım.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Adınız Soyadınız" 
                    className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner"
                  />
                  <input 
                    type="text" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Telefon Numaranız " 
                    className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner"
                  />
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-posta Adresiniz" 
                    className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group/field bg-cream border border-cream rounded-2xl transition-all focus-within:border-gold shadow-inner overflow-hidden">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <CalendarDays size={18} className="text-gray-400 group-focus-within/field:text-gold" />
                      </div>
                      <input 
                        type="date" 
                        name="date"
                        required
                        min={today}
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none pl-12 pr-3 py-4.5 text-[10px] font-black text-[#1a1a1a] uppercase cursor-pointer"
                      />
                    </div>
                    <div className="relative group/field bg-cream border border-cream rounded-2xl transition-all focus-within:border-gold shadow-inner overflow-hidden">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Timer size={18} className="text-gray-400 group-focus-within/field:text-gold" />
                      </div>
                      <input 
                        type="time" 
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none pl-12 pr-3 py-4.5 text-[10px] font-black text-[#1a1a1a] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="relative group/field bg-cream border border-cream rounded-2xl transition-all focus-within:border-gold shadow-inner" ref={passengerRef}>
                    <button
                      type="button"
                      onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                      className="w-full flex items-center gap-4 pl-5 pr-5 py-4.5"
                    >
                      <Users size={18} className="text-gray-400 group-focus-within/field:text-gold" />
                      <div className="flex-1 text-left">
                        <span className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-wider block">YOLCU SAYISI</span>
                        <span className="text-[11px] font-bold text-gray-600 block leading-tight mt-0.5">{adults} Yetişkin, {children} Çocuk</span>
                      </div>
                      <ChevronRight size={16} className={`text-gold transition-transform duration-300 ${showPassengerDropdown ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showPassengerDropdown && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white rounded-[2rem] p-6 shadow-2xl z-50 space-y-5"
                        >
                          <PassengerCounter title="Yetişkin" value={adults} setValue={setAdults} min={1} />
                          <div className="h-px bg-cream" />
                          <PassengerCounter title="Çocuk (2-12 yaş)" value={children} setValue={setChildren} min={0} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <textarea 
                    name="details"
                    required
                    rows={3}
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Güzergah ve Özel Talepleriniz..." 
                    className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner resize-none"
                  />
                  
                  <AnimatePresence mode="wait">
                    {submitStatus === "success" && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-500/10 border border-green-500/20 text-green-700 text-[10px] font-black uppercase p-4 rounded-2xl text-center">
                        Talebiniz başarıyla Gönderildi.
                        Bizimle iletişime geçtiğiniz için Teşekkür ederiz. Mümkün olan en kısa sürede sizi arayacağız.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#1a1a1a] hover:bg-gold text-white px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 w-full disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "GÖNDERİLİYOR..." : <> GÖNDER <Send size={16} /></>}
                  </button>
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
        <button 
          type="button" 
          onClick={() => setValue(Math.max(min, value - 1))}
          className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-gold transition-all border border-cream shadow-sm disabled:opacity-50"
          disabled={value <= min}
        >
          <Minus size={14} strokeWidth={3} />
        </button>
        <span className="text-sm font-black text-[#1a1a1a] w-6 text-center">{value}</span>
        <button 
          type="button" 
          onClick={() => setValue(value + 1)}
          className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-gold transition-all border border-cream shadow-sm disabled:opacity-50"
          disabled={value >= 12}
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}