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

  const students = await prisma.student.findMany({
    include: { class: true },
    orderBy: { nama: "asc" },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data Siswa");

  sheet.columns = [
    { header: "NIS", key: "nis", width: 14 },
    { header: "NISN", key: "nisn", width: 16 },
    { header: "Nama", key: "nama", width: 28 },
    { header: "JK", key: "jenisKelamin", width: 6 },
    { header: "Tempat Lahir", key: "tempatLahir", width: 18 },
    { header: "Tanggal Lahir", key: "tanggalLahir", width: 16 },
    { header: "Agama", key: "agama", width: 12 },
    { header: "Kelas", key: "kelas", width: 12 },
    { header: "Nama Ayah", key: "namaAyah", width: 22 },
    { header: "Nama Ibu", key: "namaIbu", width: 22 },
    { header: "WA Orang Tua", key: "waOrangTua", width: 16 },
    { header: "Alamat", key: "alamat", width: 30 },
    { header: "Status", key: "status", width: 12 },
  ];

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF681B2B" },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  students.forEach((s) => {
    sheet.addRow({
      nis: s.nis,
      nisn: s.nisn,
      nama: s.nama,
      jenisKelamin: s.jenisKelamin,
      tempatLahir: s.tempatLahir,
      tanggalLahir: new Intl.DateTimeFormat("id-ID").format(s.tanggalLahir),
      agama: s.agama,
      kelas: s.class.nama,
      namaAyah: s.namaAyah,
      namaIbu: s.namaIbu,
      waOrangTua: s.waOrangTua,
      alamat: s.alamat,
      status: s.status,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="data-siswa-${Date.now()}.xlsx"`,
    },
  });
}
