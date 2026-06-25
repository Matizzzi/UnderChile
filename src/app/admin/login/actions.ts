"use server";

import { checkAdminPassword, setAdminSession, clearAdminSession } from "@/lib/adminAuth";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { redirect } from "next/navigation";

export type LoginFormState = {
  error?: string;
};

// 🔒 Rate limit: máximo 5 intentos de login cada 5 minutos por IP
const LOGIN_RATE_LIMIT_MAX = 5;
const LOGIN_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

export async function loginAdmin(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const ip = await getClientIp();
  const rateLimitResult = checkRateLimit(
    `admin-login:${ip}`,
    LOGIN_RATE_LIMIT_MAX,
    LOGIN_RATE_LIMIT_WINDOW_MS
  );

  if (!rateLimitResult.allowed) {
    const minutos = Math.ceil((rateLimitResult.retryAfterSeconds || 0) / 60);
    return {
      error: `Demasiados intentos fallidos. Intenta de nuevo en ${minutos} minuto(s).`,
    };
  }

  const password = (formData.get("password") as string) || "";

  if (!checkAdminPassword(password)) {
    return { error: "Contraseña incorrecta." };
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}