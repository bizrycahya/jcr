import Link from "next/link";
import { GraduationCap, FileBarChart } from "lucide-react";
import { requireRole, getCurrentSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function OrangTuaDashboardPage() {
  await requireRole(["ORANG_TUA", "SUPER_ADMIN"]);
  const session = await getCurrentSession();

  const parent = await prisma.parent.findUnique({
    where: { userId: session!.user.id },
    include: {
      studentLinks: {
        include: {
          student: { include: { class: true } },
        },
      },
    },
  });

  const children = parent?.studentLinks.map((link) => link.student) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Perkembangan Anak</h1>
        <p className="text-sm text-maroon-800/50">
          Pantau perkembangan karakter putra/putri Anda di JaNIC.
        </p>
      </div>

      {children.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Belum ada anak tertaut"
          description="Hubungi admin sekolah untuk menautkan akun Anda dengan data siswa."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {children.map((child) => (
            <div key={child.id} className="rounded-2xl border border-maroon-900/8 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon-800 font-serif text-xl text-cream">
                  {child.nama.charAt(0)}
                </span>
                <div>
                  <p className="font-serif text-lg text-maroon-900">{child.nama}</p>
                  <p className="text-sm text-maroon-800/50">
                    Kelas {child.class.nama} · NIS {child.nis}
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/orang-tua/perkembangan?siswa=${child.id}`}
                className="mt-5 flex items-center gap-2 text-sm text-maroon-700 hover:text-gold-600"
              >
                <FileBarChart className="h-4 w-4" />
                Lihat grafik & laporan lengkap
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
