import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "WALI_KELAS", "GURU"];

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  const bulan = Number(searchParams.get("bulan"));
  const tahun = Number(searchParams.get("tahun"));

  const classes = await prisma.class.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  if (!classId || !bulan || !tahun) {
    return NextResponse.json({ data: [], classes });
  }

  const students = await prisma.student.findMany({
    where: { classId },
    select: { id: true, nama: true, nis: true },
    orderBy: { nama: "asc" },
  });

  const reports = await prisma.monthlyReport.findMany({
    where: { student: { classId }, bulan, tahun },
    select: { studentId: true, id: true, pdfUrl: true },
  });
  const reportMap = new Map(reports.map((r) => [r.studentId, r]));

  const scoreCounts = await prisma.characterScore.groupBy({
    by: ["studentId"],
    where: { student: { classId }, bulan, tahun },
    _count: { indicatorId: true },
  });
  const scoreCountMap = new Map(scoreCounts.map((s) => [s.studentId, s._count.indicatorId]));

  const data = students.map((s) => ({
    id: s.id,
    nama: s.nama,
    nis: s.nis,
    hasScores: (scoreCountMap.get(s.id) ?? 0) > 0,
    reportId: reportMap.get(s.id)?.id ?? null,
    pdfUrl: reportMap.get(s.id)?.pdfUrl ?? null,
  }));

  return NextResponse.json({ data, classes });
}