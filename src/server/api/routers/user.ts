import { TRPCError } from "@trpc/server";
import { and, eq, ilike, not, notInArray, or } from "drizzle-orm";
import { z } from "zod";
import { friendships, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProc, userProtectedProc } from "../trpc";

export const listUsersSchema = z.object({
  searchString: z.string().optional(),
});

export const getUserByIdSchema = z.object({ userId: z.string() });

export const updateUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
});

export const userRouter = createTRPCRouter({
  list: protectedProc.input(listUsersSchema).query(async (req) => {
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

  getById: userProtectedProc.input(getUserByIdSchema).query(async (req) => {
    const user = await req.ctx.db.query.users.findFirst({
      where: eq(users.id, req.input.userId),
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user;
  }),

  delete: userProtectedProc.input(getUserByIdSchema).mutation(async (req) => {
    return await req.ctx.db.delete(users).where(eq(users.id, req.input.userId));
  }),

  update: userProtectedProc.input(updateUserSchema).mutation(async (req) => {
    if (req.ctx.session.user.id !== req.input.userId)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    return await req.ctx.db
      .update(users)
      .set({ name: req.input.name })
      .where(eq(users.id, req.input.userId));
  }),
});
