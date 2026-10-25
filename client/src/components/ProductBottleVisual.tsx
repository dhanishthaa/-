import { useEffect, useState, type CSSProperties } from "react";
import { getProductImageFallback, type Product } from "@/data/products";

export default function ProductBottleVisual({ product, modal = false }: { product: Product; modal?: boolean }) {
  const imageMedia = product.media?.find((item) => item.kind === "image");
  const [imageSource, setImageSource] = useState(imageMedia?.url || getProductImageFallback(product));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImageSource(imageMedia?.url || getProductImageFallback(product));
    setFailed(false);
  }, [imageMedia?.url, product.image, product.id]);

  const fallback = getProductImageFallback(product);
  const shouldUseFallback = Boolean(fallback && imageSource !== fallback);
  const visibleImage = failed ? undefined : imageSource;
  const imageFit = imageMedia?.fit ?? (imageSource?.includes("/assets/") && !imageSource.includes("bottle-") ? "cover" : "contain");

  return (
    <div
      className={`bottle-stage ${modal ? "bottle-stage-modal" : ""} ${visibleImage ? "has-image" : "is-placeholder"}`}
      style={{ "--product-tone": product.color } as CSSProperties}
      aria-label={visibleImage ? `${product.name} bottle` : `${product.name} bottle placeholder`}
    >
      {visibleImage ? (
        <img
          src={visibleImage}
          alt={`${product.name} bottle`}
          loading={modal || product.featured ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={modal || product.featured ? "high" : "auto"}
          style={{ objectFit: imageFit }}
          onError={() => { if (shouldUseFallback) setImageSource(fallback); else setFailed(true); }}
        />
      ) : (
        <div className="bottle-placeholder" aria-hidden="true">
          <div className="bottle-cap" />
          <div className="bottle-body"><span>isth</span><small>EAU DE PARFUM</small></div>
        </div>
      )}
    </div>
  );
}
