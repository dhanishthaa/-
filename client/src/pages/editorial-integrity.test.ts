import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readProjectFile = (path: string) => readFileSync(path, "utf8");

describe("isth editorial page integrity", () => {
  it("keeps the Home page editorial scope and protected product section copy", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(home).toContain('className="site-shell editorial-home"');
    expect(home).toContain('ref={editorialRootRef}');
    expect(home).toContain('className="collection-section editorial-motion-panel"');
    expect(home).toContain('className="quote-video-section editorial-motion-panel"');
    expect(home).toContain("Find your");
    expect(home).toContain('className="eyebrow catalog-label">More compositions');
    expect(home).not.toContain("The rest of the library opens in its own time.");
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
    expect(styles).toContain(".bottle-stage-kawaii { background:#ead7c1;");
    expect(styles).not.toContain(".product-card.is-kawaii .product-visual::after");
    expect(styles).not.toContain("border:clamp(16px,2vw,28px) solid #e1c8aa");
    expect(styles).toContain(".product-card.is-kawaii .product-visual { background:#eee9e2;");
    expect(styles).toContain(".product-card.is-kawaii .bottle-stage-kawaii { background:transparent;");
    expect(styles).toContain(".product-card.is-kawaii .bottle-stage-kawaii > img { padding:0; object-fit:contain;");
    expect(styles).not.toContain(".product-card.is-kawaii .bottle-stage-kawaii > img { padding:0; object-fit:cover;");
    expect(styles).not.toContain(".editorial-home .product-film");
    expect(styles).not.toContain(".editorial-home .product-spotlight");
    expect(readProjectFile("client/src/components/ProductBottle.tsx")).not.toContain('className="product-film"');
    expect(readProjectFile("client/src/components/ProductBottle.tsx")).not.toContain('className="product-spotlight"');
    const curtain = readProjectFile("client/src/components/KawaiiCinematicCurtain.tsx");
    expect(readProjectFile("client/src/components/ProductBottle.tsx")).toContain("<KawaiiCinematicCurtain />");
    expect(readProjectFile("client/src/pages/Home.tsx")).toContain('<KawaiiCinematicCurtain variant="dialog" />');
    expect(curtain).toContain("new IntersectionObserver");
    expect(curtain).toContain('prefers-reduced-motion: reduce');
    expect(curtain).toContain("isth-kawaii-curtain-contrast-v3_3611a666.jpg");
    expect(curtain).toContain("isth-kawaii-curtain-noir-v3_25aa8d0e.jpg");
    expect(curtain).toContain("duration: 2.75");
    expect(curtain).toContain('stagger: { each: 0.2, from: "center" }');
    expect(curtain).toContain('ease: "power2.inOut"');
    expect(curtain).not.toContain("kawaii-curtain-glint");
    expect(styles).toContain(".editorial-home .kawaii-curtain");
    expect(styles).toContain(".dialog-product-media .kawaii-curtain");
    expect(styles).not.toContain(".editorial-home .catalog-grid .product-visual::after");
    expect(styles).not.toContain(".editorial-home .product-card::after");
    expect(styles).not.toContain(".editorial-home .product-card-copy::before");
    expect(styles).not.toContain(".editorial-home .product-buy::after");
    expect(styles).not.toContain("filter:blur(13px)");
    expect(styles).toContain("@media (prefers-reduced-motion:reduce)");
    expect(styles).toContain(".dialog-product-media .bottle-stage-kawaii > img");
    expect(styles).not.toContain("kawaii-curtain-glint");
    expect(styles).toContain("will-change:transform");
  });

  it("uses the shared simple product card for Kawaii without fabricated commerce claims", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(home).toContain('<ProductBottle product={product} onOpen={openProduct} />');
    expect(home).not.toContain("KawaiiProductCard");
    expect(home).not.toContain("rating");
    expect(home).not.toContain("₹");
  });

  it("keeps the quote section in its normal static presentation", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const styles = readProjectFile("client/src/index.css");

    expect(home).toContain('<section className="quote-video-section editorial-motion-panel">');
    expect(home).not.toContain("quote-pointer-reveal");
    expect(home).not.toContain("revealQuoteAt");
    expect(home).not.toContain("quote-reveal-prompt");
    expect(styles).toContain(".quote-video-backdrop { position:absolute; inset:0; z-index:-2;");
    expect(styles).toContain(".quote-video-copy h2 span { white-space:nowrap; }");
    expect(styles).toContain(".quote-video-copy h2 { font-size:clamp(28px,8.8vw,42px);");
    expect(styles).not.toContain("--quote-floral-mask");
    expect(styles).not.toContain(".quote-video-section.is-revealing");
    expect(styles).toContain(".quote-video-copy { position:relative; z-index:2;");
    expect(styles).not.toContain(".editorial-home .quote-video-section::before");
    expect(styles).not.toContain(".editorial-home .quote-video-copy::before");
  });

  it("keeps the preview-only whole-site editorial enhancements across public routes and mobile navigation", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const about = readProjectFile("client/src/pages/About.tsx");
    const landing = readProjectFile("client/src/pages/Landing.tsx");
    const product = readProjectFile("client/src/components/ProductBottle.tsx");
    const styles = readProjectFile("client/src/index.css");

    expect(home).toContain('import gsap from "gsap";');
    expect(home).toContain('gsap.registerPlugin(ScrollTrigger);');
    expect(home).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
    expect(home).toContain('window.matchMedia("(pointer: coarse)")');
    expect(home).toContain('className="nakshatra-section editorial-motion-panel"');
    expect(home).toContain('className="story-section editorial-motion-panel"');
    expect(home).toContain('className="contact-section editorial-motion-panel"');
    expect(home).toContain('const [navFolded, setNavFolded] = useState(false);');
    expect(home).toContain('Math.abs(delta) >= 10');
    expect(home).toContain('${navFolded ? "is-folded" : ""}');
    expect(home).toContain('className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}');
    expect(product).not.toContain('className="product-film"');
    expect(product).not.toContain('className="product-spotlight"');
    expect(about).toContain('className="site-shell about-editorial');
    expect(about).toContain('const [navFolded, setNavFolded] = useState(false);');
    expect(about).toContain('${navFolded ? "is-folded" : ""}');
    expect(landing).toContain('className={`landing-page ss1-landing');
    expect(styles).toContain(".editorial-home .desktop-nav a::after");
    expect(styles).not.toContain(".editorial-home .collection-editorial-photo::after");
    expect(styles).not.toContain(".editorial-home .quote-video-section::before");
    expect(styles).not.toContain(".editorial-home .site-footer::before");
    expect(styles).not.toContain(".about-editorial .about-masthead::after");
    expect(styles).not.toContain(".editorial-home .section-heading::after");
    expect(styles).not.toContain(".editorial-home .nakshatra-inner::before");
    expect(styles).toContain(".editorial-home .catalog-heading .catalog-label::before { content:none;");
    expect(styles).not.toContain(".editorial-home .story-copy::after");
    expect(styles).not.toContain(".editorial-home .contact-section::before");
    expect(styles).not.toContain(".about-editorial .about-quote-card::before");
    expect(styles).toContain(".ss1-landing.signature-complete { background:linear-gradient");
    expect(styles).toContain(".site-nav.is-folded { transform:translate3d(0,calc(-100% - 10px),0) scaleY(.96);");
    expect(styles).toContain("transform .92s cubic-bezier(.16,1,.3,1)");
    expect(styles).not.toContain(".editorial-home .home-hero-content::before");
    expect(styles).not.toContain(".editorial-home .intro-strip::before");
    expect(styles).not.toContain(".editorial-home .intro-copy::before");
    expect(styles).toContain('.text-link[href^="mailto:"] { text-transform:lowercase; }');
    expect(styles).toContain(".contact-section .eyebrow::before { content:none; }");
    expect(styles).toContain("@media (min-width:621px) and (max-width:900px)");
    expect(styles).toContain(".site-nav .desktop-nav { display:flex; }");
    expect(styles).toContain(".site-nav .menu-toggle { display:none; }");
  });
});
