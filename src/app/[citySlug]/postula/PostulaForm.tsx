"use client";

import { useActionState } from "react";
import Script from "next/script";
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
// 1. IMPORTANTE: Solo importamos la función y el tipo del archivo "use server"
import { postularBanda, type PostulaFormState } from "./actions";

interface PostulaFormProps {
  citySlug: string;
  cityName: string;
}

// 2. Mantenemos el array extendido de géneros de forma local en el cliente
export const GENRES_DISPONIBLES = [
  "Rock",
  "Hard Rock",
  "Glam Rock",
  "Indie Rock",
  "Rock Latino",
  "Punk",
  "Metal",
  "Cumbia",
  "Reggae",
  "Hip Hop / Rap",
  "Electrónica",
  "Synth Pop",
  "Pop",
  "Folk",
  "Tributo",
  "Otro",
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

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (state.success) {
    return (
      <Alert color="green" title="¡Postulación enviada! 🎸" radius="md">
        Tu banda quedó registrada para revisión en <strong>{cityName}</strong>.
        Una vez aprobada, va a aparecer públicamente en la cartelera de la comuna.
        Gracias por sumarte a la escena.
      </Alert>
    );
  }

  return (
    <>
      {/* Script oficial de Cloudflare Turnstile */}
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

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

          {/* Contenedor del widget visual de Turnstile */}
          {turnstileSiteKey && (
            <div className="cf-turnstile" data-sitekey={turnstileSiteKey} style={{ marginTop: "10px" }} />
          )}

          <Button type="submit" color="grape" size="md" radius="md" loading={isPending}>
            Enviar Postulación
          </Button>

          <Text size="xs" c="dimmed" ta="center">
            Tu postulación será revisada antes de publicarse. Esto puede tardar unos días.
          </Text>
        </Stack>
      </form>
    </>
  );
}