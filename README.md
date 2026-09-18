# JANIC CHARACTER REPORT

Sistem penilaian & monitoring karakter siswa untuk **Jannatun Naim International College (JaNIC)** — SMP & SMA.

## Status Pembangunan

**Tahap 1: Fondasi Proyek** — selesai
- Struktur folder proyek
- Konfigurasi Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Prisma Schema lengkap (17 model: users, students, teachers, parents, classes,
  homerooms, character_categories, character_indicators, character_scores,
  monthly_reports, semester_reports, achievements, violations, settings,
  activity_logs, academic_years, notifications)
- Seed data awal (Super Admin, kategori & indikator karakter, tahun ajaran, pengaturan sekolah)
- Tema warna Maroon (#681B2B) & Gold (#D4AF37) di Tailwind config

**Tahap 2: Auth & Middleware** — selesai
- NextAuth (Credentials Provider) dengan session JWT, masa berlaku 12 jam
- Password hashing via bcrypt, validasi status akun (aktif/nonaktif)
- `middleware.ts`: proteksi semua route `/dashboard/*` dan API sensitif,
  otomatis redirect ke dashboard yang sesuai bila role tidak cocok dengan path
- `lib/role-routes.ts`: pemetaan role → path dashboard & aturan akses per path
- `lib/session.ts`: helper `requireRole()` untuk Server Component & API Route
- Tipe TypeScript untuk `session.user.role` & `session.user.id`

**Tahap 3: Landing Page** — selesai
- `app/page.tsx`: hero maroon-gold dengan partikel dekoratif, statistik animasi, wave divider
- 8 kartu fitur (layout editorial, satu kartu utama + tujuh pendukung — bukan grid seragam)
- Timeline alur kolaborasi guru–wali kelas–orang tua–sekolah
- Section Nilai Karakter JANIC, testimoni guru, FAQ accordion (client component, tanpa dependency eksternal)
- Footer lengkap dengan kontak & copyright
- Tipografi: Cormorant Garamond (display) dipadukan Inter (body), diatur lewat `next/font/google`

**Tahap 4: Halaman Login** — selesai
- `app/login/page.tsx`: layout split-screen — panel kiri dekoratif maroon-gold dengan partikel & quote Islami, panel kanan glass card form
- `components/auth/login-form.tsx`: form login terhubung langsung ke NextAuth (`signIn("credentials")`), validasi Zod + React Hook Form, show/hide password, "Ingat saya" (menyimpan username di localStorage), redirect otomatis ke dashboard sesuai role setelah login berhasil
- Notifikasi sukses/gagal login via toast (sonner), terpasang global lewat `Providers`
- Responsif: panel kiri disembunyikan di layar mobile, form tetap full width

**Tahap 5: Dashboard Super Admin** — selesai
- `app/dashboard/layout.tsx`: shell bersama (Sidebar + Topbar) dipakai semua dashboard role
- `lib/nav-items.ts`: menu sidebar per role (14 menu untuk Super Admin sesuai spesifikasi)
- Sidebar maroon gelap dengan active-state gold, Topbar glass dengan notifikasi & profile dropdown
- 8 kartu statistik (Total Siswa, Guru, Orang Tua, Penilaian, Kelas, BK, Prestasi, Pelanggaran) —
  **data asli** dari Prisma (`prisma.student.count()`, dst), bukan dummy
- 5 grafik: Radar Karakter, Bar Bulanan, Pie Distribusi, Heatmap Penilaian (kustom), Line Trend Semester
  — data grafik masih contoh (`NOTE` di tiap file chart), siap diganti query agregasi asli saat modul
  Penilaian Karakter dibangun dan datanya terisi

**Tahap 6: Dashboard Admin, Guru, Wali Kelas, BK, Kepala Sekolah, Orang Tua, Siswa** — selesai
- **Admin**: stat cards, Quick Action (tambah siswa/guru/kelas/laporan), Aktivitas Terbaru dari `ActivityLog`, info tahun ajaran aktif
- **Guru**: hanya menampilkan kelas yang diampu (`TeacherClass`) & jumlah penilaian bulan berjalan
- **Wali Kelas**: daftar siswa kelas binaan (`Homeroom`) & catatan wali terbaru
- **BK**: status kasus (dibuka/proses/selesai), grafik bar pelanggaran per tingkat, daftar kasus terbaru
- **Kepala Sekolah**: read-only, rekap total sekolah + tombol "Unduh Semua Laporan" (UI, logic export menyusul)
- **Orang Tua**: daftar anak tertaut (mendukung lebih dari satu anak via relasi `ParentStudent`)
- **Siswa**: profil diri, grafik radar karakter, daftar prestasi & riwayat pelanggaran
- Semua halaman mengambil data asli dari Prisma (bukan dummy) dan menampilkan `EmptyState` yang natural saat data belum ada
- Setiap dashboard dilindungi `requireRole()` sesuai role masing-masing (SUPER_ADMIN selalu diizinkan mengintip semua)

**Tahap 7: CRUD Data Siswa** — selesai
- API: `app/api/siswa` (GET list dengan search/filter kelas/status/pagination, POST create),
  `app/api/siswa/[id]` (GET, PUT, DELETE), `app/api/siswa/export` (unduh Excel via ExcelJS)
- Validasi Zod (`lib/validations/student.ts`) termasuk format nomor WA Indonesia, cek duplikasi NIS/NISN
- `StudentManager`: tabel dengan realtime search, filter kelas, pagination, tombol Export Excel
- `StudentFormDialog`: modal tambah/edit dengan React Hook Form + Zod, semua field sesuai spesifikasi
- Konfirmasi hapus via `ConfirmDialog`, notifikasi sukses/gagal via toast
- Setiap aksi create/update/delete tercatat otomatis ke `ActivityLog`
- Halaman tersedia di dashboard Admin & Super Admin (`/dashboard/admin/siswa`, `/dashboard/super-admin/siswa`)
- **Catatan**: karena CRUD Kelas belum dibangun, halaman ini menampilkan pesan "Belum ada data kelas"
  sampai menu Kelas tersedia. Upload foto masih berupa input URL manual — integrasi Supabase Storage
  menyusul di tahap Pengaturan/Upload. Import Excel & cetak QR kartu siswa juga menyusul.

Tahap berikutnya: CRUD Kelas (agar Data Siswa bisa dipakai penuh), lalu CRUD Data Guru,
modul Penilaian Karakter, PDF Generator, dan Import Excel.

## Ringkasan Role & Path Dashboard

| Role            | Path                        |
|-----------------|------------------------------|
| SUPER_ADMIN     | `/dashboard/super-admin`     |
| ADMIN           | `/dashboard/admin`           |
| KEPALA_SEKOLAH  | `/dashboard/kepala-sekolah`  |
| BK              | `/dashboard/bk`               |
| WALI_KELAS      | `/dashboard/wali-kelas`      |
| GURU            | `/dashboard/guru`            |
| ORANG_TUA       | `/dashboard/orang-tua`       |
| SISWA           | `/dashboard/siswa`           |

SUPER_ADMIN otomatis punya akses ke seluruh dashboard.

## Instalasi

1. Install dependency:
   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env` dan isi kredensial database serta storage:
   ```bash
   cp .env.example .env
   ```

3. Generate Prisma Client & jalankan migrasi:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Jalankan seed data awal:
   ```bash
   npm run prisma:seed
   ```

5. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## Akun Default (setelah seed)

| Role        | Username     | Password        |
|-------------|--------------|-----------------|
| Super Admin | `superadmin` | `SuperAdmin#123` |

> Segera ganti password default setelah instalasi pertama.

## Struktur Folder

```
janic-character-report/
├── app/            # Next.js App Router (routes, layouts, pages)
├── components/     # Komponen UI reusable (ShadCN based)
├── features/       # Modul per fitur (penilaian, siswa, guru, dst)
├── lib/            # Prisma client, auth config, helper server-side
├── prisma/         # schema.prisma, seed.ts, migrations
├── public/         # Asset statis (logo, gambar)
├── styles/         # Global CSS
├── types/          # TypeScript type definitions
├── hooks/          # Custom React hooks
├── utils/          # Fungsi utilitas umum
├── middleware.ts   # Middleware auth & role-based routing
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Database

Menggunakan PostgreSQL (kompatibel Supabase). Untuk pindah ke MySQL, ubah
`provider` di `prisma/schema.prisma` dari `postgresql` menjadi `mysql` dan
sesuaikan `DATABASE_URL` di `.env`.
