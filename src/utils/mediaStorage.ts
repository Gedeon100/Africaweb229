/**
 * Media Storage and Safe Storage Utility
 * - IndexedDB storage for large video files and high-resolution media (prevents localStorage quota crash)
 * - Canvas-based image compression for mobile Android & desktop photo uploads (downscales large 10MB+ images to lightweight ~100-200KB Web-friendly images)
 * - Safe localStorage wrapper with try/catch to ensure the site NEVER crashes or freezes on file imports
 */

const DB_NAME = 'africa_web_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Save a Blob (video or large image) into IndexedDB
 */
export async function saveMediaBlob(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[saveMediaBlob] Could not save to IndexedDB for key "${key}":`, err);
  }
}

/**
 * Retrieve a Blob from IndexedDB
 */
export async function getMediaBlob(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[getMediaBlob] Could not read from IndexedDB for key "${key}":`, err);
    return null;
  }
}

/**
 * Delete a media item from IndexedDB
 */
export async function deleteMediaBlob(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[deleteMediaBlob] Error deleting key "${key}":`, err);
  }
}

/**
 * Compress image using HTML5 Canvas to prevent memory overflow and localStorage QuotaExceeded errors
 * Handles Android camera photos (often 5MB to 20MB) smoothly without freezing
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> {
  // If it's an SVG, read directly as data URL without rasterizing
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if 2D context fails
          resolve(reader.result as string);
          return;
        }

        // Clean white background for transparency fallback
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with optimal compression
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // Fallback to raw reader result if image cannot be decoded
        resolve(reader.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Safe localStorage setter with quota protection
 * Will never crash the React lifecycle or freeze the page
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    console.warn(`[safeLocalStorageSet] Quota exceeded or storage unavailable for key "${key}":`, err);

    // If quota is exceeded, try to clear non-essential cache
    try {
      // Don't crash! Just skip or clean old session data
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
    return false;
  }
}

/**
 * Safe localStorage getter
 */
export function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn(`[safeLocalStorageGet] Error reading key "${key}":`, err);
    return null;
  }
}
