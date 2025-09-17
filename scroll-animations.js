// scroll-animations.js
// - Ajoute la classe .visible sur les éléments .reveal avec IntersectionObserver
// - Ajoute un effet parallax simple sur les éléments .parallax (data-speed)
//
// Place <script src="scroll-animations.js"></script> juste avant </body> (déjà fait).

document.addEventListener('DOMContentLoaded', () => {

  // Intersection Observer pour les reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(r => io.observe(r));
  } else {
    // fallback
    reveals.forEach(r => r.classList.add('visible'));
  }

  // Parallax simple
  const parallaxEls = Array.from(document.querySelectorAll('.parallax')).map(el => {
    return {
      el,
      speed: parseFloat(el.dataset.speed) || 0.06
    };
  });

  // rAF loop
  let rafId = null;
  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const scrolled = window.scrollY || window.pageYOffset;
      parallaxEls.forEach(item => {
        // distance from viewport top
        const rect = item.el.getBoundingClientRect();
        // Move element by -rect.top * speed (subtle)
        const y = -rect.top * item.speed;
        item.el.style.transform = `translateY(${y}px)`;
      });
      rafId = null;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // initial call to position parallax elements
  onScroll();
});
