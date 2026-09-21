"use client";

import { useState } from "react";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

type TeacherData = {
  nip: string;
  nama: string;
  jabatan: string;
  mapel: string;
  whatsapp: string;
  email: string | null;
  user: { username: string; email: string | null };
} | null;

export function ProfilGuru({ teacher }: { teacher: TeacherData }) {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!teacher) {
    return <p className="text-sm text-maroon-800/50">Data profil tidak ditemukan.</p>;
  }

  async function handleChangePassword() {
    if (!passwordLama || !passwordBaru) {
      toast.error("Lengkapi password lama dan password baru.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/guru/ganti-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passwordLama, passwordBaru }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal mengubah password.");
      return;
    }

    toast.success("Password berhasil diubah.");
    setPasswordLama("");
    setPasswordBaru("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Profil Saya</h1>
        <p className="text-sm text-maroon-800/50">Informasi akun dan pengaturan keamanan.</p>
      </div>

      <div className="max-w-xl space-y-3 rounded-2xl border border-maroon-900/8 bg-white p-6 shadow-soft">
        <h3 className="text-sm font-semibold text-maroon-800">Informasi Guru</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-maroon-800/50">Nama</p>
            <p className="text-maroon-900">{teacher.nama}</p>
          </div>
          <div>
            <p className="text-maroon-800/50">NIP</p>
            <p className="text-maroon-900">{teacher.nip}</p>
          </div>
          <div>
            <p className="text-maroon-800/50">Jabatan</p>
            <p className="text-maroon-900">{teacher.jabatan}</p>
          </div>
          <div>
            <p className="text-maroon-800/50">Mapel/Bidang</p>
            <p className="text-maroon-900">{teacher.mapel}</p>
          </div>
          <div>
            <p className="text-maroon-800/50">WhatsApp</p>
            <p className="text-maroon-900">{teacher.whatsapp}</p>
          </div>
          <div>
            <p className="text-maroon-800/50">Username</p>
            <p className="text-maroon-900">{teacher.user.username}</p>
          </div>
        </div>
      </div>

      <div className="max-w-xl space-y-3 rounded-2xl border border-maroon-900/8 bg-white p-6 shadow-soft">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-maroon-800">
          <KeyRound className="h-4 w-4" />
          Ganti Password
        </h3>
        <div className="space-y-1.5">
          <label className="text-sm text-maroon-800">Password Lama</label>
          <input
            type="password"
            value={passwordLama}
            onChange={(e) => setPasswordLama(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-maroon-800">Password Baru</label>
          <input
            type="password"
            value={passwordBaru}
            onChange={(e) => setPasswordBaru(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
          />
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={handleChangePassword}
            disabled={submitting}
            className="rounded-xl bg-maroon-800 px-5 py-2.5 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Ubah Password"}
          </button>
        </div>
      </div>
    </div>
  );
}