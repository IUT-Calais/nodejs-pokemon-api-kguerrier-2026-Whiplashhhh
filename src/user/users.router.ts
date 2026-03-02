import {Router} from "express";
import {postUsers, getUsers, loginUsers} from "./users.controller";

export const usersRouter = Router();

//##### GET #####
//avoir la liste des users
usersRouter.get('/', getUsers)
//##### POST #####
//créer un user
usersRouter.post('/', postUsers);
//login
usersRouter.post('/login', loginUsers)