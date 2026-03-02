import { Router } from 'express'
import {deletePokemon, getCards, getPokemon, patchPokemon, postPokemon} from "./pokemon-cards.controller";
import {verifyJWT} from "./pokemon-cards.middleware";

export const cardRouter = Router();

//##### GET #####
// avoir toutes les cartes
cardRouter.get('/', getCards);
// avoir une carte spécifique
cardRouter.get('/:pokemonCardId', getPokemon)

//##### POST #####
// créer une carte
cardRouter.post('/', verifyJWT, postPokemon)

//##### PATCH #####
// modifier les données d'une carte
cardRouter.patch('/:pokemonCardId', verifyJWT, patchPokemon)

//##### DELETE ######
// supprimer une carte
cardRouter.delete('/:pokemonCardId', verifyJWT, deletePokemon)