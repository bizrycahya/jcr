import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const { passwordLama, passwordBaru } = body as { passwordLama?: string; passwordBaru?: string };

  if (!passwordLama || !passwordBaru || passwordBaru.length < 6) {
    return NextResponse.json(
      { message: "Password lama wajib diisi, password baru minimal 6 karakter." },
      { status: 422 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ message: "Akun tidak ditemukan." }, { status: 404 });
  }

  const isValid = await bcrypt.compare(passwordLama, user.password);
  if (!isValid) {
    return NextResponse.json({ message: "Password lama tidak sesuai." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(passwordBaru, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  return NextResponse.json({ message: "Password berhasil diubah." });
}