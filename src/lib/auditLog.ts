import { db } from "@/lib/db";

interface LogActionParams {
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  details?: string;
}

/**
 * Registra una acción de moderación en el log de auditoría.
 * No lanza error si falla — un fallo en el log nunca debería
 * bloquear la acción principal (aprobar/rechazar sigue funcionando
 * aunque, por algún motivo raro, no se pueda escribir el log).
 */
export async function logAction({
  action,
  targetType,
  targetId,
  targetName,
  details,
}: LogActionParams): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        action,
        targetType,
        targetId,
        targetName,
        details,
      },
    });
  } catch (e) {
    console.error("⚠️ No se pudo escribir el log de auditoría:", e);
  }
}