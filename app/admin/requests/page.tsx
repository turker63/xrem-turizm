"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Clock, CalendarDays, Users, 
  Phone, Mail, Trash2, CheckCircle, Search, 
  ChevronRight, LayoutDashboard, History, Bell
} from "lucide-react";

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"pending" | "completed">("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const markAsReached = async (id: number) => {
    const { error } = await supabase
      .from("service_requests")
      .update({ status: 'completed' })
      .eq('id', id);
    
    if (!error) fetchRequests();
  };

  const deleteRequest = async (id: number) => {
    if (!confirm("Bu kaydı kalıcı olarak silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("service_requests").delete().eq("id", id);
    if (!error) fetchRequests();
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = req.status === view;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#f8f5f0] flex flex-col lg:flex-row">
      
      {/* 🏎️ VIP ADMIN SIDEBAR (SOL PANEL) */}
      <aside className="w-full lg:w-72 bg-[#1a1a1a] text-white p-8 flex flex-col gap-10 lg:min-h-screen">
        <div className="flex items-center gap-3 text-gold">
          <LayoutDashboard size={28} />
          <span className="font-black italic tracking-tighter text-2xl uppercase">Xrem Panel</span>
        </div>
        
        <nav className="flex flex-col gap-3">
          <button 
            onClick={() => setView("pending")}
            className={`flex items-center justify-between p-4 rounded-2xl transition-all font-black text-[10px] tracking-widest uppercase border ${view === "pending" ? "bg-gold text-[#1a1a1a] border-gold shadow-lg shadow-gold/20" : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"}`}
          >
            <div className="flex items-center gap-3">
              <Bell size={18} /> Aktif Talepler
            </div>
            <span className="bg-[#1a1a1a]/20 px-2 py-0.5 rounded-md text-[8px]">
              {requests.filter(r => r.status === 'pending').length}
            </span>
          </button>

          <button 
            onClick={() => setView("completed")}
            className={`flex items-center justify-between p-4 rounded-2xl transition-all font-black text-[10px] tracking-widest uppercase border ${view === "completed" ? "bg-gold text-[#1a1a1a] border-gold shadow-lg shadow-gold/20" : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"}`}
          >
            <div className="flex items-center gap-3">
              <History size={18} /> Arşiv / Loglar
            </div>
          </button>
        </nav>
      </aside>

      {/* 📜 ANA İÇERİK ALANI */}
      <section className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#1a1a1a]">
              {view === "pending" ? "BEKLEYEN" : "TAMAMLANAN"} <span className="text-gold">TALEPLER</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
              Xrem Transfer Dijital Lojistik Ağı
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="MÜŞTERİ VEYA HİZMET ARA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 px-12 py-4.5 rounded-2xl text-[10px] font-black outline-none focus:border-gold transition-all shadow-sm"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((req) => (
                <motion.div 
                  key={req.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`bg-white border p-6 md:p-8 rounded-[2.5rem] shadow-sm transition-all group ${req.status === 'completed' ? 'opacity-70 grayscale-[0.5]' : 'hover:shadow-xl hover:border-gold/20'}`}
                >
                  <div className="flex flex-col xl:flex-row justify-between gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-gold text-[#1a1a1a] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                          {req.service_type}
                        </span>
                        {req.status === 'completed' && (
                          <span className="bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle size={10} /> TAMAMLANDI
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black italic uppercase text-[#1a1a1a] tracking-tight">{req.customer_name}</h3>
                      <div className="flex flex-wrap gap-6 text-gray-500 font-bold text-sm">
                        <a href={`tel:${req.customer_phone}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                          <Phone size={16} /> {req.customer_phone}
                        </a>
                        <div className="flex items-center gap-2">
                          <Mail size={16} /> {req.customer_email || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="xl:w-80 bg-[#fcf9f5] rounded-3xl p-6 grid grid-cols-2 gap-4 border border-gray-50">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tarih / Saat</span>
                        <div className="text-[#1a1a1a] font-black text-[11px] uppercase flex items-center gap-2">
                          <CalendarDays size={14} className="text-gold" /> {req.requested_date} | {req.requested_time}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Yolcu</span>
                        <div className="text-[#1a1a1a] font-black text-[11px] uppercase flex items-center gap-2 justify-end">
                          <Users size={14} className="text-gold" /> {req.passenger_count}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => deleteRequest(req.id)}
                        className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Kalıcı Olarak Sil"
                      >
                        <Trash2 size={22} />
                      </button>
                      
                      {req.status === 'pending' && (
                        <button 
                          onClick={() => markAsReached(req.id)}
                          className="bg-[#1a1a1a] hover:bg-gold text-white px-8 h-14 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-3"
                        >
                          ULAŞILDI <CheckCircle size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                      <ChevronRight size={14} className="text-gold" /> Özel Operasyon Notları
                    </p>
                    <div className="text-sm font-bold text-[#1a1a1a] italic bg-[#fcf9f5] p-5 rounded-2xl border border-gray-50">
                      {req.details || "Not belirtilmemiş."}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredRequests.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Henüz bu kategoride kayıt bulunmuyor.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>
    </main>
  );
}