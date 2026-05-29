import React, { useState, useEffect, useRef } from 'react';
import { 
  Droplet, 
  Users, 
  Award, 
  Globe, 
  Mail, 
  ArrowRight, 
  BookOpen, 
  Cpu, 
  CheckCircle, 
  ChevronRight, 
  Menu, 
  X, 
  Linkedin, 
  Twitter, 
  ExternalLink, 
  FlaskConical, 
  Sparkles, 
  Zap, 
  Compass, 
  Heart, 
  ShieldCheck, 
  Clock, 
  FileText,
  MapPin,
  Share2,
  MessageSquare,
  Send,
  Loader2,
  Bookmark,
  Waves,
  Flame,
  Building2
} from 'lucide-react';

// --- GEMINI API ADAPTER WITH RETRIES ---
const callGeminiAPI = async (prompt, systemInstruction = "") => {
  const apiKey = ""; // Injected dynamically in canvas environment
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      }
    } catch (err) {
      // Retry exponentially
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    delay *= 2;
  }
  throw new Error("Could not reach our AI systems after multiple attempts. Please try again later.");
};

// --- HIGH-FIDELITY VECTOR LOGO COMPONENTS FOR PARTNERS & SDGs ---

// UNICEF Official Logo SVG
const UnicefLogo = () => (
  <svg viewBox="0 0 280 60" className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" fill="currentColor">
    <g fill="#00ADEF">
      {/* Stylized Mother & Child Emblem */}
      <path d="M30,10 C18.9,10 10,18.9 10,30 C10,41.1 18.9,50 30,50 C41.1,50 50,41.1 50,30 C50,18.9 41.1,10 30,10 Z M30,46 C21.2,46 14,38.8 14,30 C14,21.2 21.2,14 30,14 C38.8,14 46,21.2 46,30 C46,38.8 38.8,46 30,46 Z" />
      <path d="M26,26 C26,23.8 27.8,22 30,22 C32.2,22 34,23.8 34,26 C34,28.2 32.2,30 30,30 C27.8,30 26,28.2 26,26 Z" />
      <path d="M30,32 C25,32 21,36 21,41 L39,41 C39,36 35,32 30,32 Z" />
      <circle cx="37" cy="20" r="2.5" />
      <path d="M37,24 C34.5,24 32.5,26 32.5,28.5 L41.5,28.5 C41.5,26 39.5,24 37,24 Z" />
    </g>
    {/* Wordmark */}
    <text x="65" y="42" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="28" fontWeight="800" fill="#ffffff" letterSpacing="0.05em">unicef</text>
    <text x="175" y="42" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="20" fontWeight="400" fill="#00ADEF" letterSpacing="0.05em">| Türkiye</text>
  </svg>
);

// Accenture Logo SVG
const AccentureLogo = () => (
  <svg viewBox="0 0 200 50" className="h-9 w-auto opacity-80 hover:opacity-100 transition-opacity" fill="currentColor">
    {/* Accenture arrow symbol */}
    <polygon points="12,15 28,25 12,35 18,25" fill="#A100FF" />
    {/* Wordmark */}
    <text x="35" y="32" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="24" fontWeight="800" fill="#ffffff" letterSpacing="-0.03em">accenture</text>
  </svg>
);

// Habitat Association Logo SVG
const HabitatLogo = () => (
  <svg viewBox="0 0 240 50" className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" fill="currentColor">
    {/* Dynamic house grid pattern */}
    <g fill="#12c2e8">
      <rect x="5" y="10" width="10" height="10" rx="2" />
      <rect x="20" y="10" width="10" height="10" rx="2" fill="#c471ed" />
      <rect x="5" y="25" width="10" height="10" rx="2" fill="#c471ed" />
      <rect x="20" y="25" width="25" height="10" rx="2" />
    </g>
    {/* Wordmark */}
    <text x="60" y="32" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="20" fontWeight="800" fill="#ffffff" letterSpacing="0.08em">HABITAT</text>
    <text x="160" y="32" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="300" fill="#12c2e8" letterSpacing="0.1em">DERNEĞİ</text>
  </svg>
);

// World Youth Development Forum Logo SVG
const WydfLogo = () => (
  <svg viewBox="0 0 280 60" className="h-11 w-auto opacity-80 hover:opacity-100 transition-opacity" fill="currentColor">
    {/* Globe of colorful youth stars */}
    <g>
      <circle cx="25" cy="30" r="18" fill="none" stroke="#c471ed" strokeWidth="2" />
      <path d="M12,25 C18,30 32,30 38,25" stroke="#12c2e8" strokeWidth="1.5" fill="none" />
      <path d="M12,35 C18,30 32,30 38,35" stroke="#12c2e8" strokeWidth="1.5" fill="none" />
      <circle cx="25" cy="30" r="3" fill="#ffffff" />
    </g>
    {/* Wordmark */}
    <text x="55" y="28" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="0.05em">WORLD YOUTH</text>
    <text x="55" y="44" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="500" fill="#12c2e8" letterSpacing="0.05em">DEVELOPMENT FORUM</text>
  </svg>
);

// --- SDG OFFICIAL LOGO RENDERERS ---

// SDG 6 - Clean Water & Sanitation
const Sdg6Logo = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 rounded-xl shadow-lg shrink-0">
    <rect width="100" height="100" fill="#26BDE2" />
    {/* Water tap / Glass of clean water symbol */}
    <path d="M30,30 L45,30 L45,45 L30,45 Z" fill="#ffffff" />
    <path d="M45,35 H65 C68,35 68,45 65,45 H55 V60 C55,70 45,70 45,60 Z" fill="#ffffff" />
    <path d="M50,70 C50,75 45,80 40,80 C35,80 30,75 30,70 C30,65 50,50 50,50 Z" fill="#ffffff" opacity="0.9" />
    <text x="8" y="24" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#ffffff">6</text>
  </svg>
);

// SDG 14 - Life Below Water
const Sdg14Logo = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 rounded-xl shadow-lg shrink-0">
    <rect width="100" height="100" fill="#0A97D9" />
    {/* Fish and waves */}
    <path d="M20,70 Q35,60 50,70 T80,70" stroke="#ffffff" strokeWidth="3" fill="none" />
    <path d="M20,80 Q35,70 50,80 T80,80" stroke="#ffffff" strokeWidth="3" fill="none" />
    <path d="M30,45 C45,35 65,35 75,45 C65,55 45,55 30,45 Z" fill="#ffffff" />
    <polygon points="75,45 85,38 85,52" fill="#ffffff" />
    <circle cx="38" cy="43" r="2.5" fill="#0A97D9" />
    <text x="8" y="24" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#ffffff">14</text>
  </svg>
);

// SDG 3 - Good Health and Well-being
const Sdg3Logo = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 rounded-xl shadow-md">
    <rect width="100" height="100" fill="#4C9F38" />
    {/* Heartbeat EKG line */}
    <path d="M15,50 H35 L42,25 L50,75 L58,40 L65,58 L72,50 H85" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text x="8" y="24" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#ffffff">3</text>
  </svg>
);

// SDG 9 - Industry, Innovation and Infrastructure
const Sdg9Logo = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 rounded-xl shadow-md">
    <rect width="100" height="100" fill="#F26A2E" />
    {/* Stylized industry gears & structure */}
    <rect x="25" y="45" width="12" height="35" fill="#ffffff" />
    <rect x="44" y="30" width="12" height="50" fill="#ffffff" />
    <rect x="63" y="40" width="12" height="40" fill="#ffffff" />
    <polygon points="25,45 31,35 37,45" fill="#ffffff" />
    <polygon points="44,30 50,20 56,30" fill="#ffffff" />
    <polygon points="63,40 69,30 75,40" fill="#ffffff" />
    <text x="8" y="24" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#ffffff">9</text>
  </svg>
);

// SDG 11 - Sustainable Cities and Communities
const Sdg11Logo = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 rounded-xl shadow-md">
    <rect width="100" height="100" fill="#F99D26" />
    {/* Stylized houses/buildings */}
    <path d="M20,75 V50 L35,35 L50,50 V75 Z" fill="#ffffff" />
    <path d="M50,75 V45 L65,30 L80,45 V75 Z" fill="#ffffff" opacity="0.8" />
    <rect x="28" y="58" width="6" height="10" fill="#F99D26" />
    <rect x="62" y="52" width="6" height="15" fill="#F99D26" />
    <text x="8" y="24" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#ffffff">11</text>
  </svg>
);

// SDG 12 - Responsible Consumption and Production
const Sdg12Logo = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 rounded-xl shadow-md">
    <rect width="100" height="100" fill="#CF8D2A" />
    {/* Infinity loop with direction arrow */}
    <path d="M30,50 C30,38 45,35 50,50 C55,65 70,62 70,50 C70,38 55,35 50,50 C45,65 30,62 30,50 Z" stroke="#ffffff" strokeWidth="4.5" fill="none" />
    <polygon points="54,40 50,50 44,46" fill="#ffffff" />
    <text x="8" y="24" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#ffffff">12</text>
  </svg>
);

// SDG 13 - Climate Action
const Sdg13Logo = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 rounded-xl shadow-md">
    <rect width="100" height="100" fill="#48773C" />
    {/* Stylized Earth and climate warning curves */}
    <circle cx="50" cy="50" r="22" stroke="#ffffff" strokeWidth="3.5" fill="none" />
    <path d="M35,42 Q50,48 65,42" stroke="#ffffff" strokeWidth="2" fill="none" />
    <path d="M32,54 Q50,60 68,54" stroke="#ffffff" strokeWidth="2" fill="none" />
    <text x="8" y="24" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#ffffff">13</text>
  </svg>
);

// SDG 17 - Partnerships for the Goals
const Sdg17Logo = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 rounded-xl shadow-md">
    <rect width="100" height="100" fill="#183668" />
    {/* Handshake/Partnership geometry */}
    <circle cx="50" cy="50" r="25" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3,3" fill="none" />
    <path d="M32,45 C38,40 45,45 52,40 C58,35 68,45 68,55 C55,60 45,50 32,45 Z" fill="#ffffff" />
    <path d="M68,55 C62,60 55,55 48,60 C42,65 32,55 32,45" stroke="#183668" strokeWidth="2" fill="none" />
    <text x="8" y="24" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#ffffff">17</text>
  </svg>
);

