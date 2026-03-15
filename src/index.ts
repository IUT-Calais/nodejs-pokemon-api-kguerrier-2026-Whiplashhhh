import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import {cardRouter} from "./cards/pokemon-cards.router";
import {usersRouter} from "./user/users.router";

export const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

export let server: ReturnType<typeof app.listen>;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log(`Serveur started on port ${port}`);
  });
}

app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Requête reçue : ${req.method} ${req.url}`);
  next(); // Passe à la prochaine fonction middleware ou route
});

app.use('/pokemon-cards', cardRouter);
app.use('/users', usersRouter);

export function stopServer() {
  if (server) server.close();
}
