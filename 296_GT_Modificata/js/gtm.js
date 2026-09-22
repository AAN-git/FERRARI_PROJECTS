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
