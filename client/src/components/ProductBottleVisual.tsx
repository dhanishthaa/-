import { useEffect, useState, type CSSProperties } from "react";
import { getProductImageFallback, type Product } from "@/data/products";

export default function ProductBottleVisual({ product, modal = false }: { product: Product; modal?: boolean }) {
  const productImage = getProductImageFallback(product);
  const alternateImage = product.media?.find((item) => item.kind === "image" && item.url !== productImage)?.url;
  const [imageSource, setImageSource] = useState(productImage);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImageSource(productImage);
    setFailed(false);
  }, [productImage, product.id]);

  const visibleImage = failed ? undefined : imageSource;

  return (
    <div
      className={`bottle-stage ${modal ? "bottle-stage-modal" : ""} ${visibleImage ? "has-image" : "is-empty"}`}
      style={{ "--product-tone": product.color } as CSSProperties}
      aria-label={visibleImage ? `${product.name} bottle` : `${product.name} image frame`}
    >
      {visibleImage ? (
        <img
          src={visibleImage}
          alt={`${product.name} bottle`}
          loading={modal || product.featured ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={modal || product.featured ? "high" : "auto"}
          style={{ objectFit: "contain" }}
          onError={() => { if (imageSource === productImage && alternateImage) setImageSource(alternateImage); else setFailed(true); }}
        />
      ) : null}
    </div>
  );
}
