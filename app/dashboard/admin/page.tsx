import {
  GraduationCap,
  UserSquare2,
  Layers,
  ClipboardList,
  FileBarChart,
  CalendarRange,
  History,
} from "lucide-react";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function AdminDashboardPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const [totalSiswa, totalGuru, totalKelas, totalPenilaian, activities, activeYear] =
    await Promise.all([
      prisma.student.count({ where: { status: "AKTIF" } }),
      prisma.teacher.count({ where: { status: "AKTIF" } }),
      prisma.class.count(),
      prisma.characterScore.count(),
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { user: { select: { username: true, role: true } } },
      }),
      prisma.academicYear.findFirst({ where: { isActive: true } }),
    ]);

  const cards = [
    { icon: GraduationCap, label: "Total Siswa", value: totalSiswa },
    { icon: UserSquare2, label: "Total Guru", value: totalGuru },
    { icon: Layers, label: "Total Kelas", value: totalKelas },
    { icon: ClipboardList, label: "Total Penilaian", value: totalPenilaian },
  ];

  const quickActions = [
    { icon: GraduationCap, label: "Tambah Siswa", href: "/dashboard/admin/siswa" },
    { icon: UserSquare2, label: "Tambah Guru", href: "/dashboard/admin/guru" },
    { icon: Layers, label: "Kelola Kelas", href: "/dashboard/admin/kelas" },
    { icon: FileBarChart, label: "Buat Laporan", href: "/dashboard/admin/laporan" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Dashboard Admin</h1>
        <p className="text-sm text-maroon-800/50">
          Tahun Ajaran Aktif:{" "}
          <span className="text-maroon-900">
            {activeYear ? `${activeYear.tahun} · Semester ${activeYear.semester}` : "Belum diatur"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-serif text-lg text-maroon-900">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {quickActions.map((a) => (
            <QuickActionCard key={a.label} {...a} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
        <h2 className="mb-4 font-serif text-lg text-maroon-900">Aktivitas Terbaru</h2>
        {activities.length === 0 ? (
          <EmptyState
            icon={History}
            title="Belum ada aktivitas"
            description="Aktivitas pengguna di sistem akan muncul di sini."
          />
        ) : (
          <ul className="divide-y divide-maroon-900/5">
            {activities.map((log) => (
              <li key={log.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="text-maroon-900">{log.aksi}</p>
                  <p className="text-xs text-maroon-800/50">
                    {log.user.username} · {log.user.role}
                  </p>
                </div>
                <span className="text-xs text-maroon-800/40">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(log.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
        <div className="mb-2 flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-maroon-700" strokeWidth={1.6} />
          <h2 className="font-serif text-lg text-maroon-900">Kalender Akademik</h2>
        </div>
        {activeYear ? (
          <p className="text-sm text-maroon-800/60">
            Tahun ajaran {activeYear.tahun} berlangsung dari{" "}
            {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(activeYear.startDate)}{" "}
            sampai{" "}
            {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(activeYear.endDate)}.
          </p>
        ) : (
          <EmptyState
            icon={CalendarRange}
            title="Tahun ajaran belum diatur"
            description="Atur tahun ajaran aktif di menu Semester."
          />
        )}
      </div>
    </div>
  );
}
