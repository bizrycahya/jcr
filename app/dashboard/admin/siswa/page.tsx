import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StudentManager } from "@/components/siswa/student-manager";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Layers } from "lucide-react";

export default async function AdminSiswaPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const classes = await prisma.class.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  if (classes.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="Belum ada data kelas"
        description="Tambahkan data kelas terlebih dahulu di menu Kelas sebelum mengelola data siswa."
      />
    );
  }

  return <StudentManager classes={classes} />;
}
