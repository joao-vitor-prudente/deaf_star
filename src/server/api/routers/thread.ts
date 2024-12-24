import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { threads, ThreadType } from "~/server/db/schema";
import { createTRPCRouter, protectedProc } from "../trpc";

export const createThreadSchema = z.object({ text: z.string() });
export const getThreadByIdSchema = z.object({ id: z.number({ coerce: true }) });

export const threadRouter = createTRPCRouter({
  create: protectedProc.input(createThreadSchema).mutation(async (req) => {
    await req.ctx.db.insert(threads).values({
      authorId: req.ctx.session.user.id,
      text: req.input.text,
      updatedAt: new Date(),
    });
  }),

  delete: protectedProc.input(getThreadByIdSchema).mutation(async (req) => {
    const parent = await req.ctx.db.query.replies.findFirst({
      where: (reply, { eq }) => eq(reply.replyId, req.input.id),
    });

    await req.ctx.db.transaction(async (tx) => {
      // recursively delete replies
      await tx.execute(sql`
        with recursive reply_tree as (
          select reply_id, thread_id 
          from deaf_star_replies 
          where thread_id = ${req.input.id}

          union

          select re.reply_id, re.thread_id 
          from deaf_star_replies re 
          join reply_tree rt on re.thread_id = rt.reply_id
        )

        delete from deaf_star_thread 
        where id in (select reply_id from reply_tree);
      `);

      await tx.delete(threads).where(eq(threads.id, req.input.id));

      // if is reply, decrement thread replied to reply count
      if (!parent) return;
      await tx
        .update(threads)
        .set({ replyCount: sql`${threads.replyCount} - 1` })
        .where(eq(threads.id, parent.threadId));
    });
  }),

  list: protectedProc.query(async (req) => {
    return await req.ctx.db.query.threads.findMany({
      where: (thread, { eq }) => eq(thread.type, ThreadType.root),
      with: {
        author: { with: { profileImage: true } },
        threadsLikedUsers: true,
      },
      orderBy: (thread, { desc }) => desc(thread.createdAt),
    });
  }),

  getById: protectedProc.input(getThreadByIdSchema).query(async (req) => {
    return await req.ctx.db.query.threads.findFirst({
      where: (thread, { eq }) => eq(thread.id, req.input.id),
      with: {
        author: { with: { profileImage: true } },
        threadsLikedUsers: true,
      },
    });
  }),
});
