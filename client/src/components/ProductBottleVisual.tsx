import type { CSSProperties } from "react";
import type { Product } from "@/data/products";

export default function ProductBottleVisual({ product, modal = false }: { product: Product; modal?: boolean }) {
  return (
    <div
      className={`bottle-stage ${modal ? "bottle-stage-modal" : ""}`}
      style={{ "--product-tone": product.color } as CSSProperties}
      aria-label={product.image ? `${product.name} bottle` : `${product.name} bottle placeholder`}
    >
      {product.image ? (
        <img src={product.image} alt={`${product.name} bottle`} loading={modal ? "eager" : "lazy"} />
      ) : (
        <div className="bottle-placeholder" aria-hidden="true">
          <div className="bottle-cap" />
          <div className="bottle-body">
            <span>isth</span>
            <small>EAU DE PARFUM</small>
          </div>
        </div>
      )}
      {modal && !product.image ? <span className="bottle-placeholder-note">Image placeholder · editable in admin</span> : null}
    </div>
  );
}
