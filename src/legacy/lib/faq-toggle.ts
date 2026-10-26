export function initFaqToggle() {
  document.querySelectorAll<HTMLElement>('.faq-item').forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('.faq-question');
    const answer = item.querySelector<HTMLElement>('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const ob = openItem.querySelector<HTMLButtonElement>('.faq-question');
          if (ob) ob.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close on Escape
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}
