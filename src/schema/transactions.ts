import {
  pgTable,
  serial,
  integer,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { clients } from './clients';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id')
    .notNull()
    .references(() => clients.id),
  valor: integer('valor').notNull(),
  tipo: varchar('tipo', {
    length: 1,
  }).notNull(),
  descricao: varchar('descricao', {
    length: 10,
  }).notNull(),
  realizada_em: timestamp('realizada_em').notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  author: one(clients, {
    fields: [transactions.client_id],
    references: [clients.id],
  }),
}));

export type Transaction = typeof transactions.$inferSelect;
