"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation"; 
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Ticket, CheckCircle2, MessageSquare, 
  ArrowRight, ShieldCheck, Calendar, Users, Car, Loader2,
  UserCheck, Baby, Wine, Beer, Smartphone, Plus, Minus, MapPin, Mail, Phone, User as UserIcon, X, Globe, ChevronDown, Search
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const EXTRAS_PRICES = {
  nameMeet: 10,
  babySeat: 15,
  stroller: 25,
  booster: 10,
  wine: 30,
  beer: 15,
  champagne: 50,
  simCard: 40
};

const HOTELS = [
  "Acar Hotel", "Agora Apart Hotel", "Ak Otel", "Akropol Resort Hotel", "Akya Apart Hotel",
  "Alaaddin Beach Hotel", "Alaiye Kleopatra Hotel", "Alanis Hotel", "Alanya Aslan Kleopatra Beste Hotel",
  "Alanya Azura Family Style", "Alanya Beach Otel", "Alanya Büyük Otel", "Alanya Concorde Hotel",
  "Alanya Damlataş Apart Otel", "Alanya Dreams Apart Hotel", "Alanya Hotel Midi", "Alanya Mesem Uygulama Oteli",
  "Alanya Meziyet Köseoğlu Uygulama Oteli", "Alanya North Point Hotel", "Alanya Opera Hotel", "Alanya Park Hotel",
  "Alanya Sun Hotel", "Alanya Ümit Altay Uygulama Oteli", "Alanya Üstün Pansiyon", "Alaya Apart Otel",
  "Albatros Apart Otel", "Alin Hotel", "Almera Apart Hotel", "Almera Park Apart Hotel", "Alperbey Hotel",
  "Amber Rose Apart Hotel", "Anahtar Apart Hotel", "Ananas Hotel", "Anik Suite Hotel", "Antalya Alanya Öğretmenevi",
  "Antique Roman Palace", "Ark Suite Otel", "Arsi Enfi City Beach Hotel", "Arsi Hotel", "Arsi Sweet Suit Apart",
  "Artemis Princess Hotel", "Asem City Hotel", "Asia Beach Resort and Spa", "Aska Kleopatra Beste Hotel",
  "Aslan Hotel", "Atak Apart Hotel", "Atak Suit Hotel", "Atlas Otel", "Avena Resort and Spa", "Aydoğar Otel",
  "Aysev Hotel", "Azak Beach Otel", "Azak Hotel", "Azalea Apart Hotel", "Azur Resort and Spa hotel",
  "Babaoğlu Apart Hotel", "Balık Hotel", "Banana Beach Hotel", "Baronessa Apart Otel", "Bayram Apart Hotel",
  "Bella Rose Apart Hotel", "Bella Vista Apart Hotel", "Belle Ocean Apart Hotel", "Berkan Hotel", "Best Alanya Otel",
  "Best Beach Hotel", "Best House Hotels and Apart", "Best Life Apart Hotel", "Bilkay Otel", "Blue Camelot Beach Hotel",
  "Blue Diamond Alya Hotel", "Blue Dream Hotel", "Blue Heaven Hotel", "Blue Sky Hotel and Suites", "Blue Star Hotel",
  "Blue Wave Suite Hotel", "Bora Bora Hotel", "Boreas Suite Apart Hotel", "Boulevard Hotel", "Bravo Marina Apart Hotel",
  "Caligo Apart Hotel", "Campus Hill Hotel", "Caprice Apart Hotel", "Carmen Apart Otel", "Carmen Otel Suite",
  "Cemal Bey Apart Otel", "Centauera Hotel", "Cleo Mare Otel", "Cleo South Princess Suite Hotel", "Cleopatra King Apart Hotel",
  "Club Aslanbey Otel", "Club Bayar Beach Hotel", "Club Big Blue Suite Hotel", "Club Güneş Garden", "Club Paradiso Hotel",
  "Club Samira", "Club Sidar", "Club Sidar Apart Hotel", "Copenhagen Otel", "Cozmina Apart Hotel", "Crystal Towers Apart Hotel",
  "Çimen Otel", "Çimtur Tatil Köyü", "Damlataş Elegant Apart Hotel", "Dedebey Apart Hotel", "Demar Apart Otel",
  "Deniz Apart Otel Alanya", "Diamond Hill Resort Hotel", "Dim Suit Hotel", "Dolphin Suite Hotel", "Eftalia Aytur Hotel",
  "Elfida Apart", "Elite Orkide Suite and Hotel", "Eliz Beach Hotel", "Elysee Beach Hotel", "Elysee Garden Family Hotel",
  "Elysee Hotel", "Emir Fosse Beach", "En Vie Beach Boutique Hotel", "Enki Hotel", "Enver Bey Resort", "Erciyes Hotel Alanya",
  "Ergün Hotel Alanya", "Erkaptan Apart Otel", "Europa Beach Hotel", "Europa Park Hotel", "Fancy Apart Otel", "Floria Beach Hotel",
  "Flower Garden Apart Otel", "Fortune Center Hotel", "Fougere Apart", "Fun Point Suite Hotel", "Gallion Hotel", "Gardenia Hotel",
  "Glaros Hotel", "Gold River Apart Otel", "Görgülü Kleopatra Beach Hotel", "Grand Atilla Otel", "Grand Bayar Beach Hotel",
  "Grand Horizon Apart Hotel", "Grand Kaptan Hotel", "Grand Okan Hotel", "Grand Uysal Apart Hotel", "Grand Zaman Beach Hotel",
  "Grand Zaman Garden Hotel", "Gray Wolf Otel", "Green Garden Apart Hotel", "Green Garden City Hotel", "Green Garden Suite",
  "Güler Otel", "Günaydın Hotel", "Güneş Beach Hotel", "Güneş House Hotel", "Güneş Sun Time Hotel", "Güngör Suit Otel",
  "Gürses Apart and Hotel", "Güvenir Otel", "Hacıbey Apart Hotel", "Hakan Pansiyon", "Happy Homes Apart Hotel", "Hatipoğlu Beach Hotel",
  "Havana Apart Otel", "Hawaii Suit Beach Hotel", "Hayat Apart Hotel", "Hedef Kleopatra Golden Sun Hotel", "Hilal Otel",
  "Hildegard Hotel", "Hitit Sun Apart Otel", "Hma Apart Hotel", "Holiday World Hotel", "Hotel Diamond", "Hotel La Mosae",
  "Hotel Riviera Zen", "Hotel Royal Alanya", "Hotel Villa Turka", "Hotel Yıldırımoğlu", "Huzuray Otel", "Ihlara Hotel Alanya",
  "İkiz Hotel", "İnci Suit Otel", "İnternational Hotel", "İpek Apart Otel", "İris Apart Otel", "İsabella Apart Otel",
  "Kahya Otel", "Kaptan Hotel", "Karat Hotel", "Kardelen Apart Hotel", "Katya Hotel", "Kemalhan Beach Hotel", "King As Hotel",
  "Kleopatra Ada Beach", "Kleopatra Ada Hotel", "Kleopatra Aliş Hotel", "Kleopatra Arsi Hotel", "Kleopatra Atlas Hotel",
  "Kleopatra Aydın Otel", "Kleopatra Aytur Apart Hotel", "Kleopatra Bavyera Otel", "Kleopatra Beach Hotel", "Kleopatra Beach Yıldız Hotel",
  "Kleopatra Bebek Hotel", "Kleopatra Blue Hawai Hotel", "Kleopatra Carina Hotel", "Kleopatra Celine Hotel", "Kleopatra Develi Hotel",
  "Kleopatra Dreams Beach Hotel", "Kleopatra Fatih Hotel", "Kleopatra Gondola Hotel", "Kleopatra Hermes Beach Hotel",
  "Kleopatra İnn Hotel", "Kleopatra Life Otel", "Kleopatra Melissa Hotel", "Kleopatra Micador Hotel", "Kleopatra Miray Hotel",
  "Kleopatra Moon Suite Hotel", "Kleopatra Palmera Hotel", "Kleopatra Princess Hotel", "Kleopatra Ramira Hotel",
  "Kleopatra Royal Palm Hotel", "Kleopatra Sahara Hotel", "Kleopatra South Star Apart Hotel", "Kleopatra Suite Hotel",
  "Kleopatra Taç Hotel", "Kleopatra Togan Suit Hotel", "Kleopatra Tower Apart Otel", "Koç Suit Otel", "Krizantem Hotel",
  "La Finca Marina Hotel", "La Vella Hotel", "Lale Apart Hotel Alanya", "Lavinia Apart and Hotel", "Le Moral Apart Hotel",
  "Lemon Villa Hotel", "Lila Apart Hotel", "Lonicera City Hotel", "Luxor Apart Otel", "Magi Apart Hotel", "Maininki Hotel",
  "Maren Beach Apart Hotel", "Margarita Suit Hotel", "Marquis Hotel", "May Flower Apart Hotel", "Melani Hotel",
  "Merlin Beach Park Hotel", "Mesut Hotel", "Mirage Apart Hotel", "Mitos Apart", "Mola Hotel", "Monart Luna Playa Hotel",
  "Monarts City Hotel", "Monte Carlo Otel", "Monte Carlo Park Hotel", "Moonlight Hotel", "Murat Otel Alanya", "Musti Apart Hotel",
  "Muz Hotel Alanya", "My Diva Hotel", "Narcis Apart Hotel", "Nehir Apart Hotel", "Neray Otel", "Novella Apart", "Oba Asa Hotel",
  "Oba Star Hotel and Spa", "Oba Time Hotel", "Odeon Apart Otel", "Okan Tower Apart Hotel", "Okyanuss Otel Alanya",
  "Orange Grove Apart Hotel", "Orient Suite Hotel", "Otel 1461", "Özcan Hotel Alanya", "Özçakıl Otel", "Özdemir Apart Hotel",
  "Özgürbey Spa Hotel", "Palm Can Hotel", "Palmen Apart Otel", "Palmiye Beach Hotel", "Palmiye Park Apart Hotel", "Panorama Hotel",
  "Parador Hotel", "Pekcan Hotel", "Pera Beach Hotel", "Pera İnn Hotel", "Perle Apart Hotel", "Pınar Hotel Alanya",
  "Primera Suit Otel and Apart", "Prince Apart Hotel Alanya", "Queen Apart Otel", "Remi Hotel", "Residence Anfora Apart Hotel",
  "Resitalya Hotel", "Risus Suit Hotel", "Riviera Apart Hotel", "Riviera Otel", "Rose Garden Apart Hotel", "Rosella Hotel",
  "Ruritania Hotel", "Safran Apart Hotel", "Safran Apart Otel", "Sailor Apart Hotel", "Sailorson Apart Hotel",
  "San Francisco Beach Hotel", "Sarıtaş Hotel", "Savir Apart Hotel", "Sea Sight Hotel", "Sealine Hotel", "Seaport Otel",
  "Seçkin Hotel Alanya", "Seda Apart Hotel", "Sefa Bey Hotel", "Selçuklu Konakları", "Select Apart Hotel", "Semiz Apart Hotel",
  "Sempati Apart Hotel", "Semt Luna Beach Hotel", "Sergen Apart Otel", "Sesam Apart Otel", "Simply Fine Hotel Alize",
  "Sun On Apart Hotel", "Sunny Hill Alya Hotel", "Sunon Apart Hotel", "Sunpark Aramis", "Sunpark Beach", "Sunpark Garden Hotel",
  "Sunpark Marine Hotel", "Sunprime Alanya Beach Hotel", "Sunprime C Lounge Hotel and Spa", "Sunway Apart Hotel", "Şavk Hotel",
  "Şevkibey Hotel", "Şifalar Apart Otel", "Şükrübey Apart Otel", "Taç Naula Apart Otel", "Taç Premier Hotel Spa",
  "Taksim İnternational Hotel Obaköy", "Temiz Otel", "The S Apart and Suites", "Till Apart Otel", "Toros Apart Hotel",
  "Tuvanna Suit Hotel", "Twin Apart Hotel", "Uzel Hotel", "Varol Apart Otel", "Vega Green Apart Otel", "Vella Beach Hotel",
  "Verda Butik Hotel", "Villa Dale", "Villa Moon Flower Apart Hotel", "Villa Sonata Hotel", "Villa Sun Flower Aparts and Suites",
  "Wasa Hotel", "White Gold Hotel", "White Gold Hotel and Spa", "White İnn Otel", "Wien Hotel", "Xperia Grand Bali Hotel",
  "Xperia Kandelor Hotel", "Xperia Saray Beach Hotel", "Yeni Acun Apart", "Zafer Apart Otel", "PANORAMA HOTEL ALANYA"
];

