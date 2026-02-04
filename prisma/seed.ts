import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemonCard.deleteMany()
  await prisma.type.deleteMany();

  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Charmander',
      pokedexId: 4,
      type: { connect: { name: 'Fire'}},
      lifePoints: 30,
      size: 1,
      weight: 25,
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png'
    }
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Charizard',
      pokedexId: 6,
      type: { connect: { name: 'Fire'}},
      lifePoints: 78,
      size: 1.7,
      weight: 90.5,
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png'
    }
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
