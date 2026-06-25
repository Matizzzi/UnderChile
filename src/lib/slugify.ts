/**
 * Convierte un nombre de banda en un slug URL-friendly.
 * Ej: "Los Marinos del Puerto!" -> "los-marinos-del-puerto"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes (á -> a, ñ se mantiene aparte)
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s-]/g, "") // quita símbolos raros
    .trim()
    .replace(/\s+/g, "-") // espacios -> guiones
    .replace(/-+/g, "-"); // colapsa guiones repetidos
}

/**
 * Genera un slug único agregando un sufijo numérico si ya existe.
 * Recibe una función que chequea si un slug ya está tomado.
 */
export async function generateUniqueSlug(
  baseName: string,
  isTaken: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(baseName);
  let candidate = base;
  let counter = 2;

  while (await isTaken(candidate)) {
    candidate = `${base}-${counter}`;
    counter++;
  }

  return candidate;
}