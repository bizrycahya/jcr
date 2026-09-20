import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { indicatorSchema } from "@/lib/validations/character";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

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
  const parsed = indicatorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const indicator = await prisma.characterIndicator.update({
    where: { id },
    data: {
      categoryId: parsed.data.categoryId,
      nama: parsed.data.nama,
      deskripsi: parsed.data.deskripsi || null,
      urutan: parsed.data.urutan,
    },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Mengubah indikator karakter",
    detail: indicator.nama,
    request,
  });

  return NextResponse.json({ data: indicator });
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

  const scoreCount = await prisma.characterScore.count({ where: { indicatorId: id } });
  if (scoreCount > 0) {
    return NextResponse.json(
      { message: `Tidak bisa dihapus, sudah ada ${scoreCount} penilaian yang memakai indikator ini.` },
      { status: 409 }
    );
  }

  const indicator = await prisma.characterIndicator.delete({ where: { id } });

  await logActivity({
    userId: session.user.id,
    aksi: "Menghapus indikator karakter",
    detail: indicator.nama,
    request,
  });

  return NextResponse.json({ message: "Indikator berhasil dihapus." });
}