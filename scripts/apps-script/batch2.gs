/**
 * JAGATRIP — Endpoint Apps Script untuk form batch2.astro (Kemitraan Kampus Malaysia).
 * Spreadsheet: https://docs.google.com/spreadsheets/d/14wv5a3ujPu6DYqwIEPm5YFUjxRgiH8K5tI8uZblr7RI
 * Sheet: "Desember"
 *
 * Alur:
 *  1. Terima POST JSON dari batch2.astro (nama, institusi, jabatan, alamat, wa, minat, timestamp, source, utm_*).
 *  2. Tulis 1 baris ke sheet "Desember" sesuai JGT_B2_HEADER_MAP
 *     (header yang belum ada di sheet otomatis ditambahkan di ujung kanan, urutan existing tidak diubah).
 *
 * Setup (dari akun web@alfatihah.com, lihat docs/appscript/rule.md):
 *  1. Spreadsheet di atas → Extensions > Apps Script → project baru "JAGATRIP - Batch2".
 *  2. Tempel kode ini.
 *  3. Run testConnection() → cek akses sheet "Desember".
 *  4. Run testDoPost() → tulis 1 baris dummy (source="TEST"), hapus manual setelah cek.
 *  5. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *  6. Salin URL deployment ke APPS_SCRIPT_URL di src/pages/batch2.astro.
 *
 * ponytail: tanpa upload file & tanpa dedup nomor WA. Tambah dedup (cek kolom WhatsApp
 * sebelum append) kalau pendaftar ganda mulai sering.
 */

const JGT_B2_SPREADSHEET_ID = '14wv5a3ujPu6DYqwIEPm5YFUjxRgiH8K5tI8uZblr7RI';
const JGT_B2_SHEET_NAME = 'Desember';

// Header kolom sheet → field key dari payload batch2.astro.
// 'No' dan 'Status' diisi otomatis oleh script.
const JGT_B2_HEADER_MAP = [
  ['No', '__row__'],
  ['Timestamp', 'timestamp'],
  ['Nama Lengkap', 'nama'],
  ['Institusi', 'institusi'],
  ['Jabatan', 'jabatan'],
  ['Alamat', 'alamat'], // belum ada di sheet → auto ditambah di ujung kanan saat submit pertama
  ['WhatsApp', 'wa'],
  ['Program', 'minat'],
  ['Status', '__status__'],
  ['Source', 'source'],
  ['UTM Source', 'utm_source'],
  ['UTM Medium', 'utm_medium'],
  ['UTM Campaign', 'utm_campaign'],
  ['UTM Term', 'utm_term'],
  ['UTM Content', 'utm_content'],
  ['GCLID', 'gclid'],
  ['FBCLID', 'fbclid'],
];

function jgtB2GetSheet_() {
  const ss = SpreadsheetApp.openById(JGT_B2_SPREADSHEET_ID);
  return ss.getSheetByName(JGT_B2_SHEET_NAME) || ss.insertSheet(JGT_B2_SHEET_NAME);
}

// Pastikan semua header di JGT_B2_HEADER_MAP ada di baris 1; tambah yang kurang di ujung kanan.
// Return array header sesuai urutan fisik kolom sheet saat ini.
function jgtB2EnsureHeaders_(sheet) {
  const lastCol = sheet.getLastColumn();
  const headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  JGT_B2_HEADER_MAP.forEach(([header]) => {
    if (headers.indexOf(header) === -1) {
      sheet.getRange(1, headers.length + 1).setValue(header);
      headers.push(header);
    }
  });
  return headers;
}

function jgtB2AppendRow_(sheet, body) {
  const headers = jgtB2EnsureHeaders_(sheet);
  const rowNumber = sheet.getLastRow() + 1;
  const seq = rowNumber - 1;

  const row = headers.map((header) => {
    const mapped = JGT_B2_HEADER_MAP.find(([h]) => h === header);
    if (!mapped) return '';
    const field = mapped[1];
    if (field === '__row__') return seq;
    if (field === '__status__') return 'Baru';
    return body[field] !== undefined ? body[field] : '';
  });

  sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
}

function jgtB2DoPost(e) {
  if (!e || !e.postData) throw new Error('doPost hanya dipanggil via HTTP POST. Untuk tes dari editor, Run → testDoPost.');
  const body = JSON.parse(e.postData.contents);
  if (!body.nama || !body.wa) throw new Error('nama dan wa wajib diisi');

  jgtB2AppendRow_(jgtB2GetSheet_(), body);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    return jgtB2DoPost(e);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET untuk cek endpoint hidup — buka URL deployment di browser, harus muncul {"ok":true,...}
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'JAGATRIP batch2 endpoint aktif', time: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** TEST 1 — cek akses spreadsheet + sheet "Desember", tanpa menulis apa pun. Lihat View > Logs. */
function testConnection() {
  const ss = SpreadsheetApp.openById(JGT_B2_SPREADSHEET_ID);
  Logger.log('✓ Spreadsheet terbuka: ' + ss.getName());

  const sheet = ss.getSheetByName(JGT_B2_SHEET_NAME);
  if (!sheet) throw new Error('✗ Sheet "' + JGT_B2_SHEET_NAME + '" tidak ditemukan.');
  Logger.log('✓ Sheet ditemukan: ' + sheet.getName() + ' (lastRow=' + sheet.getLastRow() + ', lastCol=' + sheet.getLastColumn() + ')');
  Logger.log('KONEKSI OK ✓');
}

/** TEST 2 — simulasi submit batch2.astro; MENULIS 1 baris nyata (source="TEST"). Hapus manual setelah cek. */
function testDoPost() {
  const payload = {
    _sheet: 'Desember',
    nama: 'Test Peserta',
    institusi: 'SMA Test',
    jabatan: 'Kepala Sekolah',
    alamat: 'Semarang, Jawa Tengah',
    wa: '6281234567890',
    minat: 'Batch 2 Kemitraan Kampus Malaysia, 11-14 Januari 2027',
    timestamp: new Date().toISOString(),
    source: 'TEST',
    utm_source: 'test', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: '', gclid: '', fbclid: '',
  };
  const res = doPost({ postData: { contents: JSON.stringify(payload) } });
  Logger.log(res.getContent());
}
