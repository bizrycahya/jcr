import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data Siswa");

  sheet.columns = [
    { header: "NIS", key: "nis", width: 15 },
    { header: "NISN", key: "nisn", width: 15 },
    { header: "Nama", key: "nama", width: 25 },
    { header: "Jenis Kelamin (L/P)", key: "jenisKelamin", width: 18 },
    { header: "Tempat Lahir", key: "tempatLahir", width: 18 },
    { header: "Tanggal Lahir (YYYY-MM-DD)", key: "tanggalLahir", width: 22 },
    { header: "Agama", key: "agama", width: 15 },
    { header: "Kelas", key: "kelas", width: 15 },
    { header: "Nama Ayah", key: "namaAyah", width: 25 },
    { header: "Nama Ibu", key: "namaIbu", width: 25 },
    { header: "No WA Orang Tua", key: "waOrangTua", width: 18 },
    { header: "Alamat", key: "alamat", width: 35 },
  ];

  sheet.getRow(1).font = { bold: true };

  sheet.addRow({
    nis: "2024001",
    nisn: "0012345678",
    nama: "Contoh Nama Siswa",
    jenisKelamin: "L",
    tempatLahir: "Bandar Lampung",
    tanggalLahir: "2012-05-14",
    agama: "Islam",
    kelas: "VII A",
    namaAyah: "Nama Ayah",
    namaIbu: "Nama Ibu",
    waOrangTua: "081234567890",
    alamat: "Jl. Contoh No. 1, Bandar Lampung",
  });

  const classes = await prisma.class.findMany({
    select: { nama: true, jenjang: true },
    orderBy: { nama: "asc" },
  });

  const refSheet = workbook.addWorksheet("Daftar Kelas (referensi)");
  refSheet.columns = [
    { header: "Nama Kelas", key: "nama", width: 20 },
    { header: "Jenjang", key: "jenjang", width: 15 },
  ];
  refSheet.getRow(1).font = { bold: true };
  classes.forEach((c) => refSheet.addRow(c));

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=template-data-siswa.xlsx",
    },
  });
}