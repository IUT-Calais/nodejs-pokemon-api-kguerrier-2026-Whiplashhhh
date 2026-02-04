import type {Request, Response} from 'express';
import prisma from "../../client";

//########## GET ##########
/**
 * liste de toutes les cartes
 */
export const getCards = async (_req: Request, res: Response) => {
    let cards = await prisma.pokemonCard.findMany();
    res.status(200).send(cards);
}
/**
 * Avoir une carte spécifique avec son Id
 */
export const getPokemon = async (req: Request, res: Response) => {
    let cardId = parseInt(<string>req.params.pokemonCardId)
    const card = await prisma.pokemonCard.findUnique({
        where: {
            id: cardId
        }
    });
    if (!card) { // si la carte n'existe pas
        res.status(404).send("Card not found :/")
    } else { // sinon
        res.status(200).send(card);
    }
}