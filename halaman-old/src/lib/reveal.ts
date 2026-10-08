const REVEAL_SELECTOR = '[data-reveal]';

export function initRevealMotion(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    Array.from(group.children).forEach((child) => {
      if (child instanceof HTMLElement && !child.dataset.reveal) child.dataset.reveal = 'item';
    });
  });

  const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
  if (!elements.length) return;

  const reveal = (element: HTMLElement): void => {
    element.dataset.revealState = 'visible';
    element.style.removeProperty('will-change');
    window.setTimeout(() => {
      delete element.dataset.revealState;
      element.style.removeProperty('--reveal-delay');
    }, 900);
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target as HTMLElement);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  elements.forEach((element) => {
    const group = element.closest<HTMLElement>('[data-reveal-group]');
    if (group) {
      const siblings = Array.from(group.querySelectorAll<HTMLElement>(':scope > [data-reveal]'));
      const index = siblings.indexOf(element);
      element.style.setProperty('--reveal-delay', `${Math.min(Math.max(index, 0), 3) * 60}ms`);
    }

    element.dataset.revealState = 'pending';
    element.style.willChange = 'opacity, transform';

    if (element.dataset.reveal === 'hero' || element.getBoundingClientRect().top < window.innerHeight * 0.75) {
      requestAnimationFrame(() => reveal(element));
      return;
    }

    element.addEventListener('focusin', () => {
      reveal(element);
      observer.unobserve(element);
    }, { once: true });
    observer.observe(element);
  });
}
