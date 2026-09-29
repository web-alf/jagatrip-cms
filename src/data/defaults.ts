import type { Article, Audience, Event, Faq, GalleryItem, Program, Site, Testimonial } from "../lib/types";

// Konten default (hasil ekstraksi dari halaman dc lama). Nanti jadi seed tabel Supabase.

export const site: Site = {
  hero: {
    eyebrow: "EDU-TOURISM · GLOBAL LEARNING · INSTITUTIONAL PARTNERSHIP",
    heading: "Your International Program Partner", highlight: "International Program",
    body: "Empowering institutions and communities to go beyond borders. JAGATRIP connects schools, educators, students, and foundations with meaningful international learning experiences and long-term global partnerships.",
    cta1: "Explore Our Programs", cta1Href: "#programs", cta2: "Let's Partner Up", cta2Href: "#partnership",
    visual: "/assets/gallery/hero.webp", visualAlt: "Delegasi JAGATRIP bersama sekolah tuan rumah",
  },
  about: {
    eyebrow: "ABOUT JAGATRIP", heading: "Apa Itu JAGATRIP?",
    lead: "JAGATRIP adalah program Edu-Tourism dan international institutional partnership yang menghubungkan praktisi pendidikan, sekolah, pelajar, dan komunitas dengan pengalaman belajar global secara langsung.",
    body: "Setiap program menggabungkan benchmarking ke sekolah dan kampus mancanegara, field learning di ruang kelas tuan rumah, dialog terbuka dengan manajemen institusi, serta networking lintas negara yang membuka jalur kolaborasi jangka panjang — bukan sekadar kunjungan, tetapi studi lapangan yang terukur.",
    readMoreHref: "/about",
  },
  founder: {
    photo: "https://jagatrip.com/dedi-photo.jpg", photoAlt: "Mr. Dedi Gunawan, Founder JAGATRIP",
    name: "Mr. Dedi Gunawan", role: "CEO & Founder JAGATRIP · Pemandu Perjalanan",
    points: [
      "Telah menjejakkan kaki di 30+ negara di Asia, Afrika & Eropa — membawa pulang ilmu nyata tentang sistem pendidikan dunia.",
      "Mendampingi kepala sekolah, guru & praktisi pendidikan dalam study visit ke institusi pendidikan di Jepang, China, Korea, Taiwan, hingga Timur Tengah.",
      "Aktif melakukan benchmarking langsung ke sekolah & kampus internasional — riset lapangan yang menjadi pondasi setiap program JAGATRIP.",
      "Memiliki rekam jejak pendampingan program studi Islam internasional di Malaysia, Madinah & Cairo.",
    ],
  },
  partnership: { bgImage: "/assets/partnership-bg.jpg" },
  footer: {
    description: "JAGATRIP adalah program Edu-Tourism dan institutional partnership bagi pimpinan sekolah, praktisi pendidikan, pelajar, serta orangtua yang ingin meningkatkan kapabilitas dan memperluas akses global.",
    tagline: "TRAVEL TO LEARN, LEARN TO LEAD.",
    instagram: "https://instagram.com/jagatrip.id", tiktok: "https://www.tiktok.com/@jagatrip.id",
    email: "official@jagatrip.com", waAdmin: "+62 811-2850-6576", waPartnership: "+62 813-9190-363", address: "Semarang, Indonesia",
  },
};

const I = {
  university: '<path d="M2 9l10-4 10 4-10 4z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v5"/>',
  plane: '<path d="M3 13l18-7-7 18-2.6-7.4L3 13z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  hands: '<path d="M12 20s-6-3.6-6-8a3.4 3.4 0 0 1 6-2.2A3.4 3.4 0 0 1 18 12c0 4.4-6 8-6 8z"/>',
  handshake: '<path d="M3 12l3-3 4 3 2-2 2 2 4-3 3 3"/><path d="M6 12v5h12v-5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13"/><path d="M9 7V5h6v2"/><path d="M3 12h18"/>',
  community: '<circle cx="12" cy="8" r="3"/><circle cx="5" cy="15" r="2.4"/><circle cx="19" cy="15" r="2.4"/><path d="M8.6 12.6L6.6 13.6M15.4 12.6l2 1"/>',
  monitor: '<rect x="3" y="4" width="18" height="12"/><path d="M9 20h6M12 16v4"/>',
};

