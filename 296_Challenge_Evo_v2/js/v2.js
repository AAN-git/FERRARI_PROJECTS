/* 296 Challenge v2 (Stradale and Evo) — the ferrari.com layer on top of model.js:
   line-split plates and strips, their wipe-in, the rolling figures, the image
   wipes and the floating section navigator. With motion reduced, only the
   navigator runs; everything else is already in its final state. */
(function () {
  'use strict';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motion = !still && 'IntersectionObserver' in window;

  /* ── 1 · split plates and strips into one element per visual line ───── */
  var splitTargets = [].slice.call(document.querySelectorAll('.tb .plate, .tb .strip'));
  splitTargets.forEach(function (el) { el.setAttribute('data-src', el.textContent); });

  function split() {
    splitTargets.forEach(function (el) {
      var host = el._host || el.parentNode;
      var text = el.getAttribute('data-src');
      var cls = el.className;
      // rebuild as a measuring run of words
      var probe = document.createElement('span');
      probe.className = cls; probe.style.display = 'inline';
      var words = text.split(/\s+/);
      words.forEach(function (w, i) {
        var s = document.createElement('span'); s.textContent = w;
        s.style.whiteSpace = 'nowrap';   /* a hyphenated word must not break inside the probe */
        probe.appendChild(s);
        if (i < words.length - 1) probe.appendChild(document.createTextNode(' '));  /* the break opportunity */
      });
      // clear the host's previous lines (or the original element)
      if (el._lines) el._lines.forEach(function (n) { n.remove(); }); else el.remove();
      host.appendChild(probe);
      var lines = [], top = null, cur = null;
      [].forEach.call(probe.children, function (s) {
        var t = s.offsetTop;
        if (top === null || Math.abs(t - top) > 2) { top = t; cur = []; lines.push(cur); }
        cur.push(s.textContent);
      });
      lines = lines.map(function (ws) { return [ws.join(' ')]; });
      probe.remove();
      el._host = host;
      el._lines = lines.map(function (ws, i) {
        var ln = document.createElement('span'); ln.className = 'ln'; ln.style.setProperty('--i', i);
        var inner = document.createElement('span'); inner.className = cls; inner.textContent = ws.join('').trim();
        ln.appendChild(inner); host.appendChild(ln); return ln;
      });
    });
    // stagger copy lines across the whole block, after its title
    document.querySelectorAll('.tb').forEach(function (tb) {
      tb.querySelectorAll('.tb__desc .ln').forEach(function (ln, i) { ln.style.setProperty('--i', i); });
      tb.classList.add('tb-ready');
    });
  }
  /* split once the face is in — a fallback face measures narrower and would
     leave lines that overflow once Ferrari Sans arrives — and again on load */
  function splitWhenReady() {
    var fs = document.fonts;
    if (fs && fs.load) {
      Promise.all([fs.load('500 14px "Ferrari Sans"'), fs.load('500 60px "Ferrari Sans"')])
        .then(function () { return fs.ready; }).then(split, split);
    } else split();
  }
  splitWhenReady();
  window.addEventListener('load', function () { split(); });
  var rw = null, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (Math.abs(window.innerWidth - lastW) < 2) return;
    clearTimeout(rw); rw = setTimeout(function () { lastW = window.innerWidth; split(); }, 150);
  });

  /* ── 2 · wipe-in of the text blocks and the split images ────────────── */
  /* once a text block's wipe has played, its lines drop the clip-path
     (is-done): a clipped layer left on a pinned, parallaxed module flickers
     in Safari / retina Chrome while scrolling — the title vanished and came back */
  function reveal(n) {
    if (n.classList.contains('is-in')) return;
    n.classList.add('is-in');
    if (n.hasAttribute('data-tb')) setTimeout(function () { n.classList.add('is-done'); }, motion ? 1800 : 0);
  }
  if (motion) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { reveal(x.target); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -30% 0px', threshold: 0 });
    document.querySelectorAll('[data-tb], [data-wipe-media]').forEach(function (n) { io.observe(n); });
    /* a block anchored to the foot of a full-screen module (Design is pinned)
       can stay in the bottom 30% the observer above ignores — it would wait,
       empty, until the module scrolls away. Once the module fills the screen
       (its top within the top 10%, e.g. after a navigator jump), every block of
       it already on screen comes in. */
    var io3 = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var vh = window.innerHeight, left = 0;
        x.target.querySelectorAll('[data-tb]').forEach(function (tb) {
          if (tb.classList.contains('is-in')) return;
          if (tb.getBoundingClientRect().top < vh) { reveal(tb); io.unobserve(tb); } else left++;
        });
        if (!left) io3.unobserve(x.target);
      });
    }, { rootMargin: '0px 0px -90% 0px', threshold: 0 });
    [].forEach.call(document.querySelectorAll('section'), function (s) { if (s.querySelector('[data-tb]')) io3.observe(s); });
    /* the first screen's blocks arrive on load */
    requestAnimationFrame(function () {
      document.querySelectorAll('.hero [data-tb]').forEach(reveal);
    });
  } else {
    document.querySelectorAll('[data-tb], [data-wipe-media]').forEach(reveal);
  }

  /* ── 3 · rolling figures (ferrari.com's digit columns) ──────────────── */
  var nums = [].slice.call(document.querySelectorAll('[data-odo]'));
  nums.forEach(function (n) {
    var val = n.getAttribute('data-odo');
    n.setAttribute('aria-label', val);
    if (!motion) return;
    n.textContent = '';
    var digits = 0;
    val.split('').forEach(function (ch) {
      if (/\d/.test(ch)) {
        var d = document.createElement('span'); d.className = 'odo__d'; d.setAttribute('aria-hidden', 'true');
        var col = document.createElement('span'); col.className = 'odo__col';
        for (var k = 0; k < 20; k++) { var c = document.createElement('span'); c.textContent = k % 10; col.appendChild(c); }
        col.setAttribute('data-to', 10 + +ch);
        col.style.transitionDelay = (digits++ * 90) + 'ms';
        d.appendChild(col); n.appendChild(d);
      } else {
        var s = document.createElement('span'); s.className = 'odo__sep'; s.setAttribute('aria-hidden', 'true'); s.textContent = ch; n.appendChild(s);
      }
    });
  });
  if (motion && nums.length) {
    var io2 = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.querySelectorAll('.odo__col').forEach(function (col) {
          col.style.transform = 'translateY(-' + col.getAttribute('data-to') + 'em)';
        });
        io2.unobserve(x.target);
      });
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0 });
    document.querySelectorAll('.odo-row').forEach(function (r) { io2.observe(r); });
  }

  /* ── 4 · the section navigator ───────────────────────────────────────── */
  var nav = document.querySelector('[data-snav]');
  if (nav) {
    var links = [].slice.call(nav.querySelectorAll('.snav__item'));
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var hero = document.querySelector('.hero');
    var footer = document.querySelector('.super-footer');
    nav.hidden = false;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var show = window.scrollY > (hero ? hero.offsetHeight * .6 : 0) &&
                 (!footer || footer.getBoundingClientRect().top > vh * .85) &&
                 !document.documentElement.classList.contains('is-locked');
      nav.classList.toggle('is-shown', show);
      nav.setAttribute('aria-hidden', show ? 'false' : 'true');
      links.forEach(function (a) { a.tabIndex = show ? 0 : -1; });
      /* the active chapter: the last one whose top has passed 40% of the screen */
      var active = -1;
      secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * .4) active = i; });
      links.forEach(function (a, i) {
        var on = i === active;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      var cur = links[active];
      if (cur && show) {
        var inner = nav.querySelector('.snav__inner');
        var l = cur.offsetLeft - inner.clientWidth / 2 + cur.offsetWidth / 2;
        if (Math.abs(inner.scrollLeft - l) > 4) inner.scrollTo({ left: l, behavior: still ? 'auto' : 'smooth' });
      }
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    new MutationObserver(req).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    update();
  }
})();
