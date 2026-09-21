import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appearanceSchema } from "@/lib/validations/settings";
import { getCurrentSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ROLES = ["SUPER_ADMIN"];

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as string)) {
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
  const parsed = appearanceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  let settings = await prisma.settings.findFirst();

  const data = {
    sidebarColor: parsed.data.sidebarColor,
    buttonColor: parsed.data.buttonColor,
    ttdKepsekUrl: parsed.data.ttdKepsekUrl || null,
    ttdWaliUrl: parsed.data.ttdWaliUrl || null,
    stempelUrl: parsed.data.stempelUrl || null,
  };

  if (settings) {
    settings = await prisma.settings.update({ where: { id: settings.id }, data });
  } else {
    settings = await prisma.settings.create({ data });
  }

  await logActivity({
    userId: session.user.id,
    aksi: "Memperbarui pengaturan tampilan",
    request,
  });

  return NextResponse.json({ data: settings });
}