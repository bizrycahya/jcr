import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { classSchema } from "@/lib/validations/class";
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
  const jenjang = searchParams.get("jenjang") ?? undefined;
  const academicYearId = searchParams.get("academicYearId") ?? undefined;

  const where: Prisma.ClassWhereInput = {
    ...(jenjang ? { jenjang: jenjang as Prisma.EnumJenjangFilter["equals"] } : {}),
    ...(academicYearId ? { academicYearId } : {}),
    ...(search ? { nama: { contains: search, mode: "insensitive" } } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.class.findMany({
      where,
      include: {
        academicYear: true,
        homeroom: { include: { teacher: true } },
        _count: { select: { students: true } },
      },
      orderBy: { nama: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.class.count({ where }),
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
  const parsed = classSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const duplicate = await prisma.class.findFirst({
    where: { nama: parsed.data.nama, academicYearId: parsed.data.academicYearId },
  });

  if (duplicate) {
    return NextResponse.json(
      { message: "Nama kelas sudah ada di tahun ajaran ini." },
      { status: 409 }
    );
  }

  const kelas = await prisma.class.create({
    data: parsed.data,
    include: { academicYear: true },
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menambahkan data kelas",
    detail: kelas.nama,
    request,
  });

  return NextResponse.json({ data: kelas }, { status: 201 });
}