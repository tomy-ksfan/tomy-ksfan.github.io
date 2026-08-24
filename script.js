document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const navigationLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];
const year = document.querySelector('#current-year');

if (year) {
  year.textContent = new Date().getFullYear();
}

const setMenuOpen = (open) => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
};

menuButton?.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuButton.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) setMenuOpen(false);
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
}, { passive: true });

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navigationLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      if (active) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }, {
    rootMargin: '-20% 0px -68%',
    threshold: [0, 0.2, 0.5],
  });

  sections.forEach((section) => sectionObserver.observe(section));
}
