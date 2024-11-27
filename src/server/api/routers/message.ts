import { desc } from "drizzle-orm";
import { type User } from "next-auth";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type Message, messages } from "~/server/db/schema";

export const listMsgSchema = z.object({ chatId: z.number() });

export const createMsgSchema = z.object({
  chatId: z.number({ coerce: true }),
  text: z.string().min(1),
});

export const messageRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listMsgSchema)
    .query(async (req): Promise<MessageWithSender[]> => {
      return await req.ctx.db.query.messages.findMany({
        with: { sender: true },
        where: (messages, { eq }) => eq(messages.chatId, req.input.chatId),
        orderBy: [desc(messages.id)],
      });
    }),

  create: protectedProcedure.input(createMsgSchema).mutation(async (req) => {
    return await req.ctx.db.insert(messages).values({
      chatId: req.input.chatId,
      text: req.input.text,
      senderId: req.ctx.session.user.id,
      updatedAt: new Date(),
    });
  }),
});

export type MessageWithSender = Message & { sender: User };
