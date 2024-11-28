import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProc } from "~/server/api/trpc";
import { friendships } from "~/server/db/schema";

export const addFriendSchema = z.object({ friendId: z.string() });

export const removeFriendSchema = z.object({ friendId: z.string() });

export const friendRouter = createTRPCRouter({
  list: protectedProc.query(async (req) => {
    const result = await req.ctx.db.query.friendships.findMany({
      with: { friend: true },
      where: eq(friendships.userId, req.ctx.session.user.id),
    });

    return result.map((friendship) => friendship.friend);
  }),

  add: protectedProc.input(addFriendSchema).mutation(async (req) => {
    return await req.ctx.db.insert(friendships).values({
      userId: req.ctx.session.user.id,
      friendId: req.input.friendId,
    });
  }),

  remove: protectedProc.input(removeFriendSchema).mutation(async (req) => {
    return await req.ctx.db
      .delete(friendships)
      .where(
        and(
          eq(friendships.userId, req.ctx.session.user.id),
          eq(friendships.friendId, req.input.friendId),
        ),
      );
  }),
});
