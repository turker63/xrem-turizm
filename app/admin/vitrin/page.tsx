"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Star, ToggleLeft, ToggleRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminVitrinManagement() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .order("is_popular", { ascending: false })
      .order("name", { ascending: true });

    if (!error && data) {
      setRegions(data);
    }
    setLoading(false);
  };

  const togglePopularStatus = async (id: number, currentStatus: boolean) => {
    // Sadece 4 tane vitrin seçilebilir kuralı
    const popularCount = regions.filter(r => r.is_popular).length;
    if (!currentStatus && popularCount >= 4) {
      alert("Vitrine en fazla 4 bölge ekleyebilirsiniz. Lütfen önce başka bir bölgeyi vitrinden kaldırın.");
      return;
    }

    setUpdatingId(id);
    const newStatus = !currentStatus;

    const { error } = await supabase
      .from("regions")
      .update({ is_popular: newStatus })
      .eq("id", id);

    if (!error) {
      setRegions(regions.map(r => r.id === id ? { ...r, is_popular: newStatus } : r));
    } else {
      alert("Güncellenirken bir hata oluştu.");
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  const popularCount = regions.filter(r => r.is_popular).length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-luxury-dark uppercase tracking-tighter mb-2">Vitrin <span className="text-gold">Yönetimi</span></h1>
        <p className="text-gray-500 font-medium">Anasayfadaki "Popüler Rotalar" bölümünde görünecek 4 adet bölgeyi buradan seçebilirsiniz.</p>
        
        <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${popularCount === 4 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          <Star size={16} /> Vitrinde Seçili: {popularCount} / 4
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Görsel</th>
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Bölge Adı</th>
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Mesafe</th>
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Anasayfa Vitrini</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <motion.tr 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                key={region.id} 
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${region.is_popular ? 'bg-gold/5' : ''}`}
              >
                <td className="p-5">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-200">
                    <img src={region.img_url || "/how-it-works/hizli-rezervasyon.jpeg"} alt={region.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-5 font-black text-luxury-dark uppercase">{region.name}</td>
                <td className="p-5 font-bold text-gray-500">{region.dist || "-"}</td>
                <td className="p-5 text-right">
                  <button 
                    disabled={updatingId === region.id}
                    onClick={() => togglePopularStatus(region.id, region.is_popular)}
                    className="inline-flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {updatingId === region.id ? (
                      <Loader2 size={32} className="animate-spin text-gray-400" />
                    ) : region.is_popular ? (
                      <>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hidden md:inline">Yayında</span>
                        <ToggleRight size={36} className="text-emerald-500" />
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:inline">Gizli</span>
                        <ToggleLeft size={36} className="text-gray-300" />
                      </>
                    )}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {regions.length === 0 && (
          <div className="p-10 text-center flex flex-col items-center justify-center text-gray-400">
            <AlertCircle size={40} className="mb-4 opacity-50" />
            <p className="font-bold">Henüz hiç bölge eklenmemiş.</p>
          </div>
        )}
      </div>
    </div>
  );
}