import { useEffect, useRef, type PointerEvent } from "react";
import "../zip-landing.css";

const GLYPHS = {
  i: "M9.1,16.38c0,.26-.2.48-.46.49-.03,0-.07,0-.11,0-.16,0-.32-.01-.46-.04-.15-.03-.27-.12-.34-.26l-1.5-3.07s-.02-.04-.03-.06c-.66-1.03-1.55-1.72-2.68-2.09-1.09-.36-1.78-.75-2.06-1.17-.02-.04-.04-.07-.05-.12-.25-.75-.71-1.86-1.38-3.35-.03-.06-.04-.13-.04-.19h0c0-.26.21-.47.47-.47h.43s.1,0,.14.02c1.24.39,2.25.75,3.03,1.09,1.31.58,2.18,1.25,2.63,2.01.25.41.63,1.47,1.14,3.18.46,1.54.85,2.63,1.18,3.27.03.05.04.1.05.16.02.18.03.37.04.59ZM10.19,40.88l-3.23-1.79c-.15-.08-.24-.24-.24-.41v-18.42c0-.26.21-.47.47-.47h3.23c.26,0,.47.21.47.47v20.2c0,.36-.38.58-.7.41Z",
  s: "M35.51,16.87H14.83c-.4,0-.72.32-.72.72v1.54s0,0,0,0c0,.4.32.72.72.72h14.82c.75,0,1.35.61,1.35,1.35v1.16c0,.87-.82,1.51-1.67,1.31-2.12-.5-3.81-.75-5.08-.75-1.39,0-2.87.2-4.44.6-3.84.98-5.75,2.86-5.73,5.66,0,1.37.41,2.66,1.24,3.85,1.7,2.48,3.87,3.72,6.5,3.72.45,0,1.65-.26,3.62-.79,3.34-.89,5.32-1.34,5.93-1.34,1.99,0,2.98.63,2.98,1.89,0,.84-.54,1.56-1.61,2.13-2.2,1.19-4.56,1.79-7.07,1.79-1.26,0-2.86-.48-4.8-1.43-1.94-.95-3.22-1.43-3.84-1.43-1.65,0-2.48.7-2.48,2.09,0,1.13.52,2.01,1.56,2.66,1.65,1.03,4.01,1.58,7.07,1.66.5.02,1.12.68,1.86,1.99.88,1.52,1.56,2.52,2.04,3,.89.88,1.99,1.32,3.28,1.32.47,0,.88-.02,1.26-.06.99-.1,1.53-1.2,1.01-2.05l-1.15-1.88c-.27-.44-.77-.68-1.29-.64-.1,0-.2.01-.3.01-.01,0-.02,0-.03,0-1.37-.02-1.69-1.98-.4-2.46.32-.12.64-.25.96-.4,3.31-1.51,4.96-3.57,4.96-6.21,0-1.14-.34-2.13-1.02-2.98-1.41-1.77-3.54-2.66-6.4-2.66-1.47,0-2.5.1-3.08.3-1.37.48-2.5.88-3.38,1.19-1.36.5-2.46.74-3.3.74-1.39,0-2.09-.66-2.09-1.99,0-.99.58-1.8,1.74-2.41,2.05-1.08,4.59-1.61,7.62-1.61,1.26,0,2.75.2,4.47.6.92.21,1.73.43,2.43.68.87.31,1.79-.36,1.79-1.28v-5.99c0-.75.61-1.35,1.35-1.35h0c.75,0,1.35-.61,1.35-1.35v-.27c0-.75-.61-1.35-1.35-1.35Z",
  t: "M56.89,16.9h-9.58c-.82,0-1.49-.67-1.49-1.49v-2.95c0-.49-.24-.95-.64-1.22l-3.44-2.38c-.16-.11-.38,0-.38.2v6.36c0,.82-.67,1.49-1.49,1.49h-2.21c-.21,0-.4.05-.58.12.88.61.86,2.13-.07,2.7.2.1.41.16.65.16h2.21c.82,0,1.49.67,1.49,1.49v16.63c0,.91.28,1.82.84,2.73,1.29,2.1,3.09,3.16,5.41,3.18,3.55.01,6.27-1.65,8.17-4.98.4-.71.15-1.62-.56-2.02l-3.32-1.9c-.2-.11-.45.03-.45.26-.08,4.76-1.31,7.13-3.69,7.13-.55,0-1.01-.29-1.39-.87-.36-.53-.55-1.08-.55-1.64v-18.52c0-.82.67-1.49,1.49-1.49h9.58c.82,0,1.49-.67,1.49-1.49s-.67-1.49-1.49-1.49Z",
  h: "M81.07,29.01c-2-3.97-5.02-5.96-9.06-5.96-1.08,0-2.04.16-2.9.47-.89.33-1.83.89-2.81,1.68-.89.72-2.21.11-2.21-1.03v-3c0-.09.01-.17.03-.26-.06-1.16-.1-3.3-.12-6.01-.16-1.66-.51-3.35-1.07-5.07-1.57-4.84-3.68-8.06-6.31-9.65-.21-.13-.45-.18-.69-.18l-2.67.03c-.64,0-.94.78-.48,1.22.86.81,1.77,1.87,2.73,3.16,2.28,3.1,3.54,6.78,3.76,11.04,0,.09,0,.18-.01.26.07.91.06,7.15.06,7.67,0,1.16,0,2.31,0,3.47v13.92c0,.5.27.95.71,1.19l3.34,1.79c.27.14.59-.05.59-.35v-9.19c0-1.29.52-2.63,1.56-4.02.96-1.29,2.17-2.4,3.62-3.33,1.62-1.04,3.14-1.58,4.57-1.61,1.54-.03,2.73.58,3.57,1.84.74,1.08,1.11,2.42,1.09,4.02-.02,2.7-.76,4.93-2.23,6.7-1.08,1.3-2.06,2.42-2.95,3.38-.28.31-.21.79.15,1.01l2.54,1.52c.51.3,1.15.24,1.59-.16.32-.29.69-.64,1.12-1.06,2.53-2.48,3.8-5.26,3.8-8.34,0-1.69-.44-3.4-1.32-5.14Z",
} as const;

