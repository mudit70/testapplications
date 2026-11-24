import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull(),
  status: text("status").notNull(),
});

export const plan_changes = sqliteTable("plan_changes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subscriptionId: text("subscription_id").notNull(),
});

export const cancellations = sqliteTable("cancellations", {
  subscriptionId: text("subscription_id").primaryKey(),
});

export const payment_failures = sqliteTable("payment_failures", {
  invoiceId: text("invoice_id").primaryKey(),
});

export const signups = sqliteTable("signups", {
  email: text("email").primaryKey(),
});

export const departures = sqliteTable("departures", {
  userId: text("user_id").primaryKey(),
});
