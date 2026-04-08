"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Ticket, Trash2, RefreshCcw, X, Percent, CheckCircle2, StopCircle } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: "", discount_rate: "", status: "active" });

  const fetchCoupons = async () => {
    setLoading(true);
    // created_at yerine ID'ye göre sıralayalım ki en yeni en üstte gelsin
    const { data, error } = await supabase.from("coupons").select("*").order("id", { ascending: false });
    if (!error) setCoupons(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discount_rate) return;

    const { error } = await supabase.from("coupons").insert([
      { 
        code: formData.code.toUpperCase().trim(), 
        discount_rate: Number(formData.discount_rate), 
        status: formData.status 
      }
    ]);

    if (error) {
      alert("Hata: " + error.message);
    } else {
      setIsModalOpen(false);
      setFormData({ code: "", discount_rate: "", status: "active" });
      await fetchCoupons(); // Listeyi anında tazele
    }
  };

  const deleteCoupon = async (id: number) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (!error) fetchCoupons();
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center text-white">
        <h1 className="text-4xl font-black italic uppercase italic">PROMO <span className="text-gold">KODLARI</span></h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-gold text-black px-6 py-3 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-white transition-all">
          <Plus size={16} /> YENİ KOD OLUŞTUR
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] relative group">
            <button onClick={() => deleteCoupon(c.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
            <Ticket className="text-gold mb-4" size={24} />
            <h3 className="text-2xl font-black text-white italic">{c.code}</h3>
            <p className="text-gold font-bold text-sm uppercase italic tracking-widest">%{c.discount_rate} İNDİRİM</p>
            <div className={`mt-4 inline-block px-3 py-1 rounded-full text-[8px] font-black ${c.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {c.status === 'active' ? "AKTİF" : "PASİF"}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-black italic text-white mb-8 uppercase">YENİ KAMPANYA</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input required type="text" placeholder="KOD (ÖRN: VIP20)" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold" />
              <input required type="number" placeholder="İNDİRİM %" value={formData.discount_rate} onChange={e => setFormData({...formData, discount_rate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold" />
              <button type="submit" className="w-full bg-gold text-black font-black py-4 rounded-xl uppercase italic tracking-widest">KUPONU MÜHÜRLER</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}