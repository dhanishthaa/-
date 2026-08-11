// Quiet Atelier style reminder: infrastructure UI should feel as considered as the storefront, with calm states and no visual noise.
import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/data/products";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!) : null;

export function isAuthorizedEmail(email: string | undefined) {
  const allowList = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined)?.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (!allowList?.length) return true;
  return Boolean(email && allowList.includes(email.toLowerCase()));
}

function fromRow(row: Record<string, unknown>): Product {
  return { id: String(row.id), name: String(row.name ?? ""), notes: String(row.notes ?? ""), description: String(row.description ?? ""), collection: String(row.collection ?? "Signature"), image: row.image_url ? String(row.image_url) : undefined, color: String(row.color ?? "#5B0D18"), featured: Boolean(row.featured) };
}

export async function fetchRemoteProducts() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("products").select("id,name,notes,description,collection,image_url,color,featured").order("created_at", { ascending: true });
  if (error || !data) return null;
  return data.map((row) => fromRow(row as Record<string, unknown>));
}

export async function upsertRemoteProduct(product: Product) {
  if (!supabase) return true;
  const { error } = await supabase.from("products").upsert({ id: product.id, name: product.name, notes: product.notes, description: product.description, collection: product.collection, image_url: product.image ?? null, color: product.color, featured: Boolean(product.featured) });
  return !error;
}

export async function deleteRemoteProduct(id: string) {
  if (!supabase) return true;
  const { error } = await supabase.from("products").delete().eq("id", id);
  return !error;
}
