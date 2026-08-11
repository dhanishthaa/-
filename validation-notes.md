# Landing transition validation notes

The fresh landing route renders the flower-blur background, typewriter HELLO, isth logo, quote, and Explore the Collection CTA correctly at the top of the page. After one viewport scroll, the route remains on SS1 with the upper portion of the landing surface still visible and no premature redirect, which is expected before the handoff threshold.

Continuing the scroll past the handoff threshold navigated to `/home` successfully. The home route rendered its hero, navigation, collection content, and contact/footer content without a dead-end. A fresh reload of `/` restored the landing composition with the flower-blur background, typewriter HELLO, logo, quote, and CTA.

At the partial-fold test point, the top edge of the landing surface remained visible while most of the viewport showed the dark stage underlay. A live-DOM probe ran after the route had already transitioned, so it returned no landing elements; the handoff timing itself remains active and needs a more stable style check.

At a fresh top-of-page load, the landing stage and curtain surface are present, the curtain transform is identity, the filter is `blur(0px)`, and the stage underlay includes the home editorial image URL.

The browser scroll helper advances far enough to trigger the delayed route change before a follow-up computed-style probe can run; the probe therefore sees the home route. The automatic handoff is confirmed, but partial-frame inspection requires a held interaction rather than a full viewport scroll.

A controlled console scroll to 320px confirmed the landing stage and curtain surface are mounted, the underlay pseudo-element displays the home editorial image, and the curtain is still at its initial transform until the next animation frame applies the scroll progress.

After allowing the SS1 page itself to overflow visibly, the computed stage position remains `sticky` with `stageTop: 0` at `scrollY: 320`; the curtain now folds in place over the viewport instead of sliding away and exposing the stage background.

Visual inspection at the mid-fold and near-threshold positions shows the flower-blur curtain compressing smoothly over the home editorial hero underlay, with the landing copy remaining centered and readable. A thin white progress seam is visible at the curtain edge and should be removed so the fold reads as one continuous surface.

After removing the seam, the fold edge reads cleanly. A direct programmatic scroll to 720px showed the curtain compressed over the home hero while the landing route was still mounted; the route-change behavior remains separately confirmed by the native scroll-helper test.

The final native scroll past the threshold transitioned to `/home` successfully. The home page content, navigation, product collection, Nakshatra, About, Queries, and footer were all present after the handoff.
