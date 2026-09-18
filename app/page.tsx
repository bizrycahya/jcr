import { Cormorant_Garamond, Inter } from "next/font/google";
import Link from "next/link";
import {
  BookOpenCheck,
  Users,
  ShieldCheck,
  LineChart,
  FileCheck2,
  Bell,
  QrCode,
  HeartHandshake,
  Moon,
  Star,
} from "lucide-react";

import { WaveDivider } from "@/components/landing/wave-divider";
import { ParticleField } from "@/components/landing/particle-field";
import { StatCounter } from "@/components/landing/stat-counter";
import { FaqAccordion } from "@/components/landing/faq-accordion";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Penilaian Karakter Harian",
    desc: "Guru menilai lima aspek karakter — akhlak, disiplin, kepemimpinan, akademik, dan sosial — langsung dari kelas.",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    icon: LineChart,
    title: "Analitik Perkembangan",
    desc: "Grafik radar dan tren semester menunjukkan arah pertumbuhan tiap siswa.",
  },
  {
    icon: Users,
    title: "Kolaborasi Lintas Peran",
    desc: "Guru, wali kelas, BK, dan orang tua bekerja dalam satu alur data yang sama.",
  },
  {
    icon: FileCheck2,
    title: "Rapor Karakter Otomatis",
    desc: "Laporan bulanan & semester tersusun otomatis, siap cetak dalam format PDF.",
  },
  {
    icon: QrCode,
    title: "Verifikasi Dokumen",
    desc: "Setiap laporan dilengkapi kode QR untuk memastikan keasliannya.",
  },
  {
    icon: ShieldCheck,
    title: "Akses Berbasis Peran",
    desc: "Delapan peran pengguna, masing-masing hanya melihat data yang relevan.",
  },
  {
    icon: Bell,
    title: "Notifikasi Real-time",
    desc: "Orang tua mendapat pembaruan begitu catatan baru ditambahkan.",
  },
  {
    icon: HeartHandshake,
    title: "Pembinaan BK Terstruktur",
    desc: "Riwayat pelanggaran dan surat pembinaan tersimpan rapi dan mudah ditelusuri.",
  },
];

const TIMELINE = [
  {
    step: "01",
    title: "Guru mencatat",
    desc: "Observasi harian di kelas dituangkan menjadi nilai per indikator karakter.",
  },
  {
    step: "02",
    title: "Wali kelas merangkum",
    desc: "Data bulanan dirangkum menjadi catatan naratif dan rekap kelas.",
  },
  {
    step: "03",
    title: "Orang tua menerima",
    desc: "Notifikasi dan laporan terkirim, mendorong percakapan di rumah.",
  },
  {
    step: "04",
    title: "Sekolah mengevaluasi",
    desc: "Kepala sekolah dan BK meninjau tren untuk kebijakan pembinaan lanjutan.",
  },
];

const VALUES = [
  { icon: Moon, label: "Akhlak Qur'ani" },
  { icon: ShieldCheck, label: "Kejujuran" },
  { icon: Star, label: "Keteladanan" },
  { icon: HeartHandshake, label: "Kepedulian" },
];

const TESTIMONIALS = [
  {
    quote:
      "Sejak memakai sistem ini, rapat wali kelas jadi lebih singkat — semua data karakter siswa sudah tersaji rapi sebelum rapat dimulai.",
    name: "Ustadzah Fathimah",
    role: "Wali Kelas VIII-A",
  },
  {
    quote:
      "Saya bisa memantau perkembangan anak saya dari HP tanpa harus menunggu pengumuman rapor di akhir semester.",
    name: "Bapak Rudiansyah",
    role: "Orang Tua Siswa Kelas X",
  },
  {
    quote:
      "Proses pembinaan siswa jadi lebih terdokumentasi. Surat panggilan orang tua bisa langsung diterbitkan dari riwayat pelanggaran.",
    name: "Ustadz Hilman",
    role: "Guru BK",
  },
];

