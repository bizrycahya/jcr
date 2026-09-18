import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { ParticleField } from "@/components/landing/particle-field";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

export default function LoginPage() {
  return (
    <div className={`${serif.variable} grid min-h-screen grid-cols-1 md:grid-cols-2`}>
      {/* ===================== PANEL KIRI ===================== */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-maroon-gradient p-12 text-cream md:flex">
        <ParticleField />

        <Link href="/" className="relative z-10 font-serif text-2xl">
          JANIC
        </Link>

        <div className="relative z-10 max-w-md">
          <GraduationCap className="h-10 w-10 text-gold-300" strokeWidth={1.3} />
          <p className="mt-8 font-serif text-3xl leading-snug text-cream">
            &ldquo;Character Builds Future Leaders.&rdquo;
          </p>
          <p className="mt-4 text-cream/70">
            Membangun generasi Qur&apos;ani, berkarakter, dan berprestasi —
            bersama guru, wali kelas, dan orang tua dalam satu ekosistem digital.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-cream/50">
          <Sparkles className="h-4 w-4 text-gold-400" />
          Jannatun Naim International College
        </div>
      </div>

      {/* ===================== PANEL KANAN ===================== */}
      <div className="flex items-center justify-center bg-cream px-6 py-16">
        <div className="w-full max-w-sm rounded-3xl border border-maroon-900/10 bg-white/60 p-8 shadow-soft backdrop-blur-sm md:bg-white/40">
          <div className="mb-8 text-center md:hidden">
            <span className="font-serif text-2xl text-maroon-900">JANIC</span>
          </div>

          <h1 className={`${serif.variable} font-serif text-2xl text-maroon-900`}>
            Selamat datang kembali
          </h1>
          <p className="mt-1.5 mb-8 text-sm text-maroon-800/60">
            Masuk untuk mengakses dashboard sesuai peran Anda.
          </p>

          <LoginForm />

          <p className="mt-8 text-center text-xs text-maroon-800/40">
            Butuh bantuan akses? Hubungi admin sekolah.
          </p>
        </div>
      </div>
    </div>
  );
}
