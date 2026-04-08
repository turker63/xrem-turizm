"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Search, Mail, Phone, MessageCircle, Download, 
  TrendingUp, Award, Clock, Users, RefreshCcw, Ticket, Zap, XCircle, Send
} from "lucide-react";

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📊 ÖZET İSTATİSTİKLER İÇİN STATE
  const [stats, setStats] = useState({
    elite: 0,
    new: 0,
    active: 0
  });

  // 🎟️ VIP İNDİRİM KODU SİSTEMİ İÇİN STATE'LER
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [discountForm, setDiscountForm] = useState({ percent: 10, code: "" });
  const [isSending, setIsSending] = useState(false);

  const fetchAndProcessCustomers = async () => {
    setLoading(true);
    
    // 1. Tüm rezervasyonları çekiyoruz
    const { data: reservations, error } = await supabase
      .from("reservations")
      .select("*")
      .order("transfer_date", { ascending: false });

    if (error || !reservations) {
      setLoading(false);
      return;
    }

    // 2. VERİLERİ HARMANLAMA MOTORU (Aynı telefon numarasına veya maile göre birleştir)
    const customerMap = new Map();

    reservations.forEach((res) => {
      // 🚀 ZYNKA'NIN ZEKASI: İletişim bilgisi olmayanı bile isminden yakala!
      const key = res.phone || res.email || res.full_name;
      if (!key) return;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key, // Benzersiz key
          name: res.full_name || "İsimsiz Yolcu",
          email: res.email || "---",
          phone: res.phone || "---",
          totalBookings: 1,
          totalSpent: parseFloat(res.total_price) || 0,
          lastTrip: res.transfer_date,
          rank: "Standard",
          status: res.status
        });
      } else {
        const existing = customerMap.get(key);
        existing.totalBookings += 1;
        existing.totalSpent += parseFloat(res.total_price) || 0;
      }
    });

    // 3. MAP'İ DİZİYE ÇEVİR VE RÜTBELERİ DAĞIT
    let eliteCount = 0;
    let newCount = 0; 
    let activeCount = 0;

    const processedCustomers = Array.from(customerMap.values()).map(customer => {
      // RÜTBE SİSTEMİ
      if (customer.totalBookings >= 10) {
        customer.rank = "Elite";
        eliteCount++;
      } else if (customer.totalBookings >= 3) {
        customer.rank = "VIP";
      }

      // AKTİF VE YENİ KONTROLÜ
      if (customer.status === "PAID") activeCount++;
      if (customer.totalBookings === 1) newCount++;

      return customer;
    });

    // Ciroya göre çoktan aza doğru sırala
    processedCustomers.sort((a, b) => b.totalSpent - a.totalSpent);

    setCustomers(processedCustomers);
    setStats({ elite: eliteCount, new: newCount, active: activeCount });
    setLoading(false);
  };

  useEffect(() => { fetchAndProcessCustomers(); }, []);

  // 📥 EXCEL İNDİRME MOTORU
  const downloadCSV = () => {
    const headers = ["Müşteri Adı", "Telefon", "E-posta", "Toplam Rezervasyon", "Toplam Harcama (Euro)", "Son İşlem", "Segment"];
    const csvContent = [
      headers.join(","),
      ...customers.map(c => `"${c.name}","${c.phone}","${c.email}","${c.totalBookings}","${c.totalSpent.toFixed(2)}","${c.lastTrip}","${c.rank}"`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `musteri_portfoyu_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 💎 VIP KOD OLUŞTURUCU AÇILIŞ (Müşterinin adına göre otomatik kod)
  const openDiscountModal = (customer: any) => {
    const firstName = customer.name.split(' ')[0].toUpperCase();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    // Elite üyelere %20, VIP'lere %15, diğerlerine %10 varsayılan öneri
    const defaultPercent = customer.rank === "Elite" ? 20 : customer.rank === "VIP" ? 15 : 10;
    
    setDiscountForm({ percent: defaultPercent, code: `VIP-${firstName}-${randomNum}` });
    setSelectedCustomer(customer);
  };

  // 🚀 KODU SİSTEME YAZ VE BİLDİRİM GÖNDER
  const handleSendDiscount = async () => {
  setIsSending(true);
  try {
    // 🚀 TABLO ADI: coupons | SÜTUN: discount_rate
    await supabase.from("coupons").insert({
      code: discountForm.code,
      discount_rate: discountForm.percent, // Senin tablanda rate olabilir
      usage_limit: 1, 
      used_count: 0,
      status: 'active' // is_active yerine status kullanıyoruz
    });

    // Bildirim kısmı aynı kalıyor...
    if (selectedCustomer.email && selectedCustomer.email !== "---") {
      await supabase.from("notifications").insert({
        user_email: selectedCustomer.email,
        title: "💎 VIP İndiriminiz Tanımlandı!",
        message: `Kodunuz: ${discountForm.code} (%${discountForm.percent} İndirim)`,
        is_read: false
      });
      alert("✅ Kod başarıyla gönderildi!");
    }
    setSelectedCustomer(null);
  } catch (error) {
    console.error(error);
    alert("Hata oluştu, tablo ismini kontrol edin.");
  } finally {
    setIsSending(false);
  }
};

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-12">
      {/* 🏎️ HEADER & ANALİTİK KONTROLLER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">MÜŞTERİ <span className="text-gold">PORTFÖYÜ</span></h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic opacity-60">Sadakat ve Veri Analiz Hattı</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button onClick={fetchAndProcessCustomers} className="p-3.5 bg-white/5 rounded-2xl hover:text-gold transition-all">
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-gold transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="MÜŞTERİ ADI VEYA TELEFON..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-[10px] font-black uppercase italic tracking-widest text-white outline-none focus:border-gold/40 w-72 transition-all"
            />
          </div>
          
          <button onClick={downloadCSV} className="bg-gold text-black px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
            <Download size={16} /> DIŞA AKTAR
          </button>
        </div>
      </header>

      {/* 📊 MÜŞTERİ SEGMENTASYONU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "ELITE ÜYELER", value: stats.elite, icon: <Award className="text-gold" />, desc: "10+ Rezervasyon" },
          { label: "TOPLAM MÜŞTERİ", value: customers.length, icon: <Users className="text-blue-500" />, desc: "Kayıtlı Havuz" },
          { label: "AKTİF BEKLEYENLER", value: stats.active, icon: <Clock className="text-green-500" />, desc: "Onaylı İşlemler" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-2xl text-gold group-hover:bg-gold group-hover:text-black transition-all">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{stat.desc}</span>
            </div>
            <p className="text-gray-500 text-[8px] font-black uppercase tracking-[0.3em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black italic uppercase text-white">{loading ? "..." : stat.value}</p>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gold/5 rounded-full blur-3xl" />
          </div>
        ))}
      </div>

      {/* 🏛️ MÜŞTERİ ARŞİV TABLOSU */}
      <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] overflow-hidden backdrop-blur-3xl relative">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-gray-600 text-[8px] font-black uppercase tracking-[0.4em] italic bg-white/[0.01]">
                <th className="py-8 px-8">MÜŞTERİ KİMLİĞİ</th>
                <th className="py-8 px-4">İLETİŞİM HATTI</th>
                <th className="py-8 px-4">RESERVASYON</th>
                <th className="py-8 px-4">LIFETIME VALUE</th>
                <th className="py-8 px-4">SEGMENT</th>
                <th className="py-8 px-8 text-right">İLETİŞİM</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-bold uppercase italic">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Müşteriler Yükleniyor...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Müşteri Bulunamadı.</td></tr>
              ) : (
                filteredCustomers.map((user, i) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-all"
                  >
                    <td className="py-8 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all font-black italic">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-[12px] font-black tracking-tighter italic">{user.name}</span>
                          <div className="flex items-center gap-1.5 text-gray-500 text-[8px] mt-1">
                            <Mail size={10} className="text-gold/40" /> <span className="lowercase font-bold tracking-normal">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-8 px-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone size={12} className="text-gold/40" />
                        <span className="tracking-widest">{user.phone}</span>
                      </div>
                    </td>

                    <td className="py-8 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-black">{user.totalBookings} SEFER</span>
                        <span className="text-gray-600 text-[8px]">SON: {user.lastTrip || "Bilinmiyor"}</span>
                      </div>
                    </td>

                    <td className="py-8 px-4">
                      <span className="text-[14px] font-black tracking-tighter text-gold">€{user.totalSpent.toFixed(2)}</span>
                    </td>

                    <td className="py-8 px-4">
                      <span className={`px-4 py-1.5 rounded-full text-[7px] font-black border tracking-[0.2em] ${
                        user.rank === "Elite" ? "bg-gold text-black border-gold shadow-[0_0_10px_rgba(255,215,0,0.3)]" :
                        user.rank === "VIP" ? "bg-white/10 text-white border-white/20" :
                        "bg-transparent text-gray-500 border-white/5"
                      }`}>
                        {user.rank}
                      </span>
                    </td>

                    <td className="py-8 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* 🎟️ VIP KOD TANIMLA BUTONU EKLENDİ */}
                        <button 
                          onClick={() => openDiscountModal(user)}
                          className="p-3 bg-gold/10 text-gold border border-gold/20 rounded-xl hover:bg-gold hover:text-black transition-all shadow-xl"
                          title="Özel İndirim Kodu Tanımla"
                        >
                          <Ticket size={16} />
                        </button>

                        <a 
                          href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-xl"
                          title="WhatsApp'tan Ulaş"
                        >
                          <MessageCircle size={16} />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🎟️ VIP İNDİRİM KODU OLUŞTURMA MODALI */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(212,175,55,0.1)] overflow-hidden">
              
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-black uppercase italic text-gold flex items-center gap-2"><Zap size={18}/> VIP Hediye Gönder</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">ALICI: {selectedCustomer.name}</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-gray-500 hover:text-red-500 transition-all"><XCircle size={24} /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2 block">İndirim Oranı (%)</label>
                  <input 
                    type="number" 
                    value={discountForm.percent} 
                    onChange={(e) => setDiscountForm({...discountForm, percent: Number(e.target.value)})}
                    className="w-full bg-white/[0.02] border border-white/10 text-white font-black text-xl px-4 py-3 rounded-xl outline-none focus:border-gold transition-all"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2 block">Üretilen Kod (Tek Kullanımlık)</label>
                  <input 
                    type="text" 
                    value={discountForm.code} 
                    onChange={(e) => setDiscountForm({...discountForm, code: e.target.value.toUpperCase()})}
                    className="w-full bg-gold/10 border border-gold/30 text-gold font-black italic text-xl px-4 py-3 rounded-xl outline-none text-center tracking-[0.2em]"
                  />
                </div>

                <button 
                  onClick={handleSendDiscount}
                  disabled={isSending}
                  className="w-full bg-gold text-black font-black uppercase italic tracking-widest py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  {isSending ? "GÖNDERİLİYOR..." : <><Send size={16} /> KODU TANIMLA & GÖNDER</>}
                </button>
              </div>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}