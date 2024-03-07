import { desc, eq } from 'drizzle-orm';

import { transactions } from '../schema/transactions';
import { db } from '../config/database';
import { Client, clients } from '../schema/clients';
import { NewTransaction } from '../services/clients';

export const getClient = async (id: string) => {
  const client = await db
    .select()
    .from(clients)
    .where(eq(clients.id, Number(id)));

  if (client.length === 0) {
    return false;
  }
  return client[0];
};

export const getTransactions = async (client: Client) => {
  const results = await db
    .select()
    .from(transactions)
    .where(eq(transactions.client_id, client.id))
    .orderBy(desc(transactions.realizada_em))
    .limit(10);

  return results;
};

export const insertTransaction = async (
  id: string,
  transaction: NewTransaction,
  client: Client
) => {
  return await db.transaction(async tx => {
    await tx.insert(transactions).values({
      ...transaction,
      client_id: Number(id),
      realizada_em: new Date(),
    });

    await tx
      .update(clients)
      .set({
        saldo:
          transaction.tipo === 'd'
            ? client.saldo - transaction.valor
            : client.saldo + transaction.valor,
      })
      .where(eq(clients.id, Number(id)));
  });
};
