import { GraduationCap, NotebookPen, FileBarChart, Layers } from "lucide-react";
import { requireRole, getCurrentSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function WaliKelasDashboardPage() {
  await requireRole(["WALI_KELAS", "SUPER_ADMIN"]);
  const session = await getCurrentSession();

  const teacher = await prisma.teacher.findUnique({
    where: { userId: session!.user.id },
    include: {
      homeroom: {
        include: {
          class: { include: { students: { where: { status: "AKTIF" } } } },
          catatan: { orderBy: { createdAt: "desc" }, take: 5, include: { student: true } },
        },
      },
    },
  });

  const homeroomClass = teacher?.homeroom?.class;

  if (!homeroomClass) {
    return (
      <EmptyState
        icon={Layers}
        title="Belum menjadi wali kelas"
        description="Akun ini belum ditetapkan sebagai wali kelas manapun oleh admin."
      />
    );
  }

  const cards = [
    { icon: GraduationCap, label: "Siswa di Kelas", value: homeroomClass.students.length },
    { icon: NotebookPen, label: "Catatan Wali", value: teacher!.homeroom!.catatan.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Wali Kelas {homeroomClass.nama}</h1>
        <p className="text-sm text-maroon-800/50">{homeroomClass.jenjang}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
        <h2 className="mb-4 font-serif text-lg text-maroon-900">Daftar Siswa</h2>
        {homeroomClass.students.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Belum ada siswa"
            description="Siswa yang ditempatkan di kelas ini akan tampil di sini."
          />
        ) : (
          <ul className="divide-y divide-maroon-900/5">
            {homeroomClass.students.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-maroon-900">{s.nama}</span>
                <span className="text-xs text-maroon-800/50">{s.nis}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-maroon-700" strokeWidth={1.6} />
          <h2 className="font-serif text-lg text-maroon-900">Catatan Wali Terbaru</h2>
        </div>
        {teacher!.homeroom!.catatan.length === 0 ? (
          <EmptyState
            icon={NotebookPen}
            title="Belum ada catatan"
            description="Catatan yang Anda tulis untuk siswa akan tersimpan di sini."
          />
        ) : (
          <ul className="divide-y divide-maroon-900/5">
            {teacher!.homeroom!.catatan.map((note) => (
              <li key={note.id} className="py-3 text-sm">
                <p className="text-maroon-900">{note.student.nama}</p>
                <p className="text-maroon-800/60">{note.isi}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
