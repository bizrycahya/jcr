import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getCurrentSession } from "@/lib/session";
import { JcrPdfDocument } from "@/lib/pdf/jcr";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "WALI_KELAS", "GURU"];

const BULAN_LABEL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;

  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const report = await prisma.monthlyReport.findUnique({
    where: { id: reportId },
    include: {
      student: { include: { class: { include: { homeroom: { include: { teacher: true } } } } } },
      details: { include: { category: true } },
    },
  });

  if (!report) {
    return NextResponse.json({ message: "Laporan tidak ditemukan." }, { status: 404 });
  }

  const settings = await prisma.settings.findFirst();

  const waliKelasName = report.student.class.homeroom?.teacher.nama || "-";

  const buffer = await renderToBuffer(
    <JcrPdfDocument
      data={{
        studentName: report.student.nama,
        className: report.student.class.nama,
        waliKelasName,
        bulanLabel: BULAN_LABEL[report.bulan - 1] || String(report.bulan),
        tahun: report.tahun,
        details: report.details.map((d) => ({
          categoryLabel: d.category.label,
          indikator: d.indikator,
          capaian: d.capaian,
        })),
        catatanWali: report.catatanWali,
        rencanaTindakLanjut: report.rencanaTindakLanjut,
        namaSekolah: settings?.namaSekolah || "Jannatun Naim International College",
        jenjang: report.student.class.jenjang,
        logoUrl: settings?.logoUrl,
        namaKepalaSekolah: settings?.namaKepalaSekolah,
        ttdKepsekUrl: settings?.ttdKepsekUrl,
        ttdWaliUrl: settings?.ttdWaliUrl,
        stempelUrl: settings?.stempelUrl,
        tanggalCetak: new Date().toLocaleDateString("id-ID", {
          day: "numeric", month: "long", year: "numeric",
        }),
      }}
    />
  );

  const fileName = `laporan-bulanan/${report.studentId}-${report.bulan}-${report.tahun}-${Date.now()}.pdf`;

  const { error } = await supabaseAdmin.storage
    .from("school-assets")
    .upload(fileName, buffer, { contentType: "application/pdf", upsert: true });

  if (error) {
    return NextResponse.json({ message: `Gagal menyimpan PDF: ${error.message}` }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from("school-assets").getPublicUrl(fileName);

  await prisma.monthlyReport.update({
    where: { id: reportId },
    data: { pdfUrl: publicUrlData.publicUrl },
  });

  return NextResponse.json({ url: publicUrlData.publicUrl });
}