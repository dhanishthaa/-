# Optimization audit notes

The desktop Home hero preserves the editorial hierarchy, transparent navigation, logo contrast, and balanced CTA grouping after the modal refactor. The About masthead remains clean, centered at the top, and visually unaffected by the product-dialog changes.

The product modal is now controlled by the shared dialog abstraction, with a responsive image-or-placeholder media column, structured format/notes/composition metadata, and GPU-friendly open/close animation rules. Product records without an image continue to receive the editable bottle placeholder; the admin ProductEditor already exposes an Image URL field for every product.

At the 375px smartphone viewport, the Home hero remains fully contained with readable type, thumb-friendly CTAs, and a right-aligned hamburger. The About page keeps the same navigation language, responsive masthead, readable body copy, and image containment; no new overflow or stacking regression appeared in the top viewport.

At the 768px tablet viewport, both Home and About switch to the compact navigation without clipping. The Home hero retains its editorial composition and CTA alignment, while About preserves image containment and single-color Cherry metadata. The tablet view shows no new overflow or broken hierarchy in the captured viewport.
