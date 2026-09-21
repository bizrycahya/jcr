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
  const academicYearId = searchParams.get("academicYearId");

  const classes = await prisma.class.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  const academicYears = await prisma.academicYear.findMany({
    select: { id: true, tahun: true, semester: true },
    orderBy: { tahun: "desc" },
  });

  if (!classId || !academicYearId) {
    return NextResponse.json({ data: [], classes, academicYears });
  }

  const students = await prisma.student.findMany({
    where: { classId },
    select: { id: true, nama: true, nis: true },
    orderBy: { nama: "asc" },
  });

  const monthlyCounts = await prisma.monthlyReport.groupBy({
    by: ["studentId"],
    where: { student: { classId }, academicYearId },
    _count: { id: true },
  });
  const monthlyCountMap = new Map(monthlyCounts.map((m) => [m.studentId, m._count.id]));

  const semesterReports = await prisma.semesterReport.findMany({
    where: { student: { classId }, academicYearId },
    select: { studentId: true, id: true, pdfUrl: true },
  });
  const semesterMap = new Map(semesterReports.map((r) => [r.studentId, r]));

  const data = students.map((s) => ({
    id: s.id,
    nama: s.nama,
    nis: s.nis,
    monthlyCount: monthlyCountMap.get(s.id) ?? 0,
    reportId: semesterMap.get(s.id)?.id ?? null,
    pdfUrl: semesterMap.get(s.id)?.pdfUrl ?? null,
  }));

  return NextResponse.json({ data, classes, academicYears });
}