import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { teacherSchema, JABATAN_ROLE_MAP } from "@/lib/validations/teacher";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 10)));
  const search = searchParams.get("search")?.trim() ?? "";
  const jabatan = searchParams.get("jabatan") ?? undefined;

  const where: Prisma.TeacherWhereInput = {
    ...(jabatan ? { jabatan } : {}),
    ...(search
      ? {
          OR: [
            { nama: { contains: search, mode: "insensitive" } },
            { nip: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      include: { user: { select: { username: true, role: true, status: true } } },
      orderBy: { nama: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.teacher.count({ where }),
  ]);

  return NextResponse.json({
    data,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = teacherSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const duplicateNip = await prisma.teacher.findUnique({ where: { nip: parsed.data.nip } });
  if (duplicateNip) {
    return NextResponse.json({ message: "NIP sudah digunakan guru lain." }, { status: 409 });
  }

  const duplicateUsername = await prisma.user.findUnique({ where: { username: parsed.data.nip } });
  if (duplicateUsername) {
    return NextResponse.json({ message: "Username (NIP) sudah dipakai akun lain." }, { status: 409 });
  }

  const defaultPassword = `Guru@${parsed.data.nip}`;
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  const role = JABATAN_ROLE_MAP[parsed.data.jabatan];

  const teacher = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username: parsed.data.nip,
        password: hashedPassword,
        role,
      },
    });

    return tx.teacher.create({
      data: {
        userId: user.id,
        nip: parsed.data.nip,
        nama: parsed.data.nama,
        jabatan: parsed.data.jabatan,
        mapel: parsed.data.mapel,
        whatsapp: parsed.data.whatsapp,
        email: parsed.data.email || null,
        fotoUrl: parsed.data.fotoUrl || null,
        status: parsed.data.status,
      },
      include: { user: { select: { username: true, role: true, status: true } } },
    });
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menambahkan data guru",
    detail: teacher.nama,
    request,
  });

  return NextResponse.json({ data: teacher, defaultPassword }, { status: 201 });
}