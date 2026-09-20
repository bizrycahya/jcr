import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { classSchema } from "@/lib/validations/class";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const kelas = await prisma.class.findUnique({
    where: { id },
    include: { academicYear: true, homeroom: { include: { teacher: true } }, students: true },
  });

  if (!kelas) {
    return NextResponse.json({ message: "Kelas tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ data: kelas });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = classSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const duplicate = await prisma.class.findFirst({
    where: {
      nama: parsed.data.nama,
      academicYearId: parsed.data.academicYearId,
      NOT: { id },
    },
  });

  if (duplicate) {
    return NextResponse.json(
      { message: "Nama kelas sudah ada di tahun ajaran ini." },
      { status: 409 }
    );
  }

  const kelas = await prisma.class.update({
    where: { id },
    data: parsed.data,
    include: { academicYear: true },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Mengubah data kelas",
    detail: kelas.nama,
    request,
  });

  return NextResponse.json({ data: kelas });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const studentCount = await prisma.student.count({ where: { classId: id } });
  if (studentCount > 0) {
    return NextResponse.json(
      { message: `Tidak bisa menghapus, masih ada ${studentCount} siswa di kelas ini.` },
      { status: 409 }
    );
  }

  const kelas = await prisma.class.delete({ where: { id } });

  await logActivity({
    userId: session.user.id,
    aksi: "Menghapus data kelas",
    detail: kelas.nama,
    request,
  });

  return NextResponse.json({ message: "Kelas berhasil dihapus." });
}