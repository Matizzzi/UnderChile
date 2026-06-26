/**
 * Verifica un token de Cloudflare Turnstile contra la API oficial.
 * Esto SIEMPRE se hace en el servidor — el token que manda el navegador
 * nunca es confiable por sí solo, hay que confirmarlo con Cloudflare.
 */
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("⚠️ TURNSTILE_SECRET_KEY no está configurada en .env");
    return process.env.NODE_ENV !== "production";
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (e) {
    console.error("Error verificando Turnstile:", e);
    return false;
  }
}