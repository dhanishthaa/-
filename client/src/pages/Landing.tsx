// isth landing style: a botanical image-led opening, close-set editorial type, and a calm scroll handoff into the main collection.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { readLogoUrl } from "@/data/brand";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const handoff = useRef(false);

  useEffect(() => {
    const intro = window.setTimeout(() => setReady(true), 260);
    let frame = 0;
    let handoffTimer: number | undefined;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight * 0.9)));
        setProgress(next);
        if (next > 0.91 && !handoff.current) {
          handoff.current = true;
          setExiting(true);
          handoffTimer = window.setTimeout(() => setLocation("/home"), 1580);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(intro); if (handoffTimer) window.clearTimeout(handoffTimer); cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, [setLocation]);

  const goToCollection = () => {
    if (handoff.current) return;
    handoff.current = true;
    setExiting(true);
    window.setTimeout(() => setLocation("/home"), 1580);
  };
  const helloScale = 1 - progress * 0.76;
  const helloY = progress * -54;

  return <main className={`landing-page ss1-landing ${exiting ? "is-exiting" : ""}`}>
    <div className="landing-stage">
      <div className="landing-curtain-surface" style={{
        "--fold-progress": progress,
        "--fold-scale": exiting ? 0.025 : Math.max(0.16, 1 - progress * 0.92),
        "--fold-lift": exiting ? "-4vh" : `${progress * -2.4}vh`,
        "--fold-blur": exiting ? "24px" : `${progress * 1.6}px`,
        "--fold-radius": exiting ? "44px" : `${progress * 18}px`,
      } as CSSProperties}>
        <div className="landing-flower-search" aria-hidden="true" />
        <div className="landing-flower-veil" aria-hidden="true" />
        <div className="landing-grain" aria-hidden="true" />
        <div className="landing-header-rail" aria-hidden="true" />
        <div className={`hello-word ${ready ? "is-ready" : ""}`} style={{ transform: `translate3d(-50%,${helloY}vh,0) scale(${helloScale})`, opacity: 1 - progress * 0.98 }} aria-label="HELLO"><span className="hello-type">HELLO</span><span className="hello-caret" aria-hidden="true" /></div>
        <div className={`landing-center ${ready ? "is-ready" : ""}`}>
          <div className="landing-logo-plate"><img src={readLogoUrl()} alt="isth" /></div>
          <p className="landing-quote"><span>Embrace the fragrance.</span><span>Become isth.</span></p>
          <button className="landing-enter" onClick={goToCollection}>Explore the Collection <ArrowRight size={15} /></button>
        </div>
        <div className="landing-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      </div>
    </div>
  </main>;
}
