"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import RightClickBlocker from "../components/RightClickBlocker";
import Navbar from "../components/Navbar"; 
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
      <div className="fixed inset-0 z-[-1] bg-cream-dark pointer-events-none" />

      <Navbar /> 
      <RightClickBlocker />
      
      <main className="pt-24 min-h-screen relative z-10 text-luxury-dark">
        {children}
      </main>

      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}