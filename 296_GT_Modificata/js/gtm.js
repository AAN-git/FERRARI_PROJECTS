/* ═══════════════════════════════════════════════════════════════════════
   Ferrari 296 GT Modificata — the camera.

   One temporal idea on this page: a shot arrives. As a screen enters, the
   picture opens vertically out of the hall, the lens closes on the object,
   and the title settles last. Nothing else moves — no reveals on body
   copy, no counters, no parallax on the reading bands.

   Progressive enhancement in both directions: the CSS finished state is
   "arrived", so with the script blocked, failed or switched off the page
   is the completed composition, and prefers-reduced-motion is answered by
   never starting.

   GSAP earns its place for one thing — three scrubbed rates on one range,
   with the title deliberately behind the picture. Drop the offset and this
   becomes a scroll-driven CSS animation with no dependency.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  var phone = window.matchMedia('(max-width: 60rem)');
  if (still.matches) return;
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  if (!shots.length) return;
  document.documentElement.classList.add('js-motion');

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(v) { return 1 - Math.pow(1 - v, 3); }   /* out-cubic, a camera settling */

  function apply(shot, p, isPhone) {
    /* the aperture: the picture opens out of the hall */
    var openEnd = isPhone ? 0.22 : 0.30;
    var open = 1 - ease(clamp(p / openEnd));
    /* the push-in: shorter on a phone, where the screen is close to the eye */
    var zoomFrom = isPhone ? 1.06 : 1.10;
    var zoom = zoomFrom + (1 - zoomFrom) * ease(clamp(p / (isPhone ? 0.5 : 0.55)));
    /* the title lands after the picture — on a phone it simply is there */
    var t = isPhone ? (p > 0.12 ? 1 : 0) : ease(clamp((p - 0.08) / 0.26));
    /* the travel: the picture runs against the scroll the whole time it is
       on screen, ±6% of its own height, which is why the media box is 7%
       taller than the screen — the edge is never reachable */
    var par = (0.5 - p) * (isPhone ? 7 : 12);
    shot.style.setProperty('--open', open.toFixed(4));
    shot.style.setProperty('--zoom', zoom.toFixed(4));
    shot.style.setProperty('--t', t.toFixed(4));
    shot.style.setProperty('--par', par.toFixed(3));
  }

  var triggers = [];
  function build() {
    var isPhone = phone.matches;
    shots.forEach(function (shot) {
      triggers.push(ScrollTrigger.create({
        trigger: shot,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: function (self) { apply(shot, self.progress, isPhone); },
        onRefresh: function (self) { apply(shot, self.progress, isPhone); }
      }));
    });
  }
  build();

  function rebuild() {
    triggers.forEach(function (t) { t.kill(); });
    triggers = [];
    shots.forEach(function (s) {
      s.style.removeProperty('--open'); s.style.removeProperty('--zoom');
      s.style.removeProperty('--t'); s.style.removeProperty('--par');
    });
    build();
    ScrollTrigger.refresh();
  }

  /* the phone choreography is a different cut, not a scaled one */
  var last = phone.matches;
  window.addEventListener('resize', function () {
    if (phone.matches === last) return;
    last = phone.matches;
    rebuild();
  }, { passive: true });

  /* someone turning the system setting on mid-visit gets the still */
  if (still.addEventListener) {
    still.addEventListener('change', function () {
      if (!still.matches) return;
      triggers.forEach(function (t) { t.kill(); });
      triggers = [];
      shots.forEach(function (s) {
        s.style.removeProperty('--open'); s.style.removeProperty('--zoom');
        s.style.removeProperty('--t'); s.style.removeProperty('--par');
      });
    });
  }
})();

/* ═══════════════════════════════════════════════════════════════════════
   The dealer's navigation band pins, exactly as it does on the Purosangue
   pages and on cauleyferrari.com: past the height of the contact bar the
   band goes fixed and the bar scrolls away. Below 64rem there is no
   contact bar, so the whole header pins at once.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var bar  = document.querySelector('.header__top-bar');
  var wide = window.matchMedia('(min-width: 64.0625rem)');
  function syncPin() {
    var threshold = wide.matches && bar ? bar.offsetHeight : 0;
    document.body.classList.toggle('nav-pinned', window.scrollY > threshold);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { syncPin(); ticking = false; });
  }, { passive: true });
  if (wide.addEventListener) wide.addEventListener('change', syncPin);
  syncPin();
})();
