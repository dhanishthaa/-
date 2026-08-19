// Quiet Atelier style reminder: motion should feel like fragrance moving through air—slow, controlled, and never theatrical for its own sake.
import { useEffect, type PropsWithChildren } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MotionRoot({ children }: PropsWithChildren) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useNativeTouch = window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 768;
    if (reduceMotion || useNativeTouch) {
      return;
    }

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false, wheelMultiplier: 0.92, touchMultiplier: 1 });
    let rafId = 0;
    const raf = (time: number) => { lenis.raf(time); ScrollTrigger.update(); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return children;
}
