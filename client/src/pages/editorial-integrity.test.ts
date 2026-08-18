import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readProjectFile = (path: string) => readFileSync(path, "utf8");

describe("isth editorial page integrity", () => {
  it("keeps the Home page editorial scope and protected product section copy", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(home).toContain('className="site-shell editorial-home"');
    expect(home).toContain("Find your");
    expect(home).toContain("Not a perfume");
    expect(home).toContain("Coming soon");
    expect(home).toContain("Between the");
  });

  it("keeps the standalone About page routeable with its original editorial copy", () => {
    const about = readProjectFile("client/src/pages/About.tsx");

    expect(about).toContain('className="site-shell about-editorial');
    expect(about).toContain("Between the familiar");
    expect(about).toContain("Philosophy of the Scent");
    expect(about).toContain("Craft &amp; Composition");
    expect(about).toContain('href="/home#collection"');
    expect(about).toContain('window.scrollTo({ top: 0, left: 0, behavior: "auto" })');
  });

  it("keeps the mobile landing sequence on the desktop timing and clears its boot chrome", () => {
    const landing = readProjectFile("client/src/pages/Landing.tsx");
    const styles = readProjectFile("client/src/index.css");

    expect(landing).toContain("signatureTimer = window.setTimeout");
    expect(landing).toContain("}, 2420);");
    expect(landing).not.toContain("isPhone ? 4600 : 2420");
    expect(landing).toContain('setLandingChrome(false)');
    expect(landing).toContain('setBrowserThemeColor(active ? LANDING_EDGE : SITE_IVORY)');
    expect(styles).toContain(".ss1-landing.signature-complete .landing-curtain-surface { background:transparent; }");
    expect(styles).toContain(".about-feature-mark p { margin:0; color:#5B0D18;");
    expect(styles).toContain("text-shadow:none;");
  });

  it("contains a dedicated short-desktop hero composition for 1366×768 browser windows", () => {
    const styles = readProjectFile("client/src/index.css");

    expect(styles).toContain('@media (min-width:901px) and (max-height:760px)');
    expect(styles).toContain('.editorial-home .home-hero { height:100svh; min-height:0; }');
    expect(styles).toContain('.editorial-home .home-hero-image { background-position:center 20%; }');
    expect(styles).toContain('.signature-writing-mark { top:40%; width:min(390px,42vw); }');
  });

  it("uses a controlled shared dialog for reliable product details dismissal", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    const visual = readProjectFile("client/src/components/ProductBottleVisual.tsx");
    const styles = readProjectFile("client/src/index.css");
    const admin = readProjectFile("client/src/pages/Admin.tsx");

    expect(home).toContain('import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";');
    expect(home).toContain('<Dialog open={productDialogOpen} onOpenChange={(open) => { if (!open) closeProduct(); }}>');
    expect(home).toContain('<DialogContent forceMount className="product-dialog"');
    expect(home).toContain('<DialogClose className="dialog-close" aria-label="Close product details">');
    expect(home).toContain('<DialogTitle className="product-dialog-title">{selectedProduct.name}</DialogTitle>');
    expect(home).not.toContain('isth / {selectedProduct.collection}');
    expect(home).not.toContain('window.addEventListener("keydown", onKeyDown)');
    expect(visual).not.toContain('Image placeholder · editable in admin');
    expect(admin).toContain('label className="wide">Image URL<input');
    expect(styles).toContain("@keyframes product-dialog-in { from { opacity:0; scale:.975; }");
    expect(styles).toContain("@keyframes product-dialog-out");
    expect(styles).toContain(".bottle-placeholder { position:relative; width:100%; height:100%; display:grid; place-items:center; }");
    expect(styles).toContain("width:min(760px,calc(100% - 32px))");
    expect(styles).toContain("grid-template-columns:104px minmax(0,1fr)");
    expect(styles).toContain("align-items:baseline");
  });

  it("keeps Kawaii Marshmallow on the shared simple product-card visual path", () => {
    const products = readProjectFile("client/src/data/products.ts");
    const visual = readProjectFile("client/src/components/ProductBottleVisual.tsx");
    const styles = readProjectFile("client/src/index.css");

    expect(products).toContain('KAWAII_MARSHMALLOW_DESKTOP_IMAGE = "/manus-storage/isth-kawaii-marshmallow-campaign-v2_cf2e6424.jpg"');
    expect(products).toContain("export function normalizeProductMedia");
    expect(visual).toContain('className={`bottle-stage ${isKawaii ? "bottle-stage-kawaii" : ""} ${modal ? "bottle-stage-modal" : ""}`}');
    expect(visual).not.toContain("KAWAII_MARSHMALLOW_DESKTOP_IMAGE");
    expect(styles).not.toContain("@keyframes kawaii-reference-reveal");
    expect(styles).toContain(".bottle-stage-kawaii > img");
    expect(styles).toContain("object-fit:contain");
    expect(styles).toContain(".product-card.is-kawaii .product-visual { padding:clamp(12px,1.45vw,20px); background:#e5d0b6;");
    expect(styles).toContain(".product-card.is-kawaii .bottle-stage-kawaii { background:#f2e8da;");
    expect(styles).toContain(".dialog-product-media .bottle-stage-kawaii > img");
  });

  it("uses the shared simple product card for Kawaii without fabricated commerce claims", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(home).toContain('<ProductBottle product={product} onOpen={openProduct} />');
    expect(home).not.toContain("KawaiiProductCard");
    expect(home).not.toContain("rating");
    expect(home).not.toContain("₹");
  });

  it("keeps quote text above a pointer-and-touch image reveal", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const styles = readProjectFile("client/src/index.css");

    expect(home).toContain("onPointerDown={revealQuoteAt}");
    expect(home).toContain("onPointerMove={revealQuoteAt}");
    expect(home).toContain("onPointerLeave={fadeQuoteReveal}");
    expect(home).toContain("onPointerUp={fadeQuoteReveal}");
    expect(home).toContain("quote-reveal-prompt");
    expect(home).toContain('section.style.setProperty("--quote-reveal-x", `${point.renderedX}px`)');
    expect(home).toContain('section.style.setProperty("--quote-reveal-y", `${point.renderedY}px`)');
    expect(home).not.toContain('section.style.setProperty("--quote-reveal-x", `${point.renderedX}%`)');
    expect(styles).toContain("--quote-floral-mask:url(\"data:image/svg+xml");
    expect(styles).toContain("feTurbulence type='fractalNoise'");
    expect(styles).toContain("feDisplacementMap");
    expect(styles).toContain("radialGradient id='inkFade'");
    expect(styles).toContain("feGaussianBlur in='distorted' stdDeviation='3.8'");
    expect(styles).toContain("stop-opacity='0'");
    expect(styles).toContain("-webkit-mask-image:var(--quote-floral-mask)");
    expect(styles).not.toContain("clip-path:polygon(calc(var(--quote-reveal-x)");
    expect(styles).not.toContain("mask-image:radial-gradient");
    expect(styles).toContain(".quote-video-section.is-revealing .quote-video-backdrop");
    expect(styles).toContain(".quote-video-copy { position:relative; z-index:2;");
  });
});