// --- TRANSLATION DICTIONARIES ---
const translations = {
  en: {
    navHome: "Home",
    navAbout: "PureFlow",
    navLab: "Interactive Lab",
    navTeam: "Our Team",
    navAwards: "Milestones",
    navContact: "Contact",
    heroBadge: "Global Winner of UNICEF Generation Unlimited",
    heroTitle: "Innovating for a",
    heroTitleGradient: "Sustainable Future",
    heroSubtitle: "We transform local marine waste into high-performance, circular-economy water filtration systems to tackle global industrial water pollution.",
    btnExplore: "Explore PureFlow",
    btnLab: "Try Interactive Lab",
    statsTitle: "Empowering Impact Through Science",
    statWaterTreated: "Water Recovered",
    statRemovalRate: "Pollutant Adsorption",
    statWastediverted: "Waste Shells Reused",
    statGlobalRecognition: "Global Awards",
    aboutTitle: "The PureFlow Revolution",
    aboutSubtitle: "Turning ecological waste into clean water solutions.",
    aboutP1: "Every year, billions of liters of water are contaminated by industrial dyes, heavy metals, and toxic pollutants, threatening both fragile ecosystems and human health. PureFlow offers a pioneering, circular-economy solution by transforming discarded mussel shells into powerful filtration media.",
    aboutP2: "Through specialized low-energy thermal and chemical activation, we turn shell calcium carbonate structures into highly porous carbonaceous adsorbents. These micro-structures trap complex synthetic dye molecules and heavy metal ions, returning clean, reusable water to communities and industries.",
    processStep1: "Waste Shell Collection",
    processStep1Desc: "Sourcing discarded mussel shells from local seafood industries, preventing landfill build-up.",
    processStep2: "Advanced Activation",
    processStep2Desc: "Eco-friendly processing to optimize porosity and maximize contamination binding sites.",
    processStep3: "Multi-Stage Filtration",
    processStep3Desc: "Polluted wastewater passes through the active media, binding toxic elements safely.",
    processStep4: "Purified Water",
    processStep4Desc: "Pure, reusable water is delivered back into nature or industrial cooling loops.",
    labTitle: "PureFlow Interactive Lab",
    labSubtitle: "Step inside our digital climate-tech exhibit. Explore the 7 stages of molecular bivalve adsorption, or submit a custom wastewater matrix to let our Gemini-backed planner design your filtration sequence.",
    labSelectPollutant: "Simulation Mode:",
    labPollutantDye: "Industrial Textile Dye (Methyl Violet)",
    labPollutantMetal: "Heavy Metal Effluent (Lead/Copper)",
    labPollutantOrganic: "Organic Agricultural Runoff",
    labPollutantCustom: "✨ Custom Wastewater Cocktail (AI Analyst)",
    labStartFilter: "Initiate Filtration",
    labReset: "Reset Simulator",
    labStatusIdle: "System Idle. Ready for filtration cycle.",
    labStatusFiltering: "Processing wastewater... Activating nanopores.",
    labStatusComplete: "Filtration Complete. Purified output meets regional safety regulations!",
    labMetricPurity: "Purity Level",
    labMetricAdsorption: "Adsorbed Ions",
    labMetricToxicity: "Toxicity Index",
    teamTitle: "Meet the Visionaries",
    teamSubtitle: "The passionate young scientists, innovators, and changemakers behind the development of PureFlow.",
    teamViewProfile: "View Biography",
    founderEmphasisTitle: "Founder & Team Captain",
    founderEmphasisText: "Under Yusuf's leadership, Team INSPIRE rose from a local research initiative to become the Global Winner of the Generation Unlimited Youth Challenge. His work at the intersection of environmental engineering and global advocacy highlights the power of youth-driven innovation.",
    modalBio: "Biography",
    modalEducation: "Education & Background",
    modalRole: "Role & Key Contributions",
    modalSkills: "Expertise & Skills",
    modalAwards: "Achievements & Awards",
    timelineTitle: "Our Global Journey",
    timelineSubtitle: "Milestones of impact, research breakthroughs, and international recognitions.",
    timeline1Year: "2023",
    timeline1Title: "Foundation & Local Action",
    timeline1Desc: "Yusuf Aydın Doğru establishes Team INSPIRE in Turkey, focused on circular solutions for industrial wastewater.",
    timeline2Year: "2024",
    timeline2Title: "UNICEF GenU Global Victory",
    timeline2Desc: "PureFlow beats hundreds of international teams to be crowned Global Winner of the Generation Unlimited Youth Challenge.",
    timeline3Year: "2025",
    timeline3Title: "World Youth Development Forum",
    timeline3Desc: "Yusuf represents youth climate leadership at the prestigious global forum in China as one of its youngest delegates.",
    timeline4Year: "2026",
    timeline4Title: "Industrial Scaling & Pilots",
    timeline4Desc: "Scaling testing from benchtop reactors to containerized pilot systems for local manufacturing zones.",
    contactTitle: "Join the Movement",
    contactSubtitle: "Partner with us, support our research, or bring PureFlow to your municipality.",
    contactName: "Full Name",
    contactEmail: "Email Address",
    contactSubject: "Subject / Organization",
    contactMessage: "Your Message",
    contactSubmit: "Send Message",
    contactSuccess: "Thank you! Your message has been sent. Our team will get back to you shortly.",
    footerText: "Building a movement for youth-led innovation, circular economy, and global environmental action.",
    
    // --- MEDIA & RECOGNITION SECTION ---
    mediaTitle: "Recognition & Media Coverage",
    mediaSubtitle: "Our research, achievements, and environmental impact have been highlighted by premier national and international platforms.",
    mediaBtnVisit: "Read Coverage",

    // --- MENTORS & RESEARCHERS ---
    mentorsTitle: "Researchers, Mentors & Supporters",
    mentorsSubtitle: "Acknowledging the outstanding scientists, institutions, and professionals who supported PureFlow from inception to global impact.",
    mentorsAppreciationHeader: "Our Journey Would Not Have Been Possible Without Them",
    mentorsAppreciationText: "Team INSPIRE would like to express its deepest gratitude to the researchers, mentors, educators, journalists, and supporters who believed in the project from its earliest stages and helped transform a local idea into a globally recognized initiative. Their guidance, expertise, encouragement, and support played a crucial role in the development of PureFlow and the international achievements of Team INSPIRE.",
    groupResearch: "Research & Laboratory Team",
    groupMentors: "Mentors & International Supporters",

    // --- PARTNERS SHOWCASE ---
    partnersTitle: "Our Partners & Support Network",

    // --- SDGs ---
    sdgSectionTitle: "Sustainable Development Goals (SDGs)",
    sdgSectionSubtitle: "How PureFlow and Team INSPIRE align with the United Nations 2030 Agenda to protect our planet and communities.",
    sdgPrimaryHeader: "Primary Impact Goals",
    sdgSecondaryHeader: "Secondary Contributions",

    // --- AI STRINGS ---
    aiCustomTextLabel: "Describe Custom Waste Solution / Contaminant Matrix:",
    aiCustomPlaceholder: "Example: Acid industrial runoff with pH 3.4 containing nickel, copper ions, and sulfurous dyes...",
    aiCalcBtn: "Design AI Treatment Plan ✨",
    aiAnalyzing: "Gemini Analyzing Wastewater Model...",
    aiOutputTitle: "✨ AI Wastewater Analysis & Treatment Sequence",
    aiAvatarChatHeader: "Ask Yusuf's AI Avatar Mentor ✨",
    aiAvatarSub: "Talk directly to an AI replica of Yusuf Aydın Doğru about sustainability, team management, and Youth Climate Action.",
    aiAvatarChatPlaceholder: "How did you scale PureFlow from a lab experiment?",
    aiSendMsg: "Send Message ✨",

    // --- INTERACTIVE LAB SECTIONS ---
    exhibitHeading: "PureFlow Interactive Journey",
    exhibitSubtitle: "Interactive bivalve-derived adsorption science exhibit.",
    step1Title: "1. Raw Waste Mussel Shells",
    step1Desc: "Waste shells are sourced from bivalve seafood processing pipelines. They consist mainly of calcium carbonate (CaCO₃) in a dense, non-porous structure.",
    step2Title: "2. Carbonization & Thermal Activation",
    step2Desc: "The shells undergo precisely controlled calcination (500°C - 850°C). This process reorganizes bivalve crystal structures and drives off carbon dioxide.",
    step3Title: "3. Nanoporous Structure Development",
    step3Desc: "A network of highly active microscopic cavities and cavernous channels forms, maximizing active surface area for optimal ionic adsorption.",
    step4Title: "4. Contaminated Wastewater Inflow",
    step4Desc: "Wastewater carrying synthetic textile dyes (Methyl Violet) and heavy metal ions (Lead, Copper) enters the PureFlow filtration medium.",
    step5Title: "5. Nanopore Proximity Attraction",
    step5Desc: "Opposite electrostatic charges create attraction vectors between active site coordinates and suspended contaminants.",
    step6Title: "6. Surface Adsorption Capture",
    step6Desc: "Contaminant ions bond directly onto the interior surface of the nanopores, trapping them and preventing escape.",
    step7Title: "7. Pristine Discharge Outflow",
    step7Desc: "Purified water molecules flow out of the active medium, fully clean and ready for reuse or safe aquatic discharge."
  },
  tr: {
    navHome: "Ana Sayfa",
    navAbout: "PureFlow",
    navLab: "İnteraktif Laboratuvar",
    navTeam: "Ekibimiz",
    navAwards: "Başarılar",
    navContact: "İletişim",
    heroBadge: "UNICEF Generation Unlimited Küresel Birincisi",
    heroTitle: "Sürdürülebilir Gelecek İçin",
    heroTitleGradient: "İnovasyon",
    heroSubtitle: "Yerel denizel atıkları yüksek performanslı, döngüsel ekonomi su filtreleme sistemlerine dönüştürerek küresel endüstriyel su kirliliğiyle mücadele ediyoruz.",
    btnExplore: "PureFlow'u Keşfet",
    btnLab: "İnteraktif Laboratuvarı Dene",
    statsTitle: "Bilimle Güçlenen Etki",
    statWaterTreated: "Geri Kazanılan Su",
    statRemovalRate: "Kirletici Tutma",
    statWastediverted: "Geri Dönüştürülen Kabuk",
    statGlobalRecognition: "Küresel Ödüller",
    aboutTitle: "PureFlow Devrimi",
    aboutSubtitle: "Ekolojik atıkları temiz su çözümlerine dönüştürüyoruz.",
    aboutP1: "Her yıl milyarlarca litre su, endüstriyel boyalar, ağır metaller ve toksik kirleticilerle kirlenerek hem hassas ekosistemleri hem de insan sağlığını tehdit ediyor. PureFlow, atık midye kabuklarını güçlü filtreleme medyalarına dönüştürerek öncü bir döngüsel ekonomi çözümü sunuyor.",
    aboutP2: "Düşük enerjili termal ve kimyasal aktivasyon süreçleriyle midye kabuklarının kalsiyum karbonat yapılarını yüksek düzeyde gözenekli karbon bazlı adsorbanlara dönüştürüyoruz. Bu mikro yapılar, karmaşık sentetik boya moleküllerini ve ağır metal iyonlarını hapsederek temiz ve yeniden kullanılabilir suyu topluluklara ve endüstriyel tesislere geri kazandırıyor.",
    processStep1: "Atık Kabuk Toplama",
    processStep1Desc: "Yerel deniz ürünleri işletmelerinden atılan midye kabuklarını toplayarak katı atık depolama yükünü azaltıyoruz.",
    processStep2: "Gelişmiş Aktivasyon",
    processStep2Desc: "Gözenekliliği optimize etmek ve kirlilik bağlama alanlarını maksimuma çıkarmak için çevre dostu işlemler uyguluyoruz.",
    processStep3: "Çok Aşamalı Filtrasyon",
    processStep3Desc: "Kirli atık su aktif filtre medyasından geçerken toksik elementler güvenli bir şekilde bağlanır.",
    processStep4: "Arıtılmış Su",
    processStep4Desc: "Doğaya veya endüstriyel soğutma sistemlerine geri verilmeye hazır temiz, saf su elde edilir.",
    labTitle: "PureFlow İnteraktif Laboratuvarı",
    labSubtitle: "Dijital iklim teknolojileri sergimize adım atın. Çift kabuklu adsorpsiyon biliminin 7 aşamasını keşfedin ya da Gemini destekli yapay zekamıza özel bir atık su matrisi sunarak filtreleme dizilimini tasarlatın.",
    labSelectPollutant: "Simülasyon Modu:",
    labPollutantDye: "Endüstriyel Tekstil Boyası (Metil Viyole)",
    labPollutantMetal: "Ağır Metal Atığı (Kurşun/Bakır)",
    labPollutantOrganic: "Organik Tarımsal Akıntı",
    labPollutantCustom: "✨ Özel Atık Su Kokteyli (AI Analisti)",
    labStartFilter: "Arıtmayı Başlat",
    labReset: "Simülasyonu Sıfırla",
    labStatusIdle: "Sistem Hazır. Arıtma çevrimi başlatılabilir.",
    labStatusFiltering: "Atık su işleniyor... Nanogözenekler aktifleşiyor.",
    labStatusComplete: "Filtrasyon Tamamlandı. Arıtılmış su kalitesi standartlara uygun seviyeye ulaştı!",
    labMetricPurity: "Saflık Seviyesi",
    labMetricAdsorption: "Adsorbe Edilen İyonlar",
    labMetricToxicity: "Toksisite Endeksi",
    teamTitle: "Vizyonerlerle Tanışın",
    teamSubtitle: "PureFlow'un geliştirilmesinin arkasındaki tutkulu genç bilim insanları ve inovasyon öncüleri.",
    teamViewProfile: "Biyografiyi İncele",
    founderEmphasisTitle: "Kurucu ve Takım Kaptanı",
    founderEmphasisText: "Yusuf'un liderliğinde Team INSPIRE, yerel bir araştırma girişiminden UNICEF Generation Unlimited Gençlik Yarışması'nın Küresel Kazananı olmaya yükseldi. Çevre mühendisliği ve küresel savunuculuğun kesişimindeki çalışmaları, gençlik liderliğindeki inovasyonun gücünü kanıtlıyor.",
    modalBio: "Biyografi",
    modalEducation: "Eğitim ve Geçmiş",
    modalRole: "Rol ve Temel Katkılar",
    modalSkills: "Uzmanlık ve Yetenekler",
    modalAwards: "Başarılar ve Ödüller",
    timelineTitle: "Küresel Yolculuğumuz",
    timelineSubtitle: "Etki yaratma aşamalarımız, bilimsel buluşlarımız ve uluslararası takdirlerimiz.",
    timeline1Year: "2023",
    timeline1Title: "Kuruluş ve Yerel Eylem",
    timeline1Desc: "Yusuf Aydın Doğru, endüstriyel atık sular için döngüsel çözümler odaklı Team INSPIRE'ı Türkiye'de kurdu.",
    timeline2Year: "2024",
    timeline2Title: "UNICEF GenU Küresel Zaferi",
    timeline2Desc: "PureFlow, yüzlerce uluslararası ekibi geride bırakarak Generation Unlimited Gençlik Yarışması'nın Küresel Birincisi seçildi.",
    timeline3Year: "2025",
    timeline3Title: "Dünya Gençlik Gelişim Forumu",
    timeline3Desc: "Yusuf, Çin'deki bu prestijli foruma katılarak en genç delegelerden biri olarak gençlik iklim liderliğini temsil etti.",
    timeline4Year: "2026",
    timeline4Title: "Endüstriyel Ölçeklendirme ve Pilotlar",
    timeline4Desc: "Laboratuvar ölçeğindeki testlerden yerel sanayi bölgeleri için konteyner tipi pilot arıtma sistemlerine geçiş yapıldı.",
    contactTitle: "Harekete Katılın",
    contactSubtitle: "Bizimle ortaklık kurun, araştırmamızı destekleyin veya PureFlow'u bölgenize kazandırın.",
    contactName: "Ad Soyad",
    contactEmail: "E-posta Adresi",
    contactSubject: "Konu / Kurum",
    contactMessage: "Mesajınız",
    contactSubmit: "Mesaj Gönder",
    contactSuccess: "Teşekkürler! Mesajınız başarıyla gönderildi. Ekibimiz en kısa sürede size dönüş yapacaktır.",
    footerText: "Gençlik liderliğindeki inovasyon, döngüsel ekonomi ve küresel çevre eylemi için bir hareket inşa ediyoruz.",
    
    // --- MEDIA & RECOGNITION SECTION ---
    mediaTitle: "Takdir ve Medyada PureFlow",
    mediaSubtitle: "Araştırma, başarı ve çevre üzerindeki olumlu etkilerimiz prestijli ulusal ve uluslararası platformlar tarafından tescillendi.",
    mediaBtnVisit: "Haberi Oku",

    // --- MENTORS & RESEARCHERS ---
    mentorsTitle: "Araştırmacılar, Mentorlar ve Destekçiler",
    mentorsSubtitle: "PureFlow'u başlangıcından küresel etkiye taşıyan seçkin bilim insanlarını, kurumları ve profesyonelleri saygıyla anıyoruz.",
    mentorsAppreciationHeader: "Onlar Olmadan Yolculuğumuz Mümkün Olmazdı",
    mentorsAppreciationText: "Team INSPIRE, projenin en erken aşamalarından itibaren projeye inanan, yerel bir fikrin küresel olarak tanınan bir girişime dönüşmesine yardımcı olan araştırmacılara, mentorlara, eğitimcilere, gazetecilere ve destekçilere en derin şükranlarını sunar. Onların rehberliği, uzmanlığı, teşviki ve desteği, PureFlow'un gelişiminde ve Team INSPIRE'ın uluslararası başarılarında kritik bir rol oynamıştır.",
    groupResearch: "Araştırma ve Laboratuvar Ekibi",
    groupMentors: "Mentorlar ve Uluslararası Destekçiler",

    // --- PARTNERS SHOWCASE ---
    partnersTitle: "Ortaklarımız ve Destek Ağımız",

    // --- SDGs ---
    sdgSectionTitle: "Sürdürülebilir Kalkınma Amaçları (SKA)",
    sdgSectionSubtitle: "PureFlow ve Team INSPIRE'ın Birleşmiş Milletler 2030 Gündemi ile gezegenimizi ve topluluklarımızı korumaya yönelik uyumu.",
    sdgPrimaryHeader: "Birincil Etki Hedefleri",
    sdgSecondaryHeader: "İkincil Katkılar",

    // --- AI STRINGS ---
    aiCustomTextLabel: "Özel Atık Su Matrisini Tanımlayın:",
    aiCustomPlaceholder: "Örnek: pH değeri 3.4 olan, nikel ve bakır iyonları ile sülfürlü boyalar içeren asit maden akıntısı...",
    aiCalcBtn: "Yapay Zeka Arıtma Planı Tasarla ✨",
    aiAnalyzing: "Gemini Atık Su Modelini Analiz Ediyor...",
    aiOutputTitle: "✨ Yapay Zeka Atık Su Analizi ve Arıtma Dizisi",
    aiAvatarChatHeader: "Yusuf'un Yapay Zeka Avatarına Sor ✨",
    aiAvatarSub: "Sürdürülebilirlik, takım yönetimi ve Gençlik İklim Hareketi hakkında Yusuf Aydın Doğru'nun yapay zeka replikasıyla konuşun.",
    aiAvatarChatPlaceholder: "PureFlow'u laboratuvardan endüstriyel ölçeğe nasıl taşıdınız?",
    aiSendMsg: "Mesaj Gönder ✨",

    // --- INTERACTIVE LAB SECTIONS ---
    exhibitHeading: "PureFlow İnteraktif Bilim Sergisi",
    exhibitSubtitle: "Kalsine midye kabuklarından türetilen nanogözenekli filtrasyonun işleyiş aşamaları.",
    step1Title: "1. Atık Midye Kabukları",
    step1Desc: "Yerel deniz ürünleri işleme tesislerinden tedarik edilen atık kabuklar, çoğunlukla gözeneksiz ve sıkı kalsiyum karbonattan (CaCO₃) oluşur.",
    step2Title: "2. Karbonizasyon ve Termal Aktivasyon",
    step2Desc: "Kabuklar kontrollü olarak kalsine edilir (500°C - 850°C). Bu ısıl işlem kristal yapıyı yeniden düzenler ve karbondioksiti uzaklaştırır.",
    step3Title: "3. Nanogözenekli Yapı Gelişimi",
    step3Desc: "Son derece aktif, mikroskobik boşluklar ve kanal ağları oluşur. Bu işlem, adsorpsiyon için devasa aktif yüzey alanı yaratır.",
    step4Title: "4. Kirli Atık Su Girişi",
    step4Desc: "Sentetik tekstil boyaları (Metil Viyole) ve ağır metal iyonları (Kurşun, Bakır) içeren kirli su PureFlow kolonuna girmeye başlar.",
    step5Title: "5. Nanogözenek Yakınlık Çekimi",
    step5Desc: "Karşıt elektrostatik yükler, bivalve türevli adsorbanın aktif yüzey koordinatları ile askıdaki kirletici iyonlar arasında çekim vektörleri oluşturur.",
    step6Title: "6. Yüzey Adsorpsiyon Tutulması",
    step6Desc: "Kirletici iyonlar doğrudan nanogözeneklerin iç duvarlarına kimyasal bağlarla tutunur. Tamamen hareketsiz hale gelerek hapsolur.",
    step7Title: "7. Saf Su Çıkış Akışı",
    step7Desc: "Kirleticilerinden tamamen arınmış temiz su molekülleri medyadan süzülür, yeniden kullanıma veya doğaya salınıma hazır hale gelir."
  }
};

