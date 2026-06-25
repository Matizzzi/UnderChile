import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "underchile_admin_session";

/**
 * Valor de cookie simple: no es un JWT ni token criptográfico,
 * es solo un valor fijo que confirma que la persona pasó por el login.
 * Suficiente para un MVP de un solo administrador.
 */
const ADMIN_COOKIE_VALUE = "authenticated";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === ADMIN_COOKIE_VALUE;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function checkAdminPassword(password: string): boolean {
  const correctPassword = process.env.ADMIN_PASSWORD;
  if (!correctPassword) {
    console.error("⚠️ ADMIN_PASSWORD no está configurada en .env");
    return false;
  }
  return password === correctPassword;
}