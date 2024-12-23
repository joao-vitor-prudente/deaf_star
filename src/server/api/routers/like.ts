import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProc } from "~/server/api/trpc";
import { type Transaction } from "~/server/db";
import { postsLikedUsers, threads } from "~/server/db/schema";

export const toggleLikeSchema = z.object({
  threadId: z.number({ coerce: true }),
});

export const likeRouter = createTRPCRouter({
  toggle: protectedProc.input(toggleLikeSchema).mutation(async (req) => {
    const liked = await req.ctx.db.query.postsLikedUsers.findFirst({
      where: and(
        eq(postsLikedUsers.postId, req.input.threadId),
        eq(postsLikedUsers.userId, req.ctx.session.user.id),
      ),
    });
    await req.ctx.db.transaction(async (tx) => {
      if (liked) await removeLike(tx, req.input.threadId);
      else await addLike(tx, req.input.threadId, req.ctx.session.user.id);
    });
  }),
});

async function removeLike(tx: Transaction, threadId: number): Promise<void> {
  await tx.delete(postsLikedUsers).where(eq(postsLikedUsers.postId, threadId));
  await tx
    .update(threads)
    .set({ likes: sql`${threads.likes} - 1` })
    .where(eq(threads.id, threadId));
}

async function addLike(
  tx: Transaction,
  threadId: number,
  userId: string,
): Promise<void> {
  await tx.insert(postsLikedUsers).values({
    postId: threadId,
    userId: userId,
    updatedAt: new Date(),
  });
  await tx
    .update(threads)
    .set({ likes: sql`${threads.likes} + 1` })
    .where(eq(threads.id, threadId));
}
