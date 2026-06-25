/**
 * Rate limiter simple en memoria, basado en ventana fija.
 *
 * ⚠️ LIMITACIÓN IMPORTANTE: esto vive en la memoria del proceso de Node.
 * Funciona perfecto en desarrollo y en un servidor único (ej. una VM,
 * o un plan "siempre encendido"). Si en el futuro despliegas en una
 * plataforma serverless con múltiples instancias (como Vercel en su
 * configuración default), cada instancia tendría su propio contador
 * separado, y el límite efectivo podría ser más alto que el configurado.
 * Para ese caso, la solución correcta es un store compartido como
 * Upstash Redis. Por ahora, para el tamaño de UnderChile, esto es
 * suficiente y no agrega infraestructura ni costos nuevos.
 */

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const store = new Map<string, RateLimitEntry>();

// Limpieza periódica para que el Map no crezca indefinidamente en memoria
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > CLEANUP_INTERVAL_MS) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

/**
 * Verifica y registra un intento bajo una clave (normalmente la IP + nombre de acción).
 *
 * @param key Identificador único (ej. "postula-banda:123.45.67.89")
 * @param limit Cantidad máxima de intentos permitidos en la ventana
 * @param windowMs Duración de la ventana en milisegundos
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    const retryAfterSeconds = Math.ceil((windowMs - (now - entry.windowStart)) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}