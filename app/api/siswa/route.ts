import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validations/student";
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
  const classId = searchParams.get("classId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const where: Prisma.StudentWhereInput = {
    ...(classId ? { classId } : {}),
    ...(status ? { status: status as Prisma.EnumStatusSiswaFilter["equals"] } : {}),
    ...(search
      ? {
          OR: [
            { nama: { contains: search, mode: "insensitive" } },
            { nis: { contains: search, mode: "insensitive" } },
            { nisn: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: { class: true },
      orderBy: { nama: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.student.count({ where }),
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
  const parsed = studentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const [duplicateNis, duplicateNisn] = await Promise.all([
    prisma.student.findUnique({ where: { nis: parsed.data.nis } }),
    prisma.student.findUnique({ where: { nisn: parsed.data.nisn } }),
  ]);

  if (duplicateNis) {
    return NextResponse.json({ message: "NIS sudah digunakan siswa lain." }, { status: 409 });
  }
  if (duplicateNisn) {
    return NextResponse.json({ message: "NISN sudah digunakan siswa lain." }, { status: 409 });
  }

  const student = await prisma.student.create({
    data: {
      ...parsed.data,
      fotoUrl: parsed.data.fotoUrl || null,
      tanggalLahir: new Date(parsed.data.tanggalLahir),
      qrCode: crypto.randomUUID(),
    },
    include: { class: true },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menambahkan data siswa",
    detail: student.nama,
    request,
  });

  return NextResponse.json({ data: student }, { status: 201 });
}
