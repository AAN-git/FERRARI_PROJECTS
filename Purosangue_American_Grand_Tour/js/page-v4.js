/* v2 only. Two behaviours, both additive — the page is complete and correct
   with this file absent, which is the test each of them has to pass. */

(function () {
  'use strict';

  /* 1 · The pinned navigation band.

     Measured on cauleyferrari.com: their header sits absolute over the hero,
     the 40px contact bar scrolls away with the page, and the 96px navigation
     band — black at 60% — stays at the top of the viewport, on the way down
     and on the way up alike. It is done there with a JS transform; done here
     by pinning the band once the contact bar has passed, which is the same
     result with nothing to keep in sync per frame.

     The header is absolutely positioned, so taking the band out of its flow
     shifts nothing: no reflow, no jump in the content underneath. Below the
     band's own breakpoint the contact bar is already hidden, so there is
     nothing to scroll away and the whole header pins instead. */
  var bar = document.querySelector('.header__top-bar');
  var wide = window.matchMedia('(min-width: 64.0625rem)');

  function syncPin() {
    var threshold = wide.matches && bar ? bar.offsetHeight : 0;
    document.body.classList.toggle('nav-pinned', window.scrollY > threshold);
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { syncPin(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  wide.addEventListener('change', syncPin);
  syncPin();

  /* 2 · The gallery pairs arrive one at a time.

     The hidden state is applied here rather than in the stylesheet, so a
     failure to load this file, or a reduced-motion setting, leaves every frame
     visible exactly where it belongs — the static page is the correct page and
     the motion is only how it assembles.

     Each image is observed on its own. Both halves of a pair are top-aligned
     and would otherwise cross the line together, so the interior carries a
     delay: the exterior lands, then the interior follows it. Nothing arrives
     as a group. */
  /* The dip that used to cover the hero film's loop point is gone: the clip is
     now a seamless loop cut by the client, so its last frame meets its first
     and there is no seam left to hide. Covering a join that no longer exists
     would be a fade with nothing behind it. */

  /* The loop join, only where the clip still has one.

     Cauley's hero is a seamless cut and is left alone. A clip that declares
     `data-seam="hard"` has a real join, and `loop` shows it as a jump cut, so
     the film dips to nothing across its own loop point and comes back. Bound
     to the clip rather than to the page: swap in a seamless file, drop the
     attribute, and this stops applying without another line changing. */
  var film = document.querySelector('.hero__video[data-seam="hard"]');
  if (film && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var SEAM = 0.7;
    film.addEventListener('timeupdate', function () {
      var d = film.duration;
      if (!d || isNaN(d)) return;
      film.classList.toggle('is-seam', d - film.currentTime <= SEAM);
    });
    film.addEventListener('seeked', function () { film.classList.remove('is-seam'); });
    film.addEventListener('play',   function () { film.classList.remove('is-seam'); });
  }

  /* 2 · Each composition assembles in the order it is read.

     One idea, and it is the one the layout already states in space: the
     exterior is the subject, the interior is its consequence, the name binds
     them and the copy explains them. Before this the two frames made the same
     gesture and the words were simply already there — the unit arrived half
     animated, and the half that carries the meaning did not participate.

     The observer watches the ENTRY, not its pictures, and the stagger lives in
     the stylesheet keyed to each part's role. So Greenwich's three
     compositions inherit it without a line of JavaScript, and a fourth would
     too — the system is bound to what a thing is, never to which one it is.
     The Heritage band joins on the same terms: it is a role in the markup, not
     a section looked up by name.

     Hidden state is applied here and nowhere else: with this file missing, or
     under prefers-reduced-motion, every entry is simply in place. */
  var entries = document.querySelectorAll('.entry, .chapter--plain');
  if (!entries.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  Array.prototype.forEach.call(entries, function (el) { el.classList.add('is-waiting'); });

  var io = new IntersectionObserver(function (rows) {
    rows.forEach(function (row) {
      if (!row.isIntersecting) return;
      row.target.classList.add('is-in');
      io.unobserve(row.target);      /* it assembles once; scrolling back does not replay it */
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  Array.prototype.forEach.call(entries, function (el) { io.observe(el); });
}());
