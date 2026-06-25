import { Container, Title, Text, Button } from "@mantine/core";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostulaForm from "./PostulaForm";
import classes from "./page.module.css";

interface PostulaPageProps {
  params: Promise<{ citySlug: string }>;
}

export default async function PostulaPage({ params }: PostulaPageProps) {
  const { citySlug } = await params;

  const city = await db.city.findUnique({
    where: { slug: citySlug.toLowerCase() },
    select: { name: true, slug: true },
  });

  if (!city) {
    return notFound();
  }

  return (
    <Container size="sm" className={classes.container}>
      {/* 🔥 Corregido: Envolvemos el Button dentro de Link sin usar component={Link} */}
      <Link href={`/${citySlug}`} passHref style={{ textDecoration: 'none' }}>
        <Button variant="subtle" color="gray" mb="xl">
          ← Volver a Under {city.name}
        </Button>
      </Link>

      <Title order={1} className={classes.title}>
        Postula tu Banda 🎤
      </Title>
      <Text c="dimmed" mb="xl">
        ¿Tienes una banda activa en <strong>{city.name}</strong>? Súmate a la cartelera
        oficial de la escena local. Completa el formulario y nuestro equipo revisará tu
        postulación.
      </Text>

      <PostulaForm citySlug={city.slug} cityName={city.name} />
    </Container>
  );
}