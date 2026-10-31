import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { defaultProducts, getProductRouteSlug } from "../data/products";
import { getProductPagePath, PRODUCT_ROUTE_ALIASES, renderStaticProductRedirect } from "../seo/site";

const readProjectFile = (path: string) => readFileSync(path, "utf8");

const currentProductSlugs = [
  "first-love",
  "kawaii-marshmallow",
  "cashmere-oud",
  "orion",
  "the-ocean",
  "velvet-night",
  "imperial",
  "northern-star",
  "fiery-soul",
  "sweet-seduction",
];

describe("indexable product pages", () => {
  it("connects each product card to its canonical name-based route without replacing Buy Now", () => {
    const card = readProjectFile("client/src/components/ProductBottle.tsx");
    const app = readProjectFile("client/src/App.tsx");
    expect(card).toContain("href={getProductPagePath(product)}");
    expect(card).toContain('onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}');
    expect(app).toContain('<Route path="/products/:productId" component={ProductDetail} />');
    expect(defaultProducts).toHaveLength(10);
    expect(defaultProducts.map(getProductRouteSlug)).toEqual(currentProductSlugs);
    expect(defaultProducts.map(getProductPagePath)).toEqual(currentProductSlugs.map((slug) => `/products/${slug}/`));
  });

  it("forwards old catalog IDs to current canonical names", () => {
    expect(PRODUCT_ROUTE_ALIASES.map(({ aliasSlug, canonicalPath }) => [aliasSlug, canonicalPath])).toEqual([
      ["eclat-courinne", "/products/first-love/"],
      ["lesprit-epice", "/products/cashmere-oud/"],
      ["17k-pirate", "/products/orion/"],
      ["sacree-marine", "/products/the-ocean/"],
      ["nuit-de-velours", "/products/velvet-night/"],
      ["enigme-imperial", "/products/imperial/"],
      ["reve-oud", "/products/northern-star/"],
    ]);
    const legacyHtml = renderStaticProductRedirect("/products/first-love/", "First Love");
    expect(legacyHtml).toContain('<meta name="robots" content="noindex, follow" />');
    expect(legacyHtml).toContain('<link rel="canonical" href="https://isth.in/products/first-love/" />');
    expect(legacyHtml).toContain('url=/products/first-love/');
  });

  it("shows published catalog descriptions and notes and retains WhatsApp ordering without invented offers", () => {
    const detail = readProjectFile("client/src/pages/ProductDetail.tsx");
    expect(detail).toContain("findProductByRouteSlug");
    expect(detail).toContain("{product.description}");
    expect(detail).toContain("{product.notes}");
    expect(detail).toContain("DEFAULT_WHATSAPP_NUMBER");
    expect(detail).toContain("Ask ISTH on WhatsApp for current ordering details");
    expect(detail).not.toMatch(/₹|aggregateRating|ratingValue|\\bOffer\\b/);
  });

  it("generates direct static route documents and keeps the missing-photo fallback accessible", () => {
    const vite = readProjectFile("vite.config.ts");
    const gallery = readProjectFile("client/src/components/ProductGallery.tsx");
    expect(vite).toContain("closeBundle()");
    expect(vite).toContain("products/${page.productSlug}/index.html");
    expect(vite).toContain("guides/choosing-a-fragrance/index.html");
    expect(vite).toContain("PRODUCT_ROUTE_ALIASES.forEach");
    expect(gallery).toContain('role="img" aria-label={`${product.name} bottle illustration; no product photograph is available`}');
    expect(gallery).toContain("onError={() => setFailedImageUrl(current.url)}");
  });

  it("publishes a useful note-led comparison guide without rankings or performance claims", () => {
    const guide = readProjectFile("client/src/pages/ChoosingAFragrance.tsx");
    const app = readProjectFile("client/src/App.tsx");
    expect(app).toContain('<Route path="/guides/choosing-a-fragrance" component={ChoosingAFragrance} />');
    expect(guide).toContain("defaultProducts.map");
    expect(guide).toContain("getProductPagePath(product)");
    expect(guide).toContain("not a ranking");
    expect(guide).toContain("Prices, sizes, and availability are not displayed");
  });

  it("keeps the landing tagline unchanged while making it the visible semantic H1", () => {
    const landing = readProjectFile("client/src/pages/Landing.tsx");
    expect(landing).toContain('data-layer="Emotional statement"');
    expect(landing).toContain("Embrace the fragrance.");
    expect(landing).toContain("Become isth.");
  });
});
