// isth landing style: a botanical image-led opening, close-set editorial type, and a calm scroll handoff into the main collection.
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { BRAND_QUOTE, readLogoUrl } from "@/data/brand";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const handoff = useRef(false);

  useEffect(() => {
    const intro = window.setTimeout(() => setReady(true), 260);
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight * 0.72)));
        setProgress(next);
        if (next > 0.84 && !handoff.current) {
          handoff.current = true;
          setExiting(true);
          window.setTimeout(() => setLocation("/home"), 420);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(intro); cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, [setLocation]);

  const goToCollection = () => { setExiting(true); window.setTimeout(() => setLocation("/home"), 260); };
  const helloScale = 1 - progress * 0.76;
  const helloY = progress * -54;

  return <main className={`landing-page ss1-landing ${exiting ? "is-exiting" : ""}`}>
    <div className="landing-stage">
      <div className="landing-flower-search" aria-hidden="true" />
      <div className="landing-flower-veil" aria-hidden="true" />
      <div className="landing-grain" aria-hidden="true" />
      <div className="landing-header-rail" aria-hidden="true" />
      <div className={`hello-word ${ready ? "is-ready" : ""}`} style={{ transform: `translate3d(0,${helloY}vh,0) scale(${helloScale})`, opacity: 1 - progress * 0.98 }} aria-hidden="true"><span>hel</span><span>lo</span></div>
      <div className={`landing-center ${ready ? "is-ready" : ""}`}>
        <div className="landing-logo-plate"><img src={readLogoUrl()} alt="isth" /></div>
        <p className="landing-quote">{BRAND_QUOTE}</p>
        <button className="landing-enter" onClick={goToCollection}>Explore the Collection <ArrowRight size={15} /></button>
      </div>
      <div className="landing-meta"><span>isth / 2026</span><span>Scroll to enter</span></div>
      <div className="landing-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
    </div>
  </main>;
}
