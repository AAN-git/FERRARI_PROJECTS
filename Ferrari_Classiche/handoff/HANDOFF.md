# Ferrari Classiche — developer handoff

**Site:** cauleyferrari.com (WordPress 6.8 + Elementor Pro, theme `aan`)
**Page:** replace the content of **https://www.cauleyferrari.com/ferrari-classiche/**. Keep the URL.
**Status:** approved by the client, Nov 2026.
**Approved reference (source of truth):** https://aan-git.github.io/FERRARI_PROJECTS/Ferrari_Classiche/
(repo `AAN-git/FERRARI_PROJECTS`, folder `Ferrari_Classiche/`, commit `6d4894d`)

The reference is a static HTML build of the page inside a 1:1 copy of Cauley's header
and footer. Build the same page in WordPress and match it at 1440 and 390. Where this
document and the reference disagree, the reference wins. Tell us when that happens.

---

## 0. Scope

**In scope:** the content area of `/ferrari-classiche/` only, which means seven sections
(§2) plus page-scoped CSS and one small script.

**Do not touch:**
- the header, the footer or the menus. The page stays where it is today, under Footer › Owners › Ferrari Classiche;
- any other page;
- global theme CSS. Scope everything to this page (see §6).

**Copy rules:**
- All copy is Ferrari's own, from ferrari.com, in US spelling. Paste it exactly as in §3.
- Do not edit the wording, do not add lines, and do not keep the old page copy. The old history and maintenance paragraphs and the dead "Discover more" (`javascript:;`) are removed.

---

## 1. What is in this folder

In the repo this package sits at `Ferrari_Classiche/handoff/`. The approved build itself
is one level up, in `Ferrari_Classiche/`:
- `index.html` — generated, open it to run the reference;
- `_main.html` — page content;
- `css/classiche.css` — page CSS;
- `css/base.css` — the Cauley chrome and shared tokens;
- `js/classiche.js` — the arrival script;
- `img/` — the images;
- `build.mjs` — assembles the parts.

```
HANDOFF.md                 this document
screens/                   full-page reference renders, static state: 1440, 768, 390
images/jpg/                the 12 photographs at full supplied resolution, named for the
                           media library — upload these
images/webp/               the exact derivatives the reference uses (if you serve your own)
reference/classiche.css    the page's CSS as approved (values in §7 are taken from it)
reference/classiche.js     the arrival script (§8), 25 lines, no dependencies
reference/classiche-markup.html   the page's markup as approved
```

---

## 2. Page structure

Seven sections, top to bottom. "Dark" is `#0d0e11` with white text. "White" is `#ffffff`
with `#181818` text. The dark and white bands alternate. This follows Ferrari's dealer
system, and both ferrari.com reference pages open on a white intro.

| # | Section | Ground | Anchor id | Layout |
|---|---|---|---|---|
| 0 | Hero | photo | — | full viewport, text low-left, 2 buttons |
| 1 | History, forever | **white** | — | centred heading + 2 paragraphs |
| 2 | 1 — Certification of Authenticity | dark | `certification` | marker · heading left / text right · 2 image cards |
| 3 | 2 — Certification steps | **white** | `steps` | marker · heading left / text + button right · **4 split banners** |
| 4 | 3 — Officine Classiche | dark | `officine` | marker · image left 7/12, text right 5/12 |
| 5 | 4 — Ferrari Classiche events | **white** | `events` | marker · heading left / text right · 3 cards |
| 6 | Close | dark | — | text left 5/12 · image right 7/12 · 2 buttons |

The certification steps (section 3) are the point of the page. The client asked for
them specifically. Each step is a split banner taken from ferrari.com/…/classiche-certification:
- the photograph fills one half of the row, edge to edge;
- the text sits in the other half;
- the sides alternate: image left, right, left, right;
- the rows stand flush, with no gaps between them.

---

## 3. Copy — verbatim

`UPPERCASE` below means CSS `text-transform`. Type the words as shown in normal case.
"Marker" is the theme's existing `.section_title` (§6).

