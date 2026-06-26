// Importamos los componentes planos de la tabla requeridos en Mantine v7+
import { Container, Title, Text, Table, Badge, Button, Group } from "@mantine/core";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import Link from "next/link";

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  APPROVE_BAND: { label: "✓ Aprobada", color: "green" },
  REJECT_BAND: { label: "✕ Rechazada", color: "red" },
  REVERT_TO_PENDING: { label: "↺ Vuelta a Pendiente", color: "yellow" },
  TOGGLE_FEATURED: { label: "⭐ Destacado cambiado", color: "grape" },
};

export default async function AuditLogPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <Container size="md" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
      <Group justify="space-between" align="center" mb="xl">
        <Title order={1} c="white">Historial de Auditoría 📋</Title>
        
        <Link href="/admin" passHref style={{ textDecoration: 'none' }}>
          <Button variant="subtle" color="gray" radius="md">
            ← Volver al Panel
          </Button>
        </Link>
      </Group>

      <Text c="dimmed" size="sm" mb="lg">
        Últimas {logs.length} acciones de moderación registradas, más recientes primero.
      </Text>

      {logs.length === 0 ? (
        <Text c="dimmed">Todavía no hay acciones registradas.</Text>
      ) : (
        <Table striped highlightOnHover verticalSpacing="sm">
          <thead>
            <tr>
              <th>Acción</th>
              <th>Banda</th>
              <th>Detalle</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const actionInfo = ACTION_LABELS[log.action] || {
                label: log.action,
                color: "gray",
              };
              const fecha = new Date(log.createdAt).toLocaleString("es-CL", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={log.id}>
                  <td>
                    <Badge color={actionInfo.color} variant="light">
                      {actionInfo.label}
                    </Badge>
                  </td>
                  <td>
                    <Text size="sm" c="white">{log.targetName}</Text>
                  </td>
                  <td>
                    <Text size="xs" c="dimmed">{log.details || "—"}</Text>
                  </td>
                  <td>
                    <Text size="xs" c="dimmed">{fecha}</Text>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}