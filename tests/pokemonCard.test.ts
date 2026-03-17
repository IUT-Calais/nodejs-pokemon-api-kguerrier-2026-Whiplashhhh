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

        it('should return 500 when fetching all PokemonCards fails', async () => {
            prismaMock.pokemonCard.findMany.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/pokemon-cards');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'An error occured :/' });
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

        it('should return 500 when fetching PokemonCard by ID fails', async () => {
            prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/pokemon-cards/2');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'An error occured :/' });
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

        it('should return 400 when required fields are missing', async () => {
            const response = await request(app)
                .post('/pokemon-cards')
                .set('Authorization', 'Bearer mockedToken')
                .send({
                    name: "Bulbizarre",
                    // manque pokedexId, typeId, lifePoints
                });

            expect(response.status).toBe(400);
            expect(response.text).toBe('Some fields are missing !');
        });

        it('should return 400 when name is already taken', async () => {
            const existingCard = {
                id: 1,
                name: "Bulbizarre",
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
            };

            prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Grass' });
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard);  // par name -> trouvé

            const response = await request(app)
                .post('/pokemon-cards')
                .set('Authorization', 'Bearer mockedToken')
                .send({
                    name: "Bulbizarre",
                    pokedexId: 2,
                    typeId: 1,
                    lifePoints: 45,
                    size: 0.7,
                    weight: 6.9,
                    imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
                });

            expect(response.status).toBe(400);
            expect(response.text).toBe(`Name "Bulbizarre" or pokedexId "2" is already taken :/`);
        });

        it('should return 400 when pokedexId is already taken', async () => {
            const existingCard = {
                id: 1,
                name: "Charmander",
                pokedexId: 1,
                typeId: 1,
                lifePoints: 39,
                size: 0.6,
                weight: 8.5,
                imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png"
            };

            prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Fire' });
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);  // par name -> pas trouvé
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard);  // par pokedexId -> trouvé

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

            expect(response.status).toBe(400);
            expect(response.text).toBe(`Name "Bulbizarre" or pokedexId "1" is already taken :/`);
        });

        it('should return 400 when typeId does not exist', async () => {
            prismaMock.type.findUnique.mockResolvedValue(null);  // type inexistant
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);  // par name -> pas trouvé
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);  // par pokedexId -> pas trouvé

            const response = await request(app)
                .post('/pokemon-cards')
                .set('Authorization', 'Bearer mockedToken')
                .send({
                    name: "Bulbizarre",
                    pokedexId: 1,
                    typeId: 999,
                    lifePoints: 45,
                    size: 0.7,
                    weight: 6.9,
                    imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
                });

            expect(response.status).toBe(400);
            expect(response.text).toBe(`Type not found, Id : "999" doesn't exist :/`);
        });

        it('should return 500 when creating PokemonCard fails', async () => {
            prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Grass' });
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);  // par name
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);  // par pokedexId
            prismaMock.pokemonCard.create.mockRejectedValue(new Error('DB error'));

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

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'An error occured :/' });
        });

        it('returns 401 when token is missing', async () => {
            const response = await request(app).post('/pokemon-cards').send({});
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Missing token' });
        });

        it('returns 403 when token is invalid', async () => {
            const response = await request(app)
                .post('/pokemon-cards')
                .set('Authorization', 'Bearer badToken')
                .send({});
            expect(response.status).toBe(403);
            expect(response.body).toEqual({ error: 'Invalid token' });
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

        it('should return 400 when name is already taken by another card', async () => {
            const existingCard = {
                id: 3,
                name: 'Bulbizarre',
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
            };

            const otherCardWithSameName = {
                id: 2,
                name: 'Charizard',
                pokedexId: 6,
                typeId: 1,
                lifePoints: 78,
                size: 1.7,
                weight: 90.5,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png',
            };

            // première vérif: la carte à modifier existe
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard);
            // vérif du nouveau nom: existe déjà
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(otherCardWithSameName);

            const response = await request(app)
                .patch('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken')
                .send({ name: 'Charizard' });

            expect(response.status).toBe(400);
            expect(response.text).toBe(`Name "Charizard" is already taken :/`);
        });

        it('should return 400 when pokedexId is already taken by another card', async () => {
            const existingCard = {
                id: 3,
                name: 'Bulbizarre',
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
            };

            const otherCardWithSamePokedexId = {
                id: 2,
                name: 'Charizard',
                pokedexId: 6,
                typeId: 1,
                lifePoints: 78,
                size: 1.7,
                weight: 90.5,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png',
            };

            // première vérif: la carte à modifier existe
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard);
            // vérif du nouveau pokedexId: existe déjà
            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(otherCardWithSamePokedexId);

            const response = await request(app)
                .patch('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken')
                .send({ pokedexId: 6 });

            expect(response.status).toBe(400);
            expect(response.text).toBe(`pokedexId "6" is already taken :/`);
        });

        it('should allow updating same name if not changing it', async () => {
            const existingCard = {
                id: 3,
                name: 'Bulbizarre',
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
            };

            const updatedCard = {
                ...existingCard,
                weight: 7.0,
            };

            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard);
            prismaMock.pokemonCard.update.mockResolvedValue(updatedCard);

            const response = await request(app)
                .patch('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken')
                .send({ name: 'Bulbizarre', weight: 7.0 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedCard);
        });

        it('should allow updating same pokedexId if not changing it', async () => {
            const existingCard = {
                id: 3,
                name: 'Bulbizarre',
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
            };

            const updatedCard = {
                ...existingCard,
                weight: 7.0,
            };

            prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard);  // vérif carte existe
            prismaMock.pokemonCard.update.mockResolvedValue(updatedCard);

            const response = await request(app)
                .patch('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken')
                .send({ pokedexId: 1, weight: 7.0 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedCard);
        });

        it('should return 500 when updating PokemonCard fails', async () => {
            const existingCard = {
                id: 3,
                name: 'Bulbizarre',
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
            };

            prismaMock.pokemonCard.findUnique.mockResolvedValue(existingCard);
            prismaMock.pokemonCard.update.mockRejectedValue(new Error('DB error'));

            const response = await request(app)
                .patch('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken')
                .send({ weight: 7.0 });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'An error occured :/' });
        });

        it('returns 401 when token is missing', async () => {
            const response = await request(app)
                .patch('/pokemon-cards/3')
                .send({ weight: 7.0 });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Missing token' });
        });

        it('returns 403 when token is invalid', async () => {
            const response = await request(app)
                .patch('/pokemon-cards/3')
                .set('Authorization', 'Bearer badToken')
                .send({ weight: 7.0 });

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ error: 'Invalid token' });
        });
    });

    describe('DELETE /pokemon-cards/:pokemonCardId', () => {
        it('should delete a PokemonCard', async () => {
            const cardToDelete = {
                id: 3,
                name: 'Bulbizarre',
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
            };

            //existe
            prismaMock.pokemonCard.findUnique.mockResolvedValue(cardToDelete);
            prismaMock.pokemonCard.delete.mockResolvedValue(cardToDelete);

            const response = await request(app)
                .delete('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(cardToDelete);
        });

        it('should return 404 if PokemonCard does not exist', async () => {
            prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .delete('/pokemon-cards/999')
                .set('Authorization', 'Bearer mockedToken');

            expect(response.status).toBe(404);
            expect(response.text).toBe(`Card not found, Id : "999" doesn't exist :/`);
        });

        it('should return 500 when finding PokemonCard fails', async () => {
            prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('DB error'));

            const response = await request(app)
                .delete('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'An error occured :/' });
        });

        it('should return 500 when deleting PokemonCard fails', async () => {
            const existingCard = {
                id: 3,
                name: 'Bulbizarre',
                pokedexId: 1,
                typeId: 1,
                lifePoints: 45,
                size: 0.7,
                weight: 6.9,
                imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
            };

            prismaMock.pokemonCard.findUnique.mockResolvedValue(existingCard);
            prismaMock.pokemonCard.delete.mockRejectedValue(new Error('DB error'));

            const response = await request(app)
                .delete('/pokemon-cards/3')
                .set('Authorization', 'Bearer mockedToken');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'An error occured :/' });
        });

        it('returns 401 when token is missing', async () => {
            const response = await request(app).delete('/pokemon-cards/3');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Missing token' });
        });

        it('returns 403 when token is invalid', async () => {
            const response = await request(app)
                .delete('/pokemon-cards/3')
                .set('Authorization', 'Bearer badToken');

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ error: 'Invalid token' });
        });
    });
});
