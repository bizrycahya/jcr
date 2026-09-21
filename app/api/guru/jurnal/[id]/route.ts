import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) {
    return NextResponse.json({ message: "Data guru tidak ditemukan." }, { status: 404 });
  }

  const journal = await prisma.teacherJournal.findUnique({ where: { id } });
  if (!journal || journal.teacherId !== teacher.id) {
    return NextResponse.json({ message: "Jurnal tidak ditemukan." }, { status: 404 });
  }

  await prisma.teacherJournal.delete({ where: { id } });

  return NextResponse.json({ message: "Jurnal berhasil dihapus." });
}