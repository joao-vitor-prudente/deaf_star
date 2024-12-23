import { type ExtractTablesWithRelations } from "drizzle-orm";
import { type PgTransaction } from "drizzle-orm/pg-core";
import {
  drizzle,
  type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import { env } from "~/env";
import * as schema from "./schema";

let client: Sql;

if (env.NODE_ENV === "production") {
  client = postgres(env.DATABASE_URL);
} else {
  if (!global.client) global.client = postgres(env.DATABASE_URL);
  client = global.client;
}

export const db = drizzle({ client, schema });

export type DB = typeof db;
export type Schema = typeof schema;
export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  Schema,
  ExtractTablesWithRelations<Schema>
>;
