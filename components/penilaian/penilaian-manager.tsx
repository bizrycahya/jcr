"use client";

import { useState } from "react";
import { CategoryManager } from "./category-manager";
import { ScoreInput } from "./score-input";

export function PenilaianManager() {
  const [tab, setTab] = useState<"input" | "kategori">("input");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-maroon-900/8">
        <button
          onClick={() => setTab("input")}
          className={tab === "input" ? "border-b-2 border-gold-500 px-4 py-2.5 text-sm font-medium text-maroon-900" : "px-4 py-2.5 text-sm text-maroon-800/50"}
        >
          Input Nilai
        </button>
        <button
          onClick={() => setTab("kategori")}
          className={tab === "kategori" ? "border-b-2 border-gold-500 px-4 py-2.5 text-sm font-medium text-maroon-900" : "px-4 py-2.5 text-sm text-maroon-800/50"}
        >
          Kelola Kategori
        </button>
      </div>

      {tab === "input" ? <ScoreInput /> : <CategoryManager />}
    </div>
  );
}