"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const translations: any = {
  tr: {
    home: "ANA SAYFA", fleet: "FİLOMUZ", services: "HİZMETLER", regions: "BÖLGELER", contact: "İLETİŞİM", sss: "SSS",
    tagline: "PREMİUM TRANSFER DENEYİMİ", oneWay: "Tek Yön", roundTrip: "Gidiş - Dönüş", pickup: "ALIŞ NOKTASI", dropoff: "VARIŞ NOKTASI",
    date: "TARİH", time: "SAAT", passengers: "YOLCU", searchBtn: "Fiyat Ara & Rezervasyon Yap", placeholderPickup: "Havalimanı, Otel veya Adres...",
    placeholderDropoff: "Nereye gideceksiniz?", adult: "Yetişkin", child: "Çocuk", loginTitle: "ÜYE GİRİŞİ", registerTitle: "YENİ KAYIT",
    email: "E-POSTA ADRESİ", password: "ŞİFRE", loginBtn: "GİRİŞ YAP", registerBtn: "KAYIT OL", logoutBtn: "ÇIKIŞ YAP", profile: "PROFİLİM",
    noAccount: "Henüz hesabınız yok mu?", hasAccount: "Zaten üye misiniz?", forgotPassword: "Şifremi Unuttum", welcome: "Tekrar Hoş Geldiniz",
    errorEmail: "Lütfen geçerli bir e-posta girin.", errorPassword: "Şifre en az 6 karakter olmalıdır.", sssTitle: "Sıkça Sorulan Sorular",
    fleetTitle: "ÖZEL VİP FİLOMUZ", fleetSub: "Konfor ve Güvenliğin Zirvesinde Yolculuk", capacity: "Kapasite", luggage: "Bagaj",
    wifi: "Ücretsiz Wi-Fi", drinks: "Soğuk İçecekler", bookNow: "Hemen Rezervasyon Yap", departureLabel: "(Gidiş)", returnLabel: "(Dönüş)",
    returnPickupPlaceholder: "Dönüş Alış Noktası", returnDropoffPlaceholder: "Dönüş Varış Noktası", select: "Seçiniz", returnDate: "DÖNÜŞ TARİHİ",
    timeLabel: "SAAT", viewAll: "Tümünü Gör", readMore: "Devamını Oku", contactUs: "Bize Ulaşın", whatsappSupport: "WhatsApp Destek",
    servicesTitle: "Hizmetlerimiz", servicesSubtitle: "Size Özel Premium Transfer Çözümleri", featuresTitle: "Neden Bizi Seçmelisiniz?",
    featuresSubtitle: "Sizi özel hissettirecek ayrıcalıklarımız", statsTitle: "Rakamlarla Biz", howItWorksTitle: "Nasıl Çalışır?",
    howItWorksSubtitle: "3 Basit Adımda Transferinizi Planlayın", faqTitle: "Sıkça Sorulan Sorular", faqSubtitle: "Aklınızdaki Tüm Soruların Cevapları",
    testimonialsTitle: "Müşteri Yorumları", promoTitle: "Özel İndirimler", footerAboutTitle: "Hakkımızda", footerLinksTitle: "Hızlı Linkler",
    footerContactTitle: "İletişim", rightsReserved: "Tüm Hakları Saklıdır.", corporate: "Kurumsal", policies: "Politikalar", operation: "7/24 Operasyon",
    footerRights: "TÜM HAKLARI SAKLIDIR.", securePayment: "256-BIT SSL GÜVENLİ ÖDEME SİSTEMİ", faqTitle1: "MERAK", faqTitle2: "EDİLENLER"
  },
  en: {
    home: "HOME", fleet: "FLEET", services: "SERVICES", regions: "REGIONS", contact: "CONTACT", sss: "FAQ",
    tagline: "PREMIUM TRANSFER EXPERIENCE", oneWay: "One Way", roundTrip: "Round Trip", pickup: "PICKUP LOCATION", dropoff: "DESTINATION",
    date: "DATE", time: "TIME", passengers: "PASSENGERS", searchBtn: "Search Price & Book Now", placeholderPickup: "Airport, Hotel or Address...",
    placeholderDropoff: "Where are you going?", adult: "Adult", child: "Child", loginTitle: "USER LOGIN", registerTitle: "REGISTER",
    email: "EMAIL ADDRESS", password: "PASSWORD", loginBtn: "LOGIN", registerBtn: "REGISTER", logoutBtn: "LOGOUT", profile: "MY PROFILE",
    noAccount: "Don't have an account?", hasAccount: "Already a member?", forgotPassword: "Forgot Password?", welcome: "Welcome Back",
    errorEmail: "Please enter a valid email.", errorPassword: "Password must be at least 6 characters.", sssTitle: "Frequently Asked Questions",
    fleetTitle: "OUR EXCLUSIVE VIP FLEET", fleetSub: "Journey at the Peak of Comfort and Safety", capacity: "Capacity", luggage: "Luggage",
    wifi: "Free Wi-Fi", drinks: "Cold Drinks", bookNow: "Book Now", departureLabel: "(Departure)", returnLabel: "(Return)",
    returnPickupPlaceholder: "Return Pickup Location", returnDropoffPlaceholder: "Return Dropoff Location", select: "Select", returnDate: "RETURN DATE",
    timeLabel: "TIME", viewAll: "View All", readMore: "Read More", contactUs: "Contact Us", whatsappSupport: "WhatsApp Support",
    servicesTitle: "Our Services", servicesSubtitle: "Premium Transfer Solutions Tailored For You", featuresTitle: "Why Choose Us?",
    featuresSubtitle: "Privileges that make you feel special", statsTitle: "Us in Numbers", howItWorksTitle: "How It Works?",
    howItWorksSubtitle: "Plan Your Transfer in 3 Simple Steps", faqTitle: "Frequently Asked Questions", faqSubtitle: "Answers to All Your Questions",
    testimonialsTitle: "Testimonials", promoTitle: "Special Offers", footerAboutTitle: "About Us", footerLinksTitle: "Quick Links",
    footerContactTitle: "Contact", rightsReserved: "All Rights Reserved.", corporate: "Corporate", policies: "Policies", operation: "24/7 Operation",
    footerRights: "ALL RIGHTS RESERVED.", securePayment: "256-BIT SSL SECURE PAYMENT SYSTEM", faqTitle1: "FREQUENTLY", faqTitle2: "ASKED QUESTIONS"
  },
  de: {
    home: "STARTSEITE", fleet: "FLOTTE", services: "DIENSTE", regions: "REGIONEN", contact: "KONTAKT", sss: "FAQ",
    tagline: "PREMIUM TRANSFER ERFAHRUNG", oneWay: "Einfache Fahrt", roundTrip: "Hin- und Rückfahrt", pickup: "ABHOLORT", dropoff: "ZIELORT",
    date: "DATUM", time: "ZEIT", passengers: "FAHRGÄSTE", searchBtn: "Preis suchen & Buchen", placeholderPickup: "Flughafen, Hotel oder Adresse...",
    placeholderDropoff: "Wohin möchten Sie?", adult: "Erwachsener", child: "Kind", loginTitle: "ANMELDEN", registerTitle: "REGISTRIEREN",
    email: "E-MAIL-ADRESSE", password: "PASSWORT", loginBtn: "EINLOGGEN", registerBtn: "REGISTRIEREN", logoutBtn: "AUSLOGGEN", profile: "PROFIL",
    noAccount: "Kein Konto?", hasAccount: "Schon Mitglied?", forgotPassword: "Passwort vergessen?", welcome: "Willkommen zurück",
    errorEmail: "Gültige E-Mail eingeben.", errorPassword: "Mindestens 6 Zeichen.", sssTitle: "Häufig gestellte Fragen",
    fleetTitle: "UNSERE EXKLUSIVE VIP-FLOTTE", fleetSub: "Reisen auf höchstem Niveau", capacity: "Kapazität", luggage: "Gepäck",
    wifi: "Gratis Wi-Fi", drinks: "Kaltgetränke", bookNow: "Jetzt buchen", departureLabel: "(Hinfahrt)", returnLabel: "(Rückfahrt)",
    returnPickupPlaceholder: "Rückfahrt Abholort", returnDropoffPlaceholder: "Rückfahrt Zielort", select: "Wählen", returnDate: "RÜCKDATUM",
    timeLabel: "UHRZEIT", viewAll: "Alle ansehen", readMore: "Weiterlesen", contactUs: "Kontaktieren Sie uns", whatsappSupport: "WhatsApp Support",
    servicesTitle: "Unsere Dienste", servicesSubtitle: "Premium-Lösungen für Sie", featuresTitle: "Warum wir?",
    featuresSubtitle: "Besondere Privilegien", statsTitle: "Statistiken", howItWorksTitle: "Wie es funktioniert?",
    howItWorksSubtitle: "In 3 Schritten planen", faqTitle: "FAQ", faqSubtitle: "Alle Antworten hier",
    testimonialsTitle: "Bewertungen", promoTitle: "Angebote", footerAboutTitle: "Über uns", footerLinksTitle: "Quick-Links",
    footerContactTitle: "Kontakt", rightsReserved: "Alle Rechte vorbehalten.", corporate: "Unternehmen", policies: "Richtlinien", operation: "24/7 Betrieb",
    footerRights: "ALLE RECHTE VORBEHALTEN.", securePayment: "256-BIT SSL SICHERE ZAHLUNG", faqTitle1: "HÄUFIGE", faqTitle2: "FRAGEN"
  },
  ru: {
    home: "ГЛАВНАЯ", fleet: "ФЛОТ", services: "УСЛУГИ", regions: "РЕГИОНЫ", contact: "КОНТАКТЫ", sss: "ЧАВО",
    tagline: "ПРЕМИАЛЬНЫЙ ТРАНСФЕР", oneWay: "В одну сторону", roundTrip: "Туда и обратно", pickup: "МЕСТО ПОДАЧИ", dropoff: "ПУНКТ НАЗНАЧЕНИЯ",
    date: "ДАТА", time: "ВРЕМЯ", passengers: "ПАССАЖИРЫ", searchBtn: "Найти цену и забронировать", placeholderPickup: "Аэропорт, отель или адрес...",
    placeholderDropoff: "Куда вы едете?", adult: "Взрослый", child: "Ребенок", loginTitle: "ВХОД", registerTitle: "РЕГИСТРАЦИЯ",
    email: "EMAIL", password: "ПАРОЛЬ", loginBtn: "ВОЙТИ", registerBtn: "РЕГИСТРАЦИЯ", logoutBtn: "ВЫЙТИ", profile: "ПРОФИЛЬ",
    noAccount: "Нет аккаунта?", hasAccount: "Уже зарегистрированы?", forgotPassword: "Забыли пароль?", welcome: "С возвращением",
    errorEmail: "Введите корректный email.", errorPassword: "Минимум 6 символов.", sssTitle: "Часто задаваемые вопросы",
    fleetTitle: "НАШ ЭКСКЛЮЗИВНЫЙ ВИП-ФЛОТ", fleetSub: "Комфорт и безопасность", capacity: "Вместимость", luggage: "Багаж",
    wifi: "Бесплатный Wi-Fi", drinks: "Напитки", bookNow: "Забронировать", departureLabel: "(Туда)", returnLabel: "(Обратно)",
    returnPickupPlaceholder: "Место обратного забора", returnDropoffPlaceholder: "Место обратной высадки", select: "Выбрать", returnDate: "ДАТА ОБРАТНО",
    timeLabel: "ВРЕМЯ", viewAll: "Смотреть все", readMore: "Подробнее", contactUs: "Связаться с нами", whatsappSupport: "Поддержка WhatsApp",
    servicesTitle: "Наши услуги", servicesSubtitle: "Премиум решения для вас", featuresTitle: "Почему мы?",
    featuresSubtitle: "Ваши привилегии", statsTitle: "Цифры", howItWorksTitle: "Как это работает?",
    howItWorksSubtitle: "3 простых шага", faqTitle: "Вопросы", faqSubtitle: "Все ответы здесь",
    testimonialsTitle: "Отзывы", promoTitle: "Акции", footerAboutTitle: "О нас", footerLinksTitle: "Ссылки",
    footerContactTitle: "Контакты", rightsReserved: "Все права защищены.", corporate: "Корпорация", policies: "Политика", operation: "24/7 Работа",
    footerRights: "ВСЕ ПРАВА ЗАЩИЩЕНЫ.", securePayment: "БЕЗОПАСНАЯ ОПЛАТА SSL", faqTitle1: "ЧАСТЫЕ", faqTitle2: "ВОПРОСЫ"
  },
  es: {
    home: "INICIO", fleet: "FLOTA", services: "SERVICIOS", regions: "REGIONES", contact: "CONTACTO", sss: "FAQ",
    tagline: "EXPERIENCIA DE TRASLADO PREMIUM", oneWay: "Solo ida", roundTrip: "Ida y vuelta", pickup: "PUNTO DE RECOGIDA", dropoff: "DESTINO",
    date: "FECHA", time: "HORA", passengers: "PASAJEROS", searchBtn: "Buscar precio y reservar", placeholderPickup: "Aeropuerto, hotel o dirección...",
    placeholderDropoff: "¿A dónde vas?", adult: "Adulto", child: "Niño", loginTitle: "INICIAR SESIÓN", registerTitle: "REGISTRARSE",
    email: "CORREO ELECTRÓNICO", password: "CONTRASEÑA", loginBtn: "ENTRAR", registerBtn: "REGISTRARSE", logoutBtn: "SALIR", profile: "MI PERFIL",
    noAccount: "¿No tienes cuenta?", hasAccount: "¿Ya eres miembro?", forgotPassword: "¿Olvidaste tu contraseña?", welcome: "Bienvenido de nuevo",
    errorEmail: "Correo no válido.", errorPassword: "Mínimo 6 caracteres.", sssTitle: "Preguntas frecuentes",
    fleetTitle: "NUESTRA EXCLUSIVA FLOTA VIP", fleetSub: "Viaje en la cima del confort", capacity: "Capacidad", luggage: "Equipaje",
    wifi: "Wi-Fi gratis", drinks: "Bebidas frías", bookNow: "Reservar ahora", departureLabel: "(Ida)", returnLabel: "(Vuelta)",
    returnPickupPlaceholder: "Recogida de vuelta", returnDropoffPlaceholder: "Destino de vuelta", select: "Seleccionar", returnDate: "FECHA VUELTA",
    timeLabel: "HORA", viewAll: "Ver todo", readMore: "Leer más", contactUs: "Contáctenos", whatsappSupport: "Soporte WhatsApp",
    servicesTitle: "Servicios", servicesSubtitle: "Soluciones a su medida", featuresTitle: "¿Por qué elegirnos?",
    featuresSubtitle: "Privilegios especiales", statsTitle: "Estadísticas", howItWorksTitle: "¿Cómo funciona?",
    howItWorksSubtitle: "3 pasos sencillos", faqTitle: "Preguntas", faqSubtitle: "Respuestas aquí",
    testimonialsTitle: "Opiniones", promoTitle: "Ofertas", footerAboutTitle: "Sobre nosotros", footerLinksTitle: "Enlaces",
    footerContactTitle: "Contacto", rightsReserved: "Todos los derechos reservados.", corporate: "Corporativo", policies: "Políticas", operation: "24/7 Operación",
    footerRights: "DERECHOS RESERVADOS.", securePayment: "PAGO SEGURO SSL", faqTitle1: "PREGUNTAS", faqTitle2: "FRECUENTES"
  },
  it: {
    home: "HOME", fleet: "FLOTTA", services: "SERVIZI", regions: "REGIONI", contact: "CONTATTI", sss: "FAQ",
    tagline: "ESPERIENZA TRASFERIMENTO PREMIUM", oneWay: "Sola andata", roundTrip: "Andata e ritorno", pickup: "PUNTO DI RITIRO", dropoff: "DESTINAZIONE",
    date: "DATA", time: "ORA", passengers: "PASSEGGERI", searchBtn: "Cerca prezzo e prenota", placeholderPickup: "Aeroporto, hotel o indirizzo...",
    placeholderDropoff: "Dove stai andando?", adult: "Adulto", child: "Bambino", loginTitle: "ACCEDI", registerTitle: "REGISTRATI",
    email: "INDIRIZZO EMAIL", password: "PASSWORD", loginBtn: "ACCEDI", registerBtn: "REGISTRATI", logoutBtn: "ESCI", profile: "PROFILO",
    noAccount: "Nessun account?", hasAccount: "Già registrato?", forgotPassword: "Password dimenticata?", welcome: "Bentornato",
    errorEmail: "Inserisci email valida.", errorPassword: "Minimo 6 caratteri.", sssTitle: "Domande Frequenti",
    fleetTitle: "LA NOSTRA FLOTTA VIP", fleetSub: "Massimo comfort e sicurezza", capacity: "Capacità", luggage: "Bagaglio",
    wifi: "Wi-Fi gratuito", drinks: "Bevande fresche", bookNow: "Prenota ora", departureLabel: "(Partenza)", returnLabel: "(Ritorno)",
    returnPickupPlaceholder: "Ritiro ritorno", returnDropoffPlaceholder: "Destinazione ritorno", select: "Seleziona", returnDate: "DATA RITORNO",
    timeLabel: "ORA", viewAll: "Vedi tutti", readMore: "Leggi di più", contactUs: "Contattaci", whatsappSupport: "Supporto WhatsApp",
    servicesTitle: "I nostri servizi", servicesSubtitle: "Soluzioni su misura", featuresTitle: "Perché noi?",
    featuresSubtitle: "I tuoi privilegi", statsTitle: "Numeri", howItWorksTitle: "Come funziona?",
    howItWorksSubtitle: "3 semplici passaggi", faqTitle: "Domande", faqSubtitle: "Tutte le risposte",
    testimonialsTitle: "Recensioni", promoTitle: "Offerte", footerAboutTitle: "Chi siamo", footerLinksTitle: "Link rapidi",
    footerContactTitle: "Contatti", rightsReserved: "Tutti i diritti riservati.", corporate: "Aziendale", policies: "Politiche", operation: "24/7 Operazione",
    footerRights: "DIRITTI RISERVATI.", securePayment: "PAGAMENTO SICURO SSL", faqTitle1: "DOMANDE", faqTitle2: "FREQUENTI"
  },
  pt: {
    home: "INÍCIO", fleet: "FROTA", services: "SERVIÇOS", regions: "REGIÕES", contact: "CONTATO", sss: "FAQ",
    tagline: "EXPERIÊNCIA DE TRANSFER PREMIUM", oneWay: "Só ida", roundTrip: "Ida e volta", pickup: "PONTO DE RECOLHA", dropoff: "DESTINO",
    date: "DATA", time: "HORA", passengers: "PASSAGEIROS", searchBtn: "Pesquisar preço e reservar", placeholderPickup: "Aeroporto, hotel ou endereço...",
    placeholderDropoff: "Para onde você vai?", adult: "Adulto", child: "Criança", loginTitle: "LOGIN", registerTitle: "REGISTRO",
    email: "ENDEREÇO DE EMAIL", password: "SENHA", loginBtn: "ENTRAR", registerBtn: "REGISTRAR", logoutBtn: "SAIR", profile: "MEU PERFIL",
    noAccount: "Não tem conta?", hasAccount: "Já é membro?", forgotPassword: "Esqueceu a senha?", welcome: "Bem-vindo de volta",
    errorEmail: "Email inválido.", errorPassword: "Mínimo 6 caracteres.", sssTitle: "Perguntas Frequentes",
    fleetTitle: "NOSSA FROTA VIP EXCLUSIVA", fleetSub: "Viagem no topo do conforto", capacity: "Capacidade", luggage: "Bagagem",
    wifi: "Wi-Fi grátis", drinks: "Bebidas geladas", bookNow: "Reservar agora", departureLabel: "(Ida)", returnLabel: "(Volta)",
    returnPickupPlaceholder: "Recolha de volta", returnDropoffPlaceholder: "Destino de volta", select: "Selecionar", returnDate: "DATA VOLTA",
    timeLabel: "HORA", viewAll: "Ver tudo", readMore: "Ler mais", contactUs: "Contate-nos", whatsappSupport: "Suporte WhatsApp",
    servicesTitle: "Serviços", servicesSubtitle: "Soluções personalizadas", featuresTitle: "Por que nós?",
    featuresSubtitle: "Privilégios especiais", statsTitle: "Números", howItWorksTitle: "Como funciona?",
    howItWorksSubtitle: "3 passos simples", faqTitle: "Perguntas", faqSubtitle: "Respostas aqui",
    testimonialsTitle: "Avaliações", promoTitle: "Ofertas", footerAboutTitle: "Sobre nós", footerLinksTitle: "Links rápidos",
    footerContactTitle: "Contato", rightsReserved: "Todos os direitos reservados.", corporate: "Corporativo", policies: "Políticas", operation: "24/7 Operação",
    footerRights: "DIREITOS RESERVADOS.", securePayment: "PAGAMENTO SEGURO SSL", faqTitle1: "PERGUNTAS", faqTitle2: "FREQUENTES"
  },
  el: {
    home: "ΑΡΧΙΚΗ", fleet: "ΣΤΟΛΟΣ", services: "ΥΠΗΡΕΣΙΕΣ", regions: "ΠΕΡΙΟΧΕΣ", contact: "ΕΠΙΚΟΙΝΩΝΙΑ", sss: "FAQ",
    tagline: "PREMIUM ΕΜΠΕΙΡΙΑ ΜΕΤΑΦΟΡΑΣ", oneWay: "Απλή μετάβαση", roundTrip: "Με επιστροφή", pickup: "ΣΗΜΕΙΟ ΠΑΡΑΛΑΒΗΣ", dropoff: "ΠΡΟΟΡΙΣΜΟΣ",
    date: "ΗΜΕΡΟΜΗΝΙΑ", time: "ΩΡΑ", passengers: "ΕΠΙΒΑΤΕΣ", searchBtn: "Αναζήτηση τιμής & Κράτηση", placeholderPickup: "Αεροδρόμιο, ξενοδοχείο ή διεύθυνση...",
    placeholderDropoff: "Πού πηγαίνετε;", adult: "Ενήλικας", child: "Παιδί", loginTitle: "ΣΥΝΔΕΣΗ", registerTitle: "ΕΓΓΡΑΦΗ",
    email: "ΔΙΕΥΘΥΝΣΗ EMAIL", password: "ΚΩΔΙΚΟΣ", loginBtn: "ΣΥΝΔΕΣΗ", registerBtn: "ΕΓΓΡΑΦΗ", logoutBtn: "ΑΠΟΣΥΝΔΕΣΗ", profile: "ΠΡΟΦΙΛ",
    noAccount: "Δεν έχετε λογαριασμό;", hasAccount: "Είστε ήδη μέλος;", forgotPassword: "Ξεχάσατε τον κωδικό;", welcome: "Καλώς ήρθατε ξανά",
    errorEmail: "Έγκυρο email.", errorPassword: "Ελάχιστο 6 χαρακτήρες.", sssTitle: "Συχνές Ερωτήσεις",
    fleetTitle: "Ο ΑΠΟΚΛΕΙΣΤΙΚΟΣ VIP ΣΤΟΛΟΣ ΜΑΣ", fleetSub: "Ταξίδι στην κορυφή της άνεσης", capacity: "Χωρητικότητα", luggage: "Αποσκευές",
    wifi: "Δωρεάν Wi-Fi", drinks: "Κρύα ποτά", bookNow: "Κράτηση τώρα", departureLabel: "(Αναχώρηση)", returnLabel: "(Επιστροφή)",
    returnPickupPlaceholder: "Παραλαβή επιστροφής", returnDropoffPlaceholder: "Προορισμός επιστροφής", select: "Επιλογή", returnDate: "ΗΜΕΡ. ΕΠΙΣΤΡΟΦΗΣ",
    timeLabel: "ΩΡΑ", viewAll: "Δείτε όλα", readMore: "Διαβάστε περισσότερα", contactUs: "Επικοινωνήστε μαζί μας", whatsappSupport: "Υποστήριξη WhatsApp",
    servicesTitle: "Υπηρεσίες", servicesSubtitle: "Premium λύσεις για εσάς", featuresTitle: "Γιατί εμάς;",
    featuresSubtitle: "Ειδικά προνόμια", statsTitle: "Στατιστικά", howItWorksTitle: "Πώς λειτουργεί;",
    howItWorksSubtitle: "3 απλά βήματα", faqTitle: "Ερωτήσεις", faqSubtitle: "Όλες οι απαντήσεις",
    testimonialsTitle: "Κριτικές", promoTitle: "Προσφορές", footerAboutTitle: "Σχετικά", footerLinksTitle: "Σύνδεσμοι",
    footerContactTitle: "Επικοινωνία", rightsReserved: "Με επιφύλαξη παντός δικαιώματος.", corporate: "Εταιρικό", policies: "Πολιτικές", operation: "24/7 Λειτουργία",
    footerRights: "ΟΛΑ ΤΑ ΔΙΚΑΙΩΜΑΤΑ ΚΑΤΟΧΥΡΩΜΕΝΑ.", securePayment: "ΑΣΦΑΛΗΣ ΠΛΗΡΩΜΗ SSL", faqTitle1: "ΣΥΧΝΕΣ", faqTitle2: "ΕΡΩΤΗΣΕΙΣ"
  },
  bg: {
    home: "НАЧАЛО", fleet: "ФЛОТ", services: "УСЛУГИ", regions: "РЕГИОНИ", contact: "КОНТАКТ", sss: "ЧАВО",
    tagline: "ПРЕМИУМ ТРАНСФЕРНО ИЗЖИВЯВАНЕ", oneWay: "Еднопосочен", roundTrip: "Двупосочен", pickup: "МЯСТО НА ВЗИМАНЕ", dropoff: "ДЕСТИНАЦИЯ",
    date: "ДАТА", time: "ЧАС", passengers: "ПЪТНИЦИ", searchBtn: "Цена и Резервация", placeholderPickup: "Летище, хотел или адрес...",
    placeholderDropoff: "Накъде пътувате?", adult: "Възрастен", child: "Дете", loginTitle: "ВХОД", registerTitle: "РЕГИСТРАЦИЯ",
    email: "EMAIL АДРЕС", password: "ПАРОЛА", loginBtn: "ВХОД", registerBtn: "РЕГИСТРАЦИЯ", logoutBtn: "ИЗХОД", profile: "ПРОФИЛ",
    noAccount: "Нямате акаунт?", hasAccount: "Вече сте член?", forgotPassword: "Забравена парола?", welcome: "Добре дошли отново",
    errorEmail: "Валиден имейл.", errorPassword: "Минимум 6 знака.", sssTitle: "Често задавани въпроси",
    fleetTitle: "НАШИЯТ ЕКСКЛЮЗИВЕН ВИП ФЛОТ", fleetSub: "Комфорт и сигурност", capacity: "Капацитет", luggage: "Багаж",
    wifi: "Безплатен Wi-Fi", drinks: "Напитки", bookNow: "Резервирай сега", departureLabel: "(Заминаване)", returnLabel: "(Връщане)",
    returnPickupPlaceholder: "Връщане от", returnDropoffPlaceholder: "Връщане до", select: "Избор", returnDate: "ДАТА НА ВРЪЩАНЕ",
    timeLabel: "ЧАС", viewAll: "Виж всички", readMore: "Още", contactUs: "Контакт", whatsappSupport: "WhatsApp поддръжка",
    servicesTitle: "Услуги", servicesSubtitle: "Премиум решения", featuresTitle: "Защо нас?",
    featuresSubtitle: "Специални привилегии", statsTitle: "Статистика", howItWorksTitle: "Как работи?",
    howItWorksSubtitle: "3 лесни стъпки", faqTitle: "Въпроси", faqSubtitle: "Всички отговори",
    testimonialsTitle: "Отзиви", promoTitle: "Оферти", footerAboutTitle: "За нас", footerLinksTitle: "Връзки",
    footerContactTitle: "Контакт", rightsReserved: "Всички права запазени.", corporate: "Корпоративен", policies: "Политики", operation: "24/7 Работа",
    footerRights: "ВСИЧКИ ПРАВА ЗАПАЗЕНИ.", securePayment: "СИГУРНО ПЛАЩАНЕ SSL", faqTitle1: "ЧЕСТО", faqTitle2: "ВЪПРОСИ"
  },
  ka: {
    home: "მთავარი", fleet: "ფლოტი", services: "სერვისები", regions: "რეგიონები", contact: "კონტაქტი", sss: "FAQ",
    tagline: "პრემიუმ ტრანსფერის გამოცდილება", oneWay: "ერთი გზა", roundTrip: "ორი გზა", pickup: "აყვანის ადგილი", dropoff: "დანიშნულება",
    date: "თარიღი", time: "დრო", passengers: "მგზავრები", searchBtn: "ფასის ძებნა და დაჯავშნა", placeholderPickup: "აეროპორტი, სასტუმრო ან მისამართი...",
    placeholderDropoff: "სად მიდიხართ?", adult: "ზრდასრული", child: "ბავშვი", loginTitle: "ავტორიზაცია", registerTitle: "რეგისტრაცია",
    email: "EMAIL", password: "პაროლი", loginBtn: "შესვლა", registerBtn: "რეგისტრაცია", logoutBtn: "გამოსვლა", profile: "პროფილი",
    noAccount: "არ გაქვთ ანგარიში?", hasAccount: "უკვე წევრი ხართ?", forgotPassword: "დაგავიწყდათ პაროლი?", welcome: "მოგესალმებით",
    errorEmail: "სწორი იმეილი.", errorPassword: "მინიმუმ 6 სიმბოლო.", sssTitle: "ხშირად დასმული კითხვები",
    fleetTitle: "ჩვენი ექსკლუზიური VIP ფლოტი", fleetSub: "კომფორტის და უსაფრთხოების მწვერვალი", capacity: "ტევადობა", luggage: "ბარგი",
    wifi: "უფასო Wi-Fi", drinks: "ცივი სასმელები", bookNow: "დაჯავშნე ახლავე", departureLabel: "(წასვლა)", returnLabel: "(დაბრუნება)",
    returnPickupPlaceholder: "დაბრუნების ადგილი", returnDropoffPlaceholder: "დაბრუნების დანიშნულება", select: "არჩევა", returnDate: "დაბრუნების თარიღი",
    timeLabel: "დრო", viewAll: "ყველას ნახვა", readMore: "დაწვრილებით", contactUs: "დაგვიკავშირდით", whatsappSupport: "WhatsApp მხარდაჭერა",
    servicesTitle: "სერვისები", servicesSubtitle: "პრემიუმ გადაწყვეტილებები", featuresTitle: "რატომ ჩვენ?",
    featuresSubtitle: "განსაკუთრებული პრივილეგიები", statsTitle: "ციფრებში", howItWorksTitle: "როგორ მუშაობს?",
    howItWorksSubtitle: "3 მარტივი ნაბიჯი", faqTitle: "კითხვები", faqSubtitle: "ყველა პასუხი აქ არის",
    testimonialsTitle: "შეფასებები", promoTitle: "აქციები", footerAboutTitle: "ჩვენს შესახებ", footerLinksTitle: "ბმულები",
    footerContactTitle: "კონტაქტი", rightsReserved: "ყველა უფლება დაცულია.", corporate: "კორპორატიული", policies: "პოლიტიკა", operation: "24/7 მუშაობა",
    footerRights: "ყველა უფლება დაცულია.", securePayment: "SSL უსაფრთხო გადახდა", faqTitle1: "ხშირად", faqTitle2: "დასმული კითხვები"
  },
  la: {
    home: "DOMUM", fleet: "CLASSIS", services: "SERVITIA", regions: "REGIONES", contact: "CONTACTUS", sss: "FAQ",
    tagline: "TRANSLATIO PREMIUM EXPERIENTIA", oneWay: "Via simplex", roundTrip: "Iter reditus", pickup: "LOCUS CAPTIONIS", dropoff: "DESTINATIO",
    date: "DIES", time: "HORA", passengers: "VECTORES", searchBtn: "Pretium quaerere & Reservare", placeholderPickup: "Aeroportus, Deversorium...",
    placeholderDropoff: "Quo vadis?", adult: "Adultus", child: "Puer", loginTitle: "INTRATIO", registerTitle: "REGISTRATIO",
    email: "LITTERAE ELECTRONICAE", password: "TESSERA", loginBtn: "INTRARE", registerBtn: "REGISTRARE", logoutBtn: "EXIRE", profile: "PROFILUM",
    noAccount: "Non habes rationem?", hasAccount: "Iam membrus?", forgotPassword: "Tessera oblita?", welcome: "Salve iterum",
    errorEmail: "Email valida.", errorPassword: "Minimum 6 signa.", sssTitle: "Quaestiones Frequentes",
    fleetTitle: "NOSTRA VIP CLASSIS EXCLUSIVA", fleetSub: "Luxuria et Securitas", capacity: "Capacitas", luggage: "Sarcina",
    wifi: "Wi-Fi gratis", drinks: "Potus frigidi", bookNow: "Nunc reserva", departureLabel: "(Exitus)", returnLabel: "(Reditus)",
    returnPickupPlaceholder: "Reditus locus", returnDropoffPlaceholder: "Reditus destinatio", select: "Eligere", returnDate: "DIES REDITUS",
    timeLabel: "HORA", viewAll: "Omnia videre", readMore: "Plus legere", contactUs: "Contactus nos", whatsappSupport: "WhatsApp Auxilium",
    servicesTitle: "Servitia nostra", servicesSubtitle: "Premium solutiones", featuresTitle: "Cur nos?",
    featuresSubtitle: "Privilegia specialia", statsTitle: "Numeri", howItWorksTitle: "Quomodo operatur?",
    howItWorksSubtitle: "3 gradus simplices", faqTitle: "Quaestiones", faqSubtitle: "Omnia responsa hic",
    testimonialsTitle: "Sententiae", promoTitle: "Offerentia", footerAboutTitle: "De nobis", footerLinksTitle: "Nexus",
    footerContactTitle: "Contactus", rightsReserved: "Omnia iura reservata.", corporate: "Corporatio", policies: "Regulae", operation: "24/7 Operatio",
    footerRights: "OMNIA IURA RESERVATA.", securePayment: "SSL TUTUM SOLUTUM", faqTitle1: "QUESTIONES", faqTitle2: "FREQUENTES"
  }
};

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('tr');

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    const supportedLangs = Object.keys(translations);
    
    if (savedLang && supportedLangs.includes(savedLang)) {
      setLang(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
      setLang(defaultLang);
      localStorage.setItem('preferredLanguage', defaultLang);
    }
  }, []);

  const t = translations[lang] || translations.en;

  const changeLanguage = (newLang: string) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('preferredLanguage', newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ t, lang, setLang: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);