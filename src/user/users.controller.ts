import type { Request, Response } from 'express';
import prisma from "../client";
import bcrypt from 'bcrypt'

//########## GET ##########
/**
 * Récupère la liste de tous les users
 */
export const getUsers = async (_req: Request, res: Response) => {
    try {
        let users = await prisma.user.findMany();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error : 'An error occured :/'})
    }
}

//########## POST ##########
/**
 * Créer un user
 */
export const postUsers = async (req: Request, res: Response) => {
    //récupérer les données du body
    const {email, password} = req.body;

    try {
        if (!email || !password) {
            res.status(400).send(`Mail or password is missing :/`);
            return
        }
        const usersEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (usersEmail) {
            res.status(400).send(`Email "${email}" is already taken :/`);
            return
        }
        if (password.length < 6) {
            res.status(400).send(`Password should be at least 6 character long`)
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userToCreate = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })
        res.status(201).send(userToCreate)
    } catch (error) {
        res.status(500).send({ error : 'An error occured :/'})
    }
}