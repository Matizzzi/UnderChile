"use server";

import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { revalidatePath } from "next/cache";

/**
 * Todas las acciones de moderación re-verifican la sesión de admin
 * en el servidor. Nunca confiamos solo en que el botón esté visible
 * en la UI — si alguien llama la action directamente sin estar
 * autenticado, esto la bloquea.
 */
async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    throw new Error("No autorizado.");
  }
}

export async function aprobarBanda(bandId: string) {
  await requireAdmin();
  await db.band.update({
    where: { id: bandId },
    data: { status: "APPROVED" },
  });
  revalidatePath("/admin");
}

export async function rechazarBanda(bandId: string) {
  await requireAdmin();
  await db.band.update({
    where: { id: bandId },
    data: { status: "REJECTED" },
  });
  revalidatePath("/admin");
}

export async function revertirAPendiente(bandId: string) {
  await requireAdmin();
  await db.band.update({
    where: { id: bandId },
    data: { status: "PENDING" },
  });
  revalidatePath("/admin");
}

export async function toggleDestacado(bandId: string, nuevoValor: boolean) {
  await requireAdmin();
  await db.band.update({
    where: { id: bandId },
    data: { isFeatured: nuevoValor },
  });
  revalidatePath("/admin");
  revalidatePath("/[citySlug]", "page");
}