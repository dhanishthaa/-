import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const gatewayRef = useRef<HTMLDivElement>(null);
  const openCollection = () => setLocation("/home");

  useEffect(() => {
    if (!gatewayRef.current) return;

    const animation = lottie.loadAnimation({
      container: gatewayRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "/assets/Landinggateway-signature.json",
      name: "isth original Figma signature animation",
    });

    return () => animation.destroy();
  }, []);

  return (
    <main data-layer="isth — The invitation" data-node-id="39-2" className="figma-landing">
      <img
        data-layer="Floral reverie"
        data-node-id="10-68"
        className="figma-landing__background"
        src="/assets/10-68.webp"
        alt=""
      />
      <div data-layer="Reading veil" data-node-id="10-69" className="figma-landing__reading-veil" aria-hidden="true" />
      <div data-layer="Atmospheric vignette" data-node-id="10-70" className="figma-landing__vignette" aria-hidden="true" />

      <div data-layer="Landing gateway" data-node-id="14-4" className="figma-landing__gateway">
        <div ref={gatewayRef} className="figma-lottie-gateway" aria-hidden="true" />
        <div data-layer="Immersive invitation" data-node-id="14-10" className="figma-landing__invitation">
          <div className="figma-wordmark figma-wordmark--placeholder" aria-hidden="true" />
          <div data-layer="Editorial statement" data-node-id="14-11" className="figma-landing__statement">
            <h1 data-layer="Emotional statement" data-node-id="10-86">
              Embrace the fragrance.<br />
              Become isth.
            </h1>
            <p data-layer="Supporting thought" data-node-id="10-88">
              An intimate art. An invisible signature.<br />
              Discover fragrances that become a part of you.
            </p>
          </div>
          <button
            data-layer="Explore the collection"
            data-node-id="14-12"
            className="figma-landing__cta"
            type="button"
            aria-label="Explore the collection"
            onClick={openCollection}
          >
            <span data-layer="Call to action" data-node-id="10-90">Explore the collection</span>
            <img data-layer="Invitation arrow" data-node-id="10-91" src="/assets/10-91.svg" alt="" />
          </button>
        </div>
      </div>
    </main>
  );
}
