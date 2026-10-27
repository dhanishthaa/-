// Quiet Atelier style reminder: the storefront is an asymmetric editorial sequence, not a generic product grid.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, Menu, MessageCircle, MoveUpRight, X } from "lucide-react";
import { Link } from "wouter";
import Reveal from "@/components/Reveal";
import ProductBottle from "@/components/ProductBottle";
import ProductGallery from "@/components/ProductGallery";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { defaultProducts, type Product } from "@/data/products";
import { DEFAULT_HERO_CAROUSEL, fetchPublicHeroCarousel, fetchRemoteProducts, type HeroCarouselSettings } from "@/lib/supabase";
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_TEXT, INSTAGRAM_URL, readLogoUrl } from "@/data/brand";
import { useAutoHideNavbar } from "@/hooks/useAutoHideNavbar";

const whatsappNumber = DEFAULT_WHATSAPP_NUMBER;
const whatsappText = DEFAULT_WHATSAPP_TEXT;

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled, navFolded } = useAutoHideNavbar(menuOpen, 20);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [heroCarousel, setHeroCarousel] = useState<HeroCarouselSettings>(DEFAULT_HERO_CAROUSEL);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPreviousIndex, setHeroPreviousIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const heroTouchStart = useRef<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const editorialRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRemoteProducts().then((remote) => { if (remote?.length) setProducts(remote); });
    fetchPublicHeroCarousel().then((remote) => { if (remote) { setHeroCarousel(remote); setHeroIndex(0); setHeroPreviousIndex(0); } });
  }, []);

  const advanceHero = (direction: 1 | -1) => {
    const slideCount = Math.max(heroCarousel.desktop.length, heroCarousel.mobile.length, 1);
    if (slideCount < 2) return;
    setHeroPreviousIndex(heroIndex);
    setHeroIndex((current) => (current + direction + slideCount) % slideCount);
  };

  useEffect(() => {
    if (heroPaused || Math.max(heroCarousel.desktop.length, heroCarousel.mobile.length) < 2) return;
    const timer = window.setInterval(() => advanceHero(1), heroCarousel.interval);
    return () => window.clearInterval(timer);
  }, [heroCarousel.desktop.length, heroCarousel.mobile.length, heroCarousel.interval, heroPaused, heroIndex]);

  const desktopHeroSlides = heroCarousel.desktop.length ? heroCarousel.desktop : DEFAULT_HERO_CAROUSEL.desktop;
  const mobileHeroSlides = heroCarousel.mobile.length ? heroCarousel.mobile : desktopHeroSlides;
  const currentDesktopHero = desktopHeroSlides[heroIndex % desktopHeroSlides.length] ?? desktopHeroSlides[0];
  const previousDesktopHero = desktopHeroSlides[heroPreviousIndex % desktopHeroSlides.length] ?? currentDesktopHero;
  const currentMobileHero = mobileHeroSlides[heroIndex % mobileHeroSlides.length] ?? mobileHeroSlides[0];
  const previousMobileHero = mobileHeroSlides[heroPreviousIndex % mobileHeroSlides.length] ?? currentMobileHero;
  const pauseHeroForPointer = () => { if (window.matchMedia("(pointer:fine)").matches) setHeroPaused(true); };
  const resumeHeroForPointer = () => { if (window.matchMedia("(pointer:fine)").matches) setHeroPaused(false); };

  useLayoutEffect(() => {
    const root = editorialRootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) return;

    const context = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });
      heroTimeline
        .from(".home-hero .hero-identity", { autoAlpha: 0, y: 22, duration: 0.72 })
        .from(".home-hero h1", { autoAlpha: 0, y: 26, duration: 0.82 }, "-=0.46")
        .from(".home-hero .hero-description, .home-hero .hero-cta-row", { autoAlpha: 0, y: 14, duration: 0.64, stagger: 0.1 }, "-=0.42");

      const heroImage = root.querySelector(".home-hero-image");
      if (heroImage) {
        gsap.to(heroImage, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: ".home-hero", start: "top top", end: "bottom top", scrub: 0.65 },
        });
      }


      gsap.utils.toArray<HTMLElement>(".editorial-motion-panel").forEach((panel) => {
        gsap.from(panel, {
          y: 34,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: panel, start: "top 82%", once: true },
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  const visibleProducts = products;
  const featured = useMemo(() => visibleProducts.filter((product) => product.featured).slice(0, 2), [visibleProducts]);
  const more = useMemo(() => visibleProducts.filter((product) => !product.featured), [visibleProducts]);

  const openProduct = (product: Product) => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setSelectedProduct(product);
    setProductDialogOpen(true);
  };

  const closeProduct = () => {
    setProductDialogOpen(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    const closingId = selectedProduct?.id;
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedProduct((current) => current?.id === closingId ? null : current);
      closeTimerRef.current = null;
    }, 260);
  };

  return <div ref={editorialRootRef} className="site-shell editorial-home">
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""} ${navFolded ? "is-folded" : ""}`}>
      <Link href="/home" className="site-brand"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><Link href="/about">About</Link><a href="#collection">Collection</a><a href="#contact">Contact</a></nav>
      <div className="site-actions"><button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
    </header>
    <div className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}><nav><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link><a href="#collection" onClick={() => setMenuOpen(false)}>Collection</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></nav></div>

    <main>
      <section className="home-hero" onMouseEnter={pauseHeroForPointer} onMouseLeave={resumeHeroForPointer} onTouchStart={(event) => { heroTouchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = heroTouchStart.current; heroTouchStart.current = null; const end = event.changedTouches[0]?.clientX ?? start; if (start !== null && end !== null && Math.abs(end - start) > 42) advanceHero(end < start ? 1 : -1); }}>
        <div className="home-hero-image-stack" aria-hidden="true"><picture key={`previous-${previousDesktopHero.id}-${heroPreviousIndex}`} className="home-hero-image-layer home-hero-image-layer--previous"><source media="(max-width: 900px)" srcSet={previousMobileHero.url} /><img src={previousDesktopHero.url} alt="" loading="lazy" style={{ objectPosition: `${previousDesktopHero.focalX}% ${previousDesktopHero.focalY}%` }} /></picture><picture key={`current-${currentDesktopHero.id}-${heroIndex}`} className="home-hero-image-layer home-hero-image-layer--current"><source media="(max-width: 900px)" srcSet={currentMobileHero.url} /><img src={currentDesktopHero.url} alt="" fetchPriority="high" style={{ objectPosition: `${currentDesktopHero.focalX}% ${currentDesktopHero.focalY}%` }} /></picture></div><div className="home-hero-flower" aria-hidden="true" /><div className="home-hero-overlay" aria-hidden="true" />
        <div className="home-hero-content"><div className="hero-identity"><img src={readLogoUrl()} alt="isth" /></div><h1 className="hero-tagline"><span className="hero-tagline-line">Embrace the fragrance.</span><br /><span>Become isth.</span></h1><div className="hero-cta-row"><a className="cherry-button hero-whatsapp" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Queries</a><a className="outline-button" href="#collection">Explore the Collection <ArrowDown size={14} /></a></div></div>
        <div className="hero-caption" aria-hidden="true" />
      </section>

      <section id="collection" className="collection-section"><div className="section-heading"><Reveal><h2>Find your<br /><em>signature.</em></h2></Reveal><Reveal delay={80}><p>Each isth composition is made to be worn close. Browse by feeling, not by family.</p></Reveal></div>
        <Reveal className="collection-editorial-photo" delay={100}><div aria-hidden="true" /></Reveal>
        <div className="featured-grid">{featured.map((product, index) => <Reveal key={product.id} delay={index * 80}><ProductBottle product={product} onOpen={openProduct} /></Reveal>)}<Reveal delay={150} className="collection-note"><div className="note-card"><h3>Not a perfume<br /><em>for everyone.</em></h3><p>It is a signature for the person who found it.</p><a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank">Ask the house <MoveUpRight size={14} /></a></div></Reveal></div>
        <div className="catalog-heading"><div><p className="eyebrow catalog-label">THE COLLECTION</p></div></div>
        <div className="catalog-grid">{more.map((product, index) => <Reveal key={product.id} delay={(index % 3) * 60}><ProductBottle product={product} compact onOpen={openProduct} /></Reveal>)}</div>
      </section>

      <section className="quote-video-section editorial-motion-panel"><div className="quote-video-backdrop" aria-hidden="true" /><div className="quote-video-copy"><h2><span>Life is not just about,</span><span>living &amp; surviving.</span><span>It's about feeling it,</span><span>enjoying it, &amp; making memories.</span></h2><a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Queries</a></div></section>

      <section id="nakshatra" className="nakshatra-section editorial-motion-panel"><div className="nakshatra-texture" aria-hidden="true" /><div className="nakshatra-inner"><h2><span className="nakshatra-title-main">NAKSHATRA</span><span className="nakshatra-title-script">Collection.</span></h2><p>A new premium segment is taking shape. Ten new compositions, arriving when the night is right.</p><span className="coming-soon">Coming soon <span>—</span> isth</span></div></section>

      <section id="about" className="story-section editorial-motion-panel"><div className="story-image" aria-hidden="true" style={{ backgroundImage: "url('/assets/isth-editorial-about.webp')", backgroundSize: "cover", backgroundPosition: "center" }} /><div className="story-flower" aria-hidden="true" /><Reveal className="story-copy"><h2>Between the<br /><em>familiar &amp; unknown.</em></h2><p>isth is a lifestyle fragrance house built around the tension between what you recognise and what you cannot quite name. Familiar ingredients, given room to become something else.</p><div className="story-note-grid" aria-label="Perfume ingredient imagery"><div className="story-note-photo note-rose"><span>Rose</span></div><div className="story-note-photo note-amber"><span>Amber</span></div><div className="story-note-photo note-musk"><span>White musk</span></div></div><a className="text-link" href="mailto:isth.support@gmail.com">Write to the house <ArrowRight size={14} /></a></Reveal></section>

      <section id="contact" className="contact-section editorial-motion-panel"><div className="contact-lockup" aria-label="isth Parfums"><img src={readLogoUrl()} alt="isth" /><span>Parfums</span></div><div className="contact-content"><div><h2>Come a little<br /><em>closer.</em></h2></div><div className="contact-details"><p>For product details, stockist enquiries, or simply to find the note that fits, speak with us directly.</p><a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Queries</a><a className="text-link" href="mailto:isth.support@gmail.com">isth.support@gmail.com <MoveUpRight size={13} /></a></div></div><div className="contact-social-rows" aria-label="Follow isth online"><div className="contact-social-row"><span>Follow Our Journey</span><a className="contact-social-button" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Follow ISTH on Instagram"><img src="/assets/instagram-icon.png" alt="" aria-hidden="true" /> <span>Explore</span></a></div><div className="contact-social-row"><span>Join Our Circle</span><a className="contact-social-button" href="https://chat.whatsapp.com/GpVg3lY8eppEks5yo3C04e" target="_blank" rel="noreferrer" aria-label="Enter the isth WhatsApp community"><img src="/assets/whatsapp-icon.png" alt="" aria-hidden="true" /> <span>Enter</span></a></div></div></section>
    </main>
    <Dialog open={productDialogOpen} onOpenChange={(open) => { if (!open) closeProduct(); }}>
      {selectedProduct && <DialogContent forceMount className={`product-dialog product-dialog--${selectedProduct.id}`} overlayClassName={`product-dialog-overlay product-dialog-overlay--${selectedProduct.id}`} style={{ "--dialog-product-tone": selectedProduct.color } as CSSProperties} showCloseButton={false} aria-label={`${selectedProduct.name} details`}>
        <DialogClose className="dialog-close" aria-label="Close product details"><X size={19} strokeWidth={1.4} /><span className="sr-only">Close product details</span></DialogClose>
          <div className="product-dialog-layout">
          <div className="dialog-product-media">
            <ProductGallery product={selectedProduct} />
          </div>
          <div className="product-dialog-copy">
            <DialogTitle className="product-dialog-title">{selectedProduct.name}</DialogTitle>
            <div className="dialog-specs">
              <div><span>Notes</span><p className="dialog-notes">{selectedProduct.notes}</p></div>
              <div><span>Composition</span><p className="dialog-description">{selectedProduct.description}</p></div>
            </div>
            <a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello isth, I am interested in purchasing ${selectedProduct.name}.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Ask about this scent</a>
          </div>
        </div>
      </DialogContent>}
    </Dialog>
    <footer className="site-footer"><div className="footer-top"><div><a href="/home" className="footer-brand"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></a><p>estd. 2021</p></div><div className="footer-links"><div><span>Explore</span><Link href="/about">About</Link><a href="#collection">The Collection</a><Link href="/guides/choosing-a-fragrance/">Choosing a fragrance</Link><a href="#nakshatra">Nakshatra Collection</a></div><div><span>Direct</span><a href="mailto:isth.support@gmail.com">Email</a><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a><a className="footer-instagram" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Follow ISTH on Instagram"><img src="/assets/instagram-icon.png" alt="" aria-hidden="true" width={16} height={16} />ISTH on Instagram</a></div></div></div><div className="footer-bottom"><span>© 2026 isth Fragrance House</span><span>Gujarat, India / Mon–Sat, 10am–7pm IST</span><span>Privacy · Terms</span></div></footer>
  </div>;
}
