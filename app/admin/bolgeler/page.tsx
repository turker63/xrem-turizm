"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit3, Trash2, RefreshCcw, MapPin, X, Upload, CheckCircle2 } from "lucide-react";

export default function AdminRegions() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<any>(null);
  
  // 📝 Yeni Araç Fiyat Sütunları Eklendi
  const [formData, setFormData] = useState({
    name: "",
    dist: " KM",
    price: "",           // Standart Vito
    price_ultra_vip: "", // Ultra VIP
    price_minivan: "",   // Minivan
    price_minibus: "",   // Minibüs
    img_url: ""
  });

  const fetchRegions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("regions").select("*").order("id", { ascending: true });
    if (!error) setRegions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRegions(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `regions/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('transfer-images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('transfer-images').getPublicUrl(filePath);
      setFormData({ ...formData, img_url: data.publicUrl });
      alert("Görsel Başarıyla Yüklendi!");
    } catch (error: any) {
      alert("Yükleme Hatası!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      dist: formData.dist,
      price: Number(formData.price),
      price_ultra_vip: Number(formData.price_ultra_vip),
      price_minivan: Number(formData.price_minivan),
      price_minibus: Number(formData.price_minibus),
      img_url: formData.img_url
    };

    if (editingRegion) {
      await supabase.from("regions").update(payload).eq("id", editingRegion.id);
    } else {
      await supabase.from("regions").insert([payload]);
    }

    setIsModalOpen(false);
    resetForm();
    fetchRegions();
  };

  const resetForm = () => {
    setFormData({ 
      name: "", 
      dist: " KM", 
      price: "", 
      price_ultra_vip: "", 
      price_minivan: "", 
      price_minibus: "", 
      img_url: "" 
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    await supabase.from("regions").delete().eq("id", id);
    fetchRegions();
  };

  const openAddModal = () => {
    setEditingRegion(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (region: any) => {
    setEditingRegion(region);
    setFormData({
      name: region.name,
      dist: region.dist,
      price: region.price?.toString() || "",
      price_ultra_vip: region.price_ultra_vip?.toString() || "",
      price_minivan: region.price_minivan?.toString() || "",
      price_minibus: region.price_minibus?.toString() || "",
      img_url: region.img_url
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center text-white">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">BÖLGE <span className="text-gold">YÖNETİMİ</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2 italic">Dinamik Araç Fiyatlandırma Paneli</p>
        </div>
        <button onClick={openAddModal} className="bg-gold text-black px-6 py-3 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-yellow-500 transition-all shadow-lg shadow-gold/20 flex items-center gap-2">
          <Plus size={16} /> YENİ BÖLGE EKLE
        </button>
      </header>

      {/* Liste Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {regions.map((region) => (
          <div key={region.id} className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-gold/20 transition-all">
            <div className="h-40 bg-white/5 relative">
               <img src={region.img_url} alt={region.name} className="w-full h-full object-cover" />
               <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => openEditModal(region)} className="p-2 bg-black/60 rounded-lg text-gray-300 hover:text-white transition-colors"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(region.id)} className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-600 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="text-lg font-black uppercase text-white italic">{region.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-black uppercase">
                <div className="text-gray-500">Vito: <span className="text-gold">€{region.price}</span></div>
                <div className="text-gray-500">Ultra: <span className="text-gold">€{region.price_ultra_vip || '0'}</span></div>
                <div className="text-gray-500">Minivan: <span className="text-gold">€{region.price_minivan || '0'}</span></div>
                <div className="text-gray-500">Bus: <span className="text-gold">€{region.price_minibus || '0'}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-8 relative overflow-y-auto max-h-[95vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
            <h2 className="text-2xl font-black italic uppercase text-white mb-8">BÖLGE & ARAÇ FİYATLARI</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Bölge Adı</label>
                  <input required type="text" placeholder="Belek Transfer" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-gold/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Mesafe (KM)</label>
                  <input required type="text" placeholder="35 KM" value={formData.dist} onChange={(e) => setFormData({...formData, dist: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-gold/50" />
                </div>
              </div>

              {/* 💰 ARAÇ BAZLI FİYAT PANELİ */}
              <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 space-y-4">
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-2 block">Araç Tipi Fiyatlandırma (€)</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <PriceInput label="Vito (Std)" val={formData.price} onChange={(v) => setFormData({...formData, price: v})} />
                  <PriceInput label="Ultra VIP" val={formData.price_ultra_vip} onChange={(v) => setFormData({...formData, price_ultra_vip: v})} />
                  <PriceInput label="Minivan" val={formData.price_minivan} onChange={(v) => setFormData({...formData, price_minivan: v})} />
                  <PriceInput label="Minibüs" val={formData.price_minibus} onChange={(v) => setFormData({...formData, price_minibus: v})} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center gap-3 w-full bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-8 cursor-pointer hover:border-gold/50 transition-all group">
                  {uploading ? <RefreshCcw className="animate-spin text-gold" /> : <Upload className="text-gray-500 group-hover:text-gold transition-colors" />}
                  <span className="text-[10px] font-black uppercase text-gray-500">
                    {uploading ? "YÜKLENİYOR..." : "BÖLGE GÖRSELİ SEÇ"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
                
                {formData.img_url && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-[9px] text-green-500 font-bold truncate">GÖRSEL MÜHÜRLENDİ</span>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading && !uploading} className="w-full bg-gold text-black font-black uppercase italic py-5 rounded-2xl mt-4 hover:bg-yellow-500 shadow-xl shadow-gold/20 transition-all text-xs tracking-widest active:scale-95">
                VERİLERİ SİSTEME KAYDET
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 🛠️ Küçük Yardımcı Input Bileşeni
function PriceInput({ label, val, onChange }: { label: string, val: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">{label}</label>
      <input required type="number" placeholder="0" value={val} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-gold transition-all" />
    </div>
  );
}