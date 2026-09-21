-- AlterTable
ALTER TABLE "monthly_reports" ADD COLUMN     "rencanaTindakLanjut" TEXT;

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "namaKepalaSekolah" TEXT;

-- CreateTable
CREATE TABLE "monthly_report_details" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "indikator" TEXT NOT NULL,
    "capaian" TEXT NOT NULL,

    CONSTRAINT "monthly_report_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monthly_report_details_reportId_categoryId_key" ON "monthly_report_details"("reportId", "categoryId");

-- AddForeignKey
ALTER TABLE "monthly_report_details" ADD CONSTRAINT "monthly_report_details_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "monthly_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_report_details" ADD CONSTRAINT "monthly_report_details_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "character_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
