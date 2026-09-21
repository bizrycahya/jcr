import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { academicYearSchema } from "@/lib/validations/academic-year";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const data = await prisma.academicYear.findMany({
    orderBy: [{ tahun: "desc" }, { semester: "desc" }],
  });

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = academicYearSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const duplicate = await prisma.academicYear.findFirst({
    where: { tahun: parsed.data.tahun, semester: parsed.data.semester },
  });
  if (duplicate) {
    return NextResponse.json(
      { message: "Tahun ajaran dan semester ini sudah ada." },
      { status: 409 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    if (parsed.data.isActive) {
      await tx.academicYear.updateMany({ where: { isActive: true }, data: { isActive: false } });
    }

    return tx.academicYear.create({
      data: {
        tahun: parsed.data.tahun,
        semester: parsed.data.semester,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
        isActive: parsed.data.isActive,
      },
    });
  });

  await logActivity({
    userId: session.user.id,
    aksi: "Menambahkan tahun ajaran",
    detail: `${result.tahun} - Semester ${result.semester}`,
    request,
  });

  return NextResponse.json({ data: result }, { status: 201 });
}