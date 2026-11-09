import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AGENCY_INFO,
  PRICING_PACKAGES,
  PORTFOLIO_PROJECTS,
  TESTIMONIALS,
  PricingPackage,
  ProjectItem,
  TestimonialItem
} from '../data/agencyData';
import {
  safeLocalStorageSet,
  safeLocalStorageGet,
  getMediaBlob,
  saveMediaBlob,
  deleteMediaBlob
} from '../utils/mediaStorage';
import {
  parseShowcaseFromUrl,
  generatePersonalShowcaseUrl,
  ShowcaseExportData,
  CustomLinkConfig,
  defaultCustomLinkConfig,
  sanitizeSlug
} from '../utils/showcaseLink';

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  clicksWhatsApp: number;
  clicksEmail: number;
  clicksFeaturedProduct: number;
  clicksQuoteForm: number;
  countryVisits: { [country: string]: number };
}

export interface VideoPresentationData {
  title: string;
  subtitle: string;
  videoUrl: string;
  videoType: 'upload' | 'embed';
  posterUrl?: string;
  duration?: string;
  visible?: boolean;
}

export interface SiteTypography {
  // Corps du texte
  fontFamily: string;
  fontSize: number; // in pixels (e.g. 14, 16, 18, 20, 22)
  fontWeight: string; // e.g. "400", "600", "700", "800", "900"

  // Titres principaux (H1, H2, H3)
  titleFontFamily?: string;
  titleFontSize?: number; // e.g. 26 to 52
  titleFontWeight?: string;

  // Sous-titres
  subtitleFontFamily?: string;
  subtitleFontSize?: number; // e.g. 13 to 22
  subtitleFontWeight?: string;

  // Prix & Tarifs
  priceFontFamily?: string; // default Arial
  priceFontSize?: number; // e.g. 22 to 44
  priceFontWeight?: string; // default 900
}

export interface SiteColors {
  primary: string; // Header, primary CTA, badges (e.g. #073587)
  primaryDark: string; // Top bar, deep accents (e.g. #05235c)
  accent: string; // Highlights, stars, gold (e.g. #f59e0b)
  bgColor: string; // Background color (e.g. #ffffff)
  textColor: string; // Main text color (e.g. #0f172a)
}

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface HeaderConfig {
  showTopBar: boolean;
  showWhatsAppBtn: boolean;
  showOrderBtn: boolean;
  brandTitle: string;
  brandHighlight: string;
  brandSubtitle: string;
  navLinks: NavLinkItem[];
}

export interface FooterConfig {
  showBrandBlock: boolean;
  showServicesBlock: boolean;
  showQuickLinksBlock: boolean;
  showDomainMention: boolean;
  copyrightText: string;
}

export interface AgencyState {
  name: string;
  slogan: string;
  motto: string;
  email: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  logoUrl: string;
  responsablePhoto: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroKicker?: string;
  aboutTitle?: string;
  aboutText?: string;
  responsableName?: string;
  responsableRole?: string;
  responsableBio?: string;
  featuredProduct: {
    title: string;
    subtitle: string;
    badge: string;
    image: string;
    link: string;
    highlights: string[];
    visible?: boolean;
  };
}

interface AgencyContextType {
  // State
  agencyInfo: AgencyState;
  pricingPackages: PricingPackage[];
  portfolioProjects: ProjectItem[];
  testimonials: TestimonialItem[];
  videoPresentation: VideoPresentationData;
  analytics: AnalyticsData;
  siteTypography: SiteTypography;
  siteColors: SiteColors;
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  isOwnerLoggedIn: boolean;
  ownerEmail: string;
  isCustomShowcaseActive: boolean;
  customShowcaseOwnerName: string;
  customLinkConfig: CustomLinkConfig;

