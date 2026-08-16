import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, MessageCircle, MoveUpRight, Menu, X, Sparkles, ShieldCheck, Compass } from "lucide-react";
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
    <div className="site-shell" style={{ background: "var(--ivory)", color: "var(--ink)", minHeight: "100vh" }}>
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <Link href="/home" className="site-brand">
          <img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/about" style={{ color: "var(--cherry)", fontWeight: 500 }}>About</Link>
          <Link href="/home#collection">Collection</Link>
          <Link href="/home#contact">Contact</Link>
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
          <Link href="/home#collection" onClick={() => setMenuOpen(false)}>Collection</Link>
          <Link href="/home#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>
      </div>

      <main>
        <section style={{ padding: "clamp(130px, 18vw, 200px) clamp(20px, 9vw, 140px) 90px", borderBottom: "1px solid rgba(17,17,17,.08)" }}>
          <div style={{ maxWidth: "900px" }}>
            <Link href="/home" className="text-link" style={{ marginBottom: "28px", display: "inline-flex", gap: "8px", alignItems: "center" }}>
              <ArrowLeft size={14} /> Back to Home Storefront
            </Link>
            <p className="eyebrow" style={{ color: "var(--cherry)", marginBottom: "18px" }}>The House Manifesto / Estd. 2021</p>
            <h1 style={{ font: "400 clamp(48px, 7.5vw, 96px)/.94 var(--serif)", letterSpacing: "-.04em", margin: "0 0 40px" }}>
              A quieter kind of<br /><em>presence.</em>
            </h1>
            <p style={{ fontSize: "clamp(18px, 2.2vw, 22px)", lineHeight: "1.65", color: "#4A453F", maxWidth: "740px", margin: "0 0 30px" }}>
              isth is built on the belief that a truly memorable fragrance does not need to fill a room before you enter it. It lives on skin, waiting to be discovered only by those who come close.
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1px", background: "rgba(17,17,17,.1)", borderBottom: "1px solid rgba(17,17,17,.08)" }}>
          <div style={{ padding: "clamp(50px, 7vw, 90px) clamp(30px, 6vw, 70px)", background: "var(--ivory)" }}>
            <span style={{ display: "inline-flex", padding: "12px", background: "rgba(91,13,24,.08)", color: "var(--cherry)", borderRadius: "4px", marginBottom: "24px" }}><Compass size={22} /></span>
            <h3 style={{ font: "400 28px/1.1 var(--serif)", margin: "0 0 16px" }}>The Origin</h3>
            <p style={{ color: "#67625C", lineHeight: "1.7", fontSize: "15px" }}>
              Founded in 2021 in Gujarat, India, isth was born out of a desire to strip away commercial noise from modern perfumery. We focus exclusively on raw, high-grade extraits that interact uniquely with individual skin chemistry.
            </p>
          </div>
          <div style={{ padding: "clamp(50px, 7vw, 90px) clamp(30px, 6vw, 70px)", background: "var(--ivory)" }}>
            <span style={{ display: "inline-flex", padding: "12px", background: "rgba(91,13,24,.08)", color: "var(--cherry)", borderRadius: "4px", marginBottom: "24px" }}><Sparkles size={22} /></span>
            <h3 style={{ font: "400 28px/1.1 var(--serif)", margin: "0 0 16px" }}>The Philosophy</h3>
            <p style={{ color: "#67625C", lineHeight: "1.7", fontSize: "15px" }}>
              We reject rigid gender pyramids and loud seasonal trends. Every scent is formulated around familiar botanical elements given unexpected, intimate depth through warm resins and rare musks.
            </p>
          </div>
          <div style={{ padding: "clamp(50px, 7vw, 90px) clamp(30px, 6vw, 70px)", background: "var(--ivory)" }}>
            <span style={{ display: "inline-flex", padding: "12px", background: "rgba(91,13,24,.08)", color: "var(--cherry)", borderRadius: "4px", marginBottom: "24px" }}><ShieldCheck size={22} /></span>
            <h3 style={{ font: "400 28px/1.1 var(--serif)", margin: "0 0 16px" }}>The Standard</h3>
            <p style={{ color: "#67625C", lineHeight: "1.7", fontSize: "15px" }}>
              Hand-poured in small batches. Presented in heavy frosted 10ml tower and 30ml cosmos glass bottles designed to rest comfortably in the palm and age gracefully on your vanity.
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#111111", color: "var(--ivory)" }} className="about-split-section">
          <div style={{ padding: "clamp(70px, 10vw, 130px) clamp(30px, 7vw, 100px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p className="eyebrow" style={{ color: "var(--gold)", marginBottom: "16px" }}>Composition Notes</p>
            <h2 style={{ font: "400 clamp(36px, 5vw, 64px)/.96 var(--serif)", margin: "0 0 28px" }}>The raw materials we return to.</h2>
            <p style={{ color: "rgba(245,241,235,.7)", lineHeight: "1.7", maxWidth: "460px", marginBottom: "40px" }}>
              Our palette bridges traditional Indian botanicals with rare global extractions—creating quiet signatures that evolve across the day.
            </p>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${whatsappText} I would like to order or enquire about isth extraits.`)}`} target="_blank" rel="noreferrer">
                <MessageCircle size={15} /> Queries via WhatsApp
              </a>
            </div>
          </div>
          <div style={{ minHeight: "500px", background: "url('/assets/isth-ingredients-editorial_4fe9c8a1.png') center/cover", filter: "saturate(.85)" }} aria-hidden="true" />
        </section>

        <section style={{ padding: "clamp(90px, 12vw, 160px) clamp(20px, 9vw, 140px)", background: "var(--ivory)" }}>
          <div style={{ maxWidth: "700px" }}>
            <p className="eyebrow" style={{ color: "var(--cherry)", marginBottom: "16px" }}>Connect with the House</p>
            <h2 style={{ font: "400 clamp(42px, 6vw, 76px)/.96 var(--serif)", margin: "0 0 30px" }}>Become isth.</h2>
            <p style={{ color: "#67625C", lineHeight: "1.7", fontSize: "17px", marginBottom: "40px" }}>
              Whether you are discovering your first signature or seeking guidance on note pairings, our studio is available directly.
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
              <a className="cherry-button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer">
                <MessageCircle size={15} /> Queries
              </a>
              <a className="text-link" href="mailto:isth.support@gmail.com">
                isth.support@gmail.com <MoveUpRight size={13} />
              </a>
            </div>
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
        <div className="footer-bottom">
          <span>© 2026 isth Fragrance House</span>
          <span>Gujarat, India / Mon–Sat, 10am–7pm IST</span>
          <span>Privacy · Terms</span>
        </div>
      </footer>
    </div>
  );
}
