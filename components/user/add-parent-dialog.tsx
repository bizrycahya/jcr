"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type StudentOption = { id: string; nama: string; nis: string; class: { nama: string } };

export function AddParentDialog({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetch("/api/user/parent")
        .then((res) => res.json())
        .then((json) => setStudents(json.students ?? []));
    }
  }, [open]);

  if (!open) return null;

  function resetForm() {
    setUsername("");
    setNama("");
    setWhatsapp("");
    setEmail("");
    setStudentIds([]);
  }

  function toggleStudent(id: string) {
    setStudentIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  async function handleSubmit() {
    setSubmitting(true);
    const res = await fetch("/api/user/parent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, nama, whatsapp, email, studentIds }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menambahkan orang tua.");
      return;
    }

    toast.success(`Orang tua ditambahkan. Username: ${username}, Password: ${json.defaultPassword}`, {
      duration: 12000,
    });
    resetForm();
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-lg text-maroon-900">Tambah Akun Orang Tua</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-maroon-800/50 hover:bg-maroon-900/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Nama Orang Tua</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">No. WhatsApp</label>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="081234567890"
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Email (opsional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Anak (bisa lebih dari satu)</label>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-maroon-900/15 p-2">
              {students.length === 0 ? (
                <p className="p-2 text-xs text-maroon-800/50">Belum ada data siswa.</p>
              ) : (
                students.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-maroon-50/50">
                    <input
                      type="checkbox"
                      checked={studentIds.includes(s.id)}
                      onChange={() => toggleStudent(s.id)}
                      className="h-4 w-4 rounded border-maroon-900/30"
                    />
                    {s.nama} ({s.nis}) — {s.class.nama}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-maroon-900/15 px-4 py-2 text-sm text-maroon-800 hover:bg-maroon-900/5"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-maroon-800 px-4 py-2 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}