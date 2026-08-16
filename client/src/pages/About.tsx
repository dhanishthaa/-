import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, MessageCircle, MoveUpRight, Menu, X } from "lucide-react";
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_TEXT, INSTAGRAM_URL, readLogoUrl } from "@/data/brand";

const whatsappNumber = DEFAULT_WHATSAPP_NUMBER;
const whatsappText = DEFAULT_WHATSAPP_TEXT;

export default function About() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-shell">
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <Link href="/home" className="site-brand">
          <img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/about">About</Link>
          <a href="/home#collection">Collection</a>
          <a href="/home#contact">Contact</a>
        </nav>
        <div className="site-actions">
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <div className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}>
        <nav>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <a href="/home#collection" onClick={() => setMenuOpen(false)}>Collection</a>
          <a href="/home#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </div>

      <main className="about-page-main">
        <section className="about-hero-section" style={{ padding: "clamp(120px, 16vw, 180px) clamp(20px, 9vw, 140px) 80px", background: "var(--ivory)", color: "var(--ink)" }}>
          <div style={{ maxWidth: "840px" }}>
            <Link href="/home" className="text-link" style={{ marginBottom: "28px", display: "inline-flex" }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <p className="eyebrow" style={{ color: "var(--cherry)", marginBottom: "16px" }}>The House Philosophy</p>
            <h1 style={{ font: "400 clamp(48px, 7vw, 92px)/.94 var(--serif)", letterSpacing: "-.04em", margin: "0 0 36px" }}>
              Between the<br /><em>familiar &amp; unknown.</em>
            </h1>
            <p style={{ fontSize: "clamp(17px, 2vw, 21px)", lineHeight: "1.6", color: "#4A453F", maxWidth: "680px", margin: "0 0 24px" }}>
              isth is a lifestyle fragrance house built around the tension between what you recognise and what you cannot quite name. Familiar raw ingredients, given room to become something entirely else on skin.
            </p>
          </div>
        </section>

        <section className="story-section" style={{ minHeight: "700px", background: "#e5ded6" }}>
          <div className="story-image" aria-hidden="true" style={{ minHeight: "620px" }}>
            <div className="story-image-placeholder">
              <span>About isth</span>
              <small>Ingredients / atmosphere / ritual</small>
            </div>
          </div>
          <div className="story-copy">
            <p className="eyebrow">Craft &amp; Composition</p>
            <h2 style={{ fontSize: "clamp(42px, 5vw, 76px)" }}>Composed<br /><em>in quiet.</em></h2>
            <p style={{ maxWidth: "380px", margin: "30px 0", color: "#555" }}>
              Every isth composition begins with restraint. Rather than shouting from across the room, our fragrances stay close, revealing their complexity through warmth, movement, and hours of wear.
            </p>
            <div className="story-note-grid" aria-label="Selected perfume ingredients" style={{ margin: "36px 0" }}>
              <div className="story-note-photo note-rose"><span>Rose</span></div>
              <div className="story-note-photo note-amber"><span>Amber</span></div>
              <div className="story-note-photo note-musk"><span>White musk</span></div>
            </div>
            <a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${whatsappText} I would like to inquire about the house philosophy.`)}`} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> Speak with the house
            </a>
          </div>
        </section>

        <section className="contact-section" style={{ background: "var(--ivory)" }}>
          <div>
            <p className="eyebrow">Enquiries</p>
            <h2>Come a little<br /><em>closer.</em></h2>
          </div>
          <div className="contact-details">
            <p>For bespoke stockist enquiries, personal scent consultations, or direct orders, connect with us.</p>
            <a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> Queries
            </a>
            <a className="text-link" href="mailto:isth.support@gmail.com">
              isth.support@gmail.com <MoveUpRight size={13} />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <Link href="/home" className="footer-brand">
              <img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" />
            </Link>
            <p>estd. 2021</p>
          </div>
          <div className="footer-links">
            <div>
              <span>Explore</span>
              <Link href="/about">About</Link>
              <a href="/home#collection">The Collection</a>
              <a href="/home#nakshatra">Nakshatra Collection</a>
            </div>
            <div>
              <span>Direct</span>
              <a href="mailto:isth.support@gmail.com">Email</a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 isth Fragrance House</span>
          <span>Gujarat, India / Mon–Sat, 10am–7pm IST</span>
          <span>Privacy · Terms</span>
        </div>
      </footer>
    </div>
  );
}
