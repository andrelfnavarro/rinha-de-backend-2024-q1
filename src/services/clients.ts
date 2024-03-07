import {
  enums,
  integer,
  is,
  min,
  object,
  string,
  size,
  Infer,
} from 'superstruct';

import {
  getClient,
  getTransactions,
  insertTransaction,
} from '../repository/clients';
import { Transaction } from '../schema/transactions';

const clientTransactionSchema = object({
  valor: min(integer(), 0),
  tipo: enums(['d', 'c']),
  descricao: size(string(), 1, 10),
});

export type NewTransaction = Infer<typeof clientTransactionSchema>;

export const getExtrato = async (id: string) => {
  const client = await getClient(id);

  if (!client) {
    return { status: 404, payload: 'Client not found' };
  }

  const transactions: Transaction[] = await getTransactions(client);

  const payload = {
    saldo: {
      total: client.saldo,
      data_extrato: new Date(),
      limite: client.limite,
    },
    ultimas_transacoes: transactions.map(
      ({ valor, tipo, descricao, realizada_em }: Transaction) => ({
        valor,
        tipo,
        descricao,
        realizada_em,
      })
    ),
  };

  return { status: 200, payload };
};

export const postNewTransaction = async (
  id: string,
  transaction: NewTransaction
) => {
  const valid = is(transaction, clientTransactionSchema);

  if (!valid) {
    return { status: 422, payload: 'Input validation error' };
  }

  const client = await getClient(id);

  if (!client) {
    return { status: 404, payload: 'Client not found' };
  }

  const { valor, tipo } = transaction;

  insertTransaction(id, transaction, client);

  return {
    status: 200,
    payload: {
      limite: client.limite,
      saldo: tipo === 'd' ? client.saldo - valor : client.saldo + valor,
    },
  };
};
