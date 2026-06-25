"use client";

import { useTransition } from "react";
import { Card, Text, Badge, Group, Stack, Anchor, Switch } from "@mantine/core";
import { toggleDestacado } from "./actions";

interface ApprovedBandCardProps {
  band: {
    id: string;
    name: string;
    genre: string[];
    instagramUrl: string | null;
    isFeatured: boolean;
    city: { name: string };
  };
}

export default function ApprovedBandCard({ band }: ApprovedBandCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(() => toggleDestacado(band.id, checked));
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ backgroundColor: "#1a1b1e" }}>
      <Group justify="space-between" align="center">
        <Stack gap={4}>
          <Group gap="xs">
            <Text fw={700} c="white">{band.name}</Text>
            {band.isFeatured && (
              <Badge color="yellow" variant="filled" size="sm">⭐ Destacada</Badge>
            )}
          </Group>
          <Text size="xs" c="dimmed">📍 {band.city.name}</Text>
          <Group gap={5}>
            {band.genre.slice(0, 3).map((g) => (
              <Badge key={g} color="grape" variant="outline" size="xs">{g}</Badge>
            ))}
          </Group>
          {band.instagramUrl && (
            <Anchor href={band.instagramUrl} target="_blank" size="xs" c="pink">
              📸 Instagram
            </Anchor>
          )}
        </Stack>

        <Switch
          checked={band.isFeatured}
          onChange={(e) => handleToggle(e.currentTarget.checked)}
          disabled={isPending}
          color="yellow"
          label="Destacar"
          labelPosition="left"
          styles={{ label: { color: "#fff", fontSize: "0.8rem" } }}
        />
      </Group>
    </Card>
  );
}