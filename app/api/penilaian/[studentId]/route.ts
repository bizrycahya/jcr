import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "GURU", "WALI_KELAS", "BK"];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;

  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const bulan = Number(searchParams.get("bulan"));
  const tahun = Number(searchParams.get("tahun"));

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true, nama: true, nis: true },
  });

  if (!student) {
    return NextResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
  }

  const categories = await prisma.characterCategory.findMany({
    include: { indicators: { orderBy: { urutan: "asc" } } },
    orderBy: { urutan: "asc" },
  });

  const existingScores = await prisma.characterScore.findMany({
    where: { studentId, bulan, tahun },
  });

  const scoreMap = new Map(existingScores.map((s) => [s.indicatorId, s.nilai]));

  const result = categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    indicators: cat.indicators.map((ind) => ({
      id: ind.id,
      nama: ind.nama,
      nilai: scoreMap.get(ind.id) ?? null,
    })),
  }));

  return NextResponse.json({ student, categories: result });
}