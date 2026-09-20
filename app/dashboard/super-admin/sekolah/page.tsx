import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SchoolForm } from "@/components/sekolah/school-form";

export default async function SuperAdminSekolahPage() {
  await requireRole(["SUPER_ADMIN"]);

  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }

  return <SchoolForm initialData={settings} />;
}