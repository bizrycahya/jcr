import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { generateCapaianText, nilaiToPredikat } from "@/lib/report-helpers";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "WALI_KELAS", "GURU"];

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const { studentId, bulan, tahun } = body as { studentId?: string; bulan?: number; tahun?: number };

  if (!studentId || !bulan || !tahun) {
    return NextResponse.json({ message: "Data tidak lengkap." }, { status: 422 });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { class: { include: { academicYear: true } } },
  });

  if (!student) {
    return NextResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
  }

  const categories = await prisma.characterCategory.findMany({
    include: { indicators: true },
    orderBy: { urutan: "asc" },
  });

  const scores = await prisma.characterScore.findMany({
    where: { studentId, bulan, tahun },
    include: { indicator: true },
  });

  if (scores.length === 0) {
    return NextResponse.json(
      { message: "Belum ada nilai karakter untuk siswa ini pada periode tersebut." },
      { status: 422 }
    );
  }

  const scoresByCategory = new Map<string, typeof scores>();
  for (const score of scores) {
    const catId = score.indicator.categoryId;
    if (!scoresByCategory.has(catId)) scoresByCategory.set(catId, []);
    scoresByCategory.get(catId)!.push(score);
  }

  const details = categories
    .map((cat) => {
      const catScores = scoresByCategory.get(cat.id) ?? [];
      if (catScores.length === 0) return null;

      const avg = catScores.reduce((sum, s) => sum + s.nilai, 0) / catScores.length;
      const indikatorNames = catScores.map((s) => s.indicator.nama);
      const capaian = generateCapaianText(cat.label, avg, indikatorNames);

      return {
        categoryId: cat.id,
        categoryLabel: cat.label,
        indikator: indikatorNames.join(", "),
        capaian,
        rataRata: avg,
      };
    })
    .filter((d): d is NonNullable<typeof d> => d !== null);

  const overallAvg = scores.reduce((sum, s) => sum + s.nilai, 0) / scores.length;

  return NextResponse.json({
    student: { id: student.id, nama: student.nama, nis: student.nis, kelas: student.class.nama },
    academicYearId: student.class.academicYearId,
    details,
    rataRata: overallAvg,
    predikatUmum: nilaiToPredikat(overallAvg),
  });
}