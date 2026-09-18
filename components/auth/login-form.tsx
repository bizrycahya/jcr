"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { getDashboardPathForRole } from "@/lib/role-routes";
import type { Role } from "@prisma/client";

const REMEMBER_KEY = "janic_remember_username";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", remember: false },
  });

  useEffect(() => {
    const savedUsername = localStorage.getItem(REMEMBER_KEY);
    if (savedUsername) {
      setValue("username", savedUsername);
      setValue("remember", true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);

    if (data.remember) {
      localStorage.setItem(REMEMBER_KEY, data.username);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error === "CredentialsSignin" ? "Username atau password salah." : result.error);
      setIsSubmitting(false);
      return;
    }

    const session = await getSession();
    const role = session?.user?.role as Role | undefined;

    toast.success("Berhasil masuk. Mengalihkan ke dashboard...");
    router.push(role ? getDashboardPathForRole(role) : "/login");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-5">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm text-maroon-800/80">
          Username
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-maroon-800/40" />
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Masukkan username"
            {...register("username")}
            className="w-full rounded-xl border border-maroon-900/15 bg-white/70 py-3 pl-10 pr-4 text-maroon-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
        {errors.username && (
          <p className="mt-1.5 text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm text-maroon-800/80">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-maroon-800/40" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan password"
            {...register("password")}
            className="w-full rounded-xl border border-maroon-900/15 bg-white/70 py-3 pl-10 pr-11 text-maroon-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-maroon-800/40 hover:text-maroon-800/70"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-maroon-800/70">
          <input
            type="checkbox"
            {...register("remember")}
            className="h-4 w-4 rounded border-maroon-900/30 text-maroon-700 focus:ring-gold-500/40"
          />
          Ingat saya
        </label>
        <a href="/lupa-password" className="text-maroon-700 hover:text-gold-600">
          Lupa password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-maroon-800 py-3.5 font-medium text-cream shadow-soft transition hover:bg-maroon-900 disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Masuk
      </button>
    </form>
  );
}
