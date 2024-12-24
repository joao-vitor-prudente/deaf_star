import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { replies, threads, ThreadType } from "~/server/db/schema";
import { createTRPCRouter, protectedProc } from "../trpc";

export const createReplySchema = z.object({
  threadId: z.number({ coerce: true }),
  text: z.string(),
});
export const listRepliesSchema = z.object({
  threadId: z.number({ coerce: true }),
});

export const replyRouter = createTRPCRouter({
  create: protectedProc.input(createReplySchema).mutation(async (req) => {
    await req.ctx.db.transaction(async (tx) => {
      const insert = tx.insert(threads).values({
        authorId: req.ctx.session.user.id,
        text: req.input.text,
        updatedAt: new Date(),
        type: ThreadType.reply,
      });
      const [reply] = await insert.returning();
      if (!reply) throw new Error();

      await tx.insert(replies).values({
        threadId: req.input.threadId,
        replyId: reply.id,
        updatedAt: new Date(),
      });

      await tx
        .update(threads)
        .set({ replyCount: sql`${threads.replyCount} + 1` })
        .where(eq(threads.id, req.input.threadId));
    });
  }),

  list: protectedProc.input(listRepliesSchema).query(async (req) => {
    return await req.ctx.db.query.replies.findMany({
      where: (reply, { eq }) => eq(reply.threadId, req.input.threadId),
      with: {
        reply: {
          with: {
            author: { with: { profileImage: true } },
            threadsLikedUsers: true,
          },
        },
      },
    });
  }),
});
