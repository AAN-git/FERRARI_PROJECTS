# Ferrari Classiche — sub page

Status: **first build, 9 Nov 2026.** `node build.mjs` → `index.html`.
Replaces the live cauleyferrari.com/ferrari-classiche/ (client request in
`_intake/info/client-request.md`).

Content is Ferrari's own, verbatim, from two pages, in US spelling
(authorized, specialized, summarizes, optimizing):
`ferrari.com/en-US/auto/ferrari-classiche` and
`ferrari.com/en-US/auto/classiche-certification`. Nothing is written for the
page and nothing is claimed about the retailer beyond what Ferrari says of any
authorized dealer. Photos are Ferrari's (from their CDN, originals in
`_intake/photos/`): placeholders until the client sends their own.

Same shape as `../Ferrari_Approved/`: the retailer's header and footer 1:1,
`build.mjs` assembling the parts, `css/base.css` shared, `css/classiche.css`
for this page only. No page script beyond the menu (`js/page.js`).

## The page

1. Hero — the 250 GT on the road; CONTACT US + CERTIFICATION STEPS
2. History, forever — white
3. **1 Certification of Authenticity** — "Preserve the value…", one
   certification many benefits, Protect market value / Preserve historical value
4. **2 Certification steps** — white; "Pass the test of time", the four steps
   in one row on one line: Inspection · Technical analysis · Result of
   certification · The certificate; CONTACT US
5. **3 Officine Classiche** — "Trust the specialists" → ferrari.com
6. **4 Ferrari Classiche events** — white; Corsi Pilota · Legacy Tour ·
   Cavalcade → ferrari.com
7. Close — "A timeless legend"; CONTACT US + DISCOVER MORE (ferrari.com)

Dark and white bands alternate (FERRARI_DESIGN.md §11.4; both reference pages
open on a white intro). The white bands use Ferrari's greys only; focus on
white is Ferrari's red double-ring colour, because the retailer's yellow ring
does not show on white.

## Open — ask the client, do not guess

- **Is Cauley an Officine Classiche / can it run the inspection?** Ferrari
  says certification "can be initiated at an authorized dealer". The page says
  that and no more. If Cauley is an Officine Classiche, that is the strongest
  line the page could carry — it needs their confirmation.
- **Their photographs.** Every image is Ferrari's.
- **Hero video.** The live page has a video hero (engine detail); its source is
  not in the page HTML. A still is used. If they want the video, they send it.
- **Menu.** Live, the page is reached from the footer (Owners › Ferrari
  Classiche); the header has no entry. Kept as is.
- **The old copy** (history / maintenance paragraphs) is dropped — the request
  is to align with Ferrari's current page, which no longer carries it.
- Contact goes to `/contact-us/`; Ferrari's own pages say "Contact your dealer".
