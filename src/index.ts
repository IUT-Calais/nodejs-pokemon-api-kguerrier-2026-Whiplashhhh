import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import {cardRouter} from "./cards/pokemon-cards.router";
import {usersRouter} from "./user/users.router";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from'path';

export const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

export let server: ReturnType<typeof app.listen>;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log(`Serveur started on port ${port}`);
  });
}

// Swagger
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

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
