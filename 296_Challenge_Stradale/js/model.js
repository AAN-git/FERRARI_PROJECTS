/* Ferrari 296 Challenge Stradale — model page behaviour.
   Every piece works without the others, and with motion reduced the page is
   complete and still: no reveal, no parallax, no autoplay. */
(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  var root = document.documentElement;
  var lenis = null;

  /* ── lock the page under an overlay (Lenis and native) ─────────────── */
  var locks = 0;
  function lock(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    root.classList.toggle('is-locked', locks > 0);
    if (lenis) { if (locks > 0) lenis.stop(); else lenis.start(); }
  }

  /* trap Tab inside an open dialog */
  function trap(container, e) {
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call(
      container.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (el) { return !el.disabled && el.type !== 'hidden' && el.getClientRects().length > 0; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* generic open/close for a [hidden] overlay with an .is-open state */
  function overlay(el, onKey) {
    var opener = null, t = null;
    return {
      open: function (from) {
        clearTimeout(t);
        opener = from || document.activeElement;
        el.hidden = false; lock(true);
        requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('is-open'); }); });
        var first = el.querySelector('[data-panel-close], [data-lb-close]');
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 40);
      },
      close: function () {
        el.classList.remove('is-open'); lock(false);
        t = setTimeout(function () { el.hidden = true; }, still.matches ? 0 : 600);
        if (opener && opener.focus) opener.focus({ preventScroll: true });
      },
      isOpen: function () { return !el.hidden; },
      key: function (e) { if (!el.hidden) { if (onKey) onKey(e); trap(el, e); } }
    };
  }

  /* ── 1 · dealer header: mobile menu + the band that pins on scroll ─── */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? 'Close' : 'Menu';
    };
    burger.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1024 && !menu.hidden) setMenu(false); });
  }
  /* the 40px contact bar scrolls away; past it the navigation band pins */
  function pinNav() { document.body.classList.toggle('nav-pinned', window.scrollY > 40); }
  pinNav();
  window.addEventListener('scroll', pinNav, { passive: true });

  /* ── 2 · Register your interest — the dealer's contacts panel ──────── */
  (function () {
    var panel = document.getElementById('inquire');
    if (!panel) return;
    var dialog = panel.querySelector('.inq__dialog');
    var form = panel.querySelector('form');
    var opener = null, closing = null;
    function setUrl(open) {
      if (!window.history || !history.replaceState) return;
      var u = new URL(window.location.href);
      if (open) { u.searchParams.set('form', 'contacts'); u.searchParams.set('form_state', 'opened'); }
      else { u.searchParams.delete('form'); u.searchParams.delete('form_state'); }
      history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    }
    function open(from) {
      clearTimeout(closing);
      opener = from || document.activeElement;
      panel.hidden = false; lock(true);
      requestAnimationFrame(function () { requestAnimationFrame(function () { panel.classList.add('is-open'); }); });
      setUrl(true);
      setTimeout(function () { var f = panel.querySelector('#fname'); if (f) f.focus({ preventScroll: true }); }, 60);
    }
    function close() {
      panel.classList.remove('is-open'); lock(false); setUrl(false);
      closing = setTimeout(function () { panel.hidden = true; }, still.matches ? 0 : 560);
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    }
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-inquire]');
      if (t) { e.preventDefault(); open(t); return; }
      if (e.target.closest('[data-inq-close]')) { e.preventDefault(); close(); }
    });
    document.addEventListener('keydown', function (e) {
      if (panel.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      trap(dialog, e);
    });
    /* a layout: it sends nothing, but it says what is missing and where */
    var status = panel.querySelector('[data-inq-status]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [];
      form.querySelectorAll('.is-invalid').forEach(function (n) { n.classList.remove('is-invalid'); });
      form.querySelectorAll('input[required]:not([type=radio]):not([type=checkbox])').forEach(function (i) {
        var ok = i.value.trim() && (i.type !== 'email' || /.+@.+\..+/.test(i.value));
        if (!ok) { i.closest('.inq__field').classList.add('is-invalid'); i.setAttribute('aria-invalid', 'true'); bad.push(i); }
        else i.removeAttribute('aria-invalid');
      });
      var radios = form.querySelectorAll('input[name=contact_mode]');
      if (radios.length && !form.querySelector('input[name=contact_mode]:checked')) {
        form.querySelector('.inq__radios').classList.add('is-invalid'); bad.push(radios[0]);
      }
      var terms = form.querySelector('input[name=terms_agree]');
      if (terms && !terms.checked) { terms.closest('.inq__choice').classList.add('is-invalid'); bad.push(terms); }
      if (bad.length) {
        status.textContent = 'Please complete the ' + bad.length + (bad.length === 1 ? ' required field' : ' required fields') + ' marked in red.';
        bad[0].focus();
      } else {
        status.textContent = 'Thank you — this is a preview, so nothing was sent. The form connects to the Cauley Ferrari inquiry system at launch.';
      }
    });
    var q = new URLSearchParams(window.location.search);
    if (q.get('form') === 'contacts' && q.get('form_state') === 'opened') open(null);
  })();

  /* ── 3 · hero: two slides, crossfade, visible pause (Momentum) ─────── */
  (function () {
    var slides = [].slice.call(document.querySelectorAll('.hero__slide'));
    var dots = [].slice.call(document.querySelectorAll('.hero .dots__dot'));
    var toggle = document.querySelector('[data-hero-toggle]');
    if (slides.length < 2) return;
    var i = 0, timer = null, paused = still.matches;
    function show(n) {
      slides[i].classList.remove('is-active'); dots[i].classList.remove('is-active'); dots[i].removeAttribute('aria-current');
      i = (n + slides.length) % slides.length;
      var img = slides[i].querySelector('img'); if (img && img.loading === 'lazy') img.loading = 'eager';
      slides[i].classList.add('is-active'); dots[i].classList.add('is-active'); dots[i].setAttribute('aria-current', 'true');
    }
    function run() { clearInterval(timer); if (!paused) timer = setInterval(function () { show(i + 1); }, 7000); }
    function setPaused(p) {
      paused = p; toggle.classList.toggle('is-paused', p);
      toggle.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow'); run();
    }
    dots.forEach(function (d, n) { d.addEventListener('click', function () { show(n); run(); }); });
    toggle.addEventListener('click', function () { setPaused(!paused); });
    setPaused(paused);
  })();

  /* ── 4 · the Powertrain film: plays in view, pausable, still if reduced ─ */
  (function () {
    var v = document.querySelector('[data-film]');
    var btn = document.querySelector('[data-film-toggle]');
    if (!v || !btn) return;
    var userPaused = still.matches, inView = false;
    function sync() {
      if (userPaused || !inView) { v.pause(); }
      else { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      btn.classList.toggle('is-paused', userPaused);
      btn.setAttribute('aria-label', userPaused ? 'Play video' : 'Pause video');
    }
    btn.addEventListener('click', function () { userPaused = !userPaused; sync(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { inView = en[0].isIntersecting; sync(); }, { threshold: .25 }).observe(v);
    } else { inView = true; }
    sync();
  })();

  /* ── 5 · Design panel (AA-03 copy + AA-03b image) ─────────────────── */
  (function () {
    var el = document.getElementById('design-panel');
    if (!el) return;
    var p = overlay(el, function (e) { if (e.key === 'Escape') shut(); });
    function shut() { p.close(); root.classList.remove('panel-open'); }
    document.addEventListener('click', function (e) {
      var o = e.target.closest('[data-panel-open]');
      if (o) { root.classList.add('panel-open'); p.open(o); return; }
      if (e.target.closest('[data-panel-close]')) shut();
    });
    document.addEventListener('keydown', p.key);
  })();

  /* ── 6 · gallery: two-row carousel + full-screen viewer ───────────── */
  (function () {
    var track = document.querySelector('[data-gal-track]');
    if (!track) return;
    var prev = document.querySelector('[data-gal-prev]');
    var next = document.querySelector('[data-gal-next]');
    function page(dir) { track.scrollBy({ left: dir * track.clientWidth, behavior: still.matches ? 'auto' : 'smooth' }); }
    var frame = track.closest('.gallery__frame');
    function ends() {
      var max = track.scrollWidth - track.clientWidth - 2;
      frame.classList.toggle('is-static', max <= 0);
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    if (prev) prev.addEventListener('click', function () { page(-1); });
    if (next) next.addEventListener('click', function () { page(1); });
    track.addEventListener('scroll', ends, { passive: true });
    window.addEventListener('resize', ends);
    ends();

    var lb = document.getElementById('lightbox');
    var img = lb.querySelector('[data-lb-img]');
    var count = lb.querySelector('[data-lb-count]');
    var tiles = [].slice.call(track.querySelectorAll('[data-gal-open] img'));
    var at = 0;
    function show(n) {
      at = (n + tiles.length) % tiles.length;
      var t = tiles[at];
      img.src = t.getAttribute('src').replace('-sm.webp', '.webp');
      img.alt = t.alt;
      count.textContent = (at + 1) + ' / ' + tiles.length;
    }
    var o = overlay(lb, function (e) {
      if (e.key === 'Escape') o.close();
      else if (e.key === 'ArrowRight') show(at + 1);
      else if (e.key === 'ArrowLeft') show(at - 1);
    });
    track.addEventListener('click', function (e) {
      var b = e.target.closest('[data-gal-open]'); if (!b) return;
      show(+b.getAttribute('data-gal-open')); o.open(b);
    });
    lb.querySelector('[data-lb-close]').addEventListener('click', o.close);
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(at - 1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(at + 1); });
    var x0 = null;
    lb.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    lb.addEventListener('pointerup', function (e) {
      if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
    });
    document.addEventListener('keydown', o.key);
  })();

  /* ── keyboard: focus inside a pinned module scrolls it back into view, so
        the module sliding over it never hides the focused control ───── */
  document.querySelectorAll('.pin').forEach(function (pin) {
    pin.addEventListener('focusin', function () {
      var top = pin.closest('.stack').getBoundingClientRect().top + window.scrollY;
      var nextTop = pin.nextElementSibling ? pin.nextElementSibling.getBoundingClientRect().top : Infinity;
      if (nextTop < window.innerHeight - 4) {
        if (lenis) lenis.scrollTo(top, { immediate: true }); else window.scrollTo(0, top);
      }
    });
  });

  if (still.matches) return;   /* nothing below runs with motion reduced */

  /* ── 7 · entrance: fade + nudge, once ─────────────────────────────── */
  (function () {
    var items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { items.forEach(function (n) { n.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0 });
    items.forEach(function (n) { io.observe(n); });
    /* the first screen arrives on load, not on scroll */
    requestAnimationFrame(function () {
      document.querySelectorAll('.hero [data-reveal]').forEach(function (n, k) {
        setTimeout(function () { n.classList.add('is-in'); }, 300 + k * 150);
      });
    });
  })();

  /* ── 7b · stat counters, as the live template runs them: from 0 to the
        value over 2s when the figures come into view, once. The final
        value is in the markup, so without motion nothing changes. ───── */
  (function () {
    var nums = [].slice.call(document.querySelectorAll('[data-count]'));
    if (!nums.length || !('IntersectionObserver' in window)) return;
    var fmt = function (v, dec) {
      return v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    };
    nums.forEach(function (n) {
      var target = parseFloat(n.getAttribute('data-count'));
      var dec = (n.getAttribute('data-count').split('.')[1] || '').length;
      n.setAttribute('aria-label', n.textContent);   /* read the value, not the ticks */
      n.textContent = fmt(0, dec);
      n._run = function () {
        var t0 = null, D = 2000;
        function step(t) {
          if (t0 === null) t0 = t;
          var k = Math.min(1, (t - t0) / D);
          var e = 1 - Math.pow(1 - k, 3);             /* settles, like an ease-out */
          n.textContent = fmt(target * e, dec);
          if (k < 1) requestAnimationFrame(step); else n.textContent = fmt(target, dec);
        }
        requestAnimationFrame(step);
      };
    });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.querySelectorAll('[data-count]').forEach(function (n) { n._run(); });
        io.unobserve(x.target);
      });
    }, { threshold: .4 });
    document.querySelectorAll('.stats').forEach(function (s) { io.observe(s); });
  })();

  /* ── 8 · parallax + the pinned module darkening as the next covers it ─ */
  (function () {
    var layers = [].slice.call(document.querySelectorAll('[data-parallax]')).map(function (el) {
      var target = el.matches('.split__media') ? el.querySelector('img') : el;
      return { box: el.closest('section'), el: target, wrap: el, split: el.matches('.split__media') };
    });
    var pins = [].slice.call(document.querySelectorAll('.pin')).map(function (el) {
      return { el: el, shade: el.querySelector('.pin__shade'), next: el.nextElementSibling };
    });
    var ticking = false;
    function frame() {
      ticking = false;
      var vh = window.innerHeight;
      layers.forEach(function (l) {
        var r = l.box.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        /* -1 when the section enters from below, +1 when it leaves at the top */
        var p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
        p = Math.max(-1, Math.min(1, p));
        /* travel is capped by the overflow the layer actually has (6% of
           its box, 18% for the phone's image band) */
        var h = l.wrap.getBoundingClientRect().height;
        var cap = l.split ? h * (window.innerWidth < 768 ? .17 : .05) : h * .05;
        var range = Math.min(l.split ? 48 : 64, cap);
        l.el.style.setProperty('--py', (p * range).toFixed(1) + 'px');
      });
      pins.forEach(function (p) {
        if (!p.next || !p.shade) return;
        var top = p.next.getBoundingClientRect().top;
        var k = 1 - Math.max(0, Math.min(1, top / vh));      /* 0 → next at the bottom, 1 → it covers */
        p.shade.style.setProperty('--cover', (k * .6).toFixed(3));
      });
    }
    function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    frame();
  })();

  /* ── 9 · Lenis: inertia on the wheel, native everything else ───────── */
  (function start() {
    if (!window.Lenis) { window.addEventListener('load', function () { if (window.Lenis && !lenis) start(); }, { once: true }); return; }
    lenis = new window.Lenis({ autoRaf: true, lerp: 0.09, anchors: true, allowNestedScroll: true });
    if (locks > 0) lenis.stop();
  })();
})();
