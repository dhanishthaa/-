# Editorial Direction Audit

## Reference Findings — Set 1

The supplied references are **directional only** and will not be used as website assets. Their useful qualities are the intentional editorial whitespace, high-contrast monochrome framing, grain-softened photographic atmosphere, oversized cropped type, precise vertical rhythm, and subtle tension between tactile imagery and quiet graphic structure.

For isth, this translates to a restrained fragrance-magazine layer over the existing ivory, ink, and cherry palette: framed image moments, low-opacity editorial rules, controlled blur fields, large serif headline moments, fine mono captions, and slow opacity/transform-based reveals. No new brand colors, font families, product text, or product layouts will be introduced.

## Reference Findings — Set 2

The next references reinforce **overscaled cropped typography behind imagery**, art-directed negative space, portrait-format image blocks, and immersive image surfaces with soft atmospheric contrast. The implementation should therefore create magazine-like depth through CSS framing rather than copying the supplied people or artworks: select existing perfume image areas can receive oversized background wordforms, controlled clipping, directional light/blur overlays, and graphic labels that remain subordinate to the protected product details.

## Reference Findings — Set 3

This pair contributes an idea of **sensory atmosphere through illumination** and **single-subject editorial collision**. For isth, neither the supplied blue lighting nor the orange illustration will be used. Instead, the existing cherry/ink/ivory system can deliver the same emotional depth through blurred cherry light leaks, ivory haze, carefully placed ingredient silhouettes, and oversized restrained letterforms behind—not on top of—important product metadata.

## Reference Findings — Set 4

The magazine-cover references use a strong outer frame, columnar image windows, oversized masthead crops, compact issue metadata, and strict alignment. Rather than introducing new cover text or changing isth content, the website can borrow this discipline through non-textual section frames, clipped multi-panel media arrangements using the existing imagery, small existing eyebrow labels, and controlled vertical editorial cadence. The effect should feel like pages in a single isth issue—not like a copied fashion poster.

## Reference Findings — Set 5

The final attributes from this pair are **one decisive visual gesture per page**, substantial whitespace, low-contrast paper-like grain, and deliberately cropped typography. For the isth site, this implies each major section should receive one focused visual motif—not many unrelated decorations. Existing product and ingredient imagery should be recast inside quiet border frames, while CSS-only paper grain, misted edges, and restrained cherry wash create the editorial materiality.

## Reference Findings — Set 6

The remaining references add lightly drawn grid frames, diffused image edges, optical blur, and gradual movement traces. These translate cleanly into the website as low-opacity layout rules, framed media masks, soft variable blur glows, and transform/opacity hover states. The unrelated subjects, colors, wording, and supplied images remain excluded.

## Implementation Boundaries

The landing route remains untouched. The Home page and standalone About page will retain their existing copy, product descriptions, product display structure, brand colors, and font families. The work is limited to editorial layout treatment, CSS visual effects, smooth interactions, responsive spacing, and any new asset strictly generated for isth if an existing local asset cannot support the intended composition.

## Current Site Audit

The Home page already has a clear signature foundation: the warm ivory/ink/cherry palette, full-bleed hero, image-led product cards, cinematic quote band, Nakshatra panel, notes imagery, and compact mono metadata are appropriate to preserve. The redesign should heighten their editorial relationship rather than replace the existing page hierarchy.

The main opportunities are: giving the product library less mechanical repetition through framing and staggered interruption; increasing paper, glass, and blur materiality; turning the existing story region into a more art-directed spread; introducing one focused editorial motif per major section; and recasting the About page from centered brochure into an offset, archive-like composition with thin rules and framed surfaces. Large shadows and generic pill/card behaviour should be reduced in favour of flatter paper fields and hairline borders.

## Approved Implementation Direction

The Home and About pages will use an isth-specific editorial grammar: subtle ivory paper grain, fine rule frames, blurred botanical/ingredient atmosphere using existing imagery, clipped editorial image windows, understated oversized typographic crops, controlled cherry haze, micro-caption rails, gentle hover parallax, and motion based only on opacity and transforms. No supplied reference image will enter the repository or website.