### 0 · Hero
- Pretitle: **Cauley Ferrari**
- H1: **Ferrari Classiche**
- Button 1 (primary, red): **Contact us** → `https://www.cauleyferrari.com/contact-us/`
- Button 2 (outline, white, chevron): **Certification steps** → `#steps`

### 1 · History, forever (white)
- H2: **History, forever**
- Lead (18px): Since 1947, the Maranello-based manufacturer has made automotive history, with cars that have sped beyond the limits of the possible.
- Paragraph: The Ferrari Classiche department was created to preserve these models and keep the Legend alive.

### 2 · Certification of Authenticity (dark, `#certification`)
- Marker: **1** —— **Certification of Authenticity**
- H2: **Preserve the value of your Ferrari Classica**
- Lead: Certification of Authenticity proves that your model conforms to the original design, protecting the investment and historical heritage.
- H3 (18px caps): **One certification, many benefits**
- Paragraph: The Certificate of Authenticity – available for road cars over 20 years old, Special Series, Sport and Ferrari F1 models – traces the history of the vehicle, verifying its conformity to the original design and the origin of each component. As well as preserving the car’s historical status and potentially increasing its value in the event of its sale, it allows owners to benefit from long-term spare parts and take part in the most prestigious official events.
- Card 1 — image `protect-market-value` · H3 **Protect market value** · The Ferrari Classiche Certification proves the authenticity and origin of each part, optimizing the car’s valuation.
- Card 2 — image `preserve-historical-value` · H3 **Preserve historical value** · Your car’s prestige remains intact: by certifying a Ferrari Classica, you conserve the integrity of the original design.

### 3 · Certification steps (white, `#steps`)
- Marker: **2** —— **Certification steps**
- H2: **Pass the test of time**
- Lead: Certify your Ferrari and preserve its value as the years go by.
- Paragraph: Ferrari Classiche Certification is a structured process to guarantee the authenticity of historic cars. The process can be initiated at an authorized dealer or in Maranello and has four distinct steps, to ensure a detailed and thorough assessment.
- Button (primary, red): **Contact us** → `https://www.cauleyferrari.com/contact-us/`

The four banners are an ordered list (`<ol>`). Each H3 carries a visually hidden
prefix: `<span class="sr-only">Step 1: </span>Inspection`.

| Step | Image | H3 | Text |
|---|---|---|---|
| 1 (image left) | `step-1-inspection` | **Inspection** | Your Ferrari Classica can be inspected either by Ferrari Classiche itself or by an authorized dealer. Using photographs, measurements and technical data, all the necessary information is gathered in order to perform the analysis. Following an overall check, the car is returned to the owner ahead of the next step. |
| 2 (image right) | `step-2-technical-analysis` | **Technical analysis** | The analysis begins by verifying that the chassis is original – an essential requirement for certification. The bodywork and interior are examined, comparing them against original specifications. The analysis continues with an in-depth check of all the vehicle’s mechanical and electrical systems. |
| 3 (image left) | `step-3-result-of-certification` | **Result of certification** | The Certification Report, which summarizes the results of the inspection and analysis steps, is submitted to the Certification Committee. This third-party body can then either accept or reject the report. If there are any issues that cannot be waived, the process is suspended until the compromised parts are replaced. |
| 4 (image right) | `step-4-the-certificate` | **The certificate** | Once a vehicle is approved, a document is produced that incorporates both photographic and technical evidence. This accompanies the Certificate of Authenticity, signed by Piero Ferrari, which is sent to the owner and attests to the authenticity of the Ferrari Classica in question. |

### 4 · Officine Classiche (dark, `#officine`)
- Marker: **3** —— **Officine Classiche**
- H2: **Trust the specialists**
- Paragraph: The selected Officine Classiche extend Ferrari excellence beyond Maranello, offering maintenance inspection and certification support services. These specialized centers guarantee the efficiency and authenticity of your Ferrari Classica.
- Ring link: **Discover more** → `https://www.ferrari.com/en-US/auto/officine-classiche` (new tab; sr-only: "about Officine Classiche on ferrari.com (opens in a new tab)")

