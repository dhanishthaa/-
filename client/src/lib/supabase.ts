import { createClient } from "@supabase/supabase-js";
import { normalizeProductMedia, type Product, type ProductMedia } from "@/data/products";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const PRODUCT_LIMITS = {
  id: 96,
  name: 80,
  notes: 160,
  description: 500,
  collection: 40,
  imageUrl: 2048,
} as const;

const PRODUCT_MEDIA_LIMIT = 12;

type SecureProductPayload = {
  id: string;
  name: string;
  notes: string;
  description: string;
  collection: string;
  image_url: string | null;
  color: string;
  size: string;
  featured: boolean;
};

export type HeroSlide = { id: string; url: string; focalX: number; focalY: number };
export type HeroCarouselSettings = { desktop: HeroSlide[]; mobile: HeroSlide[]; interval: number };
export type AtelierMedia = { id: string; kind: "image" | "video"; largeUrl: string; smallUrl: string; description: string; caption?: string; originalDescription?: string };
export type WebsiteContentItem = { id: string; page: "Home" | "About" | "Guides" | "Shared"; section: string; label: string; html: string; originalHtml: string; deleted?: boolean };

export const DEFAULT_ATELIER: AtelierMedia[] = [
  {
    id: "between-familiar-unknown",
    kind: "image",
    largeUrl: "/assets/isth-editorial-about.webp",
    smallUrl: "/assets/isth-editorial-about.webp",
    caption: "SACRÉE MARINE",
    description: "<strong>Between the familiar<br>&amp; the unknown.</strong><br><br>isth is a lifestyle fragrance house built around the tension between what you recognise and what you cannot quite name. Familiar ingredients, given room to become something else.",
  },
  {
    id: "figma-atelier",
    kind: "image",
    largeUrl: "/assets/3-5.webp",
    smallUrl: "/assets/3-5.webp",
    caption: "A STUDY IN SENSATION",
    description: "<strong>An intimate art.<br>An invisible signature.</strong><br><br>Before a fragrance touches skin, it begins with a gesture. A rare essence. An unexpected accord. The quiet pursuit of something that has never existed before.",
  },
];

export const DEFAULT_WEBSITE_CONTENT: WebsiteContentItem[] = [
  { id: "home-hero-tagline", page: "Home", section: "Hero", label: "Hero heading", html: "Become<br>isth.", originalHtml: "Become<br>isth." },
  { id: "home-collection-heading", page: "Home", section: "Collection", label: "Collection heading", html: "Find your<br><em>signature.</em>", originalHtml: "Find your<br><em>signature.</em>" },
  { id: "home-collection-copy", page: "Home", section: "Collection", label: "Collection description", html: "Each isth composition is made to be worn close. Browse by feeling, not by family.", originalHtml: "Each isth composition is made to be worn close. Browse by feeling, not by family." },
  { id: "home-quote", page: "Home", section: "Quote", label: "Quote", html: "Life is not just about,<br>living &amp; surviving.<br>It's about feeling it,<br>enjoying it, &amp; making memories.", originalHtml: "Life is not just about,<br>living &amp; surviving.<br>It's about feeling it,<br>enjoying it, &amp; making memories." },
  { id: "about-heading", page: "About", section: "Masthead", label: "About heading", html: "Between the familiar<br><em>&amp; the unknown.</em>", originalHtml: "Between the familiar<br><em>&amp; the unknown.</em>" },
  { id: "about-lede", page: "About", section: "Masthead", label: "About introduction", html: "isth is a lifestyle fragrance house built upon quiet moments, tactile memories, and the precise tension between what you recognise and what you cannot quite name.", originalHtml: "isth is a lifestyle fragrance house built upon quiet moments, tactile memories, and the precise tension between what you recognise and what you cannot quite name." },
  { id: "about-philosophy", page: "About", section: "Narrative", label: "Philosophy", html: "Philosophy of the Scent", originalHtml: "Philosophy of the Scent" },
  { id: "about-craft", page: "About", section: "Narrative", label: "Craft", html: "Craft &amp; Composition", originalHtml: "Craft &amp; Composition" },
];