const SCOPE = "RENCANA RUANG LINGKUP";
export const programs: Program[] = [
  {
    id: "benchmarking", title: "Educational Benchmarking Program", active: true, icon: I.university,
    desc: "Kunjungan terstruktur ke sekolah, kampus, dan institusi internasional untuk guru dan praktisi pendidikan.",
    long: "Kunjungan terstruktur ke sekolah, kampus, dan institusi internasional. Setiap delegasi membawa instrumen observasi yang sama sehingga temuan antar institusi dapat dibandingkan dan dipresentasikan ke yayasan setelah pulang.",
    who: "Kepala sekolah, guru, pengawas, pengelola yayasan, dan praktisi pendidikan.",
    listLabel: "YANG DIKERJAKAN DI LAPANGAN",
    points: ["Observasi kelas dan lingkungan sekolah tuan rumah", "Dialog dengan manajemen institusi mengenai kebijakan dan penerapannya", "Sesi refleksi harian bersama delegasi", "Laporan observasi terstruktur dan sertifikat resmi"],
    href: "https://jagatrip.com/batch2", cta: "Lihat Batch 2 →",
  },
  {
    id: "field-trip", title: "International Field Trip", active: false, icon: I.plane,
    desc: "Perjalanan belajar lintas negara untuk pelajar dan komunitas sekolah.",
    long: "Perjalanan belajar lintas negara untuk pelajar dan komunitas sekolah, dengan agenda kunjungan institusi pendidikan dan situs pembelajaran yang relevan dengan kurikulum.",
    who: "Pelajar SD, SMP, SMA, mahasiswa, dan komunitas sekolah.", listLabel: SCOPE,
    points: ["Kunjungan sekolah mitra di negara tujuan", "Aktivitas belajar bersama siswa tuan rumah", "Kunjungan situs edukatif dan budaya", "Pendampingan tour leader sepanjang program"],
  },
  {
    id: "immersion", title: "Immersion Programs", active: false, icon: I.globe,
    desc: "Pembelajaran budaya dan bahasa langsung di lingkungan institusi mitra.",
    long: "Pembelajaran budaya dan bahasa langsung di lingkungan institusi mitra dengan durasi lebih panjang daripada kunjungan singkat.",
    who: "Pelajar dan mahasiswa yang menyiapkan studi lanjut ke luar negeri.", listLabel: SCOPE,
    points: ["Kelas bahasa dan orientasi budaya", "Penempatan belajar di kelas reguler institusi mitra", "Pendampingan mentor lokal", "Laporan perkembangan peserta"],
  },
  {
    id: "volunteer", title: "Student Exchange Program", active: false, icon: I.hands,
    desc: "Pertukaran pelajar antar institusi dan komunitas.",
    long: "Pertukaran pelajar antar institusi dan komunitas, dengan program belajar yang disepakati kedua pihak sebelum keberangkatan.",
    who: "Guru muda, mahasiswa, dan komunitas pendidikan.", listLabel: SCOPE,
    points: ["Penugasan mengajar atau pendampingan di institusi mitra", "Pembekalan sebelum keberangkatan", "Skema timbal balik antar institusi", "Sertifikat penugasan resmi"],
  },
  {
    id: "partnership", title: "Institution Partnership Facilitator", active: false, icon: I.handshake,
    desc: "Pendampingan pembukaan MoU dan kerja sama resmi dengan institusi luar negeri.",
    long: "Pendampingan pembukaan MoU dan kerja sama resmi dengan institusi luar negeri, mulai dari penjajakan sampai penandatanganan.",
    who: "Yayasan, pimpinan sekolah, dan pengelola kampus.", listLabel: SCOPE,
    points: ["Pemetaan institusi mitra yang relevan", "Fasilitasi komunikasi dan pertemuan awal", "Penyusunan draf ruang lingkup kerja sama", "Pendampingan tindak lanjut pasca penandatanganan"],
  },
  {
    id: "internship", title: "International Internship Program", active: false, icon: I.briefcase,
    desc: "Penempatan magang internasional bagi mahasiswa dan tenaga pendidik.",
    long: "Penempatan magang internasional bagi mahasiswa dan tenaga pendidik pada institusi mitra di luar negeri.",
    who: "Mahasiswa tingkat akhir dan tenaga pendidik.", listLabel: SCOPE,
    points: ["Seleksi dan pencocokan bidang penempatan", "Pengurusan dokumen dan akomodasi", "Supervisi selama masa magang", "Sertifikat dan surat keterangan penempatan"],
  },
  {
    id: "community-service", title: "International Community Service", active: false, icon: I.community,
    desc: "Program pengabdian masyarakat bersama mitra lintas negara.",
    long: "Program pengabdian masyarakat bersama mitra lintas negara dengan fokus pada pendidikan dan pemberdayaan komunitas.",
    who: "Komunitas pendidikan, kampus, dan organisasi kemasyarakatan.", listLabel: SCOPE,
    points: ["Identifikasi kebutuhan komunitas bersama mitra lokal", "Program kerja lapangan berdurasi terbatas", "Kolaborasi dengan relawan setempat", "Laporan dampak kegiatan"],
  },
  {
    id: "jagatalk", title: "Webinar JAGATALK — Level Up Your Institutions!", active: true, icon: I.monitor,
    desc: "Sesi daring bersama praktisi untuk manajemen dan strategi internasionalisasi sekolah.",
    long: "Sesi daring bersama praktisi untuk manajemen dan strategi internasionalisasi sekolah. Dirancang bagi institusi yang ingin memetakan kesiapan sebelum mengambil program lapangan.",
    who: "Kepala sekolah, manajemen sekolah, founder, dan pengurus yayasan.",
    listLabel: "MATERI SESI",
    points: ["Assessment kesiapan institusi menuju program internasional", "Roadmap empat langkah internasionalisasi sekolah", "Studi kasus dari batch yang telah berjalan", "Tanya jawab langsung bersama narasumber"],
    href: "https://jagatrip.com/jagatalk8", cta: "Lihat JAGATALK #8 →",
  },
];