const countryCodes = [
  { code: "+90", flag: "tr", label: "Turkey" },
  { code: "+49", flag: "de", label: "Germany" },
  { code: "+7", flag: "ru", label: "Russia" },
  { code: "+44", flag: "gb", label: "United Kingdom" },
  { code: "+1", flag: "us", label: "USA" }
];

const SearchableDropdown = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = HOTELS.filter(hotel => 
    hotel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(""); }}
        className="w-full bg-cream/30 border border-cream-dark p-5 rounded-2xl flex items-center justify-between cursor-pointer focus-within:border-gold focus-within:bg-white transition-all group"
      >
        <span className={`text-xs font-bold ${value ? 'text-luxury-dark' : 'text-luxury-gray/50'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-cream-dark/50 overflow-hidden"
          >
            <div className="p-3 border-b border-cream-dark/50 bg-cream/10 sticky top-0 flex items-center gap-2">
              <Search size={14} className="text-luxury-gray" />
              <input 
                type="text" 
                autoFocus
                placeholder="Otel / Havalimanı Ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-xs font-bold text-luxury-dark placeholder:text-luxury-gray/40"
              />
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((hotel, idx) => (
                  <div 
                    key={idx}
                    onClick={() => { onChange(hotel); setIsOpen(false); }}
                    className="px-5 py-3 hover:bg-gold/10 hover:text-gold cursor-pointer text-xs font-bold text-luxury-dark transition-colors border-b border-cream-dark/10 last:border-0"
                  >
                    {hotel}
                  </div>
                ))
              ) : (
                <div className="px-5 py-4 text-xs font-bold text-luxury-gray/50 text-center italic">
                  Sonuç bulunamadı...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function BookingFinalContent() {
  const { formatPrice } = useCurrency();
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter(); 
  
  
  const [formData, setFormData] = useState({
    date: "", time: "", adults: 1, children: 0, notes: "",
    pickupRegion: "", dropoffRegion: "",
    pickupHotel: "", dropoffHotel: "", 
    isUnknownLocation: false, 
    manualPickup: "", manualDropoff: "",
    fullName: "", email: "", phone: "", countryCode: "+90",
    agreedToTerms: false
  });

  const [extras, setExtras] = useState<any>({
    nameMeet: false, babySeat: 0, stroller: 0, booster: 0,
    wine: 0, beer: 0, champagne: 0, simCard: 0
  });

  const [basePrice, setBasePrice] = useState(0); 
  const [vehicleName, setVehicleName] = useState("VIP Araç Yükleniyor...");
  const [promoRate, setPromoRate] = useState(0); 
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "loading" | "success" | "error" | "used">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Fonksiyon 1: Ekstra Güncelleme
  const updateExtra = (key: string, type: "inc" | "dec" | "toggle") => {
    setExtras((prev: any) => {
      if (type === "toggle") return { ...prev, [key]: !prev[key] };
      const currentVal = prev[key] as number;
      const newVal = type === "inc" ? currentVal + 1 : Math.max(0, currentVal - 1);
      return { ...prev, [key]: newVal };
    });
  };

  useEffect(() => {
    const savedData = localStorage.getItem("transferSummary");
    const urlPrice = searchParams.get("price");
    if (urlPrice) setBasePrice(Number(urlPrice));

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(prev => ({ 
        ...prev, 
        date: parsed.date || "",
        time: parsed.time || "",
        adults: parseInt(parsed.adults) || 1,
        children: parseInt(parsed.children) || 0,
        pickupRegion: parsed.pickup || "",
        dropoffRegion: parsed.dropoff || ""
      }));
      
      if (!urlPrice && parsed.totalPrice) setBasePrice(Number(parsed.totalPrice.replace('€', '')));
      if (parsed.selectedCarName || parsed.carName) setVehicleName(parsed.selectedCarName || parsed.carName);
    }

    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setFormData(prev => ({
          ...prev,
          fullName: `${metadata?.first_name || ""} ${metadata?.last_name || ""}`.trim(),
          email: "",
          phone: metadata?.phone || ""
        }));
      }
    };
    fetchProfile();
  }, [searchParams]);

  // Fonksiyon 2: Kupon Uygulama
  const handleApplyPromo = async () => {
    if (!promoCode) return;
    
    if (!formData.email) {
      alert("İndirim kuponunu uygulamadan önce lütfen 'İletişim E-Posta' adresinizi giriniz.");
      return;
    }

    setPromoStatus("loading");

    const { data: couponData, error: couponError } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", promoCode.toUpperCase().trim())
      .maybeSingle();

    if (couponError || !couponData || !couponData.is_active) { 
      setPromoStatus("error"); 
      return; 
    }
    
    if ((couponData.used_count ?? 0) >= (couponData.usage_limit ?? 1)) { 
      setPromoStatus("used"); 
      return; 
    }

    const { data: usageData } = await supabase
      .from("coupon_usages")
      .select("*")
      .eq("coupon_code", promoCode.toUpperCase().trim())
      .eq("user_email", formData.email.trim().toLowerCase())
      .maybeSingle();

    if (usageData) {
      alert("Bu indirim kuponunu daha önce kullandınız! Her kupon her kullanıcı için sadece 1 kez geçerlidir.");
      setPromoStatus("error");
      return;
    }

    setPromoRate(couponData.discount_rate || 0);
    setPromoStatus("success");
  };

  // Değişkenler: Dinamik Konumlar ve Fiyatlar
  const actualPickup = formData.isUnknownLocation ? formData.manualPickup : formData.pickupHotel;
  const actualDropoff = formData.isUnknownLocation ? formData.manualDropoff : formData.dropoffHotel;

  const extrasTotalPrice = (
    (extras.nameMeet ? EXTRAS_PRICES.nameMeet : 0) +
    (extras.babySeat * EXTRAS_PRICES.babySeat) +
    (extras.stroller * EXTRAS_PRICES.stroller) +
    (extras.booster * EXTRAS_PRICES.booster) +
    (extras.wine * EXTRAS_PRICES.wine) +
    (extras.beer * EXTRAS_PRICES.beer) +
    (extras.champagne * EXTRAS_PRICES.champagne) +
    (extras.simCard * EXTRAS_PRICES.simCard)
  );

  const activeBasePrice = basePrice + extrasTotalPrice;
  const discountAmount = (activeBasePrice * promoRate) / 100;
  const finalPriceValue = activeBasePrice - discountAmount;

  // Fonksiyon 3: Rezervasyon Onayı
  const handleConfirm = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Lütfen kişi bilgilerini (Ad Soyad, E-Posta, Telefon) eksiksiz doldurunuz.");
      return;
    }
    if (!actualPickup || !actualDropoff) {
      alert("Lütfen alınacak ve bırakılacak yerleri eksiksiz belirtiniz.");
      return;
    }
    if (actualPickup === actualDropoff && !formData.isUnknownLocation) {
      alert("Alınacak yer ile bırakılacak yer aynı olamaz!");
      return;
    }
    if (!formData.agreedToTerms) {
      alert("Lütfen satış sözleşmesini onaylayınız.");
      return;
    }

    setIsSubmitting(true);
    const pnr = `XREM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const cleanPhone = `${formData.countryCode}${formData.phone.replace(/\s/g, "")}`;
    const userEmailClean = formData.email.trim().toLowerCase();

    const extrasSummary = Object.entries(extras)
      .filter(([_, val]) => val)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");

    try {
      // Kuponun bu email ile daha önce kullanılıp kullanılmadığını son kez kontrol et
      if (promoStatus === "success" && promoCode) {
        const { data: usageCheck } = await supabase
          .from("coupon_usages")
          .select("id")
          .eq("coupon_code", promoCode.toUpperCase().trim())
          .eq("user_email", userEmailClean)
          .maybeSingle();

        if (usageCheck) {
          alert("Bu indirim kuponu bu e-posta adresi ile daha önce kullanılmış. Lütfen kuponu kaldırın.");
          setIsSubmitting(false);
          setPromoStatus("idle"); 
          setPromoRate(0);
          return;
        }
      }

      // Rezervasyonu Kaydet
      const { data, error } = await supabase
        .from("reservations")
        .insert([
          {
            pnr_code: pnr,
            user_email: userEmailClean,
            full_name: formData.fullName,
            phone: cleanPhone,
            pickup: `${formData.pickupRegion} (${actualPickup})`,
            dropoff: `${formData.dropoffRegion} (${actualDropoff})`,
            transfer_date: formData.date,
            transfer_time: formData.time,
            vehicle: vehicleName,
            total_price: finalPriceValue,
            adults: formData.adults,
            children: formData.children,
            is_round_trip: false,
            notes: `${formData.notes} | Ekstralar: ${extrasSummary}`,
            status: "ONAY BEKLİYOR"
          }
        ])
        .select();

      if (error) {
        alert("SUPABASE KAYIT HATASI: " + error.message);
        setIsSubmitting(false);
        return; 
      }

      // Kupon Kullanıldıysa Mühürle
      if (promoStatus === "success" && promoCode) {
        await supabase.from("coupon_usages").insert([
          { 
            coupon_code: promoCode.toUpperCase().trim(), 
            user_email: userEmailClean 
          }
        ]);
      }

      if (data && data.length > 0) {
        localStorage.setItem("currentBooking", JSON.stringify(data[0]));
        router.push(`/odeme?pnr=${pnr}`);
      } else {
        alert("Bilinmeyen bir hata oluştu.");
        setIsSubmitting(false);
      }
      
    } catch (err: any) {
      console.error(err);
      alert("BİR HATA OLUŞTU: " + err.message);
      setIsSubmitting(false);
    }
  };

  const filteredCountryCodes = countryCodes.filter(c => 
    c.label.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.code.includes(countrySearch)
  );

  const ExtraItem = ({ icon: Icon, title, price, value, onUpdate, id, isToggle = false }: any) => (
    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-cream-dark/30 hover:bg-white transition-all group shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-[11px] font-black text-luxury-dark uppercase tracking-wide">{title}</p>
          <p className="text-[9px] font-bold text-luxury-gray/60 uppercase">+€{price}</p>
        </div>
      </div>
      
      {isToggle ? (
        <button 
          onClick={() => onUpdate(id, "toggle")}
          className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${value ? 'bg-gold' : 'bg-gray-200'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${value ? 'ml-6' : 'ml-0'}`} />
        </button>
      ) : (
        <div className="flex items-center gap-3 bg-cream/50 p-1 rounded-lg border border-cream-dark">
          <button onClick={() => onUpdate(id, "dec")} className="w-6 h-6 flex items-center justify-center text-luxury-gray hover:text-gold transition-colors"><Minus size={14}/></button>
          <span className="text-xs font-black text-luxury-dark min-w-[20px] text-center">{value}</span>
          <button onClick={() => onUpdate(id, "inc")} className="w-6 h-6 flex items-center justify-center text-luxury-gray hover:text-gold transition-colors"><Plus size={14}/></button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-xl">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-luxury-dark italic">
          SON <span className="text-gold">ADIM</span>
        </h1>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
           <span className="text-luxury-gray/40 hidden md:block">1. Araç Seçimi</span>
           <ArrowRight size={14} className="text-gold hidden md:block" />
           <span className="text-luxury-dark bg-gold/10 px-4 py-2 rounded-full border border-gold/20">2. Rezervasyon Onayı</span>
           <ArrowRight size={14} className="text-gold" />
           <span className="text-luxury-gray/40">3. Güvenli Ödeme</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl space-y-10">
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-dark pb-4">
                <h3 className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] text-gold italic">
                  <MapPin size={18} /> Transfer Noktaları
                </h3>
                <button 
                  onClick={() => setFormData({...formData, isUnknownLocation: !formData.isUnknownLocation})}
                  className={`flex items-center gap-2 text-[10px] font-bold px-4 py-2 rounded-full transition-all border ${formData.isUnknownLocation ? 'bg-gold text-white border-gold' : 'bg-transparent text-luxury-gray border-cream-dark hover:border-gold hover:text-gold'}`}
                >
                  <MapPin size={14} /> 
                  {formData.isUnknownLocation ? "Oteller Listesine Dön" : "İstediğim (Otel/Adres) Listede Yok"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-luxury-gray uppercase tracking-widest ml-1 italic">Nereden Alınacaksınız? *</label>
                  {formData.isUnknownLocation ? (
                    <textarea
                      value={formData.manualPickup}
                      onChange={(e) => setFormData({...formData, manualPickup: e.target.value})}
                      placeholder="Tam adresi veya lokasyon detayını yazınız..."
                      className="w-full bg-cream/30 border border-gold/30 p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all text-xs font-bold text-luxury-dark h-[110px] resize-none"
                    />
                  ) : (
                    <SearchableDropdown 
                      value={formData.pickupHotel}
                      onChange={(val) => {
                        if (val === formData.dropoffHotel && val !== "") {
                          alert("Alınacak yer ile bırakılacak yer aynı olamaz!");
                          return;
                        }
                        setFormData({...formData, pickupHotel: val});
                      }}
                      placeholder="Alınacağınız Oteli Seçiniz"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-luxury-gray uppercase tracking-widest ml-1 italic">Nereye Bırakılacaksınız? *</label>
                  {formData.isUnknownLocation ? (
                    <textarea
                      value={formData.manualDropoff}
                      onChange={(e) => setFormData({...formData, manualDropoff: e.target.value})}
                      placeholder="Tam adresi veya lokasyon detayını yazınız..."
                      className="w-full bg-cream/30 border border-gold/30 p-5 rounded-2xl outline-none focus:border-gold focus:bg-white transition-all text-xs font-bold text-luxury-dark h-[110px] resize-none"
                    />
                  ) : (
                    <SearchableDropdown 
                      value={formData.dropoffHotel}
                      onChange={(val) => {
                        if (val === formData.pickupHotel && val !== "") {
                          alert("Alınacak yer ile bırakılacak yer aynı olamaz!");
                          return;
                        }
                        setFormData({...formData, dropoffHotel: val});
                      }}
                      placeholder="Bırakılacağınız Oteli Seçiniz"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] text-gold italic border-b border-cream-dark pb-4">
                <Plus size={18} /> Ekstra Konfor ve Talepler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ExtraItem id="nameMeet" icon={UserCheck} title="İsimle Karşılama" price={EXTRAS_PRICES.nameMeet} value={extras.nameMeet} onUpdate={updateExtra} isToggle />
                <ExtraItem id="babySeat" icon={Baby} title="Bebek Koltuğu" price={EXTRAS_PRICES.babySeat} value={extras.babySeat} onUpdate={updateExtra} />
                <ExtraItem id="stroller" icon={Baby} title="Puset" price={EXTRAS_PRICES.stroller} value={extras.stroller} onUpdate={updateExtra} />
                <ExtraItem id="booster" icon={Baby} title="Yükseltici" price={EXTRAS_PRICES.booster} value={extras.booster} onUpdate={updateExtra} />
                <ExtraItem id="wine" icon={Wine} title="Şarap (75cl)" price={EXTRAS_PRICES.wine} value={extras.wine} onUpdate={updateExtra} />
                <ExtraItem id="beer" icon={Beer} title="Bira" price={EXTRAS_PRICES.beer} value={extras.beer} onUpdate={updateExtra} />
                <ExtraItem id="champagne" icon={Wine} title="Şampanya" price={EXTRAS_PRICES.champagne} value={extras.champagne} onUpdate={updateExtra} />
                <ExtraItem id="simCard" icon={Smartphone} title="Sim Kart" price={EXTRAS_PRICES.simCard} value={extras.simCard} onUpdate={updateExtra} />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3 border-b border-cream-dark pb-4">
                <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold"><Users size={18} /></div>
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-luxury-dark italic">Kişi Bilgileri</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-luxury-gray uppercase tracking-widest ml-1 italic">Müşteri Ad Soyad *</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={16} />
                    <input 
                      type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-cream/20 border border-cream-dark pl-12 pr-4 py-4 rounded-xl outline-none focus:border-gold text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-luxury-gray uppercase tracking-widest ml-1 italic">İletişim E-Posta *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={16} />
                    <input 
                      type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-cream/20 border border-cream-dark pl-12 pr-4 py-4 rounded-xl outline-none focus:border-gold text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-luxury-gray uppercase tracking-widest ml-1 italic">Mobil Telefon No *</label>
                  <div className="flex gap-2 relative">
                    <div className="relative min-w-[90px]">
                      <button 
                        type="button"
                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                        className="w-full h-full bg-cream/20 border border-cream-dark rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black hover:border-gold transition-all px-2"
                      >
                        <Globe size={12} className="text-gold" /> {formData.countryCode}
                      </button>
                      <AnimatePresence>
                        {isCountryOpen && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-56 bg-white border border-cream-dark rounded-2xl shadow-2xl z-[100] p-2 overflow-hidden flex flex-col max-h-64">
                            <div className="relative p-2 border-b border-cream-dark/50">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={12} />
                              <input type="text" placeholder="Ülke Ara..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full bg-cream/30 pl-8 pr-3 py-2 rounded-lg text-[10px] font-bold outline-none"/>
                            </div>
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                              {filteredCountryCodes.map(c => (
                                <button 
                                  type="button"
                                  key={c.code + c.label} 
                                  onClick={() => {setFormData({...formData, countryCode: c.code}); setIsCountryOpen(false);}} 
                                  className="w-full flex items-center justify-between p-3 hover:bg-gold/5 rounded-xl transition-all text-left"
                                >
                                  <span className="text-[9px] font-black text-luxury-dark">{c.label}</span>
                                  <span className="text-[9px] font-black text-gold">{c.code}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="relative w-full">
                      <input 
                        type="tel" 
                        maxLength={13}

                        value={formData.phone} 
                        onChange={(e) => setFormData({
  ...formData, 
  phone: e.target.value.replace(/[^0-9]/g, '') 
})}
                        className="w-full flex-1 bg-cream/20 border border-cream-dark px-4 py-4 rounded-xl outline-none focus:border-gold text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-luxury-dark ml-2">
                <MessageSquare size={16} className="text-gold" /> Özel Notlarınız
              </label>
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-cream/30 border border-cream-dark p-6 rounded-3xl outline-none focus:border-gold focus:bg-white h-32 transition-all text-xs font-bold text-luxury-dark placeholder:text-luxury-gray/40 shadow-inner" 
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Ticket className="text-gold" size={20} />
              <h3 className="text-[12px] font-black uppercase tracking-widest text-luxury-dark">İNDİRİM KUPONU</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-cream/30 border border-cream-dark p-5 rounded-xl outline-none focus:border-gold transition-all uppercase text-xs font-black tracking-widest" 
              />
              <button 
                type="button"
                onClick={handleApplyPromo} 
                className="relative z-10 bg-gold text-white px-10 py-5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-luxury-black transition-all shadow-lg border border-gold cursor-pointer"
              >
                UYGULA
              </button>
            </div>
            {promoStatus === "loading" && <p className="mt-4 text-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Kontrol Ediliyor...</p>}
            {promoStatus === "success" && <p className="mt-4 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">✓ İndirim Başarıyla Uygulandı! (%{promoRate} İndirim)</p>}
            {promoStatus === "error" && <p className="mt-4 text-red-500 text-[10px] font-bold uppercase tracking-widest">✕ Geçersiz, kullanılmış veya süresi dolmuş kupon!</p>}
            {promoStatus === "used" && <p className="mt-4 text-red-500 text-[10px] font-bold uppercase tracking-widest">✕ Bu kuponun genel kullanım limiti dolmuş!</p>}
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 backdrop-blur-2xl p-8 rounded-[3rem] sticky top-28 border border-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gold" />
            
            <h3 className="font-black uppercase tracking-[0.2em] text-sm mb-8 text-luxury-dark border-b border-cream-dark pb-4 italic text-center">Transfer Özeti</h3>
            
            <div className="space-y-6">
              <div className="bg-cream/40 p-5 rounded-2xl border border-cream-dark/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-luxury-gray uppercase">SEÇİLEN ARAÇ</span>
                  <span className="text-[11px] font-black text-gold uppercase italic">{vehicleName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-luxury-gray uppercase">YOLCU SAYISI</span>
                  <span className="text-[10px] font-bold text-luxury-dark uppercase">{formData.adults} Yetişkin, {formData.children} Çocuk</span>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="relative pl-6 border-l-2 border-gold/30 space-y-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gold border-4 border-white shadow-sm" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-gold uppercase tracking-widest block">NEREDEN</span>
                    <span className="text-[11px] font-bold text-luxury-dark uppercase leading-tight block">
                      {formData.pickupRegion || "Seçilmedi"}
                    </span>
                    <span className="text-[9px] font-medium text-luxury-gray uppercase leading-tight flex items-start gap-1">
                      <MapPin size={10} className="mt-[2px] shrink-0 text-gold/70" />
                      {actualPickup || "Otel/Adres Belirtilmedi"}
                    </span>
                  </div>
                  
                  <div className="absolute -left-[9px] bottom-0 w-4 h-4 rounded-full bg-luxury-dark border-4 border-white shadow-sm" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-luxury-gray/60 uppercase tracking-widest block">NEREYE</span>
                    <span className="text-[11px] font-bold text-luxury-dark uppercase leading-tight block">
                      {formData.dropoffRegion || "Seçilmedi"}
                    </span>
                    <span className="text-[9px] font-medium text-luxury-gray uppercase leading-tight flex items-start gap-1">
                      <MapPin size={10} className="mt-[2px] shrink-0 text-luxury-gray/70" />
                      {actualDropoff || "Otel/Adres Belirtilmedi"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-luxury-dark bg-cream/30 px-4 py-2 rounded-xl border border-cream-dark/50 w-full mt-4">
                  <Calendar size={12} className="text-gold" /> {formData.date} | {formData.time}
                </div>
              </div>

              {extrasTotalPrice > 0 && (
                <div className="pt-4 space-y-3 border-t border-cream-dark/50">
                  <span className="text-[9px] font-black text-luxury-gray uppercase tracking-widest">SEÇİLEN EKSTRALAR</span>
                  <div className="space-y-2">
                    {Object.entries(extras).map(([key, val]: any) => {
                      if (!val) return null;
                      const title = key === 'nameMeet' ? 'Karşılama' : key.toUpperCase();
                      const count = typeof val === 'number' ? `x${val}` : '';
                      const price = (typeof val === 'number' ? val : 1) * (EXTRAS_PRICES as any)[key];
                      return (
                        <div key={key} className="flex justify-between items-center text-[10px] font-bold text-luxury-dark">
                          <span className="flex gap-2 items-center"><CheckCircle2 size={10} className="text-gold" /> {title} {count}</span>
                          <span className="text-gold">{formatPrice(price)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-3 border-t border-cream-dark/50">
                <span className="text-[9px] font-black text-luxury-gray uppercase tracking-widest">MÜŞTERİ BİLGİLERİ</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-luxury-dark">
                    <span className="text-luxury-gray">Ad Soyad</span>
                    <span className="text-right truncate max-w-[130px]">{formData.fullName || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-luxury-dark">
                    <span className="text-luxury-gray">E-Posta</span>
                    <span className="text-right truncate max-w-[130px]">{formData.email || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-luxury-dark">
                    <span className="text-luxury-gray">Telefon</span>
                    <span className="text-right">{formData.phone ? `${formData.countryCode} ${formData.phone}` : "-"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-luxury-dark/5 space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-luxury-gray uppercase tracking-widest">ÖDENECEK TUTAR</span>
                    <span className="text-luxury-dark font-black text-xs">TOPLAM</span>
                  </div>
                  <div className="flex flex-col items-end">
                    {promoRate > 0 && <span className="text-[10px] text-red-500 line-through font-bold">{formatPrice(activeBasePrice)}</span>}
                    <span className="text-4xl font-black text-luxury-dark tracking-tighter italic">
  {formatPrice(finalPriceValue)}
</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 space-y-4">
              <div className="flex items-start gap-3 group">
                <input 
                  type="checkbox" 
                  checked={formData.agreedToTerms} 
                  onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                  className="mt-1 w-4 h-4 accent-gold cursor-pointer shrink-0" 
                />
                <button 
                  onClick={() => setShowTermsModal(true)}
                  className="text-[10px] font-bold text-luxury-gray group-hover:text-gold transition-colors leading-relaxed text-left"
                >
                  Ön Bilgilendirme ve Uzak Mesafeli Satış Sözleşmesi Okudum ve onaylıyorum.
                </button>
              </div>
              
              <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-[8px] font-bold text-emerald-700 uppercase tracking-widest">GÜVENLİ ÖDEME SİSTEMİ</span>
              </div>
            </div>

            <button 
              onClick={handleConfirm} 
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-luxury-black text-white font-black py-6 rounded-2xl transition-all uppercase text-[12px] tracking-[0.3em] shadow-xl relative overflow-hidden group/btn disabled:opacity-50 border border-gold"
            >
                {isSubmitting ? (
                  <span className="relative z-10 flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> İŞLENİYOR...</span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-3">ÖDEME ADIMINA GEÇ <ArrowRight size={18} /></span>
                )}
                <motion.div initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.7 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] z-5" />
            </button>
          </motion.div>
        </div>

      </div>

      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowTermsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-cream-dark pb-4">
                <h3 className="text-sm font-black text-luxury-dark uppercase tracking-widest italic">Satış Sözleşmesi & Bilgilendirme</h3>
                <button onClick={() => setShowTermsModal(false)} className="text-luxury-gray hover:text-gold transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-4 text-[11px] font-bold text-luxury-gray leading-relaxed space-y-4">
                <p>1. YOLCU TAŞIMA POLİTİKASI... 
                  GENEL HÜKÜMLER
Xrem Transfer, tüm transfer hizmetlerini yasal mevzuatlara uygun, belgeli ve sigortalı araçlarla gerçekleştirmektedir. Hizmet alan tüm yolcularımız, seyahat süresince koltuk sigortası ve genel trafik sigortası güvencesi altındadır.

REZERVASYON VE ONAY
Rezervasyonlar, web sitesi üzerinden veya çağrı merkezi aracılığıyla yapılmaktadır. Yapılan rezervasyonlar, tarafınıza PNR kodu içeren bir konfirme mesajı veya e-posta iletilmesiyle geçerlilik kazanır. Uçuş saatlerindeki değişiklikler yolcu tarafından bildirilmelidir.

BEKLEME SÜRELERİ
Havalimanı karşılamalarında, uçağınızın inişinden itibaren 60 dakika bekleme süresi ücretsizdir. Otel veya adresten alımlarda bekleme süresi 15 dakika ile sınırlıdır. Bu süreleri aşan durumlarda şoförümüz veya operasyon merkezimiz sizinle iletişime geçmeye çalışacaktır.

İPTAL VE İADE KOŞULLARI
Transfer saatine 24 saat kalaya kadar yapılan iptallerde ödemenin tamamı iade edilir. 24 saatten az, 12 saatten fazla kalan sürelerdeki iptallerde %50 kesinti uygulanır. 12 saatten az kalan sürelerde veya araç adrese ulaştıktan sonra yapılan iptallerde iade yapılmamaktadır.

BAGAJ POLİTİKASI
Her yolcunun bir adet standart valiz ve bir adet el bagajı hakkı bulunmaktadır. Bebek arabası, tekerlekli sandalye veya spor ekipmanları (golf çantası, kayak takımı vb.) rezervasyon esnasında mutlaka bildirilmelidir. Bildirilmeyen aşırı bagajlar kapasite aşımına neden olursa ek araç gerekebilir.

ARAÇ İÇİ KURALLAR
T.C. yasaları gereği araçlarımızın içerisinde sigara ve tütün mamullerinin tüketilmesi kesinlikle yasaktır. Yolcuların araç içerisinde alkol tüketmesi ve araç güvenliğini tehlikeye atacak davranışlarda bulunması durumunda şoför transferi sonlandırma yetkisine sahiptir.

EVCİL HAYVAN TAŞIMA
Evcil hayvanlar, yalnızca kafes içerisinde ve rezervasyon aşamasında bilgi verilmesi şartıyla taşınabilmektedir. Kafes dışındaki evcil hayvanlar, araç döşemelerine zarar verebileceği ve alerjik durumlar oluşturabileceği için kabul edilmemektedir.

YOLCU SORUMLULUKLARI
Yolcular, transfer saatinde belirlenen noktada hazır bulunmakla yükümlüdür. Araç içerisindeki kişisel eşyaların unutulması durumunda Xrem Transfer sorumluluk kabul etmez, ancak unutulan eşyanın bulunması durumunda yolcuya ulaştırılması için azami gayret gösterilir.
                </p>
                <p>2. KİŞİSEL VERİLERİN KORUNMASI KANUNU...
                  01
VERİ SORUMLUSU
6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verileriniz veri sorumlusu olarak XREM TURİZM TAŞIMACILIK LTD. ŞTİ. tarafından saniyeler içinde aşağıda açıklanan kapsamda işlenebilecektir.

02
VERİLERİN İŞLENME AMACI
Kişisel verileriniz; transfer hizmetlerimizin saniyeler içinde planlanması, lojistik operasyonların mühürlenmesi, rezervasyon süreçlerinin yönetimi, yasal yükümlülüklerin yerine getirilmesi ve VIP hizmet kalitemizin artırılması amacıyla işlenmektedir.

03
AKTARILAN ÜÇÜNCÜ TARAFLAR
Toplanan kişisel verileriniz; hizmetin ifası için gerekli olan iş ortaklarımıza (şoförler, saha personeli), kanunen yetkili kamu kurumlarına ve özel kişilere, KVKK'nın 8. ve 9. maddelerinde belirtilen şartlar çerçevesinde saniyeler içinde aktarılabilmektedir.

04
TOPLAMA YÖNTEMİ VE HUKUKİ SEBEP
Kişisel verileriniz; web sitemiz, çağrı merkezimiz veya fiziksel kanallar aracılığıyla saniyeler içinde, sözleşmenin kurulması ve ifası, veri sorumlusunun hukuki yükümlülüğü ve ilgili kişinin temel haklarına zarar vermemek kaydıyla meşru menfaatler sebebiyle toplanır.

05
VERİ SAHİBİNİN HAKLARI (MADDE 11)
Herkes, veri sorumlusuna başvurarak kendisiyle ilgili; verilerinin işlenip işlenmediğini öğrenme, düzeltme, silme veya yok edilmesini isteme, münhasıran otomatik sistemler vasıtasıyla analiz edilmesine itiraz etme ve zararın giderilmesini talep etme hakkına sahiptir.
                </p>
                <p>3. İPTAL VE İADE KOŞULLARI... 
                  1
TAM İADE KOŞULLARI
Transfer saatinize 24 saat ve daha fazla süre kala yapılan iptal taleplerinde, ödemiş olduğunuz tutarın tamamı saniyeler içinde iade süreci kapsamına alınır. Lojistik planlamanın henüz kesinleşmediği bu aşamada hiçbir kesinti yapılmadan mühürleme iptal edilir.

2
%50 İADE DURUMU
Transfer saatinize 24 saatten az, 12 saatten fazla süre kalan durumlarda yapılan iptallerde, operasyonel hazırlıkların başlaması nedeniyle toplam tutarın %50'si tutarında bir kesinti uygulanır. Kalan tutar saniyeler içinde hesabınıza mühürlenir.

3
İADE YAPILMAYAN DURUMLAR
Transfer saatinize 12 saatten az süre kala yapılan iptallerde veya aracın adrese ulaşmasından sonra gerçekleşen 'No-Show' (bulunmama) durumlarında iade yapılmamaktadır. Lojistik hattımız o saat dilimi için saniyeler içinde size rezerve edildiğinden bu kural mühürlenmiştir.

4
UÇUŞ GECİKMELERİ VE DEĞİŞİKLİKLER
Uçuşlarınızda meydana gelen rötarlar saniyeler içinde operasyon merkezimiz tarafından takip edilir. Havalimanı inişli transferlerde uçuş rötarı nedeniyle yaşanan gecikmelerde hiçbir ek ücret talep edilmez ve iade hakkınız sarsıntısız bir şekilde korunur.

5
İADE SÜRECİ VE GERİ ÖDEME
Onaylanan iadeler, ödeme yapmış olduğunuz banka kartına veya kredi kartına saniyeler içinde talimatlandırılarak gönderilir. Banka sistemlerine bağlı olarak iadenin hesabınıza yansıması saniyeler içinde değil, bankanızın prosedürlerine göre 3-7 iş günü sürebilir.

6
MÜCBİR SEBEPLER
Doğal afetler, havayolu şirketlerinin uçuş iptalleri veya resmi makamlarca alınan kısıtlama kararları gibi kontrol dışı durumlarda; iptal/iade şartları lojistik ekibimizce saniyeler içinde esnetilerek misafir lehine mühürlenir.
                </p>
                <p>
                  4. GİZLİLİK VE GÜVENLİK SÖZLEŞMESİ...
                  
GİZLİLİK TAAHHÜDÜ
Xrem Transfer olarak, misafirlerimizin kişisel verilerinin korunması ve gizliliği saniyeler içinde en öncelikli lojistik görevimizdir. İşbu Gizlilik Sözleşmesi, tarafımıza sağladığınız bilgilerin hangi amaçla toplandığını ve nasıl korunduğunu saniyeler içinde mühür altına almaktadır.

TOPLANAN KİŞİSEL VERİLER
Rezervasyon sürecinde saniyeler içinde paylaştığınız; Ad, Soyad, T.C. Kimlik No, Telefon, E-posta adresi, uçuş bilgileri ve transfer güzergahı gibi veriler, sadece hizmet kalitemizi mühürlemek ve yasal zorunlulukları yerine getirmek amacıyla toplanır.

VERİLERİN KULLANIM AMACI
Kişisel verileriniz; rezervasyonunuzun doğrulanması, transfer operasyonunun saniyeler içinde planlanması, ödeme işlemlerinin güvenli mühürlenmesi ve sizlere seyahat süreciyle ilgili bilgilendirme yapılması (SMS/E-posta) amacıyla kullanılır.

VERİ GÜVENLİĞİ VE ŞİFRELEME
Bilgisayar sistemlerimizde toplanan tüm veriler saniyeler içinde SSL şifreleme yöntemleri ve modern güvenlik duvarları ile korunmaktadır. Ödeme bilgileriniz (kredi kartı verileri) sistemlerimizde saklanmaz, direkt olarak güvenli banka altyapısına mühürlenir.

ÜÇÜNCÜ ŞAHISLARLA PAYLAŞIM
Kişisel verileriniz, yasal mercilerin talepleri veya transfer hizmetinin ifası için gerekli olan operasyonel ortaklar (şoför ve saha ekibi) dışında, hiçbir ticari amaçla üçüncü şahıslara saniyeler içinde satılmaz veya kiralanmaz.

ÇEREZ (COOKIE) POLİTİKASI
Web sitemiz, kullanıcı deneyimini saniyeler içinde iyileştirmek için çerezler kullanmaktadır. Çerezler, sitenin işlevselliğini artırmak ve tercihlerini saniyeler içinde hatırlamak için kullanılan teknik verilerdir.

HAKLARINIZ VE GÜNCELLEME
6698 sayılı KVKK kapsamında, sistemimizde kayıtlı verilerinize saniyeler içinde erişme, bunları güncelleme veya silme hakkına sahipsiniz. Taleplerinizi operasyon merkezimize ileterek verilerinizi saniyeler içinde mühür altına alabilir veya sildirebilirsiniz.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BookingFinalPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />
      <div className="fixed inset-0 z-0">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/80 to-cream/95 backdrop-blur-[1px]" />
      </div>
      <Suspense fallback={<div className="h-screen bg-cream flex items-center justify-center"><div className="w-10 h-10 border-4 border-gold border-t-transparent animate-spin rounded-full"></div></div>}>
        <BookingFinalContent />
      </Suspense>
      <Footer />
    </main>
  );
}