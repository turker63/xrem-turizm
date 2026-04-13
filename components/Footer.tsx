"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext"; 
import { useLanguage } from '@/context/LanguageContext';
import { Instagram, Facebook, MessageCircle, ShieldCheck } from "lucide-react";

const FOOTER_LINKS = {
  tr: {
    kurumsal: [
      { name: "Hakkımızda", href: "/hakkimizda" },
      { name: "Banka Hesapları", href: "/banka-hesaplari" },
      { name: "İletişim", href: "/#booking" },
    ],
    politikalar: [
      { name: "Yolcu Taşıma Politikası", href: "/yolcu-tasima" },
      { name: "Gizlilik Sözleşmesi", href: "/gizlilik" },
      { name: "İptal ve İade Koşulları", href: "/iptal-iade" },
      { name: "KVKK Aydınlatma Metni", href: "/kvkk" },
    ]
  },
  en: {
    kurumsal: [
      { name: "About Us", href: "/hakkimizda" },
      { name: "Bank Accounts", href: "/banka-hesaplari" },
      { name: "Contact", href: "/iletisim" },
    ],
    politikalar: [
      { name: "Passenger Transport Policy", href: "/yolcu-tasima" },
      { name: "Privacy Policy", href: "/gizlilik" },
      { name: "Cancellation & Refund", href: "/iptal-iade" },
      { name: "KVKK Clarification Text", href: "/kvkk" },
    ]
  }
};

export default function Footer() {
  const { settings } = useSettings(); 
  const { t, lang } = useLanguage();

  const currentLinks = lang === 'en' ? FOOTER_LINKS.en : FOOTER_LINKS.tr;
  const defaultSlogan = lang === 'en' 
    ? "Premium travel experience to all regions of Antalya with our VIP vehicles!" 
    : "Antalya'nın tüm bölgelerine VIP araçlarımızla premium seyahat keyfi!";

  return (
    <footer className="bg-cream pt-24 pb-10 px-6 md:px-4 relative z-20 border-t border-cream-dark">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter text-luxury-dark uppercase">
              {settings?.site_name ? (
                <>
                  {settings.site_name.split(' ')[0]}
                  <span className="text-gold">{settings.site_name.split(' ').slice(1).join(' ')}</span>
                </>
              ) : (
                <>XREM<span className="text-gold">TRANSFER</span></>
              )}
            </h2>
            <p className="text-luxury-gray text-[11px] font-bold uppercase tracking-wider max-w-[280px] mx-auto md:mx-0 opacity-80 leading-relaxed">
              {settings?.site_slogan || defaultSlogan}
            </p>
          </div>

          <div>
            <h3 className="text-luxury-dark font-black uppercase text-[12px] tracking-[0.2em] mb-10 border-b border-gold/20 pb-4 inline-block">{t.corporate}</h3>
            <ul className="space-y-4">
              {currentLinks.kurumsal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-luxury-gray hover:text-gold text-[11px] font-bold uppercase transition-all tracking-widest block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-luxury-dark font-black uppercase text-[12px] tracking-[0.2em] mb-10 border-b border-gold/20 pb-4 inline-block">{t.policies}</h3>
            <ul className="space-y-4">
              {currentLinks.politikalar.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-luxury-gray hover:text-gold text-[11px] font-bold uppercase transition-all tracking-widest block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-luxury-dark font-black uppercase text-[12px] tracking-[0.2em] mb-10 border-b border-gold/20 pb-4 inline-block">{t.operation}</h3>
            <a href={`tel:${settings?.contact_phone}`} className="text-2xl font-black text-luxury-dark hover:text-gold tracking-tight block mb-8 transition-colors">
              {settings?.contact_phone || "+90 (532) 285 55 72"}
            </a>
            <div className="flex justify-center md:justify-start gap-4">
              <SocialIcon href={settings?.instagram_url} icon={<Instagram size={18} />} />
              <SocialIcon href={settings?.facebook_url} icon={<Facebook size={18} />} />
              <SocialIcon href={settings?.contact_whatsapp ? `https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}` : null} icon={<MessageCircle size={18} />} />
            </div>
          </div>
        </div>

        <div className="border-t border-cream-dark pt-12 pb-12">
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 hover:opacity-100 transition-opacity duration-700">
            <PartnerLogo src="/partners/tursab-dds-11448.png" alt="Tursab" />
            <PartnerLogo src="/partners/d2.jpg" alt="D2 Belgesi" />
            <PartnerLogo src="/partners/comodo_ssl.png" alt="SSL" />
            <PartnerLogo src="/partners/card.png" alt="Payment" />
          </div>
        </div>

        <div className="border-t border-cream-dark pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-luxury-gray/50 tracking-[0.2em] uppercase">
          <p>© 2026 {settings?.site_name?.toUpperCase() || "XREM TRANSFER"}. {t.footerRights}</p>
          <div className="flex items-center gap-3 bg-cream-dark/50 px-6 py-3 rounded-full border border-cream-dark shadow-inner">
            <ShieldCheck size={14} className="text-gold" />
            <span className="text-luxury-gray/80"> {t.securePayment}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

function SocialIcon({ href, icon }: { href?: string | null, icon: any }) {
  if (!href) return null;
  return (
    <motion.a 
      whileHover={{ y: -5, backgroundColor: '#bf953f', color: '#fff', borderColor: '#bf953f' }}
      href={href} target="_blank"
      className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-luxury-gray border border-cream-dark transition-all shadow-sm"
    >
      {icon}
    </motion.a>
  );
}

function PartnerLogo({ src, alt }: { src: string, alt: string }) {
  return (
    <motion.img 
      whileHover={{ scale: 1.1 }}
      src={src} 
      alt={alt} 
      className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition-all cursor-pointer mix-blend-multiply"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}