export const events: Event[] = [
  {
    date: "19–23 OKTOBER 2026", meta: "KUALA LUMPUR → HAT YAI",
    title: "JAGATRIP Batch 2 — Benchmarking & Sinergi dengan Sekolah Malaysia–Thailand",
    desc: "Lima hari, empat institusi, dua negara. Studi lapangan terstruktur bagi pimpinan satuan pendidikan dengan instrumen observasi baku, laporan resmi, dan akses kerja sama dengan sekolah kunjungan.",
    price: "Land tour Rp 7.500.000 · kuota terbatas", href: "https://jagatrip.com/batch2",
    flyer: "https://jagatrip.com/images/batch2/flyer-hero.avif",
    flyerAlt: "Flyer JAGATRIP Batch 2 — Benchmarking Sekolah ASEAN, 19–23 Oktober 2026", visible: true,
  },
  {
    date: "23 SEPTEMBER 2026 · 19.30 WIB", meta: "ONLINE · ZOOM MEETING",
    title: "JAGATALK #8 — Roadmap Sekolah Naik Kelas ke Program Internasional",
    desc: "Sesi eksklusif untuk kepala sekolah, manajemen, founder, dan yayasan: empat langkah konkret dari assessment diri sampai membuka partnership internasional.",
    price: "Regular Rp99.000 · Premium Rp129.000", href: "https://jagatrip.com/jagatalk8",
    flyer: "https://jagatrip.com/images/jagatalk/flyer-jw8-v3.avif",
    flyerAlt: "Flyer JAGATALK #8 — 23 September 2026, 19.30 WIB via Zoom", visible: true,
  },
];

