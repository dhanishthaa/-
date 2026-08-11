// Quiet Atelier style reminder: the storefront is an asymmetric editorial sequence, not a generic product grid.
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Menu, MessageCircle, MoveUpRight, X } from "lucide-react";
import { Link } from "wouter";
import Reveal from "@/components/Reveal";
import ProductBottle from "@/components/ProductBottle";
import { defaultProducts, readLocalProducts, type Product } from "@/data/products";
import { fetchRemoteProducts } from "@/lib/supabase";

const whatsappNumber = "917859898490";
const whatsappText = "Hi, can I please get more details on your product?";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  useEffect(() => {
    setProducts(readLocalProducts());
    fetchRemoteProducts().then((remote) => { if (remote?.length) setProducts(remote); });
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featured = useMemo(() => products.filter((product) => product.featured).slice(0, 2), [products]);
  const more = useMemo(() => products.filter((product) => !product.featured), [products]);

  return <div className="site-shell">
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/home" className="site-brand"><span className="brand-symbol" /> <span>ISTH</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#collection">Collection</a><a href="#story">The house</a><a href="#contact">Contact</a></nav>
      <div className="site-actions"><a className="action-link" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /><span>Enquire</span></a><button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
    </header>
    <div className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}><nav><a href="#collection" onClick={() => setMenuOpen(false)}>Collection</a><a href="#story" onClick={() => setMenuOpen(false)}>The house</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a><Link href="/admin">Admin room</Link></nav><span>ISTH / 2026</span></div>

    <main>
      <section className="home-hero">
        <div className="home-hero-image" aria-hidden="true" /><div className="home-hero-overlay" aria-hidden="true" />
        <div className="home-hero-content"><p className="eyebrow light">Fine fragrance house / 01</p><h1>A scent can<br /><em>change the air.</em></h1><p className="hero-description">ISTH composes modern signatures from notes that stay close, then open slowly.</p><a className="outline-button" href="#collection">Explore the scents <ArrowDown size={14} /></a></div>
        <div className="hero-caption"><span>Collection no. 01</span><span>Scroll to compose</span></div>
      </section>

      <section className="intro-strip"><div className="intro-number">01</div><Reveal><p className="eyebrow">A quieter kind of presence</p><h2>For the moment<br /><em>that stays.</em></h2></Reveal><Reveal delay={100}><p className="intro-copy">A considered collection of ten fragrances for the rituals, rooms, and people that make a day feel like your own.</p></Reveal></section>

      <section id="collection" className="collection-section"><div className="section-heading"><Reveal><p className="eyebrow">The scent library</p><h2>Find your<br /><em>signature.</em></h2></Reveal><Reveal delay={80}><p>Each ISTH composition is made to be worn close. Browse by feeling, not by family.</p></Reveal></div>
        <div className="featured-grid">{featured.map((product, index) => <Reveal key={product.id} delay={index * 80}><ProductBottle product={product} /></Reveal>)}<Reveal delay={150} className="collection-note"><div className="note-card"><span className="note-card-mark">✦</span><p className="eyebrow">Wear it close</p><h3>Not a perfume<br /><em>for everyone.</em></h3><p>It is a signature for the person who found it.</p><a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer">Ask the house <MoveUpRight size={14} /></a></div></Reveal></div>
        <div className="catalog-heading"><div><span className="catalog-count">08</span><p className="eyebrow">More compositions</p></div><p className="catalog-note">The rest of the library opens in its own time.</p></div>
        <div className="catalog-grid">{more.map((product, index) => <Reveal key={product.id} delay={(index % 3) * 60}><ProductBottle product={product} compact /></Reveal>)}</div>
      </section>

      <section className="nakshatra-section"><div className="nakshatra-texture" aria-hidden="true" /><div className="nakshatra-inner"><span className="eyebrow light">Next orbit / 02</span><h2>NAKSHATRA<br /><em>collection.</em></h2><p>A new constellation is taking shape. Ten new compositions, arriving when the night is right.</p><span className="coming-soon">Coming soon <span>—</span> ISTH</span></div><div className="nakshatra-orbit" aria-hidden="true"><span /><span /><span /></div></section>

      <section id="story" className="story-section"><div className="story-image" aria-hidden="true" /><Reveal className="story-copy"><p className="eyebrow">The house</p><h2>Between the<br /><em>familiar &amp; unknown.</em></h2><p>ISTH is a fine fragrance house built around the tension between what you recognise and what you cannot quite name. Familiar ingredients, given room to become something else.</p><a className="text-link" href="mailto:isth.support@gmail.com">Write to the house <ArrowRight size={14} /></a></Reveal></section>

      <section id="contact" className="contact-section"><div><p className="eyebrow">Keep in touch</p><h2>Come a little<br /><em>closer.</em></h2></div><div className="contact-details"><p>For product details, stockist enquiries, or simply to find the note that fits, speak with us directly.</p><a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp the house</a><a className="text-link" href="mailto:isth.support@gmail.com">isth.support@gmail.com <MoveUpRight size={13} /></a></div></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><div><a href="/home" className="footer-brand"><span className="brand-symbol" />ISTH</a><p>Fine fragrance, composed quietly.</p></div><div className="footer-links"><div><span>Explore</span><a href="#collection">Collection</a><a href="#story">The house</a><a href="#contact">Contact</a></div><div><span>Direct</span><a href="mailto:isth.support@gmail.com">Email</a><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a><Link href="/admin">Admin room</Link></div></div></div><div className="footer-bottom"><span>© 2026 ISTH Fragrance House</span><span>Gujarat, India / Mon–Sat, 10am–7pm IST</span><span>Privacy · Terms</span></div></footer>
  </div>;
}
