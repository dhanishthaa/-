import { useEffect, useState, type FocusEvent } from "react";
import { DEFAULT_ATELIER, fetchPublicAtelier, sanitizeRichText, type AtelierMedia } from "@/lib/supabase";

const ATELIER_AUTOPLAY_INTERVAL_MS = 5000;

function getImageAlt(item: AtelierMedia) {
  const description = item.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return (item.caption?.trim() || description || "Atelier composition").slice(0, 160);
}

export default function Atelier() {
  const [items, setItems] = useState<AtelierMedia[]>(DEFAULT_ATELIER);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeItem = items[activeIndex] ?? DEFAULT_ATELIER[0];

  useEffect(() => {
    let mounted = true;
    void fetchPublicAtelier().then((remote) => {
      if (!mounted || !remote?.length) return;
      setItems(remote);
      setActiveIndex(0);
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (paused || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, ATELIER_AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [activeIndex, items.length, paused]);

  const resumeAfterFocusLeaves = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setPaused(false);
  };

  return (
    <section
      id="atelier"
      data-layer="L’Atelier — The art of perfume"
      data-node-id="1-2"
      className="LAtelierTheArtOfPerfume"
      aria-labelledby="atelier-title"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={resumeAfterFocusLeaves}
    >
      <div data-layer="Atelier portrait" data-node-id="3-4" className="AtelierPortrait">
        <div className="AtelierMediaStage">
          {activeItem.kind === "video" ? (
            <video
              key={activeItem.id}
              src={activeItem.largeUrl}
              className="AtelierMedia"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={getImageAlt(activeItem)}
            />
          ) : (
            <picture key={activeItem.id} className="AtelierPicture">
              <source media="(max-width: 760px)" srcSet={activeItem.smallUrl} />
              <img
                data-layer="The perfumer’s gesture"
                data-node-id="3-5"
                className="AtelierMedia"
                src={activeItem.largeUrl}
                alt={getImageAlt(activeItem)}
                loading="lazy"
              />
            </picture>
          )}
        </div>
        <div className="PhotographCaption">
          <span className="CraftDetail">{activeItem.caption?.trim() || "ATELIER COMPOSITION"}</span>
        </div>
      </div>
      <div data-layer="Atelier editorial" data-node-id="3-9" className="AtelierEditorial">
        <div data-layer="Section label" data-node-id="3-10" className="SectionLabel">
          <div data-layer="Chapter" data-node-id="3-11" className="Chapter">
            <span data-layer="Chapter rule" data-node-id="3-12" className="ChapterRule" aria-hidden="true" />
            <span data-layer="Chapter label" data-node-id="3-13" className="ChapterLabel">THE ART OF PERFUME</span>
          </div>
          <span data-layer="Chapter number" data-node-id="3-14" className="ChapterNumber">[ 01 ]</span>
        </div>
        <h2 id="atelier-title" data-layer="Atelier title" data-node-id="3-15" className="AtelierTitle">L’Atelier</h2>
        <div data-layer="Editorial story" data-node-id="3-16" className="EditorialStory">
          <div
            key={activeItem.id}
            data-layer="Atelier description"
            data-node-id="3-18"
            className="AtelierDescription"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(activeItem.description) }}
          />
        </div>
        <a data-layer="Atelier invitation" data-node-id="3-20" className="AtelierInvitation" href="#contact" aria-label="Enter the atelier">
          <span data-layer="Discover the atelier" data-node-id="3-21" className="DiscoverTheAtelier">
            <span data-layer="Invitation label" data-node-id="3-22" className="InvitationLabel">ENTER THE ATELIER</span>
            <img data-layer="Invitation arrow" data-node-id="3-23" className="InvitationArrow" src="/assets/3-23.svg" alt="" aria-hidden="true" />
          </span>
          <span data-layer="Invitation underline" data-node-id="3-24" className="InvitationUnderline" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
