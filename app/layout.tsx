import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "@/context/SettingsContext"; 
import ClientWrapper from "./ClientWrapper"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "XREMTRANSFER | Premium Transfer Deneyimi",
  description: "Antalya VIP Transfer ve Lojistik Hizmetleri",
  icons: { icon: "/favicon.png", apple: "/logo.png" },
  google: "notranslate",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="scroll-smooth notranslate">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={`${inter.className} bg-cream-dark selection:bg-gold selection:text-black antialiased relative min-h-screen text-luxury-dark`}>
        <LanguageProvider>
          <SettingsProvider> 
            <ClientWrapper>
              {children}
            </ClientWrapper>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}