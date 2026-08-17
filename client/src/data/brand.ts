// Quiet Atelier style reminder: the brand layer stays lowercase, spare, and editable without coupling content to layout.
export const DEFAULT_LOGO_URL = "/assets/isth-logo-111_06bb811c.svg";
export const DEFAULT_WHATSAPP_NUMBER = "917859898490";
export const DEFAULT_WHATSAPP_TEXT = "Hello isth, I am interested in purchasing.";
export const BRAND_QUOTE = "Embrace the fragrance. Become isth.";
export const INSTAGRAM_URL = "https://www.instagram.com/isth.in?utm_source=qr&igsh=MXVsNm96cWZvcHdicA==";

const LOGO_KEY = "isth-logo-url";
const VIDEO_KEY = "isth-video-url";

export function readLogoUrl() {
  if (typeof window === "undefined") return DEFAULT_LOGO_URL;
  const stored = window.localStorage.getItem(LOGO_KEY);
  if (!stored || stored.includes("isth-logo") || stored.includes("isth-asset8-logo")) return DEFAULT_LOGO_URL;
  return stored;
}

export function writeLogoUrl(value: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(LOGO_KEY, value);
}

export function readVideoUrl() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(VIDEO_KEY) || "";
}

export function writeVideoUrl(value: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(VIDEO_KEY, value);
}

export function isSafeAssetFile(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"];
  return allowed.includes(file.type) && file.size <= 10 * 1024 * 1024;
}

export function isSafeHttpUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:"; } catch { return false; }
}
