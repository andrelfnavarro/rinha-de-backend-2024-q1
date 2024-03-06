import express, { Request, Response } from 'express';
import { desc, eq } from 'drizzle-orm';
import Ajv, { JSONSchemaType } from 'ajv';

import { clients } from '../schema/clients';
import { transactions } from '../schema/transactions';
import { db } from '../config/database';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
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

  if (!id) {
    return res.status(404).send({
      message: 'Client not found',
    });
  }

  const foundClients = await db
    .select()
    .from(clients)
    .where(eq(clients.id, Number(id)));

  if (foundClients.length === 0) {
    return res.status(404).send({
      message: 'Client not found',
    });
  }

  const client = foundClients[0];

  console.log(client);

  const lastTransactions = await db
    .select()
    .from(transactions)
    // .where(eq(transactions.client_id, client.id))
    .orderBy(desc(transactions.realizada_em))
    .limit(10);

  console.log(lastTransactions);

  res.status(200).send({
    saldo: {
      total: client.saldo,
      data_extrato: new Date(),
      limite: client.limite,
    },
    ultimas_transacoes: lastTransactions.map(
      ({ valor, tipo, descricao, realizada_em }) => ({
        valor,
        tipo,
        descricao,
        realizada_em,
      })
    ),
  });
});

const ajv = new Ajv();

type NewTransaction = {
  valor: number;
  tipo: 'd' | 'c';
  descricao: string;
};

const clientTransactionSchema: JSONSchemaType<NewTransaction> = {
  type: 'object',
  properties: {
    valor: { type: 'integer' },
    tipo: { type: 'string', enum: ['d', 'c'] },
    descricao: { type: 'string', minLength: 1, maxLength: 10 },
  },
  required: ['valor', 'tipo', 'descricao'],
  additionalProperties: false,
};

router.post('/:id/transacoes', async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(req.body);

  if (!id) {
    return res.status(404).send({
      message: 'Client not found',
    });
  }

  const validateNewTransaction = ajv.compile(clientTransactionSchema);

  const valid = validateNewTransaction(req.body);

  if (!valid) {
    return res.status(400).send({
      message: 'Invalid transaction',
      errors: validateNewTransaction.errors,
    });
  }

  const foundClients = await db
    .select()
    .from(clients)
    .where(eq(clients.id, Number(id)));

  if (foundClients.length === 0) {
    return res.status(404).send({
      message: 'Client not found',
    });
  }

  const { valor, tipo, descricao } = req.body;

  const client = foundClients[0];

  await db.transaction(async tx => {
    await tx.insert(transactions).values({
      valor,
      tipo,
      descricao,
      client_id: Number(id),
      realizada_em: new Date(),
    });

    await tx.transaction(async tx2 => {
      await tx2
        .update(clients)
        .set({
          saldo: tipo === 'd' ? client.saldo - valor : client.saldo + valor,
        })
        .where(eq(clients.id, Number(id)));
    });
  });

  res.status(200).send({
    limite: client.limite,
    saldo: tipo === 'd' ? client.saldo - valor : client.saldo + valor,
  });
});

export default router;
