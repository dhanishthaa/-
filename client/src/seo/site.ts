import { INSTAGRAM_URL } from "../data/brand";
import { defaultProducts } from "../data/products";

export const SEO_ORIGIN = "https://isth.in";
export const SEO_SITE_NAME = "ISTH";
export const SEO_LOCALE = "en_IN";
export const SEO_LOGO_PATH = "/assets/isth-logo-111_06bb811c.svg";
export const SEO_SOCIAL_IMAGE_PATH = "/assets/isth-editorial-about.webp";

export type SeoPageId = "landing" | "home" | "about" | "admin" | "not-found";

export type SeoPage = {
  id: SeoPageId;
  canonicalPath: string;
  title: string;
  description: string;
  robots: "index, follow" | "noindex, nofollow";
  indexable: boolean;
  socialImagePath: string;
};

export const SEO_PAGES: Record<SeoPageId, SeoPage> = {
  landing: {
    id: "landing",
    canonicalPath: "/",
    title: "ISTH Fragrance",
    description: "Discover ISTH fragrances. Explore our signature perfume collection.",
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
  admin: {
    id: "admin",
    canonicalPath: "/isth/frag/minda",
    title: "isth Fragrance",
    description: "Private isth administration.",
    robots: "noindex, nofollow",
    indexable: false,
    socialImagePath: SEO_SOCIAL_IMAGE_PATH,
  },
  "not-found": {
    id: "not-found",
    canonicalPath: "/404",
    title: "isth Fragrance",
    description: "The requested isth page could not be found.",
    robots: "noindex, nofollow",
    indexable: false,
    socialImagePath: SEO_SOCIAL_IMAGE_PATH,
  },
};

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
  if (normalized === "/isth/frag/minda") return SEO_PAGES.admin;
  return SEO_PAGES["not-found"];
}

export function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SEO_ORIGIN}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] || character);
}

function collectionItemSchema() {
  return defaultProducts.map((product) => ({
    "@type": "Thing",
    name: product.name,
    description: product.description,
  }));
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

  const pageNode = {
    "@type": page.id === "about" ? "AboutPage" : "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SEO_ORIGIN}/#website` },
    about: { "@id": `${SEO_ORIGIN}/#organization` },
    primaryImageOfPage: toAbsoluteUrl(page.socialImagePath),
  };

  const graph: Record<string, unknown>[] = [organization, webSite, pageNode];
  if (page.id === "home") {
    graph.push({
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      url: pageUrl,
      name: "isth fragrance collection",
      description: "A considered collection of modern isth fragrance compositions.",
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

  return { "@context": "https://schema.org", "@graph": graph };
}

export function stringifyStructuredData(page: SeoPage) {
  return JSON.stringify(getStructuredData(page)).replace(/</g, "\\u003c");
}

export function renderStaticSeoHead(page: SeoPage) {
  const canonicalUrl = toAbsoluteUrl(page.canonicalPath);
  const imageUrl = toAbsoluteUrl(page.socialImagePath);
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);

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
    `<meta property="og:image:alt" content="${escapeHtml(`${SEO_SITE_NAME} fragrance editorial image`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `<script id="isth-static-structured-data" type="application/ld+json">${stringifyStructuredData(page)}</script>`,
  ].join("\n    ");
}

export function renderStaticNoscript(page: SeoPage) {
  const aboutCopy = "isth is a lifestyle fragrance house built upon quiet moments, tactile memories, and the tension between what you recognise and what you cannot quite name.";
  const collection = defaultProducts.map((product) => `<li><article><h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.description)}</p><p>${escapeHtml(product.notes)}</p></article></li>`).join("");

  if (page.id === "home") {
    return `<main><h1>isth fragrance collection</h1><p>Explore modern fragrance signatures from isth.</p><ul>${collection}</ul><p><a href="/about/">About isth</a></p></main>`;
  }
  if (page.id === "about") {
    return `<main><h1>About isth</h1><p>${escapeHtml(aboutCopy)}</p><p><a href="/home/">Explore the isth fragrance collection</a></p></main>`;
  }
  if (page.id === "landing") {
    return `<main><h1>isth Parfums</h1><p>Embrace the fragrance. Become isth.</p><p><a href="/home/">Explore the isth fragrance collection</a></p></main>`;
  }
  return `<main><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p><p><a href="/">Return to isth</a></p></main>`;
}

export const INDEXABLE_SEO_PAGES = [SEO_PAGES.landing, SEO_PAGES.home, SEO_PAGES.about] as const;
