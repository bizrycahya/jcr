import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { parentSchema } from "@/lib/validations/parent";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const students = await prisma.student.findMany({
    select: { id: true, nama: true, nis: true, class: { select: { nama: true } } },
    orderBy: { nama: "asc" },
  });

  return NextResponse.json({ students });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = parentSchema.safeParse(body);

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

  const defaultPassword = `Ortu@${parsed.data.username}`;
  const hashed = await bcrypt.hash(defaultPassword, 10);

  const parent = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username: parsed.data.username,
        password: hashed,
        role: "ORANG_TUA",
      },
    });

    const newParent = await tx.parent.create({
      data: {
        userId: user.id,
        nama: parsed.data.nama,
        whatsapp: parsed.data.whatsapp,
        email: parsed.data.email || null,
      },
    });

    await tx.parentStudent.createMany({
      data: parsed.data.studentIds.map((studentId) => ({
        parentId: newParent.id,
        studentId,
      })),
    });

    return newParent;
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menambahkan akun orang tua",
    detail: parent.nama,
    request,
  });

  return NextResponse.json({ data: parent, defaultPassword }, { status: 201 });
}