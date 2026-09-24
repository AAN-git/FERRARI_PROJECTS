/* Assembles the 296 GT Modificata page from its parts.
   Edit the parts, run `node build.mjs`, never edit index.html by hand.

     _head.html            document head + skip link
     _header-<dealer>.html the retailer's own masthead, taken from their site
     _mobilemenu-<dealer>.html
     _main.html            the ten acts — the page itself, dealer-agnostic
     _footer-<dealer>.html the retailer's own footer
     _form-<dealer>.html   the retailer's contacts panel (Register your interest)
     _tail.html            scripts

   The acts are identical for every retailer: the dealer header and footer
   are the only per-retailer difference, so nothing about the argument or
   the imagery changes between them. */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';

const DEALERS = [
  { id: 'cauley', name: 'Cauley Ferrari', out: 'index.html' },
  // { id: 'lasvegas',  name: 'Ferrari of Las Vegas',  out: 'index_lasvegas.html' },
  // { id: 'greenwich', name: 'Ferrari of Greenwich', out: 'index_greenwich.html' },
];

const read = f => readFileSync(f, 'utf8');

/* Stamp the stylesheet and the scripts with their own modified time, so a
   browser that has seen an older build never shows it. Losing an hour to a
   cached stylesheet is a tax nobody should pay twice. */
const stamp = f => {
  try { return Math.floor(statSync(f).mtimeMs).toString(36); } catch { return '0'; }
};
const bust = html => html
  .replace(/(href|src)="(css\/[^"?]+\.css|js\/[^"?]+\.js)"/g,
           (_, attr, path) => `${attr}="${path}?v=${stamp(path)}"`);
const mainRaw = read('_main.html');
const tail = read('_tail.html');

for (const d of DEALERS) {
  for (const part of [`_header-${d.id}.html`, `_footer-${d.id}.html`]) {
    if (!existsSync(part)) { console.error(`missing ${part} — ${d.name} not built`); process.exit(1); }
  }
  const head = read('_head.html').replaceAll('{{DEALER}}', d.name);
  const menu = existsSync(`_mobilemenu-${d.id}.html`) ? read(`_mobilemenu-${d.id}.html`) : '';
  const main = mainRaw.replaceAll('{{DEALER}}', d.name);
  const form = existsSync(`_form-${d.id}.html`) ? read(`_form-${d.id}.html`) : '';
  const page = [head, read(`_header-${d.id}.html`), menu, main, read(`_footer-${d.id}.html`), form, tail].join('\n');
  writeFileSync(d.out, bust(page));
  console.log(`${d.out.padEnd(24)} ${page.split('\n').length} lines`);
}