// --- RECOGNITION AND MEDIA DATA (UPDATED WITH GEN U WINNER 2025) ---
const mediaCoverageData = {
  en: [
    {
      publisher: "Generation Unlimited",
      title: "PureFlow Selected as a Generation Unlimited Global Winner",
      desc: "Team INSPIRE and PureFlow were selected among the Generation Unlimited imaGen Ventures Global Winners, recognized for their innovative, scalable, and youth-led solution addressing global water challenges. This achievement elevated the project from national recognition to the international stage and opened opportunities for global incubation, mentorship, networking, and impact development.",
      link: "https://www.generationunlimited.org/stories/imagen-ventures-global-winners-2025",
      category: "Global Victory"
    },
    {
      publisher: "UNICEF Official",
      title: "UNICEF Features PureFlow as a Youth-Led Innovation for Clean Water",
      desc: "UNICEF officially featured PureFlow and Team INSPIRE, highlighting the project's innovative approach to sustainable water purification and youth-driven impact.",
      link: "https://www.unicef.org/turkiye/en/stories/creative-solution-clean-water-young-minds-pureflow",
      category: "Global Feature"
    },
    {
      publisher: "Presidency of the Republic of Türkiye",
      title: "Team INSPIRE Represents Türkiye Internationally",
      desc: "Following the national championship, Team INSPIRE received national recognition and was featured by the Presidency of the Republic of Türkiye.",
      link: "https://www.iletisim.gov.tr/turkce/yerel_basin/detay/diyarbakirli-ogrenciler-turkiyeyi-temsil-edecek",
      category: "National Recognition"
    },
    {
      publisher: "World Youth Development Forum",
      title: "Founder & Team Captain Invited to the World Youth Development Forum",
      desc: "After becoming Global Winner, Team INSPIRE's Founder & Team Captain Yusuf Aydın Doğru was invited to participate in the World Youth Development Forum in China.",
      link: "https://www.instagram.com/p/DMxRyhboO7-/",
      category: "Global Invitation"
    },
    {
      publisher: "Deutsche Welle (DW)",
      title: "Deutsche Welle Special Interview",
      desc: "Following the international success of PureFlow, Deutsche Welle requested a special interview with Founder & Team Captain Yusuf Aydın Doğru regarding the project and its global impact.",
      link: "https://youtube.com/shorts/x5ciloiI8GM",
      category: "International Press"
    },
    {
      publisher: "Solcu Gazete",
      title: "National Media Coverage Following Global Championship",
      desc: "One of Türkiye's major digital news platforms featured Team INSPIRE after becoming Global Winner.",
      link: "https://www.instagram.com/p/DM2riBts_B2/",
      category: "Digital Media"
    }
  ],
  tr: [
    {
      publisher: "Generation Unlimited",
      title: "PureFlow, Generation Unlimited Küresel Kazananı Seçildi",
      desc: "Team INSPIRE ve PureFlow, küresel su sorunlarına yönelik yenilikçi, ölçeklenebilir ve gençlik liderliğindeki çözümleriyle Generation Unlimited imaGen Ventures Küresel Kazananları arasında seçildi. Bu başarı, projeyi ulusal takdirin ötesine taşıyarak küresel kuluçka, mentorluk, ağ oluşturma ve etki geliştirme fırsatları sundu.",
      link: "https://www.generationunlimited.org/stories/imagen-ventures-global-winners-2025",
      category: "Küresel Zafer"
    },
    {
      publisher: "UNICEF Resmi",
      title: "UNICEF, PureFlow'u Temiz Su İçin Gençlik Liderliğinde Bir İnovasyon Olarak Tanıttı",
      desc: "UNICEF resmi olarak PureFlow ve Team INSPIRE'ı yayınlayarak, projenin sürdürülebilir su arıtımına getirdiği yenilikçi yaklaşımı ve gençlik liderliğindeki etkiyi vurguladı.",
      link: "https://www.unicef.org/turkiye/en/stories/creative-solution-clean-water-young-minds-pureflow",
      category: "Küresel Tanıtım"
    },
    {
      publisher: "Türkiye Cumhuriyeti Cumhurbaşkanlığı",
      title: "Team INSPIRE Türkiye'yi Uluslararası Alanda Temsil Edecek",
      desc: "Ulusal şampiyonluğun ardından Team INSPIRE, ulusal çapta büyük takdir topladı ve Türkiye Cumhuriyeti Cumhurbaşkanlığı İletişim Başkanlığı tarafından haberleştirildi.",
      link: "https://www.iletisim.gov.tr/turkce/yerel_basin/detay/diyarbakirli-ogrenciler-turkiyeyi-temsil-edecek",
      category: "Ulusal Takdir"
    },
    {
      publisher: "Dünya Gençlik Gelişim Forumu",
      title: "Kurucu ve Takım Kaptanı Dünya Gençlik Gelişim Forumu'na Davet Edildi",
      desc: "Küresel Birinci olmasının ardından, Team INSPIRE kurucusu ve takım kaptanı Yusuf Aydın Doğru, Çin'deki Dünya Gençlik Gelişim Forumu'na katılmaya davet edildi.",
      link: "https://www.instagram.com/p/DMxRyhboO7-/",
      category: "Küresel Davet"
    },
    {
      publisher: "Deutsche Welle (DW)",
      title: "Deutsche Welle Özel Röportajı",
      desc: "PureFlow'un uluslararası başarısının ardından, Deutsche Welle, kurucu ve takım kaptanı Yusuf Aydın Doğru ile projenin küresel etkileri üzerine özel bir röportaj gerçekleştirdi.",
      link: "https://youtube.com/shorts/x5ciloiI8GM",
      category: "Uluslararası Basın"
    },
    {
      publisher: "Solcu Gazete",
      title: "Küresel Şampiyonluk Sonrası Ulusal Medya İlgi Odaklı İnceleme",
      desc: "Türkiye'nin en büyük dijital haber platformlarından biri, Küresel Şampiyon olmalarının ardından Team INSPIRE'ı detaylı şekilde paylaştı.",
      link: "https://www.instagram.com/p/DM2riBts_B2/",
      category: "Dijital Medya"
    }
  ]
};

// --- UNIFIED TEAM MEMBERS DATA (INCORPORATING FORMER STATUS WITHIN MAIN GRID) ---
const teamMembers = {
  en: [
    {
      id: "yusuf",
      name: "Yusuf Aydın Doğru",
      role: "Founder & Team Captain",
      status: "Active Leadership",
      isFounder: true,
      bio: "Yusuf is an award-winning youth innovator, environmental advocate, and the visionary founder of Team INSPIRE. Driven by a deep passion for circular economy, he conceived the idea of transforming bivalve shell waste into high-surface-area water filtration platforms. Representing global youth environmental stewardship, Yusuf has bridged advanced science and grassroots social action, presenting his research at international global summits such as the World Youth Development Forum in China.",
      education: "Environmental & Chemical Engineering Pathway with research credentials from global ecological institutes.",
      contributions: "Oversaw the core scientific design of PureFlow, managed corporate and governmental partnerships, secured the global UNICEF GenU funding, and spearheaded international presentation operations in China and Europe.",
      skills: ["Environmental Process Engineering", "Circular Economy Design", "R&D Strategy", "Strategic Partnerships", "Public Speaking", "Grant Writing"],
      awards: [
        "Global Winner - Generation Unlimited Youth Challenge (UNICEF & Partners)",
        "Distinguished Delegate & Presenter - World Youth Development Forum (Beijing, China)",
        "National Innovation Laureate - Environmental Technology Segment",
        "Youth Climate Leader recognition by international environmental networks"
      ],
      social: "https://linkedin.com/in/yusuf-aydin-dogru"
    },
    {
      id: "cemre",
      name: "Cemre Oruç",
      role: "Former Team Member",
      status: "Former Team Member",
      isFounder: false,
      bio: "Cemre contributed to the initial R&D stages, outreach activities, and collaborative workflows of the PureFlow project. Her dedication during the foundational campaign supported Team INSPIRE's development. Detailed biography details will be updated later.",
      education: "Content will be updated soon.",
      contributions: "Early-stage project coordination, material pipeline support, and local pilot documentation.",
      skills: ["Community Outreach", "Data Documentation", "Team Collaboration"],
      awards: ["UNICEF Generation Unlimited Team Champion"],
      social: "#"
    },
    {
      id: "oyku",
      name: "Öykü Şevin Anık",
      role: "Former Team Member",
      status: "Former Team Member",
      isFounder: false,
      bio: "Öykü assisted with collaborative research, early materials tracking, and youth advocacy representing the initiative in public science expositions. Detailed biography details will be updated later.",
      education: "Content will be updated soon.",
      contributions: "Scientific documentation, event setup support, and materials evaluation assistant.",
      skills: ["Technical Writing", "Ecology Studies", "Event Representation"],
      awards: ["UNICEF Generation Unlimited Team Champion"],
      social: "#"
    }
  ],
  tr: [
    {
      id: "yusuf",
      name: "Yusuf Aydın Doğru",
      role: "Kurucu ve Takım Kaptanı",
      status: "Aktif Liderlik",
      isFounder: true,
      bio: "Yusuf, ödüllü bir genç yenilikçi, çevre savunucusu ve Team INSPIRE'ın vizyoner kurucusudur. Döngüsel ekonomiye duyduğu derin tutkuyla, denizel çift kabuklu atıklarını yüksek yüzey alanlı su filtreleme platformlarına dönüştürme fikrini geliştirdi. Küresel gençlik çevre liderliğini temsil eden Yusuf, ileri düzey bilim ile tabandan gelen sosyal eylemleri birleştirmiş, araştırmalarını Çin'deki Dünya Gençlik Gelişim Forumu gibi prestijli uluslararası zirvelerde sunmuştur.",
      education: "Çevre ve Kimya Mühendisliği Bölümü, küresel çevre enstitüleri ile ortak çalışmalar.",
      contributions: "PureFlow'un temel bilimsel tasarımını yönetti, kurumsal ve kurumsal ortaklıkları kurdu, küresel UNICEF GenU fonunu güvence altına aldı ve Çin ile Avrupa'daki uluslararası sunum operasyonlarını yönetti.",
      skills: ["Çevre Proses Mühendisliği", "Döngüsel Ekonomi Tasarımı", "Ar-Ge Sınıflandırma", "Stratejik Ortaklıklar", "Topluluk Önünde Konuşma", "Proje Geliştirme"],
      awards: [
        "Küresel Birinci - Generation Unlimited Gençlik Yarışması (UNICEF ve Ortakları)",
        "Seçkin Delege ve Sunucu - Dünya Gençlik Gelişim Forumu (Pekin, Çin)",
        "Ulusal İnovasyon Ödülü Sahibi - Çevre Teknolojileri Segmenti",
        "Uluslararası çevre ağları tarafından Genç İklim Lideri unvanı"
      ],
      social: "https://linkedin.com/in/yusuf-aydin-dogru"
    },
    {
      id: "cemre",
      name: "Cemre Oruç",
      role: "Geçmiş Ekip Üyesi",
      status: "Geçmiş Ekip Üyesi",
      isFounder: false,
      bio: "Cemre, PureFlow projesinin erken gelişim, Ar-Ge ve halkla ilişkiler süreçlerine değerli katkılarda bulunmuştur. Erken aşama kampanyalarımızdaki desteği, Team INSPIRE'ın temellerini güçlendirmiştir. Detaylı biyografi bilgileri daha sonra eklenecektir.",
      education: "İçerik yakında güncellenecektir.",
      contributions: "Erken aşama proje koordinasyonu, yerel pilot uygulamaları ve topluluk yardım faaliyetleri.",
      skills: ["Toplumsal Farkındalık", "Veri Takibi", "Ekip Çalışması"],
      awards: ["UNICEF Generation Unlimited Ekip Başarısı"],
      social: "#"
    },
    {
      id: "oyku",
      name: "Öykü Şevin Anık",
      role: "Geçmiş Ekip Üyesi",
      status: "Geçmiş Ekip Üyesi",
      isFounder: false,
      bio: "Öykü, PureFlow'un erken laboratuvar süreçlerinde ve bilim şenliği temsiliyetlerinde aktif rol üstlenmiştir. Detaylı biyografi bilgileri daha sonra eklenecektir.",
      education: "İçerik yakında güncellenecektir.",
      contributions: "Bilimsel dokümantasyon desteği, materyal hazırlığı ve gençlik ekoloji savunuculuğu faaliyetleri.",
      skills: ["Teknik Yazım", "Ekoloji Çalışmaları", "Etkinlik Temsiliyeti"],
      awards: ["UNICEF Generation Unlimited Ekip Başarısı"],
      social: "#"
    }
  ]
};

