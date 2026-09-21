import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) {
    return NextResponse.json({ message: "Data guru tidak ditemukan." }, { status: 404 });
  }

  const data = await prisma.teacherJournal.findMany({
    where: { teacherId: teacher.id },
    orderBy: { tanggal: "desc" },
  });

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) {
    return NextResponse.json({ message: "Data guru tidak ditemukan." }, { status: 404 });
  }

  const body = await request.json();
  const { tanggal, isi } = body as { tanggal?: string; isi?: string };

  if (!tanggal || !isi) {
    return NextResponse.json({ message: "Tanggal dan isi jurnal wajib diisi." }, { status: 422 });
  }

  const journal = await prisma.teacherJournal.create({
    data: { teacherId: teacher.id, tanggal: new Date(tanggal), isi },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menambahkan jurnal guru",
    detail: tanggal,
    request,
  });

  return NextResponse.json({ data: journal }, { status: 201 });
}