/**
 * UTM & click-ID tracking.
 *
 * captureUtm() dipanggil sekali di BaseLayout (setiap halaman). Ia menangkap
 * parameter kampanye dari URL landing dan menyimpannya di sessionStorage
 * (first-touch: tak menimpa nilai yang sudah ada), sehingga tetap terbawa
 * walau user berpindah halaman internal sebelum submit form.
 *
 * getUtm() mengembalikan objek 7-key ternormalisasi untuk di-spread ke body
 * POST setiap form → kolom UTM di spreadsheet.
 */

const STORAGE_KEY = 'jt_utm';

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const;

type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Record<UtmKey, string>;

function empty(): Utm {
  return {
    utm_source: '', utm_medium: '', utm_campaign: '',
    utm_term: '', utm_content: '', gclid: '', fbclid: '',
  };
}

/**
 * Tangkap UTM dari URL saat ini, simpan first-touch ke sessionStorage.
 * Aman dipanggil di setiap page load.
 */
export function captureUtm(): void {
  try {
    // First-touch: kalau sudah tersimpan, jangan timpa.
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const found: Partial<Utm> = {};
    let hasAny = false;

    for (const key of UTM_KEYS) {
      const val = params.get(key);
      if (val) {
        found[key] = val.trim();
        hasAny = true;
      }
    }

    if (hasAny) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    }
  } catch {
    // sessionStorage bisa gagal (private mode dll) — abaikan, tracking opsional.
  }
}

/**
 * Ambil UTM tersimpan sebagai objek 7-key ternormalisasi (field kosong = '').
 * Untuk di-spread ke body POST form.
 */
export function getUtm(): Utm {
  const result = empty();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return result;
    const saved = JSON.parse(raw) as Partial<Utm>;
    for (const key of UTM_KEYS) {
      if (typeof saved[key] === 'string') result[key] = saved[key] as string;
    }
  } catch {
    // ignore
  }
  return result;
}
