import request from 'supertest';
import {app} from "../src";
import {prismaMock} from "./jest.setup";

describe('PokemonCard API', () => {

    describe('GET /pokemon-cards', () => {
        it('should fetch all PokemonCards', async () => {

            const mockPokemonCards = [
                {
                    id: 1,
                    name: 'Charmander',
                    pokedexId: 4,
                    typeId: 1,
                    lifePoints: 30,
                    size: 1,
                    weight: 25,
                    imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png'
                },
                {
                    id: 2,
                    name: 'Charizard',
                    pokedexId: 6,
                    typeId: 1,
                    lifePoints: 78,
                    size: 1.7,
                    weight: 90.5,
                    imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png'
                }
            ];

            prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

            const response = await request(app).get('/pokemon-cards');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPokemonCards);
        });
    });


    describe('GET /pokemon-cards/:pokemonCardId', () => {
        it('should fetch a PokemonCard by ID', async () => {
            const mockPokemonCard =
                {
                    id: 2,
                    name: 'Charizard',
                    pokedexId: 6,
                    typeId: 1,
                    lifePoints: 78,
                    size: 1.7,
                    weight: 90.5,
                    imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png'
                };

            prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard)

            const response = await request(app).get('/pokemon-cards/2');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPokemonCard);
        });

        it('should return 404 if PokemonCard is not found', async () => {

            prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

            const response = await request(app).get('/pokemon-cards/1');

            expect(response.status).toBe(404);
            expect(response.text).toEqual(`Card not found, Id : "1" doesn't exist :/`);
        });
    });

    /*describe('POST /pokemon-cards', () => {
        it('should create a new PokemonCard', async () => {
            //fausse donnée censée être renvoyée par prisma
            const createdPokemonCard = {
                id: 3,
                name: "Bulbizarre",
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
            };

            // mock de vérif du type
            prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Grass' });

            // mock de vérif du nom
            prismaMock.pokemonCard.findUnique
                .mockResolvedValueOnce(null)   // findUnique par name → pas trouvé
                .mockResolvedValueOnce(null);  // findUnique par pokedexId → pas trouvé

            // mock de la création
            prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

            const response = await request(app)
                .post('/pokemon-cards')
                .set('Authorization', 'Bearer mockedToken')
                .send({
                    name: "Bulbizarre",
                    pokedexId: 1,
                    typeId: 1,
                    lifePoints: 45,
                    size: 0.7,
                    weight: 6.9,
                    imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
                });

            console.log('Response body:', response.body);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdPokemonCard);
        });
    });*/

    /*describe('PATCH /pokemon-cards/:pokemonCardId', () => {
        it('should update an existing PokemonCard', async () => {
            const updatedPokemonCard = {};

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedPokemonCard);
        });
    });

    describe('DELETE /pokemon-cards/:pokemonCardId', () => {
        it('should delete a PokemonCard', async () => {
            expect(response.status).toBe(204);
        });
    });*/
});
