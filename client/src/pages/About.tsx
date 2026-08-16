import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, MessageCircle, MoveUpRight, X } from "lucide-react";
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_TEXT, INSTAGRAM_URL, readLogoUrl } from "@/data/brand";

export default function About() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappNumber = DEFAULT_WHATSAPP_NUMBER;
  const whatsappText = DEFAULT_WHATSAPP_TEXT;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="site-shell bg-[#F5F1EB] text-[#111111] font-sans selection:bg-[#5B0D18] selection:text-[#F5F1EB]">
      {/* Navbar - Exactly matching Home site-nav with absolute centering across screen sizes */}
      <header className={`site-nav is-scrolled ${scrolled ? "is-scrolled" : ""}`}>
        <Link href="/home" className="site-brand">
          <img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '34px', font: '10px var(--mono)', letterSpacing: '.16em', textTransform: 'uppercase' }}>
          <Link href="/about" style={{ color: "var(--cherry)", fontWeight: 600 }}>About</Link>
          <Link href="/home#collection">Collection</Link>
          <Link href="/home#contact">Contact</Link>
        </nav>
        <div className="site-actions">
          <Link href="/home" className="action-link" style={{ fontSize: '10px', fontFamily: 'var(--mono)', letterSpacing: '.14em', textTransform: 'uppercase', padding: '6px 14px', border: '1px solid var(--line)', borderRadius: '999px' }}>
            Back to Home
          </Link>
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

      {/* Main About Content */}
      <main className="pt-36 pb-24 px-6 md:px-16 max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <p className="eyebrow justify-center mb-4">The House of isth</p>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight mb-6 leading-tight">
            Between the familiar<br /><em>&amp; the unknown.</em>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#111111]/80 font-light leading-relaxed">
            isth is a lifestyle fragrance house built upon quiet moments, tactile memories, and the precise tension between what you recognise and what you cannot quite name.
          </p>
        </div>

        {/* Editorial Feature Image */}
        <div className="mb-20 rounded-2xl overflow-hidden shadow-2xl bg-[#111111]/5 aspect-[16/9] relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,13,24,0.12)_0%,transparent_70%)]" />
          <div className="text-center p-8 z-10">
            <img src={readLogoUrl()} alt="isth logo" className="h-16 w-auto mx-auto mb-4 opacity-90" />
            <p className="text-xs uppercase tracking-[0.4em] text-[#111111]/60 font-mono">Established 2021 · Gujarat, India</p>
          </div>
        </div>

        {/* Narrative Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-2xl font-serif mb-4">Philosophy of the Scent</h2>
            <p className="text-[#111111]/80 leading-relaxed mb-6 font-light">
              We believe a fragrance should not announce your arrival from across a room; it should reward the person sitting beside you. Every isth formulation begins with an atmosphere—rain on dry earth, linen left in morning sun, or the quiet stillness of dusk.
            </p>
            <p className="text-[#111111]/80 leading-relaxed font-light">
              Our 10ml tower bottles in frosted glass and 30ml cosmos vessels are designed to feel substantial in the hand and invisible in the air until worn close to the skin.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-serif mb-4">Craft &amp; Composition</h2>
            <p className="text-[#111111]/80 leading-relaxed mb-6 font-light">
              Composed quietly in small batches, our notes eschew synthetic loudness in favour of botanical clarity and lingering warmth. Notes of white musk, amber, rose, and cedarwood blend seamlessly with body warmth to create an evolving personal signature.
            </p>
            <div className="p-6 bg-[#111111]/5 rounded-xl border border-[#111111]/10">
              <p className="text-sm italic font-serif text-[#5B0D18] mb-2">"Embrace the fragrance, Become isth."</p>
              <p className="text-xs text-[#111111]/60 font-mono">A mantra for those who wear their stories inward.</p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="border-t border-b border-[#111111]/10 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-serif mb-1">Explore the collection</h3>
            <p className="text-sm text-[#111111]/70">Find the signature that speaks to your ritual.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/home#collection" className="px-6 py-3 bg-[#5B0D18] text-[#F5F1EB] rounded-full text-xs uppercase tracking-widest font-mono hover:bg-[#111111] transition-all">
              View Collection
            </Link>
            <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer" className="px-6 py-3 border border-[#111111]/30 text-[#111111] rounded-full text-xs uppercase tracking-widest font-mono hover:bg-[#111111] hover:text-[#F5F1EB] transition-all inline-flex items-center gap-2">
              <MessageCircle size={14} /> Queries
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer bg-[#111111] text-[#F5F1EB] py-12 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-[#F5F1EB]/10">
          <div>
            <Link href="/home" className="footer-brand">
              <img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" style={{ filter: "brightness(0) invert(1)" }} />
            </Link>
            <p className="text-xs text-[#F5F1EB]/60 mt-2">estd. 2021</p>
          </div>
          <div className="footer-links flex gap-12 text-sm">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#F5F1EB]/40 mb-3 block font-mono">Explore</span>
              <div className="flex flex-col gap-2 text-[#F5F1EB]/80">
                <Link href="/about">About</Link>
                <Link href="/home#collection">The Collection</Link>
                <Link href="/home#nakshatra">Nakshatra Collection</Link>
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#F5F1EB]/40 mb-3 block font-mono">Direct</span>
              <div className="flex flex-col gap-2 text-[#F5F1EB]/80">
                <a href="mailto:isth.support@gmail.com">Email</a>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row justify-between text-xs text-[#F5F1EB]/50 gap-4 font-mono">
          <span>© 2026 isth Fragrance House</span>
          <span>Gujarat, India / Mon–Sat, 10am–7pm IST</span>
        </div>
      </footer>
    </div>
  );
}