### 5 · Ferrari Classiche events (white, `#events`)
- Marker: **4** —— **Ferrari Classiche events**
- H2: **Take part in Ferrari events**
- Paragraph: Ferrari Classiche events offer historic Ferrari car owners and lovers unique experiences for celebrating Prancing Horse history and performance.

| Card | Image | H3 (caps) | Text | Ring link "Discover more" → (new tab) |
|---|---|---|---|---|
| 1 | `event-corsi-pilota` | Corsi Pilota | The Fiorano circuit and the frozen lake of St Moritz play host to the Corsi Pilota driver courses, available to Ferrari Classiche owners and other Ferrari clients using cars from the company’s fleet. | `https://www.ferrari.com/en-US/auto/driving-courses` |
| 2 | `event-legacy-tour` | Legacy Tour | An annual experience dedicated to the owners of the most celebrated models in Ferrari history, which have Classica Certification or have already requested it. | `https://www.ferrari.com/en-US/magazine/articles/legacy-tour-2024-celebrating-the-gto` |
| 3 | `event-cavalcade` | Cavalcade | The annual event that assembles a circle of certified Ferrari Classiche owners, to share a driving and life experience in a memorable destination. | `https://www.ferrari.com/en-US/magazine/articles/a-world-apart-cavalcade-classiche-2024-trieste` |

### 6 · Close (dark)
- Eyebrow (14px caps, grey): **Cauley Ferrari**
- H2: **A timeless legend**
- Paragraph: Explore the Ferrari department that, since 2006, has preserved and handed down the history of the Prancing Horse.
- Button 1 (primary, red): **Contact us** → `https://www.cauleyferrari.com/contact-us/`
- Button 2 (outline, white, chevron): **Discover more** → `https://www.ferrari.com/en-US/auto/ferrari-classiche` (new tab)
- Image: `department`

