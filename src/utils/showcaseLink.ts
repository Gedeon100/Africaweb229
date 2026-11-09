/**
 * Showcase Link Generator & Parser
 * Allows the owner of Africa Web to generate a complete, self-contained personal link
 * representing all their modifications (texts, video, prices, formations, WhatsApp contact, colors, etc.)
 * Anyone opening this link (on smartphone, WhatsApp, Facebook, computer) will instantly see the customized showcase.
 */

import {
  AgencyState,
  VideoPresentationData,
  SiteColors,
  SiteTypography,
  HeaderConfig,
  FooterConfig
} from '../context/AgencyContext';
import { PricingPackage } from '../data/agencyData';

export interface CustomLinkConfig {
  slug: string; // e.g. "samuel", "mon-agence-web"
  displayName: string; // e.g. "Samuel G." or "Africa Web Cotonou"
  customMessage: string; // WhatsApp custom invite message
  linkFormat: 'portable' | 'short'; // portable (?v=slug&vitrine=...) or short (?v=slug)
}

export interface ShowcaseExportData {
  v: number; // schema version
  t?: number; // timestamp
  slug?: string;
  ownerName?: string;
  agencyInfo?: Partial<AgencyState>;
  video?: Partial<VideoPresentationData>;
  pricing?: PricingPackage[];
  colors?: Partial<SiteColors>;
  typography?: Partial<SiteTypography>;
  header?: Partial<HeaderConfig>;
  footer?: Partial<FooterConfig>;
}

export const defaultCustomLinkConfig: CustomLinkConfig = {
  slug: 'samuel-pro',
  displayName: 'Samuel G. - Africa Web',
  customMessage: "Bonjour ! Je suis Samuel d'Africa Web. Je vous invite à découvrir ma vitrine officielle en ligne : nos formations certifiées en vidéos IA et création web, nos tarifs et nos réalisations. Cliquez ici pour voir ma vitrine :",
  linkFormat: 'portable'
};

/**
 * Sanitize a user-provided slug into a clean URL-friendly identifier
 */
export function sanitizeSlug(input: string | undefined | null): string {
  if (!input) return 'samuel-pro';
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents (é -> e, etc.)
    .replace(/[^a-z0-9_-]/g, '-')    // replace non-alphanumeric with -
    .replace(/-+/g, '-')             // collapse duplicate -
    .replace(/^-|-$/g, '')           // trim leading/trailing -
    .slice(0, 40) || 'samuel-pro';   // max 40 chars
}

// Convert UTF-8 string to Base64 safely in browser
function utf8ToBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binString = '';
    for (let i = 0; i < bytes.length; i++) {
      binString += String.fromCharCode(bytes[i]);
    }
    return btoa(binString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch {
    return encodeURIComponent(str);
  }
}

// Convert Base64 safely to UTF-8 string
function base64ToUtf8(str: string): string {
  try {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) {
      b64 += '=';
    }
    const binString = atob(b64);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return decodeURIComponent(str);
  }
}

// GZIP compression with fallback
async function compressData(jsonString: string): Promise<string> {
  if (typeof CompressionStream !== 'undefined') {
    try {
      const stream = new Blob([jsonString]).stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      const response = await new Response(compressedStream).blob();
      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binString = '';
      for (let i = 0; i < bytes.length; i++) {
        binString += String.fromCharCode(bytes[i]);
      }
      return 'gz.' + btoa(binString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
      console.warn('CompressionStream failed, using UTF-8 base64 fallback:', e);
    }
  }
  return 'b64.' + utf8ToBase64(jsonString);
}

// Decompress with fallback
async function decompressData(encoded: string): Promise<string> {
  if (encoded.startsWith('gz.')) {
    const rawB64 = encoded.slice(3);
    let b64 = rawB64.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) {
      b64 += '=';
    }
    const binString = atob(b64);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }

    if (typeof DecompressionStream !== 'undefined') {
      try {
        const stream = new Blob([bytes]).stream();
        const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
        const response = await new Response(decompressedStream).blob();
        return await response.text();
      } catch (err) {
        console.warn('DecompressionStream error:', err);
      }
    }
  }

  if (encoded.startsWith('b64.')) {
    return base64ToUtf8(encoded.slice(4));
  }

  // Raw base64 or URI encoded fallback
  try {
    return base64ToUtf8(encoded);
  } catch {
    return decodeURIComponent(encoded);
  }
}

/**
 * Build the payload from active context
 */