function IsthSignature() {
  return (
    <svg className="signature-svg" viewBox="0 0 82.38 50.28" aria-label="isth" role="img">
      <g className="signature-animated">
        {Object.entries(GLYPHS).map(([name, path]) => (
          <g className={`signature-letter signature-${name}`} key={name}>
            <path className="signature-outline" d={path} pathLength="1" />
            <path className="signature-fill" d={path} />
          </g>
        ))}
      </g>
      <g className="signature-static" fill="white">
        {Object.values(GLYPHS).map((path) => <path d={path} key={path} />)}
      </g>
    </svg>
  );
}

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 36 18"><path d="M1 9h32M25 1l8 8-8 8" /></svg>
);

export default function ZipLanding() {
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;
    const update = () => {
      const travel = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-stage.getBoundingClientRect().top / travel, 0), 1);
      stage.style.setProperty("--lift", progress.toFixed(3));
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--mouse-x", `${x * 12}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${y * -8}px`);
  };

  return (
    <main className="zip-landing">
      <div className="scroll-stage" ref={stageRef}>
        <div className="sticky-scene">
          <section className="hero" ref={heroRef} onPointerMove={handlePointerMove} onPointerLeave={() => {
            heroRef.current?.style.setProperty("--mouse-x", "0px");
            heroRef.current?.style.setProperty("--mouse-y", "0px");
          }}>
            <div className="hero-photo"><div className="hero-photo-image" role="img" aria-label="A close-up hibiscus flower" /></div>
            <div className="hero-shade" />
            <div className="film-grain" />
            <div className="hero-foreground">
              <div className="intro-mark"><IsthSignature /></div>
              <div className="hero-copy">
                <p className="edition">Olfactive stories · No. 01</p>
                <h1><span>Embrace the fragrance.</span><span>Become isth.</span></h1>
                <p className="intro">An intimate art. An invisible signature.<br />Discover fragrances that become a part of you.</p>
                <a className="primary-cta" href="/home"><span>Explore the collection</span><Arrow /></a>
              </div>
              <div className="hero-meta"><span>Fine fragrance · India</span><span>Scroll to enter</span></div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
