import { Title, Text, Button, SimpleGrid, Card, Badge, Group, Stack } from "@mantine/core";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BandFilterSection from "./BandFilterSection";
import classes from "./page.module.css";

interface CityPageProps {
  params: Promise<{ citySlug: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { citySlug } = await params;

  const city = await db.city.findUnique({
    where: { slug: citySlug.toLowerCase() },
    select: {
      name: true,
      bands: { where: { status: "APPROVED" }, select: { id: true } },
      venues: { select: { id: true } },
    },
  });

  if (!city) {
    return { title: "Comuna no encontrada" };
  }

  const description = `Descubre la escena musical independiente de ${city.name}: ${city.bands.length} bandas locales, ${city.venues.length} bares y espacios, y la cartelera de próximos eventos.`;

  return {
    title: `Under ${city.name}`,
    description,
    openGraph: {
      title: `Under ${city.name} 🎸`,
      description,
      url: `/${citySlug}`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { citySlug } = await params;

  const cityData = await db.city.findUnique({
    where: { slug: citySlug.toLowerCase() },
    include: {
      bands: {
        where: { status: "APPROVED" },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      },
      venues: true,
      events: {
        include: {
          venue: true,
        },
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  if (!cityData) {
    return notFound();
  }

  return (
    <main className={classes.container}>
      <header className={classes.header}>
        <Title order={1} className={classes.title}>
          Under {cityData.name} 🎸
        </Title>
        <Text className={classes.subtitle}>
          La vitrina oficial de la música independiente y los espacios locales.
        </Text>
      </header>

      <section style={{ marginBottom: "4rem" }}>
        <Title order={2} size="h2" mb="xl" c="grape">
          Próximas Fechas / Cartelera 📅
        </Title>

        {cityData.events.length === 0 ? (
          <Card padding="lg" radius="md" withBorder style={{ backgroundColor: "#141517", textAlign: "center" }}>
            <Text c="dimmed">No hay eventos agendados para las próximas semanas.</Text>
          </Card>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {cityData.events.map((event) => {
              const eventDate = new Date(event.date).toLocaleDateString("es-CL", {
                weekday: "long",
                day: "numeric",
                month: "long",
              });

              return (
                <Card key={event.id} shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: "#1a1b1e" }}>
                  <Group justify="space-between" mb="xs">
                    <Badge color="grape" variant="filled">
                      {eventDate}
                    </Badge>
                    {event.isFeatured && (
                      <Badge color="yellow" variant="light">Destacado</Badge>
                    )}
                  </Group>

                  <Title order={3} size="h4" c="white" mb="xs">
                    {event.title}
                  </Title>

                  <Stack gap={4} mb="md">
                    <Text size="sm" c="dimmed">
                      📍 Lugar:{" "}
                      <Link
                        href={`/${citySlug}/venues/${event.venue.slug}`}
                        style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}
                      >
                        {event.venue.name}
                      </Link>
                    </Text>
                    <Text size="xs" c="dimmed">
                      {event.venue.address}
                    </Text>
                  </Stack>

                  <Text size="sm" c="gray.5" mb="lg" lineClamp={2}>
                    {event.description || "Sin descripción adicional."}
                  </Text>

                  <Button variant="filled" color="grape" fullWidth mt="auto" radius="md">
                    Adquirir Entradas
                  </Button>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </section>

      <BandFilterSection bands={cityData.bands} citySlug={citySlug} />

      <section style={{ marginBottom: "2rem" }}>
        <Title order={2} size="h2" mb="xl" c="white">
          Espacios & Bares ({cityData.venues.length})
        </Title>

        {cityData.venues.length === 0 ? (
          <Text c="dimmed">No hay locales registrados en esta ciudad todavía.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {cityData.venues.map((venue) => (
              <Card key={venue.id} shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: "#1a1b1e" }}>
                <Text fw={700} size="lg" c="white" mb="xs">{venue.name}</Text>
                <Text size="sm" c="dimmed" mb="md">📍 {venue.address}</Text>

                <Link href={`/${citySlug}/venues/${venue.slug}`} style={{ textDecoration: "none", display: "block", width: "100%" }}>
                  <Button variant="outline" color="gray" fullWidth radius="md">
                    Ver Detalles Espacio
                  </Button>
                </Link>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </section>
    </main>
  );
}