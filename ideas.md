# ISTH — Design Direction

## Three stylistic approaches considered

### Approach 01 — Quiet Atelier
**Very Brief Intro:** A pale ivory studio language with oversized serif typography, quiet product still lifes, and a restrained cherry accent. It feels like a private fragrance salon: tactile, composed, and contemporary without becoming sterile.

**Probability:** 0.07

### Approach 02 — Midnight Extraction
**Very Brief Intro:** A lacquered ink interface with wine-red lighting, cinematic product close-ups, and a more nocturnal, mysterious mood. It would foreground ritual, depth, and after-dark sensuality.

**Probability:** 0.03

### Approach 03 — Modern Herbarium
**Very Brief Intro:** A light botanical editorial system using parchment, muted sage, and archival labels to make the fragrance notes feel collected and catalogued. It would be warmer, more artisanal, and more visibly ingredient-led.

**Probability:** 0.05

## Chosen approach — Quiet Atelier

### Design Movement
Contemporary luxury editorial, informed by quiet luxury, fashion lookbooks, and modern fragrance packaging rather than traditional e-commerce grids.

### Core Principles
1. **Restraint over decoration:** large calm fields, thin rules, and selective cherry moments create confidence without visual noise.
2. **Motion as ritual:** the landing sequence unfolds like a bottle being revealed; scroll transitions are slow, weighty, and purposeful.
3. **Typography as atmosphere:** an elegant display serif carries emotion while a compact grotesk handles navigation and product metadata.
4. **Asymmetric editorial composition:** products sit in offset columns and staggered frames so the page feels curated, not mechanically tiled.

### Color Philosophy
The canvas is a warm **#F5F1EB** ivory so every object feels like it is resting on paper. Ink **#111111** gives the navigation, dark transition bands, and footer visual gravity. Cherry **#5B0D18** appears as an ownable, low-frequency accent for selected states, hero light, and intimate callouts; **#7A1725** is reserved for hover and atmospheric transitions. Gold **#B59A62** is used only as a hairline, small label, or tiny mark so it reads as foil, not a generic luxury gradient.

### Layout Paradigm
The page begins as a full-bleed, vertically staged landing sequence and resolves into an offset editorial home page. Product cards use a 12-column rhythm on large screens, but the composition breaks the rhythm with one featured bottle, a narrow notes rail, and occasional full-width dark passages. On small screens the layout keeps the same hierarchy by reflowing into stacked stories instead of hiding sections.

### Signature Elements
1. A paper-soft grain and faint cherry atmospheric light that keep the ivory canvas tactile.
2. Oversized numeric collection markers paired with small monospaced metadata.
3. Product images that lift, rotate by a degree, and reveal a restrained cherry “Buy now” action on hover.

### Interaction Philosophy
Interactions should feel like handling a perfume bottle: precise, quiet, and responsive. Hover states are slight lifts, underline reveals, and tint shifts rather than loud scale effects. Buttons have clear tactile feedback, keyboard focus is visible, and the mobile menu behaves like a side panel drawn from the edge of the page.

### Animation
The landing page uses a short signature reveal, a slow parallax on the hero field, and a controlled crossfade into the storefront. In-page elements reveal upward in staggered groups with 30–70ms offsets. Product hover motion uses only transform and opacity, with a 220ms–360ms custom ease. The marquee loops slowly and pauses on hover. All non-essential motion is disabled under `prefers-reduced-motion`.

### Typography System
Display: **Playfair Display** with italic emphasis for fragrance names and poetic statements. Body: **DM Sans** for readability and compact UI. Metadata: **IBM Plex Mono** in uppercase with wide tracking. The wordmark is a custom text treatment in a high-contrast serif with a thin gold mark, never a default bold sans-serif.

### Brand Essence
**ISTH is a modern fragrance house for people who want a scent to feel like a personal signature, not a category label; it pairs familiar notes with an unexpected, composed finish.**

Personality adjectives: **composed, intimate, assured**.

### Brand Voice
Headlines sound sparse and evocative. CTAs are direct and calm. Microcopy is specific, never inflated, and avoids generic promises.

Example lines:

> Wear the quiet after the room has changed.

> Find the note that stays with you.

### Wordmark & Logo
The mark is a compact **ISTH** ligature with a small offset cherry dot that reads like a perfume atomizer bead. The full wordmark uses a high-contrast serif with custom letter spacing and a tiny gold crossbar detail; the symbol can stand alone as a favicon.

### Signature Brand Color
**ISTH Cherry — #5B0D18.** It is deep enough to feel grown-up and muted enough to sit beside ivory for long periods without becoming loud.

## Reference ground truth

The supplied tall screenshot is the primary visual reference: a nearly full-height editorial hero with a pale warm-grey background, cropped fashion figures, a small top-left wordmark, a centered minimal menu icon, and a small utility icon at top right. The backup reference confirms the desired behavior: full-bleed hero staging, sparse fixed navigation, a short collection statement, product-led editorial sequencing, and generous vertical breathing room. Where the screenshot is silent, ISTH-specific product content and the palette supplied in `pasted_content_2.txt` take priority.
