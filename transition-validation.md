# Transition validation

The shortened landing scroll test starts at `/`, mounts the HELLO landing, and after one viewport scroll transitions to `/home`. The resulting route content begins with the transparent home header and hero copy “A scent can change the air.”; the browser does not land on the `#collection` section. Home entry now resets `window.scrollTo(0, 0)` on mount.

The direct Explore the Collection test also routed to `/home`; extracted content showed the home header, hero, collection, and remaining storefront sections, with no `#collection` anchor appended to the URL.
