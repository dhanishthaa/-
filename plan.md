# Homepage editorial story and Atelier plan

## Project structure
- `client/src/pages/Home.tsx`: public homepage sections, the responsive code-built story section, and the home footer.
- `client/src/pages/About.tsx`, `ProductDetail.tsx`, `ChoosingAFragrance.tsx`: route footers sharing the concise Instagram icon-and-label treatment.
- `client/src/components/Atelier.tsx`: border-free public Atelier carousel with matching image descriptions.
- `client/src/atelier-editor.css` and `client/src/index.css`: editorial layout, local image frames, typography, color palette, and responsive rules.
- `client/src/lib/supabase.ts` and `client/src/components/AdminAtelier.tsx`: Atelier default media and admin editor backed by existing Supabase support.

## Design movement
Quiet editorial product storytelling: warm muted olive-beige, charcoal ink, Italiana display typography, restrained Manrope labels/body, asymmetric framed photography, and no decorative frame borders.

## Core principles
- Do not render the supplied story-section composite as an entire content image; use real semantic text and separate photographic elements.
- Match the visual's copy, hierarchy, typography, palette, image proportions and placement on desktop, then reflow cleanly on mobile.
- Keep photo frames borderless and shadowless.
- Make every footer Instagram link concise and recognizable: Instagram icon plus the label “Instagram,” with no “ISTH on.”
- Preserve the existing five-second Atelier image/description rotation and all unrelated site sections.

## Implementation
- Replace the `isth-after-hero-story.png` section image with accessible HTML for “THE HOUSE OF ISTH,” “Made for the stories on skin.”, the supplied supporting paragraph, the “READ OUR STORY” link, and the vertical brand note.
- Use separate photo elements in borderless, responsive frames: the left perfume photograph extracted from the composite's photograph region as a standalone optimized asset, and the existing linen/hand editorial photograph on the right.
- Reuse project-local Italiana and Manrope fonts, sample the reference's warm beige background and dark text, and use responsive CSS to preserve the desktop composition without flattening text into an image.
- Update Home, About, ProductDetail and Choosing a Fragrance footers to display the Instagram icon and “Instagram” label only.
- Reuse existing assets, routes and Supabase features; no database changes are needed.

## Brand essence
isth is a quiet, intimate fragrance house for people who prefer a personal signature over a loud announcement: tactile, poetic, considered.
