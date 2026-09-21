import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "WALI_KELAS", "GURU"];

const detailSchema = z.object({
  categoryId: z.string(),
  indikator: z.string(),
  capaian: z.string().min(1, "Capaian tidak boleh kosong"),
});

const saveSchema = z.object({
  studentId: z.string(),
  academicYearId: z.string(),
  bulan: z.number().int().min(1).max(12),
  tahun: z.number().int(),
  rataRata: z.number(),
  predikatUmum: z.string(),
  catatanWali: z.string().optional().or(z.literal("")),
  rencanaTindakLanjut: z.string().optional().or(z.literal("")),
  details: z.array(detailSchema).min(1),
});

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = saveSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const d = parsed.data;

  const report = await prisma.$transaction(async (tx) => {
    const existing = await tx.monthlyReport.findUnique({
      where: { studentId_bulan_tahun: { studentId: d.studentId, bulan: d.bulan, tahun: d.tahun } },
    });

    const reportData = {
      studentId: d.studentId,
      academicYearId: d.academicYearId,
      bulan: d.bulan,
      tahun: d.tahun,
      rataRata: d.rataRata,
      predikatUmum: d.predikatUmum,
      catatanWali: d.catatanWali || null,
      rencanaTindakLanjut: d.rencanaTindakLanjut || null,
    };

    const savedReport = existing
      ? await tx.monthlyReport.update({ where: { id: existing.id }, data: reportData })
      : await tx.monthlyReport.create({ data: reportData });

    await tx.monthlyReportDetail.deleteMany({ where: { reportId: savedReport.id } });

    await tx.monthlyReportDetail.createMany({
      data: d.details.map((det) => ({
        reportId: savedReport.id,
        categoryId: det.categoryId,
        indikator: det.indikator,
        capaian: det.capaian,
      })),
    });

    return savedReport;
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menyimpan laporan bulanan",
    detail: `Siswa ID ${d.studentId}, ${d.bulan}/${d.tahun}`,
    request,
  });

  return NextResponse.json({ data: report }, { status: 201 });
}