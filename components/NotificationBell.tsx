"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Ticket, CheckCircle2, Trash2, Clock } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🕒 Tarih Formatlama Yardımcısı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  useEffect(() => {
    let channel: any;

    const fetchSessionAndListen = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) return;

      const email = session.user.email;
      setUserEmail(email);

      // 1. MEVCUT BİLDİRİMLERİ ÇEK
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_email", email)
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) setNotifications(data);

      // 🚀 2. REALTIME DINLEYICI
      channel = supabase
        .channel('realtime-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_email=eq.${email}`
          },
          (payload) => {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();
    };

    fetchSessionAndListen();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  // 🔥 KALICI SİLME FONKSİYONU
  const deleteNotification = async (id: string) => {
    const backup = [...notifications];
    setNotifications(prev => prev.filter(n => n.id !== id));

    const { error } = await supabase.from("notifications").delete().eq("id", id);

    if (error) {
      console.error("Silme hatası:", error);
      alert("Bildirim silinemedi, lütfen tekrar deneyin.");
      setNotifications(backup); 
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!userEmail) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ☀️ AYDINLIK TEMA: Çan Butonu */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:border-gold/30 hover:text-gold transition-all text-gray-700 shadow-sm"
      >
        <Bell size={18} className={unreadCount > 0 ? "animate-pulse text-gold" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            /* ☀️ AYDINLIK TEMA: Beyaz zemin ve yumuşak gölge */
            className="absolute right-0 mt-4 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.1)] overflow-hidden z-[999]"
          >
            {/* Üst Kısım (Header) */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-800 italic">Bildirimler</h3>
              <span className="text-[9px] text-gray-600 font-bold px-2 py-1 bg-white border border-gray-200 shadow-sm rounded-full">{unreadCount} Yeni</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                  Henüz bir bildiriminiz yok.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      /* ☀️ AYDINLIK TEMA: Okunmamışsa hafif gri zemin */
                      className={`p-5 transition-all group ${notif.is_read ? 'opacity-70 bg-transparent' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 flex-shrink-0 p-2 rounded-xl ${notif.is_read ? 'bg-gray-100 text-gray-400' : 'bg-gold/10 text-gold'}`}>
                          <Ticket size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-[11px] font-black uppercase tracking-wide ${notif.is_read ? 'text-gray-500' : 'text-gray-900'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[8px] text-gray-400 font-bold flex items-center gap-1">
                              <Clock size={10} /> {formatDate(notif.created_at)}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-600 leading-relaxed font-medium mb-3">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between">
                            {!notif.is_read ? (
                              <button 
                                onClick={() => markAsRead(notif.id)}
                                className="text-[9px] font-black text-gold uppercase tracking-widest flex items-center gap-1 hover:underline"
                              >
                                <CheckCircle2 size={12} /> Okundu İşaretle
                              </button>
                            ) : <span></span>}
                            <button 
                              onClick={() => deleteNotification(notif.id)}
                              className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={12} /> Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}