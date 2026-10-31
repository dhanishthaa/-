import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readProjectFile = (path: string) => readFileSync(path, "utf8");

describe("isth editorial page integrity", () => {
  it("keeps the Home page editorial scope while removing the intro strip and adding collection breathing room", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const styles = readProjectFile("client/src/index.css");

    expect(home).toContain('className="site-shell editorial-home"');
    expect(home).toContain('ref={editorialRootRef}');
    expect(home).toContain('className="collection-section"');
    expect(home).not.toContain('className="collection-section editorial-motion-panel"');
    expect(home).not.toContain('className="intro-strip"');
    expect(home).not.toContain("For the moment");
    expect(home).not.toContain("A considered collection of ten fragrances for the rituals, rooms, and people that make a day feel like your own.");
    expect(styles).toContain('.editorial-home .collection-section { position:relative; padding-top:clamp(48px,6vw,88px); background:#fff; }');
    expect(home).toContain('className="quote-video-section editorial-motion-panel"');
    expect(home).toContain("Find your");
    expect(home).toContain('className="eyebrow catalog-label">THE COLLECTION');
    expect(home).not.toContain("The rest of the library opens in its own time.");
    expect(home).toContain("Not a perfume");
    expect(home).toContain("<Atelier />");
    expect(home).not.toContain("Between the");
    expect(home).toContain('content("home-hero-tagline"');
    expect(home).not.toContain('className="nakshatra-section editorial-motion-panel"');
    expect(home).not.toContain("<em>Become isth.</em>");
    expect(home).not.toContain("A scent can");
    expect(home).not.toContain("change the air.");
    expect(home).not.toContain("isth composes modern signatures from notes that stay close, then open slowly.");
    expect(home).not.toContain('src="/assets/isth-after-hero-story.png"');
    expect(home).toContain('className="after-hero-reference"');
    expect(home).toContain('id="house-story-title">Made for<br />the<br />stories on skin.</h2>');
    expect(home).toContain('/assets/isth-private-language.webp');
    expect(home).toContain('/assets/isth-editorial-about.webp" alt="A hand beside a perfume bottle');
    expect(styles).toContain('.after-hero-reference { position:relative; display:grid;');
    expect(styles).toContain('background:#afa17d;');
    expect(styles).toContain('.after-hero-story-frame { width:100%; overflow:hidden; border:0 !important;');
  });

  it("moves the screenshot story into paired, border-free Atelier carousel items", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const atelier = readProjectFile("client/src/components/Atelier.tsx");
    const media = readProjectFile("client/src/lib/supabase.ts");
    const admin = readProjectFile("client/src/components/AdminAtelier.tsx");
    const styles = readProjectFile("client/src/atelier-editor.css");

    expect(home).not.toContain('className="story-section editorial-motion-panel"');
    expect(home).not.toContain("story-note-grid");
    expect(home).toContain("<Atelier />");
    expect(media).toContain("/assets/isth-editorial-about.webp");
    expect(media).toContain("Between the familiar");
    expect(atelier).toContain("fetchPublicAtelier()");
    expect(atelier).toContain("ATELIER_AUTOPLAY_INTERVAL_MS = 5000");
    expect(atelier).toContain("srcSet={activeItem.smallUrl}");
    expect(atelier).toContain("sanitizeRichText(activeItem.description)");
    expect(atelier).not.toContain("PhotographIndex");
    expect(atelier).not.toContain("AtelierSlideNavigation");
    expect(atelier).not.toContain("Previous Atelier image");
    expect(atelier).not.toContain("Next Atelier image");
    expect(atelier).not.toContain("CraftPhilosophy");
    expect(media).toContain("In our atelier, we compose slowly.");
    expect(atelier).toContain("setActiveIndex((current) => (current + 1) % items.length)");
    expect(styles).toContain(".AtelierMediaStage");
    expect(styles).toContain("border:0 !important");
    expect(styles).not.toContain(".AtelierSlideNavigation");
    expect(admin).toContain("Photo caption");
    expect(admin).toContain("RichTextField value={item.description}");
  });

  it("recovers once from a stale cached dynamic-import chunk", () => {
    const boundary = readProjectFile("client/src/components/ErrorBoundary.tsx");

    expect(boundary).toContain("Failed to fetch dynamically imported module");
    expect(boundary).toContain("isth:chunk-recovery-attempted");
    expect(boundary).toContain("__isth_chunk_recovery");
    expect(boundary).toContain("window.location.replace");
  });

  it("keeps the community CTAs below the contact section and linked to official social destinations", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const styles = readProjectFile("client/src/index.css");
    const brand = readProjectFile("client/src/data/brand.ts");

    expect(home).toContain("Follow Our Journey");
    expect(home).toContain("Join Our Circle");
    expect(brand).toContain('export const INSTAGRAM_URL = "https://www.instagram.com/isth.in/";');
    expect(home).toContain("href={INSTAGRAM_URL}");
    expect(home).toContain('aria-label="Follow ISTH on Instagram"');
    expect(home).toContain('className="footer-instagram"');
    expect(home).toContain("https://chat.whatsapp.com/GpVg3lY8eppEks5yo3C04e");
    expect(home).toContain("/assets/instagram-icon.png");
    expect(home).toContain("/assets/whatsapp-icon.png");
    expect(home).not.toContain('className="hero-social-rows"');
    expect(home).toContain('className="contact-social-rows"');
    expect(home).toContain('className="contact-social-button"');
    expect(styles).toContain(".contact-social-button { display:inline-flex");
    expect(styles).toContain("background:transparent");
  });

  it("uses the Instagram icon and short label across site footers", () => {
    const pages = [
      readProjectFile("client/src/pages/Home.tsx"),
      readProjectFile("client/src/pages/About.tsx"),
      readProjectFile("client/src/pages/ProductDetail.tsx"),
      readProjectFile("client/src/pages/ChoosingAFragrance.tsx"),
    ];

    for (const page of pages) {
      expect(page).toContain('className="footer-instagram"');
      expect(page).toContain('aria-label="Instagram"');
      expect(page).toContain('/assets/instagram-icon.png');
      expect(page).toContain("Instagram</a>");
      expect(page).not.toContain("ISTH on Instagram</a>");
    }
  });

  it("keeps the standalone About page routeable with its original editorial copy", () => {
    const about = readProjectFile("client/src/pages/About.tsx");

    expect(about).toContain('className="site-shell about-editorial');
    expect(about).toContain("Between the familiar");
    expect(about).toContain("Philosophy of the Scent");
    expect(about).toContain("Craft &amp; Composition");
    expect(about).toContain('href="/home#collection"');
    expect(about).toContain('className="contact-lockup about-lockup" aria-label="isth Parfums"');
    expect(about).not.toContain('The House of isth');
    expect(about).toContain('window.scrollTo({ top: 0, left: 0, behavior: "auto" })');
  });

  it("uses the supplied complete landing page with the original SVG handwriting animation", () => {
    const landing = readProjectFile("client/src/pages/ZipLanding.tsx");
    const styles = readProjectFile("client/src/zip-landing.css");

    expect(landing).toContain('className="zip-landing"');
    expect(landing).toContain('className="hero-photo-image"');
    expect(landing).toContain("IsthSignature");
    expect(landing).toContain("signature-outline");
    expect(landing).toContain("href=\"/home\"");
    expect(landing).not.toContain("lottie");
    expect(styles).toContain(".zip-landing .hero");
    expect(styles).toContain("zip-trace-signature");
    expect(styles).toContain("zip-mark-dock");
    expect(styles).toContain("background-image: url('/assets/hibiscus.jpg')");
  });

  it("keeps the Figma collection CTA semantic, local, and routeable", () => {
    const landing = readProjectFile("client/src/pages/ZipLanding.tsx");
    const styles = readProjectFile("client/src/zip-landing.css");

    expect(landing).toContain('className="primary-cta"');
    expect(landing).toContain('href="/home"');
    expect(landing).toContain("Explore the collection");
    expect(landing).not.toContain("placehold.com");
    expect(styles).toContain(".zip-landing .primary-cta {");
    expect(readProjectFile("client/public/isth-boot.css")).toContain("background: #080808;");
    expect(readProjectFile("client/index.html")).toContain('<script src="/isth-route-bootstrap.js"></script>');
  });

  it("contains a dedicated short-desktop hero composition for 1366×768 browser windows", () => {
    const styles = readProjectFile("client/src/index.css");

    expect(styles).toContain('@media (min-width:901px) and (max-height:760px)');
    expect(styles).toContain('.editorial-home .home-hero { height:100svh; min-height:0; }');
    expect(styles).toContain('.editorial-home .home-hero-image { background-position:center 20%; }');
    expect(styles).toContain("background-image:url('/assets/isth-hero-editorial_ed190768.png') !important");
    expect(styles).not.toContain('isth-hero-editorial-mobile-v1_00d0cab2.jpg');
    expect(styles).toContain('.editorial-home .home-hero-content { position:absolute; }');
    expect(styles).toContain('.editorial-home .home-hero-content { top:auto; left:clamp(64px,9vw,122px);');
    expect(styles).toContain('@media (min-width:901px) and (max-height:820px)');
    expect(styles).toContain('.editorial-home .home-hero-content { top:auto; bottom:clamp(144px,20vh,174px); max-width:620px; }');
    expect(styles).toContain('@media (min-width:1200px) and (min-height:821px)');
    expect(styles).toContain('.editorial-home .home-hero-content { max-width:760px; bottom:clamp(72px,9vh,96px); }');
    expect(styles).toContain('.editorial-home .home-hero h1 { max-width:720px;');
    expect(styles).toContain('top:clamp(112px,17vh,178px)');
    expect(styles).toContain('.editorial-home .hero-description { margin:clamp(32px,3.2vw,40px) 0 clamp(22px,2.6vw,34px); }');
    expect(styles).toContain('.signature-writing-mark { top:40%; width:min(390px,42vw); }');
  });

  it("uses a controlled shared dialog for reliable product details dismissal", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    const visual = readProjectFile("client/src/components/ProductBottleVisual.tsx");
    const styles = readProjectFile("client/src/index.css");
    const admin = readProjectFile("client/src/pages/Admin.tsx");

    expect(home).toContain('import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";');
    expect(home).toContain('<Dialog open={productDialogOpen} onOpenChange={(open) => { if (!open) closeProduct(); }}>');
    expect(home).toContain('className={`product-dialog product-dialog--${selectedProduct.id}`}');
    expect(home).toContain('overlayClassName={`product-dialog-overlay product-dialog-overlay--${selectedProduct.id}`}');
    expect(home).toContain('<DialogClose className="dialog-close" aria-label="Close product details">');
    expect(home).toContain('<DialogTitle className="product-dialog-title">{selectedProduct.name}</DialogTitle>');
    expect(home).not.toContain('isth / {selectedProduct.collection}');
    expect(home).not.toContain('window.addEventListener("keydown", onKeyDown)');
    expect(visual).not.toContain('Image placeholder · editable in admin');
    expect(admin).toContain('label className="wide">Primary image URL<input');
    expect(styles).toContain("@keyframes product-dialog-in { from { opacity:0; scale:.975; }");
    expect(styles).toContain("@keyframes product-dialog-out");
    expect(styles).toContain(".bottle-placeholder { position:relative; width:100%; height:100%; display:grid; place-items:center; }");
    expect(styles).toContain("width:min(760px,calc(100vw - 32px))");
    expect(styles).toContain("grid-template-columns:104px minmax(0,1fr)");
    expect(styles).toContain("align-items:baseline");
  });

  it("keeps Kawaii Marshmallow on the shared simple product-card visual path", () => {
    const products = readProjectFile("client/src/data/products.ts");
    const visual = readProjectFile("client/src/components/ProductBottleVisual.tsx");
    const styles = readProjectFile("client/src/index.css");

    expect(products).toContain('"kawaii-marshmallow": "/assets/kawaiimarshmallow.png"');
    expect(products).toContain('"first-love": "/assets/firstlove.png"');
    expect(products).toContain('"cashmere-oud": "/assets/cashmereoud.png"');
    expect(products).toContain('LOCAL_PRODUCT_IMAGE_FALLBACKS[slugifyProductName(product.name ?? "")]');
    expect(products).toContain('product.image.startsWith("/manus-storage/")');
    expect(products).toContain("export function normalizeProductMedia");
    expect(visual).toContain('className={`bottle-stage ${modal ? "bottle-stage-modal" : ""} ${visibleImage ? "has-image" : "is-empty"}`}');
    expect(visual).toContain("const fallback = getProductImageFallback(product);");
    expect(visual).toContain("const productImage = imageMedia?.url || fallback;");
    expect(visual).toContain("getProductImageFallback");
    expect(visual).not.toContain("bottle-placeholder");
    expect(products).toContain("return { ...product, image: product.image || fallback, media: normalizedMedia };");
    expect(visual).toContain("product.media?.find");
    expect(visual).toContain('objectFit: "contain"');
    const card = readProjectFile("client/src/components/ProductBottle.tsx");
    expect(card).not.toContain("product-open");
    expect(card).not.toContain("ArrowUpRight");
    expect(styles).not.toContain("@keyframes kawaii-reference-reveal");
    expect(styles).toContain(".bottle-stage-kawaii > img");
    expect(styles).toContain("object-fit:contain");
    expect(styles).toContain(".bottle-stage-kawaii { background:#ead7c1;");
    expect(styles).not.toContain(".product-card.is-kawaii .product-visual::after");
    expect(styles).not.toContain("border:clamp(16px,2vw,28px) solid #e1c8aa");
    expect(styles).toContain(".product-card.is-kawaii .product-visual { background:transparent;");
    expect(styles).toContain(".editorial-home .product-visual { overflow:hidden; background:transparent !important; border:0 !important;");
    expect(styles).toContain(".product-visual { position:relative; overflow:hidden; aspect-ratio:4/5;");
    expect(styles).toContain(".catalog-grid .product-visual { aspect-ratio:1/1.2;");
    expect(styles).not.toContain(".editorial-home .product-visual { aspect-ratio:5/6;");
    expect(styles).toContain(".editorial-home .product-visual .bottle-stage.is-empty { background:transparent !important;");
    expect(styles).toContain(".product-card.is-kawaii .bottle-stage-kawaii { background:transparent;");
    expect(styles).toContain(".product-card.is-kawaii .bottle-stage-kawaii > img { padding:0; object-fit:contain;");
    expect(styles).not.toContain(".product-card.is-kawaii .bottle-stage-kawaii > img { padding:0; object-fit:cover;");
    expect(styles).not.toContain(".editorial-home .product-film");
    expect(styles).not.toContain(".editorial-home .product-spotlight");
    expect(readProjectFile("client/src/components/ProductBottle.tsx")).not.toContain('className="product-film"');
    expect(readProjectFile("client/src/components/ProductBottle.tsx")).not.toContain('className="product-spotlight"');
    expect(readProjectFile("client/src/components/ProductBottle.tsx")).not.toContain("KawaiiCinematicCurtain");
    expect(readProjectFile("client/src/pages/Home.tsx")).not.toContain("KawaiiCinematicCurtain");
    expect(styles).not.toContain("kawaii-curtain");
    expect(styles).not.toContain("kawaii-cinematic");
    expect(styles).not.toContain(".editorial-home .catalog-grid .product-visual::after");
    expect(styles).not.toContain(".editorial-home .product-card::after");
    expect(styles).not.toContain(".editorial-home .product-card-copy::before");
    expect(styles).not.toContain(".editorial-home .product-buy::after");
    expect(styles).not.toContain("filter:blur(13px)");
    expect(styles).toContain("@media (prefers-reduced-motion:reduce)");
    expect(styles).toContain(".dialog-product-media .bottle-stage-kawaii > img");
    expect(styles).toContain("overflow-x:hidden");
    expect(styles).toContain(".dialog-product-media .bottle-stage-kawaii > img { padding:0; object-fit:cover;");
    expect(styles).toContain("@media (max-width:720px)");
    expect(styles).toContain(".product-dialog-overlay { --dialog-base:var(--ink);");
    expect(styles).toContain(".product-dialog-overlay--kawaii-marshmallow,.product-dialog-overlay--eclat-courinne");
    expect(styles).toContain(".product-dialog-overlay--lesprit-epice");
    expect(styles).toContain("@keyframes dialog-wave-one");
    expect(styles).toContain("@keyframes dialog-frost-drift");
    expect(styles).toContain(".product-dialog--kawaii-marshmallow .product-dialog-title");
    expect(styles).toContain("background:rgba(245,241,235,.12) !important;");
    expect(styles).toContain("backdrop-filter:blur(128px) saturate(150%) contrast(108%) brightness(.90)");
    expect(styles).toContain(".product-dialog-overlay--kawaii-marshmallow::after,.product-dialog-overlay--eclat-courinne::after { opacity:.44; mix-blend-mode:soft-light; }");
  });

  it("keeps the shared isth Parfums lock-up and mobile quote refinement aligned across pages", () => {
    const styles = readProjectFile("client/src/index.css");

    expect(styles).toContain("--parfums-tracking:0");
    expect(styles).toContain("letter-spacing:var(--parfums-tracking)");
    expect(styles).toContain(".editorial-home .catalog-heading .catalog-label { gap:0; font-size:clamp(12px,1.1vw,15px);");
    expect(styles).toContain(".editorial-home .quote-video-copy .cherry-button { margin-top:clamp(16px,4vw,28px);");
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
    expect(styles).toContain(".quote-video-copy h2 { font:400 clamp(20px,5.6vw,26px)/1.12 var(--serif); }");
    expect(styles).not.toContain("--quote-floral-mask");
    expect(styles).not.toContain(".quote-video-section.is-revealing");
    expect(styles).toContain(".quote-video-copy { position:absolute; left:clamp(20px,9vw,140px); right:clamp(20px,9vw,140px); bottom:clamp(36px,6vw,86px); z-index:2;");
    expect(styles).not.toContain(".editorial-home .quote-video-section::before");
    expect(styles).not.toContain(".editorial-home .quote-video-copy::before");
  });

  it("keeps the preview-only whole-site editorial enhancements across public routes and mobile navigation", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const about = readProjectFile("client/src/pages/About.tsx");
    const landing = readProjectFile("client/src/pages/ZipLanding.tsx");
    const product = readProjectFile("client/src/components/ProductBottle.tsx");
    const productDetail = readProjectFile("client/src/pages/ProductDetail.tsx");
    const fragranceGuide = readProjectFile("client/src/pages/ChoosingAFragrance.tsx");
    const navbarHook = readProjectFile("client/src/hooks/useAutoHideNavbar.ts");
    const styles = readProjectFile("client/src/index.css");

    expect(home).toContain('import gsap from "gsap";');
    expect(home).toContain('gsap.registerPlugin(ScrollTrigger);');
    expect(home).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
    expect(home).toContain('window.matchMedia("(pointer: coarse)")');
    expect(home).toContain('import Atelier from "@/components/Atelier";');
    expect(home).toContain('<Atelier />');
    expect(home).not.toContain('className="story-section editorial-motion-panel"');
    expect(home).toContain('className="contact-section editorial-motion-panel"');
    expect(home).toContain('className="contact-lockup" aria-label="isth Parfums"');
    expect(home).toContain('<span>Parfums</span>');
    expect(home).not.toContain('<p className="eyebrow">Queries</p>');
    expect(home).toContain('useAutoHideNavbar(menuOpen, 20)');
    expect(home).toContain('${navFolded ? "is-folded" : ""}');
    expect(home).toContain('className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}');
    expect(product).not.toContain('className="product-film"');
    expect(product).not.toContain('className="product-spotlight"');
    expect(about).toContain('className="site-shell about-editorial');
    expect(about).toContain('useAutoHideNavbar(menuOpen, 40)');
    expect(about).toContain('${navFolded ? "is-folded" : ""}');
    expect(productDetail).toContain('useAutoHideNavbar()');
    expect(productDetail).toContain('${navFolded ? "is-folded" : ""}');
    expect(fragranceGuide).toContain('useAutoHideNavbar()');
    expect(fragranceGuide).toContain('${navFolded ? "is-folded" : ""}');
    expect(navbarHook).toContain('const DIRECTION_THRESHOLD = 12;');
    expect(navbarHook).toContain('setNavFolded(nextDirection > 0);');
    expect(navbarHook).toContain('prefers-reduced-motion: reduce');
    expect(landing).toContain('className="zip-landing"');
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
    expect(readProjectFile("client/src/zip-landing.css")).toContain(".zip-landing .hero-copy h1");
    expect(styles).toContain(".site-nav.is-folded { transform:translate3d(0,calc(-100% - 10px),0) scaleY(.96);");
    expect(styles).toContain("transform .92s cubic-bezier(.16,1,.3,1)");
    expect(styles).toContain(".site-nav .site-brand,.site-nav.is-scrolled .site-brand { padding-inline:0; }");
    expect(styles).not.toContain(".editorial-home .home-hero-content::before");
    expect(styles).not.toContain(".editorial-home .intro-strip::before");
    expect(styles).not.toContain(".editorial-home .intro-copy::before");
    expect(styles).toContain('.text-link[href^="mailto:"] { text-transform:lowercase; }');
    expect(styles).toContain(".contact-section .eyebrow::before { content:none; }");
    expect(styles).toContain('font-family:var(--serif)');
    expect(styles).toContain('font-size:128px');
    expect(styles).toContain("font-family:'Gilroy',var(--sans);");
    expect(styles).toContain('font-weight:700');
    expect(styles).toContain('.contact-lockup { --parfums-tracking:0;');
    expect(styles).toContain('.contact-lockup::after { display:none; }');
    expect(styles).toContain('text-shadow:none; transform:none;');
    expect(styles).not.toContain('@keyframes contact-lockup-float');
    expect(styles).not.toContain('transform:translateZ(10px)');
    expect(styles).toContain('.about-editorial .about-lockup');
    expect(styles).toContain('.about-editorial .about-lockup { justify-content:flex-start;');
    expect(styles).toContain('background:linear-gradient(110deg,rgba(91,13,24,.13),rgba(245,241,235,.88) 34%,rgba(181,154,98,.10))');
    expect(styles).toContain('padding:clamp(70px,7vw,106px)');
    expect(styles).toContain('padding:clamp(22px,2.5vw,34px) 0 clamp(28px,4vw,52px)');
    expect(styles).toContain('.about-editorial .about-lockup { justify-content:flex-start; min-height:0; margin:0; }');
    expect(styles).toContain('.about-masthead-copy { display:flex; flex-direction:column; align-items:flex-start; gap:clamp(24px,2.2vw,34px); }');
    expect(styles).toContain("@media (min-width:621px) and (max-width:900px)");
    expect(styles).toContain(".site-nav .desktop-nav { display:flex; }");
    expect(styles).toContain(".site-nav .menu-toggle { display:none; }");
  });

  it("keeps the Home initial viewport readable without dimming the hero image", () => {
    const styles = readProjectFile("client/src/index.css");

    expect(styles).toContain(".editorial-home .site-nav:not(.is-scrolled)");
    expect(styles).toContain("background:#000");
    expect(styles).toContain("filter:invert(1) brightness(1.12) !important");
    expect(styles).toContain(".editorial-home .home-hero-image,");
    expect(styles).toContain("filter:none !important;");
    expect(styles).toContain(".editorial-home .home-hero-overlay { background:transparent !important;");
    expect(styles).toContain(".editorial-home .mobile-drawer { overflow-y:auto;");
  });

  it("keeps the navbar and hero in normal flow without changing CTA geometry", () => {
    const styles = readProjectFile("client/src/index.css");

    expect(styles).toContain(".editorial-home .site-nav {\n  position:sticky;\n  top:0;\n  inset:auto;");
    expect(styles).toContain(".editorial-home .home-hero {\n  display:flex;");
    expect(styles).toContain(".editorial-home .hero-cta-row { grid-template-columns:124px auto; width:min(520px,100%); }");
    expect(styles).toContain(".editorial-home .hero-social-row { grid-template-columns:124px auto; gap:20px; }");
    expect(styles).toContain("background:#000");
    expect(styles).not.toContain("background:rgba(17,17,17,.42)");
  });
});