// --- MENTORS, RESEARCHERS & SUPPORTERS DATA ---
const supportersData = {
  en: {
    research: [
      {
        name: "Cumali Yılmaz",
        role: "Chemist, Researcher, Laboratory Mentor",
        desc: "One of the earliest supporters of PureFlow. Provided scientific guidance, laboratory support, research mentorship, and technical assistance during the development of the project."
      },
      {
        name: "Filiz Koyuncu",
        role: "PhD Researcher, Chemist",
        desc: "Contributed to laboratory research activities and supported the scientific development process of PureFlow."
      },
      {
        name: "Yekbun Avşar",
        role: "Senior Chemist, Research Assistant",
        desc: "Supported experimental studies, laboratory analysis, and scientific research activities related to the project."
      },
      {
        name: "Prof. Dr. Fuat Güzel",
        role: "Professor of Chemistry",
        desc: "Provided academic guidance and oversight to the research team supporting PureFlow's scientific development."
      }
    ],
    mentors: [
      {
        name: "Ebru Gökçe",
        role: "Project Assistant – Habitat Association",
        desc: "Provided continuous support throughout the journey from national champion to global champion and during participation in international opportunities and programs."
      },
      {
        name: "Esra Geneci",
        role: "Mentor – Accenture",
        desc: "Supported Team INSPIRE through mentorship, strategic guidance, professional networking opportunities, and project development advice."
      },
      {
        name: "Meltem Çekin",
        role: "UNICEF Türkiye",
        desc: "Supported Team INSPIRE during various stages of its national and international journey and contributed to the team's visibility and growth opportunities."
      },
      {
        name: "Nicolas Cipriota",
        role: "Generation Unlimited / UNICEF Global",
        desc: "Provided international guidance, support, and opportunities through the Generation Unlimited ecosystem and the imaGen Ventures Global Winners program."
      },
      {
        name: "Hozan Adar",
        role: "Deutsche Welle Türkiye",
        desc: "Helped amplify the story of Team INSPIRE and PureFlow through international media exposure and coverage."
      }
    ]
  },
  tr: {
    research: [
      {
        name: "Cumali Yılmaz",
        role: "Kimyager, Araştırmacı, Laboratuvar Mentoru",
        desc: "PureFlow'un en erken destekçilerinden biri. Projenin geliştirilmesi sırasında bilimsel rehberlik, laboratuvar desteği, araştırma mentorluğu ve teknik yardım sağladı."
      },
      {
        name: "Filiz Koyuncu",
        role: "Doktora Araştırmacısı, Kimyager",
        desc: "Laboratuvar araştırma faaliyetlerine katkıda bulundu ve PureFlow'un bilimsel gelişim sürecini destekledi."
      },
      {
        name: "Yekbun Avşar",
        role: "Kıdemli Kimyager, Araştırma Görevlisi",
        desc: "Projeyle ilgili deneysel çalışmaları, laboratuvar analizlerini ve bilimsel araştırma faaliyetlerini destekledi."
      },
      {
        name: "Prof. Dr. Fuat Güzel",
        role: "Kimya Profesörü",
        desc: "PureFlow'un bilimsel gelişimini destekleyen araştırma ekibe akademik rehberlik ve denetim sağladı."
      }
    ],
    mentors: [
      {
        name: "Ebru Gökçe",
        role: "Proje Asistanı – Habitat Derneği",
        desc: "Ulusal şampiyonluktan küresel şampiyonluğa uzanan yolculukta, uluslararası fırsat ve programlara katılım süreçlerinde kesintisiz destek sağladı."
      },
      {
        name: "Esra Geneci",
        role: "Mentor – Accenture",
        desc: "Team INSPIRE'ı mentorluk, stratejik rehberlik, profesyonel ağ fırsatları ve proje geliştirme tavsiyeleriyle destekledi."
      },
      {
        name: "Meltem Çekin",
        role: "UNICEF Türkiye",
        desc: "Team INSPIRE'ı ulusal ve uluslararası yolculuğunun çeşitli aşamalarında destekledi, ekibin görünürlüğüne ve büyüme fırsatlarına katkıda bulundu."
      },
      {
        name: "Nicolas Cipriota",
        role: "Generation Unlimited / UNICEF Küresel",
        desc: "Generation Unlimited ekosistemi ve imaGen Ventures Küresel Kazananlar programı aracılığıyla uluslararası rehberlik, destek ve fırsatlar sağladı."
      },
      {
        name: "Hozan Adar",
        role: "Deutsche Welle Türkiye",
        desc: "Uluslararası medya görünürlüğü ve haber kapsamı aracılığıyla Team INSPIRE ve PureFlow'un hikayesinin yayılmasına yardımcı oldu."
      }
    ]
  }
};

