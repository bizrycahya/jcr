import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN"];

const adminSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = adminSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const duplicate = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (duplicate) {
    return NextResponse.json({ message: "Username sudah dipakai." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: parsed.data.username,
      email: parsed.data.email || null,
      password: hashed,
      role: "ADMIN",
    },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menambahkan akun admin",
    detail: user.username,
    request,
  });

  return NextResponse.json({ data: user }, { status: 201 });
}