export const DEFAULT_HERO_CAROUSEL: HeroCarouselSettings = {
  desktop: [
    { id: "hero-golden-editorial", url: "/assets/isth-hero-golden-editorial.png", focalX: 50, focalY: 50 },
  ],
  mobile: [
    { id: "hero-golden-editorial-mobile", url: "/assets/isth-hero-golden-editorial.png", focalX: 58, focalY: 50 },
  ],
  interval: 3000,
};

export function isValidSupabaseConfig(candidateUrl: unknown, candidateAnonKey: unknown): candidateUrl is string {
  if (typeof candidateUrl !== "string" || typeof candidateAnonKey !== "string") return false;
  if (!candidateUrl.trim() || !candidateAnonKey.trim()) return false;
  if (candidateUrl.includes("%VITE_") || candidateAnonKey.includes("%VITE_")) return false;
  try {
    const parsed = new URL(candidateUrl);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = isValidSupabaseConfig(url, anonKey);

// Admin credentials and refresh tokens are intentionally kept in memory only.
// Supabase RLS/RPC remains the real authorization boundary for every mutation.
export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        // Keep the authenticated admin session for the current browser tab. A
        // memory-only session is lost during a route refresh and makes every
        // subsequent RPC look like an expired secure session.
        persistSession: true,
        storage: window.sessionStorage,
        storageKey: "isth-admin-auth",
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function isSuperAdminRole(role: unknown): role is "super_admin" {
  return role === "super_admin";
}

export function isSafeMediaUrl(value: string) {
  if (!value || value.length > PRODUCT_LIMITS.imageUrl) return false;
  if (value.startsWith("/assets/") || value.startsWith("/manus-storage/")) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && !/[<>\s]/.test(value);
  } catch {
    return false;
  }
}

function sanitizeProductMedia(value: unknown): ProductMedia[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is ProductMedia => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<ProductMedia>;
    return (candidate.kind === "image" || candidate.kind === "video") && typeof candidate.url === "string" && isSafeMediaUrl(candidate.url);
  }).slice(0, PRODUCT_MEDIA_LIMIT).map((item, index) => ({
    id: typeof item.id === "string" && item.id ? item.id.slice(0, 96) : `media-${index}`,
    kind: item.kind,
    url: item.url.slice(0, PRODUCT_LIMITS.imageUrl),
    fit: item.fit === "cover" ? "cover" : "contain",
    alt: typeof item.alt === "string" ? item.alt.slice(0, 160) : undefined,
  }));
}

function isSafeProductId(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= PRODUCT_LIMITS.id;
}

function isSafeHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function isAuthFailure(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return error.code === "PGRST301" || /jwt|token|session/i.test(error.message ?? "");
}

function normalizeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function toSecureProductPayload(product: Product): SecureProductPayload | null {
  const id = normalizeText(product.id, PRODUCT_LIMITS.id).toLowerCase();
  const name = normalizeText(product.name, PRODUCT_LIMITS.name);
  const notes = normalizeText(product.notes, PRODUCT_LIMITS.notes);
  const description = normalizeText(product.description, PRODUCT_LIMITS.description);
  const collection = normalizeText(product.collection, PRODUCT_LIMITS.collection);
  const image = product.image ? normalizeText(product.image, PRODUCT_LIMITS.imageUrl) : "";
  const color = normalizeText(product.color, 7);
  // The original local catalogue used "Edition", while Supabase enforces
  // the persisted values "10ml tower" and "30ml cosmos". Keep legacy rows
  // editable instead of sending an invalid value to the RPC.
  const size = product.size === "10ml tower" ? "10ml tower" : "30ml cosmos";

  // Older catalogue rows may not have a description. Editing a name should
  // not be blocked by that unrelated legacy field.
  if (!isSafeProductId(id) || !name || !notes || !collection || !size || !isSafeHexColor(color)) return null;
  if (image && !isSafeMediaUrl(image)) return null;

  return { id, name, notes, description: description || "A considered composition from the isth scent library.", collection, image_url: image || null, color, size, featured: Boolean(product.featured) };
}

