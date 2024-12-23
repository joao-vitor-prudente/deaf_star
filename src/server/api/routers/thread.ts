import { z } from "zod";
import { threads } from "~/server/db/schema";
import { createTRPCRouter, protectedProc } from "../trpc";

export const createThreadSchema = z.object({ text: z.string() });

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
      with: { author: { with: { profileImage: true } }, postsLikedUsers: true },
      orderBy: (thread, { desc }) => desc(thread.createdAt),
    });
  }),
});
