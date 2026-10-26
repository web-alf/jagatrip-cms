/**
 * Form Enhancer — Peningkatan Otomatis untuk Semua Input Form di JAGATRIP
 *
 * Fitur:
 * 1. Auto Format Nomor WhatsApp saat diketik (0812-3456-7890)
 * 2. Visual Prefix / Helper Badge (🇮🇩 +62 / 08)
 * 3. Real-time Inline Validation (Border merah + error text presisi di bawah field)
 * 4. Auto-capitalize Nama (Title Case on blur)
 * 5. Sanitasi Input (Auto trim space ganda)
 *
 * ponytail: Dirancang sebagai vanilla JS enhancer tanpa runtime library external.
 * Tambahkan framework form validation jika schema form menjadi > 20 field unik.
 */

import { formatPhoneInputRealtime, parseIndonesianPhone } from './phone-formatter';

export function enhanceFormInputs(form: HTMLFormElement): void {
  if (!form || form.dataset.enhanced === 'true') return;
  form.dataset.enhanced = 'true';

  // 1. Tangani Field WhatsApp
  const phoneInputs = form.querySelectorAll<HTMLInputElement>(
    'input[type="tel"], input[name="wa"], input[name="whatsapp"], input[id="wa"], input[id="f-wa"]'
  );

  phoneInputs.forEach((input) => {
    // Berikan placeholder standar yang jelas jika belum bermakna
    if (!input.placeholder || input.placeholder.includes('0812XXXX') || input.placeholder.includes('Contoh')) {
      input.placeholder = '0812-3456-7890';
    }

    // Wrap atau pasang visual helper jika memungkinkan
    setupPhoneInputHelper(input);

    // Format real-time saat ngetik
    input.addEventListener('input', () => {
      const cursor = input.selectionStart;
      const prevLen = input.value.length;
      input.value = formatPhoneInputRealtime(input.value);
      
      // Jaga posisi kursor jika memungkinkan
      if (cursor !== null && input.value.length > prevLen) {
        input.setSelectionRange(cursor + 1, cursor + 1);
      }
    });

    // Validasi saat blur
    input.addEventListener('blur', () => {
      validatePhoneInput(input);
    });
  });

  // 2. Tangani Field Nama (Auto-capitalize)
  const nameInputs = form.querySelectorAll<HTMLInputElement>(
    'input[name="nama"], input[name="nama_lengkap"], input[autocomplete="name"], input[id="nama"]'
  );

  nameInputs.forEach((input) => {
    input.addEventListener('blur', () => {
      if (input.value) {
        // Cleanup extra spaces & Title Case
        const cleaned = input.value.trim().replace(/\s+/g, ' ');
        input.value = cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
        validateRequiredInput(input, 'Nama Lengkap wajib diisi (minimal 3 karakter)', 3);
      }
    });
  });

  // 3. Attach inline validation listeners ke semua required fields
  const requiredInputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]');
  requiredInputs.forEach((input) => {
    input.addEventListener('blur', () => {
      if (input instanceof HTMLInputElement && (input.type === 'tel' || input.name === 'wa' || input.name === 'whatsapp')) {
        validatePhoneInput(input);
      } else {
        validateRequiredInput(input);
      }
    });

    input.addEventListener('input', () => {
      // Clear error saat user mengetik kembali
      clearFieldError(input);
    });
  });
}

/**
 * Setup Visual Helper di sekitar input WhatsApp
 */
function setupPhoneInputHelper(input: HTMLInputElement): void {
  // Cegah double wrap
  if (input.parentElement?.classList.contains('phone-input-group')) return;

  const parent = input.parentElement;
  if (!parent) return;

  // Jika parent relatif, pasang badge
  input.classList.add('enhanced-phone-input');
}

/**
 * Validasi Field Phone & Tampilkan Inline Error
 */
export function validatePhoneInput(input: HTMLInputElement): boolean {
  const parsed = parseIndonesianPhone(input.value);
  if (!input.value.trim() && input.hasAttribute('required')) {
    setFieldError(input, 'Nomor WhatsApp wajib diisi (contoh: 0812-3456-7890)');
    return false;
  }
  
  if (input.value.trim() && !parsed.isValid) {
    setFieldError(input, parsed.error || 'Format WhatsApp tidak valid (harus 08... atau 628...)');
    return false;
  }

  clearFieldError(input);
  return true;
}

/**
 * Validasi Field Required Biasa
 */
export function validateRequiredInput(
  input: HTMLInputElement | HTMLSelectElement,
  customMsg?: string,
  minLen = 2
): boolean {
  const val = input.value.trim();
  if (!val && input.hasAttribute('required')) {
    setFieldError(input, customMsg || `${getLabelText(input)} wajib diisi`);
    return false;
  }
  if (val && val.length < minLen) {
    setFieldError(input, customMsg || `${getLabelText(input)} minimal ${minLen} karakter`);
    return false;
  }
  clearFieldError(input);
  return true;
}

/**
 * Dapatkan teks label pendamping input
 */
function getLabelText(input: HTMLElement): string {
  const id = input.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) return label.textContent?.replace('*', '').trim() || 'Field ini';
  }
  const parentLabel = input.closest('label');
  if (parentLabel) {
    return parentLabel.childNodes[0]?.textContent?.replace('*', '').trim() || 'Field ini';
  }
  return 'Field ini';
}

/**
 * Tampilkan Inline Error Message
 */
export function setFieldError(input: HTMLElement, msg: string): void {
  input.classList.add('input-error-border');
  
  let errEl = input.parentElement?.querySelector('.field-error-msg') as HTMLElement | null;
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'field-error-msg';
    input.parentElement?.appendChild(errEl);
  }
  errEl.textContent = msg;
  errEl.style.display = 'block';
}

/**
 * Bersihkan Inline Error Message
 */
export function clearFieldError(input: HTMLElement): void {
  input.classList.remove('input-error-border');
  const errEl = input.parentElement?.querySelector('.field-error-msg') as HTMLElement | null;
  if (errEl) {
    errEl.style.display = 'none';
  }
}

/**
 * Inject Styles Global untuk Inline Validation & Error Borders
 */
export function injectEnhancerStyles(): void {
  if (document.getElementById('form-enhancer-styles')) return;

  const style = document.createElement('style');
  style.id = 'form-enhancer-styles';
  style.textContent = `
    .input-error-border {
      border-color: #E53E3E !important;
      box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.2) !important;
    }
    .field-error-msg {
      color: #E53E3E;
      font-size: 12px;
      font-weight: 600;
      margin-top: 4px;
      display: none;
      animation: fadeIn 0.2s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-2px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// Auto-run pada DOMReady untuk meng-enhance semua form secara otomatis
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    injectEnhancerStyles();
    document.querySelectorAll<HTMLFormElement>('form').forEach(enhanceFormInputs);
  });
}
