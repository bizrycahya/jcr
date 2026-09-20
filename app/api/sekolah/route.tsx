import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { schoolSchema } from "@/lib/validations/school";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN"];

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }

  return NextResponse.json({ data: settings });
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schoolSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  let settings = await prisma.settings.findFirst();

  const data = {
    namaSekolah: parsed.data.namaSekolah,
    yayasan: parsed.data.yayasan || null,
    alamat: parsed.data.alamat || null,
    telepon: parsed.data.telepon || null,
    website: parsed.data.website || null,
    email: parsed.data.email || null,
    logoUrl: parsed.data.logoUrl || null,
    loginBackgroundUrl: parsed.data.loginBackgroundUrl || null,
  };

  if (settings) {
    settings = await prisma.settings.update({
      where: { id: settings.id },
      data,
    });
  } else {
    settings = await prisma.settings.create({ data });
  }

  await logActivity({
    userId: session.user.id,
    aksi: "Memperbarui profil sekolah",
    detail: settings.namaSekolah,
    request,
  });

  return NextResponse.json({ data: settings });
}