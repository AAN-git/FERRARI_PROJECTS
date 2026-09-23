/* ═══════════════════════════════════════════════════════════════════════
   Ferrari 296 GT Modificata — motion.

   One observer, two states. A frame opens from its centre line and its
   picture settles; a text block slides up a short distance and fades in.
   Each element arrives once and then stays put: nothing moves while it is
   being read, and nothing re-animates on the way back up.

   No library. The stylesheet's finished state is "arrived", so with this
   file blocked, failed or switched off — or with prefers-reduced-motion
   set — the page is the completed composition rather than an empty one.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (still.matches || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js');

  var items = document.querySelectorAll('.reveal, .slide');
  if (!items.length) { document.documentElement.classList.remove('js'); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);           /* arrives once */
    });
  }, {
    /* it starts as it comes over the fold, and has finished by the time it
       is in the reading zone */
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.08
  });

  items.forEach(function (el) { io.observe(el); });

  /* anything already on screen at load is simply there */
  requestAnimationFrame(function () {
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) { el.classList.add('is-in'); io.unobserve(el); }
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════════════
   The dealer's navigation band pins, as it does on cauleyferrari.com:
   past the height of the contact bar the band goes fixed and the bar
   rides away with the page. Below 64rem there is no contact bar, so the
   whole header pins at once.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var bar  = document.querySelector('.header__top-bar');
  var wide = window.matchMedia('(min-width: 64.0625rem)');
  function sync() {
    var threshold = wide.matches && bar ? bar.offsetHeight : 0;
    document.body.classList.toggle('nav-pinned', window.scrollY > threshold);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { sync(); ticking = false; });
  }, { passive: true });
  if (wide.addEventListener) wide.addEventListener('change', sync);
  sync();
})();

/* ═══════════════════════════════════════════════════════════════════════
   The drawer over the cabin frame. It is open in the markup, so the text
   exists without this file; the button is only what puts it away so the
   picture can be seen whole.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  document.querySelectorAll('.drawer__toggle').forEach(function (btn) {
    var stage = btn.closest('.stage');
    if (!stage) return;
    btn.addEventListener('click', function () {
      var closed = stage.classList.toggle('is-closed');
      btn.setAttribute('aria-expanded', String(!closed));
      btn.querySelector('.sr-only').textContent = closed
        ? 'Show the text about the cabin'
        : 'Hide the text and see the picture';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════════════
   The first screen opens itself. The stylesheet holds the picture and the
   words back only while `.js` is set, so with the script blocked or with
   prefers-reduced-motion the first screen is simply there; here it is
   released as soon as the picture has decoded, and in any case within
   1.2s, so a slow image can never leave the screen empty.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var img  = hero.querySelector('img');
  var done = false;
  function open() {
    if (done) return; done = true;
    /* two frames: the held state has to be painted once, or the browser
       has nothing to transition from and the screen simply appears */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add('is-in'); });
    });
  }
  if (img && typeof img.decode === 'function') { img.decode().then(open, open); }
  else if (img && !img.complete) { img.addEventListener('load', open); img.addEventListener('error', open); }
  else { open(); }
  setTimeout(open, 1200);
})();
