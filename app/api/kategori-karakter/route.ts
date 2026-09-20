import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

const DEFAULT_CATEGORIES = [
  { nama: "AKHLAK", label: "Akhlak", urutan: 1 },
  { nama: "DISIPLIN", label: "Disiplin", urutan: 2 },
  { nama: "KEPEMIMPINAN", label: "Kepemimpinan", urutan: 3 },
  { nama: "AKADEMIK", label: "Akademik", urutan: 4 },
  { nama: "SOSIAL", label: "Sosial", urutan: 5 },
] as const;

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "GURU", "WALI_KELAS", "BK"];

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.characterCategory.upsert({
      where: { nama: cat.nama },
      update: {},
      create: cat,
    });
  }

  const categories = await prisma.characterCategory.findMany({
    include: { indicators: { orderBy: { urutan: "asc" } } },
    orderBy: { urutan: "asc" },
  });

  return NextResponse.json({ data: categories });
}