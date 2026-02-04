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
  await prisma.pokemonCard.create({
    data: {
      name: 'Pikachu',
      pokedexId: 25,
      type: { connect: { name: 'Electric'}},
      lifePoints: 35,
      size: 0.4,
      weight: 6.0,
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png'
    }
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Squirtle',
      pokedexId: 7,
      type: { connect: { name: 'Water'}},
      lifePoints: 44,
      size: 0.5,
      weight: 9.0,
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
    }
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Bulbasaur',
      pokedexId: 1,
      type: { connect: { name: 'Grass'}},
      lifePoints: 45,
      size: 0.7,
      weight: 6.9,
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'
    }
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Gengar',
      pokedexId: 94,
      type: { connect: { name: 'Ghost'}},
      lifePoints: 60,
      size: 1.5,
      weight: 40.5,
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png'
    }
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Dragonite',
      pokedexId: 149,
      type: { connect: { name: 'Dragon'}},
      lifePoints: 91,
      size: 2.2,
      weight: 210.0,
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png'
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
