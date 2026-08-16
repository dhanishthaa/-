import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Menu, MessageCircle, X } from "lucide-react";
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_TEXT, INSTAGRAM_URL, readLogoUrl } from "@/data/brand";

export default function About() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappNumber = DEFAULT_WHATSAPP_NUMBER;
  const whatsappText = DEFAULT_WHATSAPP_TEXT;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="site-shell about-editorial bg-[#F5F1EB] text-[#111111] font-sans selection:bg-[#5B0D18] selection:text-[#F5F1EB]">
      <header className={`site-nav is-scrolled ${scrolled ? "is-scrolled" : ""}`}>
        <Link href="/home" className="site-brand">
          <img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/about" style={{ color: "var(--cherry)", fontWeight: 600 }}>About</Link>
          <Link href="/home#collection">Collection</Link>
          <Link href="/home#contact">Contact</Link>
        </nav>
        <div className="site-actions">
          <Link href="/home" className="action-link about-back-link">Back to Home</Link>
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <div className={`mobile-drawer ${menuOpen ? "is-open" : ""}`}>
        <nav>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/home#collection" onClick={() => setMenuOpen(false)}>Collection</Link>
          <Link href="/home#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/home" onClick={() => setMenuOpen(false)}>Back to Home</Link>
        </nav>
        <span>isth / about</span>
      </div>

      <main className="about-main">
        <section className="about-masthead">
          <div className="about-masthead-copy">
            <p className="eyebrow about-kicker">The House of isth</p>
            <h1>Between the familiar<br /><em>&amp; the unknown.</em></h1>
          </div>
          <p className="about-lede">
            isth is a lifestyle fragrance house built upon quiet moments, tactile memories, and the precise tension between what you recognise and what you cannot quite name.
          </p>
        </section>

        <section className="about-feature" aria-label="isth editorial feature">
          <div className="about-feature-veil" aria-hidden="true" />
          <div className="about-feature-mark">
            <img src={readLogoUrl()} alt="isth logo" />
            <p>Established 2021 · Gujarat, India</p>
          </div>
        </section>

        <section className="about-narrative">
          <article className="about-column about-column-primary">
            <h2>Philosophy of the Scent</h2>
            <p>
              We believe a fragrance should not announce your arrival from across a room; it should reward the person sitting beside you. Every isth formulation begins with an atmosphere—rain on dry earth, linen left in morning sun, or the quiet stillness of dusk.
            </p>
            <p>
              Our 10ml tower bottles in frosted glass and 30ml cosmos vessels are designed to feel substantial in the hand and invisible in the air until worn close to the skin.
            </p>
          </article>
          <article className="about-column about-column-secondary">
            <h2>Craft &amp; Composition</h2>
            <p>
              Composed quietly in small batches, our notes eschew synthetic loudness in favour of botanical clarity and lingering warmth. Notes of white musk, amber, rose, and cedarwood blend seamlessly with body warmth to create an evolving personal signature.
            </p>
            <div className="about-quote-card">
              <p>"Embrace the fragrance, Become isth."</p>
              <p>A mantra for those who wear their stories inward.</p>
            </div>
          </article>
        </section>

        <section className="about-cta">
          <div>
            <h3>Explore the collection</h3>
            <p>Find the signature that speaks to your ritual.</p>
          </div>
          <div className="about-cta-actions">
            <Link href="/home#collection" className="about-primary-action">View Collection</Link>
            <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer" className="about-secondary-action"><MessageCircle size={14} /> Queries</a>
          </div>
        </section>
      </main>

      <footer className="site-footer about-footer">
        <div className="footer-top">
          <div>
            <Link href="/home" className="footer-brand"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></Link>
            <p>estd. 2021</p>
          </div>
          <div className="footer-links">
            <div>
              <span>Explore</span>
              <Link href="/about">About</Link>
              <Link href="/home#collection">The Collection</Link>
              <Link href="/home#nakshatra">Nakshatra Collection</Link>
            </div>
            <div>
              <span>Direct</span>
              <a href="mailto:isth.support@gmail.com">Email</a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 isth Fragrance House</span><span>Gujarat, India / Mon–Sat, 10am–7pm IST</span></div>
      </footer>
    </div>
  );
}
