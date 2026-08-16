// Quiet Atelier style reminder: product objects are tactile, softly lit, and intentionally not over-rendered.
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";

const whatsappNumber = "917859898490";
const whatsappText = "Hi, can I please get more details on your product?";

export default function ProductBottle({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${whatsappText} I’m interested in ${product.name}.`)}`;
  const closeDialog = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeDialog(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  return (
    <article className={`product-card ${product.featured ? "is-featured" : ""} ${compact ? "is-compact" : ""}`} style={{ "--product-tone": product.color } as CSSProperties}>
      <button className="product-visual" onClick={() => setOpen(true)} aria-label={`View details for ${product.name}`}>
        {product.image ? <img src={product.image} alt="" loading="lazy" /> : <div className="bottle-stage" aria-hidden="true"><div className="bottle-cap" /><div className="bottle-body"><span>isth</span><small>EAU DE PARFUM</small></div></div>}
        <span className="product-open"><ArrowUpRight size={16} strokeWidth={1.4} /></span>
      </button>
      <div className="product-card-copy">
        <div><p className="product-collection">{product.collection} / {product.size}</p><h3>{product.name}</h3></div>
        <button className="product-buy" onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}><MessageCircle size={13} /> Buy now</button>
      </div>
      <p className="product-notes">{product.notes}</p>
      {open && <div className="product-dialog-backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <div className="product-dialog" role="dialog" aria-modal="true" aria-label={`${product.name} details`} onPointerDown={(event) => event.stopPropagation()}>
          <button type="button" className="dialog-close" onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); closeDialog(); }} onClick={(event) => { event.preventDefault(); event.stopPropagation(); closeDialog(); }} aria-label="Close product details">×</button>
          <span className="eyebrow">isth / {product.collection}</span>
          <h2>{product.name}</h2>
          <p className="dialog-notes">{product.notes}</p>
          <p>{product.description}</p>
          <a className="cherry-button" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Ask about this scent</a>
        </div>
      </div>}
    </article>
  );
}
