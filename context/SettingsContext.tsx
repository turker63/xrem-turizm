"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const SettingsContext = createContext<any>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 📡 Veritabanından Ayarları Çek
  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Ayarlar çekilirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // 🔄 Realtime Takip (Admin panelinden bir şey değişirse anında tüm siteye yansısın)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_settings' },
        (payload) => {
          setSettings(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);