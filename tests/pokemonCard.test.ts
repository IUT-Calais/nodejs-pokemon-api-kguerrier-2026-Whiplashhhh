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

    describe('POST /pokemon-cards', () => {
        it('should create a new PokemonCard', async () => {
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

            //vérif du type
            prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Grass' });

            //vérif du nom
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null)   // par name -> pas trouvé
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);  // par pokedexId -> pas trouvé

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

            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdPokemonCard);
        });
    });

    describe('PATCH /pokemon-cards/:pokemonCardId', () => {
        it('should update an existing PokemonCard', async () => {
            const existingPokemonCard = {
                id: 3,
                name: "Bulbizarre",
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
            };

            const payload = { weight: 7.0 };

            const updatedPokemonCard = {
                ...existingPokemonCard,
                ...payload,
            };

            //la carte existe
            prismaMock.pokemonCard.findUnique.mockResolvedValue(existingPokemonCard);

            //update
            prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

            const response = await request(app)
                .patch('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken')
                .send(payload);


            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedPokemonCard);
        });

        it('should return 404 if PokemonCard does not exist', async () => {
            prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .patch('/pokemon-cards/999')
                .set('Authorization', 'Bearer mockedToken')
                .send({ weight: 7 });

            expect(response.status).toBe(404);
            expect(response.text).toBe(`Card not found, Id : "999" doesn't exist :/`);
        });

        it('should return 404 if typeId does not exist', async () => {
            prismaMock.pokemonCard.findUnique.mockResolvedValue({
                id: 3,
                name: 'Bulbizarre',
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
            });

            prismaMock.type.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .patch('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken')
                .send({ typeId: 999 });

            expect(response.status).toBe(404);
            expect(response.text).toBe(`Type not found, Id : "999" doesn't exist :/`);
        });
    });

    /*describe('DELETE /pokemon-cards/:pokemonCardId', () => {
        it('should delete a PokemonCard', async () => {
            expect(response.status).toBe(204);
        });
    });*/
});
