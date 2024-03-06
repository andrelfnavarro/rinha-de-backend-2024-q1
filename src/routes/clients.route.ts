import express, { Request, Response } from 'express';

import { clients } from '../schema/clients';
import { db } from '../config/database';
import { getExtrato, postNewTransaction } from '../services/clients';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  await db
    .select()
    .from(clients)
    .then(clients => {
      res.send({
        message: `Clients: ${JSON.stringify(clients)}`,
      });
    });
});

router.get('/:id/extrato', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getExtrato(id);

  res.status(result.status).send(result.payload);
});

router.post('/:id/transacoes', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).send({
      message: 'Client not found',
    });
  }

  const result = await postNewTransaction(id, req.body);

  return res.status(result.status).send(result.payload);
});

export default router;
