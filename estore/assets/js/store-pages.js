// Genuine Store mockup — mega dropdowns, listing filters, product page, slide-in request.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const desktop = window.matchMedia('(min-width:961px)');
  let lastFocus = null;
  const lock = (on) => { document.documentElement.style.overflow = on ? 'hidden' : ''; };

  /* sticky offsets follow the real store-bar height (64 desktop, ~100 with the mobile department row) */
  const sbar = $('.storebar');
  const setSb = () => sbar && document.documentElement.style.setProperty('--sb', sbar.offsetHeight + 'px');
  setSb(); window.addEventListener('resize', setSb);

  /* ---------------- mega dropdowns (store.ferrari.com pattern) ---------------- */
  const items = $$('.cats__item');
  let closeT = null;
  const cats = $('.cats');
  const closeMega = (keepSwitch) => { items.forEach(it => { it.classList.remove('is-open'); it.firstElementChild.setAttribute('aria-expanded', 'false'); }); if (!keepSwitch) cats?.classList.remove('is-switching'); };
  // first open fades; moving between items swaps instantly (store.ferrari.com behaviour, no cross-faded text)
  const openMega = (it) => { clearTimeout(closeT); const was = items.some(x => x.classList.contains('is-open')); cats?.classList.toggle('is-switching', was); closeMega(true); it.classList.add('is-open'); it.firstElementChild.setAttribute('aria-expanded', 'true'); };
  items.forEach(it => {
    it.addEventListener('mouseenter', () => desktop.matches && openMega(it));
    it.addEventListener('mouseleave', () => { closeT = setTimeout(() => closeMega(), 160); });
    it.addEventListener('focusin', () => desktop.matches && openMega(it));
    it.addEventListener('focusout', (e) => { if (!it.contains(e.relatedTarget) && !e.relatedTarget?.closest?.('.cats__item')) closeMega(); });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMega(); });

  /* ---------------- slide-in request (CauleyFerrari.com popup-fr) ---------------- */
  const pop = $('#request');
  if (pop) {
    const veh = $('.popup__vehicle', pop), img = $('.popup__vehicle-image-outer', pop);
    const form = $('.req', pop), done = $('.req__done', pop), err = $('.req__err', pop);
    const open = (trigger) => {
      lastFocus = trigger || document.activeElement;
      const name = trigger?.dataset.itemName, spec = trigger?.dataset.itemSpec, src = trigger?.dataset.itemImg;
      const type = trigger?.dataset.request || 'info';
      if (name) {
        veh.hidden = false;
        $('.popup__item-name', pop).textContent = name;
        $('.popup__vehicle-spec', pop).textContent = spec || '';
        img.classList.toggle('is-ph', !src);
        img.innerHTML = src ? `<img src="${src}" alt="">` : 'Parts photo supplied by Cauley';
      } else veh.hidden = true;
      $('#req-title', pop).textContent = type === 'backorder' ? 'Enquire or backorder' : type === 'part' ? 'Request a part' : 'Request information';
      const radio = $(`input[name="type"][value="${type}"]`, pop); if (radio) radio.checked = true;
      const msg = $('#r-msg', pop);
      if (!msg.value || msg.dataset.auto) {
        msg.value = name ? `I would like more information about:\n${name}${spec ? ' — ' + spec : ''}` :
          type === 'part' ? 'Model and year:\nPart needed:' : '';
        msg.dataset.auto = '1';
      }
      form.hidden = false; done.hidden = true; err.hidden = true;
      $$('.is-err', pop).forEach(x => x.classList.remove('is-err'));
      pop.classList.add('is-active'); pop.setAttribute('aria-hidden', 'false'); lock(true);
      setTimeout(() => $('#r-fn', pop).focus({ preventScroll: true }), 60);
    };
    const close = () => {
      pop.classList.remove('is-active'); pop.setAttribute('aria-hidden', 'true'); lock(false);
      lastFocus?.focus?.({ preventScroll: true });
    };
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-request]');
      if (t) { e.preventDefault(); open(t); }
      if (e.target.closest('#request [data-close]')) { e.preventDefault(); close(); }
    });
    document.addEventListener('keydown', (e) => {
      if (!pop.classList.contains('is-active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { // keep focus inside the panel
        const f = $$('button, [href], input, textarea', $('.popup__dialog', pop)).filter(x => !x.closest('[hidden]') && x.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
      }
    });
    $('#r-msg', pop).addEventListener('input', (e) => { delete e.target.dataset.auto; });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('.fld', form).forEach(f => { const i = $('input,textarea', f); const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); f.classList.toggle('is-err', bad); if (bad) ok = false; });
      const consent = $('.req__consent', form); const c = $('input', consent); consent.classList.toggle('is-err', !c.checked); if (!c.checked) ok = false;
      err.hidden = ok;
      if (!ok) { $('.is-err input, .is-err textarea', form)?.focus(); return; }
      form.hidden = true; done.hidden = false; done.focus();
    });
  }

  /* ---------------- listing ---------------- */
  const grid = $('[data-grid]');
  if (grid) {
    const tiles = $$('.tile', grid), svc = $('[data-service]', grid);
    const refine = $('#refine'), rform = $('[data-refine-form]');
    const params = new URLSearchParams(location.search);
    const st = { dept: params.get('dept') || '', sub: params.get('sub') || '', model: params.getAll('model'), avail: [], flag: [] };
    if (params.get('new')) st.flag.push('new');
    if (params.get('sale')) st.flag.push('sale');
    const names = { parts: 'Parts', accessories: 'Accessories', apparel: 'Apparel', collectibles: 'Collectibles' };
    const label = (name, v) => $(`input[name="${name}"][value="${v}"]`, rform)?.closest('.chk')?.querySelector('span')?.textContent || v;

    const syncForm = () => {
      $$('input', rform).forEach(i => {
        const list = i.name === 'dept' ? (st.dept ? [st.dept] : []) : st[i.name] || [];
        i.checked = list.includes(i.value);
      });
    };
    const apply = () => {
      let n = 0;
      tiles.forEach(t => {
        const d = t.dataset, models = d.models.split(' ');
        const ok = (!st.dept || d.dept === st.dept) && (!st.sub || d.sub === st.sub) &&
          (!st.model.length || st.model.some(m => models.includes(m))) &&
          (!st.avail.length || st.avail.includes(d.sold === '1' ? 'sold' : 'in')) &&
          (!st.flag.length || st.flag.every(f => d[f] === '1'));
        t.hidden = !ok; if (ok) n++;
      });
      if (svc) svc.hidden = !(n && (!st.dept || st.dept === 'parts'));
      $$('[data-count]').forEach(x => x.textContent = n);
      $('[data-empty]').hidden = n > 0;
      // chips
      $$('.chip[data-dept]').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.dept === st.dept)));
      $$('.chip--sub').forEach(c => { c.hidden = c.dataset.for !== st.dept; c.setAttribute('aria-pressed', String(c.dataset.sub === st.sub)); });
      // title, crumbs, active list
      const sub = st.sub && $(`.chip--sub[data-sub="${st.sub}"]`)?.firstChild.textContent;
      const title = st.flag.includes('sale') ? 'On sale' : st.flag.includes('new') && !st.dept ? 'New in' : sub || names[st.dept] || 'All products';
      $('#plp-title').textContent = title;
      $('.crumbs [aria-current]').textContent = title;
      document.title = document.title.replace(/^[^|]+/, title + ' ');
      const act = [...st.model.map(m => label('model', m)), ...st.avail.map(a => label('avail', a)), ...st.flag.map(f => label('flag', f))];
      $('[data-active-list]').textContent = act.length ? 'Filtered by: ' + act.join(', ') : '';
      const badge = $('[data-active]'); badge.hidden = !act.length; badge.textContent = act.length;
      // url
      const q = new URLSearchParams();
      if (st.dept) q.set('dept', st.dept); if (st.sub) q.set('sub', st.sub);
      st.model.forEach(m => q.append('model', m)); st.flag.forEach(f => q.set(f, '1'));
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
      sort();
    };
    const sort = () => {
      const how = $('#sort').value;
      const key = (t) => how === 'az' ? t.dataset.name : how === 'new' ? (t.dataset.new === '1' ? 0 : 1) * 1000 + +t.dataset.order : +t.dataset.order;
      const sorted = tiles.slice().sort((a, b) => (key(a) > key(b)) - (key(a) < key(b)));
      sorted.forEach(t => grid.appendChild(t));
      if (svc) { const vis = sorted.filter(t => !t.hidden); grid.insertBefore(svc, vis[7] || null); } // end of row 2 at 4 columns
    };
    $$('.chip[data-dept]').forEach(c => c.addEventListener('click', () => { st.dept = c.dataset.dept; st.sub = ''; syncForm(); apply(); }));
    $$('.chip--sub').forEach(c => c.addEventListener('click', () => { st.sub = st.sub === c.dataset.sub ? '' : c.dataset.sub; apply(); }));
    $('#sort').addEventListener('change', sort);
    rform.addEventListener('change', (e) => {
      const i = e.target;
      if (i.name === 'dept') { st.dept = i.checked ? i.value : ''; st.sub = ''; $$('input[name="dept"]', rform).forEach(x => { if (x !== i) x.checked = false; }); }
      else st[i.name] = $$(`input[name="${i.name}"]:checked`, rform).map(x => x.value);
      apply();
    });
    $$('[data-clear]').forEach(b => b.addEventListener('click', () => { st.dept = ''; st.sub = ''; st.model = []; st.avail = []; st.flag = []; syncForm(); apply(); }));
    const rbtn = $('.ptool__refine');
    const openR = () => { lastFocus = rbtn; refine.classList.add('is-active'); refine.setAttribute('aria-hidden', 'false'); rbtn.setAttribute('aria-expanded', 'true'); lock(true); setTimeout(() => $('input', rform)?.focus({ preventScroll: true }), 60); };
    const closeR = () => { refine.classList.remove('is-active'); refine.setAttribute('aria-hidden', 'true'); rbtn.setAttribute('aria-expanded', 'false'); lock(false); rbtn.focus({ preventScroll: true }); };
    rbtn.addEventListener('click', openR);
    $$('[data-refine-close]').forEach(b => b.addEventListener('click', closeR));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && refine.classList.contains('is-active')) closeR(); });
    // sticky toolbar shadow
    const tool = $('[data-ptool]');
    const io = new IntersectionObserver(([en]) => tool.classList.toggle('is-stuck', en.intersectionRatio < 1), { rootMargin: '-65px 0px 0px 0px', threshold: [1] });
    io.observe(tool);
    syncForm(); apply();
  }

  /* ---------------- home finder → listing ---------------- */
  const finder = $('.finder');
  if (finder) finder.addEventListener('submit', (e) => {
    e.preventDefault();
    const map = { '296 GTB / GTS': '296', '12Cilindri': '12cil', 'Purosangue': 'puro', 'Amalfi / Amalfi Spider': 'amalfi', 'Roma / Roma Spider': 'roma', 'SF90 Stradale / Spider': 'sf90', 'F8 Tributo / Spider': 'f8', 'Past models': 'past' };
    const q = new URLSearchParams();
    const m = map[$('#f-model').value]; if (m) q.set('model', m);
    const d = $('#f-cat').value.toLowerCase(); if (d && d !== 'all categories') q.set('dept', d);
    location.href = 'shop.html' + (q.toString() ? '?' + q : '');
  });

  /* ---------------- product page ---------------- */
  const qin = $('[data-qty-input]');
  $$('[data-qty]').forEach(b => b.addEventListener('click', () => { qin.value = Math.min(9, Math.max(1, (+qin.value || 1) + +b.dataset.qty)); }));
  $$('[data-add]').forEach(b => b.addEventListener('click', () => {
    const badge = $('.tool__badge'); if (badge) badge.textContent = (+badge.textContent || 0) + (+qin?.value || 1);
    const msg = $('.pdp__added'); if (msg) { msg.hidden = false; }
  }));
})();
