// Quiet Atelier style reminder: this is the ritual opening — dark, sparse, and intentionally slower than the shop.
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { BRAND_QUOTE, readLogoUrl } from "@/data/brand";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const intro = window.setTimeout(() => setReady(true), 420);
    const onScroll = () => setScrollProgress(Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.72)));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(intro); window.removeEventListener("scroll", onScroll); };
  }, [setLocation]);

  return <main className="landing-page"><div className="landing-stage">
    <div className="landing-image" aria-hidden="true" />
    <div className="landing-scrim" aria-hidden="true" />
    <header className="landing-nav">
      <a href="/" className="brand-mark" aria-label="isth home"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></a>
      <span className="landing-nav-center">Fine fragrance house</span>
      <span className="landing-nav-meta">isth / house</span>
    </header>
    <div className={`hello-word ${ready ? "is-ready" : ""}`} style={{ transform: `translate3d(0,${scrollProgress * -42}vh,0) scale(${1 - scrollProgress * 0.7})`, opacity: 1 - scrollProgress }} aria-hidden="true">hello</div>
    <div className={`landing-copy ${ready ? "is-ready" : ""}`}>
      <p className="landing-kicker">{BRAND_QUOTE}</p>
      <h1>Embrace the<br /><em>fragrance.</em></h1>
      <button className="landing-enter" onClick={() => setLocation("/home")}>Explore the scent <ArrowRight size={15} /></button>
    </div>
    <div className="landing-bottom">
      <span>isth / 2026</span>
      <span className="landing-scroll"><ArrowDownRight size={15} /> Scroll to reveal</span>
      <span>Gujarat, India</span>
    </div>
    <div className="landing-progress" aria-hidden="true"><span /></div>
  </div></main>;
}
