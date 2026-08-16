export type Product = {
  id: string;
  name: string;
  notes: string;
  description: string;
  collection: string;
  image?: string;
  color: string;
  size?: string;
  featured?: boolean;
};

export const defaultProducts: Product[] = [
  { id: "kawaii-marshmallow", name: "Kawaii Marshmallow", notes: "marshmallow · vanilla chocolate · musk", description: "A soft gourmand with a musky finish — sweet without losing its composure.", collection: "Signature", image: "/assets/isth-bottle-10ml_630d74f3.png", color: "#B98778", size: "Edition", featured: true },
  { id: "eclat-courinne", name: "Éclat Courinné", notes: "aqua · lavender · citrus", description: "Bright aqua notes and cool lavender, lifted by a clean citrus opening.", collection: "Signature", image: "/assets/isth-bottle-30ml_79079c93.png", color: "#AAB9B0", size: "Edition", featured: true },
  { id: "lesprit-epice", name: "L'Esprit Épicé", notes: "geranium · rose · leather · oud", description: "A rose shadowed by leather and oud, with a spice that lingers close to the skin.", collection: "Signature", color: "#79575C", size: "Edition" },
  { id: "17k-pirate", name: "17K Pirate", notes: "pineapple · birch · oakmoss", description: "Pineapple brightens a smoky birch accord grounded in green oakmoss.", collection: "Signature", color: "#C89F65", size: "Edition" },
  { id: "sacree-marine", name: "Sacrée Marine", notes: "honey · lotus · fresh", description: "The clean air of a shoreline warmed by honeyed light.", collection: "Signature", color: "#8DA8A7", size: "Edition" },
  { id: "nuit-de-velours", name: "Nuit de velours", notes: "rose · blackcurrant · patchouli", description: "Dark berries and rose petals folded into velvety patchouli.", collection: "Signature", color: "#5B0D18", size: "Edition" },
  { id: "fiery-soul", name: "Fiery Soul", notes: "rum · kesar · oud", description: "A glowing amber trail where rum and kesar meet a deep oud base.", collection: "Signature", color: "#8F633D", size: "Edition" },
  { id: "enigme-imperial", name: "Énigme Imperial", notes: "spices · herbs · lavender", description: "A cool aromatic structure with a measured, imperial edge.", collection: "Signature", color: "#8B8874", size: "Edition" },
  { id: "sweet-seduction", name: "Sweet Seduction", notes: "coffee · pink pepper · jasmine", description: "Roasted coffee and jasmine, warmed by a fine peppered lift.", collection: "Signature", color: "#9B6D58", size: "Edition" },
  { id: "reve-oud", name: "Rêve Oud", notes: "cucumber · bubblegum · orange · oud", description: "Unexpected freshness over oud: cucumber, orange, and a playful trace of bubblegum.", collection: "Signature", color: "#879A78", size: "Edition" },
];

const STORAGE_KEY = "isth-products-v1";

export function readLocalProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export function writeLocalProducts(products: Product[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
