# Production asset hosting diagnosis

The deployed `isth.in` site was requesting the logo and visual media from `/manus-storage/...`. Those URLs returned HTTP 404 on `isth.in`, while the same assets were available from the Manus preview server. That is why the background images and logo were missing after the GitHub deployment.

The project now includes the eight required visual assets under `client/public/assets/`, and all public storefront references use `/assets/...`. The local preview resolves the logo with nonzero dimensions and requests the landing flower image and editorial hero from `/assets/...` successfully. The GitHub deployment must be updated with these committed files before `isth.in` changes.
