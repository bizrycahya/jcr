"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { schoolSchema, type SchoolInput } from "@/lib/validations/school";

type SchoolFormProps = {
  initialData: {
    namaSekolah: string;
    yayasan: string | null;
    alamat: string | null;
    telepon: string | null;
    website: string | null;
    email: string | null;
    logoUrl: string | null;
    loginBackgroundUrl: string | null;
  };
};

export function SchoolForm({ initialData }: SchoolFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SchoolInput>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      namaSekolah: initialData.namaSekolah,
      yayasan: initialData.yayasan ?? "",
      alamat: initialData.alamat ?? "",
      telepon: initialData.telepon ?? "",
      website: initialData.website ?? "",
      email: initialData.email ?? "",
      logoUrl: initialData.logoUrl ?? "",
      loginBackgroundUrl: initialData.loginBackgroundUrl ?? "",
    },
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const logoUrl = watch("logoUrl");
  const bgUrl = watch("loginBackgroundUrl");

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "loginBackgroundUrl",
    folder: string,
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

    setValue(field, json.url, { shouldValidate: true });
    toast.success("File berhasil diunggah.");
  }

  async function onSubmit(values: SchoolInput) {
    const res = await fetch("/api/sekolah", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan data sekolah.");
      return;
    }

    toast.success("Profil sekolah berhasil diperbarui.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-maroon-700">Data Sekolah</h1>
        <p className="text-sm text-muted-foreground">
          Kelola profil instansi yang ditampilkan di rapor dan halaman login.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl space-y-4 rounded-lg border bg-white p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="namaSekolah">Nama Sekolah</Label>
          <Input id="namaSekolah" {...register("namaSekolah")} />
          {errors.namaSekolah && (
            <p className="text-sm text-destructive">{errors.namaSekolah.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="yayasan">Yayasan</Label>
          <Input id="yayasan" {...register("yayasan")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alamat">Alamat</Label>
          <Input id="alamat" {...register("alamat")} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="telepon">Telepon</Label>
            <Input id="telepon" {...register("telepon")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" {...register("website")} placeholder="https://" />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoFile">Logo Sekolah</Label>
          {logoUrl && (
            <Image
              src={logoUrl}
              alt="Logo"
              width={80}
              height={80}
              className="rounded-md border object-contain"
            />
          )}
          <Input
            id="logoFile"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={uploadingLogo}
            onChange={(e) => handleFileUpload(e, "logoUrl", "logo", setUploadingLogo)}
          />
          {uploadingLogo && <p className="text-sm text-muted-foreground">Mengunggah...</p>}
          {errors.logoUrl && (
            <p className="text-sm text-destructive">{errors.logoUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bgFile">Background Halaman Login</Label>
          {bgUrl && (
            <Image
              src={bgUrl}
              alt="Background"
              width={160}
              height={90}
              className="rounded-md border object-cover"
            />
          )}
          <Input
            id="bgFile"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={uploadingBg}
            onChange={(e) => handleFileUpload(e, "loginBackgroundUrl", "background", setUploadingBg)}
          />
          {uploadingBg && <p className="text-sm text-muted-foreground">Mengunggah...</p>}
          {errors.loginBackgroundUrl && (
            <p className="text-sm text-destructive">{errors.loginBackgroundUrl.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-maroon-500 hover:bg-maroon-600"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}