import { useEffect, useRef, useState } from "react";
import { ArrowRight, Instagram, MoveUpRight, X } from "lucide-react";
import { INSTAGRAM_URL } from "@/data/brand";

const SESSION_SEEN_KEY = "isth-instagram-follow-popup-seen-v2";
const PROFILE_PREVIEW_IMAGE = "/assets/isth-instagram-profile-preview.webp";

export default function InstagramFollowPopup() {
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
            <span>FOLLOW OUR JOURNEY</span>
          </div>
          <button ref={closeButtonRef} className="instagram-follow-popup-close" type="button" onClick={dismiss} aria-label="Close Instagram invitation">
            <X size={20} strokeWidth={1.35} aria-hidden="true" />
          </button>
        </header>

        <div className="instagram-follow-popup-body">
          <section className="instagram-follow-popup-story">
            <p className="instagram-follow-popup-eyebrow">A NOTE FROM THE HOUSE</p>
            <h2 id="instagram-follow-popup-title">Come a little <em>closer.</em></h2>
            <p id="instagram-follow-popup-description" className="instagram-follow-popup-description">
              Fragrance, rituals &amp; moments in between. Find the world of isth in your feed.
            </p>

            <div className="instagram-follow-popup-profile">
              <span className="instagram-follow-popup-avatar" aria-hidden="true"><Instagram size={22} strokeWidth={1.35} /></span>
              <div>
                <strong>@isth.in</strong>
                <span>ISTH fragrance house</span>
              </div>
            </div>

            <a className="instagram-follow-popup-follow" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={dismiss}>
              <Instagram size={17} strokeWidth={1.6} aria-hidden="true" />
              <span>Follow us on Instagram</span>
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <p className="instagram-follow-popup-signoff">A closer look at the notes, stories &amp; new compositions from the house.</p>
          </section>

          <section className="instagram-follow-popup-preview" aria-label="Instagram profile preview">
            <div className="instagram-follow-popup-preview-bar">
              <span><Instagram size={16} strokeWidth={1.5} aria-hidden="true" /> Instagram profile preview</span>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={dismiss} aria-label="Open the live ISTH Instagram profile">
                Open live profile <MoveUpRight size={13} aria-hidden="true" />
              </a>
            </div>
            <a className="instagram-follow-popup-preview-shot" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={dismiss} aria-label="Open the live ISTH Instagram profile">
              <img
                src={PROFILE_PREVIEW_IMAGE}
                alt="Preview of the @isth.in Instagram profile and recent fragrance posts"
                width="520"
                height="506"
                fetchPriority="high"
              />
            </a>
          </section>
        </div>
      </section>
    </div>
  );
}
