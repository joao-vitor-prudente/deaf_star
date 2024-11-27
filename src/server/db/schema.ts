import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `deaf_star_${name}`);

const commonColumns = {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
};

export const messages = createTable(
  "message",
  {
    ...commonColumns,
    chatId: integer("chat_id")
      .notNull()
      .references(() => chats.id),
    text: text("text").notNull(),
    senderId: varchar("sender_id", { length: 255 })
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("message_chat_id_idx").on(table.chatId),
    index("message_sender_id_idx").on(table.senderId),
    foreignKey({ columns: [table.chatId], foreignColumns: [chats.id] }),
    foreignKey({ columns: [table.senderId], foreignColumns: [users.id] }),
  ],
);

export type Message = typeof messages.$inferSelect;

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, { fields: [messages.chatId], references: [chats.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const chats = createTable("chat", {
  ...commonColumns,
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

export type Chat = typeof chats.$inferSelect;

export const chatsRelations = relations(chats, ({ many }) => ({
  chatsUsers: many(chatsUsers),
  messages: many(messages),
}));

export const chatsUsers = createTable(
  "chat_user",
  {
    id: serial("id").primaryKey().notNull(),
    chatId: integer("chat_id")
      .notNull()
      .references(() => chats.id),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("chat_user_chat_id_user_id_idx").on(table.chatId, table.userId),
    foreignKey({ columns: [table.chatId], foreignColumns: [chats.id] }),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
  ],
);

export const chatsUsersRelations = relations(chatsUsers, ({ one }) => ({
  chat: one(chats, { fields: [chatsUsers.chatId], references: [chats.id] }),
  user: one(users, { fields: [chatsUsers.userId], references: [users.id] }),
}));

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export type User = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  chatsUsers: many(chatsUsers),
  messages: many(messages),
  friends: many(friendships),
}));

export const friendships = createTable(
  "friendship",
  {
    id: serial("id").primaryKey().notNull(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    friendId: varchar("friend_id", { length: 255 })
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("friendship_user_id_friend_id_idx").on(table.userId, table.friendId),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
    foreignKey({ columns: [table.friendId], foreignColumns: [users.id] }),
  ],
);

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  user: one(users, { fields: [friendships.userId], references: [users.id] }),
  friend: one(users, {
    fields: [friendships.friendId],
    references: [users.id],
  }),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
    index("account_user_id_idx").on(account.userId),
  ],
);

export type Account = typeof accounts.$inferSelect;

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => [index("session_user_id_idx").on(session.userId)],
);

export type Session = typeof sessions.$inferSelect;

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (verificationTokens) => [
    primaryKey({
      columns: [verificationTokens.identifier, verificationTokens.token],
    }),
  ],
);

export type VerificationToken = typeof verificationTokens.$inferSelect;
