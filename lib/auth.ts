import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SESSION_MAX_AGE_SECONDS =
  Number(process.env.SESSION_MAX_AGE_HOURS ?? 12) * 60 * 60;

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS, // 12 jam sesuai spesifikasi
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password wajib diisi.");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: {
            teacher: true,
            parent: true,
            student: true,
          },
        });

        if (!user) {
          throw new Error("Akun tidak ditemukan.");
        }

        if (user.status !== "AKTIF") {
          throw new Error("Akun tidak aktif. Hubungi administrator.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Password salah.");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Nama tampilan diambil dari profil terkait sesuai role
        const displayName =
          user.teacher?.nama ?? user.parent?.nama ?? user.student?.nama ?? user.username;

        return {
          id: user.id,
          name: displayName,
          email: user.email ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
