"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Search, CheckCircle2, XCircle, MapPin, 
  Navigation as NavIcon, Calendar, RefreshCcw, Eye, 
  Archive, Users, FileText, Ticket, Car
} from "lucide-react";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRes, setSelectedRes] = useState<any | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    // 🚨 SADECE COMPLETED VE CANCELLED OLANLARI ÇEK
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .in("status", ["COMPLETED", "CANCELLED"])
      .order("transfer_date", { ascending: false });

    if (!error) setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const filteredLogs = logs.filter(log => 
    log.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.pnr_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center text-white">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">İŞLEM <span className="text-gray-500">LOGLARI</span></h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic opacity-60 flex items-center gap-2">
            <Archive size={12} /> Tamamlanan & İptal Edilen İşlemler
          </p>
        </div>
        <button onClick={fetchLogs} className="p-4 bg-white/5 rounded-2xl hover:text-white transition-all text-gray-500">
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input 
          type="text" 
          placeholder="PNR VEYA İSİM ARA..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase italic text-white outline-none focus:border-gray-400 transition-all"
        />
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl grayscale-[0.2]">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-gray-600 text-[8px] font-black uppercase tracking-[0.4em] italic">
                <th className="p-8">MÜŞTERİ / PNR</th>
                <th className="p-8">GÜZERGAH & TARİH</th>
                <th className="p-8">SONUÇ (STATUS)</th>
                <th className="p-8 text-right">ARŞİV DETAYI</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-bold italic uppercase text-gray-400">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10">Kayıtlar aranıyor...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10">Log kaydı bulunamadı.</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-all">
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-sm font-black italic">{log.full_name || "İSİMSİZ"}</span>
                        <span className="text-gray-600 text-[9px] mt-1 tracking-widest">{log.pnr_code || "PNR YOK"}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400">
                          {log.pickup?.split(',')[0] || "Bilinmiyor"} ➔ {log.dropoff?.split(',')[0] || "Bilinmiyor"}
                        </span>
                        <span className="text-gray-600 text-[8px]">{log.transfer_date} • {log.transfer_time}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-1.5 rounded-full border text-[7px] font-black flex items-center gap-1 w-fit ${
                        log.status === 'COMPLETED' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' :
                        'text-red-500 border-red-500/20 bg-red-500/5'
                      }`}>
                        {log.status === 'COMPLETED' ? <CheckCircle2 size={10}/> : <XCircle size={10}/>}
                        {log.status === 'COMPLETED' ? 'BAŞARIYLA TAMAMLANDI' : 'İPTAL EDİLDİ'}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <button 
                        onClick={() => setSelectedRes(log)} 
                        className="p-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white hover:text-black transition-all"
                        title="Arşiv Kartını Aç"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🧾 ARŞİV DETAY KARTI (MODAL) */}
      <AnimatePresence>
        {selectedRes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedRes(null)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-2xl bg-[#111] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic text-gray-400 tracking-tight">ARŞİV KAYDI</h3>
                  <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-black mt-1">PNR: {selectedRes.pnr_code || "YOK"}</p>
                </div>
                <button onClick={() => setSelectedRes(null)} className="p-2 bg-white/5 rounded-full hover:bg-red-500 hover:text-white transition-all text-gray-500">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300 uppercase text-[10px] font-black tracking-tight">
                <div className="space-y-6">
                  <div>
                    <span className="text-[8px] text-gray-600 block mb-1">MÜŞTERİ BİLGİLERİ</span>
                    <p className="text-sm italic text-gray-200">{selectedRes.full_name || "İSİMSİZ"}</p>
                    <p className="text-gray-500 mt-1">{selectedRes.phone || "---"}</p>
                    <p className="text-gray-500 lowercase tracking-normal font-bold mt-1">{selectedRes.email || "---"}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-600 block mb-1 flex items-center gap-1"><Car size={10}/> ARAÇ</span>
                    <p className="text-sm italic">{selectedRes.vehicle_model || "Bilinmiyor"}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-600 block mb-1 flex items-center gap-1"><Users size={10}/> YOLCU BİLGİSİ</span>
                    <p className="text-sm italic">{selectedRes.passengers || "Belirtilmedi"}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[8px] text-gray-600 block mb-1">TRANSFER ROTASI</span>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2 text-gray-400">
                        <MapPin size={12} className="mt-0.5 flex-shrink-0"/> 
                        <span className="leading-tight">{selectedRes.pickup || "Bilinmiyor"}</span>
                      </p>
                      <p className="flex items-start gap-2 text-gray-500">
                        <NavIcon size={12} className="mt-0.5 flex-shrink-0"/> 
                        <span className="leading-tight">{selectedRes.dropoff || "Bilinmiyor"}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-600 block mb-1">TARİH & SAAT</span>
                    <p className="text-sm italic">{selectedRes.transfer_date || "---"} | {selectedRes.transfer_time || "---"}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-600 block mb-1 flex items-center gap-1"><Ticket size={10}/> TAHSİLAT</span>
                    <p className="text-lg font-black italic">€{selectedRes.total_price || "0"}</p>
                  </div>
                </div>

                <div className="md:col-span-2 bg-black/50 p-4 rounded-xl border border-white/5">
                  <span className="text-[8px] text-gray-600 block mb-2 flex items-center gap-1"><FileText size={10}/> ARŞİVLENEN NOTLAR</span>
                  <p className="text-xs text-gray-500 italic normal-case leading-relaxed font-bold">
                    {selectedRes.notes ? selectedRes.notes : "Not bulunmuyor."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}