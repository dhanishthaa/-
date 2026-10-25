import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { defaultProducts } from "../data/products";

const readProjectFile = (path: string) => readFileSync(path, "utf8");

describe("indexable product pages", () => {
  it("connects each current product card to a product-specific route without replacing the existing Buy Now action", () => {
    const card = readProjectFile("client/src/components/ProductBottle.tsx");
    const app = readProjectFile("client/src/App.tsx");
    expect(card).toContain('href={`/products/${product.id}/`}');
    expect(card).toContain('onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}');
    expect(app).toContain('<Route path="/products/:productId" component={ProductDetail} />');
    expect(defaultProducts).toHaveLength(10);
  });

  it("shows only source catalog descriptions and notes and retains WhatsApp ordering without invented offers", () => {
    const detail = readProjectFile("client/src/pages/ProductDetail.tsx");
    expect(detail).toContain("defaultProducts.find");
    expect(detail).toContain("{product.description}");
    expect(detail).toContain("{product.notes}");
    expect(detail).toContain("DEFAULT_WHATSAPP_NUMBER");
    expect(detail).toContain("Ask ISTH on WhatsApp for current ordering details");
    expect(detail).not.toMatch(/₹|aggregateRating|ratingValue|\bOffer\b|\bProduct\b/);
  });

  it("generates direct static route documents and keeps the missing-photo fallback accessible", () => {
    const vite = readProjectFile("vite.config.ts");
    const gallery = readProjectFile("client/src/components/ProductGallery.tsx");
    expect(vite).toContain("closeBundle()");
    expect(vite).toContain("products/${page.productId}/index.html");
    expect(vite).toContain("guides/choosing-a-fragrance/index.html");
    expect(gallery).toContain('role="img" aria-label={`${product.name} bottle illustration; no product photograph is available`}');
    expect(gallery).toContain("onError={() => setFailedImageUrl(current.url)}");
  });

  it("publishes a useful note-led comparison guide without rankings or performance claims", () => {
    const guide = readProjectFile("client/src/pages/ChoosingAFragrance.tsx");
    const app = readProjectFile("client/src/App.tsx");
    expect(app).toContain('<Route path="/guides/choosing-a-fragrance" component={ChoosingAFragrance} />');
    expect(guide).toContain("defaultProducts.map");
    expect(guide).toContain('href={`/products/${product.id}/`}');
    expect(guide).toContain("not a ranking");
    expect(guide).toContain("Prices, sizes, and availability are not displayed");
  });

  it("keeps the landing tagline unchanged while making it the visible semantic H1", () => {
    const landing = readProjectFile("client/src/pages/Landing.tsx");
    expect(landing).toContain('<h1 className="landing-quote"><span>Embrace the fragrance.</span><span>Become isth.</span></h1>');
  });
});
