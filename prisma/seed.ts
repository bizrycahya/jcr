import { PrismaClient, Role, KategoriKarakter } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------------------------------------
  // 1. Pengaturan Sekolah
  // ---------------------------------------------------------------------
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      namaSekolah: "Jannatun Naim International College",
      yayasan: "Yayasan Jannatun Naim",
      alamat: "-",
      telepon: "-",
      email: "-",
      sidebarColor: "#681B2B",
      buttonColor: "#D4AF37",
    },
  });

  // ---------------------------------------------------------------------
  // 2. Tahun Ajaran Aktif
  // ---------------------------------------------------------------------
  await prisma.academicYear.upsert({
    where: { tahun: "2025/2026" },
    update: {},
    create: {
      tahun: "2025/2026",
      semester: 1,
      isActive: true,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-12-20"),
    },
  });

  // ---------------------------------------------------------------------
  // 3. Super Admin
  // ---------------------------------------------------------------------
  const hashedPassword = await bcrypt.hash("SuperAdmin#123", 10);
  await prisma.user.upsert({
    where: { username: "superadmin" },
    update: {},
    create: {
      username: "superadmin",
      email: "superadmin@janic.sch.id",
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  // ---------------------------------------------------------------------
  // 4. Kategori & Indikator Karakter
  // ---------------------------------------------------------------------
  const categories: Record<KategoriKarakter, { label: string; indikator: string[] }> = {
    AKHLAK: {
      label: "Akhlak",
      indikator: ["Sholat", "Murajaah", "Tahfidz", "Adab", "Kejujuran"],
    },
    DISIPLIN: {
      label: "Disiplin",
      indikator: ["Kehadiran", "Seragam", "Tugas", "Tepat Waktu"],
    },
    KEPEMIMPINAN: {
      label: "Kepemimpinan",
      indikator: ["Kerjasama", "Inisiatif", "Tanggung Jawab"],
    },
    AKADEMIK: {
      label: "Akademik",
      indikator: ["Belajar", "Fokus", "Kreativitas"],
    },
    SOSIAL: {
      label: "Sosial",
      indikator: ["Empati", "Sopan Santun", "Kebersihan"],
    },
  };

  let urutanKategori = 0;
  for (const [key, val] of Object.entries(categories)) {
    urutanKategori++;
    const category = await prisma.characterCategory.upsert({
      where: { nama: key as KategoriKarakter },
      update: {},
      create: {
        nama: key as KategoriKarakter,
        label: val.label,
        urutan: urutanKategori,
      },
    });

    let urutanIndikator = 0;
    for (const nama of val.indikator) {
      urutanIndikator++;
      const existing = await prisma.characterIndicator.findFirst({
        where: { categoryId: category.id, nama },
      });
      if (!existing) {
        await prisma.characterIndicator.create({
          data: {
            categoryId: category.id,
            nama,
            urutan: urutanIndikator,
          },
        });
      }
    }
  }

  console.log("Seed selesai.");
  console.log("Login Super Admin -> username: superadmin | password: SuperAdmin#123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
