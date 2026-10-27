# Atelier and Master Editor implementation plan

## Project structure
- `client/src/pages/Home.tsx`: public storefront and new Atelier carousel.
- `client/src/pages/Admin.tsx`: authenticated admin workspace and editors.
- `client/src/lib/supabase.ts`: public reads, admin RPC writes, storage uploads/deletes.
- `client/src/index.css`: existing isth visual system plus responsive Atelier/admin styles.
- `supabase/migrations/`: persistent `site_settings` payload extensions and controlled Atelier storage paths.

## Design movement
Quiet editorial atelier: asymmetric whitespace, restrained wine/cherry accents, and typography-led controls that continue the current isth fragrance-house language.

## Core principles
- The public Atelier section is media-led but remains readable on every viewport.
- Media, responsive variants, description, and order are one persisted item.
- Admin controls are explicit about upload, save, delete, and failure states.
- Existing Supabase auth, RLS, RPC, and public storage are reused.

## Implementation
- Replace the public Nakshatra block with Atelier and preserve its existing image as the first item fallback.
- Store Atelier items and website content as validated JSON in `site_settings` through extended `admin_set_site_setting` RPC support.
- Add separate large/small image fields, optional video fields, reorder/delete, description rich text, and 2–3 second autoplay with inactive video cleanup.
- Add a Website Content editor for the public Home and About text registry, including contenteditable rich text preview and formatting.
- Add a Supabase migration to expand allowed setting keys and Atelier storage folder policies.

## Typography
Use the existing local Amsterdam One asset and the existing project font assets. Font choices unsupported by a local/licensed asset are listed in the final summary rather than silently misrepresented.

## Brand essence
isth is a quiet, intimate fragrance house for people who prefer a personal signature over a loud announcement: tactile, poetic, considered.
