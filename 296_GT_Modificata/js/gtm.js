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
