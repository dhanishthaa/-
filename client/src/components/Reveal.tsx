// Quiet Atelier style reminder: reveals are slow, light, and only move opacity/transform.
import { useEffect, useRef, useState, type PropsWithChildren } from "react";

export default function Reveal({ children, className = "", delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
