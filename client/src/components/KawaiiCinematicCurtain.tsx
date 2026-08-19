import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";

const curtainImages = [
  "/manus-storage/isth-kawaii-curtain-contrast-v3_3611a666.jpg",
  "/manus-storage/isth-kawaii-curtain-noir-v3_25aa8d0e.jpg",
  "/manus-storage/isth-kawaii-curtain-contrast-v3_3611a666.jpg",
  "/manus-storage/isth-kawaii-curtain-noir-v3_25aa8d0e.jpg",
  "/manus-storage/isth-kawaii-curtain-contrast-v3_3611a666.jpg",
  "/manus-storage/isth-kawaii-curtain-noir-v3_25aa8d0e.jpg",
  "/manus-storage/isth-kawaii-curtain-contrast-v3_3611a666.jpg",
  "/manus-storage/isth-kawaii-curtain-noir-v3_25aa8d0e.jpg",
];

const curtainPositions = ["4% center", "18% center", "31% center", "44% center", "57% center", "70% center", "83% center", "96% center"];
const CURTAIN_TIMELINE_DURATION = 2.6;

const flapMotions = [
  { start: 0, sweep: 0.18, settle: 0.1, ease: "power2.inOut" },
  { start: 0.16, sweep: 0.2, settle: 0.09, ease: "power3.in" },
  { start: 0.3, sweep: 0.22, settle: 0.09, ease: "sine.inOut" },
  { start: 0.46, sweep: 0.23, settle: 0.09, ease: "power3.inOut" },
  { start: 0.62, sweep: 0.25, settle: 0.09, ease: "power2.out" },
  { start: 0.78, sweep: 0.24, settle: 0.08, ease: "power2.in" },
  { start: 0.94, sweep: 0.25, settle: 0.09, ease: "sine.out" },
  { start: 1.1, sweep: 0.22, settle: 0.08, ease: "power3.out" },
] as const;

export default function KawaiiCinematicCurtain({ variant = "card" }: { variant?: "card" | "dialog" }) {
  const curtainRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;
    const panels = Array.from(curtain.querySelectorAll<HTMLElement>(".kawaii-curtain-panel"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!panels.length) return;

    const context = gsap.context(() => {
      gsap.set(panels, { autoAlpha: 0, xPercent: 0, force3D: true });

      const replay = () => {
        const panelsPerSide = Math.ceil(panels.length / 2);
        const exitDistance = panels.length * 100 + 28;
        const directionFor = (index: number) => index < panelsPerSide ? -1 : 1;
        const timeline = gsap.timeline();

        timeline.set(panels, { autoAlpha: 1, xPercent: 0, force3D: true });

        if (reduceMotion) {
          timeline.to(panels, {
            autoAlpha: 0,
            xPercent: (index) => directionFor(index) * 18,
            duration: 0.28,
            stagger: 0.035,
            ease: "power1.out",
            force3D: true,
          }, 0);
          return;
        }

        flapMotions.forEach(({ start, sweep, settle, ease }, index) => {
          const panel = panels[index];
          if (!panel) return;
          const finalPosition = directionFor(index) * exitDistance;

          timeline
            .to(panel, {
              xPercent: finalPosition * 1.018,
              duration: sweep,
              ease,
              force3D: true,
            }, start)
            .to(panel, {
              xPercent: finalPosition,
              duration: settle,
              ease: "power1.out",
              force3D: true,
            }, start + sweep);
        });

        timeline.call(() => undefined, [], CURTAIN_TIMELINE_DURATION);
      };

      if (variant === "dialog") {
        const frame = window.requestAnimationFrame(replay);
        return () => window.cancelAnimationFrame(frame);
      }

      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        replay();
      }, { threshold: 0.48 });
      observer.observe(curtain);
      return () => observer.disconnect();
    }, curtain);

    return () => context.revert();
  }, [variant]);

  return (
    <span ref={curtainRef} className={`kawaii-curtain kawaii-curtain--${variant}`} aria-hidden="true">
      {curtainImages.map((image, index) => (
        <span
          key={`${image}-${index}`}
          className="kawaii-curtain-panel"
          style={{ backgroundImage: `url("${image}")`, backgroundPosition: curtainPositions[index] } as CSSProperties}
        />
      ))}
    </span>
  );
}
