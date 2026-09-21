import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

const ALLOWED_ROLES = ["SUPER_ADMIN"];

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 10)));
  const search = searchParams.get("search")?.trim() ?? "";
  const role = searchParams.get("role") ?? undefined;

  const where: Prisma.UserWhereInput = {
    ...(role ? { role: role as Prisma.EnumRoleFilter["equals"] } : {}),
    ...(search ? { username: { contains: search, mode: "insensitive" } } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        teacher: { select: { nama: true } },
        student: { select: { nama: true } },
        parent: { select: { nama: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    data,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}