import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'admin',
  password: '123',
  database: 'rinha',
});

const db = drizzle(pool);

export { db };
