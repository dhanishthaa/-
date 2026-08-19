import type { CSSProperties } from "react";
import type { Product } from "@/data/products";

export default function ProductBottleVisual({ product, modal = false }: { product: Product; modal?: boolean }) {
  const isKawaii = product.id === "kawaii-marshmallow";
  return (
    <div
      className={`bottle-stage ${isKawaii ? "bottle-stage-kawaii" : ""} ${modal ? "bottle-stage-modal" : ""}`}
      style={{ "--product-tone": product.color } as CSSProperties}
      aria-label={product.image ? `${product.name} bottle` : `${product.name} bottle placeholder`}
    >
      {product.image ? (
        <img src={product.image} alt={`${product.name} bottle`} loading={modal ? "eager" : "lazy"} decoding="async" />
      ) : (
        <div className="bottle-placeholder" aria-hidden="true">
          <div className="bottle-cap" />
          <div className="bottle-body">
            <span>isth</span>
            <small>EAU DE PARFUM</small>
          </div>
        </div>
      )}
    </div>
  );
}