function fromRow(row: Record<string, unknown>): Product {
  const size = row.size === "10ml tower" ? "10ml tower" : "30ml cosmos";
  return normalizeProductMedia({ id: String(row.id), name: String(row.name ?? ""), notes: String(row.notes ?? ""), description: String(row.description ?? ""), collection: String(row.collection ?? "Signature"), image: row.image_url ? String(row.image_url) : undefined, media: sanitizeProductMedia(row.media), color: String(row.color ?? "#5B0D18"), size, featured: Boolean(row.featured) });
}

export async function fetchRemoteProducts() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("products").select("id,name,notes,description,collection,image_url,media,color,size,featured").order("created_at", { ascending: true });
  if (error || !data) return null;
  return data.map((row) => fromRow(row as Record<string, unknown>));
}

export async function upsertRemoteProduct(product: Product) {
  const payload = toSecureProductPayload(product);
  if (!supabase || !payload) return { ok: false, error: "invalid product fields" };
  let result = await supabase.rpc("admin_upsert_product", payload);
  if (isAuthFailure(result.error)) {
    const refreshed = await supabase.auth.refreshSession();
    if (!refreshed.error) result = await supabase.rpc("admin_upsert_product", payload);
  }
  if (result.error) return { ok: false, error: result.error.message };
  const mediaResult = await supabase.rpc("admin_set_product_media", { product_id: payload.id, product_media: sanitizeProductMedia(product.media) });
  return { ok: !mediaResult.error, error: mediaResult.error?.message };
}

export async function deleteRemoteProduct(id: string) {
  if (!supabase || !isSafeProductId(id)) return false;
  let result = await supabase.rpc("admin_delete_product", { product_id: id });
  if (isAuthFailure(result.error)) {
    const refreshed = await supabase.auth.refreshSession();
    if (!refreshed.error) result = await supabase.rpc("admin_delete_product", { product_id: id });
  }
  return !result.error;
}

export async function fetchAdminRole() {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_my_admin_role");
  if (error || !isSuperAdminRole(data)) return null;
  return data;
}

export async function fetchPublicHeroCarousel() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", "hero_carousel").maybeSingle();
  if (error || !data?.value) return null;
  try {
    const storedValue = typeof data.value === "object" && data.value !== null && "value" in data.value ? (data.value as { value?: unknown }).value : data.value;
    const raw = typeof storedValue === "string" ? JSON.parse(storedValue) : storedValue;
    if (!raw || !Array.isArray(raw.desktop) || !Array.isArray(raw.mobile)) return null;
    const sanitize = (slides: unknown[]) => slides.filter((slide): slide is HeroSlide => Boolean(slide && typeof slide === "object" && typeof (slide as HeroSlide).url === "string" && isSafeMediaUrl((slide as HeroSlide).url))).map((slide, index) => ({ id: String(slide.id || `slide-${index}`), url: slide.url, focalX: Math.min(100, Math.max(0, Number(slide.focalX) || 50)), focalY: Math.min(100, Math.max(0, Number(slide.focalY) || 50)) }));
    return { desktop: sanitize(raw.desktop), mobile: sanitize(raw.mobile), interval: Math.min(5000, Math.max(2000, Number(raw.interval) || 3000)) } satisfies HeroCarouselSettings;
  } catch { return null; }
}

export async function savePublicSetting(key: "logo_url" | "motion_video_url" | "hero_carousel" | "atelier" | "website_content", value: string) {
  if (!supabase) return false;
  if (key !== "hero_carousel" && value && !isSafeMediaUrl(value)) return false;
  if ((key === "hero_carousel" || key === "atelier" || key === "website_content") && value.length > 300000) return false;
  let { error } = await supabase.rpc("admin_set_site_setting", { setting_key: key, setting_value: value });
  if (isAuthFailure(error)) {
    const refreshed = await supabase.auth.refreshSession();
    if (!refreshed.error) ({ error } = await supabase.rpc("admin_set_site_setting", { setting_key: key, setting_value: value }));
  }
  return !error;
}

