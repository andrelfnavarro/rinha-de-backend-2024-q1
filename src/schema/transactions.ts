import {
  pgTable,
  serial,
  integer,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const transactions = pgTable('clients', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').notNull(),
  valor: integer('valor').notNull(),
  tipo: varchar('tipo', {
    length: 1,
  }).notNull(),
  descricao: varchar('descricao', {
    length: 10,
  }).notNull(),
  realizada_em: timestamp('realizada_em').notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
