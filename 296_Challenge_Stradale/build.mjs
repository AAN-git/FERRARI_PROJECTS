/* Assembles the 296 Challenge Stradale model page from its parts.
   Edit the parts, run `node build.mjs`, never edit index.html by hand.

     _head.html             document head + skip link
     _header-<dealer>.html  the retailer's own masthead, taken from their site
     _mobilemenu-<dealer>.html
     _main.html             the seven modules of the AAN model-page build sheet
     _footer-<dealer>.html  the retailer's own footer
     _form-<dealer>.html    the retailer's contacts panel (Register your interest)
     _tail.html             scripts

   The modules are dealer-agnostic; the header, footer and form are the only
   per-retailer difference. */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';

const DEALERS = [
  { id: 'cauley', name: 'Cauley Ferrari', out: 'index.html' },
];

const read = f => readFileSync(f, 'utf8');

/* stamp css/js with their modified time so a cached build never shows */
const stamp = f => {
  try { return Math.floor(statSync(f).mtimeMs).toString(36); } catch { return '0'; }
};
const bust = html => html
  .replace(/(href|src)="(css\/[^"?]+\.css|js\/[^"?]+\.js)"/g,
           (_, attr, path) => `${attr}="${path}?v=${stamp(path)}"`);

for (const d of DEALERS) {
  for (const part of [`_header-${d.id}.html`, `_footer-${d.id}.html`]) {
    if (!existsSync(part)) { console.error(`missing ${part} — ${d.name} not built`); process.exit(1); }
  }
  const fill = s => s.replaceAll('{{DEALER}}', d.name);
  const opt = f => existsSync(f) ? read(f) : '';
  const page = [
    fill(read('_head.html')),
    read(`_header-${d.id}.html`),
    opt(`_mobilemenu-${d.id}.html`),
    fill(read('_main.html')),
    read(`_footer-${d.id}.html`),
    opt(`_form-${d.id}.html`),
    read('_tail.html'),
  ].join('\n');
  writeFileSync(d.out, bust(page));
  console.log(`${d.out.padEnd(16)} ${page.split('\n').length} lines`);
}
