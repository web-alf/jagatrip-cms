/**
 * Scroll-spy untuk navbar di homepage.
 *
 * Behavior:
 * - Hanya aktif di halaman home (path "/").
 * - Saat scroll dekat top → "Beranda" (/) yang aktif.
 * - Saat section #agenda / #why / #pricing terlihat di viewport → link
 *   yang menunjuk ke section itu yang aktif.
 *
 * Halaman lain (/tentang, /faq, /kontak) tidak butuh scroll-spy karena
 * active state cukup ditentukan dari URL path saat SSR.
 */

const ACTIVE_DESKTOP = ['text-jaga-orange', 'is-active'];
const INACTIVE_DESKTOP = ['text-gray-700'];

const ACTIVE_MOBILE = ['bg-jaga-orange/10', 'text-jaga-orange', 'is-active'];
const INACTIVE_MOBILE = ['text-gray-900'];

function applyActive(href: string): void {
  document.querySelectorAll<HTMLElement>('[data-nav-link]').forEach((link) => {
    const linkHref = link.getAttribute('data-nav-link');
    const isActive = linkHref === href;
    const isDesktop = link.closest('#desktop-nav') !== null;

    const onClasses  = isDesktop ? ACTIVE_DESKTOP   : ACTIVE_MOBILE;
    const offClasses = isDesktop ? INACTIVE_DESKTOP : INACTIVE_MOBILE;

    if (isActive) {
      link.classList.remove(...offClasses);
      link.classList.add(...onClasses);
    } else {
      link.classList.remove(...onClasses);
      link.classList.add(...offClasses);
    }
  });
}

export function initNavActiveState(): void {
  // Scroll-spy hanya di homepage
  if (window.location.pathname !== '/') return;

  // Map setiap section id ke href yang sesuai di nav
  const sectionToHref: Record<string, string> = {
    'itinerary': '/#itinerary',
    'pricing':   '/#pricing',
    'faq':       '/#faq',
  };

  const sections = Object.keys(sectionToHref)
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length === 0) return;

  // Track section mana yang sedang intersecting
  const visibleSections = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });
      updateActive();
    },
    {
      // Trigger saat section masuk ke 30% bagian atas viewport
      // (memberi rasa "section sedang dibaca" lebih natural)
      rootMargin: '-15% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((s) => observer.observe(s));

  function updateActive(): void {
    // Kalau dekat top page → Beranda aktif (override section yang mungkin masih intersecting)
    if (window.scrollY < 80) {
      applyActive('/');
      return;
    }

    // Pilih section pertama (urutan sesuai key) yang visible
    for (const id of Object.keys(sectionToHref)) {
      if (visibleSections.has(id)) {
        applyActive(sectionToHref[id]);
        return;
      }
    }

    // Tidak ada section visible → fallback ke Beranda
    applyActive('/');
  }

  // Update saat scroll juga (untuk handle "near top" case yang IntersectionObserver tidak trigger)
  let scrollRaf = 0;
  window.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = window.requestAnimationFrame(() => {
      updateActive();
      scrollRaf = 0;
    });
  }, { passive: true });

  // Initial state
  updateActive();
}
