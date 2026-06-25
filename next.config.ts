import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Evita que el sitio sea incrustado en un iframe ajeno (clickjacking)
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Evita que el navegador "adivine" tipos de archivo distintos al declarado
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Limita cuánta info de referer se filtra al navegar a sitios externos
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Fuerza HTTPS en el navegador una vez visitado por HTTPS (1 año, incluye subdominios)
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Desactiva APIs del navegador que la app no usa (cámara, micrófono, geolocalización)
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Content-Security-Policy: define de dónde se puede cargar cada tipo de recurso.
    // Ajustado para lo que UnderChile usa hoy: Mantine (estilos inline necesarios),
    // y el iframe de Google Maps en la página de venues.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "frame-src 'self' https://www.google.com",
      "connect-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Aplica estos headers a TODAS las rutas del sitio
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;