  // Actions
  loginOwner: (email: string, pass: string) => boolean;
  logoutOwner: () => void;
  updateOwnerCredentials: (newEmail: string, newPassword?: string) => { success: boolean; error?: string };
  updateAgencyInfo: (data: Partial<AgencyState>) => void;
  updatePricingPackage: (id: string, data: Partial<PricingPackage>) => void;
  addPricingPackage: (pkg: PricingPackage) => void;
  deletePricingPackage: (id: string) => void;
  addPortfolioProject: (project: ProjectItem) => void;
  updatePortfolioProject: (id: string, project: Partial<ProjectItem>) => void;
  deletePortfolioProject: (id: string) => void;
  updateVideoPresentation: (data: Partial<VideoPresentationData>) => void;
  deleteVideoPresentation: () => Promise<void>;
  resetVideoPresentation: () => Promise<void>;
  updateTypography: (data: Partial<SiteTypography>) => void;
  updateColors: (data: Partial<SiteColors>) => void;
  updateHeaderConfig: (data: Partial<HeaderConfig>) => void;
  toggleNavLinkVisibility: (id: string) => void;
  deleteNavLink: (id: string) => void;
  addNavLink: (link: NavLinkItem) => void;
  updateFooterConfig: (data: Partial<FooterConfig>) => void;
  trackClick: (type: 'whatsapp' | 'email' | 'product' | 'quote') => void;
  simulateVisit: () => void;
  resetAnalytics: () => void;
  resetToDefaults: () => void;
  updateCustomLinkConfig: (data: Partial<CustomLinkConfig>) => void;
  generatePersonalShareLink: (overrideConfig?: Partial<CustomLinkConfig>) => Promise<string>;
  clearCustomShowcase: () => void;
}

const STORAGE_KEY_PREFIX = 'africa_web_cms_';

const defaultAnalytics: AnalyticsData = {
  totalVisits: 1420,
  uniqueVisitors: 890,
  clicksWhatsApp: 384,
  clicksEmail: 92,
  clicksFeaturedProduct: 512,
  clicksQuoteForm: 178,
  countryVisits: {
    'Bénin 🇧🇯': 640,
    'Côte d\'Ivoire 🇨🇮': 310,
    'Sénégal 🇸🇳': 185,
    'Togo 🇹🇬': 110,
    'Cameroun 🇨🇲': 95,
    'France 🇫🇷': 80
  }
};

export const defaultVideoPresentation: VideoPresentationData = {
  title: "Présentation Officielle d'Africa Web Agence Numérique",
  subtitle: "Découvrez notre expertise : sites vitrines professionnels, e-commerce, catalogues et formations d'élite.",
  videoUrl: "/assets/aistudio/AfricaWeb_22ef340a.mp4",
  videoType: "upload",
  duration: "00:50 min",
  visible: true
};

const defaultTypography: SiteTypography = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 18,
  fontWeight: "700",

  titleFontFamily: "Arial, Helvetica, sans-serif",
  titleFontSize: 36,
  titleFontWeight: "900",

  subtitleFontFamily: "Arial, Helvetica, sans-serif",
  subtitleFontSize: 16,
  subtitleFontWeight: "600",

  priceFontFamily: "Arial, Helvetica, sans-serif",
  priceFontSize: 32,
  priceFontWeight: "900"
};

const defaultColors: SiteColors = {
  primary: "#073587",
  primaryDark: "#05235c",
  accent: "#f59e0b",
  bgColor: "#ffffff",
  textColor: "#0f172a"
};

const defaultHeaderConfig: HeaderConfig = {
  showTopBar: false,
  showWhatsAppBtn: true,
  showOrderBtn: true,
  brandTitle: "Africa",
  brandHighlight: "Web",
  brandSubtitle: "Agence Numérique",
  navLinks: [
    { id: "hero", label: "Accueil", href: "#hero", visible: true },
    { id: "tarifs", label: "Formations & Tarifs", href: "#tarifs", visible: true },
    { id: "video", label: "Vidéo", href: "#presentation-video", visible: true },
    { id: "produit", label: "Produit Vedette", href: "#produit-vedette", visible: true },
    { id: "apropos", label: "À Propos", href: "#apropos", visible: true },
    { id: "temoignages", label: "Témoignages", href: "#temoignages", visible: true },
    { id: "contact", label: "Contact", href: "#contact", visible: true }
  ]
};

