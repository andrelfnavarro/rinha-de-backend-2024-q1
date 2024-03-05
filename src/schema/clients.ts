import { pgTable, serial, integer } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  limite: integer('limite').notNull(),
  saldo: integer('saldo').notNull(),
});

export type Client = typeof clients.$inferSelect;
