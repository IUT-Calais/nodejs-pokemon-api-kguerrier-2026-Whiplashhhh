import {Router} from "express";
import {postUsers, getUsers, getUser, loginUsers, patchUser, deleteUser} from "./users.controller";
import {verifyJWT} from "../common/auth.middleware";

export const usersRouter = Router();

//##### GET #####
//avoir la liste des users
usersRouter.get('/', getUsers)
//avoir les infos d'un utilisateur
usersRouter.get('/:userId', getUser)
//##### POST #####
//créer un user
usersRouter.post('/', postUsers);
//login
usersRouter.post('/login', loginUsers)
//##### PATCH #####
//modifier un utilisateur
usersRouter.patch('/:userId', verifyJWT, patchUser)
//##### DELETE #####
//supprimer un utilisateur
usersRouter.delete('/:userId', verifyJWT, deleteUser)