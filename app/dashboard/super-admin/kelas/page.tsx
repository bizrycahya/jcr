import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ClassManager } from "@/components/kelas/class-manager";

export default async function SuperAdminKelasPage() {
  await requireRole(["SUPER_ADMIN"]);

  const academicYears = await prisma.academicYear.findMany({
    select: {
      id: true,
      tahun: true,
      semester: true,
      isActive: true,
    },
    orderBy: {
      tahun: "desc",
    },
  });

  return (
    <ClassManager
      academicYears={academicYears}
    />
  );
}