import { Router } from 'express'
import {getCards, getPokemon} from "./pokemons-cards.controller";

export const cardRouter = Router();

//##### GET #####
// avoir toutes les cartes
cardRouter.get('/', getCards);
// avoir une carte spécifique
cardRouter.get('/:pokemonCardId', getPokemon)