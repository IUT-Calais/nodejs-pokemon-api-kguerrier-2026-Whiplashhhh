import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import {cardRouter} from "./routes/cards/pokemons-cards.router";

export const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
export const server = app.listen(port);

app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Requête reçue : ${req.method} ${req.url}`);
  next(); // Passe à la prochaine fonction middleware ou route
});

app.use('/pokemons-cards', cardRouter);

export function stopServer() {
  server.close();
}
