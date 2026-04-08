"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Shield, UserPlus, Trash2, Mail, ShieldAlert, KeyRound, RefreshCcw } from "lucide-react";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // İşlem yapılırken buton için

  // Form State'leri
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState(""); // 🔑 Şifre artık burada!
  const [newRole, setNewRole] = useState("Moderatör");

  const fetchAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: true });
    if (!error) setAdmins(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    // 🚀 2. ADIMDA OLUŞTURDUĞUMUZ API MOTORUNA İSTEK ATILIYOR
    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: newEmail, 
          password: newPassword, 
          role: newRole 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ BAŞARILI: Kullanıcı yetkilendirildi!");
        setNewEmail("");
        setNewPassword("");
        fetchAdmins();
      } else {
        alert("❌ HATA: " + (result.error || "Bir sorun oluştu"));
      }
    } catch (err) {
      alert("❌ SUNUCU HATASI: API bağlantısı kurulamadı.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveAdmin = async (id: string, email: string) => {
    if (email === "admin@xxremtransfer.com") {
      alert("⚠️ KRİTİK HATA: Kurucu (Süper Admin) hesabı sistemden silinemez!");
      return;
    }
    
    const confirm = window.confirm(`${email} adlı yöneticinin tüm yetkilerini iptal etmek üzeresiniz. Onaylıyor musunuz?`);
    if (confirm) {
      const { error } = await supabase.from("admin_users").delete().eq("id", id);
      if (!error) fetchAdmins();
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center text-white">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">YETKİLİ <span className="text-gold">KADROSU</span></h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic opacity-60 flex items-center gap-2">
            <Shield size={12} /> Sistem Yöneticileri ve Erişim Hakları
          </p>
        </div>
        <button onClick={fetchAdmins} className="p-4 bg-white/5 rounded-2xl hover:text-gold transition-all">
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* SOL: YENİ YÖNETİCİ EKLEME FORMU */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-black">
                <UserPlus size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white italic">Personel Atama</h2>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 italic">E-posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                  <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-gray-700" placeholder="ornek@xxremtransfer.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 italic">Geçici Şifre</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                  <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-gray-700" placeholder="••••••••" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 italic">Erişim Yetki Seviyesi</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold text-white appearance-none cursor-pointer">
                  <option value="Süper Admin" className="bg-black">Süper Admin (Tam Yetki)</option>
                  <option value="Operasyon Müdürü" className="bg-black">Operasyon Müdürü</option>
                  <option value="Müşteri Temsilcisi" className="bg-black">Müşteri Temsilcisi</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={actionLoading}
                className="w-full bg-gold text-black px-8 py-5 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all mt-4 shadow-2xl disabled:opacity-50"
              >
                {actionLoading ? "İŞLEM YAPILIYOR..." : "YETKİ VER VE KAYDET"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* SAĞ: YÖNETİCİ LİSTESİ */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] overflow-hidden backdrop-blur-3xl">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-gray-600 text-[8px] font-black uppercase tracking-[0.4em] italic bg-white/[0.01]">
                    <th className="p-8">PERSONEL / E-POSTA</th>
                    <th className="p-8">YETKİ ROLÜ</th>
                    <th className="p-8 text-right">YÖNET</th>
                  </tr>
                </thead>
                <tbody className="text-[10px] font-bold italic uppercase text-white">
                  {loading ? (
                    <tr><td colSpan={3} className="text-center py-20 text-gray-600 tracking-widest">Veritabanı taranıyor...</td></tr>
                  ) : admins.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-20 text-gray-600 tracking-widest">Kayıtlı yönetici bulunamadı.</td></tr>
                  ) : (
                    admins.map((admin) => (
                      <tr key={admin.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-all group">
                        <td className="p-8">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gold font-black italic">
                              {admin.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="lowercase text-sm font-bold tracking-normal text-gray-300">{admin.email}</span>
                            {admin.email === "admin@xxremtransfer.com" && (
                              <span className="ml-2 px-2 py-0.5 bg-gold/10 text-gold text-[7px] rounded border border-gold/20 font-black">ROOT</span>
                            )}
                          </div>
                        </td>
                        <td className="p-8">
                          <span className={`px-4 py-1.5 rounded-full border text-[7px] font-black ${
                            admin.role === 'Süper Admin' ? 'border-gold/30 text-gold bg-gold/5' : 'border-white/10 text-gray-400 bg-white/5'
                          }`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="p-8 text-right">
                          <button 
                            onClick={() => handleRemoveAdmin(admin.id, admin.email)} 
                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-40 group-hover:opacity-100"
                            title="Yetkiyi Kaldır"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}