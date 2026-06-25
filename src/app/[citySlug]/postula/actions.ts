"use server";

import { db } from "@/lib/db";
import { generateUniqueSlug } from "@/lib/slugify";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

export type PostulaFormState = {
  error?: string;
  success?: boolean;
};

// 🔒 Rate limit: máximo 3 postulaciones cada 10 minutos por IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export async function postularBanda(
  citySlug: string,
  _prevState: PostulaFormState,
  formData: FormData
): Promise<PostulaFormState> {
  const ip = await getClientIp();
  const rateLimitResult = checkRateLimit(
    `postula-banda:${ip}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS
  );

  if (!rateLimitResult.allowed) {
    const minutos = Math.ceil((rateLimitResult.retryAfterSeconds || 0) / 60);
    return {
      error: `Has enviado demasiadas postulaciones. Intenta de nuevo en ${minutos} minuto(s).`,
    };
  }

  const name = (formData.get("name") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();
  const instagramUrl = (formData.get("instagramUrl") as string)?.trim();
  const spotifyUrl = (formData.get("spotifyUrl") as string)?.trim();
  const genres = formData.getAll("genre") as string[];

  // Validaciones del Servidor
  if (!name || name.length < 2) {
    return { error: "El nombre de la banda debe tener al menos 2 caracteres." };
  }

  if (name.length > 100) {
    return { error: "El nombre de la banda es demasiado largo." };
  }

  if (bio && bio.length > 500) {
    return { error: "La biografía no puede superar los 500 caracteres." };
  }

  if (genres.length === 0) {
    return { error: "Selecciona al menos un género musical." };
  }

  if (instagramUrl && !instagramUrl.includes("instagram.com")) {
    return { error: "El link de Instagram no parece válido." };
  }

  if (spotifyUrl && !spotifyUrl.includes("spotify.com")) {
    return { error: "El link de Spotify no parece válido." };
  }

  // Verificamos que la comuna exista
  const city = await db.city.findUnique({ where: { slug: citySlug } });
  if (!city) {
    return { error: "La comuna seleccionada no existe." };
  }

  // Generamos un slug único
  const slug = await generateUniqueSlug(name, async (candidate) => {
    const existing = await db.band.findUnique({ where: { slug: candidate } });
    return !!existing;
  });

  try {
    await db.band.create({
      data: {
        name,
        slug,
        genre: genres,
        bio: bio || null,
        instagramUrl: instagramUrl || null,
        spotifyUrl: spotifyUrl || null,
        cityId: city.id,
        status: "PENDING",
        isFeatured: false,
      },
    });
  } catch (e) {
    console.error("Error al crear postulación de banda:", e);
    return { error: "Hubo un error al guardar tu postulación. Intenta de nuevo." };
  }

  return { success: true };
}