import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
  email: text("email"),
});

export const workspace = sqliteTable("workspace", {
  id: integer("id").primaryKey(),
  slug: text("slug"),
});

export const usersToWorkspaces = sqliteTable("users_to_workspaces", {
  userId: integer("user_id").references(() => user.id),
  workspaceId: integer("workspace_id").references(() => workspace.id),
});

export const monitor = sqliteTable("monitor", {
  id: integer("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspace.id),
});

export const notification = sqliteTable("notification", {
  id: integer("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspace.id),
});

export const userRelations = relations(user, ({ many }) => ({
  usersToWorkspaces: many(usersToWorkspaces),
}));

export const usersToWorkspacesRelations = relations(usersToWorkspaces, ({ one }) => ({
  user: one(user, { fields: [usersToWorkspaces.userId], references: [user.id] }),
  workspace: one(workspace, {
    fields: [usersToWorkspaces.workspaceId],
    references: [workspace.id],
  }),
}));

export const workspaceRelations = relations(workspace, ({ many }) => ({
  usersToWorkspaces: many(usersToWorkspaces),
  monitors: many(monitor),
  notifications: many(notification),
}));

export const monitorRelations = relations(monitor, ({ one }) => ({
  workspace: one(workspace, { fields: [monitor.workspaceId], references: [workspace.id] }),
}));
