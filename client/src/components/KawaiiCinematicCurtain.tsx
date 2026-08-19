import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";

const curtainImages = [
  "/manus-storage/isth-kawaii-curtain-contrast-v3_3611a666.jpg",
  "/manus-storage/isth-kawaii-curtain-noir-v3_25aa8d0e.jpg",
  "/manus-storage/isth-kawaii-curtain-contrast-v3_3611a666.jpg",
  "/manus-storage/isth-kawaii-curtain-noir-v3_25aa8d0e.jpg",
];

const curtainPositions = ["11% center", "37% center", "63% center", "89% center"];
const CURTAIN_TIMELINE_DURATION = 2.6;
const COMPACT_TIMING_SCALE = 1.65;

const cinematicPairs = [
  { left: 1, right: 2, start: 0, sweep: 1.25, settle: 0.12, ease: "power3.inOut" },
  { left: 0, right: 3, start: 0.38, sweep: 1.35, settle: 0.12, ease: "power3.out" },
] as const;

export default function KawaiiCinematicCurtain({ variant = "card" }: { variant?: "card" | "dialog" }) {
  const curtainRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;
    const panels = Array.from(curtain.querySelectorAll<HTMLElement>(".kawaii-curtain-panel"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactScreen = window.matchMedia("(max-width: 760px)").matches;
    const motionScale = compactScreen ? COMPACT_TIMING_SCALE : 1;

    if (!panels.length) return;

    const context = gsap.context(() => {
      gsap.set(panels, { autoAlpha: 0, xPercent: 0, force3D: true });

      const replay = () => {
        const exitDistance = compactScreen ? 112 : panels.length * 100 + 28;
        const productStage = curtain.parentElement?.querySelector<HTMLElement>(".bottle-stage-kawaii");
        const timeline = gsap.timeline();

        timeline.set(panels, { autoAlpha: 1, xPercent: 0, force3D: true });

        if (reduceMotion) {
          timeline.to(panels, {
            autoAlpha: 0,
            xPercent: (index) => index < 2 ? -18 : 18,
            duration: 0.28,
            stagger: { each: 0.025, from: "center" },
            ease: "power1.out",
            force3D: true,
          }, 0);
          return;
        }

        if (productStage) {
          timeline.fromTo(productStage, {
            scale: 1.028,
            transformOrigin: "center center",
          }, {
            scale: 1,
            duration: 1.8 * motionScale,
            ease: "power2.out",
            force3D: true,
          }, 0.06);
        }

        cinematicPairs.forEach(({ left, right, start, sweep, settle, ease }) => {
          const pair = [panels[left], panels[right]].filter(Boolean) as HTMLElement[];
          if (pair.length !== 2) return;
          const pairEase = compactScreen ? "power2.inOut" : ease;

          timeline
            .to(pair, {
              xPercent: (index) => index === 0 ? -exitDistance * 1.012 : exitDistance * 1.012,
              duration: sweep * motionScale,
              ease: pairEase,
              force3D: true,
            }, start * motionScale)
            .to(pair, {
              xPercent: (index) => index === 0 ? -exitDistance : exitDistance,
              duration: settle * motionScale,
              ease: "power1.out",
              force3D: true,
            }, (start + sweep) * motionScale);
        });

        timeline.call(() => undefined, [], CURTAIN_TIMELINE_DURATION * motionScale);
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
