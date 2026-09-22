/* ═══════════════════════════════════════════════════════════════════════
   Ferrari 296 GT Modificata — the one temporal idea on this page.

   The room opens. Every photographic frame is an aperture cut into the
   page's ground: a 1px hairline lit in that frame's own floor colour,
   which opens symmetrically about its centre line while the picture
   inside settles late. Nothing else on the page moves, and no type ever
   animates.

   Progressive enhancement, in both directions:
   · the CSS default state is OPEN. This file is the only thing that ever
     closes a frame, so with the script blocked, failed or removed the
     page is the finished composition rather than an empty one;
   · under prefers-reduced-motion nothing is closed at all, and the
     apertures keep a static 1px rule along their bottom edge so the
     device leaves a trace instead of vanishing.

   GSAP earns its place here for exactly one reason: two scrubbed rates on
   one scroll range, so the frame arrives and the object catches up. If
   the lag is ever dropped, this dependency goes with it and the opening
   becomes a scroll-driven CSS animation.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  var phone = window.matchMedia('(max-width: 60rem)');

  if (still.matches) return;                       // authored still, already open
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var frames = Array.prototype.slice.call(document.querySelectorAll('.frame'));
  if (!frames.length) return;

  document.documentElement.classList.add('js-motion');

  /* the two rates. The opening finishes at 72% of the range; the picture
     starts at 28% and finishes with it, so the object settles last. On a
     phone the lag is removed outright — at a 219px frame the two-rate
     settle is invisible and only costs frames. */
  function rates(progress, lagged) {
    var open = Math.min(1, progress / 0.72);
    var pic  = lagged ? Math.max(0, Math.min(1, (progress - 0.28) / 0.72)) : open;
    return [open, pic];
  }

  function build() {
    var isPhone = phone.matches;

    frames.forEach(function (frame) {
      var peak = frame.classList.contains('peak__frame');
      /* Ranges are authored per format, never scaled: a phone scroll is
         fast, and a long scrub there reads as lag rather than as weight. */
      var start = isPhone ? 'top 78%' : 'top 82%';
      var end   = isPhone ? 'top 56%' : 'top 52%';
      if (peak) { start = isPhone ? 'top 88%' : 'top 90%'; end = isPhone ? 'top 48%' : 'top 20%'; }

      frame.classList.add('is-waiting');

      ScrollTrigger.create({
        trigger: frame,
        start: start,
        end: end,
        scrub: true,
        onUpdate: function (self) {
          var r = rates(self.progress, !isPhone);
          frame.style.setProperty('--p', r[0].toFixed(4));
          frame.style.setProperty('--q', r[1].toFixed(4));
        },
        onRefreshInit: function () {
          frame.style.removeProperty('--p');
          frame.style.removeProperty('--q');
        }
      });
    });
  }

  build();

  /* the phone choreography is a different animation, not a smaller one, so
     a crossing of the breakpoint rebuilds rather than rescales */
  var last = phone.matches;
  window.addEventListener('resize', function () {
    if (phone.matches === last) return;
    last = phone.matches;
    ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    frames.forEach(function (f) {
      f.classList.remove('is-waiting');
      f.style.removeProperty('--p');
      f.style.removeProperty('--q');
    });
    build();
    ScrollTrigger.refresh();
  }, { passive: true });

  /* someone switching the system setting on mid-visit gets the still */
  if (still.addEventListener) {
    still.addEventListener('change', function () {
      if (!still.matches) return;
      ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
      frames.forEach(function (f) {
        f.classList.remove('is-waiting');
        f.style.removeProperty('--p');
        f.style.removeProperty('--q');
      });
    });
  }
})();
