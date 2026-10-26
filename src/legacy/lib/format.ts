export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIDRShort(amount: number): string {
  if (amount >= 1_000_000) {
    const juta = amount / 1_000_000;
    return `Rp ${juta % 1 === 0 ? juta : juta.toFixed(1)} juta`;
  }
  return formatIDR(amount);
}

export function formatDate(date: Date, opts?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts,
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateRange(start: Date, end: Date): string {
  const startDay  = start.getDate();
  const endDay    = end.getDate();
  const month     = start.toLocaleDateString('id-ID', { month: 'long' });
  const year      = start.getFullYear();
  return `${startDay}–${endDay} ${month} ${year}`;
}
