/**
 * JAGATRIP — Endpoint Apps Script untuk form register.astro.
 * Spreadsheet: https://docs.google.com/spreadsheets/d/14wv5a3ujPu6DYqwIEPm5YFUjxRgiH8K5tI8uZblr7RI
 * Sheet: "Registrasi"
 *
 * Alur:
 *  1. Terima POST JSON (field teks + field file berupa base64 polos, lihat fileToBase64 di register-handler.ts).
 *  2. Tiap field file di-decode, disimpan ke subfolder Drive sesuai jenis dokumen (Paspor/, KTP/, dst,
 *     di bawah FOLDER_ID — dibuat otomatis jika belum ada), lalu di-share "anyone with link".
 *  3. Baris ditulis ke sheet "Registrasi" sesuai HEADER_MAP (header sheet TIDAK berubah urutan/nama;
 *     kolom yang belum ada di sheet — dokumen visa & rencana tiket — otomatis ditambahkan di ujung kanan).
 *
 * Setup:
 *  1. Di Spreadsheet di atas → Extensions > Apps Script.
 *  2. Tempel kode ini, isi FOLDER_ID (ID folder Drive tujuan upload dokumen).
 *  3. Jalankan testConnection() dulu (pilih fungsi di dropdown toolbar → Run) untuk cek akses sheet & folder.
 *  4. Jalankan testDoPost() untuk simulasi submit form (menulis 1 baris dummy, source="TEST", gampang dihapus).
 *  5. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *  6. Salin URL deployment ke APPS_SCRIPT_URL di register-handler.ts.
 *
 * ponytail: folder Drive tunggal untuk semua dokumen, kolom baru auto-append di ujung kanan
 * tanpa reorder. Upgrade ke sub-folder per bulan / header manual kalau sheet mulai berantakan.
 */

const JGT_REG_SPREADSHEET_ID = '14wv5a3ujPu6DYqwIEPm5YFUjxRgiH8K5tI8uZblr7RI';
const JGT_REG_SHEET_NAME = 'Registrasi';
const JGT_REG_FOLDER_ID = 'ISI_FOLDER_ID_DRIVE_DI_SINI';

// field file dari form → label untuk nama file di Drive
const JGT_REG_FILE_FIELDS = {
  file_paspor: 'Paspor',
  file_ktp: 'KTP',
  file_pas_foto_visa: 'Pas Foto Visa',
  file_ktp_kk: 'KTP & KK',
  file_itinerary_visa: 'Itinerary Visa',
  file_saldo_rekening: 'Bukti Saldo',
  file_bukti_transfer: 'Bukti Transfer',
};

// Header kolom sheet (URUTAN & NAMA PERSIS seperti sheet asli) → field key dari payload.
// 'No' dan 'Status' diisi otomatis oleh script, bukan dari form.
const JGT_REG_HEADER_MAP = [
  ['No', '__row__'],
  ['Timestamp', 'timestamp'],
  ['Nama Lengkap', 'nama_lengkap'],
  ['Nama Panggilan', 'nama_panggilan'],
  ['Alamat', 'alamat'],
  ['WhatsApp', 'wa'],
  ['Email', 'email'],
  ['No Paspor', 'no_paspor'],
  ['Expired Paspor', 'expired_paspor'],
  ['File Paspor', 'file_paspor'],
  ['File KTP', 'file_ktp'],
  ['Kota Asal', 'kota_asal'],
  ['Bandara', 'bandara'],
  ['Punya Tiket', 'punya_tiket'],
  ['Ukuran Kaos', 'ukuran_kaos'],
  ['Teman Sekamar', 'teman_sekamar'],
  ['Alergi/Penyakit', 'alergi'],
  ['Bukti Transfer', 'file_bukti_transfer'],
  ['Status Bayar', 'status_bayar'],
  ['Instansi', 'instansi'],
  ['Jabatan', 'jabatan'],
  ['Instagram', 'instagram'],
  ['Motivasi', 'motivasi'],
  ['Status', '__status__'],
  ['Source', 'source'],
  // Kolom di bawah ini BELUM ADA di sheet saat ini — akan otomatis
  // ditambahkan di ujung kanan sheet saat submit pertama kali masuk.
  ['Rencana Tiket', 'rencana_tiket'],
  ['File Pas Foto Visa', 'file_pas_foto_visa'],
  ['File KTP & KK', 'file_ktp_kk'],
  ['File Itinerary Visa', 'file_itinerary_visa'],
  ['File Bukti Saldo', 'file_saldo_rekening'],
];

function jgtRegGetSheet_() {
  const ss = SpreadsheetApp.openById(JGT_REG_SPREADSHEET_ID);
  return ss.getSheetByName(JGT_REG_SHEET_NAME) || ss.insertSheet(JGT_REG_SHEET_NAME);
}

// Pastikan semua header di JGT_REG_HEADER_MAP ada di baris 1 sheet; tambahkan yang belum ada di ujung kanan.
// Return array header sesuai urutan fisik kolom sheet saat ini.
function jgtRegEnsureHeaders_(sheet) {
  let lastCol = sheet.getLastColumn();
  let headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  JGT_REG_HEADER_MAP.forEach(([header]) => {
    if (headers.indexOf(header) === -1) {
      sheet.getRange(1, headers.length + 1).setValue(header);
      headers.push(header);
    }
  });
  return headers;
}

