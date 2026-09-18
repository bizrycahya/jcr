import type { Role } from "@prisma/client";
import {
  LayoutDashboard,
  School,
  Users,
  UserSquare2,
  GraduationCap,
  Layers,
  UserCog,
  ClipboardList,
  FileBarChart,
  CalendarRange,
  Settings,
  DatabaseBackup,
  ScrollText,
  UserCircle,
  BookOpenText,
  NotebookPen,
  Award,
  ShieldAlert,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  SUPER_ADMIN: [
    { label: "Dashboard", href: "/dashboard/super-admin", icon: LayoutDashboard },
    { label: "Sekolah", href: "/dashboard/super-admin/sekolah", icon: School },
    { label: "Manajemen User", href: "/dashboard/super-admin/user", icon: Users },
    { label: "Data Guru", href: "/dashboard/super-admin/guru", icon: UserSquare2 },
    { label: "Data Siswa", href: "/dashboard/super-admin/siswa", icon: GraduationCap },
    { label: "Kelas", href: "/dashboard/super-admin/kelas", icon: Layers },
    { label: "Wali Kelas", href: "/dashboard/super-admin/wali-kelas", icon: UserCog },
    { label: "Penilaian", href: "/dashboard/super-admin/penilaian", icon: ClipboardList },
    { label: "Laporan", href: "/dashboard/super-admin/laporan", icon: FileBarChart },
    { label: "Semester", href: "/dashboard/super-admin/semester", icon: CalendarRange },
    { label: "Pengaturan", href: "/dashboard/super-admin/pengaturan", icon: Settings },
    { label: "Backup", href: "/dashboard/super-admin/backup", icon: DatabaseBackup },
    { label: "Activity Log", href: "/dashboard/super-admin/activity-log", icon: ScrollText },
    { label: "Profil", href: "/dashboard/super-admin/profil", icon: UserCircle },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Data Guru", href: "/dashboard/admin/guru", icon: UserSquare2 },
    { label: "Data Siswa", href: "/dashboard/admin/siswa", icon: GraduationCap },
    { label: "Kelas", href: "/dashboard/admin/kelas", icon: Layers },
    { label: "Penilaian", href: "/dashboard/admin/penilaian", icon: ClipboardList },
    { label: "Laporan", href: "/dashboard/admin/laporan", icon: FileBarChart },
    { label: "Profil", href: "/dashboard/admin/profil", icon: UserCircle },
  ],
  GURU: [
    { label: "Dashboard", href: "/dashboard/guru", icon: LayoutDashboard },
    { label: "Penilaian Karakter", href: "/dashboard/guru/penilaian", icon: ClipboardList },
    { label: "Riwayat Penilaian", href: "/dashboard/guru/riwayat", icon: BookOpenText },
    { label: "Jurnal Guru", href: "/dashboard/guru/jurnal", icon: NotebookPen },
    { label: "Profil", href: "/dashboard/guru/profil", icon: UserCircle },
  ],
  WALI_KELAS: [
    { label: "Dashboard", href: "/dashboard/wali-kelas", icon: LayoutDashboard },
    { label: "Siswa Kelas", href: "/dashboard/wali-kelas/siswa", icon: GraduationCap },
    { label: "Penilaian", href: "/dashboard/wali-kelas/penilaian", icon: ClipboardList },
    { label: "Catatan Wali", href: "/dashboard/wali-kelas/catatan", icon: NotebookPen },
    { label: "Laporan Bulanan", href: "/dashboard/wali-kelas/laporan-bulanan", icon: FileBarChart },
    { label: "Rekap Semester", href: "/dashboard/wali-kelas/rekap-semester", icon: CalendarRange },
    { label: "Profil", href: "/dashboard/wali-kelas/profil", icon: UserCircle },
  ],
  BK: [
    { label: "Dashboard", href: "/dashboard/bk", icon: LayoutDashboard },
    { label: "Monitoring Pelanggaran", href: "/dashboard/bk/pelanggaran", icon: ShieldAlert },
    { label: "Riwayat Pembinaan", href: "/dashboard/bk/pembinaan", icon: ScrollText },
    { label: "Surat Pembinaan", href: "/dashboard/bk/surat-pembinaan", icon: FileText },
    { label: "Surat Panggilan Ortu", href: "/dashboard/bk/surat-panggilan", icon: FileText },
    { label: "Profil", href: "/dashboard/bk/profil", icon: UserCircle },
  ],
  KEPALA_SEKOLAH: [
    { label: "Dashboard", href: "/dashboard/kepala-sekolah", icon: LayoutDashboard },
    { label: "Rekap Semua Kelas", href: "/dashboard/kepala-sekolah/rekap", icon: Layers },
    { label: "Prestasi", href: "/dashboard/kepala-sekolah/prestasi", icon: Award },
    { label: "Pelanggaran", href: "/dashboard/kepala-sekolah/pelanggaran", icon: ShieldAlert },
    { label: "Laporan", href: "/dashboard/kepala-sekolah/laporan", icon: FileBarChart },
    { label: "Profil", href: "/dashboard/kepala-sekolah/profil", icon: UserCircle },
  ],
  ORANG_TUA: [
    { label: "Dashboard", href: "/dashboard/orang-tua", icon: LayoutDashboard },
    { label: "Perkembangan Anak", href: "/dashboard/orang-tua/perkembangan", icon: GraduationCap },
    { label: "Catatan Guru", href: "/dashboard/orang-tua/catatan", icon: NotebookPen },
    { label: "Laporan", href: "/dashboard/orang-tua/laporan", icon: FileBarChart },
    { label: "Profil", href: "/dashboard/orang-tua/profil", icon: UserCircle },
  ],
  SISWA: [
    { label: "Dashboard", href: "/dashboard/siswa", icon: LayoutDashboard },
    { label: "Grafik Karakter", href: "/dashboard/siswa/grafik", icon: FileBarChart },
    { label: "Riwayat Penilaian", href: "/dashboard/siswa/riwayat", icon: BookOpenText },
    { label: "Prestasi", href: "/dashboard/siswa/prestasi", icon: Award },
    { label: "Pelanggaran", href: "/dashboard/siswa/pelanggaran", icon: ShieldAlert },
    { label: "Profil", href: "/dashboard/siswa/profil", icon: UserCircle },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  KEPALA_SEKOLAH: "Kepala Sekolah",
  BK: "Guru BK",
  WALI_KELAS: "Wali Kelas",
  GURU: "Guru",
  ORANG_TUA: "Orang Tua",
  SISWA: "Siswa",
};
