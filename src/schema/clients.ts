import { relations } from 'drizzle-orm';
import { pgTable, serial, integer } from 'drizzle-orm/pg-core';

import { transactions } from './transactions';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  limite: integer('limite').notNull(),
  saldo: integer('saldo').notNull(),
});

export const clientRelations = relations(clients, ({ many }) => ({
  transactions: many(transactions),
}));

export type Client = typeof clients.$inferSelect;
