import { pgTable, serial, integer } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  limite: integer('limit').notNull(),
  saldo: integer('balance').notNull(),
});

export type Client = typeof clients.$inferSelect;
