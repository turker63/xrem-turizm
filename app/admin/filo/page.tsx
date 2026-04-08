"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
// 🚨 İŞTE BURASI DÜZELTİLDİ: Check ikonu import edildi
import { Plus, Edit3, Trash2, RefreshCcw, Car, X, MessageCircle, Check } from "lucide-react";

export default function AdminFleet() {
  const [fleet, setFleet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    currency: "TRY",
    capacity: "6+1",
    luggage: "4",
    status: "active",
    image_url: "",
    contact_for_price: false
  });

  const fetchFleet = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cars").select("*").order("id", { ascending: true });
    if (!error) setFleet(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchFleet(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      currency: formData.currency,
      capacity: formData.capacity,
      luggage: formData.luggage,
      status: formData.status,
      image_url: formData.image_url,
      contact_for_price: formData.contact_for_price
    };

    if (editingCar) {
      const { error } = await supabase.from("cars").update(payload).eq("id", editingCar.id);
      if (error) alert("Güncelleme Hatası: " + error.message);
    } else {
      const { error } = await supabase.from("cars").insert([payload]);
      if (error) alert("Ekleme Hatası: " + error.message);
    }

    setIsModalOpen(false);
    fetchFleet();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu aracı filodan silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (!error) fetchFleet();
  };

  const openEditModal = (car: any) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      price: car.price.toString(),
      currency: car.currency || "TRY",
      capacity: car.capacity,
      luggage: car.luggage,
      status: car.status || "active",
      image_url: car.image_url || "",
      contact_for_price: car.contact_for_price || false
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingCar(null);
    setFormData({ name: "", price: "", currency: "TRY", capacity: "6+1", luggage: "4", status: "active", image_url: "", contact_for_price: false });
    setIsModalOpen(true);
  };

  const getCurrencySymbol = (currency: string) => {
    if (currency === 'EUR') return '€';
    if (currency === 'USD') return '$';
    return '₺';
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center text-white">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">ARAÇ <span className="text-gold">FİLOSU</span></h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic opacity-60">Global Fiyat ve Envanter Yönetimi</p>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchFleet} className="p-4 bg-white/5 rounded-2xl hover:text-gold transition-all">
            <RefreshCcw className={loading ? "animate-spin" : ""} size={20} />
          </button>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:bg-yellow-500 transition-all shadow-lg shadow-gold/20">
            <Plus size={16} /> YENİ ARAÇ EKLE
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fleet.map((car) => (
          <div key={car.id} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 relative group hover:border-gold/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-24 h-16 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/5 relative">
                {car.image_url ? <img src={car.image_url} alt={car.name} className="w-full h-full object-contain p-2" /> : <Car className="text-gray-600" size={24} />}
                {car.contact_for_price && (
                  <div className="absolute top-1 right-1 bg-green-500 text-black p-1 rounded-full"><MessageCircle size={10} /></div>
                )}
              </div>
              <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => openEditModal(car)} className="p-2.5 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(car.id)} className="p-2.5 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${car.status === 'active' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                {car.status === 'active' ? 'AKTİF' : 'BAKIMDA'}
              </span>
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mt-2">{car.name}</h3>
              {car.contact_for_price ? (
                <p className="text-green-500 font-black text-xl italic tracking-tighter mt-1">ÖZEL FİYAT</p>
              ) : (
                <p className="text-gold font-black text-2xl italic tracking-tighter">{getCurrencySymbol(car.currency)}{car.price}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-all"><X size={24} /></button>
            <h2 className="text-2xl font-black italic uppercase text-white mb-8">
              {editingCar ? "ARACI DÜZENLE" : "YENİ ARAÇ EKLE"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Araç Adı</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white mt-2 outline-none focus:border-gold/50 transition-all" />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/20 rounded-xl cursor-pointer" onClick={() => setFormData({...formData, contact_for_price: !formData.contact_for_price})}>
                <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.contact_for_price ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                  {formData.contact_for_price && <Check size={14} className="text-black" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Bu araç için WhatsApp'tan fiyat sorulsun</span>
              </div>

              {!formData.contact_for_price && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Fiyat</label>
                    <input required={!formData.contact_for_price} type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white mt-2 outline-none focus:border-gold/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Para Birimi</label>
                    <select value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white mt-2 outline-none focus:border-gold/50 transition-all appearance-none">
                      <option value="TRY" className="bg-black text-white">₺ (TRY)</option>
                      <option value="EUR" className="bg-black text-white">€ (EUR)</option>
                      <option value="USD" className="bg-black text-white">$ (USD)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Kişi Kapasitesi</label>
                  <input required type="text" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white mt-2 outline-none focus:border-gold/50" />
                </div>
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Bagaj Kapasitesi</label>
                  <input required type="text" value={formData.luggage} onChange={(e) => setFormData({...formData, luggage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white mt-2 outline-none focus:border-gold/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Durum</label>
                   <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white mt-2 outline-none focus:border-gold/50 appearance-none">
                     <option value="active" className="bg-black text-white">AKTİF</option>
                     <option value="maintenance" className="bg-black text-white">BAKIMDA</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Görsel URL</label>
                   <input type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white mt-2 outline-none focus:border-gold/50" placeholder="https://..." />
                 </div>
              </div>
              <button type="submit" className="w-full bg-gold text-black font-black uppercase italic tracking-widest text-[10px] py-4 rounded-xl mt-6 hover:bg-yellow-500 transition-all shadow-lg shadow-gold/20">
                {editingCar ? "DEĞİŞİKLİKLERİ MÜHÜRLE" : "FİLOYA EKLE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}