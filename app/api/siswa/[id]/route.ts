import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validations/student";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: { class: true },
  });

  if (!student) {
    return NextResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ data: student });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const { id } = await params;

  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = studentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // Cek duplikasi NIS/NISN, kecualikan data siswa ini sendiri
  const [duplicateNis, duplicateNisn] = await Promise.all([
    prisma.student.findFirst({ where: { nis: parsed.data.nis, NOT: { id } } }),
    prisma.student.findFirst({ where: { nisn: parsed.data.nisn, NOT: { id } } }),
  ]);

  if (duplicateNis) {
    return NextResponse.json({ message: "NIS sudah digunakan siswa lain." }, { status: 409 });
  }
  if (duplicateNisn) {
    return NextResponse.json({ message: "NISN sudah digunakan siswa lain." }, { status: 409 });
  }

  const student = await prisma.student.update({
    where: { id },
    data: {
      ...parsed.data,
      fotoUrl: parsed.data.fotoUrl || null,
      tanggalLahir: new Date(parsed.data.tanggalLahir),
    },
    include: { class: true },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Memperbarui data siswa",
    detail: student.nama,
    request,
  });

  return NextResponse.json({ data: student });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const { id } = await params;

  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
  }

  await prisma.student.delete({ where: { id } });

  await logActivity({
    userId: session.user.id,
    aksi: "Menghapus data siswa",
    detail: existing.nama,
    request,
  });

  return NextResponse.json({ message: "Siswa berhasil dihapus." });
}