### Page meta
- Title: `Ferrari Classiche — Cauley Ferrari` (or the theme's title pattern)
- Description: Ferrari Classiche preserves the history of the Prancing Horse: the Certificate of Authenticity and its four certification steps, Officine Classiche and the Ferrari Classiche events. At Cauley Ferrari.

---

## 4. Images

Upload `images/jpg/`. Every photograph is Ferrari's own (ferrari.com CDN) and the
client approved them as they are. Do not crop them in an editor. Crops are done in
CSS with `object-fit: cover` and the `object-position` values below.

| File (`ferrari-classiche-…`) | Size | Where | Displayed | Alt text |
|---|---|---|---|---|
| `hero.jpg` | 1920×1080 | Hero background | full bleed, cover; desktop `object-position: 60% 45%`, ≤768 `64% 50%` | *(empty — decorative, `alt=""`)* |
| `protect-market-value.jpg` | 960×650 | Sec 2, card 1 | natural ratio | A black classic Ferrari cabriolet in profile in a dark studio |
| `preserve-historical-value.jpg` | 960×650 | Sec 2, card 2 | natural ratio | The bonnet scoop of a red classic Ferrari, close up |
| `step-1-inspection.jpg` | 960×650 | Step 1 | ≥1024: half-row 720:650, cover · <1024: 960:650 | A Ferrari 250 GTO raised on a lift in the Ferrari Classiche workshop |
| `step-2-technical-analysis.jpg` | 960×650 | Step 2 | same | An original Ferrari factory build sheet for chassis 08653 |
| `step-3-result-of-certification.jpg` | 960×650 | Step 3 | same | Classic Ferraris crossing a stone bridge in a mountain valley |
| `step-4-the-certificate.jpg` | 960×650 | Step 4 | same | The red Ferrari Certificazione di autenticità binder |
| `officine-classiche.jpg` | 1300×730 | Sec 4 | natural ratio | A classic Ferrari V12 engine on the bench in a Ferrari workshop |
| `event-corsi-pilota.jpg` | 1920×1081 | Sec 5, card 1 | natural ratio (16:9) | A driver in racing gloves at the wheel of a classic Ferrari |
| `event-legacy-tour.jpg` | 1920×1080 | Sec 5, card 2 | natural ratio | A red Ferrari 288 GTO parked on a country road |
| `event-cavalcade.jpg` | 1920×1080 | Sec 5, card 3 | natural ratio | Three classic Ferraris driving in line along a coastal road |
| `department.jpg` | 1920×1080 | Close | natural ratio | A classic Ferrari Formula 1 car raised on a lift in the Ferrari Classiche workshop |

**Notes**
- The step photographs are only 960px wide. At 1920 a half-row is 960px, so they are shown 1:1 there. Do not upscale them.
- The hero image is the LCP image. Load it eagerly with `fetchpriority="high"` and never hide it behind an animation.
- Lazy-load every other image.

---

## 5. Links

| Label | Target | Opens |
|---|---|---|
| Contact us (×3) | `https://www.cauleyferrari.com/contact-us/` | same tab |
| Certification steps (hero) | `#steps` | same page |
| Discover more (Officine) | `https://www.ferrari.com/en-US/auto/officine-classiche` | new tab |
| Discover more (Corsi Pilota) | `https://www.ferrari.com/en-US/auto/driving-courses` | new tab |
| Discover more (Legacy Tour) | `https://www.ferrari.com/en-US/magazine/articles/legacy-tour-2024-celebrating-the-gto` | new tab |
| Discover more (Cavalcade) | `https://www.ferrari.com/en-US/magazine/articles/a-world-apart-cavalcade-classiche-2024-trieste` | new tab |
| Discover more (Close) | `https://www.ferrari.com/en-US/auto/ferrari-classiche` | new tab |

All ferrari.com links were checked on 9 Nov 2026 and open (en-US). Every new-tab link
carries `rel="noopener"` and a visually hidden "(opens in a new tab)".

---

## 6. Build it from the theme's own components

The reference reproduces Cauley's own component language. Most of it already exists in
the `aan` theme, so use the theme's versions. Do not port the reference CSS for these:

| Reference | Use on the live site |
|---|---|
| Hero pretitle / H1 | `hero-content__pretitle` (`f-typo-pretitle`) / `f-typo-display-m` — the theme's hero |
| Red button | `fr-primary-btn` (`fr-btn--md`) |
| Outline button on dark (hero, close) | `fr-tiertiary-btn` dark variant, with the `fr-btn__icon` chevron |
| Outline button on white | `fr-tiertiary-btn` light variant: `#181818` border and text; hover `#181818` fill, white text |
| Ring link "Discover more" | `fr-rollover-btn fr-btn--sm` + `fr-btn__progress-ring`, chevron right (`fr-rollover-icon-right`) |
| Section marker `1 —— NAME` | the home page's `.section_title` (`N <span></span> NAME`). Use the dark-text variant on white and `.section_title.white` on dark. **On this page it is a label, not the heading**: render it as `<p class="section_title">`, because each section already has its own H2 below it |
| Header / footer | unchanged theme chrome |

**Page-specific CSS.** Scope everything under one wrapper, e.g. `.fc-page`, or the page's
`.page-id-…` body class. Nothing may go into global CSS. The parts that are new to the site:
- the white band;
- the split banners;
- the two-column heading/text split;
- the card grids;
- the hero scrim;
- the arrival motion.

`reference/classiche.css` holds all of them. Its variables resolve as in §7.

---

## 7. Layout and type specs

**Breakpoints:** 1400 (`87.5rem`) · 1280 (`80rem`) · 1024 (`64rem`) · 768 (`48rem`) · 480 (`30rem`).

**Content frame.** The page aligns to the logo line of Cauley's header:
- the content column starts `logo-x + 64px` from the viewport edge, where `logo-x` = 64px above 1400, 40px from 1400 down, and 16px from 1024 down;
- the 64px inset drops to 0 at 1024;
- the right gutter = `logo-x`;
- max width 1920;
- the section marker sits 64px left of the column, on the logo line.

**Spacing tokens used:** 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 px (`--space-2 … --space-9`).

**Colours (all Ferrari greys + Rosso Corsa):**

| Use | Value |
|---|---|
| Dark ground | `#0d0e11` |
| White ground | `#ffffff` |
| Text on white: heading / body / muted | `#181818` / `#303030` / `#666666` |
| Text on dark: heading / body / label | `#f3f4f6` / `rgb(243 244 246 / .82)` / `rgb(243 244 246 / .58)` |
| Marker, ring-link hover stroke | Rosso Corsa `#da291c` |
| Ring base | `#cdcbcb` |
| Focus on white | 2px solid `#da291c`, offset 4px (the theme's yellow ring does not show on white) |

**Type (Ferrari Sans; 400 and 500 only, never 600/700):**

| Role | Size / line-height | Weight | Case |
|---|---|---|---|
| Hero pretitle | 16 / 22.4, ls .08px | 500 | caps |
| Hero H1 | clamp(32px … 40px) / 1.1 | 500 | as typed |
| Section H2 | clamp(28px … 36px) / 1.1 | 500 | sentence case |
| Lead | 18 / 1.5 | 400 | — |
| Step H3 | clamp(22px … 28px) / 1.2 | 500 | sentence case |
| Card H3 / subhead | 18 / 25.2 | 500 | caps |
| Body | **14** / 1.7, ls .015em, max ~64ch (46ch in steps) | 400 | — |
| Marker, buttons, ring link | 12 / 15, ls .6px | 400 | caps |

Body text is never below 14px.

**Per section**

| Section | Spec |
|---|---|
| Hero | min-height `max(100svh, 576px)`; text block bottom-aligned, 104px from the bottom edge; pretitle → 16px → H1 → 48px → buttons (32px gap). Scrim: `linear-gradient(to top, rgb(0 0 0/.74) 0%, rgb(0 0 0/.34) 36%, transparent 60%), linear-gradient(to right, rgb(0 0 0/.55) 0%, transparent 50%)`. **≤768:** the photo becomes a band at the top (height = header + 62vw) fading into the dark ground; the text and buttons sit below it. ≤480: buttons full width, stacked 16px apart. The car must never sit under the text. |
| Section padding | top and bottom `clamp(64px, 8vw, 128px)`; intro `clamp(64px, 9vw, 128px)`; the steps section has **0 bottom** (the banners run into the next section) |
| Heading/text split (sec 2, 3, 5) | 64px below the marker; ≥1024: two columns 5fr / 7fr, gap `clamp(48px, 6vw, 128px)`, top-aligned; <1024 stacked, 24px gap. Then `clamp(48px, 5vw, 64px)` to the grid below |
| Value cards (sec 2) | 2 columns ≥768, gap 64 × 32; image → 16px → H3 → 12px → text |
| **Split banners (sec 3)** | full viewport width; ≥1024: two equal halves, image half `aspect-ratio 720/650`, `object-fit: cover`; even rows put the image on the right; text half padded `64px clamp(48px, 8vw, 128px)`, **vertically centred** (as Ferrari sets it); H3 → 24px → text. <1024: image on top (960:650), text below, padded `48px 16px 64px` |
| Officine (sec 4) | ≥1024: image 7fr / text 5fr, gap `clamp(48px, 6vw, 128px)`, top-aligned; ring link 12px under the text |
| Event cards (sec 5) | 3 columns ≥1024, 2 at 768–1023, 1 below; gap 64 × 32; rows aligned across cards (CSS subgrid) so the links line up |
| Close | ≥1024: text 5fr / image 7fr, vertically centred; buttons 24px under the text; ≤480 buttons full width |

---

## 8. Motion — Ferrari Momentum §7: Fade and Slide only

Every element arrives **once**, when it enters the viewport. After that it never moves again.
- No scale, no bounce, no parallax.
- Do **not** use Elementor's Entrance Animations: their travel and easing do not match.
- Use `reference/classiche.js` (an IntersectionObserver) together with the CSS block marked "arrival".

| Role | Motion | Duration | Delay |
|---|---|---|---|
| Text blocks (marker, heading/text columns, step text, Officine text, close text) | opacity 0→1, translateY 16px→0 | 600ms | second column +120ms; step and Officine text +200ms |
| Cards (value cards, event cards) | opacity 0→1, translateY 32px→0 | 600ms | 0 / 120 / 240ms by position |
| Photographs in banners, Officine, close | opacity 0→1, translateX 32px→0, **from their own viewport edge** (left image from the left, right image from the right) | 800ms | 0 |
| Hero text, on load | pretitle → H1 → buttons, fade + 16px | 600ms | 150 / 270 / 390ms |
| Hero photo | **never animated** | — | — |

- Easing for all: `cubic-bezier(0, 0, .38, 1)` (Momentum "accelerate", the entering curve).
- Trigger: `rootMargin: '0px 0px -10% 0px'`, `threshold: 0.12`. Then add `.is-in` and unobserve.

**Safety rules (required):**
- The hidden start state is applied **only** by a script in `<head>`. That script adds `html.js-rv`, and only when `prefers-reduced-motion` is not set and IntersectionObserver exists. Without JS, or with reduced motion, nothing is ever hidden.
- If the main script has not run within 3s, the head script removes `js-rv` and everything shows.
- Animate only `opacity` and `transform`. While the images slide in there must be no horizontal scroll: clip overflow-x on the page wrapper.

Head snippet (reference `_head.html`):
```html
<script>
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-rv');
    setTimeout(function () { if (!window.__fcRv) document.documentElement.classList.remove('js-rv'); }, 3000);
  }
</script>
```

Hover states:
- **Ring link:** a Rosso Corsa stroke runs round the 40px ring in 1s, and the chevron moves 2px. This is the theme's `fr-rollover-btn` behaviour.
- **Buttons:** as the theme already does.

---

## 9. Accessibility (WCAG 2.2 AA)

- One H1 (hero). One H2 per section. H3 for cards and steps. The markers are **not** headings.
- The steps are an `<ol>` with sr-only "Step N: " prefixes.
- Alt texts exactly as in §4. The hero image is decorative (`alt=""`).
- New-tab links carry sr-only "(opens in a new tab)".
- Contrast: body on white `#303030` 12.6:1. Marker `#da291c` on white 4.6:1. On dark, every text colour is above 5.7:1. Hero text sits on the scrim and is never over the car.
- Focus is visible on both grounds; on white use the red ring from §7.
- The page is fully usable with reduced motion and without JS.

---

## 10. Acceptance checklist

Compare against the reference at **1920, 1440, 1024, 768, 390**. Use `screens/` for the static state.

- [ ] Copy matches §3 word for word, with US spelling and no leftover old copy.
- [ ] Section order and grounds: photo / white / dark / white / dark / white / dark.
- [ ] Steps are 4 split banners with sides alternating L/R/L/R, rows flush, image edge to edge.
- [ ] Hero: the car is whole and clear of the text at every width. On a phone the photo band sits on top and the text below it.
- [ ] No horizontal scroll at any width, including while images slide in. Measure `scrollWidth`.
- [ ] Every link opens the right target (§5), and the new-tab ones open in a new tab.
- [ ] Motion: once per element, Fade/Slide only, 600/800ms. With OS "reduce motion" on: no motion and nothing hidden. With JS off: everything visible.
- [ ] Body text 14px. Ferrari Sans 400/500 only.
- [ ] No console errors. All images load, with lazy-loading below the fold.
- [ ] Header, footer and every other page unchanged.

---

## 11. Open items (not blocking launch)

1. **Officine Classiche status.** Ferrari's copy says certification "can be initiated at an authorized dealer", and the page says no more than that. Do not add any claim that Cauley is an Officine Classiche unless the client confirms it in writing.
2. **Client photography.** If Cauley later supplies its own photos, they replace the Ferrari images one for one. The crops in §4 and §7 still apply.
3. **Hero video.** The old live page had a video hero. The approved page uses the still photo. Add a video only if the client supplies one, with the still as its poster.

Questions: reply on the ticket. Anything not covered here, follow the reference build.
