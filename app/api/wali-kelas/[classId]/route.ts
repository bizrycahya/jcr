import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  const { classId } = await params;

  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const kelas = await prisma.class.findUnique({
    where: { id: classId },
    include: { homeroom: { include: { catatan: true, teacher: true } } },
  });

  if (!kelas || !kelas.homeroom) {
    return NextResponse.json({ message: "Kelas ini belum memiliki wali kelas." }, { status: 404 });
  }

  if (kelas.homeroom.catatan.length > 0) {
    return NextResponse.json(
      { message: "Wali kelas ini memiliki catatan siswa. Hapus catatan tersebut terlebih dahulu." },
      { status: 409 }
    );
  }

  const homeroomId = kelas.homeroom.id;
  const teacherNama = kelas.homeroom.teacher.nama;

  await prisma.$transaction(async (tx) => {
    await tx.class.update({ where: { id: classId }, data: { homeroomId: null } });
    await tx.homeroom.delete({ where: { id: homeroomId } });
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Melepas wali kelas",
    detail: `${teacherNama} dari ${kelas.nama}`,
    request,
  });

  return NextResponse.json({ message: "Wali kelas berhasil dilepas." });
}