import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validations/student";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

function cellToString(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "object" && "text" in value) return String(value.text);
  return String(value).trim();
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ message: "File tidak ditemukan." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
const workbook = new ExcelJS.Workbook();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
await workbook.xlsx.load(arrayBuffer as any);
  const sheet = workbook.worksheets[0];

  if (!sheet) {
    return NextResponse.json({ message: "Sheet data siswa tidak ditemukan." }, { status: 422 });
  }

  const classes = await prisma.class.findMany({ select: { id: true, nama: true } });
  const classMap = new Map(classes.map((c) => [c.nama.trim().toLowerCase(), c.id]));

  const existingStudents = await prisma.student.findMany({
    select: { nis: true, nisn: true },
  });
  const existingNis = new Set(existingStudents.map((s) => s.nis));
  const existingNisn = new Set(existingStudents.map((s) => s.nisn));

  const seenNisInFile = new Set<string>();
  const seenNisnInFile = new Set<string>();

  const errors: { row: number; message: string }[] = [];
  const validRows: { data: ReturnType<typeof studentSchema.parse>; rowNumber: number }[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header

    const values = row.values as ExcelJS.CellValue[];
    const [, nis, nisn, nama, jenisKelamin, tempatLahir, tanggalLahir, agama, kelasNama, namaAyah, namaIbu, waOrangTua, alamat] = values;

    const nisStr = cellToString(nis);
    const nisnStr = cellToString(nisn);
    const namaStr = cellToString(nama);

    // baris kosong, lewati tanpa dianggap error
    if (!nisStr && !nisnStr && !namaStr) return;

    const kelasNamaStr = cellToString(kelasNama);
    const classId = classMap.get(kelasNamaStr.trim().toLowerCase());

    if (!classId) {
      errors.push({ row: rowNumber, message: `Kelas "${kelasNamaStr}" tidak ditemukan.` });
      return;
    }

    if (existingNis.has(nisStr) || seenNisInFile.has(nisStr)) {
      errors.push({ row: rowNumber, message: `NIS "${nisStr}" sudah digunakan.` });
      return;
    }

    if (existingNisn.has(nisnStr) || seenNisnInFile.has(nisnStr)) {
      errors.push({ row: rowNumber, message: `NISN "${nisnStr}" sudah digunakan.` });
      return;
    }

    const parsed = studentSchema.safeParse({
      nis: nisStr,
      nisn: nisnStr,
      nama: namaStr,
      jenisKelamin: cellToString(jenisKelamin).toUpperCase(),
      tempatLahir: cellToString(tempatLahir),
      tanggalLahir: cellToString(tanggalLahir),
      agama: cellToString(agama),
      classId,
      namaAyah: cellToString(namaAyah),
      namaIbu: cellToString(namaIbu),
      waOrangTua: cellToString(waOrangTua),
      alamat: cellToString(alamat),
      status: "AKTIF",
    });

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Data tidak valid.";
      errors.push({ row: rowNumber, message: firstError });
      return;
    }

    seenNisInFile.add(nisStr);
    seenNisnInFile.add(nisnStr);
    validRows.push({ data: parsed.data, rowNumber });
  });

  let successCount = 0;

  for (const { data, rowNumber } of validRows) {
    try {
      await prisma.student.create({
        data: {
          ...data,
          tanggalLahir: new Date(data.tanggalLahir),
          qrCode: crypto.randomUUID(),
        },
      });
      successCount++;
    } catch {
      errors.push({ row: rowNumber, message: "Gagal menyimpan ke database." });
    }
  }

  await logActivity({
    userId: session.user.id,
    aksi: "Import data siswa via Excel",
    detail: `${successCount} berhasil, ${errors.length} gagal`,
    request,
  });

  return NextResponse.json({
    successCount,
    errorCount: errors.length,
    errors,
  });
}