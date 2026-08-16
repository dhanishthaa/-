// Quiet Atelier style reminder: product objects are tactile, softly lit, and intentionally not over-rendered.
import { type CSSProperties } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";

const whatsappNumber = "917859898490";
const whatsappText = "Hi, can I please get more details on your product?";

export default function ProductBottle({ product, compact = false, onOpen }: { product: Product; compact?: boolean; onOpen?: (product: Product) => void }) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${whatsappText} I’m interested in ${product.name}.`)}`;

  return (
    <article className={`product-card ${product.featured ? "is-featured" : ""} ${compact ? "is-compact" : ""}`} style={{ "--product-tone": product.color } as CSSProperties}>
      <button className="product-visual" onClick={() => onOpen?.(product)} aria-label={`View details for ${product.name}`}>
        {product.image ? <img src={product.image} alt="" loading="lazy" /> : <div className="bottle-stage" aria-hidden="true"><div className="bottle-cap" /><div className="bottle-body"><span>isth</span><small>EAU DE PARFUM</small></div></div>}
        <span className="product-open"><ArrowUpRight size={16} strokeWidth={1.4} /></span>
      </button>
      <div className="product-card-copy">
        <div><p className="product-collection">{product.collection} / {product.size}</p><h3>{product.name}</h3></div>
        <button className="product-buy" onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}><MessageCircle size={13} /> Buy now</button>
      </div>
      <p className="product-notes">{product.notes}</p>
    </article>
  );
}
