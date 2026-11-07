import { useCallback, type CSSProperties } from "react";

/*
 * TODO — AI INTEGRATION CONTRACT (keep this prompt with the implementation):
 *
 * Preserve this experience as one self-contained React file. Do not replace the
 * ISTH monogram with text, a font, an image, or a generic handwriting library.
 * The four inline SVG glyph paths below are the original logo artwork. Animate
 * them only through their matching SVG masks and growing stroke-dasharray paths:
 * i → s → t → h, once, smoothly, without a pen/hand/cursor and without looping.
 * The opening state must show only the floral background. The large signature
 * writes at the exact centre, then scales and travels into its final logo slot.
 * Only after that travel begins may the statement and CTA reveal. Scrolling and
 * “Explore the collection” must both enter #home using native smooth scrolling.
 * Keep the local background asset, exact glyph geometry, responsive aspect
 * ratios, reduced-motion fallback, keyboard focus states, and this single-file
 * architecture. Never split the SVG masks or animation CSS into generated files.
 */

const GLYPH_PATHS = {
  i: `M59.3836 64.052C59.3836 65.06 58.6068 65.913 57.5969 65.9518C57.4804 65.9518 57.325 65.9518 57.1697 65.9518C56.5482 65.9518 55.9268 65.913 55.383 65.7967C54.8004 65.6804 54.3343 65.3315 54.0624 64.7886L48.2364 52.8855C48.2364 52.8855 48.1587 52.7304 48.1199 52.6529C45.5564 48.6593 42.0996 45.984 37.7106 44.5494C33.477 43.1536 30.7971 41.6415 29.7095 40.013C29.6319 39.8579 29.5542 39.7416 29.5153 39.5478C28.5443 36.6398 26.7577 32.3361 24.1554 26.559C24.0388 26.3263 24 26.0549 24 25.8223C24 24.8142 24.8156 24 25.8255 24H27.4956C27.4956 24 27.884 24 28.0394 24.0775C32.8556 25.5897 36.7785 26.9855 39.808 28.3037C44.8961 30.5525 48.2752 33.1503 50.023 36.097C50.9941 37.6867 52.47 41.7966 54.4508 48.4267C56.2375 54.3976 57.7523 58.6238 59.034 61.1053C59.1505 61.2991 59.1894 61.493 59.2282 61.7256C59.3059 62.4235 59.3447 63.1602 59.3836 64.0132V64.052ZM63.6172 159.045L51.0717 152.104C50.4891 151.794 50.1396 151.174 50.1396 150.515V79.0957C50.1396 78.0876 50.9552 77.2734 51.9651 77.2734H64.5105C65.5204 77.2734 66.336 78.0876 66.336 79.0957V157.416C66.336 158.812 64.8601 159.665 63.6172 159.006V159.045Z`,
  s: `M107.236 24H26.9137C25.36 24 24.1171 25.2407 24.1171 26.7916V32.7626C24.1171 34.3135 25.36 35.5542 26.9137 35.5542H84.4758C87.3888 35.5542 89.7193 37.9193 89.7193 40.7885V45.2861C89.7193 48.6593 86.5343 51.1407 83.2329 50.3653C74.9986 48.4266 68.4345 47.4573 63.5017 47.4573C58.1029 47.4573 52.3544 48.2328 46.2564 49.7837C31.3415 53.5834 23.9229 60.8726 24.0006 71.7289C24.0006 77.0407 25.5931 82.0423 28.8169 86.6563C35.4198 96.2718 43.8483 101.08 54.0634 101.08C55.8112 101.08 60.4721 100.072 68.1238 98.0166C81.0966 94.5658 88.7871 92.8211 91.1564 92.8211C98.8857 92.8211 102.731 95.2637 102.731 100.149C102.731 103.406 100.634 106.198 96.4776 108.408C87.9326 113.022 78.7662 115.348 69.0171 115.348C64.1232 115.348 57.9086 113.487 50.3735 109.803C42.8384 106.12 37.8668 104.259 35.4587 104.259C29.0499 104.259 25.8261 106.973 25.8261 112.362C25.8261 116.744 27.8458 120.156 31.8853 122.676C38.294 126.669 47.4605 128.802 59.3458 129.112C61.2878 129.19 63.6959 131.749 66.5702 136.828C69.9881 142.721 72.6293 146.598 74.4937 148.46C77.9505 151.872 82.223 153.577 87.2335 153.577C89.059 153.577 90.6515 153.5 92.1274 153.345C95.9727 152.957 98.0701 148.692 96.0503 145.397L91.5836 138.107C90.5349 136.401 88.5929 135.471 86.5732 135.626C86.1848 135.626 85.7964 135.665 85.4079 135.665C85.3691 135.665 85.3303 135.665 85.2914 135.665C79.9702 135.587 78.7273 127.988 83.7378 126.127C84.9807 125.661 86.2236 125.157 87.4665 124.576C100.323 118.721 106.732 110.734 106.732 100.498C106.732 96.078 105.411 92.2395 102.77 88.9438C97.2932 82.0811 89.0201 78.6304 77.9117 78.6304C72.2021 78.6304 68.2015 79.0181 65.9487 79.7935C60.6275 81.6546 56.2385 83.2055 52.8205 84.4075C47.5381 86.3461 43.2657 87.2766 40.003 87.2766C34.6042 87.2766 31.8853 84.7176 31.8853 79.5609C31.8853 75.7224 34.1381 72.5819 38.6436 70.2168C46.606 66.0293 56.4715 63.9744 68.2403 63.9744C73.1342 63.9744 78.9215 64.7498 85.6022 66.3007C89.1755 67.115 92.3216 67.9679 95.0405 68.9373C98.4196 70.1392 101.993 67.5415 101.993 63.9744V40.7497C101.993 37.8418 104.362 35.5154 107.236 35.5154C110.15 35.5154 112.48 33.1503 112.48 30.2811V29.2343C112.48 26.3263 110.111 24 107.236 24Z`,
  t: `M101.191 55.343H63.9931C60.8092 55.343 58.2077 52.7451 58.2077 49.5657V38.1274C58.2077 36.2275 57.2758 34.4439 55.7227 33.397L42.3658 24.1688C41.7445 23.7423 40.8903 24.1688 40.8903 24.9443V49.6045C40.8903 52.7839 38.2888 55.3818 35.1049 55.3818H26.5238C25.7084 55.3818 24.9707 55.5756 24.2718 55.8471C27.6887 58.2123 27.611 64.1059 24 66.316C24.7766 66.7037 25.592 66.9364 26.5238 66.9364H35.1049C38.2888 66.9364 40.8903 69.5342 40.8903 72.7137V137.194C40.8903 140.723 41.9775 144.251 44.1519 147.78C49.1607 155.922 56.1498 160.032 65.158 160.11C78.942 160.149 89.5033 153.712 96.8807 140.8C98.4338 138.048 97.4631 134.519 94.7063 132.968L81.8153 125.601C81.0387 125.175 80.068 125.717 80.068 126.609C79.7574 145.066 74.9815 154.255 65.7404 154.255C63.6048 154.255 61.8187 153.131 60.3433 150.882C58.9454 148.827 58.2077 146.694 58.2077 144.523V72.7137C58.2077 69.5342 60.8092 66.9364 63.9931 66.9364H101.191C104.375 66.9364 106.976 64.3385 106.976 61.1591C106.976 57.9796 104.375 55.3818 101.191 55.3818V55.343Z`,
  h: `M134.714 136.485C126.948 121.091 115.221 113.375 99.534 113.375C95.3403 113.375 91.6125 113.995 88.2731 115.197C84.8172 116.477 81.1671 118.648 77.3617 121.712C73.9058 124.503 68.7802 122.138 68.7802 117.718V106.085C68.7802 105.736 68.819 105.426 68.8967 105.077C68.6637 100.579 68.5084 92.2818 68.4307 81.7739C67.8094 75.3373 66.4504 68.7845 64.2759 62.1153C58.1795 43.3484 49.9862 30.8631 39.7738 24.6979C38.9584 24.1939 38.0264 24 37.0945 24L26.7268 24.1163C24.2416 24.1163 23.0767 27.1407 24.8629 28.8468C28.2023 31.9875 31.7359 36.0976 35.4636 41.0995C44.317 53.1196 49.2096 67.3886 50.0639 83.9065C50.0639 84.2554 50.0639 84.6044 50.0251 84.9146C50.2969 88.4431 50.258 112.638 50.258 114.655C50.258 119.152 50.258 123.611 50.258 128.109V182.083C50.258 184.022 51.3065 185.767 53.015 186.697L65.9844 193.638C67.0328 194.181 68.2754 193.444 68.2754 192.281V156.647C68.2754 151.645 70.2946 146.45 74.3329 141.06C78.0607 136.058 82.7592 131.754 88.3896 128.148C94.6801 124.116 100.582 122.022 106.135 121.905C112.115 121.789 116.736 124.154 119.998 129.04C122.871 133.228 124.308 138.423 124.23 144.627C124.152 155.096 121.279 163.743 115.571 170.606C111.377 175.647 107.572 179.989 104.116 183.712C103.029 184.914 103.3 186.775 104.698 187.628L114.561 193.522C116.542 194.685 119.027 194.452 120.735 192.901C121.978 191.777 123.415 190.42 125.084 188.791C134.909 179.175 139.84 168.396 139.84 156.453C139.84 149.901 138.131 143.27 134.714 136.523V136.485Z`,
};