// --- SUSTAINABLE DEVELOPMENT GOALS (SDGs) ---
const sdgsData = {
  en: {
    primary: [
      {
        id: 6,
        icon: "🌊",
        title: "SDG 6 – Clean Water and Sanitation",
        desc: "PureFlow directly contributes to improving water quality through innovative and sustainable bio-filtration, removing heavy metals and synthetic dyes safely without high energy use."
      },
      {
        id: 14,
        icon: "🐠",
        title: "SDG 14 – Life Below Water",
        desc: "By reducing industrial pollutants entering aquatic ecosystems and promoting circular bivalve shell reuse, PureFlow protects fragile marine and freshwater habitats."
      }
    ],
    secondary: [
      { id: 3, icon: "🏥", title: "SDG 3 – Good Health and Well-being" },
      { id: 9, icon: "🏭", title: "SDG 9 – Industry, Innovation and Infrastructure" },
      { id: 11, icon: "🏙️", title: "SDG 11 – Sustainable Cities and Communities" },
      { id: 12, icon: "🔄", title: "SDG 12 – Responsible Consumption and Production" },
      { id: 13, icon: "🌱", title: "SDG 13 – Climate Action" },
      { id: 17, icon: "🤝", title: "SDG 17 – Partnerships for the Goals" }
    ]
  },
  tr: {
    primary: [
      {
        id: 6,
        icon: "🌊",
        title: "SKA 6 – Temiz Su ve Sanitasyon",
        desc: "PureFlow, yenilikçi ve sürdürülebilir biyo-filtrasyon yöntemleriyle ağır metalleri ve sentetik boyaları yüksek enerji harcamadan gidererek su kalitesinin artırılmasına doğrudan katkıda bulunur."
      },
      {
        id: 14,
        icon: "🐠",
        title: "SKA 14 – Sudaki Yaşam",
        desc: "Sucul ekosistemlere giren endüstriyel kirleticileri azaltarak ve midye kabuklarının döngüsel kullanımını teşvik ederek PureFlow, deniz ve tatlı su habitatlarını korur."
      }
    ],
    secondary: [
      { id: 3, icon: "🏥", title: "SKA 3 – Sağlık ve Kaliteli Yaşam" },
      { id: 9, icon: "🏭", title: "SKA 9 – Sanayi, Yenilikçilik ve Altyapı" },
      { id: 11, icon: "🏙️", title: "SKA 11 – Sürdürülebilir Şehirler ve Topluluklar" },
      { id: 12, icon: "🔄", title: "SKA 12 – Sorumlu Tüketim ve Üretim" },
      { id: 13, icon: "🌱", title: "SKA 13 – İklim Eylemi" },
      { id: 17, icon: "🤝", title: "SKA 17 – Amaçlar İçin Ortaklıklar" }
    ]
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('bio'); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- PureFlow Interactive Lab Exhibit Active Step (1 to 7) ---
  const [exhibitStep, setExhibitStep] = useState(3);

  // --- Virtual Lab Simulator State ---
  const [pollutant, setPollutant] = useState('dye');
  const [labState, setLabState] = useState('idle'); // 'idle' | 'filtering' | 'complete'
  const [purity, setPurity] = useState(12); // Initial low purity %
  const [adsorptionCount, setAdsorptionCount] = useState(0);
  const [toxicity, setToxicity] = useState(94); // Initial high toxicity %
  const intervalRef = useRef(null);

  // --- Gemini API (Custom Pollutant) State ---
  const [customDescription, setCustomDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [aiError, setAiError] = useState('');

  // --- Gemini API (Yusuf Chatbot) State ---
  const [yusufMessages, setYusufMessages] = useState([
    {
      sender: 'yusuf',
      text: "Hi! I am the AI replica of Yusuf Aydın Doğru. Ask me anything about how we founded Team INSPIRE, developed our bio-filter, or won the UNICEF Global Challenge!"
    }
  ]);
  const [yusufInput, setYusufInput] = useState('');
  const [isYusufLoading, setIsYusufLoading] = useState(false);

  // --- Contact Form State ---
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const t = translations[lang];
  const members = teamMembers[lang];
  const mediaCoverage = mediaCoverageData[lang];
  const supporters = supportersData[lang];
  const sdgs = sdgsData[lang];

  // Separating primary leader from peers for visual distinction inside the team area
  const activeLeader = members.find(m => m.id === 'yusuf');
  const otherPeers = members.filter(m => m.id !== 'yusuf');

  // Cleanup simulation timer
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Handle Pollutant Selection
  const handlePollutantChange = (e) => {
    const value = e.target.value;
    setPollutant(value);
    setLabState('idle');
    setAiReport('');
    setAiError('');

    if (value === 'dye') {
      setPurity(12);
      setToxicity(94);
      setAdsorptionCount(0);
    } else if (value === 'metal') {
      setPurity(6);
      setToxicity(98);
      setAdsorptionCount(0);
    } else if (value === 'organic') {
      setPurity(18);
      setToxicity(82);
      setAdsorptionCount(0);
    } else if (value === 'custom') {
      setPurity(5);
      setToxicity(99);
      setAdsorptionCount(0);
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Run Virtual Lab Simulation
  const startSimulation = () => {
    if (labState === 'filtering') return;
    setLabState('filtering');
    
    let currentPurity = purity;
    let currentToxicity = toxicity;
    let count = 0;

    intervalRef.current = setInterval(() => {
      currentPurity += (100 - currentPurity) * 0.15;
      currentToxicity -= currentToxicity * 0.15;
      count += Math.floor(Math.random() * 85) + 40;

      if (currentPurity >= 98.2) {
        setPurity(99.4);
        setToxicity(0.8);
        setAdsorptionCount(count + 120);
        setLabState('complete');
        clearInterval(intervalRef.current);
      } else {
        setPurity(parseFloat(currentPurity.toFixed(1)));
        setToxicity(parseFloat(currentToxicity.toFixed(1)));
        setAdsorptionCount(count);
      }
    }, 150);
  };

  // AI TREATMENT ADVISOR: Calls Gemini LLM to design custom treatment matrix
  const handleAiTreatmentDesign = async () => {
    if (!customDescription.trim()) return;
    setIsAiLoading(true);
    setAiError('');
    setAiReport('');

    const systemPrompt = `
      You are the PureFlow AI Bio-Filter System Architect. The user will provide a complex, custom polluted wastewater description.
      You must scientifically analyze how thermally and chemically activated mussel shells (providing highly porous CaCO3/carbon structures) can bond to, trap, or filter these elements.
      Return your analysis as structured markdown in a concise, startup-oriented tone. Highlight:
      1. Recommended Calcination Temperature (select between 500°C - 850°C based on composition).
      2. Key Chemical Interaction Mechanism (e.g., electrostatic binding, chemical deposition).
      3. Safety & Environmental compliance.
      Respond in ${lang === 'en' ? 'English' : 'Turkish'}. Keep it scientifically rich yet clear.
    `;

    try {
      const response = await callGeminiAPI(customDescription, systemPrompt);
      setAiReport(response);
      
      // Seed randomized high-performance metrics for simulation visualization
      setPurity(98.9);
      setToxicity(1.2);
      setAdsorptionCount(1420);
      setLabState('complete');
    } catch (err) {
      setAiError(err.message || "An error occurred compiling the AI model.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // YUSUF CHAT AVATAR: Talk with Yusuf AI Avatar
  const handleSendYusufMessage = async (e) => {
    e.preventDefault();
    if (!yusufInput.trim() || isYusufLoading) return;

    const userMsg = yusufInput.trim();
    setYusufInput('');
    setYusufMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsYusufLoading(true);

    const systemPrompt = `
      You are the AI Avatar replica of Yusuf Aydın Doğru, the award-winning Founder and Team Captain of Team INSPIRE.
      You speak dynamically, enthusiastically, and professionally as an innovative youth leader (born around 2004/2005, highly knowledgeable about environmental science, engineering, and climate advocacy).
      You led your team to win the UNICEF Generation Unlimited Youth Challenge.
      Be positive, highly inspiring, and provide crisp, realistic responses in first person ("I", "we", "my team").
      Keep your response to 1-2 paragraphs max. Respond in the same language as the user's message (${lang === 'en' ? 'English' : 'Turkish'}).
    `;

    try {
      const response = await callGeminiAPI(userMsg, systemPrompt);
      setYusufMessages(prev => [...prev, { sender: 'yusuf', text: response }]);
    } catch (err) {
      setYusufMessages(prev => [...prev, { sender: 'yusuf', text: "Sorry, my mental uplink is experiencing structural interference. Let's try again in a bit!" }]);
    } finally {
      setIsYusufLoading(false);
    }
  };

  const resetSimulation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLabState('idle');
    setAiReport('');
    setAiError('');
    if (pollutant === 'dye') {
      setPurity(12);
      setToxicity(94);
    } else if (pollutant === 'metal') {
      setPurity(6);
      setToxicity(98);
    } else if (pollutant === 'organic') {
      setPurity(18);
      setToxicity(82);
    } else {
      setPurity(5);
      setToxicity(99);
    }
    setAdsorptionCount(0);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setContactForm({ name: '', email: '', subject: '', message: '' });
      }, 5000);
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'tr' : 'en');
  };

  return (
    <div className="min-h-screen bg-[#18072b] text-slate-100 font-sans selection:bg-[#c471ed] selection:text-white overflow-x-hidden relative font-body">
      
      {/* Dynamic Google Fonts Stylesheet Injection & Custom Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syncopate:wght@400;700&family=Montserrat:wght@300;400;500;700;900&display=swap');
        
        .font-lastica-style {
          font-family: 'Syncopate', 'Montserrat', sans-serif;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 900; 
        }

        .font-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .brand-text-elegant {
          font-family: 'Syncopate', 'Montserrat', sans-serif;
          font-weight: 300; 
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #18072b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c471ed;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #12c2e8;
        }
      `}</style>

      {/* --- SUBTLE EDGE GEOMETRIC SHAPES & FLOATING BLURRED GRADIENTS --- */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full border border-[#12c2e8]/20 animate-pulse pointer-events-none hidden lg:block" />
      <div className="absolute top-48 -left-12 w-64 h-64 bg-gradient-to-r from-[#12c2e8]/10 to-[#c471ed]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-l from-[#c471ed]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      {/* Decorative vector outlines along borders */}
      <svg className="absolute left-4 top-[35%] w-16 h-32 text-[#12c2e8]/15 pointer-events-none hidden xl:block" viewBox="0 0 100 200">
        <path d="M10,10 L90,50 L90,150 L10,190 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
      </svg>
      <svg className="absolute right-4 top-[65%] w-16 h-32 text-[#c471ed]/15 pointer-events-none hidden xl:block" viewBox="0 0 100 200">
        <circle cx="50" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="10" x2="50" y2="190" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
      </svg>

      {/* Subtle diagonal accent lines at the bottom corners */}
      <div className="absolute bottom-10 left-6 w-32 h-[1px] bg-gradient-to-r from-[#12c2e8]/30 to-transparent transform -rotate-45 pointer-events-none hidden lg:block" />
      <div className="absolute bottom-20 right-6 w-32 h-[1px] bg-gradient-to-l from-[#c471ed]/30 to-transparent transform rotate-45 pointer-events-none hidden lg:block" />

      {/* --- HEADER & NAVIGATION --- */}
      <header className="sticky top-0 z-40 bg-[#18072b]/85 backdrop-blur-md border-b border-purple-950/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo Wrapper preserving proportions */}
          <a href="#hero" className="flex items-center space-x-3 group py-2">
            <div className="relative h-12 md:h-14 w-auto flex items-center">
              <img 
                src="inspire_logo.jpg" 
                alt="Team INSPIRE Logo" 
                className="h-full w-auto object-contain max-w-[180px] md:max-w-[220px]" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallbackTxt = document.getElementById('nav-fallback-text');
                  if (fallbackTxt) fallbackTxt.classList.remove('hidden');
                }}
              />
              <span id="nav-fallback-text" className="hidden brand-text-elegant text-base text-white">
                <span className="font-light text-slate-300">Team </span>INSPIRE
              </span>
            </div>
          </a>

          {/* Desktop Navigation Link Cluster */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-sm font-semibold text-slate-300 hover:text-[#12c2e8] transition-colors duration-200">{t.navAbout}</a>
            <a href="#lab-section" className="text-sm font-semibold text-slate-300 hover:text-[#12c2e8] transition-colors duration-200">{t.navLab}</a>
            <a href="#team" className="text-sm font-semibold text-slate-300 hover:text-[#12c2e8] transition-colors duration-200">{t.navTeam}</a>
            <a href="#media-section" className="text-sm font-semibold text-slate-300 hover:text-[#12c2e8] transition-colors duration-200">{lang === 'en' ? 'Media' : 'Medya'}</a>
            <a href="#supporters-section" className="text-sm font-semibold text-slate-300 hover:text-[#12c2e8] transition-colors duration-200">{lang === 'en' ? 'Supporters' : 'Destekçiler'}</a>
            <a href="#sdg-section" className="text-sm font-semibold text-slate-300 hover:text-[#12c2e8] transition-colors duration-200">SKA / SDGs</a>
            <a href="#awards" className="text-sm font-semibold text-slate-300 hover:text-[#12c2e8] transition-colors duration-200">{t.navAwards}</a>
            <a href="#contact" className="text-sm font-semibold text-slate-300 hover:text-[#12c2e8] transition-colors duration-200">{t.navContact}</a>
          </nav>

          {/* Right Action Menu: Lang Switcher & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className="px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-cyan-300 hover:bg-purple-500/20 hover:border-[#12c2e8] transition-all duration-300 flex items-center space-x-2"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'TR' : 'EN'}</span>
            </button>
            <a 
              href="#lab-section"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#12c2e8] to-[#c471ed] text-xs font-bold text-slate-950 hover:opacity-90 shadow-[0_4px_14px_rgba(18,194,232,0.3)] transition-all duration-300 hover:scale-[1.03]"
            >
              {t.btnLab}
            </a>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center space-x-3 md:hidden">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-[#12c2e8] hover:bg-purple-500/20"
            >
              {lang === 'en' ? 'TR' : 'EN'}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-100 hover:text-[#12c2e8] transition-colors p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-[#18072b]/98 backdrop-blur-lg flex flex-col justify-center items-center space-y-8 animate-fade-in">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold hover:text-[#12c2e8] transition-colors font-lastica-style">{t.navAbout}</a>
          <a href="#lab-section" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold hover:text-[#12c2e8] transition-colors font-lastica-style">{t.navLab}</a>
          <a href="#team" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold hover:text-[#12c2e8] transition-colors font-lastica-style">{t.navTeam}</a>
          <a href="#media-section" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold hover:text-[#12c2e8] transition-colors font-lastica-style">{lang === 'en' ? 'Media' : 'Medya'}</a>
          <a href="#supporters-section" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold hover:text-[#12c2e8] transition-colors font-lastica-style">{lang === 'en' ? 'Supporters' : 'Destekçiler'}</a>
          <a href="#sdg-section" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold hover:text-[#12c2e8] transition-colors font-lastica-style">SKA / SDGs</a>
          <a href="#awards" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold hover:text-[#12c2e8] transition-colors font-lastica-style">{t.navAwards}</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold hover:text-[#12c2e8] transition-colors font-lastica-style">{t.navContact}</a>
          <a href="#lab-section" onClick={() => setMobileMenuOpen(false)} className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#12c2e8] to-[#c471ed] text-sm font-black text-slate-950 shadow-lg">{t.btnLab}</a>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative min-h-[calc(100vh-80px)] flex items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0c36_1px,transparent_1px),linear-gradient(to_bottom,#1f0c36_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left relative z-10">
            
            {/* Global Winner Pill */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-950/60 to-slate-900/40 border border-[#c471ed]/30 px-3.5 py-1.5 rounded-full w-fit self-start backdrop-blur-sm animate-pulse">
              <Award className="w-4.5 h-4.5 text-[#12c2e8]" />
              <span className="text-xs font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                {t.heroBadge}
              </span>
            </div>

            {/* Huge Headline in customized Lastica-style typeface (Ultra Bold 900) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-lastica-style leading-[1.25] text-white">
              {t.heroTitle} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#12c2e8] via-[#c471ed] to-[#12c2e8] drop-shadow-sm">
                {t.heroTitleGradient}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
              We transform local marine waste into high-performance, circular-economy water filtration systems with the support of <span className="brand-text-elegant text-xs text-cyan-300 font-normal">Team INSPIRE</span> to tackle global industrial water pollution.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a 
                href="#about"
                className="group flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#12c2e8] to-[#c471ed] text-slate-950 text-sm font-black tracking-wider hover:opacity-95 shadow-[0_4px_20px_rgba(18,194,232,0.35)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>{t.btnExplore}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </a>
              <a 
                href="#lab-section"
                className="flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-purple-500/40 bg-purple-950/10 hover:bg-purple-900/20 text-slate-200 hover:text-white hover:border-[#12c2e8] text-sm font-bold tracking-wide transition-all duration-300"
              >
                <FlaskConical className="w-4 h-4 text-[#c471ed]" />
                <span>{t.btnLab}</span>
              </a>
            </div>

          </div>

          {/* Hero Right Visuals: Showcase of Official Logo Image preserving aspect ratio */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[480px] aspect-[16/9] rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-[#12c2e8]/40 via-purple-500/20 to-[#c471ed]/60 shadow-[0_0_40px_rgba(18,194,232,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 mix-blend-color-dodge opacity-60 pointer-events-none" />
              
              <img 
                src="inspire_logo.jpg" 
                alt="Team INSPIRE Official Banner Logo" 
                className="w-full h-full object-cover rounded-[22px] shadow-2xl relative z-10 transition-transform duration-700 hover:scale-[1.03]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallbackEl = document.getElementById('logo-fallback');
                  if (fallbackEl) fallbackEl.classList.remove('hidden');
                }}
              />

              {/* Robust fallback replicating the visual weight of the official banner */}
              <div id="logo-fallback" className="hidden absolute inset-0 bg-[#18072b] rounded-[22px] flex flex-col items-center justify-center p-6 text-center z-10 border border-purple-500/30">
                <span className="brand-text-elegant text-2xl text-white"><span className="font-light text-slate-400">Team </span>INSPIRE</span>
                <p className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase mt-2">Youth-Led Clean Water Innovation</p>
              </div>

              {/* Glowing Ambient Accents matching the #12c2e8 cyan gradient */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#12c2e8] rounded-tl-xl z-20 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#c471ed] rounded-br-xl z-20 pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* --- IMPACT STATS SECTION --- */}
      <section className="py-20 bg-[#200d3a]/60 border-y border-purple-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-lastica-style tracking-widest text-[#12c2e8] uppercase">{t.statsTitle}</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-4 text-white">
              Empowering Communities with Sustainable Bio-Filters by <span className="brand-text-elegant text-xl text-cyan-300 font-normal">Team INSPIRE</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Stat Card 1 */}
            <div className="bg-[#200d3a] border border-purple-950/50 p-8 rounded-2xl relative overflow-hidden group hover:border-[#12c2e8]/45 transition-all duration-300 shadow-md">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-[#12c2e8] mb-6">
                <Droplet className="w-6 h-6" />
              </div>
              <p className="text-3xl font-lastica-style text-white tracking-tight mb-2">10k+ L</p>
              <h4 className="text-sm font-semibold text-slate-400">{t.statWaterTreated}</h4>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                {lang === 'en' ? 'Treated and repurposed during micro-pilot laboratory stages.' : 'Mikro-pilot laboratuvar aşamalarında arıtılan ve yeniden kullanılan su miktarı.'}
              </p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-[#200d3a] border border-purple-950/50 p-8 rounded-2xl relative overflow-hidden group hover:border-[#c471ed]/45 transition-all duration-300 shadow-md">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#c471ed] mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-3xl font-lastica-style text-white tracking-tight mb-2">99.4%</p>
              <h4 className="text-sm font-semibold text-slate-400">{t.statRemovalRate}</h4>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                {lang === 'en' ? 'Efficiency in retaining complex industrial textile synthetic dyes.' : 'Kompleks endüstriyel tekstil sentetik boyalarının tutulmasındaki arıtma başarısı.'}
              </p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-[#200d3a] border border-purple-950/50 p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/45 transition-all duration-300 shadow-md">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <p className="text-3xl font-lastica-style text-white tracking-tight mb-2">2.5+ T</p>
              <h4 className="text-sm font-semibold text-slate-400">{t.statWastediverted}</h4>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                {lang === 'en' ? 'Mussel shell ecological waste redirected from waste heaps into research.' : 'Katı atık depolama alanlarından alınarak bilimsel araştırmaya kazandırılan midye kabuğu.'}
              </p>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-[#200d3a] border border-purple-950/50 p-8 rounded-2xl relative overflow-hidden group hover:border-amber-500/45 transition-all duration-300 shadow-md">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-xl font-lastica-style text-white tracking-tight mb-2">WINNER</p>
              <h4 className="text-sm font-semibold text-slate-400">{t.statGlobalRecognition}</h4>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                {lang === 'en' ? 'Crowned Global Winner among hundreds of international youth projects.' : 'Yüzlerce uluslararası gençlik projesi arasından seçilerek Küresel Birinci ilan edildik.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- ABOUT & PROCESS (PUREFLOW) --- */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Technical Process Left Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#12c2e8]/20 to-[#c471ed]/20 px-3 py-1 rounded-md border border-[#12c2e8]/30">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">{t.aboutSubtitle}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-lastica-style text-white leading-snug">
                {t.aboutTitle}
              </h2>
              <p className="text-slate-300 leading-relaxed font-light">
                {t.aboutP1}
              </p>
              <p className="text-slate-300 leading-relaxed font-light">
                {t.aboutP2}
              </p>
            </div>

            {/* Technical Diagram Right Panel */}
            <div className="lg:col-span-6 bg-[#200d3a]/80 border border-purple-500/20 p-8 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(18,194,232,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-md font-lastica-style text-white mb-8 border-b border-purple-950/50 pb-4 flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>Scientific Adsorption Pipeline</span>
              </h3>

              <div className="space-y-6 relative">
                
                {/* Step 1 */}
                <div className="flex space-x-4 relative z-10 group">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-[#12c2e8]/40 flex items-center justify-center text-xs font-black text-cyan-400 group-hover:bg-[#12c2e8]/20 transition-all duration-300">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-200 group-hover:text-[#12c2e8] transition-colors">{t.processStep1}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.processStep1Desc}</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex space-x-4 relative z-10 group">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-purple-500/40 flex items-center justify-center text-xs font-black text-purple-400 group-hover:bg-purple-500/20 transition-all duration-300">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-200 group-hover:text-[#c471ed] transition-colors">{t.processStep2}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.processStep2Desc}</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex space-x-4 relative z-10 group">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-[#12c2e8]/40 flex items-center justify-center text-xs font-black text-cyan-400 group-hover:bg-[#12c2e8]/20 transition-all duration-300">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-200 group-hover:text-[#12c2e8] transition-colors">{t.processStep3}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.processStep3Desc}</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex space-x-4 relative z-10 group">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-xs font-black text-emerald-400 group-hover:bg-emerald-500/20 transition-all duration-300">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-200 group-hover:text-emerald-400 transition-colors">{t.processStep4}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.processStep4Desc}</p>
                  </div>
                </div>

                <div className="absolute top-4 left-4 bottom-4 w-[1px] bg-purple-950/50 -z-0" />

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* --- INTERACTIVE LAB SIMULATOR & ADSORPTION EXHIBIT --- */}
      <section id="lab-section" className="py-24 bg-[#200d3a]/40 px-4 sm:px-6 lg:px-8 border-y border-purple-950/30">
        <div className="max-w-7xl mx-auto relative">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#12c2e8]/10 px-3 py-1 rounded-full text-xs font-bold text-cyan-300 border border-[#12c2e8]/20 mb-4">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Interactive Demonstration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-lastica-style text-white">{t.labTitle}</h2>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">{t.labSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Exhibit Navigation (Left side on desktop) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xs font-lastica-style text-[#12c2e8] border-b border-purple-950/40 pb-3 mb-4 tracking-wider">
                  {lang === 'en' ? 'Exhibit Steps' : 'Sergi Aşamaları'}
                </h3>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => {
                    const stepTitle = t[`step${stepNum}Title`];
                    const isActive = exhibitStep === stepNum;
                    return (
                      <button
                        key={stepNum}
                        onClick={() => setExhibitStep(stepNum)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center space-x-3 ${
                          isActive 
                            ? 'bg-gradient-to-r from-[#12c2e8]/10 to-[#c471ed]/10 border-[#12c2e8]/60 shadow-[0_0_15px_rgba(18,194,232,0.15)]' 
                            : 'bg-[#18072b]/50 border-purple-950/40 hover:bg-[#200d3a]/60 hover:border-purple-500/30'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isActive ? 'bg-[#12c2e8] text-slate-950' : 'bg-purple-950 text-slate-400'
                        }`}>
                          {stepNum}
                        </div>
                        <span className={`text-xs font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
                          {stepTitle.split('. ')[1] || stepTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic explanations for current step */}
              <div className="bg-[#18072b]/80 border border-purple-950/50 p-5 rounded-2xl animate-fade-in min-h-[140px] flex flex-col justify-center">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                  {lang === 'en' ? 'Scientific Explanation' : 'Bilimsel Açıklama'}
                </span>
                <h4 className="text-sm font-extrabold text-white mb-2">
                  {t[`step${exhibitStep}Title`]}
                </h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {t[`step${exhibitStep}Desc`]}
                </p>
              </div>

            </div>

            {/* Interactive Science Visualisation Panel */}
            <div className="lg:col-span-7 bg-[#18072b] border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[400px] overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#18072b] to-[#18072b] opacity-90 z-0" />
              
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                
                {/* EXHIBIT 1: Raw Shells */}
                {exhibitStep === 1 && (
                  <div className="text-center space-y-6 animate-fade-in w-full">
                    <svg className="w-36 h-36 mx-auto text-[#12c2e8]" viewBox="0 0 100 100" fill="none">
                      <path d="M50,15 C25,25 20,60 50,85 C80,60 75,25 50,15 Z" stroke="currentColor" strokeWidth="2.5" fill="url(#purpleGrad)" fillOpacity="0.15" />
                      <path d="M50,15 C38,30 35,55 50,85" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                      <path d="M50,15 C62,30 65,55 50,85" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                    </svg>
                    <div className="text-center">
                      <span className="text-[10px] font-lastica-style text-[#12c2e8] tracking-widest block">RAW CaCO₃</span>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">Denser structural configuration lacking active porous surface area before thermal treatment.</p>
                    </div>
                  </div>
                )}

                {/* EXHIBIT 2: Thermal Calcination */}
                {exhibitStep === 2 && (
                  <div className="text-center space-y-6 animate-fade-in w-full">
                    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 border-2 border-dashed border-[#c471ed]/30 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                      <Flame className="w-20 h-20 text-orange-500 animate-pulse relative z-10" />
                      <svg className="absolute w-full h-full text-[#c471ed] opacity-40 animate-pulse" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[10px] font-lastica-style text-[#c471ed] tracking-widest block">600°C - 800°C SINTERING</span>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">Thermal calcinating reorganizes the crystal lattice structure, purging trace carbonates.</p>
                    </div>
                  </div>
                )}

                {/* EXHIBIT 3: Pore Matrix */}
                {exhibitStep === 3 && (
                  <div className="text-center space-y-6 animate-fade-in w-full">
                    <svg className="w-44 h-44 mx-auto text-cyan-400" viewBox="0 0 100 100" fill="none">
                      <polygon points="50,10 67,20 67,40 50,50 33,40 33,20" stroke="currentColor" strokeWidth="1.5" fill="#12c2e8" fillOpacity="0.05" />
                      <polygon points="67,20 84,30 84,50 67,60 50,50 50,30" stroke="#c471ed" strokeWidth="1" />
                      <polygon points="33,20 50,30 50,50 33,60 16,50 16,30" stroke="#c471ed" strokeWidth="1" />
                      <polygon points="50,50 67,60 67,80 50,90 33,80 33,60" stroke="currentColor" strokeWidth="1.5" fill="#12c2e8" fillOpacity="0.05" />
                      <circle cx="50" cy="30" r="4" fill="#12c2e8" className="animate-ping" />
                      <circle cx="50" cy="70" r="4" fill="#c471ed" className="animate-ping" />
                    </svg>
                    <div>
                      <span className="text-[10px] font-lastica-style text-[#12c2e8] tracking-widest block">NANOPOROUS CAVITY WEB</span>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">Active cavernous channels forming a vast network of chemical binding sites.</p>
                    </div>
                  </div>
                )}

                {/* EXHIBIT 4: Inflowing Pollution */}
                {exhibitStep === 4 && (
                  <div className="text-center space-y-6 animate-fade-in w-full">
                    <div className="relative w-44 h-44 mx-auto bg-purple-950/20 rounded-full border border-purple-500/20 overflow-hidden flex flex-col justify-between items-center p-4">
                      <Waves className="w-12 h-12 text-[#12c2e8] animate-bounce mt-10" />
                      <span className="text-[9px] font-bold text-rose-400 animate-pulse">POLLUTANTS INCOMING</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-lastica-style text-rose-400 tracking-widest block">EFFLUENTS SUSPENDED</span>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">Industrial effluents and heavy metals approach bivalve channels.</p>
                    </div>
                  </div>
                )}

                {/* EXHIBIT 5: Attraction Vectors */}
                {exhibitStep === 5 && (
                  <div className="text-center space-y-6 animate-fade-in w-full">
                    <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="30" stroke="#12c2e8" strokeWidth="2.5" fill="none" />
                      <circle cx="20" cy="20" r="3" fill="#c471ed" className="animate-pulse" />
                      <line x1="20" y1="20" x2="38" y2="38" stroke="#12c2e8" strokeWidth="1" strokeDasharray="2,2" />
                      <circle cx="80" cy="20" r="3" fill="#c471ed" className="animate-pulse" />
                      <line x1="80" y1="20" x2="62" y2="38" stroke="#12c2e8" strokeWidth="1" strokeDasharray="2,2" />
                    </svg>
                    <div>
                      <span className="text-[10px] font-lastica-style text-[#12c2e8] tracking-widest block">ELECTROSTATIC VECTORS</span>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">Opposing charges bind suspended ion pollutants to localized micro-pores.</p>
                    </div>
                  </div>
                )}

                {/* EXHIBIT 6: Adsorption Capture */}
                {exhibitStep === 6 && (
                  <div className="text-center space-y-6 animate-fade-in w-full">
                    <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="28" stroke="#c471ed" strokeWidth="3" fill="none" />
                      <circle cx="30" cy="30" r="4.5" fill="#12c2e8" />
                      <circle cx="70" cy="30" r="4.5" fill="#12c2e8" />
                      <circle cx="50" cy="22" r="4.5" fill="#12c2e8" />
                    </svg>
                    <div>
                      <span className="text-[10px] font-lastica-style text-emerald-400 tracking-widest block">MOLECULES TRAPPED</span>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">Dyes and heavy metal pollutants locked onto the solid shell structure.</p>
                    </div>
                  </div>
                )}

                {/* EXHIBIT 7: Clean Discharge */}
                {exhibitStep === 7 && (
                  <div className="text-center space-y-6 animate-fade-in w-full">
                    <div className="relative w-44 h-44 mx-auto bg-emerald-950/10 rounded-full border border-emerald-500/20 flex flex-col justify-between items-center p-4">
                      <Waves className="w-16 h-16 text-emerald-400 animate-pulse mt-8" />
                      <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase">99.4% Purified</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-lastica-style text-emerald-400 tracking-widest block">SAFE CLEAN OUTFLOW</span>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">Crystalline pure output exiting back to industrial cooling loops or habitats.</p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* DYNAMIC METRIC LAB PLANNERS WITH GEMINI API SUPPORT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            
            {/* Control Panel */}
            <div className="lg:col-span-5 bg-[#200d3a] border border-purple-950/60 p-8 rounded-3xl flex flex-col justify-between">
              
              <div className="space-y-6">
                <h3 className="text-md font-lastica-style text-white border-b border-purple-950/40 pb-3 flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>Interactive Adsorption Simulator</span>
                </h3>

                {/* Pollutant Mode Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t.labSelectPollutant}</label>
                  <select 
                    value={pollutant}
                    onChange={handlePollutantChange}
                    className="w-full bg-[#18072b] border border-purple-500/20 hover:border-[#12c2e8]/40 text-slate-200 text-sm py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12c2e8] transition-all"
                  >
                    <option value="dye">{t.labPollutantDye}</option>
                    <option value="metal">{t.labPollutantMetal}</option>
                    <option value="organic">{t.labPollutantOrganic}</option>
                    <option value="custom">{t.labPollutantCustom}</option>
                  </select>
                </div>

                {/* Custom Pollutant Text Area utilizing Gemini 2.5 Flash */}
                {pollutant === 'custom' && (
                  <div className="space-y-3 pt-2 animate-fade-in">
                    <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      {t.aiCustomTextLabel}
                    </label>
                    <textarea 
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder={t.aiCustomPlaceholder}
                      className="w-full h-24 bg-[#18072b] border border-cyan-500/20 focus:border-[#12c2e8] focus:ring-1 focus:ring-[#12c2e8] rounded-xl p-3 text-xs text-slate-200 outline-none transition-all resize-none"
                    />
                    <button
                      onClick={handleAiTreatmentDesign}
                      disabled={isAiLoading || !customDescription.trim()}
                      className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-[#12c2e8]/40 text-[#12c2e8] font-bold text-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAiLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{t.aiAnalyzing}</span>
                        </>
                      ) : (
                        <span>{t.aiCalcBtn}</span>
                      )}
                    </button>
                    {aiError && (
                      <p className="text-[11px] text-rose-400 leading-normal bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                        {aiError}
                      </p>
                    )}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#18072b] border border-purple-950/40 space-y-2">
                  <h4 className="text-xs font-bold text-[#12c2e8] flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Real-Time Adsorption Tracking</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Compare the capture kinetics of textile effluents directly. Run adsorption sequences dynamically to analyze retention rates.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-6 lg:pt-0">
                {pollutant !== 'custom' && (
                  <button 
                    onClick={startSimulation}
                    disabled={labState === 'filtering'}
                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-md ${
                      labState === 'filtering' 
                      ? 'bg-purple-950/40 text-slate-400 border border-purple-950 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#12c2e8] to-[#c471ed] text-slate-950 hover:shadow-[0_0_20px_rgba(18,194,232,0.3)] hover:scale-[1.01]'
                    }`}
                  >
                    {labState === 'filtering' ? t.labStatusFiltering : t.labStartFilter}
                  </button>
                )}

                <button 
                  onClick={resetSimulation}
                  className="w-full py-3 rounded-xl border border-purple-500/20 hover:border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/10 text-slate-300 text-xs font-bold transition-all"
                >
                  {t.labReset}
                </button>

                <div className="text-center mt-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    System Feedback
                  </p>
                  <p className="text-xs font-semibold text-cyan-400 mt-1">
                    {labState === 'idle' && t.labStatusIdle}
                    {labState === 'filtering' && t.labStatusFiltering}
                    {labState === 'complete' && t.labStatusComplete}
                  </p>
                </div>

              </div>

            </div>

            {/* Dashboard Display */}
            <div className="lg:col-span-7 bg-[#200d3a] border border-purple-950/60 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#c471ed]/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                
                {/* Purity Indicator */}
                <div className="bg-[#18072b]/60 border border-purple-950/50 p-6 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.labMetricPurity}</p>
                  <p className={`text-3xl font-lastica-style mt-3 transition-colors duration-300 ${purity > 90 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {purity}%
                  </p>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full mt-4 overflow-hidden p-[1px] border border-purple-950">
                    <div 
                      className="bg-gradient-to-r from-[#12c2e8] to-[#c471ed] h-full rounded-full transition-all duration-300"
                      style={{ width: `${purity}%` }}
                    />
                  </div>
                </div>

                {/* Absorbance Indicator */}
                <div className="bg-[#18072b]/60 border border-purple-950/50 p-6 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.labMetricAdsorption}</p>
                  <p className="text-3xl font-lastica-style text-purple-400 mt-3">
                    {adsorptionCount}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-4 leading-normal">
                    Bounded Complex Molecules
                  </p>
                </div>

                {/* Toxicity Indicator */}
                <div className="bg-[#18072b]/60 border border-purple-950/50 p-6 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.labMetricToxicity}</p>
                  <p className={`text-3xl font-lastica-style mt-3 transition-colors duration-300 ${toxicity < 10 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {toxicity}%
                  </p>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full mt-4 overflow-hidden p-[1px] border border-purple-950">
                    <div 
                      className="bg-gradient-to-r from-rose-400 to-[#c471ed] h-full rounded-full transition-all duration-300"
                      style={{ width: `${toxicity}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* DYNAMIC AI REPORT SECTION */}
              {aiReport && (
                <div className="mt-6 bg-[#18072b]/80 border border-[#12c2e8]/20 rounded-2xl p-6 relative z-10 animate-fade-in max-h-48 overflow-y-auto custom-scrollbar">
                  <h4 className="text-xs font-bold text-cyan-400 flex items-center space-x-1.5 mb-3 border-b border-cyan-500/20 pb-2 uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.aiOutputTitle}</span>
                  </h4>
                  <div className="text-[11px] text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
                    {aiReport}
                  </div>
                </div>
              )}

              {/* Graphical Simulation Container */}
              <div className="h-44 bg-[#18072b] border border-purple-950/50 rounded-2xl mt-8 relative overflow-hidden flex flex-col justify-center items-center">
                <div className="absolute inset-x-0 top-0 h-4 bg-purple-950/20" />
                <div 
                  className="absolute inset-0 opacity-25 transition-all duration-700"
                  style={{
                    backgroundColor: labState === 'complete' 
                      ? '#059669' 
                      : pollutant === 'dye' 
                        ? '#3b0764' 
                        : pollutant === 'metal' 
                          ? '#06202c' 
                          : '#111827'
                  }}
                />

                {labState === 'filtering' && (
                  <div className="absolute inset-0 flex justify-around items-center opacity-60">
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                    <div className="w-1.5 h-1.5 bg-[#c471ed] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#12c2e8] rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    <div className="w-2.5 h-2.5 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '0.1s' }} />
                  </div>
                )}

                <div className="relative z-10 w-28 h-28 bg-[#200d3a] border-2 border-purple-500/30 rounded-xl flex flex-col justify-center items-center shadow-lg p-2 text-center">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className={`w-8 h-8 transition-colors duration-500 ${labState === 'complete' ? 'text-emerald-400' : 'text-cyan-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C6.47 2 2 6.47 2 12c0 4.19 2.58 7.78 6.22 9.28.23.09.4-.04.4-.28v-1.74" />
                      <path d="M12 2c5.53 0 10 4.47 10 10 0 4.19-2.58 7.78-6.22 9.28-.23.09-.4-.04-.4-.28v-1.74" />
                      <circle cx="12" cy="12" r="4" className="animate-pulse" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider mt-2">
                    Bio-Media
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">
                    {labState === 'filtering' ? 'Active Capture' : 'Stable'}
                  </span>
                </div>

                <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden sm:flex items-center space-x-2 text-slate-400">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">{lang === 'en' ? 'IN' : 'GİRİŞ'}</span>
                  <ArrowRight className={`w-4 h-4 ${labState === 'filtering' ? 'animate-bounce' : ''}`} />
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex items-center space-x-2 text-emerald-400">
                  <ArrowRight className={`w-4 h-4 ${labState === 'filtering' ? 'animate-bounce' : ''}`} />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">{lang === 'en' ? 'OUT' : 'ÇIKIŞ'}</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* --- MEET THE TEAM SECTION (YUSUF AYDIN DOGRU SPOTLIGHT + INCORPORATED FORMER MEMBERS) --- */}
      <section id="team" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-lastica-style text-white">{t.teamTitle}</h2>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">{t.teamSubtitle}</p>
          </div>

          {/* Highlighted Profile Card for Yusuf Aydın Doğru (Founder & Captain) */}
          <div className="bg-[#200d3a] border border-purple-500/30 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-[#12c2e8] to-[#c471ed]" />
            
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl p-[2px] bg-gradient-to-br from-[#12c2e8] via-purple-500 to-[#c471ed]">
                <div className="w-full h-full bg-[#18072b] rounded-[22px] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
                  <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#12c2e8]/10 to-[#c471ed]/25 border-2 border-[#12c2e8]/40 flex items-center justify-center text-5xl font-black text-[#12c2e8] shadow-inner animate-pulse">
                    YAD
                  </div>
                  <h4 className="text-sm font-extrabold text-white mt-4 tracking-wide">{activeLeader.name}</h4>
                  <span className="text-[10px] text-cyan-400 font-extrabold tracking-widest uppercase mt-1">{activeLeader.role}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#12c2e8]/10 to-transparent border-l-4 border-[#12c2e8] px-3 py-1.5">
                <span className="text-xs font-black text-[#12c2e8] uppercase tracking-widest">{activeLeader.status}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{activeLeader.name}</h3>
              <p className="text-slate-300 font-light leading-relaxed text-sm sm:text-base">
                {t.founderEmphasisText}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#12c2e8]" />
                  <span>UNICEF Global Leader</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#12c2e8]" />
                  <span>China Youth Forum Delegate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#12c2e8]" />
                  <span>R&D Calcination Architect</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#12c2e8]" />
                  <span>Circular Economy Advocate</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => {
                    setSelectedMember(activeLeader);
                    setActiveTab('bio');
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#12c2e8] to-[#c471ed] text-slate-950 text-xs font-black uppercase tracking-widest hover:opacity-90 transform transition-all duration-300 shadow-md flex items-center space-x-2"
                >
                  <span>{t.teamViewProfile}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Side-by-Side Cards representing Cemre Oruç & Öykü Şevin Anık within the main Team area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {otherPeers.map((member) => (
              <div 
                key={member.id}
                className="bg-[#200d3a] border border-purple-950/60 hover:border-purple-500/40 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] shadow-lg relative group overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#12c2e8]/30 to-transparent group-hover:via-[#12c2e8]/80 transition-all duration-500" />
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-purple-500/20 border border-purple-500/20 flex items-center justify-center text-xl font-lastica-style text-[#12c2e8]">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-white group-hover:text-[#12c2e8] transition-colors">{member.name}</h4>
                      <p className="text-xs font-extrabold text-[#c471ed] mt-1 uppercase tracking-wider bg-[#18072b]/50 px-2.5 py-1 rounded-full border border-purple-950/40 w-fit">{member.status}</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-8 border-t border-purple-950/40 mt-6">
                  <button 
                    onClick={() => {
                      setSelectedMember(member);
                      setActiveTab('bio');
                    }}
                    className="w-full py-3 rounded-xl border border-purple-500/20 hover:border-[#12c2e8] bg-[#18072b]/50 text-xs font-bold text-slate-300 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>{t.teamViewProfile}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* INTERACTIVE YUSUF CHATBOT DRAWER */}
          <div className="bg-[#200d3a] border border-[#12c2e8]/20 rounded-3xl p-6 sm:p-8 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="lg:col-span-4 space-y-4 flex flex-col justify-center">
              <div className="flex items-center space-x-2 bg-[#12c2e8]/10 border border-[#12c2e8]/30 px-3 py-1.5 rounded-full w-fit">
                <MessageSquare className="w-4 h-4 text-[#12c2e8]" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Interactive AI Avatar
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {t.aiAvatarChatHeader}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {t.aiAvatarSub}
              </p>
            </div>

            <div className="lg:col-span-8 flex flex-col h-[320px] bg-[#18072b] border border-purple-950/40 rounded-2xl overflow-hidden justify-between">
              
              <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs custom-scrollbar">
                {yusufMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed font-light ${
                        msg.sender === 'user' 
                          ? 'bg-[#c471ed]/10 border border-[#c471ed]/30 text-slate-200 rounded-br-none' 
                          : 'bg-[#200d3a] border border-purple-950/60 text-slate-300 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isYusufLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-[#200d3a] border border-purple-950/60 rounded-2xl rounded-bl-none p-3.5 text-slate-400 flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Yusuf is writing...</span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendYusufMessage} className="p-3 border-t border-purple-950/40 bg-[#200d3a]/40 flex items-center space-x-2">
                <input 
                  type="text"
                  value={yusufInput}
                  onChange={(e) => setYusufInput(e.target.value)}
                  placeholder={t.aiAvatarChatPlaceholder}
                  className="flex-1 bg-[#18072b] border border-purple-950 focus:border-[#12c2e8] rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-[#12c2e8]"
                  disabled={isYusufLoading}
                />
                <button 
                  type="submit"
                  disabled={isYusufLoading || !yusufInput.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#12c2e8] to-[#c471ed] text-slate-950 hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>

        </div>
      </section>

      {/* --- RESEARCHERS, MENTORS & SUPPORTERS SECTION --- */}
      <section id="supporters-section" className="py-24 bg-[#1b0a31] border-t border-purple-950/40 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#12c2e8]/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-[#c471ed]/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-purple-300 border border-[#c471ed]/20 mb-4">
              <Users className="w-3.5 h-3.5 text-[#c471ed]" />
              <span>Scientific Ecosystem & Guidance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-lastica-style text-white leading-tight">
              {t.mentorsTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              {t.mentorsSubtitle}
            </p>
          </div>

          {/* Research & Lab Team Sub-grid */}
          <div className="space-y-8">
            <h3 className="text-lg font-lastica-style text-transparent bg-clip-text bg-gradient-to-r from-[#12c2e8] to-[#c471ed] border-l-4 border-[#12c2e8] pl-3">
              {t.groupResearch}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supporters.research.map((supporter, index) => (
                <div 
                  key={index} 
                  className="bg-[#200d3a]/80 border border-purple-950/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#12c2e8]/40 hover:scale-[1.01]"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#12c2e8]/10 flex items-center justify-center text-[#12c2e8] font-bold text-sm">
                      {supporter.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">{supporter.name}</h4>
                      <p className="text-xs font-semibold text-cyan-400 mt-0.5">{supporter.role}</p>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{supporter.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mentors & International Supporters Sub-grid */}
          <div className="space-y-8 pt-6">
            <h3 className="text-lg font-lastica-style text-transparent bg-clip-text bg-gradient-to-r from-[#c471ed] to-[#12c2e8] border-l-4 border-[#c471ed] pl-3">
              {t.groupMentors}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supporters.mentors.map((supporter, index) => (
                <div 
                  key={index} 
                  className="bg-[#200d3a]/80 border border-purple-950/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#c471ed]/40 hover:scale-[1.01]"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#c471ed]/10 flex items-center justify-center text-[#c471ed] font-bold text-sm">
                      {supporter.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">{supporter.name}</h4>
                      <p className="text-xs font-semibold text-purple-400 mt-0.5">{supporter.role}</p>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{supporter.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* APPRECIATION STATEMENT PANEL */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-purple-950/30 to-[#200d3a] border border-purple-500/20 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <h4 className="text-md sm:text-lg font-lastica-style text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#c471ed] fill-[#c471ed]" />
                <span>{t.mentorsAppreciationHeader}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-5xl">
                {t.mentorsAppreciationText}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- SUSTAINABLE DEVELOPMENT GOALS (SDGs) SECTION (WITH OFFICIAL BRAND COLOR IDENTITIES) --- */}
      <section id="sdg-section" className="py-24 bg-[#18072b] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-4">
              <Globe className="w-3.5 h-3.5" />
              <span>United Nations 2030 Agenda</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-lastica-style text-white leading-tight">
              {t.sdgSectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              {t.sdgSectionSubtitle}
            </p>
          </div>

          {/* Primary SDGs: Clean Water and Sanitation & Life Below Water */}
          <div className="space-y-8">
            <h3 className="text-xs font-lastica-style text-[#12c2e8] tracking-widest uppercase text-center md:text-left">
              {t.sdgPrimaryHeader}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* SDG 6 Primary Block */}
              <div className="bg-[#200d3a] border border-purple-500/20 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all duration-300 hover:border-[#12c2e8]/40 hover:-translate-y-1 shadow-md">
                <Sdg6Logo />
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="text-md sm:text-lg font-bold text-white leading-snug">{sdgs.primary[0].title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{sdgs.primary[0].desc}</p>
                </div>
              </div>

              {/* SDG 14 Primary Block */}
              <div className="bg-[#200d3a] border border-purple-500/20 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all duration-300 hover:border-[#12c2e8]/40 hover:-translate-y-1 shadow-md">
                <Sdg14Logo />
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="text-md sm:text-lg font-bold text-white leading-snug">{sdgs.primary[1].title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{sdgs.primary[1].desc}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Secondary SDGs Showcase utilizing official visual identifiers */}
          <div className="space-y-6 pt-6">
            <h3 className="text-xs font-lastica-style text-[#c471ed] tracking-widest uppercase text-center md:text-left">
              {t.sdgSecondaryHeader}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-center items-center">
              
              {/* SDG 3 */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#200d3a]/60 border border-purple-950/60 rounded-2xl hover:border-purple-500/30 transition-all">
                <Sdg3Logo />
                <h4 className="text-[10px] font-bold text-slate-300 leading-snug uppercase tracking-wider text-center mt-3">{sdgs.secondary[0].title.split(' – ')[1]}</h4>
              </div>

              {/* SDG 9 */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#200d3a]/60 border border-purple-950/60 rounded-2xl hover:border-purple-500/30 transition-all">
                <Sdg9Logo />
                <h4 className="text-[10px] font-bold text-slate-300 leading-snug uppercase tracking-wider text-center mt-3">{sdgs.secondary[1].title.split(' – ')[1]}</h4>
              </div>

              {/* SDG 11 */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#200d3a]/60 border border-purple-950/60 rounded-2xl hover:border-purple-500/30 transition-all">
                <Sdg11Logo />
                <h4 className="text-[10px] font-bold text-slate-300 leading-snug uppercase tracking-wider text-center mt-3">{sdgs.secondary[2].title.split(' – ')[1]}</h4>
              </div>

              {/* SDG 12 */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#200d3a]/60 border border-purple-950/60 rounded-2xl hover:border-purple-500/30 transition-all">
                <Sdg12Logo />
                <h4 className="text-[10px] font-bold text-slate-300 leading-snug uppercase tracking-wider text-center mt-3">{sdgs.secondary[3].title.split(' – ')[1]}</h4>
              </div>

              {/* SDG 13 */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#200d3a]/60 border border-purple-950/60 rounded-2xl hover:border-purple-500/30 transition-all">
                <Sdg13Logo />
                <h4 className="text-[10px] font-bold text-slate-300 leading-snug uppercase tracking-wider text-center mt-3">{sdgs.secondary[4].title.split(' – ')[1]}</h4>
              </div>

              {/* SDG 17 */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#200d3a]/60 border border-purple-950/60 rounded-2xl hover:border-purple-500/30 transition-all">
                <Sdg17Logo />
                <h4 className="text-[10px] font-bold text-slate-300 leading-snug uppercase tracking-wider text-center mt-3">{sdgs.secondary[5].title.split(' – ')[1]}</h4>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- RECOGNITION & MEDIA COVERAGE SECTION --- */}
      <section id="media-section" className="py-24 bg-[#1b0a31] border-y border-purple-950/40 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#12c2e8]/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#12c2e8]/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300 border border-[#12c2e8]/20 mb-4">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Press Coverage & Verification</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-lastica-style text-white leading-tight">
              {t.mediaTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              {t.mediaSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaCoverage.map((item, index) => (
              <div 
                key={index}
                className="bg-[#200d3a] border border-purple-500/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#12c2e8]/45 hover:-translate-y-1 hover:shadow-xl relative group overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#12c2e8]/20 to-transparent group-hover:via-[#12c2e8]/80 transition-all duration-500" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#18072b] px-2.5 py-1 rounded-full border border-purple-950/60">
                      {item.publisher}
                    </span>
                    <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-md sm:text-lg font-bold text-white group-hover:text-[#12c2e8] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-purple-950/40 mt-6">
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 text-xs font-bold text-[#12c2e8] hover:text-[#c471ed] transition-colors"
                  >
                    <span>{t.mediaBtnVisit}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- TIMELINE / MILESTONES --- */}
      <section id="awards" className="py-24 bg-[#200d3a]/30 border-b border-purple-950/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-lastica-style text-white">{t.timelineTitle}</h2>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">{t.timelineSubtitle}</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-purple-950/50 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12">
              
              {/* Event 1 */}
              <div className="flex flex-col md:flex-row items-center md:justify-between relative">
                <div className="md:w-5/12 text-left md:text-right space-y-3">
                  <span className="inline-block px-3 py-1 rounded bg-[#12c2e8]/10 border border-[#12c2e8]/30 text-xs font-extrabold text-[#12c2e8] uppercase tracking-widest">{t.timeline1Year}</span>
                  <h4 className="text-lg font-extrabold text-white">{t.timeline1Title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.timeline1Desc}</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#18072b] border-2 border-[#12c2e8] hidden md:flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#12c2e8]" />
                </div>
                <div className="md:w-5/12" />
              </div>

              {/* Event 2 */}
              <div className="flex flex-col md:flex-row items-center md:justify-between relative">
                <div className="md:w-5/12" />
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#18072b] border-2 border-[#c471ed] hidden md:flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#c471ed]" />
                </div>
                <div className="md:w-5/12 text-left space-y-3">
                  <span className="inline-block px-3 py-1 rounded bg-purple-500/10 border border-[#c471ed]/30 text-xs font-extrabold text-purple-400 uppercase tracking-widest">{t.timeline2Year}</span>
                  <h4 className="text-lg font-extrabold text-white">{t.timeline2Title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.timeline2Desc}</p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex flex-col md:flex-row items-center md:justify-between relative">
                <div className="md:w-5/12 text-left md:text-right space-y-3">
                  <span className="inline-block px-3 py-1 rounded bg-[#12c2e8]/10 border border-[#12c2e8]/30 text-xs font-extrabold text-[#12c2e8] uppercase tracking-widest">{t.timeline3Year}</span>
                  <h4 className="text-lg font-extrabold text-white">{t.timeline3Title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.timeline3Desc}</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#18072b] border-2 border-[#12c2e8] hidden md:flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#12c2e8]" />
                </div>
                <div className="md:w-5/12" />
              </div>

              {/* Event 4 */}
              <div className="flex flex-col md:flex-row items-center md:justify-between relative">
                <div className="md:w-5/12" />
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#18072b] border-2 border-emerald-500 hidden md:flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="md:w-5/12 text-left space-y-3">
                  <span className="inline-block px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs font-extrabold text-emerald-400 uppercase tracking-widest">{t.timeline4Year}</span>
                  <h4 className="text-lg font-extrabold text-white">{t.timeline4Title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.timeline4Desc}</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* --- CONTINUOUSLY SCROLLING HIGH-QUALITY PARTNER SHOWCASE SECTION --- */}
      <section className="py-20 bg-[#1b0a31]/80 border-b border-purple-950/40 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10">
          <h3 className="text-center text-xs font-lastica-style text-[#12c2e8] tracking-widest uppercase">
            {t.partnersTitle}
          </h3>
        </div>

        {/* Infinite scrolling carousel utilizing original high-fidelity vector layouts */}
        <div className="relative w-full overflow-hidden flex select-none">
          <div className="animate-scroll flex items-center gap-16 whitespace-nowrap">
            
            {/* Iteration 1 */}
            <div className="flex items-center space-x-16 px-4">
              <HabitatLogo />
              <UnicefLogo />
              <AccentureLogo />
              <WydfLogo />
            </div>

            {/* Iteration 2 (Seamless loop replication) */}
            <div className="flex items-center space-x-16 px-4">
              <HabitatLogo />
              <UnicefLogo />
              <AccentureLogo />
              <WydfLogo />
            </div>

          </div>
        </div>
      </section>

      {/* --- CONTACT & INQUIRY FORM --- */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto bg-[#200d3a]/90 border border-purple-500/20 rounded-3xl p-8 sm:p-12 shadow-lg backdrop-blur-md relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-lastica-style text-white">{t.contactTitle}</h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">{t.contactSubtitle}</p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-extrabold text-white">{lang === 'en' ? 'Submission Successful' : 'Gönderim Başarılı'}</h4>
              <p className="text-xs text-slate-300">{t.contactSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{t.contactName}</label>
                  <input 
                    type="text" 
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-[#18072b] border border-purple-500/20 rounded-xl px-4 py-3.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#12c2e8]"
                    placeholder="e.g. Yusuf Aydın Doğru"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{t.contactEmail}</label>
                  <input 
                    type="email" 
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-[#18072b] border border-purple-500/20 rounded-xl px-4 py-3.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#12c2e8]"
                    placeholder="e.g. info@teaminspire.com"
                  />
                </div>

              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{t.contactSubject}</label>
                <input 
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full bg-[#18072b] border border-purple-500/20 rounded-xl px-4 py-3.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#12c2e8]"
                  placeholder="e.g. Partnership Opportunity / Research Inquiry"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{t.contactMessage}</label>
                <textarea 
                  required
                  rows="4"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-[#18072b] border border-purple-500/20 rounded-xl px-4 py-3.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#12c2e8]"
                  placeholder="How can we build a clean water future together?"
                />
              </div>

              <div>
                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#12c2e8] to-[#c471ed] text-slate-950 font-black tracking-widest uppercase hover:opacity-95 shadow-[0_4px_14px_rgba(18,194,232,0.3)] transition-all transform hover:-translate-y-0.5 text-xs"
                >
                  {t.contactSubmit}
                </button>
              </div>

            </form>
          )}

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#110420] border-t border-purple-950/60 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 max-w-md">
            
            <div className="flex items-center h-12">
              <img 
                src="inspire_logo.jpg" 
                alt="Team INSPIRE Logo" 
                className="h-full w-auto object-contain max-w-[200px]" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  const footerT = document.getElementById('footer-fallback');
                  if (footerT) footerT.classList.remove('hidden');
                }}
              />
              <span id="footer-fallback" className="hidden brand-text-elegant text-md text-white">
                <span className="font-light text-slate-400">Team </span>INSPIRE
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footerText}
            </p>

          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex items-center space-x-4">
              <a 
                href="https://linkedin.com/in/yusuf-aydin-dogru" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-slate-900 border border-purple-950 flex items-center justify-center text-slate-400 hover:text-[#12c2e8] hover:border-[#12c2e8] transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-slate-900 border border-purple-950 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-400 transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#contact" 
                className="w-10 h-10 rounded-full bg-slate-900 border border-purple-950 flex items-center justify-center text-slate-400 hover:text-[#12c2e8] hover:border-[#12c2e8] transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-[11px] text-slate-500 font-medium">
                &copy; {new Date().getFullYear()} Team INSPIRE. {lang === 'en' ? 'All Rights Reserved.' : 'Tüm Hakları Saklıdır.'}
              </p>
              <p className="text-[9px] text-slate-600 mt-1">
                Youth-led circular environmental solutions.
              </p>
            </div>

          </div>

        </div>
      </footer>

      {/* --- INTERACTIVE PROFILE MODAL WINDOW --- */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#18072b]/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          
          <div className="bg-[#200d3a] border border-purple-500/20 max-w-3xl w-full rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-between">
            
            {/* Header / Dismiss */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-purple-950/40 bg-[#18072b]/60">
              <span className="text-[11px] font-extrabold tracking-widest text-[#12c2e8] uppercase">{selectedMember.role}</span>
              <button 
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-purple-950 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Profile Bio Photo Column */}
              <div className="md:col-span-4 flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-[#12c2e8] to-[#c471ed] p-[1.5px] flex items-center justify-center">
                  <div className="w-full h-full bg-[#200d3a] rounded-[14px] flex items-center justify-center text-2xl font-lastica-style text-[#12c2e8]">
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-extrabold text-white">{selectedMember.name}</h4>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{selectedMember.role}</p>
                </div>

                {/* External Social Links inside modal */}
                {selectedMember.social && selectedMember.social !== '#' && (
                  <a 
                    href={selectedMember.social}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 text-xs font-bold text-[#12c2e8] hover:underline"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>

              {/* Informative Tabbed Content Area */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Tabs selection header */}
                <div className="flex border-b border-purple-950/40 overflow-x-auto whitespace-nowrap">
                  <button 
                    onClick={() => setActiveTab('bio')}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 ${activeTab === 'bio' ? 'border-[#12c2e8] text-[#12c2e8]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                  >
                    {t.modalBio}
                  </button>
                  <button 
                    onClick={() => setActiveTab('edu')}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 ${activeTab === 'edu' ? 'border-[#12c2e8] text-[#12c2e8]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                  >
                    {lang === 'en' ? 'Education' : 'Eğitim'}
                  </button>
                  <button 
                    onClick={() => setActiveTab('skills')}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 ${activeTab === 'skills' ? 'border-[#12c2e8] text-[#12c2e8]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                  >
                    {lang === 'en' ? 'Skills' : 'Yetenekler'}
                  </button>
                  <button 
                    onClick={() => setActiveTab('awards')}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 ${activeTab === 'awards' ? 'border-[#12c2e8] text-[#12c2e8]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                  >
                    {t.modalAwards}
                  </button>
                </div>

                {/* Tab content displays */}
                <div className="min-h-[160px]">
                  {activeTab === 'bio' && (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{selectedMember.bio}</p>
                      <div className="pt-2">
                        <h5 className="text-[10px] font-black uppercase text-[#c471ed] tracking-widest">{t.modalRole}</h5>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed font-light">{selectedMember.contributions}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'edu' && (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2 text-xs text-slate-300">
                        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-extrabold text-white">{t.modalEducation}</h5>
                          <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">{selectedMember.education}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'skills' && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.modalSkills}</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="text-[10px] font-extrabold tracking-wide uppercase px-3 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[#12c2e8]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'awards' && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.modalAwards}</h5>
                      {selectedMember.awards && selectedMember.awards.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedMember.awards.map((award, index) => (
                            <li key={index} className="flex items-start space-x-2 text-xs text-slate-300">
                              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <span className="font-light leading-relaxed">{award}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No direct awards loaded. See team victories.</p>
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Footer close option */}
            <div className="px-6 py-4 bg-[#18072b]/60 border-t border-purple-950/40 text-right">
              <button 
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/20 text-xs font-extrabold text-slate-300"
              >
                Close Profile
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}