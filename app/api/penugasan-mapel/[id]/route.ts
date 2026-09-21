import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const assignment = await prisma.teacherClass.findUnique({
    where: { id },
    include: { teacher: true, class: true },
  });

  if (!assignment) {
    return NextResponse.json({ message: "Penugasan tidak ditemukan." }, { status: 404 });
  }

  await prisma.teacherClass.delete({ where: { id } });

  await logActivity({
    userId: session.user.id,
    aksi: "Menghapus penugasan mengajar",
    detail: `${assignment.teacher.nama} - ${assignment.class.nama} (${assignment.mapel})`,
    request,
  });

  return NextResponse.json({ message: "Penugasan berhasil dihapus." });
}