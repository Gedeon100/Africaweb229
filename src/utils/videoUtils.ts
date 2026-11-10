/**
 * Video Parser and Cross-Platform Helper for Android, PC & Mobile
 * Converts any user input (YouTube, Google Drive, Dropbox, Vimeo, Dailymotion, direct MP4/WebM)
 * into a universally playable format guaranteed to work on all devices.
 */

export type VideoPlatform = 'youtube' | 'googledrive' | 'vimeo' | 'dropbox' | 'dailymotion' | 'html5' | 'empty';

export interface ParsedVideoInfo {
  platform: VideoPlatform;
  embedUrl?: string;
  streamUrl?: string;
  isIframe: boolean;
  label: string;
}

export function parseUniversalVideoUrl(url: string | undefined | null): ParsedVideoInfo {
  if (!url || !url.trim()) {
    return {
      platform: 'empty',
      isIframe: false,
      label: 'Aucune vidéo configurée'
    };
  }

  const clean = url.trim();

  // 1. YouTube (standard, shorts, embed, mobile)
  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const ytMatch = clean.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`,
      isIframe: true,
      label: 'Vidéo YouTube (Compatible 100% Android & PC)'
    };
  }

  // 2. Google Drive video link
  // e.g. https://drive.google.com/file/d/1A2B3C4D.../view?usp=sharing
  // e.g. https://drive.google.com/open?id=1A2B3C4D...
  const gdriveRegex = /drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+)|uc\?id=([a-zA-Z0-9_-]+))/;
  const gdriveMatch = clean.match(gdriveRegex);
  if (gdriveMatch) {
    const fileId = gdriveMatch[1] || gdriveMatch[2] || gdriveMatch[3];
    if (fileId) {
      return {
        platform: 'googledrive',
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isIframe: true,
        label: 'Lecteur Google Drive (Compatible Android & PC)'
      };
    }
  }

  // 3. Dropbox video link
  // e.g. https://www.dropbox.com/s/xyz/video.mp4?dl=0 -> convert to ?raw=1
  if (clean.includes('dropbox.com')) {
    let directDropboxUrl = clean.replace(/\?dl=0$/, '').replace(/&dl=0$/, '');
    directDropboxUrl += directDropboxUrl.includes('?') ? '&raw=1' : '?raw=1';
    return {
      platform: 'dropbox',
      streamUrl: directDropboxUrl,
      isIframe: false,
      label: 'Fichier Dropbox Direct (MP4)'
    };
  }

  // 4. Vimeo video link
  // e.g. https://vimeo.com/123456789
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = clean.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      platform: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?playsinline=1&title=0&byline=0`,
      isIframe: true,
      label: 'Vidéo Vimeo (Compatible Android & PC)'
    };
  }

  // 5. Dailymotion link
  const dmRegex = /dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)/;
  const dmMatch = clean.match(dmRegex);
  if (dmMatch && dmMatch[1]) {
    return {
      platform: 'dailymotion',
      embedUrl: `https://www.dailymotion.com/embed/video/${dmMatch[1]}`,
      isIframe: true,
      label: 'Vidéo Dailymotion (Compatible Android & PC)'
    };
  }

  // 6. Default HTML5 direct video (Local bundled MP4, external CDN MP4, WebM, blob)
  if (clean.startsWith('indexeddb:')) {
    return {
      platform: 'html5',
      streamUrl: '/assets/aistudio/AfricaWeb_22ef340a.mp4',
      isIframe: false,
      label: 'Vidéo Officielle Africa Web'
    };
  }

  return {
    platform: 'html5',
    streamUrl: clean,
    isIframe: false,
    label: clean.startsWith('blob:')
      ? 'Fichier local importé'
      : clean.startsWith('/assets/aistudio/')
      ? 'Vidéo Officielle Africa Web'
      : clean.startsWith('/videos/')
      ? 'Vidéo officielle du site'
      : 'Fichier direct MP4/WebM'
  };
}

/**
 * Generates an instant shareable URL containing the current active video
 * When opened on any smartphone (Android/iOS) or computer, it immediately plays that video!
 */
export function generateShareableVideoUrl(videoUrl: string): string {
  if (typeof window === 'undefined') return '';
  const baseUrl = window.location.origin + window.location.pathname;
  if (!videoUrl || videoUrl.startsWith('blob:')) {
    return baseUrl;
  }
  return `${baseUrl}?v=${encodeURIComponent(videoUrl)}`;
}
