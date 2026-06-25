"use client";

import { useTransition } from "react";
import { Card, Text, Title, Badge, Group, Button, Stack, Anchor } from "@mantine/core";
import { aprobarBanda, rechazarBanda, revertirAPendiente } from "./actions";

interface BandModerationCardProps {
  band: {
    id: string;
    name: string;
    bio: string | null;
    genre: string[];
    instagramUrl: string | null;
    spotifyUrl: string | null;
    status: string;
    createdAt: Date;
    city: { name: string };
  };
}

export default function BandModerationCard({ band }: BandModerationCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleAprobar = () => startTransition(() => aprobarBanda(band.id));
  const handleRechazar = () => startTransition(() => rechazarBanda(band.id));
  const handleRevertir = () => startTransition(() => revertirAPendiente(band.id));

  const fecha = new Date(band.createdAt).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: "#1a1b1e" }}>
      <Stack gap="sm">
        <Group justify="space-between">
          <div>
            <Text fw={700} size="lg" c="white">{band.name}</Text>
            <Text size="xs" c="dimmed">📍 {band.city.name} · postulada el {fecha}</Text>
          </div>
          <Badge color={band.status === "PENDING" ? "yellow" : "red"} variant="light">
            {band.status === "PENDING" ? "Pendiente" : "Rechazada"}
          </Badge>
        </Group>

        <Group gap={5}>
          {band.genre.map((g) => (
            <Badge key={g} color="grape" variant="outline" size="sm">{g}</Badge>
          ))}
        </Group>

        <Text size="sm" c="gray.4">
          {band.bio || "Sin biografía."}
        </Text>

        <Group gap="md">
          {band.instagramUrl && (
            <Anchor href={band.instagramUrl} target="_blank" size="sm" c="pink">
              📸 Instagram
            </Anchor>
          )}
          {band.spotifyUrl && (
            <Anchor href={band.spotifyUrl} target="_blank" size="sm" c="green">
              🎵 Spotify
            </Anchor>
          )}
        </Group>

        <Group gap="sm" mt="xs">
          {band.status === "PENDING" ? (
            <>
              <Button color="green" radius="md" onClick={handleAprobar} loading={isPending}>
                ✓ Aprobar
              </Button>
              <Button color="red" variant="outline" radius="md" onClick={handleRechazar} loading={isPending}>
                ✕ Rechazar
              </Button>
            </>
          ) : (
            <Button color="yellow" variant="outline" radius="md" onClick={handleRevertir} loading={isPending}>
              ↺ Volver a Pendiente
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
}