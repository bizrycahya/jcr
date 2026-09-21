import { requireRole } from "@/lib/session";
import { AcademicYearManager } from "@/components/semester/academic-year-manager";

export default async function SuperAdminSemesterPage() {
  await requireRole(["SUPER_ADMIN"]);

  return <AcademicYearManager />;
}