const defaultFooterConfig: FooterConfig = {
  showBrandBlock: true,
  showServicesBlock: true,
  showQuickLinksBlock: true,
  showDomainMention: true,
  copyrightText: "© 2026 Africa Web. Tous droits réservés. Agence Numérique Panafricaine."
};

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Agency Info
  const [agencyInfo, setAgencyInfo] = useState<AgencyState>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}info_v2`) || localStorage.getItem(`${STORAGE_KEY_PREFIX}info`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || AGENCY_INFO.name,
          slogan: parsed.slogan || AGENCY_INFO.slogan,
          motto: parsed.motto || AGENCY_INFO.motto,
          email: parsed.email || AGENCY_INFO.email,
          whatsappNumber: parsed.whatsappNumber || AGENCY_INFO.whatsappNumber,
          whatsappDisplay: parsed.whatsappDisplay || AGENCY_INFO.whatsappDisplay,
          logoUrl: parsed.logoUrl || AGENCY_INFO.logoUrl,
          responsablePhoto: parsed.responsablePhoto || AGENCY_INFO.responsablePhoto,
          heroHeadline: parsed.heroHeadline || "Maîtrisez la création de vidéos IA, produits digitaux, affiches et sites web pro.",
          heroSubtitle: parsed.heroSubtitle || "Africa Web vous forme aux compétences les plus rentables du marché : Vidéos publicitaires avec Google Flow & Arena IA, Produits digitaux, Images publicitaires et Création de sites web pro sans code.",
          heroKicker: parsed.heroKicker || "Académie & Agence Numérique · Formations Pratiques & Création Web",
          aboutTitle: parsed.aboutTitle || "Un partenaire humain et dévoué à votre réussite en ligne.",
          aboutText: parsed.aboutText || "Chez Africa Web, nous croyons qu'une entreprise africaine ne doit plus dépendre d'outils complexes ou inadaptés à notre réalité locale. Que vous ayez besoin de maîtriser la vidéo publicitaire par IA, de créer des produits digitaux ou de concevoir des sites web pro avec ou sans hébergement, nous mettons notre savoir-faire au service de votre croissance.",
          responsableName: parsed.responsableName || "Samuel G.",
          responsableRole: parsed.responsableRole || "Direction & Service Clientèle",
          responsableBio: parsed.responsableBio || "Votre interlocuteur dédié pour le cadrage et le suivi de vos formations et projets numériques.",
          featuredProduct: {
            ...AGENCY_INFO.featuredProduct,
            ...(parsed.featuredProduct || {}),
            visible: parsed.featuredProduct?.visible !== false
          }
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: AGENCY_INFO.name,
      slogan: AGENCY_INFO.slogan,
      motto: AGENCY_INFO.motto,
      email: AGENCY_INFO.email,
      whatsappNumber: AGENCY_INFO.whatsappNumber,
      whatsappDisplay: AGENCY_INFO.whatsappDisplay,
      logoUrl: AGENCY_INFO.logoUrl,
      responsablePhoto: AGENCY_INFO.responsablePhoto,
      heroHeadline: "Maîtrisez la création de vidéos IA, produits digitaux, affiches et sites web pro.",
      heroSubtitle: "Africa Web vous forme aux compétences les plus rentables du marché : Vidéos publicitaires avec Google Flow & Arena IA, Produits digitaux, Images publicitaires et Création de sites web pro sans code.",
      heroKicker: "Académie & Agence Numérique · Formations Pratiques & Création Web",
      aboutTitle: "Un partenaire humain et dévoué à votre réussite en ligne.",
      aboutText: "Chez Africa Web, nous croyons qu'une entreprise africaine ne doit plus dépendre d'outils complexes ou inadaptés à notre réalité locale. Que vous ayez besoin de maîtriser la vidéo publicitaire par IA, de créer des produits digitaux ou de concevoir des sites web pro avec ou sans hébergement, nous mettons notre savoir-faire au service de votre croissance.",
      responsableName: "Samuel G.",
      responsableRole: "Direction & Service Clientèle",
      responsableBio: "Votre interlocuteur dédié pour le cadrage et le suivi de vos formations et projets numériques.",
      featuredProduct: {
        ...AGENCY_INFO.featuredProduct,
        visible: true
      }
    };
  });

  // 2. Pricing Packages (5 Formations Officielles)
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}pricing_v4`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return PRICING_PACKAGES;
  });

  // 3. Portfolio Projects
  const [portfolioProjects, setPortfolioProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}portfolio`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((p: any) => p.id === 'afribaba-trade')) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return PORTFOLIO_PROJECTS;
  });

  // 4. Testimonials
  const [testimonials] = useState<TestimonialItem[]>(TESTIMONIALS);

  // 5. Video Presentation
  const [videoPresentation, setVideoPresentation] = useState<VideoPresentationData>(() => {
    // 1. Check if URL has query parameter ?v=... or ?video=... (Shareable link across all devices)
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryVideo = params.get('v') || params.get('video');
        if (queryVideo && queryVideo.trim()) {
          const cleanUrl = decodeURIComponent(queryVideo.trim());
          const newVideoState: VideoPresentationData = {
            ...defaultVideoPresentation,
            videoUrl: cleanUrl,
            visible: true
          };
          safeLocalStorageSet(`${STORAGE_KEY_PREFIX}video`, JSON.stringify(newVideoState));
          return newVideoState;
        }
      } catch (e) {
        console.warn('Could not parse query video param:', e);
      }
    }

    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}video`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          !parsed.videoUrl ||
          parsed.videoUrl.includes('BigBuckBunny.mp4') ||
          parsed.videoUrl.includes('commondatastorage.googleapis.com') ||
          parsed.videoUrl === '/videos/africaweb-presentation.mp4'
        ) {
          return {
            ...defaultVideoPresentation,
            ...parsed,
            videoUrl: '/assets/aistudio/AfricaWeb_22ef340a.mp4',
            duration: '00:50 min'
          };
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return defaultVideoPresentation;
  });

  // 6. Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}analytics`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultAnalytics;
  });

  // 7. Typography (Textes généraux, Titres, Sous-titres, Prix)
  const [siteTypography, setSiteTypography] = useState<SiteTypography>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}typography_v2`) || localStorage.getItem(`${STORAGE_KEY_PREFIX}typography`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          fontFamily: parsed.fontFamily || "Arial, Helvetica, sans-serif",
          fontSize: typeof parsed.fontSize === 'number' ? parsed.fontSize : 18,
          fontWeight: parsed.fontWeight || "700",

          titleFontFamily: parsed.titleFontFamily || parsed.fontFamily || "Arial, Helvetica, sans-serif",
          titleFontSize: typeof parsed.titleFontSize === 'number' ? parsed.titleFontSize : 36,
          titleFontWeight: parsed.titleFontWeight || "900",

          subtitleFontFamily: parsed.subtitleFontFamily || parsed.fontFamily || "Arial, Helvetica, sans-serif",
          subtitleFontSize: typeof parsed.subtitleFontSize === 'number' ? parsed.subtitleFontSize : 16,
          subtitleFontWeight: parsed.subtitleFontWeight || "600",

          priceFontFamily: parsed.priceFontFamily || "Arial, Helvetica, sans-serif",
          priceFontSize: typeof parsed.priceFontSize === 'number' ? parsed.priceFontSize : 32,
          priceFontWeight: parsed.priceFontWeight || "900"
        };
      } catch (e) {
        console.error(e);
      }
    }
    return defaultTypography;
  });

  // 8. Colors (Primary, Dark, Accent, Background, Text)
  const [siteColors, setSiteColors] = useState<SiteColors>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}colors`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultColors;
  });

  // 9. Header Config (Nav links, display toggles)
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}header`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultHeaderConfig;
  });

  // 10. Footer Config (Blocks, copyright)
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}footer`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultFooterConfig;
  });

  // 11. Owner Authentication & Credentials (Secure)
  const [ownerCredentials, setOwnerCredentials] = useState<{ email: string; password: string }>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}owner_credentials`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.email === 'string' && typeof parsed.password === 'string') {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return {
      email: 'kgmservices229@gmail.com',
      password: 'Samuell@8'
    };
  });

  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    return (
      localStorage.getItem(`${STORAGE_KEY_PREFIX}owner_auth`) === 'true' ||
      sessionStorage.getItem(`${STORAGE_KEY_PREFIX}owner_auth`) === 'true'
    );
  });

  const [isCustomShowcaseActive, setIsCustomShowcaseActive] = useState<boolean>(false);
  const [customShowcaseOwnerName, setCustomShowcaseOwnerName] = useState<string>('');

  const [customLinkConfig, setCustomLinkConfig] = useState<CustomLinkConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}custom_link_config`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultCustomLinkConfig,
          ...parsed,
          slug: sanitizeSlug(parsed.slug || defaultCustomLinkConfig.slug)
        };
      } catch (e) {
        console.error(e);
      }
    }
    return defaultCustomLinkConfig;
  });

  const updateCustomLinkConfig = (data: Partial<CustomLinkConfig>) => {
    setCustomLinkConfig(prev => {
      const updated: CustomLinkConfig = {
        ...prev,
        ...data,
        slug: data.slug !== undefined ? sanitizeSlug(data.slug) : prev.slug
      };
      safeLocalStorageSet(`${STORAGE_KEY_PREFIX}custom_link_config`, JSON.stringify(updated));
      return updated;
    });
  };

  // Auto-detect and apply personal showcase from URL (?vitrine=...)
  useEffect(() => {
    let isMounted = true;
    async function loadCustomShowcase() {
      try {
        const showcaseData = await parseShowcaseFromUrl();
        if (showcaseData && isMounted) {
          setIsCustomShowcaseActive(true);
          if (showcaseData.agencyInfo) {
            setCustomShowcaseOwnerName(showcaseData.agencyInfo.name || 'Propriétaire');
            setAgencyInfo(prev => ({
              ...prev,
              ...showcaseData.agencyInfo,
              featuredProduct: {
                ...prev.featuredProduct,
                ...(showcaseData.agencyInfo?.featuredProduct || {})
              }
            }));
          }
          if (showcaseData.video) {
            setVideoPresentation(prev => ({
              ...prev,
              ...showcaseData.video
            }));
          }
          if (showcaseData.pricing && Array.isArray(showcaseData.pricing) && showcaseData.pricing.length > 0) {
            setPricingPackages(showcaseData.pricing);
          }
          if (showcaseData.colors) {
            setSiteColors(prev => ({ ...prev, ...showcaseData.colors }));
          }
          if (showcaseData.typography) {
            setSiteTypography(prev => ({ ...prev, ...showcaseData.typography }));
          }
          if (showcaseData.header) {
            setHeaderConfig(prev => ({ ...prev, ...showcaseData.header }));
          }
          if (showcaseData.footer) {
            setFooterConfig(prev => ({ ...prev, ...showcaseData.footer }));
          }
        }
      } catch (err) {
        console.warn('Failed to parse showcase from URL:', err);
      }
    }
    loadCustomShowcase();
    return () => {
      isMounted = false;
    };
  }, []);

  // Track session visit once per mount
  useEffect(() => {
    const hasVisitedSession = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}visited_session`);
    if (!hasVisitedSession) {
      sessionStorage.setItem(`${STORAGE_KEY_PREFIX}visited_session`, 'true');
      setAnalytics(prev => {
        const updated = {
          ...prev,
          totalVisits: prev.totalVisits + 1,
          uniqueVisitors: prev.uniqueVisitors + 1,
          countryVisits: {
            ...prev.countryVisits,
            'Bénin 🇧🇯': (prev.countryVisits['Bénin 🇧🇯'] || 0) + 1
          }
        };
        localStorage.setItem(`${STORAGE_KEY_PREFIX}analytics`, JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  // Synchronize CSS variables with DOM Root for real-time dynamic restyling
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontFamily = siteTypography.fontFamily;
    root.style.fontSize = `${siteTypography.fontSize}px`;
    root.style.fontWeight = siteTypography.fontWeight;

    document.body.style.fontFamily = siteTypography.fontFamily;
    document.body.style.fontSize = `${siteTypography.fontSize}px`;
    document.body.style.fontWeight = siteTypography.fontWeight;
    document.body.style.backgroundColor = siteColors.bgColor;
    document.body.style.color = siteColors.textColor;

    // Brand Colors
    root.style.setProperty('--color-brand-primary', siteColors.primary);
    root.style.setProperty('--color-brand-dark', siteColors.primaryDark);
    root.style.setProperty('--color-brand-accent', siteColors.accent);
    root.style.setProperty('--color-brand-bg', siteColors.bgColor);
    root.style.setProperty('--color-brand-text', siteColors.textColor);

    // Advanced Typography Variables
    root.style.setProperty('--font-body', siteTypography.fontFamily);
    root.style.setProperty('--font-size-body', `${siteTypography.fontSize}px`);
    root.style.setProperty('--font-weight-body', siteTypography.fontWeight);

    root.style.setProperty('--font-title', siteTypography.titleFontFamily || siteTypography.fontFamily);
    root.style.setProperty('--font-size-title', `${siteTypography.titleFontSize || 36}px`);
    root.style.setProperty('--font-weight-title', siteTypography.titleFontWeight || '900');

    root.style.setProperty('--font-subtitle', siteTypography.subtitleFontFamily || siteTypography.fontFamily);
    root.style.setProperty('--font-size-subtitle', `${siteTypography.subtitleFontSize || 16}px`);
    root.style.setProperty('--font-weight-subtitle', siteTypography.subtitleFontWeight || '600');

    root.style.setProperty('--font-price', siteTypography.priceFontFamily || 'Arial, Helvetica, sans-serif');
    root.style.setProperty('--font-size-price', `${siteTypography.priceFontSize || 32}px`);
    root.style.setProperty('--font-weight-price', siteTypography.priceFontWeight || '900');
  }, [siteTypography, siteColors]);

  // Restore video from IndexedDB if previously uploaded
  useEffect(() => {
    let activeBlobUrl: string | null = null;
    async function restoreIndexedDBMedia() {
      try {
        const videoBlob = await getMediaBlob('presentation_video');
        if (videoBlob) {
          activeBlobUrl = URL.createObjectURL(videoBlob);
          setVideoPresentation(prev => ({
            ...prev,
            videoUrl: activeBlobUrl || prev.videoUrl
          }));
        } else {
          setVideoPresentation(prev => {
            if (
              !prev.videoUrl ||
              prev.videoUrl.startsWith('indexeddb:') ||
              prev.videoUrl.includes('BigBuckBunny.mp4') ||
              prev.videoUrl.includes('commondatastorage.googleapis.com')
            ) {
              return { ...prev, videoUrl: defaultVideoPresentation.videoUrl };
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn('Could not restore video from IndexedDB', err);
      }
    }
    restoreIndexedDBMedia();

    return () => {
      if (activeBlobUrl) {
        URL.revokeObjectURL(activeBlobUrl);
      }
    };
  }, []);

  // Persist to safe storage (with quota protection to ensure site never freezes or crashes)
  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}info_v2`, JSON.stringify(agencyInfo));
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}info`, JSON.stringify(agencyInfo));
  }, [agencyInfo]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}pricing_v4`, JSON.stringify(pricingPackages));
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}pricing_v3`, JSON.stringify(pricingPackages));
  }, [pricingPackages]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}portfolio`, JSON.stringify(portfolioProjects));
  }, [portfolioProjects]);

  useEffect(() => {
    // If videoUrl is a blob URL from an uploaded file, store lightweight reference in localStorage
    const toSave = {
      ...videoPresentation,
      videoUrl: videoPresentation.videoUrl.startsWith('blob:')
        ? 'indexeddb:presentation_video'
        : videoPresentation.videoUrl
    };
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}video`, JSON.stringify(toSave));
  }, [videoPresentation]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}analytics`, JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}typography_v2`, JSON.stringify(siteTypography));
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}typography`, JSON.stringify(siteTypography));
  }, [siteTypography]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}colors`, JSON.stringify(siteColors));
  }, [siteColors]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}header`, JSON.stringify(headerConfig));
  }, [headerConfig]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}footer`, JSON.stringify(footerConfig));
  }, [footerConfig]);

  // Auth handler (Confidential credentials verification)
  const loginOwner = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (cleanEmail === ownerCredentials.email.trim().toLowerCase() && cleanPass === ownerCredentials.password) {
      setIsOwnerLoggedIn(true);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}owner_auth`, 'true');
      sessionStorage.setItem(`${STORAGE_KEY_PREFIX}owner_auth`, 'true');
      return true;
    }
    return false;
  };

  const updateOwnerCredentials = (newEmail: string, newPassword?: string): { success: boolean; error?: string } => {
    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanPass = newPassword && newPassword.trim() ? newPassword.trim() : ownerCredentials.password;
    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
      return { success: false, error: "Veuillez entrer une adresse email valide pour le compte propriétaire." };
    }
    if (newPassword && cleanPass.length < 6) {
      return { success: false, error: "Le mot de passe doit comporter au moins 6 caractères pour assurer votre sécurité." };
    }
    const updated = { email: cleanEmail, password: cleanPass };
    setOwnerCredentials(updated);
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}owner_credentials`, JSON.stringify(updated));
    return { success: true };
  };

  const logoutOwner = () => {
    setIsOwnerLoggedIn(false);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}owner_auth`);
    sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}owner_auth`);
  };

  const updateAgencyInfo = (data: Partial<AgencyState>) => {
    setAgencyInfo(prev => ({ ...prev, ...data }));
  };

  const updatePricingPackage = (id: string, data: Partial<PricingPackage>) => {
    setPricingPackages(prev =>
      prev.map(p => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const addPricingPackage = (pkg: PricingPackage) => {
    setPricingPackages(prev => [...prev, pkg]);
  };

  const deletePricingPackage = (id: string) => {
    setPricingPackages(prev => prev.filter(p => p.id !== id));
  };

  const addPortfolioProject = (project: ProjectItem) => {
    setPortfolioProjects(prev => [project, ...prev]);
  };

  const updatePortfolioProject = (id: string, project: Partial<ProjectItem>) => {
    setPortfolioProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...project } : p))
    );
  };

  const deletePortfolioProject = (id: string) => {
    setPortfolioProjects(prev => prev.filter(p => p.id !== id));
  };

  const updateVideoPresentation = (data: Partial<VideoPresentationData>) => {
    setVideoPresentation(prev => ({ ...prev, ...data }));
  };

  const deleteVideoPresentation = async () => {
    try {
      await deleteMediaBlob('presentation_video');
    } catch (e) {
      console.warn('Error deleting video blob:', e);
    }
    setVideoPresentation(prev => ({
      ...prev,
      videoUrl: '',
      visible: false
    }));
  };

  const resetVideoPresentation = async () => {
    try {
      await deleteMediaBlob('presentation_video');
    } catch (e) {
      console.warn('Error deleting video blob:', e);
    }
    setVideoPresentation(defaultVideoPresentation);
  };

  const updateTypography = (data: Partial<SiteTypography>) => {
    setSiteTypography(prev => ({ ...prev, ...data }));
  };

  const updateColors = (data: Partial<SiteColors>) => {
    setSiteColors(prev => ({ ...prev, ...data }));
  };

  const updateHeaderConfig = (data: Partial<HeaderConfig>) => {
    setHeaderConfig(prev => ({ ...prev, ...data }));
  };

  const toggleNavLinkVisibility = (id: string) => {
    setHeaderConfig(prev => ({
      ...prev,
      navLinks: prev.navLinks.map(link =>
        link.id === id ? { ...link, visible: !link.visible } : link
      )
    }));
  };

  const deleteNavLink = (id: string) => {
    setHeaderConfig(prev => ({
      ...prev,
      navLinks: prev.navLinks.filter(link => link.id !== id)
    }));
  };

  const addNavLink = (link: NavLinkItem) => {
    setHeaderConfig(prev => ({
      ...prev,
      navLinks: [...prev.navLinks, link]
    }));
  };

  const updateFooterConfig = (data: Partial<FooterConfig>) => {
    setFooterConfig(prev => ({ ...prev, ...data }));
  };

  const trackClick = (type: 'whatsapp' | 'email' | 'product' | 'quote') => {
    setAnalytics(prev => {
      const updated = { ...prev };
      if (type === 'whatsapp') updated.clicksWhatsApp += 1;
      if (type === 'email') updated.clicksEmail += 1;
      if (type === 'product') updated.clicksFeaturedProduct += 1;
      if (type === 'quote') updated.clicksQuoteForm += 1;
      safeLocalStorageSet(`${STORAGE_KEY_PREFIX}analytics`, JSON.stringify(updated));
      return updated;
    });
  };

  const simulateVisit = () => {
    setAnalytics(prev => {
      const updated = {
        ...prev,
        totalVisits: prev.totalVisits + 1,
        uniqueVisitors: prev.uniqueVisitors + 1,
        countryVisits: {
          ...prev.countryVisits,
          'Bénin 🇧🇯': (prev.countryVisits['Bénin 🇧🇯'] || 0) + 1
        }
      };
      safeLocalStorageSet(`${STORAGE_KEY_PREFIX}analytics`, JSON.stringify(updated));
      return updated;
    });
  };

  const resetAnalytics = () => {
    const fresh: AnalyticsData = {
      totalVisits: 100,
      uniqueVisitors: 65,
      clicksWhatsApp: 28,
      clicksEmail: 12,
      clicksFeaturedProduct: 18,
      clicksQuoteForm: 9,
      countryVisits: {
        'Bénin 🇧🇯': 50,
        'Côte d\'Ivoire 🇨🇮': 25,
        'Sénégal 🇸🇳': 15,
        'Togo 🇹🇬': 10
      }
    };
    setAnalytics(fresh);
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}analytics`, JSON.stringify(fresh));
  };

  const resetToDefaults = async () => {
    try {
      await deleteMediaBlob('presentation_video');
    } catch {}
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}info`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}pricing`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}portfolio`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}video`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}analytics`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}typography`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}colors`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}header`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}footer`);
    window.location.reload();
  };

  const generatePersonalShareLink = async (overrideConfig?: Partial<CustomLinkConfig>): Promise<string> => {
    const activeConfig: CustomLinkConfig = {
      ...customLinkConfig,
      ...(overrideConfig || {})
    };
    return await generatePersonalShowcaseUrl({
      agencyInfo,
      videoPresentation,
      pricingPackages,
      siteColors,
      siteTypography,
      headerConfig,
      footerConfig
    }, activeConfig);
  };

  const clearCustomShowcase = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('vitrine');
      url.searchParams.delete('data');
      url.searchParams.delete('v');
      url.searchParams.delete('slug');
      url.searchParams.delete('showcase');
      window.history.replaceState({}, '', url.pathname);
      setIsCustomShowcaseActive(false);
      window.location.reload();
    }
  };

  return (
    <AgencyContext.Provider
      value={{
        agencyInfo,
        pricingPackages,
        portfolioProjects,
        testimonials,
        videoPresentation,
        analytics,
        siteTypography,
        siteColors,
        headerConfig,
        footerConfig,
        isOwnerLoggedIn,
        ownerEmail: ownerCredentials.email,
        isCustomShowcaseActive,
        customShowcaseOwnerName,
        customLinkConfig,
        updateCustomLinkConfig,
        loginOwner,
        logoutOwner,
        updateOwnerCredentials,
        updateAgencyInfo,
        updatePricingPackage,
        addPricingPackage,
        deletePricingPackage,
        addPortfolioProject,
        updatePortfolioProject,
        deletePortfolioProject,
        updateVideoPresentation,
        deleteVideoPresentation,
        resetVideoPresentation,
        updateTypography,
        updateColors,
        updateHeaderConfig,
        toggleNavLinkVisibility,
        deleteNavLink,
        addNavLink,
        updateFooterConfig,
        trackClick,
        simulateVisit,
        resetAnalytics,
        resetToDefaults,
        generatePersonalShareLink,
        clearCustomShowcase
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
};
