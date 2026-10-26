import { getProductWhatsAppUrl, INSTAGRAM_URL } from "../data/brand";
import { defaultProducts, findProductByRouteSlug, getProductImageFallback, getProductRouteSlug, type Product } from "../data/products";

export const SEO_ORIGIN = "https://isth.in";
export const SEO_SITE_NAME = "ISTH";
export const SEO_LOCALE = "en_IN";
export const SEO_LOGO_PATH = "/assets/isth-logo-20261026.svg";
export const SEO_SOCIAL_IMAGE_PATH = "/assets/isth-editorial-about.webp";
export const GUIDE_CANONICAL_PATH = "/guides/choosing-a-fragrance/";

export type SeoPageId = "landing" | "home" | "about" | "guide" | "product" | "admin" | "not-found";

export type SeoPage = {
  id: SeoPageId;
  canonicalPath: string;
  title: string;
  description: string;
  robots: "index, follow" | "noindex, follow" | "noindex, nofollow";
  indexable: boolean;
  socialImagePath: string;
  socialImageAlt?: string;
  productId?: string;
  productSlug?: string;
  productName?: string;
  productDescription?: string;
  productImagePath?: string;
};

export const SEO_PAGES: Record<Exclude<SeoPageId, "product">, SeoPage> = {
  landing: {
    id: "landing",
    canonicalPath: "/",
    title: "ISTH Perfumes & Fragrances | Official Website",
    description: "Discover ISTH perfumes and fragrances. Embrace the fragrance. Become isth.",
    robots: "index, follow",
    indexable: true,
    socialImagePath: SEO_SOCIAL_IMAGE_PATH,
  },
  home: {
    id: "home",
    canonicalPath: "/home/",
    title: "ISTH Perfume Collection | ISTH Fragrance",
    description: "Explore the ISTH perfume collection: modern fragrance compositions shaped by intimate notes, quiet rituals, and personal presence.",
    robots: "index, follow",
    indexable: true,
    socialImagePath: SEO_SOCIAL_IMAGE_PATH,
  },
  about: {
    id: "about",
    canonicalPath: "/about/",
    title: "About ISTH | Fragrance House",
    description: "Discover ISTH, a Gujarat fragrance house composing modern signatures around quiet moments, tactile memory, and evolving personal scent.",
    robots: "index, follow",
    indexable: true,
    socialImagePath: "/assets/isth-editorial-about.webp",
  },
  guide: {
    id: "guide",
    canonicalPath: GUIDE_CANONICAL_PATH,
    title: "How to Choose a Perfume | ISTH Fragrance Guide",
    description: "Compare the listed notes and descriptions in the ISTH perfume collection, then ask about a fragrance through the existing WhatsApp ordering flow.",
    robots: "index, follow",
    indexable: true,
    socialImagePath: SEO_SOCIAL_IMAGE_PATH,
  },
  admin: {
    id: "admin",
    canonicalPath: "/isth/frag/minda",
    title: "ISTH Fragrance Administration",
    description: "Private ISTH administration.",
    robots: "noindex, nofollow",
    indexable: false,
    socialImagePath: SEO_SOCIAL_IMAGE_PATH,
  },
  "not-found": {
    id: "not-found",
    canonicalPath: "/404",
    title: "ISTH Fragrance",
    description: "The requested ISTH page could not be found.",
    robots: "noindex, nofollow",
    indexable: false,
    socialImagePath: SEO_SOCIAL_IMAGE_PATH,
  },
};

export function getProductPagePath(productOrId: Pick<Product, "id" | "name"> | string) {
  const product = typeof productOrId === "string" ? { id: productOrId, name: productOrId } : productOrId;
  return `/products/${getProductRouteSlug(product)}/`;
}

