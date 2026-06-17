"use client";

import { useState } from "react";
import { Select, Button, Stack } from "@mantine/core";

interface CitySearchProps {
  options: { value: string; label: string }[];
}

export default function CitySearch({ options }: CitySearchProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evitamos que la página parpadee o recargue
    if (selectedCity) {
      console.log("🚀 Redirección forzada e instantánea a:", selectedCity);
      // Usamos el reemplazo de ubicación nativo para forzar el salto del navegador
      window.location.assign(`/${selectedCity}`);
    }
  };

  return (
    // Envolvemos todo en un formulario nativo para que responda al Enter y al clic sin trabas
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack gap="md" mt="xl" style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
        <Select
          label="Selecciona tu ciudad o comuna"
          placeholder="Ej: Melipilla"
          data={options}
          searchable
          clearable
          nothingFoundMessage="Comuna no disponible aún"
          value={selectedCity}
          onChange={(value) => setSelectedCity(value)}
          size="md"
          styles={{
            input: { backgroundColor: '#1a1b1e', color: '#fff', borderColor: '#2c2e33' },
            dropdown: { backgroundColor: '#1a1b1e', borderColor: '#2c2e33' },
            option: { color: '#fff' }
          }}
        />
        
        <Button
          type="submit" // Convertimos el botón en un disparador de formulario nativo
          color="grape"
          size="md"
          fullWidth
          disabled={!selectedCity}
        >
          Explorar Escena Local
        </Button>
      </Stack>
    </form>
  );
}