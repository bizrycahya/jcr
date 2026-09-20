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

  const classes = await prisma.class.findMany({
    include: {
      academicYear: true,
      homeroom: { include: { teacher: true } },
    },
    orderBy: { nama: "asc" },
  });

  const availableTeachers = await prisma.teacher.findMany({
    where: { jabatan: "Wali Kelas", status: "AKTIF", homeroom: null },
    select: { id: true, nama: true, nip: true },
    orderBy: { nama: "asc" },
  });

  return NextResponse.json({ classes, availableTeachers });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const { classId, teacherId } = body as { classId?: string; teacherId?: string };

  if (!classId || !teacherId) {
    return NextResponse.json({ message: "Kelas dan guru wajib dipilih." }, { status: 422 });
  }

  const kelas = await prisma.class.findUnique({ where: { id: classId } });
  if (!kelas) {
    return NextResponse.json({ message: "Kelas tidak ditemukan." }, { status: 404 });
  }
  if (kelas.homeroomId) {
    return NextResponse.json({ message: "Kelas ini sudah memiliki wali kelas." }, { status: 409 });
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: { homeroom: true },
  });
  if (!teacher) {
    return NextResponse.json({ message: "Guru tidak ditemukan." }, { status: 404 });
  }
  if (teacher.homeroom) {
    return NextResponse.json({ message: "Guru ini sudah menjadi wali kelas lain." }, { status: 409 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const homeroom = await tx.homeroom.create({ data: { teacherId } });
    return tx.class.update({
      where: { id: classId },
      data: { homeroomId: homeroom.id },
      include: { homeroom: { include: { teacher: true } }, academicYear: true },
    });
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menetapkan wali kelas",
    detail: teacher.nama + " -> " + kelas.nama,
    request,
  });

  return NextResponse.json({ data: result }, { status: 201 });
}
