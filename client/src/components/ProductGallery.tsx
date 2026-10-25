import { useMemo, useRef, useState, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductImageFallback, type Product, type ProductMedia } from "@/data/products";

export default function ProductGallery({ product }: { product: Product }) {
  const fallback = getProductImageFallback(product);
  const items = useMemo<ProductMedia[]>(() => {
    const saved = product.media?.filter((item) => item.kind === "image" || item.kind === "video") ?? [];
    if (saved.length) return saved;
    return fallback ? [{ id: "primary-image", kind: "image", url: fallback, fit: "contain" }] : [];
  }, [fallback, product.media]);
  const [index, setIndex] = useState(0);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const touchStart = useRef<number | null>(null);
  const current = items[index] ?? items[0];
  const setSlide = (next: number) => setIndex(items.length ? (next + items.length) % items.length : 0);
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => { touchStart.current = event.touches[0]?.clientX ?? null; };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    const end = event.changedTouches[0]?.clientX;
    if (start === null || end === undefined || Math.abs(end - start) < 38) return;
    setSlide(index + (end < start ? 1 : -1));
  };
  const marker = items.length < 2 ? 0 : Math.round(index / (items.length - 1) * 2);
  const imageIsVisible = current?.kind === "image" && current.url !== failedImageUrl;

  return <div className="product-gallery" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onKeyDown={(event) => { if (event.key === "ArrowRight") setSlide(index + 1); if (event.key === "ArrowLeft") setSlide(index - 1); }} tabIndex={0} aria-label={`${product.name} media gallery`}>
    <div className="product-gallery-frame">
      {current?.kind === "video" ? <video key={current.id} src={current.url} controls playsInline preload="metadata" aria-label={`${product.name} video`} /> : imageIsVisible && current ? <img key={current.id} src={current.url} alt={current.alt || `${product.name} perfume bottle by ISTH`} loading="eager" decoding="async" style={{ objectFit: current.fit === "cover" ? "cover" : "contain" }} onError={() => setFailedImageUrl(current.url)} /> : <div className="bottle-placeholder" role="img" aria-label={`${product.name} bottle illustration; no product photograph is available`}><div className="bottle-cap" /><div className="bottle-body"><span>isth</span><small>EAU DE PARFUM</small></div></div>}
      {items.length > 1 && <><button type="button" className="product-gallery-arrow product-gallery-arrow--prev" onClick={() => setSlide(index - 1)} aria-label="Previous product media"><ChevronLeft size={17} /></button><button type="button" className="product-gallery-arrow product-gallery-arrow--next" onClick={() => setSlide(index + 1)} aria-label="Next product media"><ChevronRight size={17} /></button></>}
    </div>
    {items.length > 1 && <div className="product-gallery-dots" aria-label="Gallery progress">{[0, 1, 2].map((dot) => <button key={dot} type="button" className={marker === dot ? "is-active" : ""} onClick={() => setSlide(Math.round(dot / 2 * (items.length - 1)))} aria-label={`Go to gallery ${dot === 0 ? "beginning" : dot === 1 ? "middle" : "end"}`} aria-current={marker === dot ? "step" : undefined} />)}</div>}
  </div>;
}
