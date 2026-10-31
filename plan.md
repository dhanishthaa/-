# Atelier carousel and content transfer plan

## Project structure
- `client/src/pages/Home.tsx`: public storefront section order; remove the screenshot-matched standalone story block while retaining the dedicated About route.
- `client/src/components/Atelier.tsx`: public Atelier carousel, responsive media, matching captions/descriptions, and timed rotation.
- `client/src/lib/supabase.ts`: Atelier media model, default paired content, public reads, and existing admin RPC writes.
- `client/src/components/AdminAtelier.tsx`: authenticated editor for each Atelier image, caption, description, order, and responsive media.
- `client/src/atelier-editor.css`: border-free editorial layout and restrained carousel transitions across breakpoints.
- `supabase/migrations/`: existing `atelier_master_editor` migration already supports the `atelier` setting and Atelier media folders; no new schema change is expected.

## Design movement
Quiet editorial atelier: asymmetric whitespace, restrained wine/cherry accents, and typography-led layout that continues the current isth fragrance-house language and supplied visual reference.

## Core principles
- The public Atelier section is media-led but remains readable on every viewport.
- Each image, responsive variant, caption, description, and order stay paired as one persisted item.
- The active image and its specific description change together on a five-second loop.
- Atelier media frames have no border or shadow; slide counts and carousel arrows are not displayed.
- Admin controls are explicit about upload, save, delete, and failure states.
- Existing Supabase auth, RLS, RPC, and public storage are reused.

## Implementation
- Preserve the existing Figma Atelier composition as a fallback item and add the screenshot-matched story image and its “Between the familiar & the unknown” copy as the first Atelier item.
- Remove only the standalone homepage story section represented in the supplied screenshot; keep the separate About page and unrelated story image uses intact.
- Load Atelier items from the existing public `site_settings` setting, with paired local defaults when no setting exists. Advance image, caption, and description together every five seconds; do not display slide numbering or carousel arrows, pause while a user focuses the section, and respect reduced-motion preference.
- Retain the admin media-and-description editor, and expose the per-image caption alongside its existing paired media and rich-text description controls.
- Reuse the already-deployed `admin_set_site_setting` support for `atelier`; do not apply a redundant Supabase schema migration.
- Keep the existing invitation, chapter hierarchy, responsive layout, and site typography; remove the obsolete screenshot-section markup from Home.

## Typography
Use the existing local Amsterdam One asset and the existing project font assets. Font choices unsupported by a local/licensed asset are listed in the final summary rather than silently misrepresented.

## Brand essence
isth is a quiet, intimate fragrance house for people who prefer a personal signature over a loud announcement: tactile, poetic, considered.
