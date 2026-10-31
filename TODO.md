# Implementation outcomes

- [x] Remove the current public Atelier section completely, including the Nakshatra image and all “Coming Soon” text, without changing other public sections.
- [x] Run the supplied `setup-figma.py` workflow to transfer `code.jsx` and the provided Figma assets into the React application.
- [x] Recreate the supplied 1440×920 white editorial composition with the black-and-white perfumer gesture image and caption on the left.
- [x] Implement the right-side editorial hierarchy with the original chapter label, `[ 01 ]` marker, `L’Atelier` title, editorial statement, descriptive copy, craft philosophy, and `ENTER THE ATELIER` invitation.
- [x] Make the invitation a semantic anchor with a clear hover and keyboard-focus state, preserving the supplied arrow asset.
- [x] Replace the supplied embedded image URLs with local assets at `/assets/3-5.webp` and `/assets/3-23.svg`.
- [x] Verify the final implementation against `frame.webp` at the desktop reference size and responsive viewport sizes, then resolve any visual or loading differences.
- [x] Remove the standalone homepage section shown in the supplied screenshot (“Between the familiar & the unknown.”); move its image and its matching heading/description into Atelier as a paired image-and-description item. Keep the separate About page route and unrelated uses of that asset intact.
- [x] Ensure the Atelier image frame has no border.
- [x] Automatically change Atelier images every few seconds; each image must have its own specific description, and the description beside it must change in sync with the image.
- [x] Keep the Atelier admin editor able to manage each paired image, caption and description. Reuse the existing Supabase `atelier` setting/RPC and schema support; make no redundant database migration.
- [x] Keep carousel interaction responsive and usable: remove the slide-number indicators and previous/next arrows, use the item's responsive image URLs, pause autoplay while a user focuses the Atelier section, and respect reduced-motion preferences.
