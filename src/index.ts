import express, { type Application } from 'express';

import clientRouter from './routes/clients.route';

const PORT = process.env.PORT || 8080;
const container_id = process.env.HOSTNAME;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/clientes', clientRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${container_id}`);
});
