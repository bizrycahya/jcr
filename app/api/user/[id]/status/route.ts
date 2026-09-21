import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN"];

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
  const { status } = body as { status?: string };

  if (!status || !["AKTIF", "NONAKTIF", "DIBEKUKAN"].includes(status)) {
    return NextResponse.json({ message: "Status tidak valid." }, { status: 422 });
  }

  if (id === session.user.id) {
    return NextResponse.json({ message: "Tidak bisa mengubah status akun sendiri." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status: status as "AKTIF" | "NONAKTIF" | "DIBEKUKAN" },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Mengubah status akun",
    detail: `${user.username} -> ${status}`,
    request,
  });

  return NextResponse.json({ data: user });
}