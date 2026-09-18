"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Bagaimana orang tua bisa memantau perkembangan karakter anak?",
    a: "Orang tua login menggunakan NISN anak untuk melihat grafik perkembangan, catatan guru, serta mengunduh laporan bulanan dan semester dalam format PDF.",
  },
  {
    q: "Siapa saja yang menginput nilai karakter siswa?",
    a: "Guru mata pelajaran menginput penilaian harian sesuai indikator pada kelas yang diampu. Wali kelas kemudian merangkum menjadi catatan bulanan dan semester.",
  },
  {
    q: "Apakah laporan karakter bisa diverifikasi keasliannya?",
    a: "Setiap laporan PDF dilengkapi kode QR verifikasi yang dapat dipindai untuk memastikan dokumen tersebut asli dan diterbitkan oleh sistem sekolah.",
  },
  {
    q: "Bagaimana BK menindaklanjuti pelanggaran siswa?",
    a: "BK mencatat pelanggaran beserta tingkatannya, kemudian dapat menerbitkan surat pembinaan atau surat panggilan orang tua langsung dari sistem.",
  },
  {
    q: "Apakah kepala sekolah bisa melihat data seluruh kelas?",
    a: "Ya, dashboard Kepala Sekolah bersifat read-only dan menampilkan rekap statistik, prestasi, serta pelanggaran dari seluruh kelas dan jenjang.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-maroon-800/15">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.q} className="py-5">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-start justify-between gap-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-lg text-maroon-800 md:text-xl">
                {item.q}
              </span>
              <Plus
                className={cn(
                  "mt-1 h-5 w-5 flex-shrink-0 text-gold-600 transition-transform duration-300",
                  isOpen && "rotate-45"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen
                  ? "mt-3 grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <p className="overflow-hidden text-maroon-800/70">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