type GlyphProps = {
  id: string;
  className: string;
  width: number;
  height: number;
  path: string;
  strokes: Array<{ d: string; width: number; delay: number; duration: number }>;
};

function SignatureGlyph({ id, className, width, height, path, strokes }: GlyphProps) {
  return (
    <svg
      aria-hidden="true"
      className={`signature-glyph ${className}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      overflow="visible"
    >
      <defs>
        <mask
          id={`write-${id}`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={width}
          height={height}
        >
          {strokes.map((stroke, index) => (
            <path
              className="ink-stroke"
              d={stroke.d}
              key={`${id}-${index}`}
              pathLength="1"
              stroke="white"
              strokeWidth={stroke.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={
                {
                  "--stroke-delay": `${stroke.delay}s`,
                  "--stroke-duration": `${stroke.duration}s`,
                } as CSSProperties
              }
            />
          ))}
          <rect
            className="completed-glyph"
            x="0"
            y="0"
            width={width}
            height={height}
            fill="white"
          />
        </mask>
      </defs>
      <path d={path} fill="white" mask={`url(#write-${id})`} />
    </svg>
  );
}

function Signature({ staticLogo = false }: { staticLogo?: boolean }) {
  return (
    <div
      className={`signature-stage${staticLogo ? " signature-stage--static" : ""}`}
      aria-label="isth"
    >
      <div className="signature-art">
        <SignatureGlyph
          id={staticLogo ? "i-static" : "i"}
          className="glyph-i"
          width={90.336}
          height={183.232}
          path={GLYPH_PATHS.i}
          strokes={[
            { d: "M27 27C44 30 48 41 54 59", width: 19, delay: 0.18, duration: 0.22 },
            { d: "M58 78V157", width: 23, delay: 0.38, duration: 0.28 },
          ]}
        />
        <SignatureGlyph
          id={staticLogo ? "s-static" : "s"}
          className="glyph-s"
          width={136.48}
          height={177.577}
          path={GLYPH_PATHS.s}
          strokes={[
            { d: "M26 30H107", width: 17, delay: 0.58, duration: 0.18 },
            {
              d: "M96 33V58C70 45 36 54 30 69C26 86 39 98 55 92C77 86 96 79 103 97C110 115 79 132 50 122C39 118 30 110 29 111C27 124 54 125 67 132C69 146 83 155 91 147",
              width: 24,
              delay: 0.72,
              duration: 0.88,
            },
          ]}
        />
        <SignatureGlyph
          id={staticLogo ? "t-static" : "t"}
          className="glyph-t"
          width={130.976}
          height={184.11}
          path={GLYPH_PATHS.t}
          strokes={[
            {
              d: "M48 28V141C48 166 84 162 88 131",
              width: 24,
              delay: 1.5,
              duration: 0.46,
            },
            { d: "M25 61H106", width: 17, delay: 1.91, duration: 0.2 },
          ]}
        />
        <SignatureGlyph
          id={staticLogo ? "h-static" : "h"}
          className="glyph-h"
          width={163.84}
          height={218.255}
          path={GLYPH_PATHS.h}
          strokes={[
            {
              d: "M28 26C47 33 60 58 59 88V192",
              width: 24,
              delay: 2.03,
              duration: 0.42,
            },
            {
              d: "M59 157C69 127 94 110 115 121C139 135 133 168 111 190",
              width: 25,
              delay: 2.36,
              duration: 0.42,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default function App() {
  const enterHome = useCallback(() => {
    document.querySelector("#home")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Italiana:Regular';
          src: url('https://static.figma.com/font/Italiana-Regular_1') format('woff2');
          font-style: normal;
          font-weight: 400;
          font-display: swap;
        }
        @font-face {
          font-family: 'Manrope:Light';
          src: url('https://static.figma.com/font/Manrope_wght__1') format('woff2');
          font-style: normal;
          font-weight: 300;
          font-display: swap;
        }
        @font-face {
          font-family: 'Manrope:SemiBold';
          src: url('https://static.figma.com/font/Manrope_wght__1') format('woff2');
          font-style: normal;
          font-weight: 600;
          font-display: swap;
        }
        :root {
          color: #fff;
          background: #080808;
          font-family: 'Manrope:Light', Manrope, sans-serif;
          font-synthesis: none;
        }
        html {
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
          background: #080808;
        }
        body { background: #080808; }
        button { font-family: inherit; }
        .landing-page {
          min-height: 100dvh;
          overflow-x: hidden;
          background: #080808;
        }
        .landing-page .panel {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          overflow: hidden;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          background: #080808;
        }
        .panel::before {
          content: '';
          position: absolute;
          z-index: -4;
          inset: -5%;
          background-image: url('/assets/landing/91b2f.jpg');
          background-size: cover;
          background-position: center;
          filter: blur(18px);
          transform: scale(1.08);
        }
        .scene-image {
          position: absolute;
          z-index: -3;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          pointer-events: none;
          user-select: none;
        }
        .panel::after {
          content: '';
          position: absolute;
          z-index: -2;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(0,0,0,.549) 0%, rgba(0,0,0,.4) 48%, rgba(0,0,0,.271) 72%, transparent 100%),
            linear-gradient(180deg, rgba(0,0,0,.314) 0%, transparent 28%, transparent 70%, rgba(0,0,0,.659) 100%);
        }
        .gateway {
          display: grid;
          place-items: center;
          padding:
            max(42px, env(safe-area-inset-top))
            max(28px, env(safe-area-inset-right))
            max(42px, env(safe-area-inset-bottom))
            max(28px, env(safe-area-inset-left));
        }
        .invitation {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: center;
          gap: 56px;
        }
        .signature-stage {
          --intro-shift: clamp(96px, 15.5vh, 182px);
          position: relative;
          width: 320px;
          height: 195px;
          flex: none;
          transform-origin: 50% 50%;
          animation: signature-settle 3.55s cubic-bezier(.76,0,.24,1) both;
          backface-visibility: hidden;
          will-change: transform;
        }
        .signature-art {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 320px;
          height: 195px;
          transform: translate(-50%, -50%);
        }
        .signature-glyph {
          position: absolute;
          display: block;
          shape-rendering: geometricPrecision;
        }
        .glyph-i { left: -24px; top: -0.54px; }
        .glyph-s { left: 30.72px; top: 41.42px; }
        .glyph-t { left: 119.78px; top: 10.18px; }
        .glyph-h { left: 180.16px; top: -24px; }
        .ink-stroke {
          opacity: 0;
          stroke-dasharray: 0 1;
          stroke-dashoffset: 0;
          animation: write-stroke var(--stroke-duration) linear var(--stroke-delay) forwards;
          will-change: stroke-dasharray;
        }
        .completed-glyph {
          opacity: 0;
          animation: finish-glyph .01s linear 2.78s forwards;
        }
        .editorial,
        .explore {
          opacity: 0;
          animation: reveal-content .8s cubic-bezier(.22,1,.36,1) 3.16s forwards;
        }
        .editorial {
          display: flex;
          width: min(980px, 100%);
          flex-direction: column;
          align-items: center;
          gap: 24px;
          text-align: center;
          transform: translateY(18px);
        }
        .editorial h1 {
          margin: 0;
          color: #fff;
          font-family: 'Italiana:Regular', Italiana, serif;
          font-size: clamp(40px, 3.9vw, 56px);
          font-style: normal;
          font-weight: 400;
          letter-spacing: -0.8px;
          line-height: 1.08;
        }
        .editorial p {
          margin: 0;
          width: min(620px, 100%);
          color: #d0d0d0;
          font-family: 'Manrope:Light', Manrope, sans-serif;
          font-size: 15px;
          font-style: normal;
          font-weight: 300;
          line-height: 1.7;
        }
        .explore {
          display: flex;
          width: 278px;
          height: 58px;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #fff;
          padding: 0 25px;
          color: #080808;
          background: #fff;
          cursor: pointer;
          transform: translateY(14px);
          transition: color .3s ease, background-color .3s ease;
        }
        .explore span {
          font-family: 'Manrope:SemiBold', Manrope, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.1px;
          line-height: normal;
          text-transform: none;
        }
        .explore svg {
          flex: none;
          transition: transform .3s cubic-bezier(.22,1,.36,1);
        }
        .explore:hover { color: #fff; background: transparent; }
        .explore:hover svg { transform: translateX(5px); }
        .explore:hover path { stroke: #fff; }
        .explore:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 5px;
        }
        .home {
          display: flex;
          align-items: center;
          padding:
            max(clamp(28px, 5vw, 72px), env(safe-area-inset-top))
            max(clamp(28px, 5vw, 72px), env(safe-area-inset-right))
            max(clamp(28px, 5vw, 72px), env(safe-area-inset-bottom))
            max(clamp(28px, 5vw, 72px), env(safe-area-inset-left));
        }
        .home::before {
          background-position: 58% center;
          transform: scale(1.08);
          filter: contrast(1.04);
        }
        .home::after {
          background:
            linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.45) 52%, rgba(0,0,0,.1) 100%),
            linear-gradient(180deg, rgba(0,0,0,.35), transparent 35%, rgba(0,0,0,.56));
        }
        .home-nav {
          position: absolute;
          top: clamp(24px, 4vw, 52px);
          left: clamp(28px, 5vw, 72px);
          right: clamp(28px, 5vw, 72px);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .home-mark {
          position: relative;
          width: 112px;
          height: 68px;
        }
        .home-mark .signature-stage { transform: scale(.35); transform-origin: 0 0; }
        .home-kicker,
        .home-index {
          font-family: 'Manrope:SemiBold', Manrope, sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2.2px;
          text-transform: uppercase;
        }
        .home-copy {
          width: min(760px, 90vw);
          padding-top: 6vh;
        }
        .home-copy p {
          margin: 0 0 24px;
          color: #d0d0d0;
          font-size: 12px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
        }
        .home-copy h2 {
          margin: 0;
          font-family: 'Italiana:Regular', Italiana, serif;
          font-size: clamp(54px, 7.6vw, 108px);
          font-weight: 400;
          letter-spacing: -1.6px;
          line-height: .96;
          text-wrap: balance;
        }
        .home-copy .home-note {
          max-width: 430px;
          margin: 34px 0 0;
          color: #d0d0d0;
          font-family: 'Manrope:Light', Manrope, sans-serif;
          font-size: 14px;
          letter-spacing: 0;
          line-height: 1.7;
          text-transform: none;
        }
        @keyframes write-stroke {
          0% { opacity: 0; stroke-dasharray: 0 1; }
          1% { opacity: 1; }
          100% { opacity: 1; stroke-dasharray: 1 1; }
        }
        @keyframes finish-glyph { to { opacity: 1; } }
        @keyframes signature-settle {
          0%, 79% { transform: translateY(var(--intro-shift)) scale(1.72); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes reveal-content {
          to { opacity: 1; transform: translateY(0); }
        }
        .signature-stage--static { animation: none; }
        .signature-stage--static .ink-stroke {
          animation: none;
          opacity: 1;
          stroke-dasharray: 1 1;
        }
        .signature-stage--static .completed-glyph { animation: none; opacity: 1; }
        @media (max-height: 760px) and (min-width: 641px) {
          .gateway { padding-block: 32px; }
          .invitation { gap: 26px; transform: scale(.82); }
          .signature-stage { --intro-shift: clamp(90px, 18vh, 135px); }
        }
        @media (max-width: 640px) {
          .gateway {
            padding:
              max(30px, env(safe-area-inset-top))
              max(20px, env(safe-area-inset-right))
              max(28px, env(safe-area-inset-bottom))
              max(20px, env(safe-area-inset-left));
          }
          .invitation { gap: 34px; }
          .signature-stage {
            --intro-shift: clamp(105px, 17vh, 150px);
            width: 250px;
            height: 152px;
            animation-name: signature-settle-mobile;
          }
          .signature-art { transform: translate(-50%, -50%) scale(.78); }
          .editorial { gap: 18px; }
          .editorial h1 { font-size: clamp(36px, 11.2vw, 46px); letter-spacing: -.5px; }
          .editorial p { font-size: 13px; line-height: 1.65; }
          .explore { width: min(278px, 88vw); }
          .home { align-items: flex-end; padding-bottom: 13vh; }
          .home-copy { width: 100%; }
          .home-copy h2 { font-size: clamp(52px, 17vw, 76px); }
          .home-index { display: none; }
          @keyframes signature-settle-mobile {
            0%, 79% { transform: translateY(var(--intro-shift)) scale(1.32); }
            100% { transform: translateY(0) scale(1); }
          }
        }
        @media (max-width: 380px) {
          .invitation { gap: 27px; }
          .signature-stage {
            width: 220px;
            height: 134px;
          }
          .signature-art { transform: translate(-50%, -50%) scale(.6875); }
          .editorial h1 { font-size: clamp(32px, 10.8vw, 39px); }
          .editorial p { font-size: 12px; }
          .explore { height: 54px; padding-inline: 21px; }
        }
        @media (max-height: 680px) and (max-width: 640px) {
          .gateway { padding-block: 20px; }
          .invitation { gap: 20px; }
          .signature-stage {
            --intro-shift: clamp(72px, 14vh, 96px);
            width: 210px;
            height: 128px;
          }
          .signature-art { transform: translate(-50%, -50%) scale(.65625); }
          .editorial { gap: 12px; }
          .editorial h1 { font-size: clamp(29px, 8.8vw, 36px); }
          .editorial p { line-height: 1.5; }
          .explore { height: 50px; }
        }
        @media (min-width: 1800px) {
          .editorial h1 { font-size: 60px; }
          .invitation { gap: 60px; }
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .signature-stage,
          .ink-stroke,
          .completed-glyph,
          .editorial,
          .explore {
            animation: none !important;
          }
          .signature-stage { transform: none; }
          .ink-stroke { opacity: 1; stroke-dasharray: 1 1; }
          .completed-glyph,
          .editorial,
          .explore { opacity: 1; transform: none; }
          .explore svg { transition: none; }
        }
      `}</style>

      <main className="landing-page">
        <section className="panel gateway" aria-label="ISTH invitation">
          <img
            className="scene-image"
            src="/assets/landing/91b2f.jpg"
            alt=""
            width="1264"
            height="848"
            decoding="async"
            fetchPriority="high"
          />
          <div className="invitation">
            <Signature />

            <div className="editorial">
              <h1>
                Embrace the fragrance.
                <br />
                Become isth.
              </h1>
              <p>
                An intimate art. An invisible signature.
                <br />
                Discover fragrances that become a part of you.
              </p>
            </div>

            <button className="explore" type="button" onClick={enterHome}>
              <span>Explore the collection</span>
              <svg
                aria-hidden="true"
                width="24"
                height="15"
                viewBox="0 0 23.6714 14.6674"
                fill="none"
              >
                <path
                  d="M0 7.33368H23M16.7273 14.3337L23 7.33368L16.7273 0.33368"
                  stroke="currentColor"
                />
              </svg>
            </button>
          </div>
        </section>

        <section className="panel home" id="home" aria-labelledby="home-title">
          <img
            className="scene-image"
            src="/assets/landing/91b2f.jpg"
            alt=""
            width="1264"
            height="848"
            decoding="async"
            loading="lazy"
          />
          <nav className="home-nav" aria-label="ISTH collection">
            <div className="home-mark">
              <Signature staticLogo />
            </div>
            <span className="home-index">Fragrance collection · 01</span>
          </nav>
          <div className="home-copy">
            <p>The art of becoming</p>
            <h2 id="home-title">Fragrance as a second skin.</h2>
            <p className="home-note">
              Intimate compositions designed to live with you—never entering a room before you do,
              never leaving before you are ready.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
