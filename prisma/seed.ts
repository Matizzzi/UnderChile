import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Pool de conexión nativo exigido en Prisma 7
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('❌ Falta DATABASE_URL en tu archivo .env');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Inicializamos el cliente apuntando al adaptador
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🦅 Iniciando la inyección de datos multi-comuna...');

  // Limpieza total previa en orden relacional para evitar duplicados
  await prisma.event.deleteMany({});
  await prisma.band.deleteMany({});
  await prisma.venue.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.region.deleteMany({});

  // ============================================
  // 🏙️ COMUNA 1: MELIPILLA (Región Metropolitana)
  // ============================================
  const regionRM = await prisma.region.create({
    data: { name: 'Región Metropolitana' },
  });

  const melipilla = await prisma.city.create({
    data: {
      name: 'Melipilla',
      slug: 'melipilla',
      regionId: regionRM.id,
    },
  });

  const cuervoBar = await prisma.venue.create({
    data: {
      name: 'Cuervo Bar',
      slug: 'cuervo-bar',
      address: 'Merced #666, Melipilla',
      mapsUrl: 'https://maps.google.com',
      cityId: melipilla.id,
    },
  });

  const stixxy = await prisma.band.create({
    data: {
      name: 'Stixxy',
      slug: 'stixxy',
      genre: ['Glam Rock', 'Hard Rock'],
      bio: 'Puro rock, actitud, cuero y distorsión directo a las venas encendiendo la noche melipillana.',
      instagramUrl: 'https://www.instagram.com/stixxy.glam',
      cityId: melipilla.id,
      isFeatured: true,
    },
  });

  const nuevaCultura = await prisma.band.create({
    data: {
      name: 'La Nueva Cultura',
      slug: 'la-nueva-cultura',
      genre: ['Tributo', 'Rock Latino'],
      bio: 'Agrupación melipillana encargada de revivir los más grandes e imperecederos himnos del rock en español.',
      instagramUrl: 'https://www.instagram.com/la.nueva.cultura.ig.oficial',
      cityId: melipilla.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Stixxy + La Nueva Cultura en Vivo 🚀',
      description:
        'Gran noche de Rock con Entrada Liberada en Bar El Cuervo. Cierra la noche el tremendo tributo al Rock Latino con invitado especial Zuko Benzi.',
      date: new Date('2026-06-20T21:00:00Z'),
      cityId: melipilla.id,
      venueId: cuervoBar.id,
    },
  });

  console.log('✅ Melipilla sembrada.');

  // ============================================
  // 🏙️ COMUNA 2: VALPARAÍSO (Región de Valparaíso)
  // 🔥 PRUEBA DE FUEGO: ciudad nueva, cero código nuevo
  // ============================================
  const regionValpo = await prisma.region.create({
    data: { name: 'Región de Valparaíso' },
  });

  const valparaiso = await prisma.city.create({
    data: {
      name: 'Valparaíso',
      slug: 'valparaiso',
      regionId: regionValpo.id,
    },
  });

  const barFauna = await prisma.venue.create({
    data: {
      name: 'Bar Fauna',
      slug: 'bar-fauna',
      address: 'Cerro Concepción, Valparaíso',
      mapsUrl: 'https://maps.google.com',
      cityId: valparaiso.id,
    },
  });

  const losMarinos = await prisma.band.create({
    data: {
      name: 'Los Marinos del Puerto',
      slug: 'los-marinos-del-puerto',
      genre: ['Cumbia', 'Surf Rock'],
      bio: 'Sonido costero que mezcla cumbia clásica con guitarras de surf rock, directo desde los cerros porteños.',
      instagramUrl: 'https://www.instagram.com/example_losmarinos',
      cityId: valparaiso.id,
      isFeatured: true,
    },
  });

  const ascensorElectrico = await prisma.band.create({
    data: {
      name: 'Ascensor Eléctrico',
      slug: 'ascensor-electrico',
      genre: ['Indie Rock', 'Synth Pop'],
      bio: 'Banda emergente de Valparaíso con sonido nostálgico y letras sobre la vida en el puerto.',
      instagramUrl: 'https://www.instagram.com/example_ascensor',
      cityId: valparaiso.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Noche de Cerro: Los Marinos del Puerto + Ascensor Eléctrico',
      description:
        'Doble cartel porteño en Bar Fauna, con la cumbia surfera de Los Marinos del Puerto y el indie nostálgico de Ascensor Eléctrico.',
      date: new Date('2026-07-04T22:00:00Z'),
      cityId: valparaiso.id,
      venueId: barFauna.id,
    },
  });

  console.log('✅ Valparaíso sembrada.');
  console.log('🎉 ¡Datos multi-comuna inyectados con éxito en Neon!');
}

main()
  .catch((e) => {
    console.error('❌ Error inyectando los datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });