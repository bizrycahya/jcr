import { redirect } from "next/navigation";
import { Layers, GraduationCap, ClipboardList, NotebookPen } from "lucide-react";
import { requireRole, getCurrentSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function GuruDashboardPage() {
  await requireRole(["GURU", "SUPER_ADMIN"]);
  const session = await getCurrentSession();

  const teacher = await prisma.teacher.findUnique({
    where: { userId: session!.user.id },
    include: {
      teacherClasses: { include: { class: { include: { _count: { select: { students: true } } } } } },
      scores: { where: { bulan: new Date().getMonth() + 1, tahun: new Date().getFullYear() } },
    },
  });

  if (!teacher) {
    // Super Admin mengintip dashboard guru tanpa profil guru terkait
    return (
      <EmptyState
        icon={GraduationCap}
        title="Profil guru tidak ditemukan"
        description="Akun ini belum tertaut ke data guru manapun."
      />
    );
  }

  const totalSiswa = teacher.teacherClasses.reduce(
    (sum, tc) => sum + tc.class._count.students,
    0
  );

  const cards = [
    { icon: Layers, label: "Kelas Diampu", value: teacher.teacherClasses.length },
    { icon: GraduationCap, label: "Total Siswa", value: totalSiswa },
    { icon: ClipboardList, label: "Penilaian Bulan Ini", value: teacher.scores.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Selamat datang, {teacher.nama}</h1>
        <p className="text-sm text-maroon-800/50">{teacher.jabatan} · {teacher.mapel}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
        <h2 className="mb-4 font-serif text-lg text-maroon-900">Kelas yang Diampu</h2>
        {teacher.teacherClasses.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Belum ada kelas"
            description="Kelas yang Anda ampu akan muncul di sini setelah ditetapkan oleh admin."
          />
        ) : (
          <ul className="divide-y divide-maroon-900/5">
            {teacher.teacherClasses.map((tc) => (
              <li key={tc.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="text-maroon-900">{tc.class.nama}</p>
                  <p className="text-xs text-maroon-800/50">{tc.mapel}</p>
                </div>
                <span className="text-xs text-maroon-800/50">
                  {tc.class._count.students} siswa
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-gold-500/30 bg-gold-50 p-5">
        <div className="flex items-center gap-2 text-maroon-900">
          <NotebookPen className="h-5 w-5" strokeWidth={1.6} />
          <p className="font-serif text-base">Belum menilai bulan ini?</p>
        </div>
        <p className="mt-1 text-sm text-maroon-800/60">
          Buka menu Penilaian Karakter untuk mencatat perkembangan siswa Anda.
        </p>
      </div>
    </div>
  );
}
