import type {Request, Response} from 'express';
import prisma from "../../client";

//########## GET ##########
/**
 * Récupère la liste de toutes les cartes
 */
export const getCards = async (_req: Request, res: Response) => {
    try {
        let cards = await prisma.pokemonCard.findMany();
        res.status(200).send(cards);
    } catch (error) {
        res.status(500).send({ error : 'Une erreur est survenue'});
    }
}
/**
 * Récupère une carte spécifique avec son Id
 */
export const getPokemon = async (req: Request, res: Response) => {
    let cardId = parseInt(<string>req.params.pokemonCardId)
    try {
        const card = await prisma.pokemonCard.findUnique({
            where: {
                id: cardId
            }
        });
        if (!card) { // si la carte n'existe pas
            res.status(404).send("Card not found :/")
            return
        } else { // sinon
            res.status(200).send(card);
        }
    } catch (error) {
        res.status(500).send({ error : 'Une erreur est survenue'});
    }
}

//########## POST ##########
/**
 * Crée une carte Pokemon
 */
export const postPokemon = async (req: Request, res: Response) => {
    //récupérer les données du body (json)
    const {name, pokedexId, typeId, lifePoints, size, weight, imageUrl} = req.body

    try {
        const createdPokemon = await prisma.pokemonCard.create({
            data: {
                name: name,
                pokedexId: pokedexId,
                typeId: typeId,
                lifePoints: lifePoints,
                size: size,
                weight: weight,
                imageUrl: imageUrl
            }
        })
        res.status(201).send(createdPokemon)
    } catch (error) {
        res.status(500).send({ error : 'Une erreur est survenue'});
    }
}

//########## PATCH ##########
/**
 * Modifie les données d'une carte
 */
export const patchPokemon = async (req: Request, res: Response) => {
    //vérifier si la carte existe
    let cardId = parseInt(<string>req.params.pokemonCardId)

    try {
        const card = await prisma.pokemonCard.findUnique({
            where: {
                id: cardId
            }
        });
        if (!card) {
            res.status(404).send("Card not found :/")
        } else {
            //récupérer les données du body (json)
            const {name, pokedexId, typeId, lifePoints, size, weight, imageUrl} = req.body

            //les modifier sur la bonne carte
            const updatedCard = await prisma.pokemonCard.update({
                where: {
                    id: cardId
                },
                data: {
                    name: name,
                    pokedexId: pokedexId,
                    typeId: typeId,
                    lifePoints: lifePoints,
                    size: size,
                    weight: weight,
                    imageUrl: imageUrl
                }
            })
            res.status(200).send(updatedCard);
        }
    } catch (error) {
        res.status(500).send({ error : 'Une erreur est survenue'});
    }
}