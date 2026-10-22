/* Assembles the Ferrari Approved Program page from its parts.
   Edit the parts, run `node build.mjs`, never edit index.html by hand.

     _head.html                document head + skip link
     _header-<dealer>.html     the retailer's own masthead, taken from their site
     _mobilemenu-<dealer>.html
     _main.html                the page itself — dealer-agnostic; the only
                               per-retailer values are the {{…}} keys below
     _footer-<dealer>.html     the retailer's own footer
     _tail.html                scripts

   Another Ferrari retailer is a new entry here plus its header, mobile menu
   and footer parts — the content does not change between them. */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';

const DEALERS = [
  {
    id: 'cauley', out: 'index.html',
    DEALER: 'Cauley Ferrari',
    INVENTORY: 'https://www.cauleyferrari.com/ferrari-inventory/',
    VALUE: 'https://www.cauleyferrari.com/value-your-trade/',
  },
  // { id: 'greenwich', out: 'index_greenwich.html', DEALER: 'Ferrari of Greenwich', INVENTORY: '…', VALUE: '…' },
];

const read = f => readFileSync(f, 'utf8');

/* Stamp the stylesheets and scripts with their own modified time, so a
   browser that has seen an older build never shows it. */
const stamp = f => {
  try { return Math.floor(statSync(f).mtimeMs).toString(36); } catch { return '0'; }
};
const bust = html => html
  .replace(/(href|src)="(css\/[^"?]+\.css|js\/[^"?]+\.js)"/g,
           (_, attr, path) => `${attr}="${path}?v=${stamp(path)}"`);

const fill = (html, d) => html.replace(/\{\{(\w+)\}\}/g, (m, k) => {
  if (!(k in d)) { console.error(`no value for {{${k}}} — ${d.DEALER}`); process.exit(1); }
  return d[k];
});

for (const d of DEALERS) {
  for (const part of [`_header-${d.id}.html`, `_footer-${d.id}.html`]) {
    if (!existsSync(part)) { console.error(`missing ${part} — ${d.DEALER} not built`); process.exit(1); }
  }
  const menu = existsSync(`_mobilemenu-${d.id}.html`) ? read(`_mobilemenu-${d.id}.html`) : '';
  const page = fill([
    read('_head.html'), read(`_header-${d.id}.html`), menu,
    read('_main.html'), read(`_footer-${d.id}.html`), read('_tail.html'),
  ].join('\n'), d);
  writeFileSync(d.out, bust(page));
  console.log(`${d.out.padEnd(24)} ${page.split('\n').length} lines`);
}
