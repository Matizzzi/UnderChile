import { Title, Text, Button, Container, Badge, Group, Card, Stack, SimpleGrid } from "@mantine/core";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import classes from "./page.module.css";

interface VenuePageProps {
  params: Promise<{ citySlug: string; venueSlug: string }>;
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { venueSlug } = await params;

  const venue = await db.venue.findUnique({
    where: { slug: venueSlug.toLowerCase() },
    select: {
      name: true,
      address: true,
      city: { select: { name: true } },
      events: { select: { id: true } },
    },
  });

  if (!venue) {
    return { title: "Espacio no encontrado" };
  }

  const description = `${venue.name} en ${venue.address}. ${venue.events.length} eventos agendados en la cartelera de Under ${venue.city.name}.`;

  return {
    title: venue.name,
    description,
    openGraph: {
      title: `${venue.name} | Under ${venue.city.name}`,
      description,
    },
  };
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { citySlug, venueSlug } = await params;

  const venueData = await db.venue.findUnique({
    where: { slug: venueSlug.toLowerCase() },
    include: {
      city: true,
      events: {
        orderBy: { date: "asc" },
      },
    },
  });

  if (!venueData || venueData.city.slug !== citySlug.toLowerCase()) {
    return notFound();
  }

  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    venueData.address
  )}&output=embed`;

  return (
    <Container size="sm" className={classes.container}>
      {/* 🔥 Corregido: Envoltura limpia de navegación para Next.js Server Components */}
      <Link href={`/${citySlug}`} passHref style={{ textDecoration: 'none' }}>
        <Button
          variant="subtle"
          color="gray"
          mb="xl"
        >
          ← Volver a Under {venueData.city.name}
        </Button>
      </Link>

      <Card shadow="md" padding="xl" radius="lg" withBorder style={{ backgroundColor: "#1a1b1e" }}>
        <Stack gap="md">
          <div>
            <Title order={1} className={classes.venueName}>
              {venueData.name}
            </Title>
            <Text c="dimmed" size="sm" mt="xs">
              📍 {venueData.address}
            </Text>
          </div>

          <div className={classes.mapWrapper}>
            <iframe
              src={mapsEmbedUrl}
              width="100%"
              height="280"
              style={{ border: 0, borderRadius: 8 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa de ${venueData.name}`}
            />
          </div>

          {venueData.mapsUrl && (
            <Button
              component="a"
              href={venueData.mapsUrl}
              target="_blank"
              variant="outline"
              color="gray"
              radius="md"
            >
              Abrir en Google Maps
            </Button>
          )}

          <hr style={{ borderColor: "#2c2e33", margin: "1rem 0" }} />

          <Title order={2} size="h4" c="white">
            Próximas Fechas en {venueData.name} 📅
          </Title>

          {venueData.events.length === 0 ? (
            <Text c="dimmed">Este espacio no tiene eventos agendados por ahora.</Text>
          ) : (
            <SimpleGrid cols={1} spacing="md">
              {venueData.events.map((event) => {
                const eventDate = new Date(event.date).toLocaleDateString("es-CL", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                });

                return (
                  <Card key={event.id} padding="lg" radius="md" withBorder style={{ backgroundColor: "#141517" }}>
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

                    <Text size="sm" c="gray.5" lineClamp={3}>
                      {event.description || "Sin descripción adicional."}
                    </Text>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </Stack>
      </Card>
    </Container>
  );
}