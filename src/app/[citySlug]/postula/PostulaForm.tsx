"use client";

import { useActionState } from "react";
import {
  TextInput,
  Textarea,
  Checkbox,
  Button,
  Stack,
  Alert,
  Text,
  Group,
} from "@mantine/core";
// 1. Quitamos GENRES_DISPONIBLES de la importación del Server Action
import { postularBanda, type PostulaFormState } from "./actions";

interface PostulaFormProps {
  citySlug: string;
  cityName: string;
}

// 2. Definimos los géneros directamente aquí como un arreglo local y seguro
export const GENRES_DISPONIBLES = [
  "Rock",
  "Pop",
  "Punk",
  "Metal",
  "Hardcore",
  "Indie",
  "Hip Hop",
  "Jazz",
  "Blues",
  "Folk"
];

const initialState: PostulaFormState = {};

const inputStyles = {
  input: {
    backgroundColor: "#1a1b1e",
    color: "#fff",
    borderColor: "#2c2e33",
  },
  label: {
    color: "#fff",
  },
};

export default function PostulaForm({ citySlug, cityName }: PostulaFormProps) {
  const boundAction = async (state: PostulaFormState, formData: FormData) => {
    return postularBanda(citySlug, state, formData);
  };

  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  if (state.success) {
    return (
      <Alert color="green" title="¡Postulación enviada! 🎸" radius="md">
        Tu banda quedó registrada para revisión en <strong>{cityName}</strong>.
        Una vez aprobada, va a aparecer públicamente en la cartelera de la comuna.[cite: 1, 4]
        Gracias por sumarte a la escena.
      </Alert>
    );
  }

  return (
    <form action={formAction}>
      <Stack gap="md">
        {state.error && (
          <Alert color="red" title="No se pudo enviar" radius="md">
            {state.error}
          </Alert>
        )}

        <TextInput
          name="name"
          label="Nombre de la banda"
          placeholder="Ej: Stixxy"
          required
          minLength={2}
          styles={inputStyles}
        />

        <Textarea
          name="bio"
          label="Biografía corta"
          placeholder="Cuéntanos sobre tu proyecto: estilo, historia, integrantes..."
          minRows={3}
          maxLength={500}
          styles={inputStyles}
        />

        <div>
          <Text size="sm" fw={500} mb={6} c="white">
            Género(s) musical(es) *
          </Text>
          <Group gap="sm">
            {GENRES_DISPONIBLES.map((g) => (
              <Checkbox key={g} name="genre" value={g} label={g} color="grape" />
            ))}
          </Group>
        </div>

        <TextInput
          name="instagramUrl"
          label="Instagram (opcional)"
          placeholder="https://instagram.com/tu_banda"
          styles={inputStyles}
        />

        <TextInput
          name="spotifyUrl"
          label="Spotify (opcional)"
          placeholder="https://open.spotify.com/..."
          styles={inputStyles}
        />

        <Button type="submit" color="grape" size="md" radius="md" loading={isPending}>
          Enviar Postulación
        </Button>

        <Text size="xs" c="dimmed" ta="center">
          Tu postulación será revisada antes de publicarse. Esto puede tardar unos días.[cite: 1, 4]
        </Text>
      </Stack>
    </form>
  );
}