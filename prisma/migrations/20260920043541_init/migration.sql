-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'BK', 'WALI_KELAS', 'GURU', 'ORANG_TUA', 'SISWA');

-- CreateEnum
CREATE TYPE "Jenjang" AS ENUM ('SMP', 'SMA');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "StatusSiswa" AS ENUM ('AKTIF', 'LULUS', 'PINDAH', 'KELUAR', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('AKTIF', 'NONAKTIF', 'DIBEKUKAN');

-- CreateEnum
CREATE TYPE "KategoriKarakter" AS ENUM ('AKHLAK', 'DISIPLIN', 'KEPEMIMPINAN', 'AKADEMIK', 'SOSIAL');

-- CreateEnum
CREATE TYPE "TingkatPelanggaran" AS ENUM ('RINGAN', 'SEDANG', 'BERAT');

-- CreateEnum
CREATE TYPE "StatusPembinaan" AS ENUM ('DIBUKA', 'PROSES', 'SELESAI');

-- CreateEnum
CREATE TYPE "PeriodeLaporan" AS ENUM ('BULANAN', 'SEMESTER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "StatusUser" NOT NULL DEFAULT 'AKTIF',
    "lastLoginAt" TIMESTAMP(3),
    "rememberToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_years" (
    "id" TEXT NOT NULL,
    "tahun" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenjang" "Jenjang" NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "homeroomId" TEXT,
    "status" "StatusSiswa" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homerooms" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homerooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homeroom_notes" (
    "id" TEXT NOT NULL,
    "homeroomId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homeroom_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "mapel" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "fotoUrl" TEXT,
    "status" "StatusUser" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_classes" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "mapel" TEXT NOT NULL,

    CONSTRAINT "teacher_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_journals" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "isi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "nis" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "agama" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "namaAyah" TEXT NOT NULL,
    "namaIbu" TEXT NOT NULL,
    "waOrangTua" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "status" "StatusSiswa" NOT NULL DEFAULT 'AKTIF',
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_students" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "parent_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_categories" (
    "id" TEXT NOT NULL,
    "nama" "KategoriKarakter" NOT NULL,
    "label" TEXT NOT NULL,
    "deskripsi" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "character_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_indicators" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "character_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_scores" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    "predikat" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "character_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_reports" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "rataRata" DOUBLE PRECISION NOT NULL,
    "predikatUmum" TEXT NOT NULL,
    "catatanGuru" TEXT,
    "catatanWali" TEXT,
    "catatanKepsek" TEXT,
    "pdfUrl" TEXT,
    "qrToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semester_reports" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "rataRata" DOUBLE PRECISION NOT NULL,
    "ranking" INTEGER,
    "predikatUmum" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "qrToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "semester_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "buktiUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "violations" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "tingkat" "TingkatPelanggaran" NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "status" "StatusPembinaan" NOT NULL DEFAULT 'DIBUKA',
    "suratPembinaanUrl" TEXT,
    "suratPanggilanUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "namaSekolah" TEXT NOT NULL DEFAULT 'Jannatun Naim International College',
    "yayasan" TEXT,
    "alamat" TEXT,
    "telepon" TEXT,
    "website" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "loginBackgroundUrl" TEXT,
    "sidebarColor" TEXT NOT NULL DEFAULT '#681B2B',
    "buttonColor" TEXT NOT NULL DEFAULT '#D4AF37',
    "ttdKepsekUrl" TEXT,
    "ttdWaliUrl" TEXT,
    "stempelUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aksi" TEXT NOT NULL,
    "detail" TEXT,
    "ip" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_tahun_key" ON "academic_years"("tahun");

-- CreateIndex
CREATE UNIQUE INDEX "classes_homeroomId_key" ON "classes"("homeroomId");

-- CreateIndex
CREATE UNIQUE INDEX "homerooms_teacherId_key" ON "homerooms"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_nip_key" ON "teachers"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_classes_teacherId_classId_mapel_key" ON "teacher_classes"("teacherId", "classId", "mapel");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_nis_key" ON "students"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "students_nisn_key" ON "students"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "students_qrCode_key" ON "students"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_key" ON "parents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "parent_students_parentId_studentId_key" ON "parent_students"("parentId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "character_categories_nama_key" ON "character_categories"("nama");

-- CreateIndex
CREATE INDEX "character_scores_studentId_bulan_tahun_idx" ON "character_scores"("studentId", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_reports_qrToken_key" ON "monthly_reports"("qrToken");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_reports_studentId_bulan_tahun_key" ON "monthly_reports"("studentId", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "semester_reports_qrToken_key" ON "semester_reports"("qrToken");

-- CreateIndex
CREATE UNIQUE INDEX "semester_reports_studentId_academicYearId_key" ON "semester_reports"("studentId", "academicYearId");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_homeroomId_fkey" FOREIGN KEY ("homeroomId") REFERENCES "homerooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homerooms" ADD CONSTRAINT "homerooms_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeroom_notes" ADD CONSTRAINT "homeroom_notes_homeroomId_fkey" FOREIGN KEY ("homeroomId") REFERENCES "homerooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeroom_notes" ADD CONSTRAINT "homeroom_notes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_classes" ADD CONSTRAINT "teacher_classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_classes" ADD CONSTRAINT "teacher_classes_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_journals" ADD CONSTRAINT "teacher_journals_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_indicators" ADD CONSTRAINT "character_indicators_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "character_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_scores" ADD CONSTRAINT "character_scores_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_scores" ADD CONSTRAINT "character_scores_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "character_indicators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_scores" ADD CONSTRAINT "character_scores_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_reports" ADD CONSTRAINT "monthly_reports_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_reports" ADD CONSTRAINT "monthly_reports_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_reports" ADD CONSTRAINT "semester_reports_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_reports" ADD CONSTRAINT "semester_reports_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violations" ADD CONSTRAINT "violations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
