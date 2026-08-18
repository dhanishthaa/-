// Quiet Atelier style reminder: the storefront is an asymmetric editorial sequence, not a generic product grid.
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Menu, MessageCircle, MoveUpRight, X } from "lucide-react";
import { Link } from "wouter";
import Reveal from "@/components/Reveal";
import ProductBottle from "@/components/ProductBottle";
import ProductBottleVisual from "@/components/ProductBottleVisual";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { defaultProducts, readLocalProducts, type Product } from "@/data/products";
import { fetchRemoteProducts } from "@/lib/supabase";
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_TEXT, INSTAGRAM_URL, readLogoUrl } from "@/data/brand";

const whatsappNumber = DEFAULT_WHATSAPP_NUMBER;
const whatsappText = DEFAULT_WHATSAPP_TEXT;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setProducts(readLocalProducts());
    fetchRemoteProducts().then((remote) => { if (remote?.length) setProducts(remote); });
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const featured = useMemo(() => products.filter((product) => product.featured).slice(0, 2), [products]);
  const more = useMemo(() => products.filter((product) => !product.featured), [products]);

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

  return <div className="site-shell editorial-home">
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/home" className="site-brand"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><Link href="/about">About</Link><a href="#collection">Collection</a><a href="#contact">Contact</a></nav>
      <div className="site-actions"><button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
    </header>
    <div className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}><nav><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link><a href="#collection" onClick={() => setMenuOpen(false)}>Collection</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></nav></div>

    <main>
      <section className="home-hero">
        <div className="home-hero-image" aria-hidden="true" /><div className="home-hero-flower" aria-hidden="true" /><div className="home-hero-overlay" aria-hidden="true" />
        <div className="home-hero-content"><div className="hero-identity"><img src={readLogoUrl()} alt="isth" /></div><h1>A scent can<br /><em>change the air.</em></h1><p className="hero-description">isth composes modern signatures from notes that stay close, then open slowly.</p><div className="hero-cta-row"><a className="cherry-button hero-whatsapp" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Queries</a><a className="outline-button" href="#collection">Explore the Collection <ArrowDown size={14} /></a></div></div>
        <div className="hero-caption" aria-hidden="true" />
      </section>

      <section className="intro-strip"><Reveal><h2>For the moment<br /><em>that stays.</em></h2></Reveal><Reveal delay={100}><p className="intro-copy">A considered collection of ten fragrances for the rituals, rooms, and people that make a day feel like your own.</p></Reveal></section>
      <section id="collection" className="collection-section"><div className="section-heading"><Reveal><h2>Find your<br /><em>signature.</em></h2></Reveal><Reveal delay={80}><p>Each isth composition is made to be worn close. Browse by feeling, not by family.</p></Reveal></div><Reveal className="collection-editorial-photo" delay={100}><div aria-hidden="true" /></Reveal>
        <div className="featured-grid">{featured.map((product, index) => <Reveal key={product.id} delay={index * 80}><ProductBottle product={product} onOpen={openProduct} /></Reveal>)}<Reveal delay={150} className="collection-note"><div className="note-card"><h3>Not a perfume<br /><em>for everyone.</em></h3><p>It is a signature for the person who found it.</p><a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank">Ask the house <MoveUpRight size={14} /></a></div></Reveal></div>
        <div className="catalog-heading"><div><p className="eyebrow">More compositions</p></div><p className="catalog-note">The rest of the library opens in its own time.</p></div>
        <div className="catalog-grid">{more.map((product, index) => <Reveal key={product.id} delay={(index % 3) * 60}><ProductBottle product={product} compact onOpen={openProduct} /></Reveal>)}</div>
      </section>

      <section className="quote-video-section"><div className="quote-video-backdrop" aria-hidden="true" /><div className="quote-video-copy"><h2><span>Embrace the fragrance.</span><span>Become isth.</span></h2><a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Queries</a></div></section>

      <section id="nakshatra" className="nakshatra-section"><div className="nakshatra-texture" aria-hidden="true" /><div className="nakshatra-inner"><h2>NAKSHATRA<br /><em>collection.</em></h2><p>A new premium segment is taking shape. Ten new compositions, arriving when the night is right.</p><span className="coming-soon">Coming soon <span>—</span> isth</span></div></section>

      <section id="about" className="story-section"><div className="story-image" aria-hidden="true" style={{ backgroundImage: "url('/assets/isth-editorial-about.webp')", backgroundSize: "cover", backgroundPosition: "center" }} /><div className="story-flower" aria-hidden="true" /><Reveal className="story-copy"><h2>Between the<br /><em>familiar &amp; unknown.</em></h2><p>isth is a lifestyle fragrance house built around the tension between what you recognise and what you cannot quite name. Familiar ingredients, given room to become something else.</p><div className="story-note-grid" aria-label="Perfume ingredient imagery"><div className="story-note-photo note-rose"><span>Rose</span></div><div className="story-note-photo note-amber"><span>Amber</span></div><div className="story-note-photo note-musk"><span>White musk</span></div></div><a className="text-link" href="mailto:isth.support@gmail.com">Write to the house <ArrowRight size={14} /></a></Reveal></section>

      <section id="contact" className="contact-section"><div><p className="eyebrow">Queries</p><h2>Come a little<br /><em>closer.</em></h2></div><div className="contact-details"><p>For product details, stockist enquiries, or simply to find the note that fits, speak with us directly.</p><a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Queries</a><a className="text-link" href="mailto:isth.support@gmail.com">isth.support@gmail.com <MoveUpRight size={13} /></a></div></section>
    </main>
    <Dialog open={productDialogOpen} onOpenChange={(open) => { if (!open) closeProduct(); }}>
      {selectedProduct && <DialogContent forceMount className="product-dialog" showCloseButton={false} aria-label={`${selectedProduct.name} details`}>
        <DialogClose className="dialog-close" aria-label="Close product details"><X size={19} strokeWidth={1.4} /><span className="sr-only">Close product details</span></DialogClose>
        <div className="product-dialog-layout">
          <div className="dialog-product-media">
            <ProductBottleVisual product={selectedProduct} modal />
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
    <footer className="site-footer"><div className="footer-top"><div><a href="/home" className="footer-brand"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></a><p>estd. 2021</p></div><div className="footer-links"><div><span>Explore</span><Link href="/about">About</Link><a href="#collection">The Collection</a><a href="#nakshatra">Nakshatra Collection</a></div><div><span>Direct</span><a href="mailto:isth.support@gmail.com">Email</a><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a></div></div></div><div className="footer-bottom"><span>© 2026 isth Fragrance House</span><span>Gujarat, India / Mon–Sat, 10am–7pm IST</span><span>Privacy · Terms</span></div></footer>
  </div>;
}
