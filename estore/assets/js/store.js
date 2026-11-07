// Genuine Store mockup — hero carousel + product rail. Vanilla, no dependencies.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero carousel: 7s autoplay, visible pause, stops on hover/focus, off under reduced motion.
  const slides = [...document.querySelectorAll('.hero .slide')];
  const dots = [...document.querySelectorAll('.hero .dot')];
  const toggle = document.getElementById('heroToggle');
  const num = document.getElementById('heroNum');
  let i = 0, timer = null, playing = !reduce;

  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
    if (num) num.textContent = String(i + 1).padStart(2, '0');
  };
  const setIcon = () => {
    if (!toggle) return;
    toggle.innerHTML = `<svg><use href="#i-${playing ? 'pause' : 'play'}"/></svg>`;
    toggle.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
  };
  const start = () => { stop(); if (playing) timer = setInterval(() => show(i + 1), 7000); };
  const stop = () => { clearInterval(timer); timer = null; };

  dots.forEach((d, k) => d.addEventListener('click', () => { show(k); start(); }));
  toggle?.addEventListener('click', () => { playing = !playing; setIcon(); playing ? start() : stop(); });
  const hero = document.querySelector('.hero');
  hero?.addEventListener('mouseenter', stop);
  hero?.addEventListener('mouseleave', start);
  hero?.addEventListener('focusin', stop);
  hero?.addEventListener('focusout', start);
  if (slides.length) { setIcon(); start(); }

  // Product rail arrows
  const rail = document.getElementById('rail');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (rail && prev && next) {
    const step = () => rail.querySelector('.tile')?.getBoundingClientRect().width + 24 || 300;
    prev.addEventListener('click', () => rail.scrollBy({ left: -step() * 2, behavior: reduce ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: step() * 2, behavior: reduce ? 'auto' : 'smooth' }));
    const upd = () => {
      prev.disabled = rail.scrollLeft < 4;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    };
    rail.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  // ----- Cauley site header (replica of theme behaviour) -----
  const header = document.querySelector('.header');
  const section = header?.querySelector('.header__navigation-section');
  const desktop = window.matchMedia('(min-width:1025px)');
  if (header && section) {
    const parents = [...header.querySelectorAll('.header__menu > .menu-item-has-children')];
    let closeT = null;
    const close = () => { parents.forEach(li => li.classList.remove('is-open')); section.classList.remove('has-open'); };
    const open = (li) => {
      clearTimeout(closeT); close();
      const sub = li.querySelector('.sub-menu');
      li.classList.add('is-open');
      section.style.setProperty('--sub-x', (li.getBoundingClientRect().left - section.getBoundingClientRect().left) + 'px');
      section.style.setProperty('--sub-h', sub.offsetHeight + 'px');
      section.classList.add('has-open');
    };
    parents.forEach(li => {
      li.addEventListener('mouseenter', () => desktop.matches && open(li));
      li.addEventListener('mouseleave', () => { if (desktop.matches) closeT = setTimeout(close, 180); });
      li.addEventListener('focusin', () => desktop.matches && open(li));
      // mobile: parent link toggles its sub-menu
      li.firstElementChild.addEventListener('click', (e) => {
        e.preventDefault();
        if (desktop.matches) return;
        li.classList.toggle('is-open');
      });
    });
    header.addEventListener('focusout', (e) => { if (!header.contains(e.relatedTarget)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); setMenu(false); } });

    const burger = header.querySelector('.header__burger-text');
    const setMenu = (on) => {
      header.classList.toggle('menu-open', on);
      burger?.setAttribute('aria-expanded', String(on));
      document.documentElement.style.overflow = on ? 'hidden' : '';
    };
    burger?.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
    desktop.addEventListener('change', () => { setMenu(false); close(); });
  }

  // ----- Cauley footer: accordion ≤960 (replica) -----
  const narrow = window.matchMedia('(max-width:960px)');
  const footHeads = () => document.querySelectorAll('.footer__menu > li > a').forEach(a => {
    if (narrow.matches) { a.setAttribute('role', 'button'); a.setAttribute('aria-expanded', String(a.parentElement.classList.contains('opened'))); }
    else { a.removeAttribute('role'); a.removeAttribute('aria-expanded'); }
  });
  footHeads();
  narrow.addEventListener('change', footHeads);
  document.querySelectorAll('.footer__menu > li').forEach(li => {
    const head = li.firstElementChild, sub = li.querySelector('.sub-menu');
    head.addEventListener('click', (e) => {
      e.preventDefault();
      if (!narrow.matches) return;
      const on = !li.classList.contains('opened');
      li.classList.toggle('opened', on);
      head.setAttribute('aria-expanded', String(on));
      sub.style.height = on ? sub.scrollHeight + 'px' : '0px';
    });
  });
  narrow.addEventListener('change', () => document.querySelectorAll('.footer__menu > li').forEach(li => {
    li.classList.remove('opened'); li.querySelector('.sub-menu').style.height = '';
  }));
})();