## Editorial Design System

| Element | isth implementation | Content protection |
| --- | --- | --- |
| Paper and glass | Ivory paper grain, quiet translucent overlays, hairline rules, and frosted edges using existing brand neutrals. | No new palette colors. |
| Image treatment | Existing product, botanical, and hero imagery placed inside clipped frames with controlled haze and subtle zoom-on-hover. | No supplied reference imagery; product images and labels remain unchanged. |
| Typography | Existing Playfair serif headlines and IBM Plex Mono metadata, re-spaced into cropped editorial moments. | No font-family additions; no copy rewrites. |
| Section rhythm | One dominant motif per section: hero frame, collection paper spread, cinematic quote overlay, cherry constellation panel, botanical story spread, and contact folio. | Existing section order and wording remain intact. |
| Motion | Low-distance transform and opacity reveals, image drift, and hover elevation only. Reduced-motion support remains in force. | No disruptive or autoplay-dependent motion. |

## Home Verification Notes

Desktop and mobile checks confirm the Home page preserves its protected hierarchy and content while gaining the intended magazine surface: thin frames, paper-like depth, editorial image treatment, controlled cherry atmosphere, and offset product cadence. The mobile version collapses the visual grid cleanly without introducing horizontal overflow or losing the existing product-card sequence. The next pass will bring the About page into the same system through structure and styling, not copy changes.

## Final Visual Verification

The desktop Home page now reads as a continuous fragrance editorial with framed hero, curated collection field, cinematic floral quote spread, restrained Nakshatra constellation panel, botanical story layout, and contact folio. The desktop About page now uses an asymmetric masthead, archival misted feature panel, offset narrative columns, hairline quote panel, and folio CTA. Mobile checks confirm that the About page preserves its reading order, content, controls, and footer links while scaling the framing and decorative forms down cleanly.

## Correction Note

The prior magazine pass overemphasised decorative frames instead of image-led storytelling. All extra frames, circles, outlines, borders, and boxed treatments were removed from the Home and About sections. The next implementation uses original generated isth visuals directly in the hero, collection, Nakshatra, and About compositions; supplied reference files remain excluded.

## Frame Removal Verification

Desktop verification confirms the Home and About pages no longer use the rejected decorative frame, circle, or boxed-card language. Functional navigation and actions remain usable, while the page surfaces are now intentionally open for the image-led compositions that follow.

## Final No-Frame Check

Desktop and mobile verification confirm the remaining decorative pseudo-elements and rounded action boxes are removed. The Home and About pages now retain only functional navigation, product controls, and content hierarchy; no decorative frame, circle, card outline, or pill treatment from the rejected editorial pass remains.

## Image-Led Correction Verification

The corrected desktop implementation now uses original isth-specific campaign imagery as the primary visual language: a cinematic people-led Home hero, a collection still-life spread, an abstract non-product Nakshatra visual, and a tactile About feature photograph. The existing product display and copy remain present, but visual storytelling now comes from full compositional imagery rather than decorative framing.

## Mobile Image-Led Check

Mobile verification confirms the new Home hero, collection still-life, Nakshatra atmosphere, story image, and standalone About feature all scale cleanly in a single-column editorial flow. No decorative frames were reintroduced, and the protected product grid, copy, navigation, and footer remain readable and operational.

## Clean Stylesheet Verification

The obsolete frame-heavy Home/About CSS block has now been deleted rather than masked with overrides. A final Home render confirms the featured product images remain available, while the generated campaign art carries the visual hierarchy across the hero, collection, Nakshatra, story, and About spreads.

## Mobile SS1 Lifecycle Check

The landing lifecycle now explicitly resets its ready, signature-complete, progress, and exiting states on entry and on a persisted mobile page restore. Smartphone first-load verification shows the full cherry SS1 field and signature mark before the delayed floral completed state; the mobile hold is intentionally longer than desktop so the opening cannot be skipped.
