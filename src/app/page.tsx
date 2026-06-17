import { Title, Text, Container, Box } from "@mantine/core";
import { db } from "@/lib/db"; // Nuestro conector global a Neon
import CitySearch from "@/components/CitySearch"; // Tu buscador interactivo
import classes from "./page.module.css";

export default async function Home() {
  // 🔍 Vamos a Neon a buscar las ciudades activas
  const activeCities = await db.city.findMany({
    select: {
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Transformamos los datos al formato que pide Mantine UI
  const searchOptions = activeCities.map((city) => ({
    value: city.slug,
    label: city.name,
  }));

  return (
    <main className={classes.hero}>
      <Container size="xs" className={classes.content}>
        <Box style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Title order={1} className={classes.mainTitle}>
            UnderChile 🎸
          </Title>
          <Text size="xl" c="dimmed" className={classes.tagline}>
            Descubre las escenas musicales independientes, bandas locales y espacios de tu comuna.
          </Text>
        </Box>

        {/* Renderizamos el buscador del cliente pasándole las comunas de Neon */}
        <CitySearch options={searchOptions} />
      </Container>
    </main>
  );
}