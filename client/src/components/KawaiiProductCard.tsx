import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import ProductBottleVisual from "@/components/ProductBottleVisual";

const whatsappNumber = "917859898490";

export default function KawaiiProductCard({ product, onOpen }: { product: Product; onOpen?: (product: Product) => void }) {
  const inquiry = `Hello isth, I am interested in purchasing ${product.name}.`;

  return (
    <article className="kawaii-product-card is-kawaii" aria-labelledby={`${product.id}-title`}>
      <button className="kawaii-card-media" onClick={() => onOpen?.(product)} aria-label={`View details for ${product.name}`}>
        <ProductBottleVisual product={product} />
        <span className="kawaii-card-open" aria-hidden="true"><ArrowUpRight size={16} strokeWidth={1.4} /></span>
      </button>
      <div className="kawaii-card-info">
        <p className="kawaii-category">isth · Eau de parfum</p>
        <h3 id={`${product.id}-title`}>{product.name}</h3>
        <p className="kawaii-description">{product.description}</p>
        <dl className="kawaii-notes">
          <div><dt>Notes</dt><dd>{product.notes}</dd></div>
        </dl>
        <a className="kawaii-inquiry" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquiry)}`} target="_blank" rel="noreferrer"><MessageCircle size={14} /> Ask about this scent</a>
      </div>
    </article>
  );
}
