# Purosangue American Grand Tour Atelier Collection — retailer pages (v4)

Three static retailer pages, one shared build. No build step: serve this folder
and open `index.html`, which links to all three.

| page | retailer | compositions |
| --- | --- | --- |
| `index_cauley_v4.html` | Cauley Ferrari — West Bloomfield, MI | Mountain Pass · The Mountains |
| `index_lasvegas_v4.html` | Ferrari of Las Vegas — Las Vegas, NV | Overlook · The Sands |
| `index_greenwich_v4.html` | Ferrari of Greenwich — Greenwich, CT (Miller Motorcars in Ferrari's deck) | Byway · The Sands · The Great Plains |

Each page carries its own retailer's header and footer and only the
compositions that retailer's copy deck names.

## Files

- `css/page.css` — base stylesheet; `css/page-v4.css` — the v4 revision layer on top of it
- `js/page-v4.js` — hero video and on-scroll reveals (the page is complete without it, and still under reduced motion)
- `fonts/` — Ferrari Sans, self-hosted
- `img/` — responsive webp; `video/` — one hero loop per retailer, with posters

## Open items

- The inquiry form has no endpoint yet, and says so on the page.
- The pages are meant to sit under **News & Events** in each retailer's main
  nav; that nav item still points at each site's current destination.
- `index.html` is a preview index for review, not part of the retailer pages.
