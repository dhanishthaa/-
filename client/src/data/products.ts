export type Product = {
  /** Stable product key retained by the existing remote catalog and CSS. */
  id: string;
  name: string;
  notes: string;
  description: string;
  collection: string;
  image?: string;
  media?: ProductMedia[];
  color: string;
  size?: string;
  featured?: boolean;
};

export type ProductMedia = {
  id: string;
  kind: "image" | "video";
  url: string;
  fit?: "contain" | "cover";
  alt?: string;
};

/** Legacy database IDs are retained, but public routes use each product's current name. */
export const PRODUCT_ROUTE_SLUGS_BY_ID: Record<string, string> = {
  "eclat-courinne": "first-love",
  "kawaii-marshmallow": "kawaii-marshmallow",
  "lesprit-epice": "cashmere-oud",
  "17k-pirate": "orion",
  "sacree-marine": "the-ocean",
  "nuit-de-velours": "velvet-night",
  "enigme-imperial": "imperial",
  "reve-oud": "northern-star",
  "fiery-soul": "fiery-soul",
  "sweet-seduction": "sweet-seduction",
};

const LOCAL_PRODUCT_IMAGE_FALLBACKS: Record<string, string> = {
  "eclat-courinne": "/assets/firstlove.png",
  "kawaii-marshmallow": "/assets/kawaiimarshmallow.png",
  "lesprit-epice": "/assets/cashmereoud.png",
  "17k-pirate": "/assets/orion.png",
  "sacree-marine": "/assets/theocean.png",
  "nuit-de-velours": "/assets/velvetnight.png",
  "enigme-imperial": "/assets/imperial.png",
  "reve-oud": "/assets/northernstar.png",
  "fiery-soul": "/assets/fierysoul.png",
};

export function slugifyProductName(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getProductRouteSlug(product: Pick<Product, "id" | "name">) {
  return PRODUCT_ROUTE_SLUGS_BY_ID[product.id] ?? slugifyProductName(product.name);
}

export function getProductImageFallback(product: Pick<Product, "id" | "image">) {
  // The published Sweet Seduction asset URL currently returns 404. Do not emit
  // a broken photo URL or substitute another fragrance's image.
  if (product.id === "sweet-seduction" && product.image === "/assets/sweetseduction.png") return undefined;
  if (product.image && !product.image.startsWith("/manus-storage/")) return product.image;
  return LOCAL_PRODUCT_IMAGE_FALLBACKS[product.id];
}

export function findProductByRouteSlug(slug: string, products: Product[] = defaultProducts) {
  return products.find((product) => getProductRouteSlug(product) === slug || product.id === slug);
}

export const defaultProducts: Product[] = [
  { id: "eclat-courinne", name: "First Love", notes: "aqua · lavender · citrus", description: "Bright aqua notes and cool lavender, lifted by a clean citrus opening.", collection: "Signature", image: "/assets/firstlove.png", color: "#AAB9B0", size: "Edition", featured: true },
  { id: "kawaii-marshmallow", name: "Kawaii Marshmallow", notes: "marshmallow · vanilla chocolate · musk", description: "A soft gourmand with a musky finish — sweet without losing its composure.", collection: "Signature", image: "/assets/kawaiimarshmallow.png", color: "#B98778", size: "Edition", featured: true },
  { id: "lesprit-epice", name: "Cashmere Oud", notes: "geranium · rose · leather · oud", description: "A rose shadowed by leather and oud, with a spice that lingers close to the skin.", collection: "Signature", image: "/assets/cashmereoud.png", color: "#79575C", size: "Edition" },
  { id: "17k-pirate", name: "Orion", notes: "pineapple · birch · oakmoss", description: "Pineapple brightens a smoky birch accord grounded in green oakmoss.", collection: "Signature", image: "/assets/orion.png", color: "#C89F65", size: "Edition" },
  { id: "sacree-marine", name: "The Ocean", notes: "honey · lotus · fresh", description: "The clean air of a shoreline warmed by honeyed light.", collection: "Signature", image: "/assets/theocean.png", color: "#8DA8A7", size: "Edition" },
  { id: "nuit-de-velours", name: "Velvet Night", notes: "rose · blackcurrant · patchouli", description: "Dark berries and rose petals folded into velvety patchouli.", collection: "Signature", image: "/assets/velvetnight.png", color: "#5B0D18", size: "Edition" },
  { id: "enigme-imperial", name: "Imperial", notes: "spices · herbs · lavender", description: "A cool aromatic structure with a measured, imperial edge.", collection: "Signature", image: "/assets/imperial.png", color: "#8B8874", size: "Edition" },
  { id: "reve-oud", name: "Northern Star", notes: "cucumber · bubblegum · orange · oud", description: "Unexpected freshness over oud: cucumber, orange, and a playful trace of bubblegum.", collection: "Signature", image: "/assets/northernstar.png", color: "#879A78", size: "Edition" },
  { id: "fiery-soul", name: "Fiery Soul", notes: "rum · kesar · oud", description: "A glowing amber trail where rum and kesar meet a deep oud base.", collection: "Signature", image: "/assets/fierysoul.png", color: "#8F633D", size: "Edition" },
  { id: "sweet-seduction", name: "Sweet Seduction", notes: "coffee · pink pepper · jasmine", description: "Roasted coffee and jasmine, warmed by a fine peppered lift.", collection: "Signature", color: "#9B6D58", size: "Edition" },
];

export function normalizeProductMedia(product: Product): Product {
  const fallback = LOCAL_PRODUCT_IMAGE_FALLBACKS[product.id];
  const normalizedMedia = Array.isArray(product.media) ? product.media.filter((item) => item && (item.kind === "image" || item.kind === "video") && typeof item.url === "string" && item.url.length > 0) : [];
  return { ...product, image: product.image || fallback, media: normalizedMedia };
}
