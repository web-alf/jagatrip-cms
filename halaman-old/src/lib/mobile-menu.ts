export function initMobileMenu() {
  const btn   = document.getElementById('mobile-menu-btn');
  const menu  = document.getElementById('mobile-menu');
  const close = document.getElementById('mobile-menu-close');

  if (!btn || !menu) return;

  const menuEl = menu;
  const focusables = menuEl.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled])'
  );
  const firstFocusable = focusables[0];
  const lastFocusable  = focusables[focusables.length - 1];

  function open() {
    menuEl.classList.remove('hidden');
    btn!.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    firstFocusable?.focus();
  }

  function closeMenu() {
    menuEl.classList.add('hidden');
    btn!.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    btn!.focus();
  }

  btn.addEventListener('click', open);
  close?.addEventListener('click', closeMenu);

  menuEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  });

  // Close on backdrop click
  menuEl.addEventListener('click', (e) => {
    if (e.target === menuEl) closeMenu();
  });
}
