import type { Request, Response } from 'express';
import prisma from "../client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Secret, SignOptions } from 'jsonwebtoken'
import 'dotenv/config'

//########## GET ##########
/**
 * Récupère la liste de tous les users
 */
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
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

/**
 * Permet de se connecter à l'application
 */
export const loginUsers = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        // 1. Vérifier que l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: {email: email}
        });
        if (!user) {
            res.status(401).send({ error : `This user does not exist` })
            return
        }
        // 2. Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(401).send({ error: `Incorrect password` })
            return;
        }
        // 3. Générer le JWT
        const jwtSecret = process.env.JWT_SECRET as Secret
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            jwtSecret,
            { expiresIn: jwtExpiresIn },
        )
        // 4. Retourner le token
        res.status(200).send({
            message: 'Connexion successfull !',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        })
        return
    } catch (error) {
        console.error('Error while login : ', error)
        res.status(500).send({ error: 'An error occured :/'})
        return
    }
}