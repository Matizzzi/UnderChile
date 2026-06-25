"use client";

import { useState, useMemo } from "react";
import { Title, Text, SimpleGrid, Card, Badge, Group, Button, Select } from "@mantine/core";
import Link from "next/link";

interface Band {
  id: string;
  name: string;
  slug: string;
  genre: string[];
  bio: string | null;
  isFeatured: boolean;
}

interface BandFilterSectionProps {
  bands: Band[];
  citySlug: string;
}

export default function BandFilterSection({ bands, citySlug }: BandFilterSectionProps) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const generosDisponibles = useMemo(() => {
    const set = new Set<string>();
    bands.forEach((band) => band.genre.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [bands]);

  const bandasFiltradas = useMemo(() => {
    if (!selectedGenre) return bands;
    return bands.filter((band) => band.genre.includes(selectedGenre));
  }, [bands, selectedGenre]);

  return (
    <section style={{ marginBottom: "4rem" }}>
      <Group justify="space-between" align="center" mb="md" wrap="wrap">
        <Title order={2} size="h2" c="white">
          Bandas de la Comuna ({bandasFiltradas.length})
        </Title>
        <Button component={Link} href={`/${citySlug}/postula`} variant="outline" color="grape" radius="md">
          + Postula tu Banda
        </Button>
      </Group>

      {generosDisponibles.length > 0 && (
        <Select
          placeholder="Filtrar por género"
          data={generosDisponibles}
          value={selectedGenre}
          onChange={setSelectedGenre}
          clearable
          mb="xl"
          maw={280}
          styles={{
            input: { backgroundColor: "#1a1b1e", color: "#fff", borderColor: "#2c2e33" },
            dropdown: { backgroundColor: "#1a1b1e", borderColor: "#2c2e33" },
            option: { color: "#fff" },
          }}
        />
      )}

      {bandasFiltradas.length === 0 ? (
        <Text c="dimmed">
          {selectedGenre
            ? `No hay bandas del género "${selectedGenre}" en esta comuna todavía.`
            : "No hay bandas registradas en esta ciudad todavía."}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {bandasFiltradas.map((band) => (
            <Card key={band.id} shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: "#1a1b1e" }}>
              <Group justify="space-between" mb="xs">
                <Text fw={700} size="lg" c="white">{band.name}</Text>
                {band.isFeatured && (
                  <Badge color="yellow" variant="light">⭐ Destacada</Badge>
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

              <Link href={`/${citySlug}/${band.slug}`} style={{ textDecoration: "none", display: "block", width: "100%" }}>
                <Button variant="light" color="grape" fullWidth radius="md">
                  Ver Perfil Banda
                </Button>
              </Link>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </section>
  );
}