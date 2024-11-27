import { initTRPC, TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { env } from "~/env";

import { auth } from "~/server/auth";
import { db } from "~/server/db";

export type TRPCContext = {
  headers: Headers;
  db: typeof db;
  session: Session | null;
};

export const createTRPCContext = async (opts: {
  headers: Headers;
}): Promise<TRPCContext> => {
  const session = await auth();

  return { db, session, ...opts };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const zodError =
      error.cause instanceof ZodError ? error.cause.flatten() : null;
    return { ...shape, data: { ...shape.data, zodError } };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev && env.DELAY_REQUESTS) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${(end - start).toString()}ms to execute`);

  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    return next({
      ctx: { session: { ...ctx.session, user: ctx.session.user } },
    });
  });
