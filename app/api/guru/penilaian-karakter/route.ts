import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) {
    return NextResponse.json({ message: "Data guru tidak ditemukan." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = 15;

  const [data, total] = await Promise.all([
    prisma.characterScore.findMany({
      where: { teacherId: teacher.id },
      include: { student: true, indicator: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.characterScore.count({ where: { teacherId: teacher.id } }),
  ]);

  return NextResponse.json({
    data,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}