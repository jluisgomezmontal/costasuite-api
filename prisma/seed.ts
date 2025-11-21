import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar base de datos
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleaned');

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const hashedAgentPassword = await bcrypt.hash('agent123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@costasuite.com',
      password: hashedPassword,
      name: 'Admin CostaSuite',
      role: 'admin' as any,
    },
  });

  const agent1 = await prisma.user.create({
    data: {
      email: 'agent1@costasuite.com',
      password: hashedAgentPassword,
      name: 'Carlos Méndez',
      role: 'agent' as any,
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      email: 'agent2@costasuite.com',
      password: hashedAgentPassword,
      name: 'María González',
      role: 'agent' as any,
    },
  });

  console.log('✅ Users created');

  // Crear propiedades
  const properties = [
    // Propiedades en RENTA
    {
      title: 'Departamento Moderno con Vista al Mar',
      description:
        'Hermoso departamento completamente amueblado con vista panorámica a la bahía de Acapulco. Ubicado en la zona dorada, cerca de restaurantes y vida nocturna. Ideal para estadías largas o vacaciones.',
      type: 'rent',
      status: 'available',
      price: 15000,
      location: {
        address: 'Av. Costera Miguel Alemán 121',
        city: 'Acapulco',
        state: 'Guerrero',
        country: 'México',
        postalCode: '39670',
        coordinates: {
          lat: 16.8531,
          lng: -99.8237,
        },
      },
      features: {
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        parkingSpots: 1,
        yearBuilt: 2018,
      },
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      ],
      amenities: [
        'Aire acondicionado',
        'WiFi',
        'Piscina',
        'Gimnasio',
        'Seguridad 24/7',
        'Balcón',
        'Vista al mar',
      ],
      ownerId: agent1.id,
    },
    {
      title: 'Casa Vacacional en Barra Vieja',
      description:
        'Acogedora casa de playa perfecta para familias. A solo 50 metros de la playa de Barra Vieja. Cuenta con amplio jardín y parrilla. Ambiente tranquilo y relajado lejos del bullicio de la ciudad.',
      type: 'rent',
      status: 'available',
      price: 8000,
      location: {
        address: 'Calle Playa Barra Vieja s/n',
        city: 'Acapulco',
        state: 'Guerrero',
        country: 'México',
        postalCode: '39931',
        coordinates: {
          lat: 16.7842,
          lng: -99.6952,
        },
      },
      features: {
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        parkingSpots: 2,
        yearBuilt: 2015,
      },
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      ],
      amenities: [
        'Jardín',
        'Parrilla',
        'WiFi',
        'Cocina equipada',
        'Cerca de la playa',
        'Estacionamiento',
      ],
      ownerId: agent2.id,
    },

    // Propiedades en VENTA
    {
      title: 'Residencia de Lujo en Las Brisas',
      description:
        'Espectacular residencia en la exclusiva zona de Las Brisas con vistas impresionantes a la bahía. Cuenta con diseño contemporáneo, acabados de primera calidad y espacios amplios. Incluye alberca infinity y jacuzzi.',
      type: 'sale',
      status: 'available',
      price: 12500000,
      location: {
        address: 'Carretera Escénica Las Brisas 245',
        city: 'Acapulco',
        state: 'Guerrero',
        country: 'México',
        postalCode: '39868',
        coordinates: {
          lat: 16.8311,
          lng: -99.8947,
        },
      },
      features: {
        bedrooms: 5,
        bathrooms: 6,
        area: 450,
        parkingSpots: 4,
        yearBuilt: 2020,
      },
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      ],
      amenities: [
        'Alberca infinity',
        'Jacuzzi',
        'Gimnasio privado',
        'Cava de vinos',
        'Terraza con vista',
        'Smart home',
        'Seguridad 24/7',
        'Jardín',
        'Estudio',
      ],
      ownerId: agent1.id,
    },
    {
      title: 'Condominio Frente al Mar - Zona Diamante',
      description:
        'Elegante condominio en el corazón de la Zona Diamante. Construcción reciente con todas las amenidades modernas. Perfecto para inversión o residencia principal. Acceso directo a playa privada.',
      type: 'sale',
      status: 'available',
      price: 6800000,
      location: {
        address: 'Blvd. de las Naciones 1200',
        city: 'Acapulco',
        state: 'Guerrero',
        country: 'México',
        postalCode: '39906',
        coordinates: {
          lat: 16.7947,
          lng: -99.7522,
        },
      },
      features: {
        bedrooms: 3,
        bathrooms: 3,
        area: 180,
        parkingSpots: 2,
        yearBuilt: 2021,
      },
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
      ],
      amenities: [
        'Playa privada',
        'Piscina',
        'Cancha de tenis',
        'Gimnasio',
        'Spa',
        'Restaurante',
        'Seguridad 24/7',
        'Balcón amplio',
        'Vista al mar',
      ],
      ownerId: agent2.id,
    },
    {
      title: 'Casa Colonial en Centro Histórico',
      description:
        'Encantadora casa colonial restaurada en el centro de Acapulco Tradicional. Arquitectura original conservada con modernizaciones inteligentes. Ideal para hotel boutique o residencia con historia.',
      type: 'sale',
      status: 'available',
      price: 4200000,
      location: {
        address: 'Calle Benito Juárez 89, Centro',
        city: 'Acapulco',
        state: 'Guerrero',
        country: 'México',
        postalCode: '39300',
        coordinates: {
          lat: 16.8631,
          lng: -99.8825,
        },
      },
      features: {
        bedrooms: 4,
        bathrooms: 3,
        area: 320,
        parkingSpots: 2,
        yearBuilt: 1950,
      },
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc',
      ],
      amenities: [
        'Arquitectura colonial',
        'Patio central',
        'Fuente',
        'Cocina tradicional',
        'Techos altos',
        'Pisos de barro',
        'Balcones',
        'Cerca del Zócalo',
      ],
      ownerId: agent1.id,
    },
  ];

  for (const propertyData of properties) {
    await prisma.property.create({
      data: propertyData as any,
    });
  }

  console.log('✅ Properties created');
  console.log('\n📊 Seed Summary:');
  console.log(`   - 1 Admin user`);
  console.log(`   - 2 Agent users`);
  console.log(`   - 2 Properties for rent`);
  console.log(`   - 3 Properties for sale`);
  console.log('\n👤 Login credentials:');
  console.log('   Admin:  admin@costasuite.com  / admin123');
  console.log('   Agent1: agent1@costasuite.com / agent123');
  console.log('   Agent2: agent2@costasuite.com / agent123');
  console.log('\n🌱 Seed completed successfully! 🎉\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
