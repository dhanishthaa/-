// Quiet Atelier style reminder: this is the ritual opening — dark, sparse, and intentionally slower than the shop.
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const intro = window.setTimeout(() => setReady(true), 420);
    const redirect = window.setTimeout(() => setLocation("/home"), 6200);
    return () => { window.clearTimeout(intro); window.clearTimeout(redirect); };
  }, [setLocation]);

  return <main className="landing-page">
    <div className="landing-image" aria-hidden="true" />
    <div className="landing-scrim" aria-hidden="true" />
    <header className="landing-nav">
      <a href="/" className="brand-mark" aria-label="ISTH home"><span className="brand-symbol" /><span>ISTH</span></a>
      <span className="landing-nav-center">Fine fragrance house</span>
      <span className="landing-nav-meta">00 / 01</span>
    </header>
    <div className={`landing-copy ${ready ? "is-ready" : ""}`}>
      <p className="landing-kicker">Composed between familiar notes</p>
      <h1>Wear the quiet<br /><em>after the room changes.</em></h1>
      <button className="landing-enter" onClick={() => setLocation("/home")}>Enter the collection <ArrowRight size={15} /></button>
    </div>
    <div className="landing-bottom">
      <span>ISTH / 2026</span>
      <span className="landing-scroll"><ArrowDownRight size={15} /> Scroll to reveal</span>
      <span>Gujarat, India</span>
    </div>
    <div className="landing-progress" aria-hidden="true"><span /></div>
  </main>;
}
