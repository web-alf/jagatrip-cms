export function initCountdown() {
  document.querySelectorAll<HTMLElement>('[data-countdown]').forEach((el) => {
    const target = el.dataset.countdown;
    if (!target) return;

    const deadline = new Date(target).getTime();

    function update() {
      const now  = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        el.innerHTML = '<span class="countdown-expired">Early bird sudah berakhir</span>';
        return;
      }

      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      el.innerHTML = `
        <div class="countdown-block">
          <div class="countdown-unit">
            <span class="countdown-num">${String(days).padStart(2, '0')}</span>
            <span class="countdown-label">Hari</span>
          </div>
          <span class="countdown-sep">:</span>
          <div class="countdown-unit">
            <span class="countdown-num">${String(hours).padStart(2, '0')}</span>
            <span class="countdown-label">Jam</span>
          </div>
          <span class="countdown-sep">:</span>
          <div class="countdown-unit">
            <span class="countdown-num">${String(minutes).padStart(2, '0')}</span>
            <span class="countdown-label">Menit</span>
          </div>
          <span class="countdown-sep">:</span>
          <div class="countdown-unit">
            <span class="countdown-num">${String(seconds).padStart(2, '0')}</span>
            <span class="countdown-label">Detik</span>
          </div>
        </div>
      `;
    }

    update();
    setInterval(update, 1000);
  });
}
