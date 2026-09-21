import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { nilaiToPredikat } from "@/lib/report-helpers";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "WALI_KELAS", "GURU"];

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const { studentId, academicYearId } = body as { studentId?: string; academicYearId?: string };

  if (!studentId || !academicYearId) {
    return NextResponse.json({ message: "Data tidak lengkap." }, { status: 422 });
  }

  const monthlyReports = await prisma.monthlyReport.findMany({
    where: { studentId, academicYearId },
    include: { details: { include: { category: true } } },
    orderBy: { bulan: "asc" },
  });

  if (monthlyReports.length === 0) {
    return NextResponse.json(
      { message: "Belum ada laporan bulanan untuk siswa ini pada tahun ajaran tersebut." },
      { status: 422 }
    );
  }

  const overallAvg =
    monthlyReports.reduce((sum, r) => sum + r.rataRata, 0) / monthlyReports.length;

  const categoryAverages = new Map<string, { label: string; total: number; count: number }>();
  for (const report of monthlyReports) {
    for (const detail of report.details) {
      const key = detail.categoryId;
      if (!categoryAverages.has(key)) {
        categoryAverages.set(key, { label: detail.category.label, total: 0, count: 0 });
      }
    }
  }

  const scores = await prisma.characterScore.findMany({
    where: {
      studentId,
      OR: monthlyReports.map((r) => ({ bulan: r.bulan, tahun: r.tahun })),
    },
    include: { indicator: true },
  });

  for (const score of scores) {
    const catId = score.indicator.categoryId;
    if (!categoryAverages.has(catId)) continue;
    const entry = categoryAverages.get(catId)!;
    entry.total += score.nilai;
    entry.count += 1;
  }

  const summary = Array.from(categoryAverages.entries()).map(([categoryId, v]) => ({
    categoryId,
    categoryLabel: v.label,
    rataRata: v.count > 0 ? v.total / v.count : 0,
  }));

  return NextResponse.json({
    monthlyCount: monthlyReports.length,
    rataRata: overallAvg,
    predikatUmum: nilaiToPredikat(overallAvg),
    summary,
  });
}