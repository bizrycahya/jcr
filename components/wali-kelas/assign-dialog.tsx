"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type TeacherOption = { id: string; nama: string; nip: string };

export function AssignWaliKelasDialog({
  open,
  onClose,
  onAssigned,
  classId,
  className,
  availableTeachers,
}: {
  open: boolean;
  onClose: () => void;
  onAssigned: () => void;
  classId: string | null;
  className: string;
  availableTeachers: TeacherOption[];
}) {
  const [teacherId, setTeacherId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    if (!teacherId || !classId) {
      toast.error("Pilih guru terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/wali-kelas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, teacherId }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menetapkan wali kelas.");
      return;
    }

    toast.success("Wali kelas berhasil ditetapkan.");
    setTeacherId("");
    onAssigned();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-lg text-maroon-900">Tetapkan Wali Kelas</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-maroon-800/50 hover:bg-maroon-900/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-sm text-maroon-800/60">Kelas: {className}</p>

        <div className="mt-4 space-y-1.5">
          <label className="text-sm text-maroon-800">Pilih Guru</label>
          {availableTeachers.length === 0 ? (
            <p className="rounded-xl bg-maroon-50 p-3 text-sm text-maroon-800/70">
              Tidak ada guru dengan jabatan &quot;Wali Kelas&quot; yang tersedia. Tambahkan atau ubah jabatan guru di menu Data Guru terlebih dahulu.
            </p>
          ) : (
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            >
              <option value="">Pilih guru...</option>
              {availableTeachers.map((t) => (
                <option key={t.id} value={t.id}>{t.nama} ({t.nip})</option>
              ))}
            </select>
          )}
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
            disabled={submitting || availableTeachers.length === 0}
            className="rounded-xl bg-maroon-800 px-4 py-2 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Tetapkan"}
          </button>
        </div>
      </div>
    </div>
  );
}