export async function uploadPublicAsset(file: File, folder: "brand" | "motion" | "hero-desktop" | "hero-mobile" | "atelier-large" | "atelier-small") {
  if (!supabase || !isSafeAssetFile(file)) return null;
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false, contentType: file.type, cacheControl: "3600" });
  if (error) return null;
  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

export async function uploadProductAsset(file: File, kind: "image" | "video") {
  if (!supabase || !isSafeAssetFile(file)) return null;
  const allowed = kind === "image" ? file.type.startsWith("image/") : file.type.startsWith("video/");
  if (!allowed) return null;
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `product-${kind}s/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false, contentType: file.type, cacheControl: "31536000" });
  if (error) return null;
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export async function deletePublicAsset(publicUrl: string) {
  if (!supabase) return false;
  const bucket = publicUrl.includes("/storage/v1/object/public/product-images/") ? "product-images" : publicUrl.includes("/storage/v1/object/public/site-media/") ? "site-media" : null;
  if (!bucket) return false;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const path = publicUrl.split(marker)[1]?.split("?")[0];
  if (!path) return false;
  const { error } = await supabase.storage.from(bucket).remove([decodeURIComponent(path)]);
  return !error;
}

export function isSafeAssetFile(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"];
  return allowed.includes(file.type) && file.size > 0 && file.size <= 10 * 1024 * 1024;
}

function parseSettingValue(value: unknown) {
  const stored = typeof value === "object" && value !== null && "value" in value ? (value as { value?: unknown }).value : value;
  try { return typeof stored === "string" ? JSON.parse(stored) : stored; } catch { return null; }
}

function isSafeAtelierItem(item: unknown): item is AtelierMedia {
  if (!item || typeof item !== "object") return false;
  const value = item as Partial<AtelierMedia>;
  return typeof value.id === "string" && typeof value.largeUrl === "string" && typeof value.smallUrl === "string" && isSafeMediaUrl(value.largeUrl) && isSafeMediaUrl(value.smallUrl) && (value.kind === "image" || value.kind === "video") && typeof value.description === "string" && (value.caption === undefined || (typeof value.caption === "string" && value.caption.length <= 80));
}

export async function fetchPublicAtelier() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", "atelier").maybeSingle();
  if (error || !data) return null;
  const parsed = parseSettingValue(data.value);
  return Array.isArray(parsed) ? parsed.filter(isSafeAtelierItem).slice(0, 24) : null;
}

export async function fetchWebsiteContent() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", "website_content").maybeSingle();
  if (error || !data) return null;
  const parsed = parseSettingValue(data.value);
  return Array.isArray(parsed) ? parsed.filter((item): item is WebsiteContentItem => Boolean(item && typeof item === "object" && typeof (item as WebsiteContentItem).id === "string" && typeof (item as WebsiteContentItem).html === "string")) : null;
}

export async function saveAtelier(items: AtelierMedia[]) {
  return savePublicSetting("atelier", JSON.stringify(items));
}

export async function saveWebsiteContent(items: WebsiteContentItem[]) {
  return savePublicSetting("website_content", JSON.stringify(items));
}

export function sanitizeRichText(input: string) {
  if (typeof document === "undefined") return input.replace(/<script[\s\S]*?<\/script>/gi, "");
  const template = document.createElement("template"); template.innerHTML = input;
  const allowed = new Set(["BR", "EM", "STRONG", "U", "SPAN"]);
  const walk = (node: Node) => { Array.from(node.childNodes).forEach((child) => { if (child.nodeType === Node.ELEMENT_NODE) { const element = child as HTMLElement; if (!allowed.has(element.tagName)) { child.replaceWith(...Array.from(child.childNodes)); return; } Array.from(element.attributes).forEach((attribute) => { if (!["style"].includes(attribute.name)) element.removeAttribute(attribute.name); }); walk(element); } }); };
  walk(template.content); return template.innerHTML.slice(0, 12000);
}
