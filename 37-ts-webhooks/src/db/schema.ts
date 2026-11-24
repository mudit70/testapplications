import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull(),
  status: text("status").notNull(),
});

export const signups = sqliteTable("signups", {
  email: text("email").primaryKey(),
});
