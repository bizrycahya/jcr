import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teacherSchema, JABATAN_ROLE_MAP } from "@/lib/validations/teacher";
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

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: { user: { select: { username: true, role: true, status: true } } },
  });

  if (!teacher) {
    return NextResponse.json({ message: "Guru tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ data: teacher });
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
  const parsed = teacherSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const existing = await prisma.teacher.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "Guru tidak ditemukan." }, { status: 404 });
  }

  const role = JABATAN_ROLE_MAP[parsed.data.jabatan];

  const teacher = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: existing.userId },
      data: { role },
    });

    return tx.teacher.update({
      where: { id },
      data: {
        nama: parsed.data.nama,
        jabatan: parsed.data.jabatan,
        mapel: parsed.data.mapel,
        whatsapp: parsed.data.whatsapp,
        email: parsed.data.email || null,
        fotoUrl: parsed.data.fotoUrl || null,
        status: parsed.data.status,
      },
      include: { user: { select: { username: true, role: true, status: true } } },
    });
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Mengubah data guru",
    detail: teacher.nama,
    request,
  });

  return NextResponse.json({ data: teacher });
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

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: { homeroom: { include: { class: true } } },
  });

  if (!teacher) {
    return NextResponse.json({ message: "Guru tidak ditemukan." }, { status: 404 });
  }

  if (teacher.homeroom?.class) {
    return NextResponse.json(
      {
        message: `Guru ini masih menjadi wali kelas di "${teacher.homeroom.class.nama}". Lepas penugasan di menu Wali Kelas terlebih dahulu.`,
      },
      { status: 409 }
    );
  }

  const [scoreCount, teacherClassCount] = await Promise.all([
    prisma.characterScore.count({ where: { teacherId: id } }),
    prisma.teacherClass.count({ where: { teacherId: id } }),
  ]);

  if (scoreCount > 0) {
    return NextResponse.json(
      { message: "Guru ini memiliki riwayat penilaian karakter, tidak bisa dihapus." },
      { status: 409 }
    );
  }

  if (teacherClassCount > 0) {
    return NextResponse.json(
      { message: "Guru ini masih mengampu kelas mata pelajaran. Lepas penugasan tersebut terlebih dahulu." },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    if (teacher.homeroom) {
      await tx.homeroom.delete({ where: { id: teacher.homeroom.id } });
    }
    await tx.teacher.delete({ where: { id } });
    await tx.user.update({ where: { id: teacher.userId }, data: { status: "NONAKTIF" } });
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menghapus data guru",
    detail: teacher.nama,
    request,
  });

  return NextResponse.json({ message: "Guru berhasil dihapus." });
}