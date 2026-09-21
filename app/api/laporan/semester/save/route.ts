import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "WALI_KELAS", "GURU"];

const saveSchema = z.object({
  studentId: z.string(),
  academicYearId: z.string(),
  rataRata: z.number(),
  predikatUmum: z.string(),
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

  const existing = await prisma.semesterReport.findUnique({
    where: { studentId_academicYearId: { studentId: d.studentId, academicYearId: d.academicYearId } },
  });

  const reportData = {
    studentId: d.studentId,
    academicYearId: d.academicYearId,
    rataRata: d.rataRata,
    predikatUmum: d.predikatUmum,
  };

  const report = existing
    ? await prisma.semesterReport.update({ where: { id: existing.id }, data: reportData })
    : await prisma.semesterReport.create({ data: reportData });

  await logActivity({
    userId: session.user.id,
    aksi: "Menyimpan laporan semester",
    detail: `Siswa ID ${d.studentId}`,
    request,
  });

  return NextResponse.json({ data: report }, { status: 201 });
}