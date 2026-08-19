import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INDEXABLE_SEO_PAGES, SEO_ORIGIN, SEO_PAGES, getStructuredData, renderStaticSeoHead, stringifyStructuredData } from "./site";

const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../../public/manifest.webmanifest", import.meta.url), "utf8")) as Record<string, unknown>;
const fallbackDocument = readFileSync(new URL("../../public/404.html", import.meta.url), "utf8");

describe("technical SEO", () => {
  it("gives each indexable public page a unique production-domain title, description, canonical, and index directive", () => {
    const titles = INDEXABLE_SEO_PAGES.map((page) => page.title);
    const descriptions = INDEXABLE_SEO_PAGES.map((page) => page.description);

    expect(new Set(titles).size).toBe(INDEXABLE_SEO_PAGES.length);
    expect(new Set(descriptions).size).toBe(INDEXABLE_SEO_PAGES.length);
    INDEXABLE_SEO_PAGES.forEach((page) => {
      const head = renderStaticSeoHead(page);
      expect(head).toContain(`<link rel="canonical" href="${SEO_ORIGIN}${page.canonicalPath}" />`);
      expect(head).toContain('<meta name="robots" content="index, follow" />');
      expect(head).toContain(`<meta property="og:url" content="${SEO_ORIGIN}${page.canonicalPath}" />`);
      expect(head).toContain('<meta name="twitter:card" content="summary_large_image" />');
    });
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

  it("publishes an XML sitemap containing only the intended indexable canonicals", () => {
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toEqual(INDEXABLE_SEO_PAGES.map((page) => `${SEO_ORIGIN}${page.canonicalPath}`));
  });

  it("emits valid, content-supported JSON-LD without commerce claims that are not present on the site", () => {
    INDEXABLE_SEO_PAGES.forEach((page) => {
      const document = JSON.parse(stringifyStructuredData(page)) as { "@graph": Array<{ "@type": string }> };
      const types = document["@graph"].map((node) => node["@type"]);
      expect(types).toContain("Organization");
      expect(types).toContain("WebSite");
      expect(types.some((type) => type === "WebPage" || type === "AboutPage")).toBe(true);
    });

    const collection = getStructuredData(SEO_PAGES.home);
    const serializedCollection = JSON.stringify(collection);
    expect(serializedCollection).toContain('"CollectionPage"');
    expect(serializedCollection).toContain('"ItemList"');
    expect(serializedCollection).not.toMatch(/"price"|"ratingValue"|"availability"|"review"/i);
  });

  it("publishes a branded manifest and a desktop LCP preload for the Home hero without changing page content", () => {
    expect(manifest.name).toBe("isth - Parfums");
    expect(manifest.start_url).toBe("/");
    expect(manifest.theme_color).toBe("#5B0D18");
    expect(renderStaticSeoHead(SEO_PAGES.home)).toContain('rel="preload" as="image"');
    expect(renderStaticSeoHead(SEO_PAGES.home)).toContain('fetchpriority="high"');
  });
});
