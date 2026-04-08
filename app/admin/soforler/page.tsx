"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, Trash2, Phone, Car, RefreshCcw, 
  UserCheck, ShieldCheck, AlertCircle 
} from "lucide-react";

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    license_plate: ""
  });

  const fetchDrivers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setDrivers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);

    const { error } = await supabase.from("drivers").insert([
      { ...formData, status: "Müsait" }
    ]);

    if (!error) {
      setFormData({ full_name: "", phone: "", license_plate: "" });
      fetchDrivers();
    } else {
      alert("Hata: " + error.message);
    }
    setBtnLoading(false);
  };

  const deleteDriver = async (id: string) => {
    if (confirm("Bu kaptanın kaydını silmek istediğinize emin misiniz?")) {
      const { error } = await supabase.from("drivers").delete().eq("id", id);
      if (!error) fetchDrivers();
    }
  };

  return (
    <div className="space-y-10">
      {/* 🔝 BAŞLIK */}
      <header className="flex justify-between items-center text-white">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            KAPTAN <span className="text-gold">KADROSU</span>
          </h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic opacity-60">
            Personel ve Araç Tanımlama Merkezi
          </p>
        </div>
        <button 
          onClick={fetchDrivers} 
          className="p-4 bg-white/5 rounded-2xl hover:text-gold transition-all"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 📝 SOL TARAF: ŞOFÖR EKLEME FORMU */}
        <div className="lg:col-span-1">
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] backdrop-blur-3xl sticky top-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-black">
                <UserPlus size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white italic">Yeni Kayıt</h2>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 italic">Ad Soyad</label>
                <input 
                  required 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-gray-800"
                  placeholder="Ahmet Yılmaz"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 italic">Telefon Numarası</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                  <input 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-gray-800"
                    placeholder="05xx xxx xx xx"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 italic">Araç Plakası</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                  <input 
                    required 
                    value={formData.license_plate}
                    onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-gray-800"
                    placeholder="34 ABC 123"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={btnLoading}
                className="w-full bg-gold text-black font-black py-5 rounded-2xl hover:bg-white transition-all uppercase text-[10px] tracking-[0.3em] mt-4 shadow-xl disabled:opacity-50"
              >
                {btnLoading ? "KAYDEDİLİYOR..." : "SİSTEME DAHİL ET"}
              </button>
            </form>
          </div>
        </div>

        {/* 📋 SAĞ TARAF: ŞOFÖR LİSTESİ */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2 italic">
                <UserCheck size={14} className="text-gold" /> Aktif Kaptan Listesi ({drivers.length})
              </h3>
            </div>
            
            <div className="divide-y divide-white/[0.02]">
              {loading ? (
                <div className="p-20 text-center text-gray-700 italic font-black uppercase tracking-widest animate-pulse">
                  KADRO TARANIYOR...
                </div>
              ) : drivers.length === 0 ? (
                <div className="p-20 text-center text-gray-700 italic font-black uppercase tracking-widest">
                  HENÜZ KAYITLI KAPTAN YOK
                </div>
              ) : (
                drivers.map((driver) => (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    key={driver.id} 
                    className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gold border border-white/5 group-hover:border-gold/30 transition-all">
                        <UserCheck size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-black italic text-white uppercase">{driver.full_name}</h4>
                        <div className="flex gap-4 mt-2">
                          <span className="text-[9px] text-gray-500 font-bold flex items-center gap-1 uppercase">
                            <Phone size={10} /> {driver.phone}
                          </span>
                          <span className="text-[9px] text-gold font-black flex items-center gap-1 uppercase">
                            <Car size={10} /> {driver.license_plate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Durum</span>
                        <span className="text-[10px] text-green-500 font-black italic uppercase">MÜSAİT</span>
                      </div>
                      <button 
                        onClick={() => deleteDriver(driver.id)}
                        className="p-4 bg-red-500/5 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                        title="Kaptanı Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}