export function buildShowcasePayload(data: {
  agencyInfo: AgencyState;
  videoPresentation: VideoPresentationData;
  pricingPackages: PricingPackage[];
  siteColors: SiteColors;
  siteTypography: SiteTypography;
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
}): ShowcaseExportData {
  return {
    v: 1,
    t: Date.now(),
    agencyInfo: {
      name: data.agencyInfo.name,
      slogan: data.agencyInfo.slogan,
      motto: data.agencyInfo.motto,
      email: data.agencyInfo.email,
      whatsappNumber: data.agencyInfo.whatsappNumber,
      whatsappDisplay: data.agencyInfo.whatsappDisplay,
      heroHeadline: data.agencyInfo.heroHeadline,
      heroSubtitle: data.agencyInfo.heroSubtitle,
      heroKicker: data.agencyInfo.heroKicker,
      aboutTitle: data.agencyInfo.aboutTitle,
      aboutText: data.agencyInfo.aboutText,
      responsableName: data.agencyInfo.responsableName,
      responsableRole: data.agencyInfo.responsableRole,
      responsableBio: data.agencyInfo.responsableBio,
      logoUrl: data.agencyInfo.logoUrl.startsWith('blob:') ? undefined : data.agencyInfo.logoUrl,
      responsablePhoto: data.agencyInfo.responsablePhoto.startsWith('blob:') ? undefined : data.agencyInfo.responsablePhoto,
      featuredProduct: {
        ...data.agencyInfo.featuredProduct,
        image: data.agencyInfo.featuredProduct.image?.startsWith('blob:')
          ? '/assets/aistudio/IMG-20260807-WA0001_87ce40ff.jpg'
          : data.agencyInfo.featuredProduct.image
      }
    },
    video: {
      title: data.videoPresentation.title,
      subtitle: data.videoPresentation.subtitle,
      // If the video is a local blob, we don't serialize blob url across computers,
      // but if it's a bundled path like /assets/aistudio/... or a web URL, it serializes perfectly!
      videoUrl: data.videoPresentation.videoUrl?.startsWith('blob:')
        ? '/assets/aistudio/AfricaWeb_22ef340a.mp4'
        : data.videoPresentation.videoUrl,
      duration: data.videoPresentation.duration,
      visible: data.videoPresentation.visible !== false
    },
    pricing: data.pricingPackages,
    colors: data.siteColors,
    typography: data.siteTypography,
    header: data.headerConfig,
    footer: data.footerConfig
  };
}

/**
 * Generate personal showcase link with custom slug and format
 */
export async function generatePersonalShowcaseUrl(
  data: {
    agencyInfo: AgencyState;
    videoPresentation: VideoPresentationData;
    pricingPackages: PricingPackage[];
    siteColors: SiteColors;
    siteTypography: SiteTypography;
    headerConfig: HeaderConfig;
    footerConfig: FooterConfig;
  },
  config?: CustomLinkConfig
): Promise<string> {
  if (typeof window === 'undefined') return '';

  const cleanSlug = sanitizeSlug(config?.slug || data.agencyInfo.responsableName || 'samuel-pro');
  const payload = buildShowcasePayload(data);
  payload.slug = cleanSlug;
  payload.ownerName = config?.displayName || data.agencyInfo.responsableName || data.agencyInfo.name;

  // Cache locally under this slug so short links work immediately on this device
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(`africa_web_showcase_slug_${cleanSlug}`, JSON.stringify(payload));
      localStorage.setItem('africa_web_latest_custom_slug', cleanSlug);
    } catch {}
  }

  const origin = window.location.origin;
  const pathname = window.location.pathname;

  if (config?.linkFormat === 'short') {
    return `${origin}${pathname}?v=${cleanSlug}`;
  }

  // Portable format (default & recommended): embeds custom slug parameter + compressed payload
  const jsonString = JSON.stringify(payload);
  const compressed = await compressData(jsonString);

  return `${origin}${pathname}?v=${cleanSlug}&vitrine=${compressed}`;
}

/**
 * Parse personal showcase link from current window location
 */
export async function parseShowcaseFromUrl(): Promise<ShowcaseExportData | null> {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    let token = params.get('vitrine') || params.get('data') || params.get('showcase');
    const slug = params.get('v') || params.get('slug') || params.get('user');

    // Also check hash fragment e.g. #v=samuel&vitrine=... or #vitrine=... or #samuel
    if (!token && window.location.hash) {
      const hashStr = window.location.hash.replace(/^#\/?/, '');
      const hashParams = new URLSearchParams(hashStr);
      token = hashParams.get('vitrine') || hashParams.get('data') || hashParams.get('showcase');
    }

    // 1. If full compressed token is present, decompress and return
    if (token && token.trim()) {
      const decompressed = await decompressData(token.trim());
      if (decompressed) {
        const parsed: ShowcaseExportData = JSON.parse(decompressed);
        if (parsed && (parsed.agencyInfo || parsed.video || parsed.pricing)) {
          // Cache this showcase under its slug if available
          const activeSlug = slug || parsed.slug;
          if (activeSlug && typeof localStorage !== 'undefined') {
            try {
              localStorage.setItem(`africa_web_showcase_slug_${sanitizeSlug(activeSlug)}`, JSON.stringify(parsed));
            } catch {}
          }
          return parsed;
        }
      }
    }

    // 2. If short slug is given (e.g. ?v=samuel or /v/samuel) without token, check local cache
    const checkSlug = slug || (window.location.pathname.startsWith('/v/') ? window.location.pathname.replace('/v/', '') : null);
    if (checkSlug) {
      const clean = sanitizeSlug(checkSlug);
      if (typeof localStorage !== 'undefined') {
        const cached = localStorage.getItem(`africa_web_showcase_slug_${clean}`);
        if (cached) {
          try {
            return JSON.parse(cached);
          } catch {}
        }
      }
    }
  } catch (err) {
    console.warn('Could not parse vitrine parameter:', err);
  }

  return null;
}
