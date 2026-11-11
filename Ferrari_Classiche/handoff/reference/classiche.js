/* Arrival, once per element, as it comes into view — Momentum's Fade and
   Slide (FERRARI_DESIGN.md §7). The roles and their distances live in
   classiche.css; this only marks what has been seen. Without this file, or
   under reduced motion, nothing is ever hidden. */

(function () {
  'use strict';
  window.__fcRv = true;
  var root = document.documentElement;
  if (!root.classList.contains('js-rv')) return;

  var ROLES = '.fc-hero__pretitle, .fc-hero__title, .fc-hero__body .actions,' +
    '.fc-intro__body > *, .fc-shell > .marker, .fc-split > *, .fc-value,' +
    '.fc-step__media, .fc-step__body, .fc-feature__media, .fc-feature__copy,' +
    '.fc-card, .fc-close__copy, .fc-close__media';
  var els = [].slice.call(document.querySelectorAll(ROLES));

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();
