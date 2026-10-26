import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { defaultProducts, getProductImageFallback } from "../data/products";
import { INDEXABLE_SEO_PAGES, SEO_ORIGIN, SEO_PAGES, getProductPagePath, getSeoPage, getStructuredData, renderStaticNoscript, renderStaticSeoHead, stringifyStructuredData, toAbsoluteUrl } from "./site";

const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../../public/manifest.webmanifest", import.meta.url), "utf8")) as Record<string, unknown>;
const fallbackDocument = readFileSync(new URL("../../public/404.html", import.meta.url), "utf8");

describe("technical SEO", () => {
  it("gives each indexable public URL a unique descriptive title, description, canonical, and index directive", () => {
    const titles = INDEXABLE_SEO_PAGES.map((page) => page.title);
    const descriptions = INDEXABLE_SEO_PAGES.map((page) => page.description);

    expect(titles.slice(0, 4)).toEqual([
      "ISTH Perfumes & Fragrances | Official Website",
      "ISTH Perfume Collection | ISTH Fragrance",
      "About ISTH | Fragrance House",
      "How to Choose a Perfume | ISTH Fragrance Guide",
    ]);
    expect(INDEXABLE_SEO_PAGES).toHaveLength(14);
    expect(new Set(titles).size).toBe(INDEXABLE_SEO_PAGES.length);
    expect(new Set(descriptions).size).toBe(INDEXABLE_SEO_PAGES.length);

    INDEXABLE_SEO_PAGES.forEach((page) => {
      const head = renderStaticSeoHead(page);
      expect(head).toContain(`<link rel="canonical" href="${SEO_ORIGIN}${page.canonicalPath}" />`);
      expect(head).toContain('<meta name="robots" content="index, follow" />');
      expect(head).toContain(`<meta property="og:url" content="${SEO_ORIGIN}${page.canonicalPath}" />`);
      expect(head).toContain('<meta property="og:site_name" content="ISTH" />');
      expect(head).toContain(`<meta property="og:image" content="${toAbsoluteUrl(page.socialImagePath)}" />`);
      expect(head).toContain('<meta name="twitter:card" content="summary_large_image" />');
    });
    expect(renderStaticSeoHead(SEO_PAGES.landing)).toContain("<title>ISTH Perfumes &amp; Fragrances | Official Website</title>");
    expect(SEO_PAGES.landing.description).toBe("Discover ISTH perfumes and fragrances. Embrace the fragrance. Become isth.");
  });

  it("creates a self-canonical route for each actual catalog product and rejects non-catalog slugs", () => {
    expect(defaultProducts).toHaveLength(10);
    defaultProducts.forEach((product) => {
      const path = getProductPagePath(product);
      const page = getSeoPage(path);
      expect(page.id).toBe("product");
      expect(page.productId).toBe(product.id);
      expect(page.canonicalPath).toBe(path);
      expect(page.title).toContain(product.name);
      expect(page.description).toContain(product.name);
    });
    expect(getSeoPage("/products/first-love/").indexable).toBe(true);
    expect(getSeoPage("/products/imperial/").indexable).toBe(true);
    expect(getSeoPage("/products/eclat-courinne/").indexable).toBe(false);
    expect(getSeoPage("/products/not-a-fragrance/").indexable).toBe(false);
  });

  it("keeps administration and fallback documents out of search indexes", () => {
    expect(SEO_PAGES.admin.robots).toBe("noindex, nofollow");
    expect(SEO_PAGES["not-found"].robots).toBe("noindex, nofollow");
    expect(robots).toContain("Disallow: /isth/frag/minda");
    expect(robots).toContain("Disallow: /404");
    expect(fallbackDocument).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(sitemap).not.toContain("isth/frag/minda");
    expect(sitemap).not.toContain("/404");
  });

  it("publishes only the intended indexable canonical URLs in the XML sitemap", () => {
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toEqual(INDEXABLE_SEO_PAGES.map((page) => `${SEO_ORIGIN}${page.canonicalPath}`));
  });

  it("emits Organization, WebSite, WebPage and breadcrumbs without invalid Product commerce claims", () => {
    INDEXABLE_SEO_PAGES.forEach((page) => {
      const document = JSON.parse(stringifyStructuredData(page)) as { "@graph": Array<{ "@type": string; name?: string; url?: string; logo?: string; sameAs?: string[] }> };
      const types = document["@graph"].map((node) => node["@type"]);
      expect(types).toContain("Organization");
      expect(types).toContain("WebSite");
      expect(types.some((type) => type === "WebPage" || type === "AboutPage")).toBe(true);
      if (page.id === "product" || page.id === "guide") expect(types).toContain("BreadcrumbList");
      expect(JSON.stringify(document)).not.toContain('"@type":"Product"');
      expect(JSON.stringify(document)).not.toMatch(/"price"|"ratingValue"|"availability"|"review"/i);
      const organizations = document["@graph"].filter((node) => node["@type"] === "Organization");
      expect(organizations).toHaveLength(1);
      expect(organizations[0]).toMatchObject({
        name: "ISTH",
        url: "https://isth.in/",
        logo: "https://isth.in/assets/isth-logo-20261026.svg",
        sameAs: ["https://www.instagram.com/isth.in/"],
      });
    });

    const collection = getStructuredData(SEO_PAGES.home);
    const serializedCollection = JSON.stringify(collection);
    expect(serializedCollection).toContain('"CollectionPage"');
    expect(serializedCollection).toContain('"ItemList"');
    expect(serializedCollection).not.toContain('"@type":"Product"');
  });

  it("renders product details and WhatsApp ordering links without inventing prices or ratings", () => {
    const product = defaultProducts[0];
    const page = getSeoPage(getProductPagePath(product));
    const body = renderStaticNoscript(page);
    expect(body).toContain(`<h1>${product.name}</h1>`);
    expect(body).toContain(product.description);
    expect(body).toContain(product.notes);
    expect(body).toContain("https://wa.me/917859898490");
    expect(body).not.toMatch(/₹|rating|review|price|in stock/i);
    const guide = renderStaticNoscript(SEO_PAGES.guide);
    expect(guide).toContain("First Love lists aqua, lavender, and citrus");
    expect(guide).not.toContain("Éclat Courinné");
    expect(body).toContain('href="/home/"');
  });

  it("uses only present local product image assets and keeps the desktop collection hero preload", () => {
    defaultProducts.forEach((product) => {
      const image = getProductImageFallback(product);
      if (image?.startsWith("/assets/")) {
        expect(existsSync(new URL(`../../public${image}`, import.meta.url))).toBe(true);
      }
    });
    expect(manifest.name).toBe("isth Fragrance");
    expect(manifest.start_url).toBe("/");
    expect(manifest.theme_color).toBe("#5B0D18");
    expect(renderStaticSeoHead(SEO_PAGES.home)).toContain('rel="preload" as="image"');
    expect(renderStaticSeoHead(SEO_PAGES.home)).toContain('fetchpriority="high"');
  });
});
