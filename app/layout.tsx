import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "@/context/SettingsContext"; 
import { CurrencyProvider } from "@/context/CurrencyContext";
import ClientWrapper from "./ClientWrapper"; 
import Navbar from "@/components/Navbar";

// Crystal Arka Planı İmport Ettik
import CrystalBackground from "@/components/CrystalBackground"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });

export const metadata = {
  title: "XREM VIP | Premium Transfer",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${syne.variable} notranslate`}>
      <body className="bg-white m-0 p-0 overflow-x-hidden">
        <LanguageProvider>
          <SettingsProvider> 
            <CurrencyProvider> 
              
              {/* İŞTE BURASI: Tüm Sitenin Zeminine Yerleşen Lüks Tasarım */}
              <CrystalBackground />
              
              <ClientWrapper>
                <Navbar />
                {children}
              </ClientWrapper>
            </CurrencyProvider>
          </SettingsProvider> 
        </LanguageProvider>
      </body>
    </html>
  );
}