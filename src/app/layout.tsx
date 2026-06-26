import type { Metadata } from "next";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://underchile.cl"),
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
        {/* Dejamos esto limpio. Recuerda que el script reside de forma segura en head.tsx */}
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}