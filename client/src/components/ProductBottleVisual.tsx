import { useEffect, useState, type CSSProperties } from "react";
import { KAWAII_MARSHMALLOW_DESKTOP_IMAGE, type Product } from "@/data/products";

export default function ProductBottleVisual({ product, modal = false }: { product: Product; modal?: boolean }) {
  const isKawaii = product.id === "kawaii-marshmallow";
  const [imageSource, setImageSource] = useState(product.image);

  useEffect(() => {
    setImageSource(product.image);
  }, [product.image]);

  const fallbackToApprovedKawaiiCampaign = isKawaii && imageSource !== KAWAII_MARSHMALLOW_DESKTOP_IMAGE;
  const visibleImage = imageSource || (isKawaii ? KAWAII_MARSHMALLOW_DESKTOP_IMAGE : undefined);

  return (
    <div
      className={`bottle-stage ${isKawaii ? "bottle-stage-kawaii" : ""} ${modal ? "bottle-stage-modal" : ""}`}
      style={{ "--product-tone": product.color } as CSSProperties}
      aria-label={visibleImage ? `${product.name} bottle` : `${product.name} bottle placeholder`}
    >
      {visibleImage ? (
        <img
          src={visibleImage}
          alt={`${product.name} bottle`}
          loading={modal ? "eager" : "lazy"}
          decoding="async"
          onError={fallbackToApprovedKawaiiCampaign ? () => setImageSource(KAWAII_MARSHMALLOW_DESKTOP_IMAGE) : undefined}
        />
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
