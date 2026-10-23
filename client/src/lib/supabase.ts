import { createClient } from "@supabase/supabase-js";
import { normalizeProductMedia, type Product } from "@/data/products";

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
  return normalizeProductMedia({ id: String(row.id), name: String(row.name ?? ""), notes: String(row.notes ?? ""), description: String(row.description ?? ""), collection: String(row.collection ?? "Signature"), image: row.image_url ? String(row.image_url) : undefined, color: String(row.color ?? "#5B0D18"), size, featured: Boolean(row.featured) });
}

export async function fetchRemoteProducts() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("products").select("id,name,notes,description,collection,image_url,color,size,featured").order("created_at", { ascending: true });
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
  return { ok: !result.error, error: result.error?.message };
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

export async function savePublicSetting(key: "logo_url" | "motion_video_url", value: string) {
  if (!supabase || (value && !isSafeMediaUrl(value))) return false;
  const { error } = await supabase.rpc("admin_set_site_setting", { setting_key: key, setting_value: value });
  return !error;
}

export async function uploadPublicAsset(file: File, folder: "brand" | "motion") {
  if (!supabase || !isSafeAssetFile(file)) return null;
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false, contentType: file.type, cacheControl: "3600" });
  if (error) return null;
  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

export function isSafeAssetFile(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"];
  return allowed.includes(file.type) && file.size > 0 && file.size <= 10 * 1024 * 1024;
}
