export const DEFAULT_LOGO_URL = "/assets/isth-logo-111_06bb811c.svg";
export const DEFAULT_WHATSAPP_NUMBER = "917859898490";
export const DEFAULT_WHATSAPP_TEXT = "Hello isth, I am interested in purchasing.";
export const BRAND_QUOTE = "Embrace the fragrance. Become isth.";
export const INSTAGRAM_URL = "https://www.instagram.com/isth.in?utm_source=qr&igsh=MXVsNm96cWZvcHdicA==";

const LOGO_KEY = "isth-logo-cache";
const VIDEO_KEY = "isth-video-cache";

function readCachedAsset(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  return stored && isSafeHttpUrl(stored) ? stored : fallback;
}

// These values are presentation caches only. Supabase RLS/RPC is the authority
// for published brand settings; editing localStorage cannot alter official data.
export function readLogoUrl() {
  return readCachedAsset(LOGO_KEY, DEFAULT_LOGO_URL);
}

export function writeLogoUrl(value: string) {
  if (typeof window !== "undefined" && isSafeHttpUrl(value)) window.localStorage.setItem(LOGO_KEY, value);
}

export function readVideoUrl() {
  return readCachedAsset(VIDEO_KEY, "");
}

export function writeVideoUrl(value: string) {
  if (typeof window !== "undefined" && isSafeHttpUrl(value)) window.localStorage.setItem(VIDEO_KEY, value);
}

export function isSafeAssetFile(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"];
  return allowed.includes(file.type) && file.size > 0 && file.size <= 10 * 1024 * 1024;
}

export function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !/[<>\s]/.test(value) && value.length <= 2048;
  } catch {
    return false;
  }
}
