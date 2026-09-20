import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { indicatorSchema } from "@/lib/validations/character";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function POST(request: Request) {
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

  const indicator = await prisma.characterIndicator.create({
    data: {
      categoryId: parsed.data.categoryId,
      nama: parsed.data.nama,
      deskripsi: parsed.data.deskripsi || null,
      urutan: parsed.data.urutan,
    },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menambahkan indikator karakter",
    detail: indicator.nama,
    request,
  });

  return NextResponse.json({ data: indicator }, { status: 201 });
}