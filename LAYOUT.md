# Vino Luxury Watches — release notes

**Vino Luxury Watches** (package `vino-luxury-watches`) is a Layout of the Selldone shop **Watchino** (xapi `watchino`), built for **vino.selldone.shop**. It is a skin of the Layout base (see [`BASE.md`](BASE.md)): everything that makes it this Layout is `skins/vino/skin.json` and `skins/vino/photos/`; the code, the flows and the checks are the base's.

## Setup

| Area | What is set |
| --- | --- |
| Repo | `vino-layout`, branch `main`; remote `upstream` (selldone/storefront, fetch only, push disabled); `origin` = `selldone-custom-layouts/official-vino` once published (`scripts/publish-github.sh`) |
| Names | `manifest.json` and `selldone-layout.json` from the skin (`package` is permanent after the first upload; the `description` must be right on the FIRST upload, Selldone keeps it) |
| Dev server | port **9173**, shop `watchino` (`.env`); `npm run serve` (launch entry `vino-layout`) |
| Skin | Blued steel, Racing green, Burgundy, Bronze (brand `steel`), Bodoni Moda over Archivo, radius 6 / 4 px, basket word "basket" |
| Layout id | (after the first upload) |

## Home

1. **hero** (split): The shop's name and line on the left; the counter photo bleeding to the right edge of the frame, a framed inset across the seam with the best seller, the three most-ordered collections set large on the photo's dark corner (from Pralino).
2. **journal** (photo, tint band): The four newest posts beside a tall photo with the big word 'Journal' (from Pralino; best last).

## Photos

| Slot | File | Size | In the build |
| --- | --- | --- | --- |
| hero | `skins/vino/photos/hero.webp` | 2400 × 1000 | yes |
| hero-phone | `skins/vino/photos/hero-phone.webp` | 900 × 900 | yes |
| story | `skins/vino/photos/story.webp` | 1600 × 900 | yes |
| boutique | `skins/vino/photos/boutique.webp` | 1600 × 900 | yes |
| travel | `skins/vino/photos/travel.webp` | 1600 × 900 | yes |
| gift | `skins/vino/photos/gift.webp` | 1600 × 900 | yes |
| empty | `skins/vino/photos/empty.webp` | 1200 × 900 | yes |
| each collection | `skins/vino/photos/col-<slug of its title>.webp` | 900 × 1200 | 6 file(s); a collection without one shows its best sellers on a plate |

## Checks

<!-- CHECKS:START -->
(none yet)
<!-- CHECKS:END -->

## Releases

| Version | Date | Layout | Deploy | What |
| --- | --- | --- | --- | --- |
