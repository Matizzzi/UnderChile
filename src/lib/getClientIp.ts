import { headers } from "next/headers";

/**
 * Obtiene la IP del visitante a partir de los headers de la request.
 * En producción, detrás de un proxy/CDN (Vercel, Cloudflare, etc.),
 * la IP real viene en "x-forwarded-for". En desarrollo local suele
 * venir vacía, así que devolvemos un valor de respaldo.
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown-ip";
}