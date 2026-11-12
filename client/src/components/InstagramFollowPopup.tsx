import { useEffect, useRef, useState } from "react";
import { ArrowRight, Instagram, MoveUpRight, X } from "lucide-react";
import { INSTAGRAM_URL } from "@/data/brand";

declare global {
  interface Window {
    instgrm?: { Embeds?: { process: () => void } };
  }
}

const SESSION_SEEN_KEY = "isth-instagram-follow-popup-seen-v3";
const INSTAGRAM_EMBED_SCRIPT = "https://www.instagram.com/embed.js";

export default function InstagramFollowPopup() {
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_SEEN_KEY)) return;
      window.sessionStorage.setItem(SESSION_SEEN_KEY, "1");
    } catch {
      // Keep the invitation available in privacy modes that block session storage.
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let script = document.querySelector<HTMLScriptElement>(`script[src="${INSTAGRAM_EMBED_SCRIPT}"]`);
    const markEmbedUnavailable = () => {
      if (!cancelled) setEmbedFailed(true);
    };
    const processEmbeds = () => {
      if (!cancelled) window.instgrm?.Embeds?.process();
    };
    const fallbackTimer = window.setTimeout(() => {
      if (!document.querySelector(".instagram-follow-popup-live-embed iframe")) {
        markEmbedUnavailable();
      }
    }, 20000);

    if (window.instgrm?.Embeds) {
      processEmbeds();
    } else if (script) {
      script.addEventListener("load", processEmbeds, { once: true });
      script.addEventListener("error", markEmbedUnavailable, { once: true });
    } else {
      script = document.createElement("script");
      script.src = INSTAGRAM_EMBED_SCRIPT;
      script.async = true;
      script.onload = processEmbeds;
      script.onerror = markEmbedUnavailable;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, [visible]);

  if (!visible) return null;

  const dismiss = () => setVisible(false);

  return (
    <div
      className="instagram-follow-popup"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <section className="instagram-follow-popup-modal" role="dialog" aria-modal="true" aria-labelledby="instagram-follow-popup-title" aria-describedby="instagram-follow-popup-description">
        <header className="instagram-follow-popup-header">
          <div className="instagram-follow-popup-brand">
            <img src="/assets/isth-logo-20261026.svg" alt="isth" />
          </div>
          <button ref={closeButtonRef} className="instagram-follow-popup-close" type="button" onClick={dismiss} aria-label="Close Instagram invitation">
            <X size={20} strokeWidth={1.35} aria-hidden="true" />
          </button>
        </header>

        <div className="instagram-follow-popup-body">
          <section className="instagram-follow-popup-story">
            <h2 id="instagram-follow-popup-title">Come a little <em>closer.</em></h2>
            <p id="instagram-follow-popup-description" className="instagram-follow-popup-description">
              Fragrance, rituals &amp; moments in between. Find the world of isth in your feed.
            </p>

            <a className="instagram-follow-popup-follow" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={dismiss}>
              <Instagram size={16} strokeWidth={1.6} aria-hidden="true" />
              <span>Follow us on Instagram</span>
              <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </section>

          <section className="instagram-follow-popup-preview" aria-label="Live Instagram profile preview">
            <div className="instagram-follow-popup-preview-bar">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={dismiss} aria-label="Open the live ISTH Instagram profile">
                Open profile <MoveUpRight size={12} aria-hidden="true" />
              </a>
            </div>
            <div className="instagram-follow-popup-live-frame">
              <blockquote
                className="instagram-media instagram-follow-popup-live-embed"
                data-instgrm-permalink={INSTAGRAM_URL}
                data-instgrm-version="14"
              >
                <div className="instagram-follow-popup-live-fallback">
                  <Instagram size={24} strokeWidth={1.4} aria-hidden="true" />
                  <strong>@isth.in</strong>
                  <span>{embedFailed ? "The live preview is unavailable here. Visit the profile instead." : "Loading the live profile…"}</span>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={dismiss}>View on Instagram</a>
                </div>
              </blockquote>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
