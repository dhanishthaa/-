import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";

const curtainImages = [
  "/manus-storage/isth-kawaii-curtain-contrast-v3_3611a666.jpg",
  "/manus-storage/isth-kawaii-curtain-noir-v3_25aa8d0e.jpg",
  "/manus-storage/isth-kawaii-curtain-contrast-v3_3611a666.jpg",
  "/manus-storage/isth-kawaii-curtain-noir-v3_25aa8d0e.jpg",
  "/manus-storage/isth-kawaii-curtain-contrast-v3_3611a666.jpg",
];

const curtainPositions = ["7% center", "31% center", "52% center", "73% center", "94% center"];

export default function KawaiiCinematicCurtain({ variant = "card" }: { variant?: "card" | "dialog" }) {
  const curtainRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;
    const panels = Array.from(curtain.querySelectorAll<HTMLElement>(".kawaii-curtain-panel"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !panels.length) return;

    const context = gsap.context(() => {
      gsap.set(panels, { autoAlpha: 0, xPercent: 0 });

      const replay = () => {
        const exitDistance = panels.length * 100 + 28;
        const leftSideCount = Math.floor(panels.length / 2);
        const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        timeline
          .set(panels, { autoAlpha: 1, xPercent: 0 })
          .to(panels, {
            xPercent: (index) => index < leftSideCount ? -exitDistance : exitDistance,
            duration: 2.75,
            stagger: { each: 0.2, from: "center" },
          }, 0);
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
