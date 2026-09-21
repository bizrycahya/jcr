import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const assignments = await prisma.teacherClass.findMany({
    include: { teacher: true, class: true },
    orderBy: [{ class: { nama: "asc" } }],
  });

  const teachers = await prisma.teacher.findMany({
    where: { status: "AKTIF" },
    select: { id: true, nama: true, nip: true, mapel: true },
    orderBy: { nama: "asc" },
  });

  const classes = await prisma.class.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  return NextResponse.json({ assignments, teachers, classes });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const { teacherId, classId, mapel } = body as { teacherId?: string; classId?: string; mapel?: string };

  if (!teacherId || !classId || !mapel) {
    return NextResponse.json({ message: "Semua field wajib diisi." }, { status: 422 });
  }

  const duplicate = await prisma.teacherClass.findFirst({
    where: { teacherId, classId, mapel },
  });
  if (duplicate) {
    return NextResponse.json({ message: "Penugasan ini sudah ada." }, { status: 409 });
  }

  const assignment = await prisma.teacherClass.create({
    data: { teacherId, classId, mapel },
    include: { teacher: true, class: true },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menambahkan penugasan mengajar",
    detail: `${assignment.teacher.nama} -> ${assignment.class.nama} (${mapel})`,
    request,
  });

  return NextResponse.json({ data: assignment }, { status: 201 });
}