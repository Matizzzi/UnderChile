import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Pool de conexión nativo exigido en Prisma 7
const connectionString = "postgresql://neondb_owner:npg_JjLeYW1A4Ibs@ep-divine-cherry-atnjx9sl.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Inicializamos el cliente apuntando al adaptador
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🦅 Iniciando la inyección de la cartelera REAL de Cuervo Bar...');

  // Limpieza total previa en orden relacional para evitar duplicados
  await prisma.event.deleteMany({});
  await prisma.band.deleteMany({});
  await prisma.venue.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.region.deleteMany({});

  // 1. Crear Región Metropolitana
  const regionRM = await prisma.region.create({
    data: { name: 'Región Metropolitana' }
  });

  // 2. Crear Comuna: Melipilla
  const melipilla = await prisma.city.create({
    data: {
      name: 'Melipilla',
      slug: 'melipilla',
      regionId: regionRM.id
    }
  });

  // 3. Crear el Espacio Físico Real: Cuervo Bar 🍻 (¡CORREGIDO!)
  const cuervoBar = await prisma.venue.create({
    data: {
      name: 'Cuervo Bar',
      slug: 'cuervo-bar',
      address: 'Merced #666, Melipilla', // Dirección del afiche
      mapsUrl: 'https://maps.google.com',
      cityId: melipilla.id // 🔥 ¡Aquí estaba el error! Cableado con éxito a Melipilla
    }
  });

  // 4. Inyectar las Bandas Reales del ecosistema Cuervo Bar ⚡
  const stixxy = await prisma.band.create({
    data: {
      name: 'Stixxy',
      slug: 'stixxy',
      genre: ['Glam Rock', 'Hard Rock'],
      bio: 'Puro rock, actitud, cuero y distorsión directo a las venas encendiendo la noche melipillana.',
      instagramUrl: 'https://www.instagram.com/stixxy.glam', // Link real del afiche
      cityId: melipilla.id,
      isFeatured: true
    }
  });

  const nuevaCultura = await prisma.band.create({
    data: {
      name: 'La Nueva Cultura',
      slug: 'la-nueva-cultura',
      genre: ['Tributo', 'Rock Latino'],
      bio: 'Agrupación melipillana encargada de revivir los más grandes e imperecederos himnos del rock en español.',
      instagramUrl: 'https://www.instagram.com/la.nueva.cultura.ig.oficial', // Link real
      cityId: melipilla.id
    }
  });

  // 5. Inyectar la Cartelera Oficial de la fecha real del afiche 📅
  await prisma.event.create({
    data: {
      title: 'Stixxy + La Nueva Cultura en Vivo 🚀',
      description: 'Gran noche de Rock con Entrada Liberada en Bar El Cuervo. Cierra la noche el tremendo tributo al Rock Latino con invitado especial Zuko Benzi.',
      date: new Date('2026-06-20T21:00:00Z'), // Sábado 20 de Junio, 21:00 hrs
      cityId: melipilla.id,
      venueId: cuervoBar.id
    }
  });

  console.log('✅ ¡Cartelera real de @cuervo_bar_ inyectada con éxito en Neon!');
}

main()
  .catch((e) => {
    console.error('❌ Error inyectando los datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Cierre seguro de conexiones
    await prisma.$disconnect();
    await pool.end();
  });