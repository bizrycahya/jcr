import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ message: "Akun tidak ditemukan." }, { status: 404 });
  }

  const newPassword = `Reset@${Math.random().toString(36).slice(-8)}`;
  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({ where: { id }, data: { password: hashed } });

  await logActivity({
    userId: session.user.id,
    aksi: "Reset password akun",
    detail: user.username,
    request,
  });

  return NextResponse.json({ newPassword });
}