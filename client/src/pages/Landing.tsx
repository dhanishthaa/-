// isth landing style: a botanical image-led opening, close-set editorial type, and a calm scroll handoff into the main collection.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { readLogoUrl } from "@/data/brand";

const LANDING_CHERRY = "#5B0D18";
const LANDING_EDGE = "#38050d";
const SITE_IVORY = "#F5F1EB";

function setBrowserThemeColor(color: string) {
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", color);
}

function setLandingChrome(active: boolean) {
  document.documentElement.classList.toggle("isth-landing-boot", active);
  // Android paints the safe-area/navigation strip from theme-color. Use the
  // darkest landing-gradient edge so it visually continues the cherry surface.
  setBrowserThemeColor(active ? LANDING_EDGE : SITE_IVORY);
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const restoreSiteChrome = () => setLandingChrome(false); 
  const [ready, setReady] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const handoff = useRef(false);

  useEffect(() => {
    let intro: number | undefined;
    let signatureTimer: number | undefined;
    const clearSequence = () => {
      if (intro) window.clearTimeout(intro);
      if (signatureTimer) window.clearTimeout(signatureTimer);
    };
    const startSequence = () => {
      clearSequence();
      setLandingChrome(true);
      handoff.current = false;
      setReady(false);
      setSignatureComplete(false);
      setProgress(0);
      setExiting(false);
      window.scrollTo(0, 0);
      intro = window.setTimeout(() => setReady(true), 280);
      signatureTimer = window.setTimeout(() => {
        setSignatureComplete(true);
        // Once the flower reveal begins, the temporary cherry first-paint layer
        // must no longer sit beneath it or persist into /home on mobile.
        restoreSiteChrome();
      }, 2420);
    };
    startSequence();
    let frame = 0;
    let handoffTimer: number | undefined;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight * 0.72)));
        setProgress(next);
        if (next > 0.84 && !handoff.current) {
          handoff.current = true;
          setExiting(true);
          handoffTimer = window.setTimeout(() => setLocation("/home"), 1120);
        }
      });
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) startSequence();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pageshow", onPageShow);
    return () => { clearSequence(); if (handoffTimer) window.clearTimeout(handoffTimer); cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("pageshow", onPageShow); restoreSiteChrome(); };
  }, [setLocation]);

  const goToCollection = () => {
    if (handoff.current) return;
    handoff.current = true;
    setExiting(true);
    restoreSiteChrome();
    window.setTimeout(() => setLocation("/home"), 1120);
  };
  const ss1Gradient = "radial-gradient(ellipse 72% 88% at 13% 22%, rgba(181,70,88,.68) 0%, rgba(181,70,88,0) 58%), radial-gradient(ellipse 72% 82% at 88% 84%, rgba(35,3,10,.58) 0%, rgba(35,3,10,0) 63%), linear-gradient(128deg, #8b2435 0%, #6f1221 38%, #5B0D18 62%, #38050d 100%)";
  const ss1SurfaceStyle = signatureComplete ? undefined : { backgroundColor: "#5B0D18", background: ss1Gradient };
  return <main className={`landing-page ss1-landing ${ready ? "signature-writing" : ""} ${signatureComplete ? "signature-complete" : ""} ${exiting ? "is-exiting" : ""}`} style={ss1SurfaceStyle}>
    <div className="landing-stage" style={ss1SurfaceStyle}>
      <div className="landing-curtain-surface" style={{
        "--fold-progress": progress,
        "--fold-scale": exiting ? 0.025 : Math.max(0.16, 1 - progress * 0.92),
        "--fold-lift": exiting ? "-4vh" : `${progress * -2.4}vh`,
        "--fold-blur": exiting ? "24px" : `${progress * 1.6}px`,
        "--fold-radius": exiting ? "44px" : `${progress * 18}px`,
        backgroundColor: signatureComplete ? undefined : "#5B0D18",
        background: signatureComplete ? undefined : ss1Gradient,
      } as CSSProperties}>
        <div className="landing-flower-search" aria-hidden="true" />
        <div className="landing-flower-veil" aria-hidden="true" />
        <div className="landing-grain" aria-hidden="true" />
        <div className="landing-header-rail" aria-hidden="true" />
        <div className="signature-writing-mark" aria-label="isth">
          <span className="signature-letter signature-i"><img src={readLogoUrl()} alt="" /></span>
          <span className="signature-letter signature-s"><img src={readLogoUrl()} alt="" /></span>
          <span className="signature-letter signature-t"><img src={readLogoUrl()} alt="" /></span>
          <span className="signature-letter signature-h"><img src={readLogoUrl()} alt="" /></span>
        </div>
        <div className={`landing-center ${signatureComplete ? "is-ready" : ""}`}>
          <p className="landing-quote"><span>Embrace the fragrance.</span><span>Become isth.</span></p>
          <button className="landing-enter" onClick={goToCollection}>Explore the Collection <ArrowRight size={15} /></button>
        </div>
        <div className="landing-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      </div>
    </div>
  </main>;
}
