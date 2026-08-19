import { useEffect } from "react";
import { useLocation } from "wouter";
import { getSeoPage, stringifyStructuredData, toAbsoluteUrl } from "@/seo/site";

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(canonicalUrl: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = canonicalUrl;
}

export default function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const page = getSeoPage(location);
    const canonicalUrl = toAbsoluteUrl(page.canonicalPath);
    const imageUrl = toAbsoluteUrl(page.socialImagePath);

    document.documentElement.lang = "en";
    document.title = page.title;
    setMeta('meta[name="description"]', "name", "description", page.description);
    setMeta('meta[name="robots"]', "name", "robots", page.robots);
    setCanonical(canonicalUrl);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", "isth");
    setMeta('meta[property="og:locale"]', "property", "og:locale", "en_IN");
    setMeta('meta[property="og:title"]', "property", "og:title", page.title);
    setMeta('meta[property="og:description"]', "property", "og:description", page.description);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", "isth Parfums editorial image");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", page.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", page.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);

    let jsonLd = document.head.querySelector<HTMLScriptElement>("#isth-runtime-structured-data");
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.id = "isth-runtime-structured-data";
      jsonLd.type = "application/ld+json";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = stringifyStructuredData(page);
  }, [location]);

  return null;
}
