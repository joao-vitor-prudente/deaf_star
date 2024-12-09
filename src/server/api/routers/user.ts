import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "~/server/db/schema";
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
    return await req.ctx.db.query.users.findMany({
      where: (users, { ilike, and, or, ne }) => {
        const searchStringQuery = or(
          ilike(users.email, `%${req.input.searchString}%`),
          ilike(users.name, `%${req.input.searchString}%`),
        );

        return and(
          req.input.searchString ? searchStringQuery : undefined,
          ne(users.id, req.ctx.session.user.id),
        );
      },
    });
  }),

  getById: userProtectedProc.input(getUserByIdSchema).query(async (req) => {
    const user = await req.ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, req.input.userId),
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
