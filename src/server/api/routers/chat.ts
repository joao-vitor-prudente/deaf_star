import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  type Chat,
  chats,
  chatsUsers,
  type Message,
  messages,
  type User,
  users,
} from "~/server/db/schema";

export const createChatSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

export const updateChatSchema = z.object({
  chatId: z.number({ coerce: true }),
  name: z.string().min(1),
  description: z.string(),
});

export const getChatByIdSchema = z.object({ id: z.number({ coerce: true }) });

export const addChatUserSchema = z.object({
  chatId: z.number({ coerce: true }),
  userId: z.string(),
});

export const rmChatUserSchema = z.object({
  chatId: z.number({ coerce: true }),
  userId: z.string(),
});

export const chatRouter = createTRPCRouter({
  create: protectedProcedure.input(createChatSchema).mutation(async (req) => {
    const result = await req.ctx.db
      .insert(chats)
      .values({
        name: req.input.name,
        description: req.input.description,
        updatedAt: new Date(),
      })
      .returning({ id: chats.id });

    const chatId = result.at(0)?.id;
    if (!chatId) throw new TRPCError({ code: "BAD_REQUEST" });

    return await req.ctx.db.insert(chatsUsers).values({
      chatId,
      userId: req.ctx.session.user.id,
    });
  }),

  update: protectedProcedure.input(updateChatSchema).mutation(async (req) => {
    const chat = await req.ctx.db.query.chats.findFirst({
      with: { chatsUsers: true },
      where: (chats, { eq }) => eq(chats.id, req.input.chatId),
    });
    if (!chat) throw new TRPCError({ code: "BAD_REQUEST" });

    const userId = req.ctx.session.user.id;
    const isUserInChat = chat.chatsUsers.find((c) => c.userId === userId);
    if (!isUserInChat) throw new TRPCError({ code: "UNAUTHORIZED" });

    return await req.ctx.db
      .update(chats)
      .set({ description: req.input.description, name: req.input.name })
      .where(eq(chats.id, req.input.chatId));
  }),

  list: protectedProcedure.query(
    async (req): Promise<ChatWithLastMessage[]> => {
      const lastMessageSubquery = req.ctx.db
        .select({
          chatId: messages.chatId,
          lastMessage: sql`MAX(${messages.id})`.as("lastMessageId"),
        })
        .from(messages)
        .groupBy(messages.chatId)
        .as("lastMessageSubquery");

      const chatsResult = await req.ctx.db
        .select()
        .from(chats)
        .innerJoin(chatsUsers, eq(chats.id, chatsUsers.chatId))
        .leftJoin(lastMessageSubquery, eq(chats.id, lastMessageSubquery.chatId))
        .leftJoin(messages, eq(lastMessageSubquery.lastMessage, messages.id))
        .leftJoin(users, eq(messages.senderId, users.id))
        .where(eq(chatsUsers.userId, req.ctx.session.user.id))
        .orderBy(desc(messages.updatedAt));

      return chatsResult.map((data) => {
        if (!data.message) return data.chat;
        if (!data.user) return { ...data.chat, lastMessage: data.message };
        const lastMessage = { ...data.message, sender: data.user };
        return { ...data.chat, lastMessage };
      });
    },
  ),

  getById: protectedProcedure.input(getChatByIdSchema).query(async (req) => {
    const chat = await req.ctx.db.query.chats.findFirst({
      with: { chatsUsers: true },
      where: (chats, { eq }) => eq(chats.id, req.input.id),
    });
    if (!chat) throw new TRPCError({ code: "BAD_REQUEST" });

    const userId = req.ctx.session.user.id;
    const isUserInChat = chat.chatsUsers.find((c) => c.userId === userId);
    if (!isUserInChat) throw new TRPCError({ code: "UNAUTHORIZED" });

    return chat;
  }),

  addUser: protectedProcedure.input(addChatUserSchema).query(async (req) => {
    const chat = await req.ctx.db.query.chats.findFirst({
      with: { chatsUsers: true },
      where: (chats, { eq }) => eq(chats.id, req.input.chatId),
    });
    if (!chat) throw new TRPCError({ code: "BAD_REQUEST" });

    if (!chat.chatsUsers.find((c) => c.userId === req.ctx.session.user.id))
      throw new TRPCError({ code: "UNAUTHORIZED" });

    return await req.ctx.db.insert(chatsUsers).values({
      chatId: req.input.chatId,
      userId: req.input.userId,
    });
  }),

  removeUser: protectedProcedure.input(rmChatUserSchema).query(async (req) => {
    const chat = await req.ctx.db.query.chats.findFirst({
      with: { chatsUsers: true },
      where: (chats, { eq }) => eq(chats.id, req.input.chatId),
    });
    if (!chat) throw new TRPCError({ code: "BAD_REQUEST" });

    if (!chat.chatsUsers.find((c) => c.userId === req.ctx.session.user.id))
      throw new TRPCError({ code: "UNAUTHORIZED" });

    return await req.ctx.db
      .delete(chatsUsers)
      .where(
        and(
          eq(chatsUsers.chatId, req.input.chatId),
          eq(chatsUsers.userId, req.input.userId),
        ),
      );
  }),
});

export type ChatWithLastMessage = Chat & {
  lastMessage?: Message & { sender?: User };
};