export const gallery: GalleryItem[] = [
  { label: "KNOWLEDGE EXCHANGE", alt: "tukar plakat dengan sekolah mitra", image: "/assets/gallery/jt-doc-1.webp" },
  { label: "DISCUSSION SESSION", alt: "sesi diskusi sekolah", image: "/assets/gallery/jt-doc-2.webp" },
  { label: "SCHOOL VISIT", alt: "Q&A peserta memegang mikrofon", image: "/assets/gallery/jt-doc-3.webp" },
  { label: "GLOBAL NETWORKING", alt: "foto bersama delegasi & sekolah tuan rumah", image: "/assets/gallery/jt-doc-4.webp" },
  { label: "SHARING SESSION", alt: "sharing session Mr. Dedi di dalam bus", image: "/assets/gallery/jt-doc-5.webp" },
];

export const testimonials: Testimonial[] = [
  { video: "QvjDgA4mRIs", name: "Pak Syafii Efendi", org: "Visigo Academy Tangerang", visible: true },
  { video: "ji7D-TDJHQc", name: "Pak Ahmad Sugito", org: "Cordova Islamic School", visible: true },
  { video: "wIzZQq0W1to", name: "Kak Nabila", org: "Nabila Public School", visible: true },
  { video: "LxuSPFp0G3o", name: "Pak Badru Tamam", org: "Cordova Islamic School", visible: true },
  { video: "xPMST7qU-dg", name: "Pak Fajar Ardiansyah", org: "Yayasan Alwasim Muslim Indonesia", visible: true },
];

