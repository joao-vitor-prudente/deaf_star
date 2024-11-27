import { and, eq, ilike, not, notInArray, or } from "drizzle-orm";
import { z } from "zod";
import { friendships, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const listUsersSchema = z.object({
  searchString: z.string().optional(),
});

export const userRouter = createTRPCRouter({
  list: protectedProcedure.input(listUsersSchema).query(async (req) => {
    const friends = await req.ctx.db
      .select({ friendId: friendships.friendId })
      .from(friendships)
      .where(eq(friendships.userId, req.ctx.session.user.id));

    const friendIds = friends.map((friend) => friend.friendId);

    const nonFriends = await req.ctx.db
      .select()
      .from(users)
      .where(
        and(
          notInArray(users.id, friendIds),
          not(eq(users.id, req.ctx.session.user.id)),
          req.input.searchString
            ? or(
                ilike(users.name, `%${req.input.searchString}%`),
                ilike(users.email, `%${req.input.searchString}%`),
              )
            : undefined,
        ),
      );

    return nonFriends;
  }),
});
