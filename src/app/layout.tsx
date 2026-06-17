import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css"; // Estilos base de Mantine
import "./globals.css"; // Tus estilos globales

export const metadata: Metadata = {
  title: "UnderChile | Escenas Musicales Locales",
  description: "La plataforma de la música independiente chilena.",
};

const theme = createTheme({
  primaryColor: "grape", // Nuestro color violeta nocturno
  fontFamily: "sans-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 🔥 Agregamos suppressHydrationWarning aquí para que Next.js no reclame por el script de Mantine
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Dejamos el script obligatorio bien configurado */}
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}