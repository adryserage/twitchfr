import { Pool, type PoolClient } from 'pg';
import dotenv from "dotenv";

dotenv.config();

interface ExtendedPoolClient extends PoolClient {
  lastQuery?: Parameters<PoolClient['query']>;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close a connection after it has been used 7500 times
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('New client connected to database');
});

export async function getClient() {
  const client = await pool.connect() as ExtendedPoolClient;
  const query = client.query;
  const release = client.release;

  const timeout = setTimeout(() => {
    console.error('A client has been checked out for too long.');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);

  client.query = function (this: PoolClient, ...args: Parameters<typeof query>) {
    client.lastQuery = args;
    return query.apply(this, args);
  } as typeof client.query;

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
}

export default pool;
