import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";

// 🔥 Metadata base del sitio. Cada página puede sobreescribir esto
// con su propio generateMetadata() para tener título/descripción únicos.
export const metadata: Metadata = {
  metadataBase: new URL("https://underchile.cl"), // ⚠️ cambia esto por tu dominio real cuando lo tengas
  title: {
    default: "UnderChile | Escenas Musicales Locales",
    template: "%s | UnderChile",
  },
  description:
    "La plataforma de la música independiente chilena. Descubre bandas, bares y eventos locales en tu comuna.",
  openGraph: {
    siteName: "UnderChile",
    type: "website",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const theme = createTheme({
  primaryColor: "grape",
  fontFamily: "sans-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
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