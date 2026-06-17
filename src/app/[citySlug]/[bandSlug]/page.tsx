import { Title, Text, Button, Container, Badge, Group, Card, Stack } from "@mantine/core";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import classes from "./page.module.css";

interface BandPageProps {
  params: Promise<{ citySlug: string; bandSlug: string }>;
}

export default async function BandPage({ params }: BandPageProps) {
  const { citySlug, bandSlug } = await params;

  // 🔍 Vamos a Neon a buscar la banda por su slug único
  const bandData = await db.band.findUnique({
    where: { slug: bandSlug.toLowerCase() },
    include: {
      city: true, // Para saber a qué ciudad pertenece de forma relacional
    },
  });

  // Si la banda no existe, o si se intenta meter en una ciudad que no le corresponde
  if (!bandData || bandData.city.slug !== citySlug.toLowerCase()) {
    return notFound();
  }

  return (
    <Container size="sm" className={classes.container}>
      {/* Botón flotante para volver a la comuna */}
      <Button 
        component={Link} 
        href={`/${citySlug}`} 
        variant="subtle" 
        color="gray" 
        mb="xl"
      >
        ← Volver a Under {bandData.city.name}
      </Button>

      <Card shadow="md" padding="xl" radius="lg" withBorder style={{ backgroundColor: "#1a1b1e" }}>
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1} className={classes.bandName}>
                {bandData.name}
              </Title>
              <Text c="dimmed" size="sm" mt="xs">
                📍 Banda local de {bandData.city.name}
              </Text>
            </div>
            {bandData.isFeatured && (
              <Badge color="yellow" variant="filled" size="lg">Destacada</Badge>
            )}
          </Group>

          {/* Etiquetas de Género */}
          <Group gap="xs" mt="xs">
            {bandData.genre.map((g) => (
              <Badge key={g} color="grape" variant="light" size="md">
                {g}
              </Badge>
            ))}
          </Group>

          <hr style={{ borderColor: "#2c2e33", margin: "1rem 0" }} />

          {/* Biografía de la Banda */}
          <Title order={2} size="h4" c="white">Biografía</Title>
          <Text className={classes.bio}>
            {bandData.bio || "Esta banda aún no ha redactado su biografía oficial."}
          </Text>

          <hr style={{ borderColor: "#2c2e33", margin: "1rem 0" }} />

          {/* Enlaces de Streaming y Redes */}
          <Title order={2} size="h4" c="white" mb="xs">Escuchar & Seguir</Title>
          <SimpleGrid cols={2} spacing="md">
            <Button 
              component="a" 
              href={bandData.spotifyUrl || "#"} 
              target="_blank" 
              disabled={!bandData.spotifyUrl}
              color="green" 
              variant="light"
              radius="md"
            >
              🎵 Spotify
            </Button>
            <Button 
              component="a" 
              href={bandData.instagramUrl || "#"} 
              target="_blank" 
              disabled={!bandData.instagramUrl}
              color="pink" 
              variant="light"
              radius="md"
            >
              📸 Instagram
            </Button>
          </SimpleGrid>
        </Stack>
      </Card>
    </Container>
  );
}