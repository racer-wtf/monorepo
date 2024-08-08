import { drizzle } from "drizzle-orm/libsql";

import { createClient } from "@libsql/client";

import * as schema from "./schema";

export const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || "http://localhost:8080",
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const database = drizzle(client, { schema });

export * from "./schema";
