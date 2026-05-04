"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import RightClickBlocker from "../components/RightClickBlocker";
import ScrollToTop from "../components/ScrollToTop";
import WhatsAppButton from "../components/WhatsAppButton";
import MaintenancePage from "./bakim/page";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, loading } = useSettings(); 
  
  const isAdminPath = pathname?.startsWith('/admin');

  if (loading) return null;

  if (settings?.maintenance_mode && !isAdminPath) {
    return <MaintenancePage />;
  }

  if (isAdminPath) {
    return (
      <main className="min-h-screen relative z-10 bg-[#050505] text-white"> 
        {children}
      </main>
    );
  }

  return (
    <>
      <RightClickBlocker />
      
      {/* GLOBAL CRYSTAL DEKORATİF ŞEKİLLER */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -left-20 w-[40rem] h-[40rem] bg-[#C88A83]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-40 w-[50rem] h-[50rem] bg-[#E8CD89]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -left-20 w-[35rem] h-[35rem] bg-[#4CBEC4]/10 rounded-full blur-[100px]" />
      </div>

      <main className="min-h-screen relative z-10 text-[#2C2C2C] selection:bg-[#D4AF37] selection:text-white">
        {children}
      </main>

      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}