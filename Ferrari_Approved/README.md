# Ferrari Approved — sub page

Status: **first build, 22 Oct 2026.** `node build.mjs` → `index.html`.
Content is Ferrari's page verbatim (spelling made US: tires, discs, repairs);
the language is Cauley's live site — their `fr-*` buttons, their header
breakpoints, their spec row, their Owners tiles, markers on the logo line.
Photos are Ferrari's, max 720 px from their CDN: placeholders until the
client sends their own.

## Drop material here

```
_intake/photos/   imagery as supplied — originals, untouched, any format
_intake/info/     copy deck, brief, ticket, links, notes from the client
```

Keep the supplied file names. Web derivatives are made from these later and
go to `img/`; the originals stay in `_intake/` and are never edited in place.

## Still to decide

- **decided:** one ordinary page, Cauley first. It will be reused on other
  Ferrari retailer sites of the same kind (e.g. ferrariofgreenwich.com) by
  swapping that retailer's header/footer and editing the text — so the
  dealer-specific bits stay in the chrome parts and a few `{{…}}` values,
  as in 296's `build.mjs`. No CMS template, no theme port.
- **decided:** menu Pre-Owned → *Ferrari Approved Program* (client, 22 Oct)
- **decided:** reference is `preowned.ferrari.com/en-US/ferrari-approved`,
  replicated; Ferrari's photos and copy are placeholders the client replaces
- the copy deck: every claim on the page — warranty terms, inspection
  points, durations — comes from it, never from memory

## Where it goes

Repo `AAN-git/FERRARI_PROJECTS`, its own folder `Ferrari_Approved/` beside
`296_GT_Modificata/` and `Purosangue_American_Grand_Tour/`. Client preview
link once pushed:
`https://aan-git.github.io/FERRARI_PROJECTS/Ferrari_Approved/`.
`_intake/` does not go to the repo — it is working material, not the page.

Client brief and the reference read: `_intake/info/`.

## When it is built

Same shape as `../296_GT_Modificata/`: the retailer's own header and footer
1:1, a `build.mjs` assembling the parts, `index.html` generated, never edited
by hand.