// Ambil subfolder dengan nama tertentu di dalam parent; buat jika belum ada.
function jgtRegGetOrCreateSubfolder_(parent, name) {
  const existing = parent.getFoldersByName(name);
  return existing.hasNext() ? existing.next() : parent.createFolder(name);
}

// Upload tiap field file (base64 polos) ke subfolder Drive sesuai jenis dokumennya
// (mis. Paspor/, KTP/, dst di bawah JGT_REG_FOLDER_ID), ganti isi field jadi URL file.
function jgtRegUploadFiles_(body, folder) {
  Object.keys(JGT_REG_FILE_FIELDS).forEach((field) => {
    const base64 = body[field];
    if (typeof base64 !== 'string' || !base64) return;

    const label = JGT_REG_FILE_FIELDS[field];
    const subfolder = jgtRegGetOrCreateSubfolder_(folder, label);
    const mime = body[field + '_type'] || 'application/octet-stream';
    const bytes = Utilities.base64Decode(base64);
    const name = body[field + '_name'] || (field + '.' + (mime.split('/')[1] || 'dat'));
    const file = subfolder.createFile(Utilities.newBlob(bytes, mime, label + ' - ' + name));
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    body[field] = file.getUrl(); // base64 dibuang, hanya link yang disimpan
    delete body[field + '_type'];
  });
}

function jgtRegAppendRow_(sheet, body) {
  const headers = jgtRegEnsureHeaders_(sheet);
  const rowNumber = sheet.getLastRow() + 1; // baris data (header = row 1)
  const seq = rowNumber - 1;

  const row = headers.map((header) => {
    const mapped = JGT_REG_HEADER_MAP.find(([h]) => h === header);
    if (!mapped) return '';
    const field = mapped[1];
    if (field === '__row__') return seq;
    if (field === '__status__') return 'Baru';
    return body[field] !== undefined ? body[field] : '';
  });

  sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
}

function jgtRegDoPost(e) {
  const body = JSON.parse(e.postData.contents);
  const folder = DriveApp.getFolderById(JGT_REG_FOLDER_ID);

  jgtRegUploadFiles_(body, folder);
  jgtRegAppendRow_(jgtRegGetSheet_(), body);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    return jgtRegDoPost(e);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET sederhana untuk cek endpoint hidup — buka URL deployment di browser, harus muncul {"ok":true,...}
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'JAGATRIP registrasi endpoint aktif', time: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * TEST 1 — jalankan manual dari editor (pilih "testConnection" di toolbar → Run).
 * Cek akses ke Spreadsheet + sheet "Registrasi" + folder Drive, TANPA menulis apa pun.
 * Lihat hasilnya di View > Logs (atau Executions).
 */
function testConnection() {
  const ss = SpreadsheetApp.openById(JGT_REG_SPREADSHEET_ID);
  Logger.log('✓ Spreadsheet terbuka: ' + ss.getName());

  const sheet = ss.getSheetByName(JGT_REG_SHEET_NAME);
  if (!sheet) throw new Error('✗ Sheet "' + JGT_REG_SHEET_NAME + '" tidak ditemukan.');
  Logger.log('✓ Sheet ditemukan: ' + sheet.getName() + ' (lastRow=' + sheet.getLastRow() + ', lastCol=' + sheet.getLastColumn() + ')');

  if (JGT_REG_FOLDER_ID === 'ISI_FOLDER_ID_DRIVE_DI_SINI') {
    throw new Error('✗ FOLDER_ID belum diisi.');
  }
  const folder = DriveApp.getFolderById(JGT_REG_FOLDER_ID);
  Logger.log('✓ Folder Drive terbuka: ' + folder.getName());

  Logger.log('SEMUA KONEKSI OK ✓');
}

/**
 * TEST 2 — jalankan manual dari editor (pilih "testDoPost" → Run).
 * Simulasi submit form asli: payload teks + 1 file dummy (gambar 1x1 px base64),
 * lalu benar-benar memanggil doPost() dan MENULIS 1 baris nyata ke sheet (source="TEST").
 * Hapus baris itu manual di sheet setelah selesai cek.
 */
function testDoPost() {
  const tinyPngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

  const fakePayload = {
    _sheet: JGT_REG_SHEET_NAME,
    nama_lengkap: 'Test User',
    nama_panggilan: 'Test',
    alamat: 'Jl. Testing No. 1',
    wa: '6281234567890',
    email: 'test@example.com',
    no_paspor: 'A1234567',
    expired_paspor: '2030-01-01',
    file_paspor: tinyPngBase64,
    file_paspor_name: 'paspor-test.png',
    file_paspor_type: 'image/png',
    file_ktp: tinyPngBase64,
    file_ktp_name: 'ktp-test.png',
    file_ktp_type: 'image/png',
    file_bukti_transfer: tinyPngBase64,
    file_bukti_transfer_name: 'transfer-test.png',
    file_bukti_transfer_type: 'image/png',
    kota_asal: 'Jakarta',
    bandara: 'Soekarno-Hatta',
    punya_tiket: 'Sudah',
    ukuran_kaos: 'L',
    teman_sekamar: '-',
    alergi: '-',
    status_bayar: 'Lunas',
    instansi: 'Testing Inc.',
    jabatan: 'QA',
    instagram: '@test',
    motivasi: 'Hanya tes koneksi.',
    source: 'TEST',
    timestamp: new Date().toISOString(),
  };

  const fakeEvent = { postData: { contents: JSON.stringify(fakePayload) } };
  const result = doPost(fakeEvent);
  Logger.log('Response: ' + result.getContent());
}
