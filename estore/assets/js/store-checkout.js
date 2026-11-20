/* Genuine Store — bag and checkout (v3 mockup).
   The bag lives in sessionStorage for the visit (seeded with two items, as the header
   badge shows); every read and write is guarded, and the pages still render without it.
   Prices are the catalogue's placeholders — nothing is summed. Mockup: no payment is taken.
   WooCommerce mapping for the build: drawer = mini-cart fragment, bag.html = cart.php,
   checkout.html = form-checkout.php (two sections, one page), order-confirmed.html = thankyou.php. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const dataEl = $('#bag-catalog');
  if (!dataEl) return;
  const DATA = JSON.parse(dataEl.textContent);
  const CAT = DATA.products;
  const KEY = 'cauleyGenuineBag', ORDER = 'cauleyGenuineOrder';
  const store = {
    get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode: in-memory only */ } },
  };
  let bag = store.get(KEY);
  if (!Array.isArray(bag)) bag = DATA.seed.map(slug => ({ slug, qty: 1 }));
  bag = bag.filter(l => CAT[l.slug]);
  // preview: a bag or checkout link opened with an empty bag (e.g. after a test order) shows the demo items again
  if (!bag.length && ['bag', 'checkout'].includes(document.body.dataset.ck || '')) bag = DATA.seed.map(slug => ({ slug, qty: 1 }));
  const save = () => { store.set(KEY, bag); paint(); };
  const count = () => bag.reduce((n, l) => n + l.qty, 0);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const shot = p => p.img
    ? `<div class="shot"><img src="${p.img}" width="1400" height="1795" loading="lazy" alt=""></div>`
    : `<div class="shot shot--ph"><span class="ph__label">Parts photo<br>supplied by Cauley</span></div>`;

  function line(l, mode) {
    const p = CAT[l.slug];
    if (mode === 'mini') {
      return `<div class="bline bline--mini">${shot(p)}<div class="bline__info"><p class="bline__name">${esc(p.name)}</p><p class="bline__qtytxt">Qty ${l.qty}</p></div><p class="bline__price">${esc(p.price)}</p></div>`;
    }
    return `<div class="bline" data-slug="${l.slug}"><a href="${p.url}" tabindex="-1" aria-hidden="true">${shot(p)}</a>
      <div class="bline__info"><p class="bline__cat">${esc(p.cat)}</p><p class="bline__name"><a href="${p.url}">${esc(p.name)}</a></p>
      <p class="bline__price">${esc(p.price)}</p>
      <div class="bline__ctl"><div class="qty" role="group" aria-label="Quantity, ${esc(p.name)}"><button type="button" data-bq="-1" aria-label="Decrease quantity">−</button><input type="number" value="${l.qty}" min="1" max="9" aria-label="Quantity" data-bqi><button type="button" data-bq="1" aria-label="Increase quantity">+</button></div>
      <button class="bline__rm" type="button" data-brm>Remove</button></div></div></div>`;
  }

  function paint() {
    const n = count();
    $$('.tool__badge').forEach(b => { b.textContent = n; b.hidden = !n; });
    $$('a.tool[data-bag-open]').forEach(a => a.setAttribute('aria-label', `Bag, ${n} item${n === 1 ? '' : 's'}`));
    $$('[data-bag-count]').forEach(e => { e.textContent = n; });
    $$('[data-bag-list]').forEach(box => { box.innerHTML = bag.map(l => line(l, box.dataset.bagList)).join(''); });
    $$('[data-bag-full]').forEach(e => { e.hidden = !n; });
    $$('[data-bag-empty]').forEach(e => { e.hidden = !!n; });
  }

  // quantity and remove, wherever a bag list is drawn
  document.addEventListener('click', e => {
    const row = e.target.closest('.bline[data-slug]');
    if (!row) return;
    const l = bag.find(x => x.slug === row.dataset.slug);
    if (e.target.closest('[data-bq]')) { l.qty = Math.min(9, Math.max(1, l.qty + +e.target.closest('[data-bq]').dataset.bq)); save(); }
    if (e.target.closest('[data-brm]')) { bag = bag.filter(x => x !== l); save(); }
  });
  document.addEventListener('change', e => {
    if (!e.target.matches('[data-bqi]')) return;
    const l = bag.find(x => x.slug === e.target.closest('.bline').dataset.slug);
    l.qty = Math.min(9, Math.max(1, +e.target.value || 1)); save();
  });

  // ---------------- the drawer ----------------
  const drawer = $('#bagd');
  let lastFocus = null;
  const lock = on => { document.documentElement.style.overflow = on ? 'hidden' : ''; };
  function openBag(added) {
    if (!drawer) return;
    const note = $('.bagd__added', drawer);
    if (note) { note.hidden = !added; if (added) $('b', note).textContent = added; }
    lastFocus = document.activeElement;
    drawer.classList.add('is-active'); drawer.setAttribute('aria-hidden', 'false'); lock(true);
    setTimeout(() => $('.bagd__close', drawer).focus({ preventScroll: true }), 60);
  }
  function closeBag() {
    drawer.classList.remove('is-active'); drawer.setAttribute('aria-hidden', 'true'); lock(false);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  if (drawer) {
    $$('[data-bag-close]', drawer).forEach(b => b.addEventListener('click', closeBag));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-active')) closeBag(); });
    // keep focus inside the open panel
    drawer.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const f = $$('a[href],button:not([disabled]),input', drawer).filter(x => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }
  const page = document.body.dataset.ck || '';
  $$('[data-bag-open]').forEach(a => a.addEventListener('click', e => {
    if (page) return;                       // bag and checkout pages: follow the link
    e.preventDefault(); openBag();
  }));

  // product page: Add to bag puts the item in, then shows the bag
  const pdp = $('.pdp[data-slug]');
  if (pdp) {
    $$('[data-add]').forEach(b => b.addEventListener('click', () => {
      const q = Math.min(9, Math.max(1, +($('[data-qty-input]')?.value) || 1));
      const slug = pdp.dataset.slug;
      const l = bag.find(x => x.slug === slug);
      if (l) l.qty = Math.min(9, l.qty + q); else bag.push({ slug, qty: q });
      save();
      setTimeout(() => openBag(CAT[slug].name), 0);   // after store-pages.js has shown its line
    }));
  }

  // ---------------- checkout: 2 Delivery -> 3 Payment ----------------
  const form = $('#ckform');
  if (form) {
    const sDel = $('#cks-delivery'), sPay = $('#cks-payment');
    const steps = $$('.stepper li');
    const setStep = n => steps.forEach((li, i) => { li.classList.toggle('is-done', i + 1 < n); li.classList.toggle('is-current', i + 1 === n); li.querySelector('a, span.stepper__w')?.setAttribute('aria-current', i + 1 === n ? 'step' : 'false'); });
    const check = scope => {
      let first = null;
      $$('[required]', scope).forEach(f => {
        if (f.closest('[hidden]')) return;
        const bad = f.type === 'checkbox' ? !f.checked : !String(f.value).trim();   // preview: any text is accepted
        (f.closest('.fld') || f.closest('.chk-line'))?.classList.toggle('is-err', bad);
        if (bad && !first) first = f;
      });
      return first;
    };
    $$('input, select', form).forEach(f => f.addEventListener('input', () => (f.closest('.fld') || f.closest('.chk-line'))?.classList.remove('is-err')));
    $$('input, select', form).forEach(f => f.addEventListener('change', () => (f.closest('.fld') || f.closest('.chk-line'))?.classList.remove('is-err')));
    const v = n => (form.elements[n]?.value || '').trim();
    const method = () => $('input[name="ship"]:checked', form);
    function recap() {
      const m = method();
      $('[data-recap-contact]').textContent = `${v('email')} · ${v('phone')}`;
      $('[data-recap-address]').textContent = `${v('fname')} ${v('lname')}, ${v('address1')}${v('address2') ? ', ' + v('address2') : ''}, ${v('city')}, ${v('state')} ${v('zip')}`;
      $('[data-recap-method]').textContent = m ? m.dataset.label : '';
    }
    $('#to-payment').addEventListener('click', () => {
      const bad = check(sDel);
      $('[data-err="delivery"]').hidden = !bad;
      if (bad) { bad.focus(); return; }
      recap();
      sDel.dataset.state = 'done'; sPay.dataset.state = 'open'; setStep(3);
      $$('[data-sum-ship]').forEach(e => { e.textContent = method().dataset.price; });
      $$('[data-sum-tax]').forEach(e => { e.textContent = '$00.00'; });
      const h = $('h2', sPay); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
      sPay.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
    $('[data-edit="delivery"]').addEventListener('click', () => {
      sDel.dataset.state = 'open'; sPay.dataset.state = 'locked'; setStep(2);
      $('input', sDel).focus();
    });
    const same = $('#bill-same'), billing = $('.billing');
    same.addEventListener('change', () => { billing.hidden = same.checked; });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (sPay.dataset.state !== 'open') { $('#to-payment').click(); return; }
      const bad = check(sPay);
      $('[data-err="payment"]').hidden = !bad;
      if (bad) { bad.focus(); return; }
      const m = method();
      store.set(ORDER, {
        name: v('fname'), email: v('email'),
        address: `${v('fname')} ${v('lname')}<br>${esc(v('address1'))}${v('address2') ? '<br>' + esc(v('address2')) : ''}<br>${esc(v('city'))}, ${esc(v('state'))} ${esc(v('zip'))}<br>United States`,
        method: m.dataset.label, eta: m.dataset.eta, card: (v('card').replace(/\D/g, '').slice(-4) || '0000'),
        lines: bag,
      });
      bag = []; store.set(KEY, bag);
      location.href = 'order-confirmed.html';
    });
  }

  // ---------------- confirmation: what was just ordered ----------------
  if (page === 'confirmed') {
    const o = store.get(ORDER);
    if (o) {
      $$('[data-o-name]').forEach(e => { e.textContent = o.name || 'there'; });
      $$('[data-o-email]').forEach(e => { e.textContent = o.email; });
      $$('[data-o-address]').forEach(e => { e.innerHTML = esc(o.address).replace(/&lt;br&gt;/g, '<br>'); });
      $$('[data-o-method]').forEach(e => { e.textContent = `${o.method} · ${o.eta}`; });
      $$('[data-o-card]').forEach(e => { e.textContent = `Card ending ${o.card}`; });
      if (Array.isArray(o.lines) && o.lines.length) $$('[data-o-lines]').forEach(box => { box.innerHTML = o.lines.filter(l => CAT[l.slug]).map(l => line(l, 'mini')).join(''); });
    }
  }

  paint();
})();
