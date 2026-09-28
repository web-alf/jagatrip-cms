const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export const waLink = (n: string, text?: string) =>
  "https://wa.me/" + String(n || "").replace(/\D/g, "").replace(/^0/, "62") + (text ? "?text=" + encodeURIComponent(text) : "");

export const handleOf = (url: string) => String(url || "").match(/([^\/@]+)\/?$/)?.[1] ?? String(url || "");

export function fmtDate(s: string) {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${+m[3]} ${BULAN[+m[2] - 1]} ${m[1]}` : s || "";
}

export const ytId = (url: string) =>
  String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? (/^[\w-]{11}$/.test(url) ? url : "");

export const isWaNumber = (s: string) => /^(\+?62|0)8[1-9][0-9]{6,11}$/.test(String(s || "").replace(/[\s-]/g, ""));

/** Markdown-lite: blank line = paragraph, `## ` = h2, `### ` = h3. */
export function bodyBlocks(body: string) {
  return String(body || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const tag = /^###\s+/.test(p) ? "h3" : /^##\s+/.test(p) ? "h2" : "p";
    return { tag, text: p.replace(/^#{2,3}\s+/, "") } as const;
  });
}
