import { Container, Title, Text, SimpleGrid, Button, Group, Divider, Stack } from "@mantine/core";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { logoutAdmin } from "./login/actions";
import { redirect } from "next/navigation";
import BandModerationCard from "./BandModerationCard";
import ApprovedBandCard from "./ApprovedBandCard";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const [pendientes, rechazadas, aprobadas] = await Promise.all([
    db.band.findMany({
      where: { status: "PENDING" },
      include: { city: true },
      orderBy: { createdAt: "asc" },
    }),
    db.band.findMany({
      where: { status: "REJECTED" },
      include: { city: true },
      orderBy: { createdAt: "desc" },
    }),
    db.band.findMany({
      where: { status: "APPROVED" },
      include: { city: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    }),
  ]);

  return (
    <Container size="md" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
      <Group justify="space-between" align="center" mb="xl">
        <Title order={1} c="white">Panel de Moderación 🛡️</Title>
        <form action={logoutAdmin}>
          <Button type="submit" variant="subtle" color="gray" radius="md">
            Cerrar sesión
          </Button>
        </form>
      </Group>

      <Title order={2} size="h3" c="yellow" mb="md">
        Postulaciones Pendientes ({pendientes.length})
      </Title>

      {pendientes.length === 0 ? (
        <Text c="dimmed" mb="xl">No hay postulaciones pendientes por revisar. 🎉</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="xl">
          {pendientes.map((band) => (
            <BandModerationCard key={band.id} band={band} />
          ))}
        </SimpleGrid>
      )}

      <Divider color="#2c2e33" my="xl" />

      <Title order={2} size="h3" c="grape" mb="xs">
        Bandas Aprobadas — Destacados ({aprobadas.length})
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Activa el interruptor para que una banda aparezca destacada (⭐) primero en su comuna.
      </Text>

      {aprobadas.length === 0 ? (
        <Text c="dimmed" mb="xl">Todavía no hay bandas aprobadas.</Text>
      ) : (
        <Stack gap="sm" mb="xl">
          {aprobadas.map((band) => (
            <ApprovedBandCard key={band.id} band={band} />
          ))}
        </Stack>
      )}

      <Divider color="#2c2e33" my="xl" />

      <Title order={2} size="h3" c="red" mb="md">
        Rechazadas ({rechazadas.length})
      </Title>

      {rechazadas.length === 0 ? (
        <Text c="dimmed">No hay bandas rechazadas.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {rechazadas.map((band) => (
            <BandModerationCard key={band.id} band={band} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}