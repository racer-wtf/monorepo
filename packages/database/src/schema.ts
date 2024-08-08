import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { nanoid } from "./generators";

export const usersTable = sqliteTable("users", {
  id: text("id").notNull().primaryKey().$defaultFn(nanoid()),
  chainId: integer("chain_id").notNull(),
  address: text("address").notNull(),
});

export type UserTableSelect = typeof usersTable.$inferSelect;

export const sessionsTable = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey().$defaultFn(nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: integer("expires_at").notNull(),
});
