"use server";

import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { logAction } from "@/lib/auditLog";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    throw new Error("No autorizado.");
  }
}

export async function aprobarBanda(bandId: string) {
  await requireAdmin();

  const band = await db.band.update({
    where: { id: bandId },
    data: { status: "APPROVED" },
  });

  await logAction({
    action: "APPROVE_BAND",
    targetType: "Band",
    targetId: band.id,
    targetName: band.name,
  });

  revalidatePath("/admin");
}

export async function rechazarBanda(bandId: string) {
  await requireAdmin();

  const band = await db.band.update({
    where: { id: bandId },
    data: { status: "REJECTED" },
  });

  await logAction({
    action: "REJECT_BAND",
    targetType: "Band",
    targetId: band.id,
    targetName: band.name,
  });

  revalidatePath("/admin");
}

export async function revertirAPendiente(bandId: string) {
  await requireAdmin();

  const band = await db.band.update({
    where: { id: bandId },
    data: { status: "PENDING" },
  });

  await logAction({
    action: "REVERT_TO_PENDING",
    targetType: "Band",
    targetId: band.id,
    targetName: band.name,
  });

  revalidatePath("/admin");
}

export async function toggleDestacado(bandId: string, nuevoValor: boolean) {
  await requireAdmin();

  const band = await db.band.update({
    where: { id: bandId },
    data: { isFeatured: nuevoValor },
  });

  await logAction({
    action: "TOGGLE_FEATURED",
    targetType: "Band",
    targetId: band.id,
    targetName: band.name,
    details: `isFeatured: ${nuevoValor}`,
  });

  revalidatePath("/admin");
  revalidatePath("/[citySlug]", "page");
}