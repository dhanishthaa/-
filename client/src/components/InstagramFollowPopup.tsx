import { useEffect, useState } from "react";
import { Instagram, MoveUpRight, X } from "lucide-react";
import { INSTAGRAM_URL } from "@/data/brand";

const SESSION_SEEN_KEY = "isth-instagram-follow-popup-seen-v1";

export default function InstagramFollowPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_SEEN_KEY)) return;
      window.sessionStorage.setItem(SESSION_SEEN_KEY, "1");
    } catch {
      // Keep the invitation available in privacy modes that block session storage.
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(SESSION_SEEN_KEY, "1");
    } catch {
      // The component still dismisses for this page view when storage is unavailable.
    }
    setVisible(false);
  };

  return (
    <aside className="instagram-follow-popup" aria-label="Follow ISTH on Instagram">
      <div className="instagram-follow-popup-image">
        <img src="/assets/isth-private-language.webp" alt="An ISTH fragrance on soft, sculptural fabric" />
        <span>ISTH<br />FRAGRANCE HOUSE</span>
      </div>
      <div className="instagram-follow-popup-copy">
        <button className="instagram-follow-popup-close" type="button" onClick={dismiss} aria-label="Close Instagram invitation">
          <X size={16} strokeWidth={1.35} aria-hidden="true" />
        </button>
        <p className="instagram-follow-popup-eyebrow">A NOTE FROM THE HOUSE</p>
        <h2>Come a little <em>closer.</em></h2>
        <p className="instagram-follow-popup-description">Notes, rituals &amp; moments in between.</p>
        <div className="instagram-follow-popup-actions">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow ISTH on Instagram">
            <Instagram size={14} strokeWidth={1.6} aria-hidden="true" />
            <span>Follow us</span>
            <MoveUpRight size={12} strokeWidth={1.6} aria-hidden="true" />
          </a>
          <span className="instagram-follow-popup-handle">@isth.in</span>
        </div>
      </div>
    </aside>
  );
}
