import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { ProfilGuru } from "@/components/guru/profil-guru";

export default async function GuruProfilPage() {
  await requireRole(["GURU", "WALI_KELAS", "BK", "KEPALA_SEKOLAH"]);

  const session = await getCurrentSession();
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session!.user.id },
    include: { user: { select: { username: true, email: true } } },
  });

  return <ProfilGuru teacher={teacher} />;
}