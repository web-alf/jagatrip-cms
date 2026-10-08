/**
 * Phone Formatter & Normalizer untuk Nomor WhatsApp Indonesia.
 *
 * Mengubah variasi input user (08123456789, +62 812-3456-7890, 628123456789, 8123456789)
 * menjadi:
 * 1. Output E.164 murni tanpa '+': '6281234567890' (untuk wa.me URL & database)
 * 2. Format Tampilan Rapih: '0812-3456-7890' (untuk visual input/preview)
 */

export interface ParsedPhone {
  raw: string;          // Input mentah user
  e164: string;         // Format murni WA: 6281234567890
  display: string;      // Format rapih: 0812-3456-7890
  isValid: boolean;     // True jika digit valid (10-15 digit setelah normalisasi)
  error?: string;       // Pesan error jika tidak valid
}

/**
 * Normalisasi dan parse nomor HP Indonesia
 */
export function parseIndonesianPhone(input: string): ParsedPhone {
  const raw = input.trim();
  if (!raw) {
    return { raw, e164: '', display: '', isValid: false, error: 'Nomor WhatsApp wajib diisi' };
  }

  // Hapus semua karakter non-digit kecuali '+' di awal
  let digits = raw.replace(/[^\d+]/g, '');

  // Hilangkan '+' di awal
  if (digits.startsWith('+')) {
    digits = digits.slice(1);
  }

  // Konversi prefix ke 62 (E.164)
  let e164 = '';
  if (digits.startsWith('0')) {
    // 08123456789 -> 628123456789
    e164 = '62' + digits.slice(1);
  } else if (digits.startsWith('62')) {
    // 628123456789 -> 628123456789
    e164 = digits;
  } else if (digits.startsWith('8')) {
    // 8123456789 -> 628123456789 (User lupa ketik 0 di depan)
    e164 = '62' + digits;
  } else {
    e164 = digits;
  }

  // Validasi panjang digit Indonesia (biasanya 62 + 8-12 digit = 10-14 total digit)
  const isValid = /^628\d{8,11}$/.test(e164);

  let error: string | undefined;
  if (!e164.startsWith('628')) {
    error = 'Nomor WhatsApp harus diawali 08 atau 628';
  } else if (e164.length < 10) {
    error = 'Nomor WhatsApp terlalu pendek (minimal 10 digit)';
  } else if (e164.length > 14) {
    error = 'Nomor WhatsApp terlalu panjang (maksimal 13 digit)';
  }

  // Buat tampilan display rapih: 0812-3456-7890
  const localDigits = '0' + e164.slice(2);
  let display = localDigits;
  if (localDigits.length >= 4) {
    const p1 = localDigits.slice(0, 4);
    const p2 = localDigits.slice(4, 8);
    const p3 = localDigits.slice(8, 12);
    display = p3 ? `${p1}-${p2}-${p3}` : (p2 ? `${p1}-${p2}` : p1);
  }

  return {
    raw,
    e164,
    display,
    isValid: isValid && !error,
    error: (isValid && !error) ? undefined : (error || 'Format nomor WhatsApp tidak valid'),
  };
}

/**
 * Format input secara langsung saat user mengetik (real-time input mask)
 */
export function formatPhoneInputRealtime(val: string): string {
  // Hanya ambil digit
  let digits = val.replace(/\D/g, '');

  // Jika diketik 628..., ubah visual jadi 08...
  if (digits.startsWith('62')) {
    digits = '0' + digits.slice(2);
  }

  // Batasi max 13 digit lokal
  digits = digits.slice(0, 13);

  // Format hyphen: 0812-3456-7890
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
}
