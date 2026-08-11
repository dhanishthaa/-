// Quiet Atelier style reminder: the storefront is an asymmetric editorial sequence, not a generic product grid.
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Menu, MessageCircle, MoveUpRight, X } from "lucide-react";
import { Link } from "wouter";
import Reveal from "@/components/Reveal";
import ProductBottle from "@/components/ProductBottle";
import { defaultProducts, readLocalProducts, type Product } from "@/data/products";
import { fetchRemoteProducts } from "@/lib/supabase";
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_TEXT, INSTAGRAM_URL, readLogoUrl, readVideoUrl } from "@/data/brand";

const whatsappNumber = DEFAULT_WHATSAPP_NUMBER;
const whatsappText = DEFAULT_WHATSAPP_TEXT;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [videoUrl, setVideoUrl] = useState("");
  const [navImageIndex, setNavImageIndex] = useState(0);
  const navImages = [
    "/manus-storage/isth-nav-flower-01_80fea5d9.png",
    "/manus-storage/isth-nav-flower-02_e89ec82a.png",
    "/manus-storage/isth-nav-flower-03_1c9cafd0.png",
    "/manus-storage/isth-ingredients-editorial_4fe9c8a1.png",
  ];

  useEffect(() => {
    setProducts(readLocalProducts());
    setVideoUrl(readVideoUrl());
    fetchRemoteProducts().then((remote) => { if (remote?.length) setProducts(remote); });
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNavImageIndex((index) => (index + 1) % navImages.length), 4200);
    return () => window.clearInterval(timer);
  }, [navImages.length]);

  const featured = useMemo(() => products.filter((product) => product.featured).slice(0, 2), [products]);
  const more = useMemo(() => products.filter((product) => !product.featured), [products]);

  return <div className="site-shell">
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/home" className="site-brand"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#collection">Collection</a><a href="#about">About</a><a href="#contact">Queries</a></nav>
      <div className="nav-image-rotator" aria-label="isth editorial imagery"><img key={navImages[navImageIndex]} src={navImages[navImageIndex]} alt="" /></div>
      <div className="site-actions"><a className="action-link" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /><span>Enquire</span></a><button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
    </header>
    <div className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}><nav><a href="#collection" onClick={() => setMenuOpen(false)}>Collection</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#contact" onClick={() => setMenuOpen(false)}>Queries</a></nav></div>

    <main>
      <section className="home-hero">
        <div className="home-hero-image" aria-hidden="true" /><div className="home-hero-flower" aria-hidden="true" /><div className="home-hero-overlay" aria-hidden="true" />
        <div className="home-hero-content"><div className="hero-identity"><img src={readLogoUrl()} alt="isth" /></div><p className="eyebrow light">Fine fragrance house</p><h1>A scent can<br /><em>change the air.</em></h1><p className="hero-description">isth composes modern signatures from notes that stay close, then open slowly.</p><div className="hero-cta-row"><a className="cherry-button hero-whatsapp" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp the house</a><a className="outline-button" href="#collection">Explore the Collection <ArrowDown size={14} /></a></div></div>
        <div className="hero-caption"><span>Composed in India</span><span>Scroll to compose</span></div>
      </section>

      <section className="intro-strip"><Reveal><p className="eyebrow">A quieter kind of presence</p><h2>For the moment<br /><em>that stays.</em></h2></Reveal><Reveal delay={100}><p className="intro-copy">A considered collection of ten fragrances for the rituals, rooms, and people that make a day feel like your own.</p></Reveal></section>
      <section id="collection" className="collection-section"><div className="section-heading"><Reveal><h2>Find your<br /><em>signature.</em></h2></Reveal><Reveal delay={80}><p>Each isth composition is made to be worn close. Browse by feeling, not by family.</p></Reveal></div>
        <div className="featured-grid">{featured.map((product, index) => <Reveal key={product.id} delay={index * 80}><ProductBottle product={product} /></Reveal>)}<Reveal delay={150} className="collection-note"><div className="note-card"><h3>Not a perfume<br /><em>for everyone.</em></h3><p>It is a signature for the person who found it.</p><a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer">Ask the house <MoveUpRight size={14} /></a></div></Reveal></div>
        <div className="catalog-heading"><div><p className="eyebrow">More compositions</p></div><p className="catalog-note">The rest of the library opens in its own time.</p></div>
        <div className="catalog-grid">{more.map((product, index) => <Reveal key={product.id} delay={(index % 3) * 60}><ProductBottle product={product} compact /></Reveal>)}</div>
      </section>

      <section className="quote-video-section"><div className="quote-video-backdrop" aria-hidden="true">{videoUrl ? <video src={videoUrl} autoPlay muted loop playsInline /> : null}</div><div className="quote-video-copy"><p className="eyebrow light">The isth point of view</p><h2><span>Embrace the fragrance.</span><span>Become isth.</span></h2><a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Ask for your scent</a></div></section>

      <section className="nakshatra-section"><div className="nakshatra-texture" aria-hidden="true" /><div className="nakshatra-inner"><span className="eyebrow light">The next constellation</span><h2>NAKSHATRA<br /><em>collection.</em></h2><p>A new premium segment is taking shape. Ten new compositions, arriving when the night is right.</p><span className="coming-soon">Coming soon <span>—</span> isth</span></div></section>

      <section id="about" className="story-section"><div className="story-image" aria-hidden="true"><div className="story-image-placeholder"><span>About isth</span><small>Ingredients / atmosphere / ritual</small></div></div><div className="story-flower" aria-hidden="true" /><Reveal className="story-copy"><p className="eyebrow">About isth</p><h2>Between the<br /><em>familiar &amp; unknown.</em></h2><p>isth is a lifestyle fragrance house built around the tension between what you recognise and what you cannot quite name. Familiar ingredients, given room to become something else.</p><div className="story-note-grid" aria-label="Perfume ingredient imagery"><div className="story-note-photo note-rose"><span>Rose</span></div><div className="story-note-photo note-amber"><span>Amber</span></div><div className="story-note-photo note-musk"><span>White musk</span></div></div><a className="text-link" href="mailto:isth.support@gmail.com">Write to the house <ArrowRight size={14} /></a></Reveal></section>

      <section id="contact" className="contact-section"><div><p className="eyebrow">Queries</p><h2>Come a little<br /><em>closer.</em></h2></div><div className="contact-details"><p>For product details, stockist enquiries, or simply to find the note that fits, speak with us directly.</p><a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp the house</a><a className="text-link" href="mailto:isth.support@gmail.com">isth.support@gmail.com <MoveUpRight size={13} /></a></div></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><div><a href="/home" className="footer-brand"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></a><p>estd. 2021</p></div><div className="footer-links"><div><span>Explore</span><a href="#collection">Collection</a><a href="#about">About</a><a href="#contact">Queries</a></div><div><span>Direct</span><a href="mailto:isth.support@gmail.com">Email</a><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a></div></div></div><div className="footer-bottom"><span>© 2026 isth Fragrance House</span><span>Gujarat, India / Mon–Sat, 10am–7pm IST</span><span>Privacy · Terms</span></div></footer>
  </div>;
}
