// Genuine Store v2 — Featured slider arrows. Manual only: no autoplay (Ferrari rule).
(() => {
  const rail = document.getElementById('feat');
  const prev = document.getElementById('featPrev');
  const next = document.getElementById('featNext');
  if (!rail || !prev || !next) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = () => (rail.querySelector('.feat__card')?.getBoundingClientRect().width || 300) + 24;
  prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
  const upd = () => {
    prev.disabled = rail.scrollLeft < 4;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  };
  rail.addEventListener('scroll', upd, { passive: true });
  window.addEventListener('resize', upd);
  upd();
})();