export default function LandingPage() {
  return (
    <main className={`${serif.variable} ${sans.variable} font-sans bg-cream text-maroon-900`}>
      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden bg-maroon-gradient text-cream">
        <ParticleField />

        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="font-serif text-xl tracking-wide">JANIC</span>
          <div className="hidden gap-8 text-sm text-cream/80 md:flex">
            <a href="#fitur" className="hover:text-gold-300">Fitur</a>
            <a href="#alur" className="hover:text-gold-300">Alur Kerja</a>
            <a href="#testimoni" className="hover:text-gold-300">Testimoni</a>
            <a href="#faq" className="hover:text-gold-300">FAQ</a>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-gold-400/60 px-5 py-2 text-sm text-gold-200 transition hover:bg-gold-400 hover:text-maroon-900"
          >
            Masuk Sistem
          </Link>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pb-28 pt-16 text-center md:pt-24">
          <p className="animate-fade-in text-sm uppercase tracking-[0.2em] text-gold-300/80">
            Jannatun Naim International College
          </p>
          <h1 className="animate-slide-up mt-5 font-serif text-4xl leading-tight md:text-6xl">
            JANIC Character Report
          </h1>
          <p className="animate-slide-up mt-5 text-lg text-cream/90 md:text-xl" style={{ animationDelay: "0.1s" }}>
            Membangun karakter Islami, disiplin, berprestasi, dan berjiwa pemimpin.
          </p>
          <p className="animate-slide-up mt-4 max-w-xl text-cream/70" style={{ animationDelay: "0.2s" }}>
            Platform digital yang menyatukan guru, wali kelas, siswa, orang tua, BK,
            dan kepala sekolah dalam memantau perkembangan karakter siswa secara real-time.
          </p>

          <div className="animate-slide-up mt-9 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/login"
              className="rounded-full bg-gold-shine px-7 py-3 font-medium text-maroon-900 shadow-glow transition hover:scale-[1.03]"
            >
              Masuk Sistem
            </Link>
            <a
              href="#fitur"
              className="rounded-full border border-cream/30 px-7 py-3 text-cream transition hover:border-gold-300 hover:text-gold-300"
            >
              Lihat Demo
            </a>
            <a
              href="#alur"
              className="text-cream/70 underline decoration-gold-400/40 underline-offset-4 hover:text-gold-300"
            >
              Panduan
            </a>
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 pb-16 md:grid-cols-4">
          <StatCounter target={1240} suffix="+" label="Siswa Terpantau" />
          <StatCounter target={86} label="Tenaga Pendidik" />
          <StatCounter target={32} label="Rombongan Belajar" />
          <StatCounter target={5} label="Aspek Karakter" />
        </div>

        <WaveDivider />
      </section>

      {/* ============================= FITUR ============================= */}
      <section id="fitur" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl text-maroon-900 md:text-4xl">
            Satu sistem, seluruh ekosistem sekolah
          </h2>
          <p className="mt-4 text-maroon-800/70">
            Dari catatan harian guru hingga rapor karakter siswa, setiap peran
            memiliki ruang kerjanya masing-masing.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl border border-maroon-900/10 bg-white p-6 shadow-soft ${f.span ?? ""}`}
            >
              <f.icon className="h-7 w-7 text-maroon-600" strokeWidth={1.5} />
              <h3 className="mt-4 font-serif text-xl text-maroon-900">{f.title}</h3>
              <p className="mt-2 text-sm text-maroon-800/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= ALUR KERJA / TIMELINE ============================= */}
      <section id="alur" className="bg-maroon-950 py-24 text-cream">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-lg font-serif text-3xl md:text-4xl">
            Kolaborasi guru dan orang tua, dalam satu alur
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-4">
            {TIMELINE.map((item, i) => (
              <div key={item.step} className="relative pl-2">
                <span className="font-serif text-3xl text-gold-400/60">{item.step}</span>
                <h3 className="mt-3 text-lg text-cream">{item.title}</h3>
                <p className="mt-2 text-sm text-cream/60">{item.desc}</p>
                {i < TIMELINE.length - 1 && (
                  <div className="mt-6 hidden h-px w-full bg-gold-400/20 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= NILAI KARAKTER ============================= */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center font-serif text-3xl text-maroon-900 md:text-4xl">
          Nilai Karakter JANIC
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gold-400/30 bg-cream px-6 py-8 text-center"
            >
              <v.icon className="h-8 w-8 text-gold-600" strokeWidth={1.5} />
              <span className="font-serif text-lg text-maroon-900">{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= TESTIMONI ============================= */}
      <section id="testimoni" className="bg-maroon-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-serif text-3xl text-maroon-900 md:text-4xl">
            Kata guru kami
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col justify-between rounded-2xl bg-white p-7 shadow-soft"
              >
                <blockquote className="text-maroon-800/80">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6">
                  <p className="font-serif text-lg text-maroon-900">{t.name}</p>
                  <p className="text-sm text-maroon-800/60">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= FAQ ============================= */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="font-serif text-3xl text-maroon-900 md:text-4xl">
          Pertanyaan yang sering diajukan
        </h2>
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </section>

      {/* ============================= FOOTER ============================= */}
      <footer className="bg-maroon-950 py-16 text-cream/70">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-3">
          <div>
            <span className="font-serif text-xl text-cream">JANIC</span>
            <p className="mt-3 text-sm">
              Jannatun Naim International College
              <br />
              Jl. Pendidikan No. 1, Indonesia
            </p>
          </div>
          <div>
            <p className="text-sm text-gold-300/80">Kontak</p>
            <p className="mt-3 text-sm">info@janic.sch.id</p>
            <p className="text-sm">+62 800-0000-000</p>
          </div>
          <div>
            <p className="text-sm text-gold-300/80">Tautan</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/login">Masuk Sistem</Link>
              <a href="#fitur">Fitur</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-cream/10 px-6 pt-6 text-xs text-cream/40">
          © {new Date().getFullYear()} Jannatun Naim International College. Dikembangkan oleh Bizry Cahya Divia.
        </div>
      </footer>
    </main>
  );
}
