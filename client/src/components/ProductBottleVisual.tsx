import type { CSSProperties } from "react";
import { KAWAII_MARSHMALLOW_DESKTOP_IMAGE, KAWAII_MARSHMALLOW_MOBILE_IMAGE, type Product } from "@/data/products";

export default function ProductBottleVisual({ product, modal = false }: { product: Product; modal?: boolean }) {
  const useKawaiiCampaign = product.id === "kawaii-marshmallow" && product.image === KAWAII_MARSHMALLOW_DESKTOP_IMAGE;
  return (
    <div
      className={`bottle-stage ${useKawaiiCampaign ? "bottle-stage-kawaii-reveal" : ""} ${modal ? "bottle-stage-modal" : ""}`}
      style={{ "--product-tone": product.color } as CSSProperties}
      aria-label={product.image ? `${product.name} bottle` : `${product.name} bottle placeholder`}
    >
      {useKawaiiCampaign ? (
        <picture>
          <source media="(max-width: 620px)" srcSet={KAWAII_MARSHMALLOW_MOBILE_IMAGE} />
          <img src={KAWAII_MARSHMALLOW_DESKTOP_IMAGE} alt={`${product.name} isth bottle`} loading={modal ? "eager" : "lazy"} />
        </picture>
      ) : product.image ? (
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
    </div>
  );
}
