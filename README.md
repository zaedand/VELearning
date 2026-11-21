# Simple E-Learning Tech

Aplikasi e-learning untuk belajar pemrograman. Admin mengelola course dan lesson berbasis video; student menelusuri katalog, memilih lesson, dan memutar videonya.

# Video Demo

**[Klik di sini untuk Menonton ](https://drive.google.com/file/d/1Trq2Ensi_t83SCMa29AsjJ2gech8ZJB4/view?usp=sharing)**

## Fitur

**Autentikasi dan akses**
- Login dan registrasi. Akun yang mendaftar selalu berperan `student`; admin dibuat melalui seeder.
- Akses dibedakan per role (`admin`, `student`), dan pengguna diarahkan sesuai role setelah login.

**Admin**
- **Course:** daftar dengan pencarian, filter status, dan paginasi; tambah, ubah, hapus. Atribut: judul, deskripsi, status (`draft` / `published`).
- **Lesson:** tambah, ubah, hapus, dan atur urutan (naik/turun) dalam course.
- **Video:** unggah, ganti, dan hapus per lesson, dengan progress bar, tombol batal, dan status `uploading`, `ready`, atau `failed`.

**Student**
- Katalog course `published`, detail course beserta daftar lesson, dan halaman belajar dengan pemutar video, daftar lesson, serta navigasi lesson sebelumnya/berikutnya.

**Umum**
- Mode terang/gelap (tersimpan di `localStorage`), tampilan responsif, skeleton loading, empty state, dan notifikasi toast.
- Seluruh teks antarmuka berbahasa Indonesia.

## Teknologi

| Teknologi | Alasan |
|---|---|
| Laravel 12 (PHP 8.2+) | Diwajibkan brief; menyediakan validasi, otorisasi (Policy), ORM, dan storage |
| MySQL 8 | Diwajibkan brief; sesuai untuk relasi `users`, `courses`, `lessons` |
| Inertia.js + React + TypeScript | Diizinkan brief; routing, autentikasi, dan CSRF tetap di Laravel tanpa API terpisah, dengan tipe data yang konsisten |
| Laravel Breeze | Starter kit autentikasi yang ringan dan mudah dimodifikasi |
| Tailwind CSS 3 | Styling konsisten; tema terang/gelap melalui CSS variables |
| Private storage lokal | Video tidak dapat diakses langsung lewat URL, hanya melalui endpoint ber-otorisasi (sesuai catatan teknis brief) |

**Arsitektur:** controller tipis, logika bisnis di `app/Services`, validasi di Form Request, otorisasi di Policy, dan Enum untuk nilai tetap (role, status course, status video).

## Persyaratan

- PHP 8.2+ (ekstensi standar Laravel, termasuk `fileinfo`)
- Composer 2
- Node.js 18+ dan npm
- MySQL 8

## Instalasi

```bash
git clone <url-repository> elearning
cd elearning

composer install
cp .env.example .env        # PowerShell: copy .env.example .env
php artisan key:generate
```

Buat database kosong `elearning` (collation `utf8mb4_unicode_ci`), lalu atur `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=elearning
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrasi dan build aset:

```bash
php artisan migrate --seed
npm install
npm run build
```

## Konfigurasi Upload Video

Atur batas ukuran di `.env`:

```env
VIDEO_DISK=local
VIDEO_MAX_SIZE_KB=204800   # 200 MB
```

Nilai ini **tidak boleh melebihi** batas PHP. Ubah `php.ini` (cek lokasinya dengan `php --ini`):

```ini
upload_max_filesize = 200M
post_max_size = 210M
max_execution_time = 300
```

Mulai ulang server PHP setelah perubahan. Format yang didukung: MP4 dan WebM. Untuk kompatibilitas terbaik, gunakan MP4 dengan video H.264 dan audio AAC.

## Menjalankan Aplikasi

Mode pengembangan (dua terminal):

```bash
php artisan serve
npm run dev
```

Tanpa `npm run dev` (memakai hasil `npm run build`):

```bash
php artisan serve
```

Akses `http://127.0.0.1:8000`. Gunakan satu host secara konsisten (jangan bergantian dengan `localhost`) agar cookie sesi tidak terpisah.

## Akun Demo

| Role | Email | Kata sandi |
|---|---|---|
| Admin | `admin@example.com` | `password` |
| Student | `student@example.com` | `password` |

Seeder membuat 3 course (2 `published`, 1 `draft`) dengan total 12 lesson. Jika `database/seeders/sample/sample.mp4` tersedia, dua lesson pertama pada course `published` otomatis memiliki video contoh.

## Pengujian

```bash
php artisan test
```

Cakupan: akses berdasarkan role, CRUD course, CRUD dan pengurutan lesson, validasi dan keamanan upload video, serta otorisasi streaming termasuk permintaan HTTP Range.

## Struktur Proyek

```
app/
├── Enums/                  UserRole, CourseStatus, VideoStatus
├── Http/Controllers/       Admin/ (course, lesson, urutan, video), Student/, VideoStreamController
├── Http/Requests/Admin/    Validasi input
├── Http/Resources/         Format data ke frontend (admin dan student terpisah)
├── Policies/               CoursePolicy, LessonPolicy
└── Services/               CourseService, LessonService, LessonOrderingService,
                            VideoStorageService, VideoStreamService
resources/js/
├── Pages/                  Admin/Courses, Student/Courses, Student/Lessons, Auth, Profile
├── Components/             Komponen UI bersama (dialog, badge, pemutar video, dll.)
└── hooks/                  use-appearance, use-video-upload
```

Diagram arsitektur, ERD, serta alur upload dan streaming video tersedia di [`docs/SYSTEM_DESIGN.md`](docs/SYSTEM_DESIGN.md).

## Keamanan

- Video disimpan di `storage/app/private/videos` dan hanya dapat diputar melalui `/videos/{lesson}/stream`. Endpoint ini mewajibkan login dan lolos `LessonPolicy` (admin; atau student untuk course `published` dengan video berstatus `ready`).
- Streaming mendukung HTTP Range (206) sehingga video dapat di-seek.
- Validasi upload memeriksa MIME berdasarkan isi file, bukan ekstensi. File disimpan dengan nama UUID buatan server; nama asli dari pengguna tidak pernah dipakai sebagai path.
- Role tidak dapat diisi dari input pengguna. Area admin dilindungi middleware role dan Policy.
- Perlindungan bawaan Laravel: CSRF, query terparameter (Eloquent), dan escape output oleh React.

## Asumsi

- Satu course memiliki banyak lesson; satu lesson memiliki satu video.
- Admin dibuat melalui seeder; student dapat mendaftar mandiri.
- Semua student dapat mengakses seluruh course `published` (tanpa enrollment).
- Penyimpanan lokal digunakan untuk demo; untuk produksi, disk dapat diganti ke object storage.

## Keterbatasan

- Upload berjalan dalam satu request tanpa Queue. Jika koneksi terputus saat transfer, status video sebelumnya dipertahankan. Jika proses PHP dihentikan paksa saat penyimpanan, status dapat tertinggal `uploading`; admin dapat mengunggah ulang.
- Jika penyimpanan gagal saat penggantian video, status menjadi `failed` dan file lama tetap tersimpan; belum ada pemulihan otomatis.
- Belum ada transcoding, HLS, atau adaptive bitrate; kompatibilitas bergantung pada codec file asli.
- Durasi video belum dibaca otomatis; thumbnail course belum digunakan (kolom sudah disiapkan).
- Pengurutan lesson memakai tombol naik/turun (belum drag-and-drop) dan menunggu respons server.
- Belum tersedia enrollment, progres belajar, sertifikat, dan verifikasi email.
- Streaming memakai path file lokal; pada object storage perlu diganti dengan signed URL.
