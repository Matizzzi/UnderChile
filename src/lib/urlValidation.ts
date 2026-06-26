/**
 * Valida que una URL sea realmente del dominio esperado,
 * parseando la URL de verdad en vez de buscar el texto dentro del string.
 *
 * Esto evita que algo como "https://evil.com/instagram.com-fake"
 * pase la validación solo porque el string "instagram.com" aparece
 * en algún lugar del texto.
 */
function isValidUrlFromDomain(url: string, allowedHosts: string[]): boolean {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    // No es una URL válida en absoluto (ej. le falta el "https://")
    return false;
  }

  // Solo aceptamos http/https — bloquea cosas como "javascript:" o "data:"
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase();
  return allowedHosts.includes(hostname);
}

export function isValidInstagramUrl(url: string): boolean {
  return isValidUrlFromDomain(url, ["instagram.com", "www.instagram.com"]);
}

export function isValidSpotifyUrl(url: string): boolean {
  return isValidUrlFromDomain(url, [
    "open.spotify.com",
    "spotify.com",
    "www.spotify.com",
  ]);
}