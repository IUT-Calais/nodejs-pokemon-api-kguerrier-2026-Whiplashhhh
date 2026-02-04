import { Router } from 'express'
import {getCards, getPokemon, postPokemon} from "./pokemons-cards.controller";

export const cardRouter = Router();

//##### GET #####
// avoir toutes les cartes
cardRouter.get('/', getCards);
// avoir une carte spécifique
cardRouter.get('/:pokemonCardId', getPokemon)

//##### POST #####
// créer une carte
cardRouter.post('/', postPokemon)