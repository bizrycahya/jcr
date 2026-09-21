"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export function AddAdminDialog({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  function resetForm() {
    setUsername("");
    setEmail("");
    setPassword("");
  }

  async function handleSubmit() {
    if (username.length < 3 || password.length < 6) {
      toast.error("Username minimal 3 karakter, password minimal 6 karakter.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/user/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menambahkan admin.");
      return;
    }

    toast.success("Akun admin berhasil ditambahkan.");
    resetForm();
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-lg text-maroon-900">Tambah Akun Admin</h2>
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
            <label className="text-sm text-maroon-800">Email (opsional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
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