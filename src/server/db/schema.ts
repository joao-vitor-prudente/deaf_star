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

export const threads = createTable(
  "thread",
  {
    ...commonColumns,
    text: text("text").notNull(),
    authorId: varchar("author_id", { length: 255 })
      .notNull()
      .references(() => users.id),
  },
  (thread) => [
    foreignKey({ columns: [thread.authorId], foreignColumns: [users.id] }),
  ],
);

export const threadRelations = relations(threads, ({ one, many }) => ({
  author: one(users, { fields: [threads.authorId], references: [users.id] }),
  replies: many(threads),
}));

export const replies = createTable(
  "replies",
  {
    ...commonColumns,
    threadId: integer("thread_id")
      .notNull()
      .references(() => threads.id),
    replyId: integer("reply_id")
      .notNull()
      .references(() => threads.id),
  },
  (thread) => [
    foreignKey({ columns: [thread.threadId], foreignColumns: [threads.id] }),
    foreignKey({ columns: [thread.replyId], foreignColumns: [threads.id] }),
  ],
);

export const threadThreeRelations = relations(replies, ({ one }) => ({
  thread: one(threads, {
    fields: [replies.threadId],
    references: [threads.id],
  }),
  reply: one(threads, { fields: [replies.replyId], references: [threads.id] }),
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
  threads: many(threads),
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
