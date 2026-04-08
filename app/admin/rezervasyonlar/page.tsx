"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Search, CheckCircle2, XCircle, MapPin, 
  Navigation as NavIcon, 
  Calendar, RefreshCcw, Phone, Trash2, MessageCircle, Check, Eye, Users, FileText, Ticket, Car, UserCheck
} from "lucide-react";

export default function AdminReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]); // 🏎️ Şoförler Listesi
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRes, setSelectedRes] = useState<any | null>(null);

  // 🔄 VERİLERİ ÇEK
  const fetchData = async () => {
    setLoading(true);
    
    // A. Rezervasyonları Getir
    const { data: resData } = await supabase
      .from("reservations")
      .select("*")
      .order("transfer_date", { ascending: false });

    // B. Şoförleri Getir
    const { data: driversData } = await supabase
      .from("drivers")
      .select("*")
      .order("full_name", { ascending: true });

    if (resData) setReservations(resData);
    if (driversData) setDrivers(driversData);
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // 🏎️ ŞOFÖR ATAMA FONKSİYONU
  const handleAssignDriver = async (resId: string, driverName: string) => {
    const { error } = await supabase
      .from("reservations")
      .update({ assigned_driver: driverName })
      .eq("id", resId);

    if (!error) {
      // Listeyi lokalde güncelle (Anlık tepki için)
      setReservations(prev => prev.map(item => 
        item.id === resId ? { ...item, assigned_driver: driverName } : item
      ));
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("reservations")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (!error) fetchData();
  };

  const filteredData = reservations.filter(res => 
    res.status !== 'COMPLETED' && res.status !== 'CANCELLED' && 
    (res.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     res.pnr_code?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center text-white">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">OPERASYON <span className="text-gold">DENETİMİ</span></h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic opacity-60">Filo ve Rezervasyon Yönetimi</p>
        </div>
        <button onClick={fetchData} className="p-4 bg-white/5 rounded-2xl hover:text-gold transition-all">
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input 
          type="text" 
          placeholder="İSİM VEYA PNR ARA..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase italic text-white outline-none focus:border-gold/40 transition-all"
        />
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-gray-600 text-[8px] font-black uppercase tracking-[0.4em] italic">
                <th className="p-8">MÜŞTERİ</th>
                <th className="p-8">GÜZERGAH</th>
                <th className="p-8">KAPTAN ATAMASI</th> {/* 🏎️ YENİ SÜTUN */}
                <th className="p-8">DURUM</th>
                <th className="p-8 text-right">İŞLEM</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-bold italic uppercase text-white">
              {filteredData.map((res) => (
                <tr 
                  key={res.id} 
                  className={`border-b border-white/[0.02] transition-all group ${
                    res.status === 'COMPLETED' ? 'opacity-40 grayscale-[0.5]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-black italic">{res.full_name || "İSİMSİZ"}</span>
                      <span className="text-gray-500 text-[9px] mt-1">{res.phone || "TELEFON YOK"}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-white">
                        {res.pickup || res.pickup_location?.split(',')[0] || "BELİRTİLMEDİ"} ➔ {res.dropoff || res.dropoff_location?.split(',')[0] || "BELİRTİLMEDİ"}
                      </span>
                      <span className="text-gray-600 text-[8px]">{res.transfer_date} • {res.transfer_time}</span>
                    </div>
                  </td>

                  {/* 🏎️ KAPTAN SEÇİM KUTUSU */}
                  <td className="p-8">
                    <div className="relative max-w-[160px]">
                      <select 
                        value={res.assigned_driver || ""} 
                        onChange={(e) => handleAssignDriver(res.id, e.target.value)}
                        className={`w-full bg-black/40 border p-3 pr-8 rounded-xl outline-none focus:border-gold transition-all text-[9px] font-black cursor-pointer appearance-none ${
                          res.assigned_driver ? "border-gold/30 text-gold" : "border-white/10 text-gray-600"
                        }`}
                      >
                        <option value="">KAPTAN SEÇİLMEDİ</option>
                        {drivers.map(d => (
                          <option key={d.id} value={d.full_name} className="bg-[#050505] text-white">
                            {d.full_name} ({d.license_plate})
                          </option>
                        ))}
                      </select>
                      <UserCheck size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
                    </div>
                  </td>

                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full border text-[7px] font-black ${
                      res.status === 'COMPLETED' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' :
                      res.status === 'PAID' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 
                      'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'
                    }`}>
                      {res.status === 'COMPLETED' ? 'TAMAMLANDI' : 
                       res.status === 'PAID' ? 'ÖDENDİ / ONAYLI' : 'BEKLİYOR'}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => setSelectedRes(res)} className="p-3 bg-white/5 text-white rounded-xl hover:bg-gold hover:text-black transition-all" title="Detayları Gör"><Eye size={16} /></button>
                       <a href={`https://wa.me/${res.phone}`} target="_blank" className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"><MessageCircle size={16} /></a>
                       {res.status !== 'COMPLETED' && (
                         <button onClick={() => updateStatus(res.id, 'COMPLETED')} className="p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Check size={16} /></button>
                       )}
                       <button onClick={() => updateStatus(res.id, 'CANCELLED')} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAY MODALI (GÜNCELLENMİŞ) */}
      <AnimatePresence>
        {selectedRes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRes(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden" >
              <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic text-gold tracking-tight">Rezervasyon Detayı</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mt-1">PNR: {selectedRes.pnr_code || "YOK"}</p>
                </div>
                <button onClick={() => setSelectedRes(null)} className="p-2 bg-white/5 rounded-full hover:bg-red-500 hover:text-white transition-all text-gray-400"><XCircle size={24} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white uppercase text-[10px] font-black tracking-tight">
                <div className="space-y-6">
                  <div><span className="text-[8px] text-gray-500 block mb-1">MÜŞTERİ BİLGİLERİ</span><p className="text-sm italic">{selectedRes.full_name || "İSİMSİZ"}</p><p className="text-gray-400 mt-1">{selectedRes.phone || "---"}</p></div>
                  <div><span className="text-[8px] text-gray-500 block mb-1 flex items-center gap-1"><Car size={10}/> SEÇİLEN ARAÇ</span><p className="text-sm italic text-gold">{selectedRes.vehicle_model || "VIP Transfer Aracı"}</p></div>
                  
                  {/* 🏎️ MODAL İÇİNDE KAPTAN BİLGİSİ */}
                  <div>
                    <span className="text-[8px] text-gray-500 block mb-1 flex items-center gap-1"><UserCheck size={10}/> ATANAN KAPTAN</span>
                    <p className="text-sm italic text-blue-400">{selectedRes.assigned_driver || "HENÜZ ATAMA YAPILMADI"}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[8px] text-gray-500 block mb-1">TRANSFER ROTASI</span>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2"><MapPin size={12} className="text-gold mt-0.5 flex-shrink-0"/><span className="leading-tight">{selectedRes.pickup || selectedRes.pickup_location || "Bilinmiyor"}</span></p>
                      <p className="flex items-start gap-2"><NavIcon size={12} className="text-gray-500 mt-0.5 flex-shrink-0"/><span className="leading-tight">{selectedRes.dropoff || selectedRes.dropoff_location || "Bilinmiyor"}</span></p>
                    </div>
                  </div>
                  <div><span className="text-[8px] text-gray-500 block mb-1">TARİH & SAAT</span><p className="text-sm italic">{selectedRes.transfer_date || "---"} | {selectedRes.transfer_time || "---"}</p></div>
                  <div><span className="text-[8px] text-gray-500 block mb-1 flex items-center gap-1"><Ticket size={10}/> FİYAT</span><p className="text-lg font-black italic">€{selectedRes.total_price || "0"}</p></div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}