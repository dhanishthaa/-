import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_ATELIER, fetchPublicAtelier, type AtelierMedia } from "@/lib/supabase";

function RichText({ html }: { html: string }) { return <div className="atelier-description" dangerouslySetInnerHTML={{ __html: html }} />; }

export default function Atelier() {
  const [items, setItems] = useState<AtelierMedia[]>(DEFAULT_ATELIER);
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { fetchPublicAtelier().then((remote) => { if (remote?.length) setItems(remote); }); }, []);
  useEffect(() => { if (items.length < 2) return; const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 2500); return () => window.clearInterval(timer); }, [items.length]);
  const current = items[index % items.length] ?? DEFAULT_ATELIER[0];
  const upcoming = useMemo(() => [items[(index + 1) % items.length], items[(index + 2) % items.length]].filter(Boolean), [items, index]);
  useEffect(() => { upcoming.forEach((item) => { const url = window.matchMedia("(max-width: 620px)").matches ? item.smallUrl : item.largeUrl; if (item.kind === "image") { const image = new Image(); image.src = url; } }); }, [upcoming]);
  useEffect(() => { const video = videoRef.current; if (!video) return; video.pause(); video.currentTime = 0; void video.play().catch(() => undefined); return () => { video.pause(); }; }, [current.id]);
  return <section id="atelier" className="atelier-section editorial-motion-panel" aria-label="Atelier">
    <div className="atelier-heading"><p className="eyebrow">isth / Atelier</p><h2>Atelier</h2><p className="atelier-intro">A room for limited expressions, considered slowly and released when they are ready.</p></div>
    <div className="atelier-layout"><div className="atelier-media-stage"><div className="atelier-media-frame">{current.kind === "video" ? <video ref={videoRef} key={current.id} muted playsInline autoPlay loop preload="auto" aria-label="Atelier moving image"><source media="(max-width: 620px)" src={current.smallUrl} /><source src={current.largeUrl} /></video> : <picture key={current.id}><source media="(max-width: 620px)" srcSet={current.smallUrl} /><img src={current.largeUrl} alt="Atelier feature" loading={index === 0 ? "eager" : "lazy"} /></picture>}</div><div className="atelier-dots" aria-label="Atelier slides">{items.map((item, itemIndex) => <button key={item.id} className={itemIndex === index ? "is-active" : ""} onClick={() => setIndex(itemIndex)} aria-label={`Show Atelier item ${itemIndex + 1}`} />)}</div></div><div className="atelier-copy"><p className="eyebrow">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</p><RichText html={current.description} /></div></div>
  </section>;
}
