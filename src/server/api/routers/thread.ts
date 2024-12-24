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
