import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AppearanceForm } from "@/components/pengaturan/appearance-form";

export default async function SuperAdminPengaturanPage() {
  await requireRole(["SUPER_ADMIN"]);

  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }

  return <AppearanceForm initialData={settings} />;
}