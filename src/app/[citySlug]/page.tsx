import { Title, Text, Button, SimpleGrid, Card, Badge, Group, Stack } from "@mantine/core";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link"; // Mantenemos nuestra importación nativa
import classes from "./page.module.css";

interface CityPageProps {
  params: Promise<{ citySlug: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { citySlug } = await params;

  // 🔍 Traemos la comuna con TODO: bandas, bares y sus respectivos eventos
  const cityData = await db.city.findUnique({
    where: { slug: citySlug.toLowerCase() },
    include: {
      bands: true,
      venues: true,
      events: {
        include: {
          venue: true, // Incluimos el bar para saber dónde es el evento
        },
        orderBy: {
          date: "asc", // Los eventos más cercanos primero
        },
      },
    },
  });

  if (!cityData) {
    return notFound();
  }

  return (
    <main className={classes.container}>
      {/* Encabezado */}
      <header className={classes.header}>
        <Title order={1} className={classes.title}>
          Under {cityData.name} 🎸
        </Title>
        <Text className={classes.subtitle}>
          La vitrina oficial de la música independiente y los espacios locales.
        </Text>
      </header>

      {/* SECCIÓN: PRÓXIMOS EVENTOS (CARTELERA) */}
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
                      📍 Lugar: <strong style={{ color: "#fff" }}>{event.venue.name}</strong>
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

      {/* SECCIÓN DE BANDAS LOCALES */}
      <section style={{ marginBottom: "4rem" }}>
        <Title order={2} size="h2" mb="xl" c="white">
          Bandas de la Comuna ({cityData.bands.length})
        </Title>
        
        {cityData.bands.length === 0 ? (
          <Text c="dimmed">No hay bandas registradas en esta ciudad todavía.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {cityData.bands.map((band) => (
              <Card key={band.id} shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: "#1a1b1e" }}>
                <Group justify="space-between" mb="xs">
                  <Text fw={700} size="lg" c="white">{band.name}</Text>
                  {band.isFeatured && (
                    <Badge color="yellow" variant="light">Destacada</Badge>
                  )}
                </Group>

                <Group gap={5} mb="md">
                  {band.genre.map((g) => (
                    <Badge key={g} color="grape" variant="outline" size="sm">{g}</Badge>
                  ))}
                </Group>

                <Text size="sm" c="dimmed" lineClamp={3} mb="md">
                  {band.bio || "Esta banda aún no ha agregado su biografía."}
                </Text>

                {/* 🔥 SOLUCIÓN AQUÍ: Envolvemos el botón con Link de forma nativa e independiente */}
                <Link href={`/${citySlug}/${band.slug}`} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                  <Button 
                    variant="light" 
                    color="grape" 
                    fullWidth 
                    radius="md"
                  >
                    Ver Perfil Banda
                  </Button>
                </Link>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </section>

      {/* SECCIÓN DE LOCALES / VENUES */}
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
                
                <Button variant="outline" color="gray" fullWidth mt="auto" radius="md">
                  Ver Detalles Espacio
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </section>
    </main>
  );
}