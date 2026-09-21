"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

type AppearanceFormProps = {
  initialData: {
    sidebarColor: string;
    buttonColor: string;
    ttdKepsekUrl: string | null;
    ttdWaliUrl: string | null;
    stempelUrl: string | null;
  };
};

export function AppearanceForm({ initialData }: AppearanceFormProps) {
  const [sidebarColor, setSidebarColor] = useState(initialData.sidebarColor);
  const [buttonColor, setButtonColor] = useState(initialData.buttonColor);
  const [ttdKepsekUrl, setTtdKepsekUrl] = useState(initialData.ttdKepsekUrl ?? "");
  const [ttdWaliUrl, setTtdWaliUrl] = useState(initialData.ttdWaliUrl ?? "");
  const [stempelUrl, setStempelUrl] = useState(initialData.stempelUrl ?? "");

  const [uploadingKepsek, setUploadingKepsek] = useState(false);
  const [uploadingWali, setUploadingWali] = useState(false);
  const [uploadingStempel, setUploadingStempel] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    folder: string,
    setUrl: (v: string) => void,
    setUploading: (v: boolean) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    setUploading(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal upload file.");
      return;
    }

    setUrl(json.url);
    toast.success("File berhasil diunggah.");
  }

  async function handleSubmit() {
    setSubmitting(true);
    const res = await fetch("/api/pengaturan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sidebarColor, buttonColor, ttdKepsekUrl, ttdWaliUrl, stempelUrl }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan pengaturan.");
      return;
    }

    toast.success("Pengaturan berhasil disimpan.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Pengaturan Tampilan & Cetak</h1>
        <p className="text-sm text-maroon-800/50">
          Kelola warna tema dan tanda tangan digital untuk cetak rapor.
        </p>
      </div>

      <div className="max-w-2xl space-y-6 rounded-2xl border border-maroon-900/8 bg-white p-6 shadow-soft">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-maroon-800">Warna Tema</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">Warna Sidebar</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={sidebarColor}
                  onChange={(e) => setSidebarColor(e.target.value)}
                  className="h-10 w-14 rounded-lg border border-maroon-900/15"
                />
                <input
                  value={sidebarColor}
                  onChange={(e) => setSidebarColor(e.target.value)}
                  className="flex-1 rounded-xl border border-maroon-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">Warna Tombol</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  className="h-10 w-14 rounded-lg border border-maroon-900/15"
                />
                <input
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  className="flex-1 rounded-xl border border-maroon-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-maroon-800">Tanda Tangan & Stempel Cetak</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">TTD Kepala Sekolah</label>
              {ttdKepsekUrl && (
                <Image src={ttdKepsekUrl} alt="TTD Kepsek" width={100} height={60} className="rounded-md border object-contain" />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploadingKepsek}
                onChange={(e) => handleUpload(e, "ttd-kepsek", setTtdKepsekUrl, setUploadingKepsek)}
                className="w-full text-xs"
              />
              {uploadingKepsek && <p className="text-xs text-maroon-800/50">Mengunggah...</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">TTD Wali Kelas</label>
              {ttdWaliUrl && (
                <Image src={ttdWaliUrl} alt="TTD Wali" width={100} height={60} className="rounded-md border object-contain" />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploadingWali}
                onChange={(e) => handleUpload(e, "ttd-wali", setTtdWaliUrl, setUploadingWali)}
                className="w-full text-xs"
              />
              {uploadingWali && <p className="text-xs text-maroon-800/50">Mengunggah...</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">Stempel Sekolah</label>
              {stempelUrl && (
                <Image src={stempelUrl} alt="Stempel" width={100} height={60} className="rounded-md border object-contain" />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploadingStempel}
                onChange={(e) => handleUpload(e, "stempel", setStempelUrl, setUploadingStempel)}
                className="w-full text-xs"
              />
              {uploadingStempel && <p className="text-xs text-maroon-800/50">Mengunggah...</p>}
            </div>
          </div>
          <p className="mt-2 text-xs text-maroon-800/50">
            Gunakan gambar tanda tangan/stempel dengan latar transparan (PNG) untuk hasil cetak terbaik.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-maroon-800 px-5 py-2.5 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </div>
    </div>
  );
}