function truncateDescription(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const shortened = normalized.slice(0, maxLength - 1);
  const finalWordBoundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, finalWordBoundary > 0 ? finalWordBoundary : maxLength - 1).trimEnd()}…`;
}

export function getProductSeoPage(product: Product): SeoPage {
  const productImagePath = getProductImageFallback(product);
  const productSlug = getProductRouteSlug(product);
  const title = `${product.name} Perfume | ISTH Fragrances`;
  const description = truncateDescription(`Discover ${product.name} perfume by ISTH. ${product.description} Ask about ordering on WhatsApp.`, 160);
  return {
    id: "product",
    productId: product.id,
    productSlug,
    productName: product.name,
    productDescription: product.description,
    productImagePath,
    canonicalPath: getProductPagePath(product),
    title,
    description,
    robots: "index, follow",
    indexable: true,
    socialImagePath: productImagePath ?? SEO_SOCIAL_IMAGE_PATH,
    socialImageAlt: productImagePath ? `${product.name} perfume bottle by ISTH` : "ISTH fragrance collection image",
  };
}

function normalizePathname(pathname: string) {
  const path = pathname.split("?")[0]?.split("#")[0] || "/";
  const normalized = path.replace(/\/{2,}/g, "/").replace(/\/$/, "");
  return normalized || "/";
}

export function getSeoPage(pathname: string): SeoPage {
  const normalized = normalizePathname(pathname);
  if (normalized === "/") return SEO_PAGES.landing;
  if (normalized === "/home") return SEO_PAGES.home;
  if (normalized === "/about") return SEO_PAGES.about;
  if (normalized === "/guides/choosing-a-fragrance") return SEO_PAGES.guide;
  if (normalized === "/isth/frag/minda") return SEO_PAGES.admin;
  const productMatch = normalized.match(/^\/products\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (productMatch) {
    const product = findProductByRouteSlug(productMatch[1]);
    if (product) {
      const page = getProductSeoPage(product);
      return productMatch[1] === page.productSlug ? page : { ...page, robots: "noindex, follow", indexable: false };
    }
  }
  return SEO_PAGES["not-found"];
}

export function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SEO_ORIGIN}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" })[character] || character);
}

function collectionItemSchema() {
  return defaultProducts.map((product) => ({
    "@type": "Thing",
    name: product.name,
    description: product.description,
  }));
}

function getBreadcrumbSchema(page: SeoPage) {
  const crumbs = [
    { name: "ISTH", url: toAbsoluteUrl("/") },
    { name: "Perfume collection", url: toAbsoluteUrl(SEO_PAGES.home.canonicalPath) },
  ];
  if (page.id === "guide") crumbs.push({ name: "Choosing a fragrance", url: toAbsoluteUrl(page.canonicalPath) });
  else if (page.id === "product") crumbs.push({ name: page.productName ?? "Fragrance", url: toAbsoluteUrl(page.canonicalPath) });
  return {
    "@type": "BreadcrumbList",
    "@id": `${toAbsoluteUrl(page.canonicalPath)}#breadcrumbs`,
    itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: crumb.url })),
  };
}

export function getStructuredData(page: SeoPage) {
  const pageUrl = toAbsoluteUrl(page.canonicalPath);
  const organization = {
    "@type": "Organization",
    "@id": `${SEO_ORIGIN}/#organization`,
    name: SEO_SITE_NAME,
    url: `${SEO_ORIGIN}/`,
    logo: toAbsoluteUrl(SEO_LOGO_PATH),
    email: "isth.support@gmail.com",
    sameAs: [INSTAGRAM_URL],
    address: {
      "@type": "PostalAddress",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
  };

  const webSite = {
    "@type": "WebSite",
    "@id": `${SEO_ORIGIN}/#website`,
    name: SEO_SITE_NAME,
    url: `${SEO_ORIGIN}/`,
    inLanguage: "en-IN",
    publisher: { "@id": `${SEO_ORIGIN}/#organization` },
  };

  const pageNode: Record<string, unknown> = {
    "@type": page.id === "about" ? "AboutPage" : "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SEO_ORIGIN}/#website` },
    about: page.id === "product"
      ? { "@type": "Thing", name: page.productName, description: page.productDescription }
      : { "@id": `${SEO_ORIGIN}/#organization` },
    primaryImageOfPage: toAbsoluteUrl(page.socialImagePath),
  };

  const graph: Record<string, unknown>[] = [organization, webSite, pageNode];
  if (page.id === "home") {
    graph.push({
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      url: pageUrl,
      name: "ISTH perfume collection",
      description: "A considered collection of modern ISTH fragrance compositions.",
      isPartOf: { "@id": `${pageUrl}#webpage` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: defaultProducts.length,
        itemListElement: collectionItemSchema().map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item,
        })),
      },
    });
  }
  if (page.id === "product" || page.id === "guide") graph.push(getBreadcrumbSchema(page));
  return { "@context": "https://schema.org", "@graph": graph };
}

