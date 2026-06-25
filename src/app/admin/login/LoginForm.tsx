"use client";

import { useActionState } from "react";
import { TextInput, Button, Stack, Alert, Title, Container, Card } from "@mantine/core";
import { loginAdmin, type LoginFormState } from "./actions";

const initialState: LoginFormState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <Container size="xs" style={{ paddingTop: "6rem" }}>
      <Card shadow="md" padding="xl" radius="lg" withBorder style={{ backgroundColor: "#1a1b1e" }}>
        <Title order={2} c="white" mb="lg" ta="center">
          Panel de Administración 🔒
        </Title>

        <form action={formAction}>
          <Stack gap="md">
            {state.error && (
              <Alert color="red" radius="md">
                {state.error}
              </Alert>
            )}

            <TextInput
              name="password"
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              required
              autoFocus
              styles={{
                input: { backgroundColor: "#141517", color: "#fff", borderColor: "#2c2e33" },
                label: { color: "#fff" },
              }}
            />

            <Button type="submit" color="grape" fullWidth radius="md" loading={isPending}>
              Ingresar
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}