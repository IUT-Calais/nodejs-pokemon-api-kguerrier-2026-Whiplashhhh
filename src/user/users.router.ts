import {Router} from "express";
import {postUsers, getUsers} from "./users.controller";

export const usersRouter = Router();

//##### GET #####
//avoir la liste des users
usersRouter.get('/', getUsers)
//##### POST #####
//créer un user
usersRouter.post('/', postUsers);