export function stringifyStructuredData(page: SeoPage) {
  return JSON.stringify(getStructuredData(page)).replace(/</g, "\\u003c");
}

export const PRODUCT_ROUTE_ALIASES = defaultProducts
  .map((product) => ({ aliasSlug: product.id, canonicalPath: getProductPagePath(product), productName: product.name }))
  .filter((alias) => alias.aliasSlug !== alias.canonicalPath.split("/").filter(Boolean).pop());

export function renderStaticProductRedirect(targetPath: string, productName: string) {
  const canonical = escapeHtml(toAbsoluteUrl(targetPath));
  const safeTargetPath = escapeHtml(targetPath);
  const title = escapeHtml(`${productName} Perfume | ISTH Fragrances`);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="robots" content="noindex, follow" /><link rel="canonical" href="${canonical}" /><meta http-equiv="refresh" content="0; url=${safeTargetPath}" /><title>${title}</title><script>window.location.replace(${JSON.stringify(targetPath)});</script></head><body><p>This ISTH fragrance page has moved. <a href="${safeTargetPath}">Open ${escapeHtml(productName)}</a>.</p></body></html>`;
}

export function renderStaticSeoHead(page: SeoPage) {
  const canonicalUrl = toAbsoluteUrl(page.canonicalPath);
  const imageUrl = toAbsoluteUrl(page.socialImagePath);
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const imageAlt = escapeHtml(page.socialImageAlt ?? `${SEO_SITE_NAME} fragrance editorial image`);

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${page.robots}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    ...(page.id === "home" ? [`<link rel="preload" as="image" href="${toAbsoluteUrl(SEO_SOCIAL_IMAGE_PATH)}" fetchpriority="high" media="(min-width: 641px)" />`] : []),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SEO_SITE_NAME}" />`,
    `<meta property="og:locale" content="${SEO_LOCALE}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `<script id="isth-static-structured-data" type="application/ld+json">${stringifyStructuredData(page)}</script>`,
  ].join("\n    ");
}

function renderProductStaticNoscript(page: SeoPage) {
  const product = defaultProducts.find((candidate) => candidate.id === page.productId);
  if (!product) return `<main><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p></main>`;
  const imageMarkup = page.productImagePath
    ? `<img src="${escapeHtml(toAbsoluteUrl(page.productImagePath))}" alt="${escapeHtml(`${product.name} perfume bottle by ISTH`)}" />`
    : `<p role="img" aria-label="No product photograph is published for ${escapeHtml(product.name)}">Product photograph not available.</p>`;
  const whatsappUrl = getProductWhatsAppUrl(product.name);
  return `<main><nav aria-label="Breadcrumb"><a href="/">ISTH</a> / <a href="${SEO_PAGES.home.canonicalPath}">Perfume collection</a> / <span>${escapeHtml(product.name)}</span></nav><article><p>ISTH ${escapeHtml(product.collection)} fragrance</p><h1>${escapeHtml(product.name)}</h1>${imageMarkup}<p>${escapeHtml(product.description)}</p><h2>Listed fragrance notes</h2><p>${escapeHtml(product.notes)}</p><p>Ask ISTH on WhatsApp for current ordering details.</p><p><a href="${whatsappUrl}">Ask about ${escapeHtml(product.name)} on WhatsApp</a></p><p><a href="${SEO_PAGES.home.canonicalPath}">Return to the ISTH perfume collection</a></p></article></main>`;
}

function renderGuideStaticNoscript() {
  const rows = defaultProducts.map((product) => `<tr><th scope="row"><a href="${getProductPagePath(product)}">${escapeHtml(product.name)}</a></th><td>${escapeHtml(product.notes)}</td><td>${escapeHtml(product.description)}</td></tr>`).join("");
  return `<main><nav aria-label="Breadcrumb"><a href="/">ISTH</a> / <a href="${SEO_PAGES.home.canonicalPath}">Perfume collection</a> / <span>Choosing a fragrance</span></nav><article><h1>How to choose a perfume: a guide to ISTH fragrance notes</h1><p>This guide compares only the names, notes, and descriptions currently published in the ISTH collection. It is not a ranking, and it makes no claims about ratings, wear time, or which fragrance is best for everyone.</p><h2>Start with the notes you recognize</h2><p>Choose a few listed notes that appeal to you, then compare the full combinations. For example, Kawaii Marshmallow lists marshmallow, vanilla chocolate, and musk; First Love lists aqua, lavender, and citrus; Fiery Soul lists rum, kesar, and oud. These are the published note descriptions, not a top/middle/base breakdown.</p><h2>Read the composition description</h2><p>Use each product description to understand the character ISTH gives that composition. Compare the wording and the complete note list rather than assuming that one shared ingredient makes two fragrances the same.</p><h2>Compare the current collection</h2><table><thead><tr><th>ISTH fragrance</th><th>Listed notes</th><th>Published description</th></tr></thead><tbody>${rows}</tbody></table><h2>Ask before ordering</h2><p>Prices, sizes, and availability are not published in this catalog. Contact ISTH through the existing WhatsApp ordering link to ask for current details before placing an order.</p><p><a href="${SEO_PAGES.home.canonicalPath}">Browse the ISTH perfume collection</a></p></article></main>`;
}

export function renderStaticNoscript(page: SeoPage) {
  const aboutCopy = "ISTH is a lifestyle fragrance house built upon quiet moments, tactile memories, and the tension between what you recognise and what you cannot quite name.";
  const collection = defaultProducts.map((product) => `<li><article><h2><a href="${getProductPagePath(product)}">${escapeHtml(product.name)}</a></h2><p>${escapeHtml(product.description)}</p><p>${escapeHtml(product.notes)}</p></article></li>`).join("");

  if (page.id === "home") {
    return `<main><h1>ISTH perfume collection</h1><p>Explore modern fragrance signatures from ISTH and view each fragrance by its published notes.</p><ul>${collection}</ul><p><a href="${GUIDE_CANONICAL_PATH}">How to choose a perfume</a></p><p><a href="/about/">About ISTH</a></p></main>`;
  }
  if (page.id === "about") {
    return `<main><h1>About ISTH</h1><p>${escapeHtml(aboutCopy)}</p><p><a href="/home/">Explore the ISTH perfume collection</a></p></main>`;
  }
  if (page.id === "landing") {
    return `<main><h1>ISTH perfumes and fragrances</h1><p>Embrace the fragrance. Become isth.</p><p><a href="/home/">Explore the ISTH perfume collection</a></p></main>`;
  }
  if (page.id === "product") return renderProductStaticNoscript(page);
  if (page.id === "guide") return renderGuideStaticNoscript();
  return `<main><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p><p><a href="/">Return to ISTH</a></p></main>`;
}

export const PRODUCT_SEO_PAGES = defaultProducts.map(getProductSeoPage);
export const INDEXABLE_SEO_PAGES = [SEO_PAGES.landing, SEO_PAGES.home, SEO_PAGES.about, SEO_PAGES.guide, ...PRODUCT_SEO_PAGES] as const;
