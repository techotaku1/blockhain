import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connection = postgres(/* connection string or config here */);

export const db = drizzle(connection);
