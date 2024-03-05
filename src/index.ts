import express, { type Application } from 'express';
import { db } from './database';
import { type Client, clients } from './schema/clients';

const PORT = process.env.PORT || 8080;
const container_id = process.env.HOSTNAME;

const app: Application = express();

app.get('/', async (_req, res) => {
  await db
    .select()
    .from(clients)
    .then((clients: Client[]) => {
      res.send({
        message: `Hello from ${container_id}! Clients: ${JSON.stringify(
          clients
        )}`,
      });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${container_id}`);
});