export const audience: Audience[] = [
  { title: "Kepala Sekolah", desc: "Membangun visi sekolah ke level internasional.", icon: "M3 21h18M5 21V8l7-4 7 4v13M9.5 21v-5h5v5M12 4V2" },
  { title: "Guru & Tenaga Pendidik", desc: "Mencari inspirasi dan praktik pembelajaran global.", icon: "M4 5h6a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h6v13h-6a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H4zM12 6v13" },
  { title: "Pelajar SD, SMP, SMA & Mahasiswa", desc: "Menyiapkan langkah studi dan wawasan lintas negara.", icon: "M2 9l10-4 10 4-10 4zM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v5" },
  { title: "Pengelola Yayasan", desc: "Membuka peluang kolaborasi dan jaringan institusi.", icon: "M3 21h18M4 21V8h7v13M14 21V11h6v10M6.5 11h2M6.5 14.5h2M6.5 18h2M16.5 14h1.5M16.5 17.5h1.5" },
  { title: "Pengawas Pendidikan", desc: "Referensi kurikulum dan sistem pendidikan mancanegara.", icon: "M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0zM15.2 15.2L21 21M8 10.5h5M10.5 8v5" },
  { title: "Praktisi Pendidikan", desc: "Kontribusi nyata pada kemajuan sistem pendidikan.", icon: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.7 6a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0zM21.7 6a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0zM6.7 18a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0zM21.7 18a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0zM9.6 10.4L6.2 7.4M14.4 10.4l3.4-3M9.6 13.6l-3.4 3M14.4 13.6l3.4 3" },
  { title: "Orangtua", desc: "Memetakan jalur pendidikan anak ke luar negeri.", icon: "M10.1 7a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0zM19.1 7a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0zM3 20v-2.6A3.4 3.4 0 0 1 6.4 14h2.2M21 20v-2.6a3.4 3.4 0 0 0-3.4-3.4h-2.2M14.2 14.5a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0zM8.6 21v-1.4a3.4 3.4 0 0 1 6.8 0V21" },
];

export const faqs: Faq[] = [
  { q: "Siapa yang boleh ikut program JAGATRIP Insider Series 2026?", a: "Program ini terbuka untuk umum, khususnya untuk praktisi pendidikan: kepala sekolah, guru, pengawas pendidikan, tenaga kependidikan, pemilik yayasan, dan siapa saja yang bergerak di bidang pendidikan dan ingin berkembang." },
  { q: "Apakah perlu paspor aktif?", a: "Ya, peserta wajib memiliki paspor yang masih berlaku minimal 6 bulan setelah tanggal keberangkatan (minimal berlaku sampai Desember 2026). Jika belum punya paspor, segera urus sebelum mendaftar." },
  { q: "Apa saja yang sudah termasuk dalam paket?", a: "Paket sudah termasuk: tiket pesawat PP (untuk trip internasional), penginapan, makan sesuai program, welcome drink, transportasi selama program, workshop & seminar kit, merchandise, door prize, sertifikat resmi, dokumentasi profesional, city tour, tour leader berpengalaman, dan asuransi perjalanan." },
  { q: "Apa yang TIDAK termasuk dalam paket?", a: "Tidak termasuk: pengeluaran pribadi (oleh-oleh, belanja pribadi), visa (jika diperlukan), biaya bagasi tambahan, dan tips untuk pemandu lokal." },
  { q: "Bagaimana cara mendaftar?", a: "Hubungi admin JAGATRIP via WhatsApp di 08139190363. Tim kami akan memandu proses pendaftaran dan pembayaran DP untuk mengamankan kursimu." },
  { q: "Berapa DP yang harus dibayarkan untuk konfirmasi seat?", a: "DP sebesar 50% dari harga paket. Pelunasan paling lambat H-7 sebelum keberangkatan." },
  { q: "Apakah harga bisa berubah?", a: "Harga bervariasi sesuai kota keberangkatan dan dapat berubah sewaktu-waktu mengikuti ketersediaan tiket pesawat. Segera daftar untuk mengunci harga terbaik." },
];

export const articles: Article[] = [
  {
    title: "Catatan Benchmarking Batch #1: Enam Dimensi yang Paling Sering Ditanyakan",
    slug: "catatan-benchmarking-batch-1", category: "Program", author: "Tim JAGATRIP", date: "2026-09-10", status: "Published",
    excerpt: "Ringkasan temuan lapangan delegasi JAGATRIP Batch #1 pada enam dimensi observasi: tata kelola, kurikulum, guru, kultur, sarana, dan PPDB.",
    body: "TODO: isi naskah artikel. Gunakan H2/H3 berurutan, paragraf 2–4 baris, dan tautan internal ke halaman program terkait.",
    cover: "", imageAlt: "Delegasi JAGATRIP saat sesi observasi kelas",
  },
  {
    title: "Pendaftaran Batch #2 Resmi Dibuka: Kuota Terbatas untuk 4 Institusi",
    slug: "pendaftaran-batch-2-dibuka", category: "Pengumuman", author: "Tim JAGATRIP", date: "2026-09-18", status: "Published",
    excerpt: "JAGATRIP membuka pendaftaran Batch #2 dengan kuota terbatas 4 institusi per pemberangkatan. Simak jadwal, negara tujuan, dan cara daftar.",
    body: "TODO: isi naskah artikel. Gunakan H2/H3 berurutan, paragraf 2–4 baris, dan tautan internal ke halaman program terkait.",
    cover: "", imageAlt: "Tim JAGATRIP menyiapkan agenda Batch #2",
  },
  {
    title: "Lima Pelajaran dari Kunjungan Institusi Mancanegara",
    slug: "lima-pelajaran-kunjungan-institusi", category: "Insight", author: "Tim JAGATRIP", date: "2026-09-24", status: "Published",
    excerpt: "Dari tata kelola kesiswaan sampai kolaborasi lintas negara — berikut lima pelajaran utama yang dibawa pulang delegasi dari kunjungan institusi mancanegara.",
    body: "TODO: isi naskah artikel. Gunakan H2/H3 berurutan, paragraf 2–4 baris, dan tautan internal ke halaman program terkait.",
    cover: "", imageAlt: "Sesi dialog delegasi dengan manajemen institusi tujuan",
  },
];
