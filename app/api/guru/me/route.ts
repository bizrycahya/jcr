import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const teacher = await prisma.teacher.findUnique({
    where: { userId: session.user.id },
    include: {
      teacherClasses: { include: { class: true } },
      homeroom: { include: { class: true } },
    },
  });

  if (!teacher) {
    return NextResponse.json({ message: "Data guru tidak ditemukan." }, { status: 404 });
  }

  const classes = Array.from(
    new Map(
      [
        ...teacher.teacherClasses.map((tc) => [tc.class.id, tc.class]),
        ...(teacher.homeroom?.class ? [[teacher.homeroom.class.id, teacher.homeroom.class]] : []),
      ] as [string, { id: string; nama: string }][]
    ).values()
  );

  return NextResponse.json({
    teacher: { id: teacher.id, nama: teacher.nama, nip: teacher.nip, jabatan: teacher.jabatan, mapel: teacher.mapel },
    classes,
    isHomeroom: Boolean(teacher.homeroom),
  });
}