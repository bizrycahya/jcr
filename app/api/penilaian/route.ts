import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreSubmitSchema } from "@/lib/validations/score";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "GURU", "WALI_KELAS", "BK"];

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  const bulanParam = searchParams.get("bulan");
  const tahunParam = searchParams.get("tahun");

  const classes = await prisma.class.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  const teachers = await prisma.teacher.findMany({
    where: { status: "AKTIF" },
    select: { id: true, nama: true, jabatan: true },
    orderBy: { nama: "asc" },
  });

  const myTeacher = await prisma.teacher.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!classId || !bulanParam || !tahunParam) {
    return NextResponse.json({ data: [], classes, teachers, myTeacherId: myTeacher?.id ?? null });
  }

  const bulan = Number(bulanParam);
  const tahun = Number(tahunParam);

  const totalIndicators = await prisma.characterIndicator.count();

  const students = await prisma.student.findMany({
    where: { classId },
    select: { id: true, nama: true, nis: true },
    orderBy: { nama: "asc" },
  });

  const scoreCounts = await prisma.characterScore.groupBy({
    by: ["studentId"],
    where: { student: { classId }, bulan, tahun },
    _count: { indicatorId: true },
  });

  const countMap = new Map(scoreCounts.map((s) => [s.studentId, s._count.indicatorId]));

  const data = students.map((s) => ({
    id: s.id,
    nama: s.nama,
    nis: s.nis,
    scored: countMap.get(s.id) ?? 0,
    total: totalIndicators,
  }));

  return NextResponse.json({ data, classes, teachers, myTeacherId: myTeacher?.id ?? null });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = scoreSubmitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { studentId, teacherId, bulan, tahun, scores } = parsed.data;

  const predikatMap: Record<number, string> = { 1: "Kurang", 2: "Cukup", 3: "Baik", 4: "Sangat Baik" };

  await prisma.$transaction(async (tx) => {
    for (const entry of scores) {
      const existing = await tx.characterScore.findFirst({
        where: { studentId, indicatorId: entry.indicatorId, bulan, tahun },
      });

      const data = {
        nilai: entry.nilai,
        predikat: predikatMap[entry.nilai],
        teacherId,
      };

      if (existing) {
        await tx.characterScore.update({ where: { id: existing.id }, data });
      } else {
        await tx.characterScore.create({
          data: { studentId, indicatorId: entry.indicatorId, bulan, tahun, ...data },
        });
      }
    }
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menyimpan penilaian karakter",
    detail: `${scores.length} indikator, bulan ${bulan}/${tahun}`,
    request,
  });

  return NextResponse.json({ message: "Penilaian berhasil disimpan." });
}