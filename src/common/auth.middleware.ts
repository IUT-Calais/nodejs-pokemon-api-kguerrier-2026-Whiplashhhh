import type { NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config'

declare global {
    namespace Express {
        interface Request {
            userId?: number
        }
    }
}
export const verifyJWT = ( req: Request, res: Response, next: NextFunction) => {
    // 1. Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // "Bearer TOKEN"

    if (!token) {
        res.status(401).send({ error: 'Missing token'})
        return
    }
    try {
        // 2. Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number
            email: string
        }
        // 3. Ajouter userId à la requête pour l'utiliser dans les routes
        req.userId = decoded.userId

        // 4. Passer au prochain middleware ou à la route
        next()
    } catch (error) {
        res.status(403).send({ error: `Invalid token` })
        return
    }
}