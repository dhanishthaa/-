import { useEffect, useState } from "react";

const DIRECTION_THRESHOLD = 12;
const TOP_REVEAL_POSITION = 24;

/** Hide the fixed site navbar after downward scrolling; reveal it on upward scrolling. */
export function useAutoHideNavbar(menuOpen = false, scrolledThreshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  const [navFolded, setNavFolded] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastScrollY = window.scrollY;
    let direction = 0;
    let directionDistance = 0;
    let frame = 0;

    const updateNavigation = () => {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollY;
      setScrolled(nextScrollY > scrolledThreshold);

      if (menuOpen || reduceMotion || nextScrollY <= TOP_REVEAL_POSITION) {
        direction = 0;
        directionDistance = 0;
        setNavFolded(false);
      } else if (delta !== 0) {
        const nextDirection = delta > 0 ? 1 : -1;
        if (nextDirection !== direction) {
          direction = nextDirection;
          directionDistance = 0;
        }
        directionDistance += delta;
        if (Math.abs(directionDistance) >= DIRECTION_THRESHOLD) {
          setNavFolded(nextDirection > 0);
          directionDistance = 0;
        }
      }

      lastScrollY = nextScrollY;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    if (menuOpen) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [menuOpen, scrolledThreshold]);

  return { scrolled, navFolded };
}
