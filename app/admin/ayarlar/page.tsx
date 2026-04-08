"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Settings, Globe, MessageCircle, Mail, 
  Share2, Save, Image as ImageIcon, ShieldCheck,
  Smartphone, Hash, Zap, Loader2, CheckCircle2
} from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  
  // 📊 Tüm Ayarlar State'i
  const [settings, setSettings] = useState({
    site_name: "",
    site_description: "",
    contact_whatsapp: "",
    contact_email: "",
    instagram_url: "",
    facebook_url: "",
    maintenance_mode: false,
    auto_cancel: true
  });

  // 📡 Verileri Veritabanından Çek
  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (data) {
        setSettings({
          site_name: data.site_name || "",
          site_description: data.site_slogan || "", // Tablodaki sloganı açıklama olarak kullanıyoruz
          contact_whatsapp: data.contact_whatsapp || "",
          contact_email: data.contact_email || "",
          instagram_url: data.instagram_url || "",
          facebook_url: data.facebook_url || "",
          maintenance_mode: data.maintenance_mode || false,
          auto_cancel: true // Default true
        });
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  // 💾 Verileri Veritabanına Mühürle
  const handleSave = async () => {
    setSaveStatus("saving");
    
    const { error } = await supabase
      .from("site_settings")
      .upsert({
        id: 1,
        site_name: settings.site_name,
        site_slogan: settings.site_description,
        contact_whatsapp: settings.contact_whatsapp,
        contact_email: settings.contact_email,
        instagram_url: settings.instagram_url,
        facebook_url: settings.facebook_url,
        maintenance_mode: settings.maintenance_mode,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error(error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="animate-spin text-gold" size={40} />
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* 🏎️ HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            SİSTEM <span className="text-gold">AYARLARI</span>
          </h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic opacity-60">
            Global Parametre ve Kimlik Yönetimi
          </p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase italic tracking-widest flex items-center gap-3 transition-all ${
            saveStatus === "saved" ? "bg-green-500 text-white" : 
            saveStatus === "error" ? "bg-red-500 text-white" :
            "bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          }`}
        >
          {saveStatus === "saving" ? <Loader2 className="animate-spin" size={18} /> : 
           saveStatus === "saved" ? <CheckCircle2 size={18} /> : <Save size={18} />}
          
          {saveStatus === "saving" ? "GÜNCELLENİYOR..." : 
           saveStatus === "saved" ? "MÜHÜR BASILDI ✓" : 
           saveStatus === "error" ? "HATA OLUŞTU!" : "AYARLARI MÜHÜRLE"}
        </motion.button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 🏛️ GENEL SİTE KİMLİĞİ */}
        <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] space-y-8 backdrop-blur-3xl">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="text-gold" size={20} />
            <h2 className="text-sm font-black italic uppercase tracking-widest text-white">SİTE KİMLİĞİ</h2>
          </div>
          
          <div className="space-y-6">
            <div className="group">
              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1 italic">SİTE BAŞLIĞI (TITLE)</label>
              <input 
                type="text" 
                value={settings.site_name}
                onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-xs font-bold text-white outline-none focus:border-gold/30 transition-all" 
              />
            </div>
            <div className="group">
              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1 italic">META AÇIKLAMASI (SLOGAN)</label>
              <textarea 
                rows={3} 
                value={settings.site_description}
                onChange={(e) => setSettings({...settings, site_description: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-xs font-bold text-white outline-none focus:border-gold/30 transition-all resize-none" 
              />
            </div>
          </div>
        </section>

        {/* 📱 LOJİSTİK İLETİŞİM HATLARI */}
        <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] space-y-8 backdrop-blur-3xl">
          <div className="flex items-center gap-4 mb-4">
            <MessageCircle className="text-gold" size={20} />
            <h2 className="text-sm font-black italic uppercase tracking-widest text-white">İLETİŞİM KANALLARI</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1 italic">WHATSAPP HESABI</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={14} />
                <input 
                  type="text" 
                  value={settings.contact_whatsapp}
                  onChange={(e) => setSettings({...settings, contact_whatsapp: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-5 py-3.5 text-xs font-mono text-white outline-none focus:border-gold/30 transition-all" 
                />
              </div>
            </div>
            <div className="group">
              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1 italic">DESTEK E-POSTA</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={14} />
                <input 
                  type="email" 
                  value={settings.contact_email}
                  onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-5 py-3.5 text-xs font-bold text-white outline-none focus:border-gold/30 transition-all" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* 🔗 SOSYAL MEDYA HATLARI */}
        <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] space-y-8 backdrop-blur-3xl">
          <div className="flex items-center gap-4 mb-4">
            <Share2 className="text-gold" size={20} />
            <h2 className="text-sm font-black italic uppercase tracking-widest text-white">SOSYAL MEDYA</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 font-black text-[10px]">IG</div>
              <input 
                type="text" 
                placeholder="INSTAGRAM URL..." 
                value={settings.instagram_url}
                onChange={(e) => setSettings({...settings, instagram_url: e.target.value})}
                className="flex-1 bg-transparent border-none text-[10px] font-bold text-white outline-none placeholder:text-gray-700" 
              />
            </div>
            <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 font-black text-[10px]">FB</div>
              <input 
                type="text" 
                placeholder="FACEBOOK URL..." 
                value={settings.facebook_url}
                onChange={(e) => setSettings({...settings, facebook_url: e.target.value})}
                className="flex-1 bg-transparent border-none text-[10px] font-bold text-white outline-none placeholder:text-gray-700" 
              />
            </div>
          </div>
        </section>

        {/* 🛡️ GÜVENLİK PARAMETRELERİ */}
        <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] space-y-8 backdrop-blur-3xl">
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck className="text-gold" size={20} />
            <h2 className="text-sm font-black italic uppercase tracking-widest text-white">SİSTEM GÜVENLİĞİ</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-black italic text-white/80 uppercase">Maintenance Mode</span>
                <span className="text-[7px] text-gray-600 font-bold uppercase tracking-widest">SİTEYİ BAKIMA AL</span>
              </div>
              <div 
                onClick={() => setSettings({...settings, maintenance_mode: !settings.maintenance_mode})}
                className={`w-12 h-6 rounded-full relative cursor-pointer border transition-all ${
                  settings.maintenance_mode ? "bg-red-500/20 border-red-500/40" : "bg-white/5 border-white/10"
                }`}
              >
                <motion.div 
                  animate={{ x: settings.maintenance_mode ? 24 : 0 }}
                  className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-colors ${
                    settings.maintenance_mode ? "bg-red-500" : "bg-gray-700"
                  }`} 
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-black italic text-white/80 uppercase">Auto-Cancel (24h)</span>
                <span className="text-[7px] text-gray-600 font-bold uppercase tracking-widest">OTOMATİK İPTAL SİSTEMİ</span>
              </div>
              <div 
                onClick={() => setSettings({...settings, auto_cancel: !settings.auto_cancel})}
                className={`w-12 h-6 rounded-full relative cursor-pointer border transition-all ${
                  settings.auto_cancel ? "bg-gold/20 border-gold/40" : "bg-white/5 border-white/10"
                }`}
              >
                <motion.div 
                  animate={{ x: settings.auto_cancel ? 24 : 0 }}
                  className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-colors ${
                    settings.auto_cancel ? "bg-gold" : "bg-gray-700"
                  }`} 
                />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}